import type { WebinarPageData, WebinarSession } from "@/lib/sessions";

export const DEMO_SESSION_ID = "00000000-0000-4000-8000-000000000001";

export function createDemoSession(nowMs = Date.now()): WebinarSession {
  return {
    id: DEMO_SESSION_ID,
    topic: "Selling your practice with confidence",
    description:
      "A practical overview for dental principals considering a sale — confidential, seller-first advice from Frank Taylor & Associates.",
    host_name: "Frank Taylor",
    start_time: new Date(nowMs - 3 * 60 * 1000).toISOString(),
    duration_seconds: 3600,
    mux_playback_id: null,
    cta_label: "Download our Exit Readiness Planner",
    cta_url: "https://www.franktaylorandassociates.co.uk",
  };
}

export function getDemoWebinarPageData(nowMs = Date.now()): WebinarPageData {
  const upcomingStart = new Date(nowMs + 7 * 24 * 60 * 60 * 1000).toISOString();
  return {
    session: createDemoSession(nowMs),
    nextSession: {
      ...createDemoSession(nowMs),
      id: "00000000-0000-4000-8000-000000000002",
      topic: "Understanding practice valuations in 2026",
      start_time: upcomingStart,
    },
  };
}

export function isDemoSessionId(id: string): boolean {
  return id === DEMO_SESSION_ID || id.startsWith("00000000-0000-4000-8000-");
}
