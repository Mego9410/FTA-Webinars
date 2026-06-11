"use client";

import { useEffect, useState } from "react";
import { Pill } from "@/components/fta/Pill";
import { useServerClock } from "@/hooks/useServerClock";
import { formatCountdown } from "@/lib/time";
import { cn } from "@/lib/utils";

type CountdownProps = {
  targetMs: number;
  serverNowMs: number;
  className?: string;
  label?: string;
  variant?: "default" | "hero" | "dark";
};

const UNITS = ["days", "hours", "mins", "secs"] as const;

function parseCountdown(display: string) {
  const [dd, hh, mm, ss] = display.split(":");
  return [
    { value: dd, label: UNITS[0] },
    { value: hh, label: UNITS[1] },
    { value: mm, label: UNITS[2] },
    { value: ss, label: UNITS[3] },
  ];
}

export function Countdown({
  targetMs,
  serverNowMs,
  className,
  label = "Starts in",
  variant = "default",
}: CountdownProps) {
  const now = useServerClock(serverNowMs);
  const [display, setDisplay] = useState(() =>
    formatCountdown(targetMs - now()),
  );
  const [prevSeconds, setPrevSeconds] = useState("");

  useEffect(() => {
    const tick = () => {
      const next = formatCountdown(targetMs - now());
      setDisplay((prev) => {
        const prevSec = prev.split(":")[3];
        const nextSec = next.split(":")[3];
        if (prevSec !== nextSec) setPrevSeconds(nextSec);
        return next;
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs, now]);

  const started = display === "00:00:00:00";
  const tiles = parseCountdown(display);
  const isDark = variant === "hero" || variant === "dark";

  if (started) {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <Pill tone="live" pulse>
          Starting now
        </Pill>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} aria-live="polite" aria-atomic="true">
      <p
        className={cn(
          "text-center text-[13px] font-semibold tracking-[0.12em] uppercase",
          isDark ? "text-white/85" : "text-fta-muted",
        )}
      >
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {tiles.map((tile, index) => (
          <div key={tile.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex min-w-[4.25rem] items-center justify-center rounded-card px-3 py-3 tabular-nums",
                  isDark
                    ? "border border-white/15 bg-white/10 text-white backdrop-blur-sm"
                    : "border border-fta-border bg-fta-bg text-fta-ink shadow-card",
                )}
              >
                <span
                  className={cn(
                    "text-2xl font-bold tracking-tight sm:text-3xl",
                    tile.label === "secs" &&
                      tile.value !== prevSeconds &&
                      "animate-[fta-digit-flip_0.35s_ease-out]",
                  )}
                >
                  {tile.value}
                </span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-[0.1em] uppercase",
                  isDark ? "text-white/60" : "text-fta-muted",
                )}
              >
                {tile.label}
              </span>
            </div>
            {index < tiles.length - 1 ? (
              <span
                className={cn(
                  "mb-5 text-xl font-light",
                  isDark ? "text-white/35" : "text-fta-border",
                )}
                aria-hidden
              >
                ·
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
