import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WelcomeBackProps = {
  name: string;
};

export function WelcomeBack({ name }: WelcomeBackProps) {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 text-center">
      <p className="text-[var(--fs-lead)] leading-[var(--lh-lead)] text-[var(--fg-2)]">
        Welcome back, <span className="font-bold text-[var(--fg-1)]">{name}</span>
      </p>
      <Link
        href="/webinar"
        className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
      >
        Go to the webinar
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fta/icons/right-yellow-plain-arrow.svg"
          alt=""
          width={15}
          height={15}
          className="inline-block"
        />
      </Link>
    </div>
  );
}
