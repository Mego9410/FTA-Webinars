import { Award, Shield, UserRound } from "lucide-react";
import { CaptureForm } from "@/components/CaptureForm";
import { Countdown } from "@/components/Countdown";
import { WelcomeBack } from "@/components/WelcomeBack";
import { FtaCard } from "@/components/fta/FtaCard";
import { IconBadge } from "@/components/fta/IconBadge";
import { Pill } from "@/components/fta/Pill";
import { SectionWrapper } from "@/components/fta/SectionWrapper";
import { ButtonLink } from "@/components/ui/button";
import type { ReturningUser } from "@/lib/users";
import type { WebinarSession } from "@/lib/sessions";

const FEATURES = [
  {
    title: "Seller-first advice",
    body: "Confidential guidance built around practice owners, not buyers.",
    icon: Shield,
  },
  {
    title: "Trusted expertise",
    body: "Independent counsel from the UK's leading dental practice sales agency since 1990.",
    icon: Award,
  },
  {
    title: "No login",
    body: "Name and email only. Return on this device without signing in again.",
    icon: UserRound,
  },
] as const;

type LandingHeroProps = {
  session: WebinarSession | null;
  serverNowMs: number;
  returningUser: ReturningUser | null;
};

export function LandingHero({
  session,
  serverNowMs,
  returningUser,
}: LandingHeroProps) {
  const topic =
    session?.topic ?? "Expert webinars for dental practice owners";

  return (
    <>
      <section className="fta-hero fta-reveal">
        <div className="fta-hero-inner">
          <p className="fta-hero-eyebrow">Frank Taylor &amp; Associates webinars</p>
          <h1 className="fta-hero-title">
            Helping you buy or sell your dental practice with confidence
          </h1>
          <p className="fta-hero-lead">
            Practical, confidential sessions for dental principals — expert guidance
            on selling, buying, and valuing your practice.
          </p>

          {session ? (
            <div className="fta-hero-session-strip">
              <Pill tone="soon">Upcoming session</Pill>
              <p className="fta-hero-session-topic">{topic}</p>
            </div>
          ) : null}

          {session ? (
            <div className="mt-8 w-full max-w-2xl">
              <Countdown
                targetMs={new Date(session.start_time).getTime()}
                serverNowMs={serverNowMs}
                variant="hero"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section id="register" className="fta-register-wrap">
        <div className="fta-container mx-auto max-w-3xl">
          <div className="fta-register-card space-y-8 text-center fta-reveal">
            <div className="space-y-2">
              <h2 className="font-display text-[length:var(--fs-h2)] leading-tight">
                Register for the webinar
              </h2>
              <p className="text-fta-muted">
                {session
                  ? `Reserve your place for “${topic}”`
                  : "Reserve your place for the next expert session"}
              </p>
            </div>

            {returningUser ? (
              <WelcomeBack name={returningUser.name} />
            ) : (
              <CaptureForm />
            )}

            <div className="border-t border-fta-border pt-6 pb-2">
              <p className="mb-3 text-sm text-fta-muted">
                Want to look around first?
              </p>
              <ButtonLink
                href="/webinar"
                variant="ghost"
                className="fta-btn-mobile-full"
                showArrow
              >
                Preview the live room
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper band="warm" className="fta-trust-band pt-16 md:pt-20">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((card) => (
            <FtaCard key={card.title} interactive className="flex h-full flex-col gap-4">
              <IconBadge icon={card.icon} />
              <h3 className="font-display text-[length:var(--fs-card-title)] font-semibold text-fta-ink">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-fta-muted">{card.body}</p>
            </FtaCard>
          ))}
        </div>
      </SectionWrapper>

      <div className="fta-container pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="fta-cta-panel flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Ready to take the next step?
            </h2>
            <p className="mt-2 text-[15px]">
              Explore the webinar room or manage sessions in admin.
            </p>
          </div>
          <div className="fta-cta-actions">
            <ButtonLink href="/webinar" variant="dark">
              Go to live room
            </ButtonLink>
            <ButtonLink href="/admin" variant="outline-ink">
              Admin
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
