import "server-only";
import { sendEmail, emailLayout } from "@/lib/email";
import type { PracticeStatus } from "@/content/crm-data";

/*
  Notifiche email di alto livello legate agli eventi della pratica (@05).
  Ogni funzione ritorna { sent, subject } cosi l'azione chiamante puo
  registrare una comunicazione AUTO in cronologia quando l'email parte davvero.
*/

// Base assoluta obbligatoria: nelle email i link relativi sono morti.
export function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.successioniarmellin.it"
  ).replace(/\/$/, "");
}

function areaUrl(): string {
  return `${siteBase()}/area-riservata`;
}

function crmPracticeUrl(practiceId: string): string {
  return `${siteBase()}/crm/pratiche/${practiceId}`;
}

// I testi liberi (motivazioni, nomi, note) finiscono in template HTML:
// vanno sempre escapati, sono input di utenti o comunque non controllati.
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function eur(n: number): string {
  return `${n.toLocaleString("it-IT")} €`;
}

type StatusEmail = { subject: string; heading: string; body: string; cta: string };

const statusEmails: Partial<Record<PracticeStatus, StatusEmail>> = {
  PAGATO: {
    subject: "Pagamento ricevuto: ora carica i documenti",
    heading: "Grazie, abbiamo ricevuto il pagamento",
    body: "La tua pratica e ufficialmente avviata. Il prossimo passo e caricare i documenti richiesti nella tua area personale: ti guidiamo passo passo, e ci vogliono pochi minuti.",
    cta: "Carica i documenti",
  },
  ATTESA_DOC: {
    subject: "Mancano alcuni documenti per procedere",
    heading: "Ci servono ancora alcuni documenti",
    body: "Per andare avanti con la tua successione abbiamo bisogno di completare la lista dei documenti. Trovi tutto, con le istruzioni, nella tua area personale.",
    cta: "Completa i documenti",
  },
  LAVORAZIONE: {
    subject: "Stiamo lavorando alla tua pratica",
    heading: "Ci pensiamo noi",
    body: "Abbiamo tutto il necessario e stiamo predisponendo la tua dichiarazione di successione. Ti aggiorniamo appena ci sono novita: non devi fare nulla.",
    cta: "Vedi lo stato",
  },
  INVIATA: {
    subject: "Pratica inviata all'Agenzia delle Entrate",
    heading: "Inviata all'Agenzia delle Entrate",
    body: "La tua dichiarazione di successione e stata trasmessa. Appena riceviamo la ricevuta di registrazione la trovi nella tua area personale.",
    cta: "Vai all'area personale",
  },
  CHIUSA: {
    subject: "La tua pratica e conclusa",
    heading: "Tutto fatto!",
    body: "La tua successione e conclusa. Nella tua area personale trovi i documenti finali (ricevuta di presentazione, dichiarazione, visure) da scaricare e conservare.",
    cta: "Scarica i documenti",
  },
};

export async function notifyStatusChange(
  to: string,
  status: PracticeStatus,
): Promise<{ sent: boolean; subject: string } | null> {
  const tpl = statusEmails[status];
  if (!tpl) return null;
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: `<p style="margin:0">${tpl.body}</p>`,
    ctaLabel: tpl.cta,
    ctaHref: areaUrl(),
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}

export async function notifyTaxesCommunicated(
  to: string,
  amount: number,
): Promise<{ sent: boolean; subject: string }> {
  const subject = "Le imposte della tua successione";
  const html = emailLayout({
    heading: "Imposte calcolate",
    bodyHtml: `<p style="margin:0 0 10px">Abbiamo calcolato le imposte dovute per la tua successione (modello F24, autoliquidazione):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${eur(amount)}</p>
      <p style="margin:0 0 10px">Queste somme <strong>non sono il nostro onorario</strong>: si versano allo Stato. Nella tua area personale trovi il dettaglio e puoi inserire l'IBAN per l'addebito.</p>`,
    ctaLabel: "Vai all'area personale",
    ctaHref: `${areaUrl()}/ordine`,
  });
  const { sent } = await sendEmail({ to, subject, html });
  return { sent, subject };
}

export async function notifyFinalDocsReady(
  to: string,
): Promise<{ sent: boolean; subject: string }> {
  const subject = "I documenti finali della tua successione sono pronti";
  const html = emailLayout({
    heading: "Documenti pronti da scaricare",
    bodyHtml: `<p style="margin:0">Abbiamo caricato i documenti finali della tua pratica (ricevuta di presentazione, dichiarazione, visure). Li trovi nella tua area personale, pronti da scaricare e conservare.</p>`,
    ctaLabel: "Scarica i documenti",
    ctaHref: `${areaUrl()}/conclusa`,
  });
  const { sent } = await sendEmail({ to, subject, html });
  return { sent, subject };
}

// Destinatari delle notifiche operative: ADMIN_NOTIFY_EMAILS se impostata
// (es. solo Lorenzo), altrimenti tutta l'allowlist ADMIN_EMAILS. Cosi chi ha
// accesso al CRM (ADMIN_EMAILS) non riceve per forza anche le email.
function adminNotifyRecipients(): string[] {
  return (process.env.ADMIN_NOTIFY_EMAILS || process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export async function notifyAdminWithdrawalRequest(
  practiceId: string,
  practiceCode: string,
  clientName: string,
  reason: string,
): Promise<{ sent: boolean; subject: string }> {
  const admins = adminNotifyRecipients();
  const subject = `Richiesta di recesso · ${practiceCode}`;
  if (admins.length === 0) return { sent: false, subject };
  const html = emailLayout({
    heading: "Nuova richiesta di recesso",
    bodyHtml: `<p style="margin:0 0 10px"><strong>${esc(clientName)}</strong> ha richiesto il recesso per la pratica <strong>${esc(practiceCode)}</strong>.</p>
      ${reason ? `<p style="margin:0 0 10px;padding:10px 12px;background:#f4f5f3;border-radius:8px">${esc(reason)}</p>` : ""}
      <p style="margin:0">Gestisci la richiesta dalla scheda della pratica nel CRM.</p>`,
    ctaLabel: "Apri la pratica",
    ctaHref: crmPracticeUrl(practiceId),
  });
  // Invio a TUTTI gli indirizzi admin (Resend accetta piu destinatari in `to`).
  const { sent } = await sendEmail({ to: admins, subject, html });
  return { sent, subject };
}

/*
  Nuovo lead dal sito (opt-in email o richiesta preventivo su misura):
  notifica IMMEDIATA a Lorenzo con recapiti e link alla pratica nel CRM.
*/
export async function notifyAdminNewLead(input: {
  practiceId: string;
  practiceCode: string;
  clientName: string;
  email: string;
  phone: string;
  custom: boolean; // true = richiesta preventivo su misura
  packageLabel?: string; // pacchetto suggerito (lead da opt-in email)
}): Promise<{ sent: boolean; subject: string }> {
  const admins = adminNotifyRecipients();
  const subject = input.custom
    ? `Richiesta preventivo su misura · ${input.practiceCode}`
    : `Nuovo lead dal sito · ${input.practiceCode}`;
  if (admins.length === 0) return { sent: false, subject };
  const rows = [
    `<strong>${esc(input.clientName || "Contatto senza nome")}</strong>`,
    input.email &&
      `Email: <a href="mailto:${esc(input.email)}">${esc(input.email)}</a>`,
    input.phone &&
      `Telefono: <a href="tel:${esc(input.phone)}">${esc(input.phone)}</a>`,
    input.packageLabel && `Pacchetto suggerito: ${esc(input.packageLabel)}`,
  ]
    .filter(Boolean)
    .join("<br/>");
  const html = emailLayout({
    heading: input.custom
      ? "Nuova richiesta di preventivo su misura"
      : "Nuovo lead dal preventivo del sito",
    bodyHtml: `<p style="margin:0 0 10px">${rows}</p>
      <p style="margin:0">${
        input.custom
          ? "Il cliente aspetta di essere ricontattato per il preventivo dedicato."
          : "Ha richiesto il riepilogo del preventivo via email."
      }</p>`,
    ctaLabel: "Apri la pratica",
    ctaHref: crmPracticeUrl(input.practiceId),
  });
  const { sent } = await sendEmail({ to: admins, subject, html });
  return { sent, subject };
}

/*
  Email al VISITATORE che lascia i contatti sul preventivo: riepilogo del
  pacchetto (opt-in email) o conferma di presa in carico (su misura).
*/
export async function notifyLeadRecap(
  to: string,
  input:
    | { kind: "custom" }
    | { kind: "esonero" }
    | {
        kind: "package";
        packageLabel: string;
        total: number;
        checkoutUrl: string;
      },
): Promise<{ sent: boolean; subject: string }> {
  if (input.kind === "custom") {
    const subject = "Abbiamo ricevuto la tua richiesta di preventivo su misura";
    const html = emailLayout({
      heading: "Richiesta ricevuta!",
      bodyHtml: `<p style="margin:0 0 10px">Grazie per la fiducia. Lorenzo sta gia guardando il tuo caso: ti ricontatta <strong>entro un giorno lavorativo</strong> (di solito in giornata) con un preventivo dedicato, senza impegno.</p>
        <p style="margin:0">Se preferisci anticipare i tempi, rispondi a questa email o scrivici su WhatsApp.</p>`,
    });
    const { sent } = await sendEmail({ to, subject, html });
    return { sent, subject };
  }
  if (input.kind === "esonero") {
    const subject = "Il riepilogo della tua pre-valutazione";
    const html = emailLayout({
      heading: "Forse non devi fare la dichiarazione",
      bodyHtml: `<p style="margin:0 0 10px">In base alle tue risposte, il tuo caso potrebbe rientrare nell'<strong>esonero di legge</strong> dalla dichiarazione di successione. Non vogliamo venderti un servizio che non ti serve: la conferma definitiva va fatta sul caso concreto, gratis.</p>
        <p style="margin:0">Rispondi a questa email o chiamaci quando vuoi: verifichiamo insieme in pochi minuti.</p>`,
    });
    const { sent } = await sendEmail({ to, subject, html });
    return { sent, subject };
  }
  const subject = "Il riepilogo del tuo preventivo";
  const html = emailLayout({
    heading: "Ecco il tuo preventivo",
    bodyHtml: `<p style="margin:0 0 10px">In base alle tue risposte, il pacchetto giusto per il tuo caso e:</p>
      <p style="margin:0 0 10px;font-size:18px"><strong>${input.packageLabel}</strong> — <span style="font-size:22px;font-weight:700;color:#1f6f5c">${input.total.toLocaleString("it-IT")} €</span></p>
      <p style="margin:0">Prezzo chiaro, deciso prima (le imposte sono a parte: te le calcoliamo noi). Quando vuoi, riprendi da qui:</p>`,
    ctaLabel: "Procedi quando sei pronto",
    ctaHref: input.checkoutUrl,
  });
  const { sent } = await sendEmail({ to, subject, html });
  return { sent, subject };
}

export async function notifyWithdrawalOutcome(
  to: string,
  outcome: "ACCEPTED" | "REJECTED" | "IN_REVIEW",
  note: string,
): Promise<{ sent: boolean; subject: string }> {
  const map = {
    IN_REVIEW: {
      subject: "Stiamo valutando la tua richiesta di recesso",
      heading: "Richiesta in gestione",
      body: "Abbiamo preso in carico la tua richiesta di recesso e la stiamo valutando. Ti aggiorniamo a breve con l'esito.",
    },
    ACCEPTED: {
      subject: "Recesso accettato",
      heading: "Recesso accettato",
      body: "La tua richiesta di recesso e stata accettata. Se previsto, procederemo con il rimborso secondo quanto stabilito.",
    },
    REJECTED: {
      subject: "Esito della tua richiesta di recesso",
      heading: "Richiesta di recesso",
      body: "Abbiamo valutato la tua richiesta di recesso. Trovi di seguito le motivazioni; restiamo a disposizione per chiarimenti.",
    },
  }[outcome];
  const html = emailLayout({
    heading: map.heading,
    bodyHtml: `<p style="margin:0 0 10px">${map.body}</p>
      ${note ? `<p style="margin:0;padding:10px 12px;background:#f4f5f3;border-radius:8px">${esc(note)}</p>` : ""}`,
    ctaLabel: "Vai all'area personale",
    ctaHref: `${areaUrl()}/recesso`,
  });
  const { sent } = await sendEmail({ to, subject: map.subject, html });
  return { sent, subject: map.subject };
}

export async function notifyInvoiceReady(
  to: string,
  number: string,
): Promise<{ sent: boolean; subject: string }> {
  const subject = `La tua fattura e disponibile (n. ${number})`;
  const html = emailLayout({
    heading: "Fattura disponibile",
    bodyHtml: `<p style="margin:0 0 10px">Abbiamo emesso la fattura dell'onorario <strong>n. ${number}</strong> per la tua pratica di successione.</p>
      <p style="margin:0">La trovi e la puoi scaricare nella tua area personale, nella sezione "Il tuo acquisto".</p>`,
    ctaLabel: "Scarica la fattura",
    ctaHref: `${areaUrl()}/ordine`,
  });
  const { sent } = await sendEmail({ to, subject, html });
  return { sent, subject };
}

export async function notifyDocumentRejected(
  to: string,
  docLabel: string,
  reason: string,
): Promise<{ sent: boolean; subject: string }> {
  const subject = `Un documento va ricaricato: ${docLabel}`;
  const html = emailLayout({
    heading: "Un documento va rifatto",
    bodyHtml: `<p style="margin:0 0 10px">Il documento <strong>${esc(docLabel)}</strong> ha bisogno di una correzione:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Puoi ricaricarlo dalla tua area personale, e una cosa veloce.</p>`,
    ctaLabel: "Ricarica il documento",
    ctaHref: `${areaUrl()}/documenti`,
  });
  const { sent } = await sendEmail({ to, subject, html });
  return { sent, subject };
}
