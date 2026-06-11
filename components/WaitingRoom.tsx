import { Countdown } from "@/components/Countdown";
import type { WebinarSession } from "@/lib/sessions";

type WaitingRoomProps = {
  session: WebinarSession;
  serverNowMs: number;
};

export function WaitingRoom({ session, serverNowMs }: WaitingRoomProps) {
  return (
    <div className="fta-container mx-auto max-w-2xl space-y-8 text-center">
      <div className="space-y-3">
        <p className="fta-eyebrow">Starting soon</p>
        <h1 className="text-[var(--fs-h2)] leading-[var(--lh-h2)] tracking-[var(--tracking-tight)]">
          {session.topic}
        </h1>
        <p className="text-[var(--fs-lead)] text-[var(--fg-2)]">
          Hosted by {session.host_name}
        </p>
        {session.description ? (
          <p className="text-sm leading-relaxed text-[var(--fg-3)]">
            {session.description}
          </p>
        ) : null}
      </div>

      <Countdown
        targetMs={new Date(session.start_time).getTime()}
        serverNowMs={serverNowMs}
        label="Starts in"
      />

      <p className="text-sm text-[var(--fg-3)]">
        The session will begin automatically when the countdown reaches zero.
      </p>
    </div>
  );
}
