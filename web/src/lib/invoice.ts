import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { storeInvoice, getInvoiceRaw, type InvoiceInfo } from "@/lib/practice-extras";
import { notifyInvoiceReady } from "@/lib/notifications";
import type { PracticeRow } from "@/lib/supabase/types";
import type { Communication, LogEvent } from "@/content/crm-data";

/*
  Fatturazione automatica dell'onorario (Opzione L, @05).
  - Provider concreto: FattureInCloud (API v2). Attivo solo quando sono presenti
    FATTUREINCLOUD_ACCESS_TOKEN + FATTUREINCLOUD_COMPANY_ID.
  - Fallback GRACEFUL come Stripe/Resend: senza credenziali NON si rompe nulla;
    `isInvoicingConfigured` e false e il CRM offre solo la registrazione MANUALE
    (Lorenzo carica numero + PDF dal suo gestionale, coerente col "semaforo" @05).
  - Regime FORFETTARIO: nessuna IVA in fattura (natura/dicitura di legge) + marca
    da bollo da 2€ sopra 77,47€. Le imposte di Stato restano fuori (a parte).
  - NO-DDL: numero/PDF salvati in `_extras.json` + Storage privato (vedi practice-extras).
  La verita fiscale resta nel gestionale del provider; qui teniamo una copia
  consultabile da Lorenzo e dal cliente (download nell'area personale).
*/

const FIC_BASE = "https://api-v2.fattureincloud.it";

const accessToken = process.env.FATTUREINCLOUD_ACCESS_TOKEN;
const companyId = process.env.FATTUREINCLOUD_COMPANY_ID;
// Id del tipo IVA "regime forfettario" sul gestionale (varia per account):
// si imposta dopo aver letto i tipi IVA del proprio FattureInCloud.
const forfettarioVatId = Number(process.env.FATTUREINCLOUD_VAT_ID || "");
// Dicitura di legge per il forfettario (mostrata in fattura come nota).
const FORFETTARIO_NOTE =
  process.env.INVOICE_FORFETTARIO_NOTE ||
  "Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, L. 190/2014 - regime forfettario. Imposta di bollo assolta sull'originale ove dovuta.";

const STAMP_THRESHOLD = 77.47; // marca da bollo 2€ oltre questa soglia (forfettario)

export const isInvoicingConfigured = Boolean(accessToken && companyId);

type InvoiceItem = { label: string; amount: number };

export type IssueResult =
  | { ok: true; number: string; alreadyExisted?: boolean }
  | { ok: false; error: string };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function stamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function itemsFromPractice(row: PracticeRow): InvoiceItem[] {
  const lines = asArray<{ label?: string; amount?: number }>(row.line_items);
  const items = lines
    .filter((l) => typeof l.amount === "number")
    .map((l) => ({ label: l.label || "Onorario", amount: Number(l.amount) }));
  if (items.length > 0) return items;
  // Fallback: un'unica riga col totale onorario.
  return [{ label: "Onorario pratica di successione", amount: Number(row.price) }];
}

/* --- Adapter FattureInCloud (API v2) ---------------------------------------- */

type ProviderInvoice = { number: string; providerId: string; pdf?: Uint8Array };

async function ficCreateInvoice(
  row: PracticeRow,
  items: InvoiceItem[],
): Promise<ProviderInvoice> {
  const today = new Date().toISOString().slice(0, 10);
  const total = items.reduce((s, i) => s + i.amount, 0);

  const vat = forfettarioVatId ? { id: forfettarioVatId } : { value: 0 };
  const body = {
    data: {
      type: "invoice",
      entity: {
        name: row.client_name,
        email: row.client_email || undefined,
      },
      date: today,
      currency: { id: "EUR" },
      language: { code: "it" },
      e_invoice: false,
      items_list: items.map((it) => ({
        name: it.label,
        qty: 1,
        net_price: it.amount,
        vat,
      })),
      payments_list: [
        {
          amount: total,
          due_date: today,
          paid_date: row.paid_at ? row.paid_at.slice(0, 10) : today,
          status: "paid",
        },
      ],
      stamp_duty: total > STAMP_THRESHOLD ? 2 : 0,
      notes: FORFETTARIO_NOTE,
    },
  };

  const res = await fetch(`${FIC_BASE}/c/${companyId}/issued_documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`FattureInCloud ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    data?: {
      id?: number;
      number?: number;
      numeration?: string;
      year?: number;
      url?: string;
    };
  };
  const data = json.data ?? {};
  const year = data.year ?? new Date().getFullYear();
  const number = data.numeration
    ? `${data.number ?? ""}${data.numeration}/${year}`
    : `${data.number ?? "?"}/${year}`;

  // Best-effort: scarica il PDF se il provider espone un url. Se fallisce, si
  // tiene solo il numero (Lorenzo puo allegare il PDF a mano dal gestionale).
  let pdf: Uint8Array | undefined;
  if (data.url) {
    try {
      const pdfRes = await fetch(data.url);
      if (pdfRes.ok) pdf = new Uint8Array(await pdfRes.arrayBuffer());
    } catch (err) {
      console.warn("[invoice] PDF non scaricabile dal provider:", err);
    }
  }

  return { number: number.trim(), providerId: String(data.id ?? ""), pdf };
}

/* --- Orchestrazione --------------------------------------------------------- */

type Admin = ReturnType<typeof getAdminClient>;

async function recordSideEffects(
  admin: Admin,
  row: PracticeRow,
  invoice: InvoiceInfo,
  notifyClient: boolean,
) {
  const communications = asArray<Communication>(row.communications);
  const log = asArray<LogEvent>(row.log);
  const now = stamp();

  let emailSent = false;
  if (notifyClient && row.client_email) {
    const notice = await notifyInvoiceReady(row.client_email, invoice.number);
    emailSent = notice.sent;
    if (emailSent) {
      communications.push({
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: notice.subject,
        occurredAt: now,
      });
    }
  }

  log.push({ action: `fattura_emessa:${invoice.number}`, at: now });
  if (emailSent) log.push({ action: "email_inviata", at: now });

  await admin
    .from("practices")
    .update({ communications, log })
    .eq("id", row.id);
}

/*
  Emette la fattura dell'onorario via provider e la registra sulla pratica.
  Idempotente: se la pratica ha gia una fattura, non ne emette un'altra.
*/
export async function issueInvoiceForPractice(
  practiceId: string,
  opts: { notifyClient?: boolean } = {},
): Promise<IssueResult> {
  if (!isInvoicingConfigured) {
    return {
      ok: false,
      error:
        "Fatturazione automatica non attiva: imposta le chiavi FattureInCloud, oppure registra la fattura manualmente.",
    };
  }

  const admin = getAdminClient();
  const { data: practice, error } = await admin
    .from("practices")
    .select("*")
    .eq("id", practiceId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!practice) return { ok: false, error: "Pratica non trovata." };
  const row = practice as PracticeRow;

  if (row.payment_status !== "PAID") {
    return { ok: false, error: "La pratica non risulta ancora pagata." };
  }

  const existing = await getInvoiceRaw(practiceId);
  if (existing) {
    return { ok: true, number: existing.number, alreadyExisted: true };
  }

  const items = itemsFromPractice(row);
  const total = items.reduce((s, i) => s + i.amount, 0);
  if (total <= 0) return { ok: false, error: "Importo onorario non valido." };

  let provider: ProviderInvoice;
  try {
    provider = await ficCreateInvoice(row, items);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore provider.";
    console.error("[invoice] emissione fallita:", message);
    return { ok: false, error: "Emissione fattura non riuscita. Riprova o registra manualmente." };
  }

  const invoice = await storeInvoice(
    practiceId,
    {
      number: provider.number,
      issuedAt: new Date().toISOString().slice(0, 10),
      amount: total,
      provider: "FATTUREINCLOUD",
      providerId: provider.providerId || undefined,
    },
    provider.pdf ? { bytes: provider.pdf, contentType: "application/pdf" } : undefined,
  );

  await recordSideEffects(admin, row, invoice, opts.notifyClient ?? true);
  return { ok: true, number: invoice.number };
}

// Registrazione MANUALE (Lorenzo): numero + data + PDF dal suo gestionale.
export async function recordManualInvoice(
  practiceId: string,
  input: { number: string; issuedAt: string; amount?: number },
  pdf?: { bytes: Uint8Array; contentType?: string; sourceName?: string },
): Promise<IssueResult> {
  const number = input.number.trim();
  if (!number) return { ok: false, error: "Inserisci il numero della fattura." };

  const admin = getAdminClient();
  const { data: practice } = await admin
    .from("practices")
    .select("*")
    .eq("id", practiceId)
    .maybeSingle();
  if (!practice) return { ok: false, error: "Pratica non trovata." };
  const row = practice as PracticeRow;

  const amount =
    typeof input.amount === "number" && input.amount > 0
      ? input.amount
      : Number(row.price);

  const invoice = await storeInvoice(
    practiceId,
    {
      number,
      issuedAt: input.issuedAt || new Date().toISOString().slice(0, 10),
      amount,
      provider: "MANUAL",
    },
    pdf,
  );

  await recordSideEffects(admin, row, invoice, true);
  return { ok: true, number: invoice.number };
}
