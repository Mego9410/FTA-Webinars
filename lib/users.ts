import "server-only";

import { cookies } from "next/headers";
import { USER_COOKIE, verifyCookieValue } from "@/lib/cookies";
import { createServiceClient } from "@/lib/supabase/server";

export type ReturningUser = {
  id: string;
  name: string;
  email: string;
};

export async function getReturningUser(): Promise<ReturningUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(USER_COOKIE)?.value;
  if (!raw) return null;

  const userId = verifyCookieValue(raw);
  if (!userId) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", userId)
    .maybeSingle();

  return data;
}
