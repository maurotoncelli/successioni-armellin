import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyDocsReminder, notifyMandateReminder } from "@/lib/notifications";
import { getCommsLocaleForPractice } from "@/lib/comms-locale";
import {
  getNotifyEmailPreference,
  pushClientNotificationForPractice,
} from "@/lib/client-notifications";
import {
  docsReminderNotif,
  docsReminderMandateLine,
  mandateReminderNotif,
} from "@/lib/comms-copy";
import { isMandateSigned } from "@/lib/practice-extras";
import type { Communication, LogEvent } from "@/content/crm-data";
import type { PracticeRow } from "@/lib/supabase/types";

/*
  Sollecito automatico documenti E firma mandato (@05): 24h dopo l'avvio
  (pagamento) e poi ogni 48h finche i documenti obbligatori non sono tutti
  caricati e il mandato non e firmato. UNA sola email per giro:
  - mancano documenti -> sollecito documenti (con riga mandato se manca anche);
  - documenti a posto ma mandato non firmato -> email dedicata alla firma.
  Eseguito dal cron Vercel GET /api/cron/docs-reminder. NO-DDL: timestamp
  dell'ultimo invio nel log pratica (`sollecito_documenti`, cadenza condivisa).
*/

export const DOCS_REMINDER_LOG = "sollecito_documenti";
export const FIRST_DELAY_MS = 24 * 60 * 60 * 1000;
export const REPEAT_DELAY_MS = 48 * 60 * 60 * 1000;

const ELIGIBLE_STATUS = new Set(["PAGATO", "ATTESA_DOC"]);

function stamp(d = new Date()): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseWhen(value: string | null | undefined): number | null {
  if (!value) return null;
  let normalized = value.trim();
  if (!normalized.includes("T") && normalized.includes(" ")) {
    normalized = `${normalized.replace(" ", "T")}:00.000Z`;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    normalized = `${normalized}T00:00:00.000Z`;
  }
  const t = Date.parse(normalized);
  return Number.isFinite(t) ? t : null;
}

export function hasMissingRequiredDocs(checklist: unknown): boolean {
  const items = asArray<{ required?: boolean; status?: string }>(checklist);
  if (items.length === 0) return false;
  return items.some(
    (item) =>
      item.required === true &&
      (item.status === "ATTESO" || item.status === "RIFIUTATO"),
  );
}

export function lastDocsReminderAt(log: unknown): number | null {
  let latest: number | null = null;
  for (const ev of asArray<LogEvent>(log)) {
    if (ev.action !== DOCS_REMINDER_LOG) continue;
    const t = parseWhen(ev.at);
    if (t != null && (latest == null || t > latest)) latest = t;
  }
  return latest;
}

export function practiceStartedAt(row: {
  paid_at?: string | null;
  opened_at?: string | null;
  created_at?: string | null;
}): number | null {
  return (
    parseWhen(row.paid_at) ??
    parseWhen(row.opened_at) ??
    parseWhen(row.created_at)
  );
}

/*
  Requisiti comuni (stato/pagamento/email/tempi) SENZA guardare cosa manca:
  documenti e mandato vengono controllati a valle, cosi la cadenza 24h/48h
  resta condivisa e il cliente non riceve mai due promemoria nello stesso giro.
*/
export function reminderCadenceDue(
  row: Pick<
    PracticeRow,
    | "status"
    | "payment_status"
    | "client_email"
    | "log"
    | "paid_at"
    | "opened_at"
    | "created_at"
  >,
  now = Date.now(),
): boolean {
  if (!ELIGIBLE_STATUS.has(row.status)) return false;
  if (row.payment_status !== "PAID") return false;
  if (!row.client_email?.trim()) return false;

  const started = practiceStartedAt(row);
  if (started == null) return false;
  if (now - started < FIRST_DELAY_MS) return false;

  const last = lastDocsReminderAt(row.log);
  if (last == null) return true;
  return now - last >= REPEAT_DELAY_MS;
}

export type DocsReminderRunResult = {
  scanned: number;
  sent: number;
  skipped: number;
  errors: number;
};

export async function runDocsReminders(
  now = Date.now(),
): Promise<DocsReminderRunResult> {
  const result: DocsReminderRunResult = {
    scanned: 0,
    sent: 0,
    skipped: 0,
    errors: 0,
  };
  if (!isAdminConfigured) return result;

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("practices")
    .select(
      "id, code, status, payment_status, client_email, contact_id, checklist, communications, log, paid_at, opened_at, created_at",
    )
    .in("status", ["PAGATO", "ATTESA_DOC"])
    .eq("payment_status", "PAID");
  if (error) {
    console.error("[docs-reminder] query:", error.message);
    throw error;
  }

  const rows = (data ?? []) as PracticeRow[];
  result.scanned = rows.length;

  for (const row of rows) {
    if (!reminderCadenceDue(row, now)) {
      result.skipped += 1;
      continue;
    }

    // Cosa manca davvero: documenti obbligatori e/o firma del mandato.
    // Il mandato vive in _extras.json (Storage): lo si legge solo per le
    // pratiche gia in cadenza, non per tutte le righe scansionate.
    const missingDocs = hasMissingRequiredDocs(row.checklist);
    let missingMandate = false;
    try {
      missingMandate = !(await isMandateSigned(row.id));
    } catch (err) {
      console.error("[docs-reminder] mandato", row.code, err);
    }
    if (!missingDocs && !missingMandate) {
      result.skipped += 1;
      continue;
    }

    const allowEmail = await getNotifyEmailPreference(row.contact_id);
    if (!allowEmail) {
      result.skipped += 1;
      continue;
    }

    const locale = await getCommsLocaleForPractice(row.id);
    try {
      const notice = missingDocs
        ? await notifyDocsReminder(row.client_email, {
            locale,
            includeMandate: missingMandate,
          })
        : await notifyMandateReminder(row.client_email, { locale });
      if (!notice.sent) {
        result.skipped += 1;
        continue;
      }

      const at = stamp(new Date(now));
      const communications = asArray<Communication>(row.communications);
      communications.unshift({
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: notice.subject,
        occurredAt: at,
      });
      const log = asArray<LogEvent>(row.log);
      log.unshift({ action: DOCS_REMINDER_LOG, at });
      log.unshift({ action: "email_inviata", at });

      const { error: updErr } = await admin
        .from("practices")
        .update({ communications, log })
        .eq("id", row.id);
      if (updErr) {
        console.error("[docs-reminder] update", row.code, updErr.message);
        result.errors += 1;
        continue;
      }

      const notif = missingDocs
        ? docsReminderNotif(locale)
        : mandateReminderNotif(locale);
      const body =
        missingDocs && missingMandate
          ? `${notif.body} ${docsReminderMandateLine(locale)}`
          : notif.body;
      await pushClientNotificationForPractice(row.id, {
        kind: "documento",
        title: notif.title,
        body,
        href: missingDocs
          ? "/area-riservata/documenti"
          : "/area-riservata/mandato",
        dedupeMinutes: 36 * 60,
      });

      result.sent += 1;
    } catch (err) {
      console.error("[docs-reminder] send", row.code, err);
      result.errors += 1;
    }
  }

  return result;
}
