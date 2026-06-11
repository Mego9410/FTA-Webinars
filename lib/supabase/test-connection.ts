import { createClient } from "@supabase/supabase-js";

export type SupabaseConnectionResult = {
  ok: boolean;
  message: string;
};

export async function testSupabaseConnection(): Promise<SupabaseConnectionResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      ok: false,
      message: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    };
  }

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase
    .from("sessions")
    .select("topic, start_time")
    .order("start_time", { ascending: true })
    .limit(1);

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  const usersBlocked =
    usersError !== null || users === null || users.length === 0;

  if (!error && data?.length) {
    const rlsNote = usersBlocked ? " · RLS OK" : " · RLS warning: users readable";
    return {
      ok: usersBlocked,
      message: `Connected — next session: “${data[0].topic}”${rlsNote}`,
    };
  }

  if (!error) {
    return { ok: true, message: "Connected to Supabase (no sessions seeded yet)" };
  }

  if (error.code === "PGRST205" || error.message.includes("Could not find")) {
    return {
      ok: true,
      message: "Connected to Supabase (sessions table not created yet — Step 2)",
    };
  }

  return { ok: false, message: `Supabase error: ${error.message}` };
}
