import { NextRequest, NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email";
import { runReminderCron } from "@/lib/reminders";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 503 },
    );
  }

  const result = await runReminderCron();

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
