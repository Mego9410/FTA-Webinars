"use client";

import { useEffect, useState } from "react";
import { useServerClock } from "@/hooks/useServerClock";
import { formatCountdown } from "@/lib/time";
import { cn } from "@/lib/utils";

type CountdownProps = {
  targetMs: number;
  serverNowMs: number;
  className?: string;
  label?: string;
  variant?: "default" | "hero";
};

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

  useEffect(() => {
    const tick = () => setDisplay(formatCountdown(targetMs - now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs, now]);

  const started = display === "00:00:00:00";

  const isHero = variant === "hero";

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "text-sm font-bold tracking-wide uppercase",
          isHero ? "text-white/80" : "text-[var(--fg-3)]",
        )}
      >
        {started ? "Starting now" : label}
      </p>
      <p
        className={cn(
          "font-extrabold tracking-tight tabular-nums",
          isHero ? "fta-countdown-value text-white" : "text-[var(--fg-1)]",
        )}
        style={
          isHero
            ? undefined
            : { fontSize: "var(--fs-h2)", lineHeight: "var(--lh-h2)" }
        }
        aria-live="polite"
        aria-atomic="true"
      >
        {display}
      </p>
      <p className={cn("text-xs", isHero ? "text-white/60" : "text-[var(--fg-3)]")}>
        dd : hh : mm : ss
      </p>
    </div>
  );
}
