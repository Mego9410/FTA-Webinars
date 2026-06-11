import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE, verifyCookieValue } from "@/lib/cookies";
import { createServiceClient } from "@/lib/supabase/server";

const VALID_TYPES = new Set([
  "page_view",
  "signup",
  "join",
  "heartbeat",
  "cta_click",
  "leave",
]);

const HEARTBEAT_THROTTLE_SEC = 15;

export async function POST(request: NextRequest) {
  let body: {
    type?: string;
    session_id?: string;
    page?: string;
    offset_sec?: number;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const type = body.type;
  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const rawCookie = request.cookies.get(USER_COOKIE)?.value;
  const userId = rawCookie ? verifyCookieValue(rawCookie) : null;

  const supabase = createServiceClient();

  if (type === "heartbeat" && userId && body.session_id) {
    const since = new Date(Date.now() - HEARTBEAT_THROTTLE_SEC * 1000).toISOString();
    const { data: recent } = await supabase
      .from("events")
      .select("id")
      .eq("user_id", userId)
      .eq("session_id", body.session_id)
      .eq("type", "heartbeat")
      .gte("created_at", since)
      .limit(1)
      .maybeSingle();

    if (recent) {
      return NextResponse.json({ ok: true, throttled: true });
    }
  }

  const { error } = await supabase.from("events").insert({
    type,
    user_id: userId,
    session_id: body.session_id ?? null,
    page: body.page ?? null,
    offset_sec:
      typeof body.offset_sec === "number" ? Math.floor(body.offset_sec) : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
