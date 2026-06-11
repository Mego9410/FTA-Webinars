import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

const TYPE_MAP: Record<string, string> = {
  "email.delivered": "delivered",
  "email.opened": "opened",
  "email.clicked": "clicked",
  "email.bounced": "bounced",
  "email.complained": "bounced",
};

function verifySvixSignature(
  payload: string,
  secret: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
): boolean {
  const signed = `${svixId}.${svixTimestamp}.${payload}`;
  const key = secret.startsWith("whsec_") ? Buffer.from(secret.slice(6), "base64") : Buffer.from(secret);
  const expected = createHmac("sha256", key).update(signed).digest("base64");

  for (const part of svixSignature.split(" ")) {
    const [, sig] = part.split(",");
    if (!sig) continue;
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      if (a.length === b.length && timingSafeEqual(a, b)) return true;
    } catch {
      continue;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const svixId = request.headers.get("svix-id") ?? "";
  const svixTimestamp = request.headers.get("svix-timestamp") ?? "";
  const svixSignature = request.headers.get("svix-signature") ?? "";

  if (
    !svixId ||
    !verifySvixSignature(rawBody, secret, svixId, svixTimestamp, svixSignature)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    type?: string;
    data?: {
      to?: string[];
      email?: string;
      tags?: Record<string, string>;
    };
  };

  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mapped = TYPE_MAP[payload.type ?? ""];
  if (!mapped) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const email =
    payload.data?.to?.[0] ?? payload.data?.email ?? null;
  const sessionId = payload.data?.tags?.session_id ?? null;

  const supabase = createServiceClient();
  const { error } = await supabase.from("email_events").insert({
    email,
    session_id: sessionId,
    type: mapped,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
