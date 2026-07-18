"use server";

import { revalidatePath } from "next/cache";
import { actionText } from "@/lib/action-locale";
import { createServerSupabase, isAuthConfigured } from "@/lib/supabase/ssr";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { upsertContactByEmail } from "@/lib/contacts";

/*
  Recovery: area vuota ma il cliente ha pagato / lasciato un lead.
  Collega il profilo loggato alla pratica se codice + email coincidono
  con la pratica E con l'email dell'account autenticato.
*/

export type ClaimResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      /** Email con cui dovrebbe accedere (diversa da quella del login attuale). */
      needsEmail?: string;
    };

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export async function claimPracticeByCode(
  codeRaw: string,
  emailRaw: string,
): Promise<ClaimResult> {
  if (!isAuthConfigured || !isAdminConfigured) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "claim_unavailable",
        "Servizio non disponibile al momento.",
      ),
    };
  }

  const code = normalizeCode(codeRaw);
  const email = emailRaw.trim().toLowerCase();
  if (!code || !email) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "claim_fields_required",
        "Inserisci codice pratica e email.",
      ),
    };
  }

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "claim_auth_required",
        "Devi essere autenticato per collegare la pratica.",
      ),
    };
  }

  const authEmail = (user.email ?? "").trim().toLowerCase();
  if (!authEmail) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "claim_no_email",
        "Questo accesso non ha un'email. Esci e accedi con l'email usata per l'acquisto (magic link).",
      ),
    };
  }

  if (authEmail !== email) {
    const template = await actionText(
      "area_errors",
      "claim_wrong_account",
      "Sei connesso come {current}. Per questa pratica devi accedere con {expected}.",
    );
    return {
      ok: false,
      error: template
        .replace("{current}", authEmail)
        .replace("{expected}", email),
      needsEmail: email,
    };
  }

  const admin = getAdminClient();
  const { data: practice, error } = await admin
    .from("practices")
    .select("id, code, client_email, contact_id, client_name, client_phone")
    .ilike("code", code)
    .maybeSingle();

  if (error || !practice) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "claim_not_found",
        "Nessuna pratica trovata con questo codice. Controlla e riprova.",
      ),
    };
  }

  const practiceEmail = (practice.client_email ?? "").trim().toLowerCase();
  if (!practiceEmail || practiceEmail !== email) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "claim_practice_email_mismatch",
        "L'email non corrisponde a quella registrata sulla pratica. Usa l'email del pagamento o del preventivo.",
      ),
    };
  }

  let contactId = practice.contact_id as string | null;
  if (!contactId) {
    const fullName = (practice.client_name ?? "").trim();
    const [first, ...rest] = fullName.split(/\s+/);
    contactId = await upsertContactByEmail({
      email,
      firstName: first || "Cliente",
      lastName: rest.join(" "),
      phone: practice.client_phone,
      source: "Recovery area personale",
    });
    if (!contactId) {
      return {
        ok: false,
        error: await actionText(
          "area_errors",
          "claim_link_failed",
          "Non siamo riusciti a collegare il contatto. Contatta lo studio.",
        ),
      };
    }
    await admin
      .from("practices")
      .update({ contact_id: contactId })
      .eq("id", practice.id);
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) {
    await admin
      .from("profiles")
      .update({ contact_id: contactId })
      .eq("id", user.id);
  } else {
    await admin.from("profiles").insert({
      id: user.id,
      contact_id: contactId,
      role: "CLIENT",
    });
  }

  revalidatePath("/area-riservata", "layout");
  revalidatePath("/area-riservata/dashboard");
  return { ok: true };
}
