import { cn } from "@/lib/utils";

type FtaCardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
};

export function FtaCard({
  children,
  className,
  interactive = false,
}: FtaCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-fta-border bg-fta-bg p-7 shadow-card md:p-8",
        interactive &&
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
