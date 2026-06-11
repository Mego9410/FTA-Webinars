"use server";

import { redirect } from "next/navigation";
import {
  clearAdminCookie,
  setAdminCookie,
  verifyAdminPassword,
} from "@/lib/admin";

export type AdminActionState = {
  error?: string;
};

export async function adminLogin(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const password = formData.get("password")?.toString() ?? "";

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Admin is not configured (set ADMIN_PASSWORD)" };
  }

  if (!verifyAdminPassword(password)) {
    return { error: "Incorrect password" };
  }

  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin");
}
