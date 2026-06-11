import { Countdown } from "@/components/Countdown";
import { FtaCard } from "@/components/fta/FtaCard";
import { Pill } from "@/components/fta/Pill";
import { ButtonLink } from "@/components/ui/button";
import type { WebinarSession } from "@/lib/sessions";

type MissedStateProps = {
  nextSession: WebinarSession | null;
  serverNowMs: number;
};

export function MissedState({ nextSession, serverNowMs }: MissedStateProps) {
  return (
    <div className="fta-container mx-auto max-w-2xl space-y-10 text-center">
      <div className="space-y-4">
        <Pill tone="ended">Session ended</Pill>
        <h1 className="font-display text-3xl font-bold tracking-tight text-fta-ink md:text-4xl">
          You missed this one
        </h1>
        <p className="text-[length:var(--fs-lead)] text-fta-muted">
          This webinar has finished. Register for the next session to join live.
        </p>
      </div>

      {nextSession ? (
        <FtaCard className="space-y-6 text-left md:text-center">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-fta-gold uppercase">
              Next session
            </p>
            <h2 className="font-display text-xl font-semibold text-fta-ink">
              {nextSession.topic}
            </h2>
            <p className="text-sm text-fta-muted">Hosted by {nextSession.host_name}</p>
          </div>
          <Countdown
            targetMs={new Date(nextSession.start_time).getTime()}
            serverNowMs={serverNowMs}
            label="Next session starts in"
          />
          {nextSession.cta_label && nextSession.cta_url ? (
            <div className="flex justify-center pt-2">
              <ButtonLink href={nextSession.cta_url} size="lg">
                {nextSession.cta_label}
              </ButtonLink>
            </div>
          ) : null}
        </FtaCard>
      ) : (
        <p className="text-sm text-fta-muted">
          No upcoming sessions are scheduled yet.
        </p>
      )}

      <ButtonLink href="/" variant="outline">
        Back to registration
      </ButtonLink>
    </div>
  );
}
