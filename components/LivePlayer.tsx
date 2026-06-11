"use client";

import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import type { MuxPlayerCSSProperties } from "@mux/mux-player-react";
import { Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlaceholderPlayer } from "@/components/PlaceholderPlayer";
import { Pill } from "@/components/fta/Pill";
import { Button, ButtonLink } from "@/components/ui/button";
import { useServerClock } from "@/hooks/useServerClock";
import { isDemoSessionId } from "@/lib/demo-session";
import type { WebinarSession } from "@/lib/sessions";
import { getState } from "@/lib/time";
import { track } from "@/lib/track";

const playerStyle = {
  aspectRatio: "16/9",
  width: "100%",
  maxWidth: "960px",
  borderRadius: "var(--radius-card)",
  overflow: "hidden",
  "--seek-backward-button": "none",
  "--seek-forward-button": "none",
  "--time-range": "none",
  "--rendition-menu-button": "none",
  "--pip-button": "none",
  "--cast-button": "none",
  "--playback-rate-button": "none",
} as MuxPlayerCSSProperties;

type LivePlayerProps = {
  session: WebinarSession;
  serverNowMs: number;
};

function SessionCta({ session }: { session: WebinarSession }) {
  if (!session.cta_label || !session.cta_url) return null;

  return (
    <div className="mt-6 flex justify-center">
      <ButtonLink
        href={session.cta_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => void track("cta_click", { session_id: session.id })}
        size="lg"
      >
        {session.cta_label}
      </ButtonLink>
    </div>
  );
}

export function LivePlayer({ session, serverNowMs }: LivePlayerProps) {
  const playerRef = useRef<MuxPlayerElement | null>(null);
  const now = useServerClock(serverNowMs);
  const [token, setToken] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [, setTick] = useState(0);
  const joinedRef = useRef(false);

  const startMs = new Date(session.start_time).getTime();

  const getLiveOffset = useCallback(() => {
    return getState(now(), startMs, session.duration_seconds).offsetSec;
  }, [now, startMs, session.duration_seconds]);

  const usePlaceholder =
    !session.mux_playback_id || isDemoSessionId(session.id);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (usePlaceholder) return;

    let cancelled = false;

    async function loadToken() {
      setLoadError(null);
      setToken(null);

      try {
        const res = await fetch(`/api/mux-token?sessionId=${session.id}`);
        const data = (await res.json()) as { token?: string; error?: string };

        if (cancelled) return;

        if (!res.ok || !data.token) {
          setLoadError(data.error ?? "Could not load playback token");
          return;
        }

        setToken(data.token);
      } catch {
        if (!cancelled) {
          setLoadError("Network error loading playback");
        }
      }
    }

    void loadToken();
    return () => {
      cancelled = true;
    };
  }, [session.id, usePlaceholder]);

  useEffect(() => {
    if (!playing || usePlaceholder) return;
    const id = window.setInterval(() => {
      void track("heartbeat", {
        session_id: session.id,
        offset_sec: getLiveOffset(),
      });
    }, 20_000);
    return () => window.clearInterval(id);
  }, [playing, session.id, getLiveOffset, usePlaceholder]);

  useEffect(() => {
    const onLeave = () => {
      if (!joinedRef.current) return;
      void track("leave", {
        session_id: session.id,
        offset_sec: getLiveOffset(),
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onLeave();
    };

    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      onLeave();
    };
  }, [session.id, getLiveOffset]);

  const recordJoin = useCallback(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;
    void track("join", {
      session_id: session.id,
      offset_sec: getLiveOffset(),
    });
  }, [session.id, getLiveOffset]);

  const snapToLive = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const expected = getLiveOffset();
    if (Math.abs(player.currentTime - expected) > 0.75) {
      player.currentTime = expected;
    }
  }, [getLiveOffset]);

  const attemptAutoplay = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      await player.play();
      setNeedsGesture(false);
      setPlaying(true);
      recordJoin();
    } catch {
      setNeedsGesture(true);
    }
  }, [recordJoin]);

  const onJoinClick = async () => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = getLiveOffset();
    try {
      await player.play();
      setNeedsGesture(false);
      setPlaying(true);
      recordJoin();
    } catch {
      setLoadError("Could not start playback. Please try again.");
    }
  };

  const offsetSec = getLiveOffset();

  if (usePlaceholder || loadError) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <PlaceholderPlayer topic={session.topic} offsetSec={offsetSec} />
        <SessionCta session={session} />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="fta-container mx-auto flex max-w-4xl aspect-video items-center justify-center rounded-card bg-fta-ink text-white/80">
        Loading live stream…
      </div>
    );
  }

  return (
    <div className="fta-container mx-auto w-full max-w-4xl space-y-5">
      <div className="space-y-2 text-center md:text-left">
        <Pill tone="live" pulse>
          Live now
        </Pill>
        <h2 className="font-display text-2xl font-bold text-fta-ink">{session.topic}</h2>
        <p className="text-sm text-fta-muted">Hosted by {session.host_name}</p>
      </div>

      <div className="fta-player-frame relative" onContextMenu={(e) => e.preventDefault()}>
        <MuxPlayer
          ref={playerRef}
          playbackId={session.mux_playback_id!}
          tokens={{ playback: token }}
          autoPlay
          startTime={offsetSec}
          streamType="on-demand"
          style={playerStyle}
          onLoadedData={() => void attemptAutoplay()}
          onPlay={() => {
            setPlaying(true);
            recordJoin();
          }}
          onPause={() => {
            const player = playerRef.current;
            if (player && playing) {
              void player.play();
            }
          }}
          onSeeking={snapToLive}
          onSeeked={snapToLive}
          onTimeUpdate={snapToLive}
        />

        {needsGesture ? (
          <div className="fta-play-overlay">
            <p className="font-display text-xl font-bold">Join the live session</p>
            <p className="max-w-xs text-sm text-white/82">
              Tap below to start at the current live position (
              {Math.floor(offsetSec / 60)}:
              {String(Math.floor(offsetSec % 60)).padStart(2, "0")} in).
            </p>
            <button
              type="button"
              className="fta-play-button"
              onClick={() => void onJoinClick()}
              aria-label="Join the live session"
            >
              <Play className="size-8 fill-fta-ink text-fta-ink" />
            </button>
            <Button type="button" size="lg" onClick={() => void onJoinClick()}>
              Join the live session
            </Button>
          </div>
        ) : null}
      </div>

      <SessionCta session={session} />
    </div>
  );
}
