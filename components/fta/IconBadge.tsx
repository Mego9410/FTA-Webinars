import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconBadgeProps = {
  icon: LucideIcon;
  variant?: "soft" | "solid";
  className?: string;
};

export function IconBadge({
  icon: Icon,
  variant = "soft",
  className,
}: IconBadgeProps) {
  return (
    <div
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-full",
        variant === "solid"
          ? "bg-fta-gold text-fta-ink shadow-card"
          : "bg-fta-gold-soft text-fta-gold",
        className,
      )}
      aria-hidden
    >
      <Icon className="size-6" strokeWidth={2} />
    </div>
  );
}
