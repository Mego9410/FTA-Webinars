import { createClient } from "@supabase/supabase-js";

export type WebinarSession = {
  id: string;
  topic: string;
  description: string | null;
  host_name: string;
  start_time: string;
  duration_seconds: number;
  mux_playback_id: string | null;
  cta_label: string | null;
  cta_url: string | null;
};

const SESSION_FIELDS =
  "id, topic, description, host_name, start_time, duration_seconds, mux_playback_id, cta_label, cta_url";

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function getNextUpcomingSession(
  nowMs = Date.now(),
): Promise<WebinarSession | null> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("sessions")
    .select(SESSION_FIELDS)
    .gte("start_time", new Date(nowMs).toISOString())
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data;
}

export async function getActiveSession(
  nowMs = Date.now(),
): Promise<WebinarSession | null> {
  const supabase = createAnonClient();
  const { data: candidates } = await supabase
    .from("sessions")
    .select(SESSION_FIELDS)
    .lte("start_time", new Date(nowMs).toISOString())
    .order("start_time", { ascending: false })
    .limit(10);

  if (!candidates?.length) return null;

  for (const session of candidates) {
    const startMs = new Date(session.start_time).getTime();
    const endMs = startMs + session.duration_seconds * 1000;
    if (nowMs >= startMs && nowMs < endMs) {
      return session;
    }
  }

  return null;
}

export async function getLatestSession(): Promise<WebinarSession | null> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("sessions")
    .select(SESSION_FIELDS)
    .order("start_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

/** Next upcoming session for the landing page hero. */
export async function getNextSession(): Promise<WebinarSession | null> {
  const upcoming = await getNextUpcomingSession();
  if (upcoming) return upcoming;
  return getLatestSession();
}

export type WebinarPageData = {
  session: WebinarSession;
  nextSession: WebinarSession | null;
};

export async function getWebinarPageData(
  nowMs = Date.now(),
): Promise<WebinarPageData | null> {
  const [active, upcoming, latest] = await Promise.all([
    getActiveSession(nowMs),
    getNextUpcomingSession(nowMs),
    getLatestSession(),
  ]);

  const session = active ?? upcoming ?? latest;
  if (!session) return null;

  let nextSession = upcoming;
  if (nextSession?.id === session.id) {
    nextSession = null;
  }

  return { session, nextSession };
}
