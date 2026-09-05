"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import {
  computeEsito,
  heirsSummary,
  isAllDirectLine,
  suggestedPackage,
  totalHeirs,
  type Esito,
  type HeirsComposition,
} from "@/lib/quote";
import { getPackages, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import { notifyAdminNewLead, notifyLeadRecap, siteBase } from "@/lib/notifications";
import { pushCrmNotification } from "@/lib/crm-notifications";
import { upsertContactByEmail } from "@/lib/contacts";
import { readRequestAttribution } from "@/lib/attribution";
import {
  attributionSourceLabel,
  parseAttribution,
} from "@/lib/attribution-shared";
import { getActionLocale } from "@/lib/action-locale";
import { obj } from "@/lib/content";
import { quizNotificationText, type QuizSnapshot } from "@/lib/quiz-summary";
import type { Communication, LogEvent } from "@/content/crm-data";

export type LeadInput = {
  /** Composizione eredi per tipo (nuovo quiz); null se non disponibile. */
  heirsComposition: HeirsComposition | null;
  heirs: string; // numero totale eredi (stringa, compatibilita col flusso esistente)
  hasRealEstate: string; // si | no | nonso
  realEstateCount?: number | null; // numero immobili, se hasRealEstate === "si"
  hasWill: string; // si | no | nonso
  hasOther: string; // si | no | nonso
  over100k?: string; // si | no | nonso - attivo oltre 100.000 EUR (solo linea retta senza immobili)
  name: string;
  email: string;
  phone: string;
  /** Nota libera del visitatore (opzionale, tipicamente su misura). */
  notes?: string;
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
  const esito = computeEsito({
    hasWill: input.hasWill,
    allDirectLine: input.heirsComposition
      ? isAllDirectLine(input.heirsComposition)
      : false,
    hasRealEstate: input.hasRealEstate,
    realEstateCount: input.realEstateCount,
    hasOther: input.hasOther,
    over100k: input.over100k,
  });

  // Senza database configurato il sito resta funzionante: niente scrittura.
  if (!isAdminConfigured) return { ok: false, esito };

  try {
    const admin = getAdminClient();
    const { first, last } = splitName(input.name);
    const heirsCount = input.heirsComposition
      ? totalHeirs(input.heirsComposition)
      : Number.parseInt(input.heirs || "0", 10) || 0;
    const fullName = input.name.trim() || `${first} ${last}`.trim();
    const nowStamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const isCustom = input.kind === "custom_quote" || esito === "c";
    const fallbackSource =
      input.kind === "custom_quote"
        ? "Richiesta preventivo su misura (sito)"
        : input.kind === "email_quote"
          ? "Preventivo via email (sito)"
          : "Form sito";
    const attribution = parseAttribution(await readRequestAttribution());
    const source = attributionSourceLabel(attribution, fallbackSource);

    const emailNorm = input.email.trim();
    const contactId = await upsertContactByEmail({
      email: emailNorm,
      firstName: first || fullName || "Contatto",
      lastName: last,
      phone: input.phone.trim() || null,
      source,
      marketingConsent: input.marketing,
      attribution,
    });
    if (!contactId) throw new Error("Impossibile creare/aggiornare il contatto.");

    // Fotografia del questionario in chiaro (etichette IT per il CRM): esito,
    // pacchetto consigliato con la cifra esatta e risposte date. Finisce nel log
    // della pratica e, per l'esito B, anche in price/line_items cosi Lorenzo
    // vede subito l'onorario preventivato senza aspettare il checkout.
    const pkgKey = isCustom ? null : suggestedPackage(esito, input.hasRealEstate);
    let orderIt: ReturnType<typeof buildOrder> = null;
    let pkgNameIt: string | null = null;
    if (pkgKey) {
      const [packagesIt, addonsIt] = await Promise.all([getPackages("it"), getAddons("it")]);
      orderIt = buildOrder(
        { packageKey: pkgKey, realEstateCount: input.realEstateCount, heirsCount },
        packagesIt,
        addonsIt,
      );
      pkgNameIt = packagesIt.find((p) => p.key === pkgKey)?.name ?? null;
    }
    const snapshotLocale = await getActionLocale();
    const snapshot: QuizSnapshot = {
      esito,
      packageKey: pkgKey,
      packageName: pkgNameIt,
      lineItems: orderIt?.lineItems.map((li) => ({ key: li.key, label: li.label, amount: li.amount })),
      total: orderIt?.total ?? null,
      answers: {
        hasWill: input.hasWill,
        heirs: input.heirsComposition,
        heirsTotal: heirsCount,
        hasRealEstate: input.hasRealEstate,
        realEstateCount: input.realEstateCount ?? null,
        hasOther: input.hasOther,
        over100k: input.over100k,
      },
      locale: snapshotLocale,
    };
    const initialLog: LogEvent[] = [
      { action: "questionario_compilato", at: nowStamp, quiz: snapshot },
      { action: "lead_creato", at: nowStamp },
    ];

    const { data: practice, error: practiceErr } = await admin
      .from("practices")
      .insert({
        status: "LEAD",
        action_owner: "ADMIN",
        contact_id: contactId,
        client_name: fullName || "Nuovo lead",
        client_email: emailNorm,
        client_phone: input.phone.trim(),
        // Nel campo relation salviamo la composizione degli eredi in chiaro
        // (es. "Coniuge + 2 figli"): e' l'informazione utile per Lorenzo.
        relation: input.heirsComposition
          ? heirsSummary(input.heirsComposition)
          : "",
        heirs_count: heirsCount,
        has_will: input.hasWill === "si",
        has_real_estate: input.hasRealEstate === "si",
        real_estate_count:
          input.hasRealEstate === "si" ? (input.realEstateCount ?? null) : null,
        requires_custom_quote: isCustom,
        suggested_package: suggestedPackage(esito, input.hasRealEstate),
        // Onorario preventivato (esito B): cifra esatta visibile nel CRM da
        // subito. Verra' comunque ricalcolato alla creazione del link Stripe.
        ...(orderIt ? { price: orderIt.total, line_items: orderIt.lineItems } : {}),
        notes: (() => {
          const base = isCustom
            ? "Richiesta di preventivo su misura dal sito."
            : "Lead dal preventivo del sito (opt-in email).";
          const extra = input.notes?.trim();
          return extra ? `${base}\n\nNota del cliente:\n${extra}` : base;
        })(),
        communications: [],
        tasks: [
          {
            title: `Richiamare ${fullName || "il contatto"} per consulenza`,
            dueDate: isoDate(2),
            done: false,
          },
        ],
        log: initialLog,
        attribution,
      })
      .select("id, code")
      .single();
    if (practiceErr) throw practiceErr;

    // Email REALI: riepilogo/conferma al visitatore + notifica immediata a
    // Lorenzo. Registrate in cronologia solo se l'invio e andato a buon fine;
    // un errore email non blocca mai la creazione del lead.
    const communications: Communication[] = [];
    const log: LogEvent[] = [...initialLog];
    let emailSent = false;
    try {
      // Pacchetto suggerito con prezzo (per il riepilogo e per Lorenzo).
      // Locale da cookie UI (qui non c'è ancora account / comms_locale).
      const locale = snapshotLocale;
      const checkoutUi = obj(
        "site_ui",
        "checkout_ui",
        {
          extra_property: "Immobili aggiuntivi ({extra} × {fee}€)",
          extra_heir: "Eredi aggiuntivi ({extra} × {fee}€)",
        },
        locale,
      );

      // packageLabel admin = sempre IT (CRM/Lorenzo); recap cliente = locale UI.
      let packageLabelAdmin: string | undefined;
      let recap: Parameters<typeof notifyLeadRecap>[1] | null = null;
      if (isCustom) {
        recap = { kind: "custom", locale };
      } else if (esito === "a") {
        recap = { kind: "esonero", locale };
      } else {
        const pkgKey = suggestedPackage(esito, input.hasRealEstate);
        if (pkgKey) {
          const [packagesUi, addonsUi, packagesIt] = await Promise.all([
            getPackages(locale),
            getAddons(locale),
            getPackages("it"),
          ]);
          const order = buildOrder(
            {
              packageKey: pkgKey,
              realEstateCount: input.realEstateCount,
              heirsCount,
            },
            packagesUi,
            addonsUi,
            {
              extraProperty: checkoutUi.extra_property,
              extraHeir: checkoutUi.extra_heir,
            },
          );
          const pkgUi = packagesUi.find((p) => p.key === pkgKey);
          const pkgIt = packagesIt.find((p) => p.key === pkgKey);
          if (order && pkgUi) {
            packageLabelAdmin = `${pkgIt?.name ?? pkgUi.name} (${order.total.toLocaleString("it-IT")} €)`;
            const base = siteBase();
            // Importante: riusa la pratica SoftLead (practice=), altrimenti il
            // checkout creerebbe una SECONDA pratica anonima e il lead originale
            // resterebbe orfano / duplicato.
            const params = new URLSearchParams({
              pkg: pkgKey,
              practice: practice.id,
            });
            if (input.realEstateCount)
              params.set("recount", String(input.realEstateCount));
            recap = {
              kind: "package",
              packageLabel: pkgUi.name,
              total: order.total,
              checkoutUrl: `${base}/checkout?${params.toString()}`,
              locale,
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
        packageLabel: packageLabelAdmin,
        clientNote: input.notes?.trim() || undefined,
        quizLines: quizNotificationText(snapshot, new Date().toISOString(), "").body
          .split("\n")
          .map((l) => l.replace(/ · $/, ""))
          .filter(Boolean),
      });
      if (sentAdmin.sent) {
        log.push({ action: "notifica_admin_inviata", at: nowStamp });
      }

      if (communications.length > 0 || log.length > initialLog.length) {
        await admin
          .from("practices")
          .update({ communications, log })
          .eq("id", practice.id);
      }
    } catch (err) {
      console.error("[preventivo] invio email lead fallito:", err);
    }

    // Notifica CRM con l'esito in chiaro: chi e', cosa gli e' stato proposto
    // (cifra esatta), cosa ha risposto e quando (ora italiana).
    const contactLine = [fullName || "Contatto senza nome", emailNorm, input.phone.trim()]
      .filter(Boolean)
      .join(" · ");
    const notif = quizNotificationText(snapshot, new Date().toISOString(), contactLine);
    const clientNote = input.notes?.trim();
    await pushCrmNotification({
      kind: "lead",
      title: `${isCustom ? "Richiesta su misura" : "Nuovo lead"} — ${notif.title}`,
      body: clientNote ? `${notif.body}\nNota del cliente: ${clientNote}` : notif.body,
      practiceId: practice.id,
      practiceCode: practice.code,
    });

    revalidatePath("/crm");
    revalidatePath("/crm/pratiche");
    revalidatePath("/crm/contatti");

    return { ok: true, esito, code: practice.code, practiceId: practice.id, emailSent };
  } catch (err) {
    console.error("[preventivo] createLead errore:", err);
    return { ok: false, esito };
  }
}
