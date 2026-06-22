"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase/admin";
import type { PackageKey } from "@/lib/supabase/types";

/*
  Creazione manuale di una pratica dal CRM (@05): Lorenzo apre una pratica per un
  cliente arrivato per telefono/di persona. Crea contatto + pratica (LEAD) via
  service_role. Riusa le stesse colonne/jsonb del lead da sito.
*/

export type NewPracticeInput = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  relation: string;
  deceasedName: string;
  deceasedCf: string;
  dateOfDeath: string;
  residence: string;
  heirsCount: string;
  hasRealEstate: boolean;
  realEstateCount: string;
  hasWill: boolean;
  urgent: boolean;
  selectedPackage: string; // PackageKey | ""
  notes: string;
};

export type NewPracticeResult =
  | { ok: true; practiceId: string; code: string }
  | { ok: false; error: string };

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { first: parts[0] ?? "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const PACKAGE_KEYS: PackageKey[] = ["SEMPLICE", "COMPLETO", "ZERO_STRESS"];

export async function createPractice(
  input: NewPracticeInput,
): Promise<NewPracticeResult> {
  await requireAdmin();

  const clientName = input.clientName.trim();
  if (!clientName) return { ok: false, error: "Il nome del cliente è obbligatorio." };

  const admin = getAdminClient();
  const { first, last } = splitName(clientName);
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const today = new Date().toISOString().slice(0, 10);
  const pkg = PACKAGE_KEYS.includes(input.selectedPackage as PackageKey)
    ? (input.selectedPackage as PackageKey)
    : null;
  const heirs = Number.parseInt(input.heirsCount || "0", 10) || 1;
  const realEstateCount = input.hasRealEstate
    ? Number.parseInt(input.realEstateCount || "0", 10) || null
    : null;

  try {
    const { data: contact, error: contactErr } = await admin
      .from("contacts")
      .insert({
        first_name: first || clientName,
        last_name: last,
        email: input.clientEmail.trim() || null,
        phone: input.clientPhone.trim() || null,
        source: "Inserimento manuale (CRM)",
        marketing_consent: false,
        last_activity: today,
      })
      .select("id")
      .single();
    if (contactErr) throw contactErr;

    const { data: practice, error: practiceErr } = await admin
      .from("practices")
      .insert({
        status: "LEAD",
        action_owner: "ADMIN",
        contact_id: contact.id,
        client_name: clientName,
        client_email: input.clientEmail.trim(),
        client_phone: input.clientPhone.trim(),
        relation: input.relation.trim(),
        deceased_name: input.deceasedName.trim(),
        deceased_cf: input.deceasedCf.trim().toUpperCase(),
        date_of_death: input.dateOfDeath || null,
        residence: input.residence.trim(),
        heirs_count: heirs,
        has_will: input.hasWill,
        has_real_estate: input.hasRealEstate,
        real_estate_count: realEstateCount,
        urgent: input.urgent,
        suggested_package: pkg,
        selected_package: pkg,
        notes: input.notes.trim() || "Pratica creata manualmente dal CRM.",
        log: [{ action: "pratica_creata_manuale", at: now }],
      })
      .select("id, code")
      .single();
    if (practiceErr) throw practiceErr;

    revalidatePath("/crm");
    revalidatePath("/crm/pratiche");
    revalidatePath("/crm/contatti");

    return { ok: true, practiceId: practice.id, code: practice.code };
  } catch (err) {
    console.error("[crm] createPractice:", err);
    return { ok: false, error: "Creazione non riuscita. Riprova." };
  }
}
