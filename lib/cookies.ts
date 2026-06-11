import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "fta_uid";
const ADMIN_COOKIE_NAME = "fta_admin";

function getSigningSecret(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export function signCookieValue(value: string): string {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for cookie signing");
  }

  const signature = createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
  return `${value}.${signature}`;
}

export function verifyCookieValue(signed: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const dot = signed.lastIndexOf(".");
  if (dot === -1) return null;

  const value = signed.slice(0, dot);
  const signature = signed.slice(dot + 1);
  const expected = createHmac("sha256", secret)
    .update(value)
    .digest("base64url");

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    return value;
  } catch {
    return null;
  }
}

export const USER_COOKIE = COOKIE_NAME;
export const ADMIN_COOKIE = "fta_admin";

export const userCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 8,
};
