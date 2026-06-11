import Link from "next/link";
import { CaptureForm } from "@/components/CaptureForm";
import { Countdown } from "@/components/Countdown";
import { WelcomeBack } from "@/components/WelcomeBack";
import { buttonVariants } from "@/components/ui/button";
import type { ReturningUser } from "@/lib/users";
import type { WebinarSession } from "@/lib/sessions";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Seller-first advice",
    body: "Confidential guidance built around practice owners, not buyers.",
    icon: "/fta/icons/icon3-circle-yellow-white-seller-only-representation.svg",
  },
  {
    title: "Trusted expertise",
    body: "Independent counsel from the UK's leading dental practice sales agency since 1990.",
    icon: "/fta/icons/icon1-circle-yellow-white-your-journey-with-frank-taylor.svg",
  },
  {
    title: "No login",
    body: "Name and email only. Return on this device without signing in again.",
    icon: "/fta/icons/icon2-circle-yellow-white-vetted-buyers.svg",
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
      <section className="fta-hero">
        <div className="fta-container fta-hero-inner">
          <p className="fta-hero-eyebrow">Frank Taylor &amp; Associates webinars</p>
          <h1 className="fta-hero-title">
            Helping you buy or sell your dental practice with confidence
          </h1>
          <p className="fta-hero-lead">
            Practical, confidential sessions for dental principals — expert guidance
            on selling, buying, and valuing your practice.
          </p>

          {session ? (
            <div className="fta-hero-countdown">
              <p className="fta-hero-session">Next session: {topic}</p>
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
          <div className="fta-search-panel space-y-8 text-center">
            <div className="space-y-2">
              <h2>Register for the webinar</h2>
              <p className="text-[var(--fg-2)]">
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

            <div className="border-t border-[var(--border)] pt-6">
              <p className="mb-3 text-sm text-[var(--fg-3)]">
                Want to look around first?
              </p>
              <Link
                href="/webinar"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "fta-btn-mobile-full",
                )}
              >
                Preview the live room
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="fta-band fta-section pt-12">
        <div className="fta-container fta-feature-grid">
          {FEATURES.map((card) => (
            <article key={card.title} className="fta-feature-card">
              <div className="disc-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.icon} alt="" width={30} height={30} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fta-cta-banner fta-container">
        <div>
          <h2>Ready to take the next step?</h2>
          <p>Explore the webinar room or manage sessions in admin.</p>
        </div>
        <div className="fta-cta-actions">
          <Link href="/webinar" className={cn(buttonVariants({ variant: "dark" }))}>
            Go to live room
          </Link>
          <Link href="/admin" className={cn(buttonVariants({ variant: "outline-ink" }))}>
            Admin
          </Link>
        </div>
      </section>
    </>
  );
}
