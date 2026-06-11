export type WebinarState = "before" | "during" | "after";

export function getState(
  serverNowMs: number,
  startMs: number,
  durationSec: number,
) {
  const offsetSec = (serverNowMs - startMs) / 1000;
  let state: WebinarState = "before";
  if (offsetSec >= 0 && offsetSec < durationSec) state = "during";
  else if (offsetSec >= durationSec) state = "after";
  return { state, offsetSec: Math.max(0, offsetSec) };
}

export function formatCountdown(remainingMs: number): string {
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
