import Link from "next/link";
import { PageViewTracker } from "@/components/PageViewTracker";
import { WebinarStage } from "@/components/WebinarStage";
import { buttonVariants } from "@/components/ui/button";
import { getDemoWebinarPageData } from "@/lib/demo-session";
import { getWebinarPageData } from "@/lib/sessions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WebinarPage() {
  const serverNowMs = Date.now();
  const data =
    (await getWebinarPageData(serverNowMs)) ??
    getDemoWebinarPageData(serverNowMs);

  return (
    <main className="flex flex-1 flex-col">
      <section className="fta-band border-b border-[var(--border)] py-6 md:py-8">
        <div className="fta-container flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="fta-eyebrow">Live webinar room</p>
            <h1 className="text-xl font-extrabold tracking-tight text-balance sm:text-2xl md:text-3xl">
              {data.session.topic}
            </h1>
            {data.session.host_name ? (
              <p className="text-sm text-[var(--fg-2)]">
                Hosted by {data.session.host_name}
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full shrink-0 sm:w-auto",
            )}
          >
            All webinars
          </Link>
        </div>
      </section>

      <section className="fta-section flex flex-1 flex-col justify-center py-8 md:py-12">
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
