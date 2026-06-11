import { ButtonLink } from "@/components/ui/button";

type WelcomeBackProps = {
  name: string;
};

export function WelcomeBack({ name }: WelcomeBackProps) {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 text-center">
      <p className="text-[length:var(--fs-lead)] leading-relaxed text-fta-muted">
        Welcome back, <span className="font-semibold text-fta-ink">{name}</span>
      </p>
      <ButtonLink href="/webinar" size="lg" className="w-full">
        Enter the live room
      </ButtonLink>
    </div>
  );
}
