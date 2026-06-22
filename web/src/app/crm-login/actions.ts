"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, hashToken } from "@/lib/admin-auth";
import { createServerSupabase, isAuthConfigured } from "@/lib/supabase/ssr";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { ensureProfile, isAdminEmail } from "@/lib/profiles";

/* ============================================================
   1) Login reale admin: email + password (1o fattore) + TOTP (2o fattore)
   ============================================================ */

export type AdminLoginStep =
  | { ok: true; next: "totp"; factorId: string }
  | { ok: true; next: "enroll"; factorId: string; qr: string; secret: string }
  | { ok: false; error: string };

// Rimuove eventuali fattori TOTP non verificati (residui di tentativi precedenti).
async function cleanupUnverifiedTotp(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
) {
  const { data } = await supabase.auth.mfa.listFactors();
  const stale = (data?.all ?? []).filter(
    (f) => f.factor_type === "totp" && f.status !== "verified",
  );
  for (const f of stale) {
    await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
}

async function startEnrollment(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
): Promise<AdminLoginStep> {
  await cleanupUnverifiedTotp(supabase);
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "CRM Flowdesk",
  });
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Errore attivazione 2FA." };
  }
  return {
    ok: true,
    next: "enroll",
    factorId: data.id,
    qr: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

export async function adminLogin(formData: FormData): Promise<AdminLoginStep> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Email e password sono obbligatori." };
  if (!isAuthConfigured) return { ok: false, error: "Auth non configurato (Supabase)." };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "Email o password non corretti." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessione non creata, riprova." };

  const { role } = await ensureProfile(user);
  if (role !== "ADMIN") {
    await supabase.auth.signOut();
    return { ok: false, error: "Questo account non e autorizzato al CRM." };
  }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") redirect("/crm");

  if (aal?.nextLevel === "aal2") {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];
    if (totp) return { ok: true, next: "totp", factorId: totp.id };
  }

  // Nessun fattore verificato: 2FA obbligatorio => avvia l'attivazione.
  return startEnrollment(supabase);
}

// Verifica il codice TOTP (vale sia per l'attivazione sia per l'accesso).
export async function verifyTotp(
  factorId: string,
  code: string,
): Promise<{ ok: false; error: string }> {
  if (!isAuthConfigured) return { ok: false, error: "Auth non configurato." };
  const cleaned = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(cleaned)) return { ok: false, error: "Inserisci le 6 cifre." };

  const supabase = await createServerSupabase();
  const { data: challenge, error: e1 } = await supabase.auth.mfa.challenge({ factorId });
  if (e1 || !challenge) return { ok: false, error: "Errore di verifica, riprova." };

  const { error: e2 } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code: cleaned,
  });
  if (e2) return { ok: false, error: "Codice non valido o scaduto." };

  redirect("/crm");
}

/* ============================================================
   2) Bootstrap del primo account admin (solo email in ADMIN_EMAILS)
   ============================================================ */

export async function bootstrapAdmin(formData: FormData): Promise<AdminLoginStep> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!isAdminConfigured || !isAuthConfigured) {
    return { ok: false, error: "Auth non configurato (Supabase)." };
  }
  if (!isAdminEmail(email)) {
    return { ok: false, error: "Email non presente nell'allowlist ADMIN_EMAILS." };
  }
  if (password.length < 10) {
    return { ok: false, error: "Usa una password di almeno 10 caratteri." };
  }
  if (password !== confirm) {
    return { ok: false, error: "Le due password non coincidono." };
  }

  const admin = getAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !created?.user) {
    return {
      ok: false,
      error:
        error?.message?.includes("already")
          ? "Esiste gia un account con questa email: usa Accedi."
          : error?.message ?? "Impossibile creare l'account.",
    };
  }

  await admin
    .from("profiles")
    .upsert({ id: created.user.id, role: "ADMIN" }, { onConflict: "id" });

  const supabase = await createServerSupabase();
  const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
  if (signErr) return { ok: false, error: "Account creato, ma login fallito: riprova." };

  return startEnrollment(supabase);
}

/* ============================================================
   3) Accesso d'emergenza (stopgap) con ADMIN_PASSWORD
   ============================================================ */

export type LoginResult = { error: string } | null;

export async function emergencyLogin(
  _prev: LoginResult,
  formData: FormData,
): Promise<LoginResult> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    // Nessun gate configurato: CRM aperto.
    redirect("/crm");
  }

  const submitted = String(formData.get("password") ?? "");
  if (submitted !== password) return { error: "Password non corretta." };

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await hashToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/crm");
}

/* ============================================================
   4) Logout (sessione Supabase + cookie d'emergenza)
   ============================================================ */

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  if (isAuthConfigured) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/crm-login");
}
