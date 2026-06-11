import { LandingHero } from "@/components/fta/LandingHero";
import { PageViewTracker } from "@/components/PageViewTracker";
import { createDemoSession } from "@/lib/demo-session";
import { getNextSession } from "@/lib/sessions";
import { getReturningUser } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function Home() {
  const serverNowMs = Date.now();
  let dbSession: Awaited<ReturnType<typeof getNextSession>> = null;
  let returningUser: Awaited<ReturnType<typeof getReturningUser>> = null;

  try {
    [dbSession, returningUser] = await Promise.all([
      getNextSession(),
      getReturningUser(),
    ]);
  } catch {
    // Fall back to demo content if Supabase is unavailable or misconfigured.
  }

  const session = dbSession ?? {
    ...createDemoSession(serverNowMs),
    start_time: new Date(serverNowMs + 3 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return (
    <main className="flex flex-1 flex-col">
      <PageViewTracker page="landing" sessionId={session.id} />
      <LandingHero
        session={session}
        serverNowMs={serverNowMs}
        returningUser={returningUser}
      />
    </main>
  );
}
