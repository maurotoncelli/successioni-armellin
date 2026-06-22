import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabase, isAuthConfigured } from "@/lib/supabase/ssr";
import { ADMIN_COOKIE, hashToken } from "@/lib/admin-auth";
import { adminEmails, ensureProfile } from "@/lib/profiles";

/*
  Gate del CRM (/crm/*). Ordine dei controlli:
  1) ACCESSO D'EMERGENZA: cookie hash di ADMIN_PASSWORD (stopgap anti-lockout).
  2) Se nessun enforcement e configurato (niente ADMIN_PASSWORD e niente
     ADMIN_EMAILS) => CRM APERTO come in fase demo (nessun lockout).
  3) Altrimenti AUTH REALE: sessione Supabase + profilo ruolo ADMIN + 2FA (AAL2).
  Il gate vive nel layout del CRM (server), non solo nel proxy (@security guide).
*/

export type AdminGate =
  | { mode: "emergency" }
  | { mode: "open" }
  | { mode: "supabase"; user: User };

async function emergencyCookieOk(): Promise<boolean> {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return false;
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  return cookie === (await hashToken(pwd));
}

function enforcementOn(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) || (isAuthConfigured && adminEmails().length > 0);
}

export const requireAdmin = cache(async (): Promise<AdminGate> => {
  if (await emergencyCookieOk()) return { mode: "emergency" };

  // Transizione: nessun gate configurato => resta aperto (come prima).
  if (!enforcementOn()) return { mode: "open" };

  if (!isAuthConfigured) redirect("/crm-login");

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/crm-login");

  const { role } = await ensureProfile(user);
  if (role !== "ADMIN") redirect("/crm-login?error=forbidden");

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== "aal2") redirect("/crm-login?error=2fa");

  return { mode: "supabase", user };
});
