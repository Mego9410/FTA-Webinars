import "server-only";

import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  signCookieValue,
  verifyCookieValue,
} from "@/lib/cookies";

export function isAdminPreviewMode(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

export async function isAdmin(): Promise<boolean> {
  if (isAdminPreviewMode()) return true;

  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!raw) return false;
  return verifyCookieValue(raw) === "authenticated";
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, signCookieValue("authenticated"), adminCookieOptions);
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
