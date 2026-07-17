import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { findContactIdByEmail } from "@/lib/profiles";
import type { ContactRow } from "@/lib/supabase/types";

/*
  Anagrafica contacts: upsert per email (evita duplicati SoftLead/checkout
  ripetuti). Usato da createLead e webhook Stripe.
*/

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export type UpsertContactInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  source: string;
  marketingConsent?: boolean;
};

/** Trova il contatto per email o lo crea. Aggiorna campi vuoti se gia esiste. */
export async function upsertContactByEmail(
  input: UpsertContactInput,
): Promise<string | null> {
  const email = input.email.trim();
  if (!email || !isAdminConfigured) return null;

  const admin = getAdminClient();
  const existingId = await findContactIdByEmail(email);

  if (existingId) {
    const { data: row } = await admin
      .from("contacts")
      .select("first_name, last_name, phone, marketing_consent")
      .eq("id", existingId)
      .maybeSingle();

    const patch: Partial<ContactRow> = { last_activity: isoDate() };
    const placeholderNames = new Set(["", "cliente", "contatto", "nuovo lead"]);
    const curFirst = (row?.first_name ?? "").trim();
    if (
      input.firstName?.trim() &&
      (!curFirst || placeholderNames.has(curFirst.toLowerCase()))
    ) {
      patch.first_name = input.firstName.trim();
    }
    if (input.lastName?.trim() && !(row?.last_name ?? "").trim()) {
      patch.last_name = input.lastName.trim();
    }
    if (input.phone?.trim() && !(row?.phone ?? "").trim()) {
      patch.phone = input.phone.trim();
    }
    if (input.marketingConsent && !row?.marketing_consent) {
      patch.marketing_consent = true;
    }

    const { error } = await admin
      .from("contacts")
      .update(patch)
      .eq("id", existingId);
    if (error) {
      console.error("[contacts] upsert update:", error.message);
      return existingId; // comunque riusabile
    }
    return existingId;
  }

  const { data, error } = await admin
    .from("contacts")
    .insert({
      first_name: input.firstName?.trim() || "Cliente",
      last_name: input.lastName?.trim() || "",
      email,
      phone: input.phone?.trim() || null,
      source: input.source,
      marketing_consent: Boolean(input.marketingConsent),
      last_activity: isoDate(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[contacts] upsert insert:", error.message);
    return null;
  }
  return data.id;
}
