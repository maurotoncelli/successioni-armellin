"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { computeEsito, suggestedPackage, type Esito } from "@/lib/quote";

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
  /** Da dove arriva il lead: opt-in email sul risultato o richiesta su misura. */
  kind?: "email_quote" | "custom_quote";
};

export type LeadResult = {
  ok: boolean;
  esito: Esito;
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
    const isCustom = input.kind === "custom_quote" || esito === "c";
    const source =
      input.kind === "custom_quote"
        ? "Richiesta preventivo su misura (sito)"
        : input.kind === "email_quote"
          ? "Preventivo via email (sito)"
          : "Form sito";

    const { data: contact, error: contactErr } = await admin
      .from("contacts")
      .insert({
        first_name: first || fullName || "Contatto",
        last_name: last,
        email: input.email.trim() || null,
        phone: input.phone.trim() || null,
        source,
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
        requires_custom_quote: isCustom,
        suggested_package: suggestedPackage(esito),
        notes: isCustom
          ? "Richiesta di preventivo su misura dal sito."
          : "Lead dal preventivo del sito (opt-in email).",
        communications: [
          {
            channel: "EMAIL",
            direction: "OUTBOUND",
            source: "AUTO",
            subject: isCustom
              ? "Abbiamo ricevuto la tua richiesta di preventivo su misura"
              : "Ecco il tuo preventivo",
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
