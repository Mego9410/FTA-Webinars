import Link from "next/link";
import { cn } from "@/lib/utils";

type FtaLogoProps = {
  className?: string;
  href?: string;
  size?: "sm" | "md";
  responsive?: boolean;
};

export function FtaLogo({
  className,
  href = "/",
  size = "md",
  responsive = false,
}: FtaLogoProps) {
  const plate = (
    <div
      className={cn(
        "inline-flex items-center rounded-[14px] bg-fta-gold",
        size === "sm" ? "px-4 py-2" : "px-3 py-2 sm:px-5 sm:py-2.5",
        className,
      )}
    >
      <span
        className={cn(
          "font-display font-semibold leading-none tracking-tight text-fta-ink",
          size === "sm" ? "text-sm" : "text-sm sm:text-[15px]",
        )}
      >
        {responsive ? (
          <>
            <span className="sm:hidden">FTA</span>
            <span className="hidden sm:inline">Frank Taylor &amp; Associates</span>
          </>
        ) : (
          "Frank Taylor & Associates"
        )}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {plate}
      </Link>
    );
  }

  return plate;
}
