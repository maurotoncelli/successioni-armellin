import type { PackageKey } from "@/lib/supabase/types";
import type { Esito, HeirsComposition } from "@/lib/quote";
import { heirsSummary, totalHeirs } from "@/lib/quote";

/*
  Riepilogo LEGGIBILE (italiano, per Lorenzo) di un questionario del sito.
  Niente "esito a/b/c": il CRM mostra cosa ha visto il visitatore (pacchetto
  consigliato con la cifra esatta, possibile esonero, preventivo su misura),
  le risposte date e l'orario italiano. Funzioni pure: usate da notifiche,
  scheda pratica, kanban e alert.
*/

export type QuizLineItem = { key?: string; label: string; amount: number };

export type QuizSnapshot = {
  esito: Esito;
  /** Pacchetto consigliato (esito B) — chiave e nome IT. */
  packageKey: PackageKey | null;
  packageName?: string | null;
  /** Righe e totale onorario calcolati dalle risposte (esito B). */
  lineItems?: QuizLineItem[];
  total?: number | null;
  answers: {
    hasWill: string; // si | no | nonso | ""
    heirs: HeirsComposition | null;
    heirsTotal: number;
    hasRealEstate: string; // si | no | nonso | ""
    realEstateCount: number | null;
    hasOther: string; // si | no | nonso | ""
    over100k?: string; // si | no | nonso | undefined (non chiesta)
  };
  /** Lingua del sito in cui e' stato compilato (es. "it", "en"). */
  locale?: string;
};

export const PACKAGE_NAMES_IT: Record<Exclude<PackageKey, null>, string> = {
  SEMPLICE: "Successione Semplice",
  COMPLETO: "Successione con Immobili",
  ZERO_STRESS: "Successione Estesa",
};

export function packageNameIt(key: PackageKey | null | undefined): string {
  if (!key) return "—";
  return PACKAGE_NAMES_IT[key] ?? key;
}

export function formatEuro(amount: number): string {
  return `${amount.toLocaleString("it-IT")} €`;
}

function yesNo(v: string | undefined): string {
  if (v === "si") return "sì";
  if (v === "no") return "no";
  if (v === "nonso") return "non lo sa";
  return "—";
}

/** Titolo dell'esito in chiaro, es. "Pacchetto consigliato: Successione con Immobili · 670 €". */
export function esitoTitle(s: Pick<QuizSnapshot, "esito" | "packageKey" | "packageName" | "total">): string {
  if (s.esito === "a") return "Possibile esonero: dichiarazione forse non dovuta";
  if (s.esito === "c") return "Preventivo su misura richiesto";
  const name = s.packageName || packageNameIt(s.packageKey);
  const total = typeof s.total === "number" && s.total > 0 ? ` · ${formatEuro(s.total)}` : "";
  return `Pacchetto consigliato: ${name}${total}`;
}

/** Etichetta corta per badge (kanban, tabella), es. "Con Immobili · 670 €". */
export function esitoShort(s: Pick<QuizSnapshot, "esito" | "packageKey" | "total">): string {
  if (s.esito === "a") return "Possibile esonero";
  if (s.esito === "c") return "Su misura";
  const short =
    s.packageKey === "SEMPLICE"
      ? "Semplice"
      : s.packageKey === "COMPLETO"
        ? "Con Immobili"
        : s.packageKey === "ZERO_STRESS"
          ? "Estesa"
          : "Pacchetto";
  const total = typeof s.total === "number" && s.total > 0 ? ` · ${formatEuro(s.total)}` : "";
  return `${short}${total}`;
}

/** Perche' e' finito su misura (esito C) o in esonero (esito A). */
export function esitoReason(s: QuizSnapshot): string | null {
  const a = s.answers;
  if (s.esito === "c") {
    const reasons: string[] = [];
    if (a.hasOther === "si") reasons.push("ha altri beni (quote societarie, aziende, imbarcazioni…)");
    if (a.hasRealEstate === "nonso") reasons.push("non sa se ci sono immobili");
    return reasons.length > 0 ? `Motivo: ${reasons.join("; ")}.` : "Motivo: richiesta esplicita del visitatore.";
  }
  if (s.esito === "a") {
    return "Motivo: solo coniuge/linea retta, nessun immobile e attivo dichiarato sotto i 100.000 €. Da verificare sul caso concreto.";
  }
  return null;
}

/** Dettaglio prezzo, es. "490 € pacchetto + 60 € Immobili aggiuntivi (1 × 60€) = 670 €". */
export function priceBreakdown(s: Pick<QuizSnapshot, "lineItems" | "total">): string | null {
  const items = s.lineItems ?? [];
  if (items.length === 0) return null;
  if (items.length === 1) return formatEuro(items[0].amount);
  const parts = items.map((li, i) =>
    i === 0 ? `${formatEuro(li.amount)} pacchetto` : `${formatEuro(li.amount)} ${li.label}`,
  );
  const total = s.total ?? items.reduce((sum, li) => sum + li.amount, 0);
  return `${parts.join(" + ")} = ${formatEuro(total)}`;
}

/** Risposte del questionario in una riga, per notifiche ed email. */
export function answersLine(s: QuizSnapshot): string {
  const a = s.answers;
  const heirs = a.heirs ? `${totalHeirs(a.heirs)} (${heirsSummary(a.heirs)})` : String(a.heirsTotal || "—");
  const immobili =
    a.hasRealEstate === "si"
      ? a.realEstateCount
        ? `sì, ${a.realEstateCount}`
        : "sì"
      : yesNo(a.hasRealEstate);
  const parts = [
    `Testamento: ${yesNo(a.hasWill)}`,
    `Eredi: ${heirs}`,
    `Immobili: ${immobili}`,
    `Altri beni: ${yesNo(a.hasOther)}`,
  ];
  if (a.over100k) parts.push(`Attivo oltre 100.000 €: ${yesNo(a.over100k)}`);
  return parts.join(" · ");
}

/** Coppie etichetta/valore per la scheda pratica. */
export function answersFields(s: QuizSnapshot): { label: string; value: string }[] {
  const a = s.answers;
  const fields = [
    { label: "Testamento", value: yesNo(a.hasWill) },
    {
      label: "Eredi",
      value: a.heirs ? `${totalHeirs(a.heirs)} · ${heirsSummary(a.heirs)}` : String(a.heirsTotal || "—"),
    },
    {
      label: "Immobili",
      value:
        a.hasRealEstate === "si"
          ? `sì${a.realEstateCount ? ` · ${a.realEstateCount}` : ""}`
          : yesNo(a.hasRealEstate),
    },
    { label: "Altri beni (quote, aziende, barche…)", value: yesNo(a.hasOther) },
  ];
  if (a.over100k) fields.push({ label: "Attivo oltre 100.000 €", value: yesNo(a.over100k) });
  if (s.locale) fields.push({ label: "Lingua del sito", value: s.locale.toUpperCase() });
  return fields;
}

export type QuizOrigin = "lead" | "custom_quote" | "checkout" | "unknown";

export type PracticeQuiz = {
  snapshot: QuizSnapshot;
  /** Stamp dell'evento (UTC "YYYY-MM-DD HH:mm" o ISO). */
  at: string | null;
  origin: QuizOrigin;
  /** true = ricostruito dai campi salvati (pratica senza fotografia del quiz). */
  derived: boolean;
};

type PracticeLike = {
  log: { action: string; at: string; quiz?: QuizSnapshot }[];
  requiresCustomQuote: boolean;
  suggestedPackage: PackageKey | null;
  selectedPackage: PackageKey | null;
  price: number;
  lineItems: { label: string; amount: number }[];
  hasWill: boolean;
  hasRealEstate: boolean;
  realEstateCount: number | null;
  heirsCount: number;
  notes: string;
};

/*
  Questionario associato a una pratica. Prima la fotografia salvata nel log
  ("questionario_compilato"); per le pratiche create prima di questa modifica
  si ricostruisce il possibile dai campi della riga. Null = pratica creata a
  mano nel CRM (nessun questionario).
*/
export function quizFromPractice(p: PracticeLike): PracticeQuiz | null {
  const shot = p.log.find((e) => e.quiz && e.action === "questionario_compilato");
  const leadEvt = p.log.find((e) => e.action === "lead_creato");
  const checkoutEvt = p.log.find((e) => e.action === "checkout_avviato");
  const origin: QuizOrigin = checkoutEvt
    ? "checkout"
    : leadEvt
      ? p.requiresCustomQuote || /su misura/i.test(p.notes)
        ? "custom_quote"
        : "lead"
      : "unknown";

  if (shot?.quiz) {
    return { snapshot: shot.quiz, at: shot.at, origin, derived: false };
  }
  if (!leadEvt && !checkoutEvt) return null;

  const packageKey = p.selectedPackage ?? p.suggestedPackage;
  const esito: Esito = p.requiresCustomQuote ? "c" : "b";
  const lineItems = p.lineItems.map((li) => ({ label: li.label, amount: li.amount }));
  return {
    snapshot: {
      esito,
      packageKey: esito === "c" ? null : packageKey,
      lineItems: lineItems.length > 0 ? lineItems : undefined,
      total: p.price > 0 ? p.price : null,
      answers: {
        hasWill: p.hasWill ? "si" : "no",
        heirs: null,
        heirsTotal: p.heirsCount,
        hasRealEstate: p.hasRealEstate ? "si" : "no",
        realEstateCount: p.realEstateCount,
        hasOther: "",
      },
    },
    at: (checkoutEvt ?? leadEvt)?.at ?? null,
    origin,
    derived: true,
  };
}

export const QUIZ_ORIGIN_IT: Record<QuizOrigin, string> = {
  lead: "Ha chiesto il preventivo via email dal risultato del sito",
  custom_quote: "Ha chiesto di essere ricontattato per un preventivo su misura",
  checkout: "Ha cliccato «Paga» dal risultato del sito (checkout Stripe)",
  unknown: "Questionario del sito",
};

/**
 * Testo della notifica CRM per un questionario: titolo in chiaro + righe del
 * corpo (onorario dettagliato, motivo, risposte, orario italiano, contatto).
 */
export function quizNotificationText(
  snapshot: QuizSnapshot,
  at: string,
  contactLine: string,
): { title: string; body: string } {
  const lines: string[] = [];
  const price = snapshot.esito === "b" ? priceBreakdown(snapshot) : null;
  if (price && (snapshot.lineItems?.length ?? 0) > 1) lines.push(`Onorario: ${price}`);
  const reason = esitoReason(snapshot);
  if (reason) lines.push(reason);
  lines.push(answersLine(snapshot));
  const when = `Compilato il ${formatDateAtTimeIt(at)} (ora italiana)`;
  const lang =
    snapshot.locale && snapshot.locale !== "it" ? ` · sito in ${snapshot.locale.toUpperCase()}` : "";
  lines.push(`${when}${lang} · ${contactLine}`);
  return { title: esitoTitle(snapshot), body: lines.join("\n") };
}

/*
  Orario italiano. Gli stamp del CRM sono "YYYY-MM-DD HH:mm" in UTC (senza
  suffisso); gli ISO hanno la Z. Qui si normalizza tutto a Europe/Rome.
*/
export function parseStamp(raw: string | null | undefined): Date | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  let iso = s;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) iso = `${s.replace(" ", "T")}Z`;
  else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s)) iso = `${s}Z`;
  else if (/^\d{4}-\d{2}-\d{2}$/.test(s)) iso = `${s}T00:00:00Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const DATE_TIME_IT = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const DATE_IT = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const TIME_IT = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  hour: "2-digit",
  minute: "2-digit",
});

/** "sab 5 set 2026, 12:58" (ora italiana). Se non parsabile, restituisce il testo grezzo. */
export function formatDateTimeIt(raw: string | null | undefined): string {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return formatDateIt(raw);
  const d = parseStamp(raw);
  return d ? DATE_TIME_IT.format(d) : (raw ?? "—");
}

/** "05/09/2026 alle 12:58". */
export function formatDateAtTimeIt(raw: string | null | undefined): string {
  const d = parseStamp(raw);
  return d ? `${DATE_IT.format(d)} alle ${TIME_IT.format(d)}` : (raw ?? "—");
}

/** Solo data italiana "05/09/2026" (per colonne che avevano la sola data). */
export function formatDateIt(raw: string | null | undefined): string {
  const d = parseStamp(raw);
  return d ? DATE_IT.format(d) : (raw ?? "—");
}

/* Copia locale di statusLabels (crm-data) per non importare le fixture qui. */
const STATUS_LABELS_IT: Record<string, string> = {
  LEAD: "Nuovo Lead",
  PREVENTIVO_INVIATO: "Preventivo Inviato",
  PAGATO: "Pagato / Incaricato",
  ATTESA_DOC: "In Attesa Documenti",
  LAVORAZIONE: "In Lavorazione",
  INVIATA: "Inviata / Attesa AdE",
  CHIUSA: "Chiusa",
  ANNULLATA: "Persa / Annullata",
};

/** Etichette italiane degli eventi in timeline (chiavi tecniche del log). */
const LOG_LABELS_IT: Record<string, string> = {
  lead_creato: "Lead creato dal sito",
  questionario_compilato: "Questionario del sito compilato",
  checkout_avviato: "Checkout avviato dal sito (in attesa di pagamento)",
  pratica_creata_manuale: "Pratica creata a mano nel CRM",
  email_inviata: "Email inviata al cliente",
  notifica_admin_inviata: "Notifica email a Lorenzo",
  preventivo_inviato: "Preventivo inviato",
  pagamento_ricevuto: "Pagamento ricevuto",
  pagamento_offline: "Pagamento registrato a mano",
  rimborso_stripe_avviato: "Rimborso Stripe avviato",
  rimborso_totale: "Rimborso totale",
  rimborso_parziale: "Rimborso parziale",
  checklist_generata: "Checklist documenti generata",
  voce_checklist_aggiunta: "Voce checklist aggiunta",
  voce_checklist_rimossa: "Voce checklist rimossa",
  bozza_notificata: "Bozza precompilata inviata al cliente",
  bozza_rimossa: "Bozza precompilata rimossa",
  documento_approvato: "Documento approvato",
  documento_rifiutato: "Documento rifiutato",
  documento_ricaricato_dopo_rifiuto: "Documento ricaricato dopo rifiuto",
  documenti_approvati: "Tutti i documenti approvati",
  documenti_pronti_notificati: "Cliente avvisato: documenti pronti",
  DOCUMENTS_SUBMITTED: "Cliente ha premuto «Ho finito» (documenti inviati)",
  consegna_auto_sla: "Consegna prevista calcolata (SLA)",
  contatto_non_agganciato: "Contatto non agganciato al pagamento",
  imposte_comunicate: "Imposte comunicate al cliente",
  fattura_emessa: "Fattura emessa",
  estrazione_ai: "Dati estratti dai documenti (AI)",
  dati_estratti_revisionati: "Dati estratti revisionati",
  export_xml_suc: "Export XML per Successioni Online",
  dichiarazione_presentata: "Dichiarazione presentata all'AdE",
  pratica_chiusa: "Pratica chiusa",
  email_recensione_programmata: "Email richiesta recensione programmata",
  recesso_richiesto: "Recesso richiesto dal cliente",
  "recesso:REQUESTED": "Recesso richiesto",
  "recesso:IN_REVIEW": "Recesso in gestione",
  "recesso:ACCEPTED": "Recesso accettato",
  "recesso:REJECTED": "Recesso respinto",
  iban_cancellato: "IBAN cancellato",
  todo_aggiunto: "Cosa da fare aggiunta",
  nota_aggiunta: "Nota aggiunta",
  comunicazione_registrata: "Comunicazione registrata",
  appunti_chiamata_aggiornati: "Appunti chiamata aggiornati",
};

export function logLabelIt(action: string): string {
  if (LOG_LABELS_IT[action]) return LOG_LABELS_IT[action];
  const sep = action.indexOf(":");
  if (sep > 0) {
    const base = action.slice(0, sep);
    const detail = action.slice(sep + 1);
    if (base === "cambio_stato") return `Stato cambiato → ${STATUS_LABELS_IT[detail] ?? detail}`;
    if (base === "imposte_comunicate") return `Imposte comunicate al cliente: ${detail} €`;
    if (base === "fattura_emessa") return `Fattura emessa: ${detail}`;
    if (base === "pagamento_offline") return `Pagamento registrato a mano (${PAYMENT_METHOD_IT[detail] ?? detail})`;
    if (LOG_LABELS_IT[base]) return `${LOG_LABELS_IT[base]}: ${detail}`;
  }
  return action.replace(/_/g, " ");
}

export const PAYMENT_STATUS_IT: Record<string, string> = {
  NONE: "Nessun pagamento",
  PENDING: "In attesa (link generato)",
  PAID: "Pagato",
  PARTIALLY_REFUNDED: "Rimborsato in parte",
  REFUNDED: "Rimborsato",
};

export const PAYMENT_METHOD_IT: Record<string, string> = {
  STRIPE: "Carta (Stripe)",
  BANK_TRANSFER: "Bonifico",
};
