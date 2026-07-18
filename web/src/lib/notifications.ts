import "server-only";
import { sendEmail, emailLayout } from "@/lib/email";
import type { PracticeStatus } from "@/content/crm-data";
import {
  coerceCommsLocale,
  type CommsLocale,
} from "@/lib/comms-locale-shared";
import {
  documentRejectedEmail,
  finalDocsEmail,
  invoiceEmail,
  reviewEmail,
  statusEmailCopy,
  taxesEmail,
  withdrawalEmail,
} from "@/lib/comms-copy";

/*
  Notifiche email di alto livello legate agli eventi della pratica (@05).
  Ogni funzione ritorna { sent, subject } cosi l'azione chiamante puo
  registrare una comunicazione AUTO in cronologia quando l'email parte davvero.
  Locale: preferenza comunicazioni scritte (profiles.comms_locale), default IT.
  Le email ADMIN restano sempre in italiano.
*/

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

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function resolveLocale(locale?: string): CommsLocale {
  return coerceCommsLocale(locale);
}

export async function notifyStatusChange(
  to: string,
  status: PracticeStatus,
  opts?: {
    ctaHref?: string;
    practiceCode?: string;
    locale?: string;
  },
): Promise<{ sent: boolean; subject: string } | null> {
  const locale = resolveLocale(opts?.locale);
  const tpl = statusEmailCopy(status, locale);
  if (!tpl) return null;
  const codeNote =
    status === "PAGATO" && opts?.practiceCode
      ? locale === "ar"
        ? `<p style="margin:12px 0 0">رمز المعاملة: <strong>${esc(opts.practiceCode)}</strong> — احتفظ به. للدخول إلى المنطقة الشخصية استخدم نفس هذا البريد.</p>`
        : `<p style="margin:12px 0 0">Codice pratica: <strong>${esc(opts.practiceCode)}</strong> — conservalo. Per entrare nell'area personale usa questa stessa email.</p>`
      : "";
  const defaultCta =
    status === "CHIUSA" ? `${areaUrl()}/conclusa` : areaUrl();
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: `<p style="margin:0">${tpl.body}</p>${codeNote}`,
    ctaLabel: tpl.cta,
    ctaHref: opts?.ctaHref || defaultCta,
    locale,
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}

export async function notifyReviewRequest(
  to: string,
  reviewUrl: string,
  opts?: { delay?: string; locale?: string },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(opts?.locale);
  const tpl = reviewEmail(locale);
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: tpl.bodyHtml,
    ctaLabel: tpl.ctaLabel,
    ctaHref: reviewUrl,
    locale,
  });
  const { sent } = await sendEmail({
    to,
    subject: tpl.subject,
    html,
    scheduledAt: opts?.delay ?? "in 48 hours",
  });
  return { sent, subject: tpl.subject };
}

export async function notifyTaxesCommunicated(
  to: string,
  amount: number,
  opts?: { locale?: string },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(opts?.locale);
  const tpl = taxesEmail(amount, locale);
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: tpl.bodyHtml,
    ctaLabel: tpl.ctaLabel,
    ctaHref: `${areaUrl()}/ordine`,
    locale,
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}

export async function notifyFinalDocsReady(
  to: string,
  opts?: { locale?: string },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(opts?.locale);
  const tpl = finalDocsEmail(locale);
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: tpl.bodyHtml,
    ctaLabel: tpl.ctaLabel,
    ctaHref: `${areaUrl()}/conclusa`,
    locale,
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}

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
  const { sent } = await sendEmail({ to: admins, subject, html });
  return { sent, subject };
}

export async function notifyAdminNewLead(input: {
  practiceId: string;
  practiceCode: string;
  clientName: string;
  email: string;
  phone: string;
  custom: boolean;
  packageLabel?: string;
  clientNote?: string;
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
  const noteHtml = input.clientNote?.trim()
    ? `<p style="margin:12px 0 0;padding:10px 12px;background:#f6f4ef;border-radius:8px"><strong>Nota del cliente:</strong><br/>${esc(input.clientNote.trim())}</p>`
    : "";
  const html = emailLayout({
    heading: input.custom
      ? "Nuova richiesta di preventivo su misura"
      : "Nuovo lead dal preventivo del sito",
    bodyHtml: `<p style="margin:0 0 10px">${rows}</p>
      <p style="margin:0">${
        input.custom
          ? "Il cliente aspetta di essere ricontattato per studiare il caso insieme e ricevere il preventivo dedicato."
          : "Ha richiesto il riepilogo del preventivo via email."
      }</p>${noteHtml}`,
    ctaLabel: "Apri la pratica",
    ctaHref: crmPracticeUrl(input.practiceId),
  });
  const { sent } = await sendEmail({ to: admins, subject, html });
  return { sent, subject };
}

export async function notifyLeadRecap(
  to: string,
  input:
    | { kind: "custom"; locale?: string }
    | { kind: "esonero"; locale?: string }
    | {
        kind: "package";
        packageLabel: string;
        total: number;
        checkoutUrl: string;
        locale?: string;
      },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(input.locale);
  if (input.kind === "custom") {
    if (locale === "ar") {
      const subject = "استلمنا طلب عرض السعر المخصّص";
      const html = emailLayout({
        heading: "تم استلام الطلب!",
        bodyHtml: `<p style="margin:0 0 10px">شكرًا لثقتك. لورنزو ينظر إلى حالتك: يتواصل معك <strong>خلال يوم عمل واحد</strong> (غالبًا في اليوم نفسه) بعرض مخصّص، دون التزام.</p>
        <p style="margin:0">إن فضّلت التعجيل، رد على هذا البريد أو راسلنا على WhatsApp.</p>`,
        locale,
      });
      const { sent } = await sendEmail({ to, subject, html });
      return { sent, subject };
    }
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
    if (locale === "ar") {
      const subject = "ملخص تقييمك الأولي";
      const html = emailLayout({
        heading: "ربما لا يلزمك تقديم التصريح",
        bodyHtml: `<p style="margin:0 0 10px">بناءً على إجاباتك، قد تدخل حالتك في <strong>إعفاء قانوني</strong> من تصريحة الميراث. لا نريد بيع خدمة لا تحتاجها: التأكيد النهائي يكون على الحالة الملموسة، مجانًا.</p>
        <p style="margin:0">رد على هذا البريد أو اتصل بنا متى شئت: نتحقق معًا في دقائق.</p>`,
        locale,
      });
      const { sent } = await sendEmail({ to, subject, html });
      return { sent, subject };
    }
    const subject = "Il riepilogo della tua pre-valutazione";
    const html = emailLayout({
      heading: "Forse non devi fare la dichiarazione",
      bodyHtml: `<p style="margin:0 0 10px">In base alle tue risposte, il tuo caso potrebbe rientrare nell'<strong>esonero di legge</strong> dalla dichiarazione di successione. Non vogliamo venderti un servizio che non ti serve: la conferma definitiva va fatta sul caso concreto, gratis.</p>
        <p style="margin:0">Rispondi a questa email o chiamaci quando vuoi: verifichiamo insieme in pochi minuti.</p>`,
    });
    const { sent } = await sendEmail({ to, subject, html });
    return { sent, subject };
  }
  if (locale === "ar") {
    const subject = "ملخص عرض السعر الخاص بك";
    const html = emailLayout({
      heading: "إليك عرض السعر",
      bodyHtml: `<p style="margin:0 0 10px">بناءً على إجاباتك، الحزمة المناسبة لحالتك هي:</p>
      <p style="margin:0 0 10px;font-size:18px"><strong>${input.packageLabel}</strong> — <span style="font-size:22px;font-weight:700;color:#1f6f5c">${input.total.toLocaleString("ar")} €</span></p>
      <p style="margin:0">سعر واضح مسبقًا (الضرائب منفصلة: نحسبها نحن). عندما تريد، تابع من هنا:</p>`,
      ctaLabel: "تابع عندما تكون جاهزًا",
      ctaHref: input.checkoutUrl,
      locale,
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
  opts?: { refundIssued?: boolean; locale?: string },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(opts?.locale);
  const tpl = withdrawalEmail(
    outcome,
    note,
    { refundIssued: opts?.refundIssued },
    locale,
    esc,
  );
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: tpl.bodyHtml,
    ctaLabel: tpl.ctaLabel,
    ctaHref: `${areaUrl()}/recesso`,
    locale,
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}

export async function notifyInvoiceReady(
  to: string,
  number: string,
  opts?: { locale?: string },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(opts?.locale);
  const tpl = invoiceEmail(number, locale);
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: tpl.bodyHtml,
    ctaLabel: tpl.ctaLabel,
    ctaHref: `${areaUrl()}/ordine`,
    locale,
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}

export async function notifyDocumentRejected(
  to: string,
  docLabel: string,
  reason: string,
  opts?: { locale?: string },
): Promise<{ sent: boolean; subject: string }> {
  const locale = resolveLocale(opts?.locale);
  const tpl = documentRejectedEmail(docLabel, reason, locale, esc);
  const html = emailLayout({
    heading: tpl.heading,
    bodyHtml: tpl.bodyHtml,
    ctaLabel: tpl.ctaLabel,
    ctaHref: `${areaUrl()}/documenti`,
    locale,
  });
  const { sent } = await sendEmail({ to, subject: tpl.subject, html });
  return { sent, subject: tpl.subject };
}
