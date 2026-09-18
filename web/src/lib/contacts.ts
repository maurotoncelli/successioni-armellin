import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { findContactIdByEmail, findContactIdByPhone } from "@/lib/profiles";
import type { ContactRow } from "@/lib/supabase/types";
import {
  attributionSourceLabel,
  mergeAttribution,
  parseAttribution,
  type Attribution,
} from "@/lib/attribution-shared";

/*
  Anagrafica contacts: upsert per email o telefono (evita duplicati SoftLead /
  checkout ripetuti, e i "fatti richiamare" senza email). Usato da createLead
  e webhook Stripe.
*/

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export type UpsertContactInput = {
  email?: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  source: string;
  marketingConsent?: boolean;
  attribution?: Attribution | null;
};

/**
  Trova il contatto per email, altrimenti per telefono, o lo crea.
  Serve anche ai lead "fatti richiamare" senza email.
*/
export async function upsertContactByEmail(
  input: UpsertContactInput,
): Promise<string | null> {
  const email = (input.email ?? "").trim();
  const phone = (input.phone ?? "").trim();
  if ((!email && !phone) || !isAdminConfigured) return null;

  const admin = getAdminClient();
  const existingId = email
    ? await findContactIdByEmail(email)
    : await findContactIdByPhone(phone);

  if (existingId) {
    const { data: row } = await admin
      .from("contacts")
      .select("first_name, last_name, email, phone, marketing_consent, source, attribution")
      .eq("id", existingId)
      .maybeSingle();

    const patch: Partial<ContactRow> = { last_activity: isoDate() };
    const merged = mergeAttribution(
      parseAttribution(row?.attribution),
      input.attribution,
    );
    if (Object.keys(merged).length > 0) {
      patch.attribution = merged;
      const labeled = attributionSourceLabel(merged, row?.source || input.source);
      const current = row?.source ?? "";
      const generic =
        !current ||
        /form sito|preventivo|checkout sito|registrazione/i.test(current);
      if (labeled && (generic || labeled.startsWith("Google Ads"))) {
        patch.source = labeled;
      }
    }
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
    if (phone && !(row?.phone ?? "").trim()) {
      patch.phone = phone;
    }
    if (email && !(row?.email ?? "").trim()) {
      patch.email = email;
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
      email: email || null,
      phone: phone || null,
      source: attributionSourceLabel(
        parseAttribution(input.attribution),
        input.source,
      ),
      attribution: parseAttribution(input.attribution),
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
