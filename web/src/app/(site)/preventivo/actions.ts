"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { PackageKey } from "@/lib/supabase/types";

export type LeadInput = {
  relation: string; // coniuge | figlio | genitore | fratello | nipote | altro
  heirs: string; // 1 | 2 | 3 | 4 | 5+
  hasRealEstate: string; // si | no | nonso
  realEstateCount?: number | null; // numero immobili, se hasRealEstate === "si"
  hasWill: string; // si | no | nonso
  hasOther: string; // si | no | nonso
  name: string;
  email: string;
  phone: string;
  marketing: boolean;
};

export type LeadResult = {
  ok: boolean;
  esito: "a" | "b" | "c";
  code?: string;
  practiceId?: string;
};

const relationLabels: Record<string, string> = {
  coniuge: "Coniuge",
  figlio: "Figlio/a",
  genitore: "Genitore",
  fratello: "Fratello/Sorella",
  nipote: "Nipote",
  altro: "Altro",
};

// Parenti in linea retta (discendenti/ascendenti): rientrano nei casi di
// possibile esonero dalla dichiarazione (art. 28 TUS) quando non ci sono immobili.
const directLineRelations = ["figlio", "genitore"];

function computeEsito(input: LeadInput): "a" | "b" | "c" {
  // Allineato a @04: casi incerti/complessi -> consulenza/su misura.
  if (input.hasOther === "si" || input.hasRealEstate === "nonso") return "c";
  if (input.hasRealEstate === "no" && directLineRelations.includes(input.relation))
    return "a";
  return "b";
}

function suggestedPackage(esito: "a" | "b" | "c"): PackageKey | null {
  if (esito === "a") return "SEMPLICE";
  if (esito === "b") return "COMPLETO";
  return null; // su misura
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { first: parts[0] ?? "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function createLead(input: LeadInput): Promise<LeadResult> {
  const esito = computeEsito(input);

  // Senza database configurato il sito resta funzionante: niente scrittura.
  if (!isAdminConfigured) return { ok: false, esito };

  try {
    const admin = getAdminClient();
    const { first, last } = splitName(input.name);
    // "5+" -> 5, "4" -> 4, ecc. parseInt ignora il "+" finale.
    const heirsCount = Number.parseInt(input.heirs || "0", 10) || 0;
    const fullName = input.name.trim() || `${first} ${last}`.trim();
    const nowStamp = new Date().toISOString().slice(0, 16).replace("T", " ");

    const { data: contact, error: contactErr } = await admin
      .from("contacts")
      .insert({
        first_name: first || fullName || "Contatto",
        last_name: last,
        email: input.email.trim() || null,
        phone: input.phone.trim() || null,
        source: "Form sito",
        marketing_consent: input.marketing,
        last_activity: isoDate(),
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
        client_name: fullName || "Nuovo lead",
        client_email: input.email.trim(),
        client_phone: input.phone.trim(),
        relation: relationLabels[input.relation] ?? input.relation,
        heirs_count: heirsCount,
        has_will: input.hasWill === "si",
        has_real_estate: input.hasRealEstate === "si",
        real_estate_count:
          input.hasRealEstate === "si" ? (input.realEstateCount ?? null) : null,
        requires_custom_quote: esito === "c",
        suggested_package: suggestedPackage(esito),
        notes: "Lead dal form preventivo del sito.",
        communications: [
          {
            channel: "EMAIL",
            direction: "OUTBOUND",
            source: "AUTO",
            subject: "Abbiamo ricevuto la tua richiesta",
            occurredAt: nowStamp,
          },
        ],
        tasks: [
          {
            title: `Richiamare ${fullName || "il contatto"} per consulenza`,
            dueDate: isoDate(2),
            done: false,
          },
        ],
        log: [{ action: "lead_creato", at: nowStamp }],
      })
      .select("id, code")
      .single();
    if (practiceErr) throw practiceErr;

    revalidatePath("/crm");
    revalidatePath("/crm/pratiche");
    revalidatePath("/crm/contatti");

    return { ok: true, esito, code: practice.code, practiceId: practice.id };
  } catch (err) {
    console.error("[preventivo] createLead errore:", err);
    return { ok: false, esito };
  }
}
