import "server-only";

import { createServiceClient } from "@/lib/supabase/server";

export type DateRange = {
  from: string;
  to: string;
};

export type DashboardSummary = {
  totalUsers: number;
  signupsInPeriod: number;
  avgAttendanceRate: number;
  lastSessionPeakConcurrent: number;
};

export type SessionMetrics = {
  id: string;
  topic: string;
  start_time: string;
  registrants: number;
  attendees: number;
  attendanceRate: number;
  avgWatchSec: number;
  peakConcurrent: number;
  ctaRate: number;
};

export type RetentionPoint = {
  minute: number;
  viewers: number;
};

export type JoinBucket = {
  bucket: string;
  count: number;
};

export type EmailFunnel = {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
};

function pct(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export async function getDashboardSummary(
  range: DateRange,
): Promise<DashboardSummary> {
  const supabase = createServiceClient();

  const [{ count: totalUsers }, { count: signupsInPeriod }, sessions] =
    await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("type", "signup")
        .gte("created_at", range.from)
        .lte("created_at", range.to),
      getSessionMetricsList(range),
    ]);

  const rates = sessions
    .map((s) => s.attendanceRate)
    .filter((r) => r > 0);
  const avgAttendanceRate =
    rates.length > 0
      ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10
      : 0;

  const lastSession = sessions[0];
  const lastSessionPeakConcurrent = lastSession?.peakConcurrent ?? 0;

  return {
    totalUsers: totalUsers ?? 0,
    signupsInPeriod: signupsInPeriod ?? 0,
    avgAttendanceRate,
    lastSessionPeakConcurrent,
  };
}

export async function getSessionMetricsList(
  range: DateRange,
): Promise<SessionMetrics[]> {
  const supabase = createServiceClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, topic, start_time")
    .gte("start_time", range.from)
    .lte("start_time", range.to)
    .order("start_time", { ascending: false });

  if (!sessions?.length) return [];

  const metrics: SessionMetrics[] = [];

  for (const session of sessions) {
    const m = await getSessionMetrics(session.id, session.topic, session.start_time);
    metrics.push(m);
  }

  return metrics;
}

export async function getSessionMetrics(
  sessionId: string,
  topic?: string,
  startTime?: string,
): Promise<SessionMetrics> {
  const supabase = createServiceClient();

  let sessionTopic = topic ?? "Session";
  let sessionStart = startTime ?? new Date().toISOString();

  if (!topic || !startTime) {
    const { data } = await supabase
      .from("sessions")
      .select("topic, start_time")
      .eq("id", sessionId)
      .single();
    if (data?.topic) sessionTopic = data.topic;
    if (data?.start_time) sessionStart = data.start_time;
  }

  const { data: events } = await supabase
    .from("events")
    .select("type, user_id, offset_sec, created_at")
    .eq("session_id", sessionId);

  const rows = events ?? [];

  const { count: registrants } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .lte("created_at", sessionStart);

  const attendeeIds = new Set(
    rows.filter((e) => e.type === "join" && e.user_id).map((e) => e.user_id as string),
  );

  const ctaIds = new Set(
    rows.filter((e) => e.type === "cta_click" && e.user_id).map((e) => e.user_id as string),
  );

  const watchByUser = new Map<string, { join: number; last: number }>();
  for (const row of rows) {
    if (!row.user_id || row.offset_sec == null) continue;
    if (row.type !== "join" && row.type !== "heartbeat") continue;
    const current = watchByUser.get(row.user_id) ?? {
      join: row.type === "join" ? row.offset_sec : row.offset_sec,
      last: row.offset_sec,
    };
    if (row.type === "join") current.join = row.offset_sec;
    current.last = Math.max(current.last, row.offset_sec);
    watchByUser.set(row.user_id, current);
  }

  const watchTimes = [...watchByUser.values()]
    .map((w) => Math.max(0, w.last - w.join))
    .filter((v) => v > 0);
  const avgWatchSec = watchTimes.length
    ? Math.round(watchTimes.reduce((a, b) => a + b, 0) / watchTimes.length)
    : 0;

  const { data: concurrency } = await supabase
    .from("session_concurrency")
    .select("minute, viewers")
    .eq("session_id", sessionId)
    .order("minute", { ascending: true });

  const peakConcurrent = (concurrency ?? []).reduce(
    (max, row) => Math.max(max, row.viewers as number),
    0,
  );

  const attendees = attendeeIds.size;
  const regCount = registrants ?? 0;

  return {
    id: sessionId,
    topic: sessionTopic,
    start_time: sessionStart,
    registrants: regCount,
    attendees,
    attendanceRate: pct(attendees, regCount),
    avgWatchSec,
    peakConcurrent,
    ctaRate: pct(ctaIds.size, attendees),
  };
}

export async function getRetentionCurve(sessionId: string): Promise<RetentionPoint[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("session_concurrency")
    .select("minute, viewers")
    .eq("session_id", sessionId)
    .order("minute", { ascending: true });

  return (data ?? []).map((row) => ({
    minute: row.minute as number,
    viewers: row.viewers as number,
  }));
}

export async function getJoinHistogram(sessionId: string): Promise<JoinBucket[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("events")
    .select("offset_sec")
    .eq("session_id", sessionId)
    .eq("type", "join");

  const buckets = new Map<string, number>();
  for (const row of data ?? []) {
    if (row.offset_sec == null) continue;
    const min = Math.floor((row.offset_sec as number) / 300) * 5;
    const label = `${min}–${min + 5}m`;
    buckets.set(label, (buckets.get(label) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([bucket, count]) => ({ bucket, count }));
}

export async function getEmailFunnel(sessionId: string): Promise<EmailFunnel> {
  const supabase = createServiceClient();

  const [{ count: sent }, { data: emailEvents }] = await Promise.all([
    supabase
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId),
    supabase.from("email_events").select("type").eq("session_id", sessionId),
  ]);

  const counts = { delivered: 0, opened: 0, clicked: 0 };
  for (const row of emailEvents ?? []) {
    const t = row.type as keyof typeof counts;
    if (t in counts) counts[t] += 1;
  }

  return {
    sent: sent ?? 0,
    delivered: counts.delivered,
    opened: counts.opened,
    clicked: counts.clicked,
  };
}
