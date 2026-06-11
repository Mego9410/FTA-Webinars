import { cn } from "@/lib/utils";

type PillTone = "live" | "soon" | "ended" | "available" | "nhs" | "private" | "mixed";

const toneStyles: Record<PillTone, string> = {
  live: "bg-fta-ink text-white",
  soon: "bg-fta-gold-soft text-fta-ink border border-fta-gold/30",
  ended: "bg-fta-bg-warm text-fta-muted border border-fta-border",
  available: "bg-[color-mix(in_srgb,var(--pill-available)_12%,white)] text-[#1F7A3A]",
  nhs: "bg-[color-mix(in_srgb,var(--pill-nhs)_12%,white)] text-[#B8325C]",
  private: "bg-[color-mix(in_srgb,var(--pill-private)_12%,white)] text-[#5E4BB8]",
  mixed: "bg-[color-mix(in_srgb,var(--pill-mixed)_12%,white)] text-[#2D8A7C]",
};

type PillProps = {
  children: React.ReactNode;
  tone?: PillTone;
  pulse?: boolean;
  className?: string;
};

export function Pill({
  children,
  tone = "soon",
  pulse = false,
  className,
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase",
        toneStyles[tone],
        className,
      )}
    >
      {pulse ? (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-red-500" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
