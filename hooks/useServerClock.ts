"use client";

import { useCallback, useEffect, useRef } from "react";

export function useServerClock(serverNowMs: number) {
  const baseRef = useRef({ serverNowMs, perf: performance.now() });

  const resync = useCallback(async () => {
    try {
      const res = await fetch("/api/now");
      if (!res.ok) return;
      const { now } = (await res.json()) as { now: number };
      baseRef.current = { serverNowMs: now, perf: performance.now() };
    } catch {
      // Keep ticking from last known anchor if resync fails.
    }
  }, []);

  useEffect(() => {
    baseRef.current = { serverNowMs, perf: performance.now() };
  }, [serverNowMs]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void resync();
      }
    };

    window.addEventListener("focus", resync);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", resync);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [resync]);

  return useCallback(() => {
    const elapsed = performance.now() - baseRef.current.perf;
    return baseRef.current.serverNowMs + elapsed;
  }, []);
}
