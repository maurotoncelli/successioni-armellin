"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase, isAuthConfigured } from "@/lib/supabase/ssr";
import { normalizePhone } from "@/lib/phone";

/*
  Login dell'area personale (Supabase Auth).
  - Email: Magic Link (metodo primario, @06) + OTP a 6 cifre come alternativa.
  - Telefono: OTP a 6 cifre via SMS (richiede un provider SMS configurato su
    Supabase; senza provider l'azione torna un messaggio chiaro, fallback graceful).
  - Google: OAuth (richiede il provider abilitato sul progetto Supabase).
  - Password: opzionale, per chi l'ha creata dal profilo (si resta comunque
    con magic link/OTP come default).
  Tutto lato server: i cookie di sessione vengono impostati dal client SSR.
*/

export type LoginChannel = "email" | "phone";
export type LoginState = {
  error?: string;
  sent?: boolean;
  email?: string;
  phone?: string;
  channel?: LoginChannel;
};

async function resolveOrigin(): Promise<string> {
  const h = await headers();
  return (
    h.get("origin") ??
    (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  );
}

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { error: "Inserisci la tua email.", channel: "email" };
  if (!isAuthConfigured) {
    return {
      error: "Accesso non ancora attivo: Supabase Auth non configurato.",
      channel: "email",
    };
  }

  const supabase = await createServerSupabase();
  const origin = await resolveOrigin();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/area-riservata/auth/callback?next=/area-riservata/dashboard`,
    },
  });
  if (error) return { error: error.message, email, channel: "email" };
  return { sent: true, email, channel: "email" };
}

export async function verifyOtp(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const token = String(formData.get("token") ?? "").trim();
  if (!email || !token)
    return { error: "Email e codice sono obbligatori.", email, sent: true, channel: "email" };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { error: error.message, email, sent: true, channel: "email" };

  redirect("/area-riservata/dashboard");
}

export async function sendPhoneOtp(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  if (!phone)
    return { error: "Inserisci un numero di telefono valido.", channel: "phone" };
  if (!isAuthConfigured) {
    return {
      error: "Accesso non ancora attivo: Supabase Auth non configurato.",
      channel: "phone",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true },
  });
  if (error) return { error: error.message, phone, channel: "phone" };
  return { sent: true, phone, channel: "phone" };
}

export async function verifyPhoneOtp(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const token = String(formData.get("token") ?? "").trim();
  if (!phone || !token)
    return {
      error: "Numero e codice sono obbligatori.",
      phone: phone ?? undefined,
      sent: true,
      channel: "phone",
    };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) return { error: error.message, phone, sent: true, channel: "phone" };

  redirect("/area-riservata/dashboard");
}

/*
  Login con Google: signInWithOAuth prepara l'URL di autorizzazione (PKCE),
  il redirect vero lo fa il browser. Al ritorno atterra sullo stesso callback
  del magic link (auth/callback), che scambia il codice per la sessione.
*/
export async function signInWithGoogle(): Promise<LoginState> {
  if (!isAuthConfigured) {
    return { error: "Accesso non ancora attivo: Supabase Auth non configurato." };
  }
  const supabase = await createServerSupabase();
  const origin = await resolveOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/area-riservata/auth/callback?next=/area-riservata/dashboard`,
    },
  });
  if (error || !data?.url) {
    return {
      error:
        "Accesso con Google non disponibile al momento. Usa l'email o il telefono.",
    };
  }
  redirect(data.url);
}

export async function signInWithPassword(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Inserisci email e password.", email, channel: "email" };
  }
  if (!isAuthConfigured) {
    return {
      error: "Accesso non ancora attivo: Supabase Auth non configurato.",
      channel: "email",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const friendly =
      error.message === "Invalid login credentials"
        ? "Email o password non corretti. Se non hai mai creato una password, accedi con il link via email."
        : error.message;
    return { error: friendly, email, channel: "email" };
  }
  redirect("/area-riservata/dashboard");
}

export async function signOut(): Promise<void> {
  if (isAuthConfigured) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/area-riservata");
}
