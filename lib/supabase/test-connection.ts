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
  const { error } = await supabase.from("sessions").select("id").limit(1);

  if (!error) {
    return { ok: true, message: "Connected to Supabase (sessions table reachable)" };
  }

  if (error.code === "PGRST205" || error.message.includes("Could not find")) {
    return {
      ok: true,
      message: "Connected to Supabase (sessions table not created yet — Step 2)",
    };
  }

  return { ok: false, message: `Supabase error: ${error.message}` };
}
