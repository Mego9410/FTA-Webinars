"use client";

import { useEffect, useState } from "react";
import { MissedState } from "@/components/MissedState";
import { LivePlayer } from "@/components/LivePlayer";
import { WaitingRoom } from "@/components/WaitingRoom";
import { useServerClock } from "@/hooks/useServerClock";
import type { WebinarSession } from "@/lib/sessions";
import { getState } from "@/lib/time";

type WebinarStageProps = {
  session: WebinarSession;
  nextSession: WebinarSession | null;
  serverNowMs: number;
};

export function WebinarStage({
  session,
  nextSession,
  serverNowMs,
}: WebinarStageProps) {
  const now = useServerClock(serverNowMs);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const startMs = new Date(session.start_time).getTime();
  const { state } = getState(now(), startMs, session.duration_seconds);

  if (state === "before") {
    return <WaitingRoom session={session} serverNowMs={serverNowMs} />;
  }

  if (state === "during") {
    return <LivePlayer session={session} serverNowMs={serverNowMs} />;
  }

  return (
    <MissedState
      nextSession={nextSession}
      serverNowMs={serverNowMs}
    />
  );
}
