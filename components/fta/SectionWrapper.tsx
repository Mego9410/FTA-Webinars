import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: React.ReactNode;
  band?: "white" | "warm" | "dark";
  className?: string;
  id?: string;
  containerClassName?: string;
};

export function SectionWrapper({
  children,
  band = "white",
  className,
  id,
  containerClassName,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        band === "warm" && "bg-fta-warm",
        band === "white" && "bg-fta-bg",
        band === "dark" && "bg-fta-ink text-white",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[1200px] px-6",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
