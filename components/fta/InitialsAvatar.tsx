import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type InitialsAvatarProps = {
  name: string;
  size?: number;
  className?: string;
};

export function InitialsAvatar({
  name,
  size = 44,
  className,
}: InitialsAvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-fta-gold font-semibold text-fta-ink",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
