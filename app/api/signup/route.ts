import { NextResponse } from "next/server";
import {
  signCookieValue,
  USER_COOKIE,
  userCookieOptions,
} from "@/lib/cookies";
import { sendWelcomeEmail } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase/server";

type SignupBody = {
  name?: string;
  email?: string;
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Please enter your full name" },
      { status: 400 },
    );
  }

  if (!email || !validateEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data: user, error } = await supabase
    .from("users")
    .upsert({ name, email }, { onConflict: "email" })
    .select("id, name, email, welcomed")
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 },
    );
  }

  await supabase.from("events").insert({
    type: "signup",
    user_id: user.id,
  });

  if (!user.welcomed) {
    const welcome = await sendWelcomeEmail({
      to: user.email,
      name: user.name,
      userId: user.id,
    });

    if (welcome.ok) {
      const { error: welcomeUpdateError } = await supabase
        .from("users")
        .update({ welcomed: true })
        .eq("id", user.id);

      if (!welcomeUpdateError) {
        await supabase.from("email_log").insert({
          user_id: user.id,
          session_id: null,
          type: "welcome",
        });
      }
    }
  }

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });

  response.cookies.set(
    USER_COOKIE,
    signCookieValue(user.id),
    userCookieOptions,
  );

  return response;
}
