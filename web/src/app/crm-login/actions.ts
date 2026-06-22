"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, hashToken } from "@/lib/admin-auth";

export type LoginResult = { error: string } | null;

export async function login(
  _prev: LoginResult,
  formData: FormData,
): Promise<LoginResult> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    // Gate disattivato: nessuna password configurata.
    redirect("/crm");
  }

  const submitted = String(formData.get("password") ?? "");
  if (submitted !== password) {
    return { error: "Password non corretta." };
  }

  const next = String(formData.get("next") ?? "/crm");
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await hashToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(next.startsWith("/crm") ? next : "/crm");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/crm-login");
}
