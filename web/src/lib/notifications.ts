import "server-only";
import { sendEmail, emailLayout } from "@/lib/email";
import type { PracticeStatus } from "@/content/crm-data";

/*
  Notifiche email di alto livello legate agli eventi della pratica (@05).
  Ogni funzione ritorna { sent, subject } cosi l'azione chiamante puo
  registrare una comunicazione AUTO in cronologia quando l'email parte davvero.
*/

function areaUrl(): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  return `${base}/area-riservata`;
}

function crmPracticeUrl(practiceId: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  return `${base}/crm/pratiche/${practiceId}`;
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
  const subject = "Le imposte di Stato della tua successione";
  const html = emailLayout({
    heading: "Imposte di Stato calcolate",
    bodyHtml: `<p style="margin:0 0 10px">Abbiamo calcolato le imposte di Stato dovute per la tua successione (modello F24, autoliquidazione):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${eur(amount)}</p>
      <p style="margin:0 0 10px">Queste somme <strong>non sono il nostro onorario</strong>: si versano allo Stato, senza alcun ricarico. Nella tua area personale trovi il dettaglio e puoi inserire l'IBAN per l'addebito.</p>`,
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

export async function notifyAdminWithdrawalRequest(
  practiceId: string,
  practiceCode: string,
  clientName: string,
  reason: string,
): Promise<{ sent: boolean; subject: string }> {
  // Destinatari delle notifiche operative: ADMIN_NOTIFY_EMAILS se impostata
  // (es. solo Lorenzo), altrimenti tutta l'allowlist ADMIN_EMAILS. Cosi chi ha
  // accesso al CRM (ADMIN_EMAILS) non riceve per forza anche le email.
  const admins = (
    process.env.ADMIN_NOTIFY_EMAILS ||
    process.env.ADMIN_EMAILS ||
    ""
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const subject = `Richiesta di recesso · ${practiceCode}`;
  if (admins.length === 0) return { sent: false, subject };
  const html = emailLayout({
    heading: "Nuova richiesta di recesso",
    bodyHtml: `<p style="margin:0 0 10px"><strong>${clientName}</strong> ha richiesto il recesso per la pratica <strong>${practiceCode}</strong>.</p>
      ${reason ? `<p style="margin:0 0 10px;padding:10px 12px;background:#f4f5f3;border-radius:8px">${reason}</p>` : ""}
      <p style="margin:0">Gestisci la richiesta dalla scheda della pratica nel CRM.</p>`,
    ctaLabel: "Apri la pratica",
    ctaHref: crmPracticeUrl(practiceId),
  });
  // Invio a TUTTI gli indirizzi admin (Resend accetta piu destinatari in `to`).
  const { sent } = await sendEmail({ to: admins, subject, html });
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
      ${note ? `<p style="margin:0;padding:10px 12px;background:#f4f5f3;border-radius:8px">${note}</p>` : ""}`,
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
    bodyHtml: `<p style="margin:0 0 10px">Il documento <strong>${docLabel}</strong> ha bisogno di una correzione:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${reason}</p>
      <p style="margin:0">Puoi ricaricarlo dalla tua area personale, e una cosa veloce.</p>`,
    ctaLabel: "Ricarica il documento",
    ctaHref: `${areaUrl()}/documenti`,
  });
  const { sent } = await sendEmail({ to, subject, html });
  return { sent, subject };
}
