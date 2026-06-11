import { Countdown } from "@/components/Countdown";
import { Pill } from "@/components/fta/Pill";
import type { WebinarSession } from "@/lib/sessions";

type WaitingRoomProps = {
  session: WebinarSession;
  serverNowMs: number;
};

export function WaitingRoom({ session, serverNowMs }: WaitingRoomProps) {
  return (
    <div className="fta-container mx-auto max-w-2xl space-y-10 text-center">
      <div className="space-y-4">
        <Pill tone="soon">Starting soon</Pill>
        <p className="text-[13px] font-semibold tracking-[0.12em] text-fta-gold uppercase">
          Waiting room
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-fta-ink md:text-4xl">
          {session.topic}
        </h1>
        <p className="text-[length:var(--fs-lead)] text-fta-muted">
          Hosted by {session.host_name}
        </p>
        {session.description ? (
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-fta-muted">
            {session.description}
          </p>
        ) : null}
      </div>

      <Countdown
        targetMs={new Date(session.start_time).getTime()}
        serverNowMs={serverNowMs}
        label="Starts in"
      />

      <p className="text-sm text-fta-muted">
        The session will begin automatically when the countdown reaches zero.
      </p>
    </div>
  );
}
