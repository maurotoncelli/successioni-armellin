"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { computeEsito, suggestedPackage, type Esito } from "@/lib/quote";
import { getPackages, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import { notifyAdminNewLead, notifyLeadRecap, siteBase } from "@/lib/notifications";
import type { Communication, LogEvent } from "@/content/crm-data";

export type LeadInput = {
  relation: string; // coniuge | figlio | genitore | fratello | nipote | altro
  heirs: string; // 1 | 2 | 3 | 4 | 5+
  hasRealEstate: string; // si | no | nonso
  realEstateCount?: number | null; // numero immobili, se hasRealEstate === "si"
  hasWill: string; // si | no | nonso
  hasOther: string; // si | no | nonso
  over100k?: string; // si | no | nonso - attivo oltre 100.000 EUR (solo linea retta senza immobili)
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
  /** true se l'email di riepilogo al visitatore e' partita davvero. */
  emailSent?: boolean;
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
        suggested_package: suggestedPackage(esito, input.hasRealEstate),
        notes: isCustom
          ? "Richiesta di preventivo su misura dal sito."
          : "Lead dal preventivo del sito (opt-in email).",
        communications: [],
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

    // Email REALI: riepilogo/conferma al visitatore + notifica immediata a
    // Lorenzo. Registrate in cronologia solo se l'invio e andato a buon fine;
    // un errore email non blocca mai la creazione del lead.
    const communications: Communication[] = [];
    const log: LogEvent[] = [{ action: "lead_creato", at: nowStamp }];
    let emailSent = false;
    try {
      // Pacchetto suggerito con prezzo (per il riepilogo e per Lorenzo).
      let packageLabel: string | undefined;
      let recap: Parameters<typeof notifyLeadRecap>[1] | null = null;
      if (isCustom) {
        recap = { kind: "custom" };
      } else if (esito === "a") {
        recap = { kind: "esonero" };
      } else {
        const pkgKey = suggestedPackage(esito, input.hasRealEstate);
        if (pkgKey) {
          const [packages, addons] = await Promise.all([
            getPackages(),
            getAddons(),
          ]);
          const order = buildOrder(
            { packageKey: pkgKey, realEstateCount: input.realEstateCount },
            packages,
            addons,
          );
          const pkg = packages.find((p) => p.key === pkgKey);
          if (order && pkg) {
            packageLabel = `${pkg.name} (${order.total.toLocaleString("it-IT")} €)`;
            const base = siteBase();
            const params = new URLSearchParams({ pkg: pkgKey });
            if (input.realEstateCount)
              params.set("recount", String(input.realEstateCount));
            recap = {
              kind: "package",
              packageLabel: pkg.name,
              total: order.total,
              checkoutUrl: `${base}/checkout?${params.toString()}`,
            };
          }
        }
      }

      if (recap && input.email.trim()) {
        const sentRecap = await notifyLeadRecap(input.email.trim(), recap);
        emailSent = sentRecap.sent;
        if (sentRecap.sent) {
          communications.push({
            channel: "EMAIL",
            direction: "OUTBOUND",
            source: "AUTO",
            subject: sentRecap.subject,
            occurredAt: nowStamp,
          });
          log.push({ action: "email_inviata", at: nowStamp });
        }
      }

      const sentAdmin = await notifyAdminNewLead({
        practiceId: practice.id,
        practiceCode: practice.code,
        clientName: fullName,
        email: input.email.trim(),
        phone: input.phone.trim(),
        custom: isCustom,
        packageLabel,
      });
      if (sentAdmin.sent) {
        log.push({ action: "notifica_admin_inviata", at: nowStamp });
      }

      if (communications.length > 0 || log.length > 1) {
        await admin
          .from("practices")
          .update({ communications, log })
          .eq("id", practice.id);
      }
    } catch (err) {
      console.error("[preventivo] invio email lead fallito:", err);
    }

    revalidatePath("/crm");
    revalidatePath("/crm/pratiche");
    revalidatePath("/crm/contatti");

    return { ok: true, esito, code: practice.code, practiceId: practice.id, emailSent };
  } catch (err) {
    console.error("[preventivo] createLead errore:", err);
    return { ok: false, esito };
  }
}
