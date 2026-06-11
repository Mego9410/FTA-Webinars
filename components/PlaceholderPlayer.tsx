type PlaceholderPlayerProps = {
  topic: string;
  offsetSec: number;
};

export function PlaceholderPlayer({ topic, offsetSec }: PlaceholderPlayerProps) {
  const minutes = Math.floor(offsetSec / 60);
  const seconds = Math.floor(offsetSec % 60);

  return (
    <div className="fta-container mx-auto w-full max-w-4xl space-y-4 px-0">
      <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-[var(--r-lg)] bg-[var(--ink)] px-4 text-white shadow-[var(--shadow-lg)] sm:gap-4 sm:rounded-[var(--r-xl)] sm:px-6">
        <p className="fta-eyebrow text-[var(--gold)]">Live now</p>
        <h1 className="max-w-lg text-center text-lg font-bold text-balance sm:text-2xl">
          {topic}
        </h1>
        <p className="max-w-md text-center text-sm text-white/70">
          Preview playback — add a Mux playback ID in admin for the full live
          experience.
        </p>
        <p className="rounded-[var(--r-md)] bg-white/10 px-4 py-2 font-mono text-sm tabular-nums">
          Live offset: {minutes}:{String(seconds).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
