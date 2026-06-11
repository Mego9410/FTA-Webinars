import { Button } from "@/components/ui/button";
import { testSupabaseConnection } from "@/lib/supabase/test-connection";

export default async function Home() {
  const connection = await testSupabaseConnection();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-lg space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">FTA Webinar Platform</h1>
        <p className="text-muted-foreground">
          Step 1 skeleton — Next.js, Tailwind, shadcn/ui, and Supabase clients are wired.
        </p>
      </div>

      <div
        className={`rounded-lg border px-4 py-3 text-sm ${
          connection.ok
            ? "border-green-200 bg-green-50 text-green-900"
            : "border-red-200 bg-red-50 text-red-900"
        }`}
      >
        <span className="font-medium">Supabase: </span>
        {connection.message}
      </div>

      <Button variant="outline" disabled>
        Landing page (Step 4)
      </Button>
    </main>
  );
}
