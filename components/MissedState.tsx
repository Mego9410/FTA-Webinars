import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { buttonVariants } from "@/components/ui/button";
import type { WebinarSession } from "@/lib/sessions";
import { cn } from "@/lib/utils";

type MissedStateProps = {
  nextSession: WebinarSession | null;
  serverNowMs: number;
};

export function MissedState({ nextSession, serverNowMs }: MissedStateProps) {
  return (
    <div className="fta-container mx-auto max-w-2xl space-y-8 text-center">
      <div className="space-y-3">
        <p className="fta-eyebrow">Session ended</p>
        <h1 className="text-[var(--fs-h2)] leading-[var(--lh-h2)] tracking-[var(--tracking-tight)]">
          You missed it
        </h1>
        <p className="text-[var(--fs-lead)] text-[var(--fg-2)]">
          This webinar has finished. Register for the next session to join live.
        </p>
      </div>

      {nextSession ? (
        <div className="space-y-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <div className="space-y-2">
            <p className="text-sm font-bold text-[var(--gold-deep)]">Next session</p>
            <h2 className="text-xl font-bold text-[var(--fg-1)]">{nextSession.topic}</h2>
            <p className="text-sm text-[var(--fg-2)]">Hosted by {nextSession.host_name}</p>
          </div>
          <Countdown
            targetMs={new Date(nextSession.start_time).getTime()}
            serverNowMs={serverNowMs}
            label="Next session starts in"
          />
        </div>
      ) : (
        <p className="text-sm text-[var(--fg-3)]">
          No upcoming sessions are scheduled yet.
        </p>
      )}

      <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
        Back to registration
      </Link>
    </div>
  );
}
