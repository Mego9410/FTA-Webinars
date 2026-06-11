import { Pill } from "@/components/fta/Pill";

type PlaceholderPlayerProps = {
  topic: string;
  offsetSec: number;
};

export function PlaceholderPlayer({ topic, offsetSec }: PlaceholderPlayerProps) {
  const minutes = Math.floor(offsetSec / 60);
  const seconds = Math.floor(offsetSec % 60);

  return (
    <div className="fta-container mx-auto w-full max-w-4xl space-y-5">
      <div className="fta-player-frame relative">
        <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-fta-ink px-6 text-white">
          <Pill tone="live" pulse>
            Live now
          </Pill>
          <h2 className="max-w-lg text-center font-display text-xl font-bold text-balance sm:text-2xl">
            {topic}
          </h2>
          <p className="max-w-md text-center text-sm text-white/75">
            Preview playback — add a Mux playback ID in admin for the full experience.
          </p>
          <p className="rounded-input bg-white/10 px-4 py-2 font-mono text-sm tabular-nums">
            Live offset: {minutes}:{String(seconds).padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}
