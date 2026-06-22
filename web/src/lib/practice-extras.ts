import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import { encryptIban, decryptIban, normalizeIban } from "@/lib/crypto-iban";

/*
  "Extra" della pratica (mandato firmato + IBAN cifrato) salvati come documento
  JSON privato nel bucket Storage `practice-docs`: `<practiceId>/_extras.json`.
  Scelta NO-DDL (la migrazione SQL non e applicabile ora: password DB resettata)
  e coerente con la sensibilita del dato: l'IBAN e cifrato a livello applicativo
  e cancellabile eliminando l'oggetto. Tutto l'accesso e server-side con
  service_role; la PROPRIETA e verificata dai chiamanti (area cliente via
  getClientView, CRM via requireAdmin).
*/

export type MandateInfo = {
  method: "ELECTRONIC" | "PAPER";
  signerName: string;
  signedAt: string;
  filePath?: string; // file del mandato cartaceo firmato (per PAPER)
};

export type FinalDocument = {
  label: string;
  filePath: string;
  fileName: string;
  uploadedAt: string;
};

// Provider della fattura: "FATTUREINCLOUD" (emessa via API) o "MANUAL"
// (numero/PDF registrati a mano da Lorenzo dal suo gestionale, @05).
export type InvoiceProviderKey = "FATTUREINCLOUD" | "MANUAL";

export type InvoiceInfo = {
  number: string;
  issuedAt: string; // YYYY-MM-DD
  amount: number; // onorario, in euro
  provider: InvoiceProviderKey;
  providerId?: string; // id del documento sul provider (per riconciliazione)
  filePath?: string; // PDF nello Storage privato
  fileName?: string;
};

// Richiesta di recesso (@10/@05). NO-DDL: vive nell'_extras.json della pratica.
export type WithdrawalStatus =
  | "REQUESTED"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED";

export type WithdrawalInfo = {
  status: WithdrawalStatus;
  reason?: string; // motivo del cliente
  requestedAt: string;
  resolvedAt?: string;
  outcomeNote?: string; // nota dell'esito (Lorenzo)
};

export type PracticeExtras = {
  mandate?: MandateInfo;
  iban?: { last4: string; enc: string; providedAt: string };
  // Marcatore di avvenuta cancellazione dell'IBAN (retention @10): finalita
  // esaurita dopo l'F24. Teniamo solo il timestamp (no PII) come prova/audit.
  ibanClearedAt?: string;
  finalDocuments?: FinalDocument[];
  invoice?: InvoiceInfo;
  withdrawal?: WithdrawalInfo;
};

// Vista "sicura" per il client (mai l'IBAN in chiaro ne il blob cifrato).
export type SafeInvoice = {
  number: string;
  issuedAt: string;
  amount: number;
  provider: InvoiceProviderKey;
  hasFile: boolean;
};

export type SafeExtras = {
  mandate?: Omit<MandateInfo, "filePath"> & { hasFile: boolean };
  iban?: { last4: string; providedAt: string };
  ibanClearedAt?: string;
  finalDocuments?: { label: string; fileName: string; uploadedAt: string }[];
  invoice?: SafeInvoice;
  withdrawal?: WithdrawalInfo;
};

type Admin = ReturnType<typeof getAdminClient>;

function extrasPath(practiceId: string) {
  return `${practiceId}/_extras.json`;
}

async function readExtras(admin: Admin, practiceId: string): Promise<PracticeExtras> {
  const { data } = await admin.storage.from(DOC_BUCKET).download(extrasPath(practiceId));
  if (!data) return {};
  try {
    return JSON.parse(await data.text()) as PracticeExtras;
  } catch {
    return {};
  }
}

async function writeExtras(admin: Admin, practiceId: string, extras: PracticeExtras) {
  await ensureDocBucket(admin);
  const blob = Buffer.from(JSON.stringify(extras), "utf8");
  const { error } = await admin.storage
    .from(DOC_BUCKET)
    .upload(extrasPath(practiceId), blob, {
      contentType: "application/json",
      upsert: true,
    });
  if (error) throw error;
}

function toSafe(extras: PracticeExtras): SafeExtras {
  const safe: SafeExtras = {};
  if (extras.mandate) {
    const { filePath, ...rest } = extras.mandate;
    safe.mandate = { ...rest, hasFile: Boolean(filePath) };
  }
  if (extras.iban) {
    safe.iban = { last4: extras.iban.last4, providedAt: extras.iban.providedAt };
  }
  if (extras.ibanClearedAt) {
    safe.ibanClearedAt = extras.ibanClearedAt;
  }
  if (extras.finalDocuments?.length) {
    safe.finalDocuments = extras.finalDocuments.map((d) => ({
      label: d.label,
      fileName: d.fileName,
      uploadedAt: d.uploadedAt,
    }));
  }
  if (extras.invoice) {
    safe.invoice = {
      number: extras.invoice.number,
      issuedAt: extras.invoice.issuedAt,
      amount: extras.invoice.amount,
      provider: extras.invoice.provider,
      hasFile: Boolean(extras.invoice.filePath),
    };
  }
  if (extras.withdrawal) {
    safe.withdrawal = extras.withdrawal;
  }
  return safe;
}

function sanitizeName(name: string): string {
  const cleaned = name.replace(/[^\w.\-]+/g, "_");
  return cleaned.slice(-80) || "file";
}

export async function getSafeExtras(practiceId: string): Promise<SafeExtras> {
  const admin = getAdminClient();
  return toSafe(await readExtras(admin, practiceId));
}

export async function signMandateElectronic(
  practiceId: string,
  signerName: string,
): Promise<void> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  extras.mandate = {
    ...extras.mandate,
    method: "ELECTRONIC",
    signerName,
    signedAt: new Date().toISOString(),
  };
  await writeExtras(admin, practiceId, extras);
}

export async function attachMandateFile(
  practiceId: string,
  signerName: string,
  file: File,
): Promise<void> {
  const admin = getAdminClient();
  await ensureDocBucket(admin);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const path = `${practiceId}/mandate-signed.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from(DOC_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) throw error;

  const extras = await readExtras(admin, practiceId);
  extras.mandate = {
    method: "PAPER",
    signerName,
    signedAt: new Date().toISOString(),
    filePath: path,
  };
  await writeExtras(admin, practiceId, extras);
}

export async function mandateFileUrl(practiceId: string): Promise<string | null> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  const filePath = extras.mandate?.filePath;
  if (!filePath) return null;
  const { data } = await admin.storage.from(DOC_BUCKET).createSignedUrl(filePath, 60);
  return data?.signedUrl ?? null;
}

export async function saveIban(
  practiceId: string,
  rawIban: string,
): Promise<{ ok: true; last4: string } | { ok: false; error: string }> {
  const iban = normalizeIban(rawIban);
  if (!iban) return { ok: false, error: "IBAN non valido. Controlla e riprova." };
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  extras.iban = {
    last4: iban.slice(-4),
    enc: encryptIban(iban),
    providedAt: new Date().toISOString(),
  };
  // Un nuovo IBAN azzera l'eventuale marcatore di cancellazione precedente.
  delete extras.ibanClearedAt;
  await writeExtras(admin, practiceId, extras);
  return { ok: true, last4: extras.iban.last4 };
}

/*
  Cancellazione dell'IBAN dopo l'uso (retention @10: "subito dopo l'addebito/
  emissione F24", finalita esaurita). Rimuove il blob cifrato e tiene solo il
  timestamp di avvenuta cancellazione come prova/audit. Ritorna true se c'era
  davvero un IBAN da cancellare (per loggare l'evento solo quando serve).
*/
export async function deleteIban(practiceId: string): Promise<boolean> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  if (!extras.iban) return false;
  delete extras.iban;
  extras.ibanClearedAt = new Date().toISOString();
  await writeExtras(admin, practiceId, extras);
  return true;
}

// --- Documenti finali (caricati dall'admin, scaricati dal cliente) -----------

export async function addFinalDocument(
  practiceId: string,
  label: string,
  file: File,
): Promise<void> {
  const admin = getAdminClient();
  await ensureDocBucket(admin);
  const path = `${practiceId}/final/${Date.now()}-${sanitizeName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from(DOC_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) throw error;

  const extras = await readExtras(admin, practiceId);
  const list = extras.finalDocuments ?? [];
  list.push({
    label: label.trim() || file.name,
    filePath: path,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  });
  extras.finalDocuments = list;
  await writeExtras(admin, practiceId, extras);
}

export async function removeFinalDocument(
  practiceId: string,
  index: number,
): Promise<void> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  const list = extras.finalDocuments ?? [];
  const doc = list[index];
  if (!doc) return;
  if (doc.filePath) await admin.storage.from(DOC_BUCKET).remove([doc.filePath]);
  list.splice(index, 1);
  extras.finalDocuments = list;
  await writeExtras(admin, practiceId, extras);
}

// Scarica i byte di tutti i documenti finali (per lo ZIP "scarica tutto").
export async function getFinalDocsBytes(
  practiceId: string,
): Promise<{ name: string; data: Uint8Array }[]> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  const list = extras.finalDocuments ?? [];
  const out: { name: string; data: Uint8Array }[] = [];
  for (const doc of list) {
    const { data } = await admin.storage.from(DOC_BUCKET).download(doc.filePath);
    if (!data) continue;
    const bytes = new Uint8Array(await data.arrayBuffer());
    // Nome leggibile: etichetta + estensione del file originale.
    const ext = doc.fileName.includes(".")
      ? doc.fileName.slice(doc.fileName.lastIndexOf("."))
      : "";
    out.push({ name: `${doc.label}${ext}`, data: bytes });
  }
  return out;
}

export async function finalDocUrl(
  practiceId: string,
  index: number,
): Promise<string | null> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  const filePath = extras.finalDocuments?.[index]?.filePath;
  if (!filePath) return null;
  const { data } = await admin.storage.from(DOC_BUCKET).createSignedUrl(filePath, 60);
  return data?.signedUrl ?? null;
}

// --- Fattura / ricevuta onorario (@05, Opzione L) -----------------------------
// La fattura vive in `_extras.json` (NO-DDL) + il PDF nello Storage privato.
// Una sola fattura per pratica (un ordine = una pratica, @04): re-emetterla
// sovrascrive la precedente (e il relativo file).

function invoiceFileName(number: string): string {
  const safe = number.replace(/[^\w.\-]+/g, "-").slice(-60) || "fattura";
  return `${safe}.pdf`;
}

export async function getInvoiceRaw(
  practiceId: string,
): Promise<InvoiceInfo | undefined> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  return extras.invoice;
}

// Registra la fattura (metadati + eventuale PDF). Usata sia dal flusso automatico
// (provider) sia dalla registrazione manuale dell'admin.
export async function storeInvoice(
  practiceId: string,
  info: Omit<InvoiceInfo, "filePath" | "fileName">,
  pdf?: { bytes: Uint8Array; contentType?: string; sourceName?: string },
): Promise<InvoiceInfo> {
  const admin = getAdminClient();
  await ensureDocBucket(admin);
  const extras = await readExtras(admin, practiceId);

  // Rimuovi l'eventuale PDF della fattura precedente (re-emissione).
  if (extras.invoice?.filePath) {
    await admin.storage.from(DOC_BUCKET).remove([extras.invoice.filePath]);
  }

  const invoice: InvoiceInfo = { ...info };
  if (pdf) {
    const fileName = invoiceFileName(info.number);
    const path = `${practiceId}/invoice/${fileName}`;
    const { error } = await admin.storage
      .from(DOC_BUCKET)
      .upload(path, Buffer.from(pdf.bytes), {
        contentType: pdf.contentType || "application/pdf",
        upsert: true,
      });
    if (error) throw error;
    invoice.filePath = path;
    invoice.fileName = pdf.sourceName?.trim() || fileName;
  }

  extras.invoice = invoice;
  await writeExtras(admin, practiceId, extras);
  return invoice;
}

export async function invoiceUrl(practiceId: string): Promise<string | null> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  const filePath = extras.invoice?.filePath;
  if (!filePath) return null;
  const { data } = await admin.storage.from(DOC_BUCKET).createSignedUrl(filePath, 60);
  return data?.signedUrl ?? null;
}

export async function removeInvoice(practiceId: string): Promise<void> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  if (!extras.invoice) return;
  if (extras.invoice.filePath) {
    await admin.storage.from(DOC_BUCKET).remove([extras.invoice.filePath]);
  }
  delete extras.invoice;
  await writeExtras(admin, practiceId, extras);
}

// --- Recesso (@10/@05) ------------------------------------------------------

export async function getWithdrawal(
  practiceId: string,
): Promise<WithdrawalInfo | undefined> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  return extras.withdrawal;
}

// Crea/aggiorna la richiesta del cliente (idempotente: se esiste gia, aggiorna
// solo il motivo e riporta lo stato a REQUESTED se era stata respinta).
export async function requestWithdrawal(
  practiceId: string,
  reason: string,
): Promise<WithdrawalInfo> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  const now = new Date().toISOString();
  extras.withdrawal = {
    status: "REQUESTED",
    reason: reason.trim() || undefined,
    requestedAt: extras.withdrawal?.requestedAt ?? now,
  };
  await writeExtras(admin, practiceId, extras);
  return extras.withdrawal;
}

// Aggiornamento esito da parte dell'admin (in gestione / accettato / respinto).
export async function setWithdrawalStatus(
  practiceId: string,
  status: WithdrawalStatus,
  outcomeNote?: string,
): Promise<WithdrawalInfo | null> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  if (!extras.withdrawal) return null;
  extras.withdrawal = {
    ...extras.withdrawal,
    status,
    outcomeNote: outcomeNote?.trim() || extras.withdrawal.outcomeNote,
    resolvedAt:
      status === "ACCEPTED" || status === "REJECTED"
        ? new Date().toISOString()
        : extras.withdrawal.resolvedAt,
  };
  await writeExtras(admin, practiceId, extras);
  return extras.withdrawal;
}

// Solo CRM (requireAdmin lato chiamante): IBAN in chiaro per il pagamento F24.
export async function revealIban(practiceId: string): Promise<string | null> {
  const admin = getAdminClient();
  const extras = await readExtras(admin, practiceId);
  if (!extras.iban?.enc) return null;
  try {
    return decryptIban(extras.iban.enc);
  } catch {
    return null;
  }
}
