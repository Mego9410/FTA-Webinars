import "server-only";

import { sendReminderEmail, type ReminderType } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase/server";

type SessionRow = {
  id: string;
  topic: string;
  host_name: string;
  start_time: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
};

export type ReminderCronResult = {
  ok: boolean;
  sent: Array<{ sessionId: string; type: ReminderType; userId: string }>;
  skipped: number;
  errors: string[];
};

const ONE_MINUTE_MS = 60_000;

function reminderTypeForSession(
  session: SessionRow,
  nowMs: number,
): ReminderType | null {
  const startMs = new Date(session.start_time).getTime();
  const untilStartMs = startMs - nowMs;
  const sinceStartMs = nowMs - startMs;

  if (untilStartMs >= 59 * ONE_MINUTE_MS && untilStartMs <= 61 * ONE_MINUTE_MS) {
    return "1h";
  }

  if (untilStartMs >= 14 * ONE_MINUTE_MS && untilStartMs <= 16 * ONE_MINUTE_MS) {
    return "15m";
  }

  if (sinceStartMs >= 0 && sinceStartMs <= ONE_MINUTE_MS) {
    return "live";
  }

  return null;
}

export async function runReminderCron(nowMs = Date.now()): Promise<ReminderCronResult> {
  const supabase = createServiceClient();
  const sent: ReminderCronResult["sent"] = [];
  const errors: string[] = [];
  let skipped = 0;

  const windowStart = new Date(nowMs - ONE_MINUTE_MS).toISOString();
  const windowEnd = new Date(nowMs + 61 * ONE_MINUTE_MS).toISOString();

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("id, topic, host_name, start_time")
    .gte("start_time", windowStart)
    .lte("start_time", windowEnd);

  if (sessionsError) {
    return { ok: false, sent, skipped, errors: [sessionsError.message] };
  }

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("subscribed", true);

  if (usersError) {
    return { ok: false, sent, skipped, errors: [usersError.message] };
  }

  const subscribedUsers = (users ?? []) as UserRow[];
  if (!sessions?.length || !subscribedUsers.length) {
    return { ok: true, sent, skipped, errors };
  }

  for (const session of sessions as SessionRow[]) {
    const type = reminderTypeForSession(session, nowMs);
    if (!type) continue;

    const { data: existingLogs } = await supabase
      .from("email_log")
      .select("user_id")
      .eq("session_id", session.id)
      .eq("type", type);

    const alreadySent = new Set(
      (existingLogs ?? []).map((row) => row.user_id as string),
    );

    for (const user of subscribedUsers) {
      if (alreadySent.has(user.id)) {
        skipped += 1;
        continue;
      }

      const result = await sendReminderEmail({
        to: user.email,
        name: user.name,
        userId: user.id,
        sessionTopic: session.topic,
        sessionStartTime: session.start_time,
        hostName: session.host_name,
        type,
      });

      if (!result.ok) {
        errors.push(`${session.id}/${type}/${user.id}: ${result.error}`);
        continue;
      }

      const { error: logError } = await supabase.from("email_log").insert({
        user_id: user.id,
        session_id: session.id,
        type,
      });

      if (logError) {
        errors.push(`${session.id}/${type}/${user.id}: log failed — ${logError.message}`);
        continue;
      }

      alreadySent.add(user.id);
      sent.push({ sessionId: session.id, type, userId: user.id });
    }
  }

  return { ok: errors.length === 0, sent, skipped, errors };
}
