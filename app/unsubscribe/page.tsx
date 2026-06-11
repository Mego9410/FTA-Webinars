import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createServiceClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

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
    <main className="fta-section flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-white p-8 text-center shadow-[var(--shadow-sm)]">
        {status === "ok" ? (
          <>
            <h1 className="text-2xl font-extrabold text-[var(--fg-1)]">You are unsubscribed</h1>
            <p className="text-sm leading-relaxed text-[var(--fg-2)]">
              You will no longer receive webinar reminder emails from Frank Taylor &amp; Associates.
            </p>
          </>
        ) : null}
        {status === "missing" ? (
          <>
            <h1 className="text-2xl font-extrabold text-[var(--fg-1)]">Unsubscribe link invalid</h1>
            <p className="text-sm text-[var(--fg-3)]">Use the link from your email to unsubscribe.</p>
          </>
        ) : null}
        {status === "error" ? (
          <>
            <h1 className="text-2xl font-extrabold text-[var(--fg-1)]">Something went wrong</h1>
            <p className="text-sm text-[var(--fg-3)]">Please try again or contact FTA.</p>
          </>
        ) : null}
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to webinars
        </Link>
      </div>
    </main>
  );
}
