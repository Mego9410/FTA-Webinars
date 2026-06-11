import { ButtonLink } from "@/components/ui/button";
import { FtaCard } from "@/components/fta/FtaCard";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ u?: string }>;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { u: userId } = await searchParams;
  let status: "ok" | "missing" | "error" = "missing";

  if (userId) {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("users")
      .update({ subscribed: false })
      .eq("id", userId);

    status = error ? "error" : "ok";
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-fta-warm px-6 py-20">
      <FtaCard className="w-full max-w-md space-y-6 text-center">
        {status === "ok" ? (
          <>
            <h1 className="font-display text-2xl font-bold text-fta-ink">You are unsubscribed</h1>
            <p className="text-sm leading-relaxed text-fta-muted">
              You will no longer receive webinar reminder emails from Frank Taylor &amp;
              Associates.
            </p>
          </>
        ) : null}
        {status === "missing" ? (
          <>
            <h1 className="font-display text-2xl font-bold text-fta-ink">Unsubscribe link invalid</h1>
            <p className="text-sm text-fta-muted">Use the link from your email to unsubscribe.</p>
          </>
        ) : null}
        {status === "error" ? (
          <>
            <h1 className="font-display text-2xl font-bold text-fta-ink">Something went wrong</h1>
            <p className="text-sm text-fta-muted">Please try again or contact FTA.</p>
          </>
        ) : null}
        <ButtonLink href="/" variant="outline">
          Back to webinars
        </ButtonLink>
      </FtaCard>
    </main>
  );
}
