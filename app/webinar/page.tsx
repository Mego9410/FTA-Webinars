import { PageViewTracker } from "@/components/PageViewTracker";
import { WebinarStage } from "@/components/WebinarStage";
import { ButtonLink } from "@/components/ui/button";
import { getDemoWebinarPageData } from "@/lib/demo-session";
import { getWebinarPageData } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export default async function WebinarPage() {
  const serverNowMs = Date.now();
  const data =
    (await getWebinarPageData(serverNowMs)) ??
    getDemoWebinarPageData(serverNowMs);

  return (
    <main className="flex flex-1 flex-col">
      <section className="fta-room-hero">
        <div className="fta-room-hero-inner mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="fta-room-hero-copy min-w-0">
              <p className="fta-room-hero-eyebrow">Live webinar room</p>
              <h1 className="fta-room-hero-title text-balance">
                {data.session.topic}
              </h1>
              {data.session.host_name ? (
                <p className="fta-room-hero-host">
                  Hosted by {data.session.host_name}
                </p>
              ) : null}
            </div>
            <ButtonLink
              href="/"
              variant="outline"
              size="sm"
              className="w-full shrink-0 border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-fta-gold hover:bg-fta-gold hover:text-fta-ink sm:w-auto"
            >
              All webinars
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-fta-bg py-12 md:py-16">
        <PageViewTracker page="webinar" sessionId={data.session.id} />
        <WebinarStage
          session={data.session}
          nextSession={data.nextSession}
          serverNowMs={serverNowMs}
        />
      </section>
    </main>
  );
}
