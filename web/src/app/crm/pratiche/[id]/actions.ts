"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createCheckoutSession } from "@/lib/payments";
import { requireAdmin } from "@/lib/admin";
import { signedDocUrl, setDocStatus, listItemFiles, DOC_BUCKET } from "@/lib/documents";
import {
  mandateFileUrl,
  revealIban,
  deleteIban,
  finalDocUrl,
  removeFinalDocument,
  invoiceUrl,
  removeInvoice,
  setWithdrawalStatus,
  type WithdrawalStatus,
} from "@/lib/practice-extras";
import { issueInvoiceForPractice } from "@/lib/invoice";
import { slaDueDate } from "@/lib/cms";
import { generateChecklist } from "@/lib/checklist";
import {
  runExtraction,
  getExtraction,
  saveReviewedData,
  type ExtractionResult,
  type ExtractionData,
} from "@/lib/extraction";
import { buildSucXml, type SucAllegato } from "@/lib/suc-xml";
import { imagesToPdf, type PdfImage } from "@/lib/image-to-pdf";
import {
  notifyStatusChange,
  notifyDocumentRejected,
  notifyTaxesCommunicated,
  notifyFinalDocsReady,
  notifyWithdrawalOutcome,
} from "@/lib/notifications";
import { getAdminClient } from "@/lib/supabase/admin";
import type { PracticeRow } from "@/lib/supabase/types";
import type {
  ActionOwner,
  ChecklistItem,
  Communication,
  LogEvent,
  PracticeStatus,
  TaskItem,
} from "@/content/crm-data";

/*
  Flusso assistito (@05): Lorenzo genera un link di pagamento Stripe per la pratica
  durante la chiamata. Riusa la STESSA logica del checkout pubblico (un solo prezzo).
*/

export type PaymentLinkResult =
  | { ok: true; url: string; total: number }
  | { ok: false; error: string };

export async function generatePaymentLink(
  practiceId: string,
): Promise<PaymentLinkResult> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${proto}://${host}` : "";

  return createCheckoutSession(practiceId, { origin });
}

/*
  Validazione documenti lato CRM (@06). L'accesso e gia protetto dal layout
  /crm (requireAdmin); qui richiamiamo comunque requireAdmin come difesa in
  profondita, dato che le server action sono endpoint invocabili direttamente.
*/

export type DocUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function getDocumentUrl(
  practiceId: string,
  index: number,
  fileIdx = 0,
): Promise<DocUrlResult> {
  await requireAdmin();
  const url = await signedDocUrl(practiceId, index, fileIdx);
  if (!url) return { ok: false, error: "Nessun file disponibile." };
  return { ok: true, url };
}

export async function getMandateUrl(practiceId: string): Promise<DocUrlResult> {
  await requireAdmin();
  const url = await mandateFileUrl(practiceId);
  if (!url) return { ok: false, error: "Nessun file mandato disponibile." };
  return { ok: true, url };
}

export type RevealIbanResult =
  | { ok: true; iban: string }
  | { ok: false; error: string };

export async function getIban(practiceId: string): Promise<RevealIbanResult> {
  await requireAdmin();
  const iban = await revealIban(practiceId);
  if (!iban) return { ok: false, error: "IBAN non disponibile." };
  return { ok: true, iban };
}

// Cancellazione dell'IBAN dopo l'F24 (retention @10). Logga l'eliminazione.
export async function clearIban(practiceId: string): Promise<WorkflowResult> {
  await requireAdmin();
  const removed = await deleteIban(practiceId);
  if (removed) {
    const admin = getAdminClient();
    const { data } = await admin
      .from("practices")
      .select("log")
      .eq("id", practiceId)
      .maybeSingle();
    const log: LogEvent[] = Array.isArray(data?.log) ? (data.log as LogEvent[]) : [];
    log.push({ action: "iban_cancellato", at: stamp() });
    await admin.from("practices").update({ log }).eq("id", practiceId);
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  return { ok: true };
}

export async function getFinalDocUrlAdmin(
  practiceId: string,
  index: number,
): Promise<DocUrlResult> {
  await requireAdmin();
  const url = await finalDocUrl(practiceId, index);
  if (!url) return { ok: false, error: "File non disponibile." };
  return { ok: true, url };
}

export async function deleteFinalDoc(practiceId: string, index: number) {
  await requireAdmin();
  await removeFinalDocument(practiceId, index);
  revalidatePath(`/crm/pratiche/${practiceId}`);
}

/* --- Fattura onorario (@05, Opzione L) ------------------------------------- */

export type GenerateInvoiceResult =
  | { ok: true; number: string; alreadyExisted?: boolean }
  | { ok: false; error: string };

// Emissione automatica via provider (FattureInCloud) dal CRM.
export async function generateInvoice(
  practiceId: string,
): Promise<GenerateInvoiceResult> {
  await requireAdmin();
  const res = await issueInvoiceForPractice(practiceId);
  if (res.ok) {
    revalidatePath(`/crm/pratiche/${practiceId}`);
    revalidatePath("/area-riservata/ordine");
  }
  return res;
}

export async function getInvoiceUrlAdmin(
  practiceId: string,
): Promise<DocUrlResult> {
  await requireAdmin();
  const url = await invoiceUrl(practiceId);
  if (!url) return { ok: false, error: "Nessun file fattura disponibile." };
  return { ok: true, url };
}

export async function deleteInvoice(practiceId: string) {
  await requireAdmin();
  await removeInvoice(practiceId);
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/area-riservata/ordine");
}

export async function approveDocument(practiceId: string, index: number) {
  await requireAdmin();
  await setDocStatus(practiceId, index, "APPROVATO");
  revalidatePath(`/crm/pratiche/${practiceId}`);
}

export async function rejectDocument(
  practiceId: string,
  index: number,
  reason: string,
) {
  await requireAdmin();
  await setDocStatus(practiceId, index, "RIFIUTATO", reason);

  // Avvisa il cliente che un documento va ricaricato.
  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("client_email, checklist, communications, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (data?.client_email) {
    const checklist = Array.isArray(data.checklist)
      ? (data.checklist as { label?: string }[])
      : [];
    const label = checklist[index]?.label ?? "Documento";
    const cleanReason = reason.trim() || "Da ricaricare";
    const notice = await notifyDocumentRejected(
      data.client_email,
      label,
      cleanReason,
    );
    if (notice.sent) {
      const communications: Communication[] = Array.isArray(data.communications)
        ? (data.communications as Communication[])
        : [];
      const log: LogEvent[] = Array.isArray(data.log)
        ? (data.log as LogEvent[])
        : [];
      communications.push({
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: notice.subject,
        occurredAt: stamp(),
      });
      log.push({ action: "email_inviata", at: stamp() });
      await admin
        .from("practices")
        .update({ communications, log })
        .eq("id", practiceId);
    }
  }

  revalidatePath(`/crm/pratiche/${practiceId}`);
}

/* ---------------------------------------------------------------------------
   Workflow pratica (@05): cambio stato, comunicazioni manuali, note rapide.
   Tutte le scritture passano da service_role (bypassa RLS) con difesa
   requireAdmin. Lo stato vive sulle colonne/jsonb di `practices`.
--------------------------------------------------------------------------- */

// chi deve agire, derivato dallo stato (default sensato, modificabile a mano in futuro)
const ownerByStatus: Record<PracticeStatus, ActionOwner> = {
  LEAD: "ADMIN",
  PREVENTIVO_INVIATO: "CLIENT",
  PAGATO: "CLIENT",
  ATTESA_DOC: "CLIENT",
  LAVORAZIONE: "ADMIN",
  INVIATA: "EXTERNAL",
  CHIUSA: "NONE",
  ANNULLATA: "NONE",
};

const OPENED_FROM: PracticeStatus[] = [
  "PAGATO",
  "ATTESA_DOC",
  "LAVORAZIONE",
  "INVIATA",
  "CHIUSA",
];

function stamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

export type WorkflowResult = { ok: true } | { ok: false; error: string };

export async function changeStatus(
  practiceId: string,
  status: PracticeStatus,
): Promise<WorkflowResult> {
  await requireAdmin();
  if (!ownerByStatus[status]) return { ok: false, error: "Stato non valido." };

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("status, log, opened_at, submitted_at, client_email, communications")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };
  if (data.status === status) return { ok: true };

  const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
  log.push({ action: `cambio_stato:${status}`, at: stamp() });

  // Rete di sicurezza retention (@10): alla chiusura, se l'IBAN e ancora
  // presente (F24 gia fatto ma non cancellato a mano), lo si elimina ora.
  if (status === "CHIUSA") {
    const removed = await deleteIban(practiceId);
    if (removed) log.push({ action: "iban_cancellato", at: stamp() });
  }

  const patch: Partial<PracticeRow> = {
    status,
    action_owner: ownerByStatus[status],
  };
  if (!data.opened_at && OPENED_FROM.includes(status)) patch.opened_at = stamp();
  if (status === "INVIATA" && !data.submitted_at) patch.submitted_at = stamp();

  // Notifica email al cliente sui passaggi rilevanti + traccia in cronologia.
  const notice = data.client_email
    ? await notifyStatusChange(data.client_email, status)
    : null;
  if (notice?.sent) {
    const communications: Communication[] = Array.isArray(data.communications)
      ? (data.communications as Communication[])
      : [];
    communications.push({
      channel: "EMAIL",
      direction: "OUTBOUND",
      source: "AUTO",
      subject: notice.subject,
      occurredAt: stamp(),
    });
    patch.communications = communications;
    log.push({ action: "email_inviata", at: stamp() });
  }
  patch.log = log;

  const { error } = await admin.from("practices").update(patch).eq("id", practiceId);
  if (error) {
    console.error("[crm] changeStatus:", error.message);
    return { ok: false, error: "Aggiornamento non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm/pratiche");
  revalidatePath("/crm");
  return { ok: true };
}

export async function addCommunication(
  practiceId: string,
  input: {
    channel: Communication["channel"];
    direction: Communication["direction"];
    subject: string;
  },
): Promise<WorkflowResult> {
  await requireAdmin();
  const subject = input.subject.trim();
  if (!subject) return { ok: false, error: "Inserisci un oggetto." };

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("communications, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const communications: Communication[] = Array.isArray(data.communications)
    ? (data.communications as Communication[])
    : [];
  const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
  const now = stamp();
  communications.push({
    channel: input.channel,
    direction: input.direction,
    source: "MANUAL",
    subject,
    occurredAt: now,
  });
  log.push({ action: "comunicazione_registrata", at: now });

  const { error } = await admin
    .from("practices")
    .update({ communications, log })
    .eq("id", practiceId);
  if (error) {
    console.error("[crm] addCommunication:", error.message);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  return { ok: true };
}

/*
  Estrazione AI (@05): legge documenti caricati + appunti chiamata e compila la
  scheda dati per la dichiarazione. Puo durare decine di secondi (documenti
  pesanti): il client la invoca con un pending state dedicato.
*/
export type ExtractionActionResult =
  | { ok: true; result: ExtractionResult }
  | { ok: false; error: string };

export async function runAiExtraction(
  practiceId: string,
): Promise<ExtractionActionResult> {
  await requireAdmin();
  const outcome = await runExtraction(practiceId);
  if (!outcome.ok) return outcome;

  // Traccia l'estrazione nella timeline della pratica.
  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("log")
    .eq("id", practiceId)
    .maybeSingle();
  if (data) {
    const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
    log.push({ action: "estrazione_ai", at: stamp() });
    await admin.from("practices").update({ log }).eq("id", practiceId);
  }

  revalidatePath(`/crm/pratiche/${practiceId}`);
  return outcome;
}

/*
  Salvataggio delle correzioni manuali sui dati estratti (Fetta 3): il JSON
  revisionato sostituisce i dati AI e diventa la base per l'XML .suc.
*/
export async function saveExtractionEdits(
  practiceId: string,
  data: ExtractionData,
): Promise<WorkflowResult> {
  await requireAdmin();
  const res = await saveReviewedData(practiceId, data);
  if (!res.ok) return res;

  const admin = getAdminClient();
  const { data: row } = await admin
    .from("practices")
    .select("log")
    .eq("id", practiceId)
    .maybeSingle();
  if (row) {
    const log: LogEvent[] = Array.isArray(row.log) ? (row.log as LogEvent[]) : [];
    log.push({ action: "dati_estratti_revisionati", at: stamp() });
    await admin.from("practices").update({ log }).eq("id", practiceId);
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  return { ok: true };
}

/*
  Export XML .suc (Fetta 4): genera la fornitura SUC13 dai dati revisionati.
  Restituisce contenuto + nome file al client, che avvia il download; l'esito
  va SEMPRE controllato con il modulo di controllo AdE nel Desktop Telematico.
*/
export type SucExportResult =
  | { ok: true; xml: string; fileName: string; warnings: string[] }
  | { ok: false; error: string };

export async function exportSucXml(
  practiceId: string,
): Promise<SucExportResult> {
  await requireAdmin();
  const admin = getAdminClient();
  const { data: row } = await admin
    .from("practices")
    .select("*")
    .eq("id", practiceId)
    .maybeSingle();
  if (!row) return { ok: false, error: "Pratica non trovata." };

  const extraction = await getExtraction(practiceId);
  if (extraction?.status !== "READY" || !extraction.data) {
    return {
      ok: false,
      error: "Prima esegui (e revisiona) l'estrazione dati: l'XML si genera da li.",
    };
  }

  /*
    Allegati per il Quadro EG: i documenti approvati della checklist, incorporati
    in base64. Il tracciato AdE accetta SOLO pdf e tif/tiff: le foto JPG/PNG dei
    clienti vengono convertite AL VOLO in PDF A4 (lib/image-to-pdf, gli originali
    in storage restano intatti). Altri formati vengono saltati e segnalati.
  */
  const allegati: SucAllegato[] = [];
  const allegatiWarnings: string[] = [];
  let convertiti = 0;
  const checklist = Array.isArray(row.checklist)
    ? (row.checklist as ChecklistItem[])
    : [];

  const MAX_ALLEGATO_BYTES = 5 * 1024 * 1024; // specifiche AdE: max 5 MB per allegato
  const categoryFor = (label: string): SucAllegato["category"] => {
    const lower = label.toLowerCase();
    return /identit/.test(lower)
      ? "DocumentiIdentita"
      : /albero|stato di famiglia/.test(lower)
        ? "AlberoGenealogico"
        : /testamento/.test(lower)
          ? "Testamento"
          : "Altro";
  };
  const pushAllegato = (
    label: string,
    fileName: string,
    payload: Uint8Array,
    mime: SucAllegato["mime"],
  ): boolean => {
    if (payload.byteLength > MAX_ALLEGATO_BYTES) {
      allegatiWarnings.push(
        `Allegato "${label}" (${fileName}) NON incluso: supera i 5 MB previsti dalle specifiche AdE (${(payload.byteLength / 1024 / 1024).toFixed(1)} MB). Ridurlo/dividerlo e allegarlo nel software AdE.`,
      );
      return false;
    }
    allegati.push({
      category: categoryFor(label),
      fileName,
      description: label,
      base64: Buffer.from(payload).toString("base64"),
      mime,
    });
    return true;
  };

  // Per ogni voce: i PDF/TIFF restano allegati singoli; TUTTE le foto della
  // voce vengono unite in UN solo PDF/A multi-pagina (es. atto notarile in
  // 8 foto -> "atto_notarile.pdf" di 8 pagine).
  for (const item of checklist) {
    const label = item.label ?? "Documento";
    const pagine: PdfImage[] = [];
    for (const file of listItemFiles(item)) {
      const ext = file.path.split(".").pop()?.toLowerCase() ?? "";
      const mime =
        ext === "pdf" ? ("application/pdf" as const)
        : ext === "tif" || ext === "tiff" ? ("image/tiff" as const)
        : null;
      const imageMime =
        ext === "jpg" || ext === "jpeg" ? ("image/jpeg" as const)
        : ext === "png" ? ("image/png" as const)
        : null;
      if (!mime && !imageMime) {
        allegatiWarnings.push(
          `Allegato "${label}" (${file.name}) saltato: formato .${ext} non gestito (il tracciato AdE accetta solo PDF/TIFF). Convertirlo in PDF e allegarlo nel software AdE.`,
        );
        continue;
      }
      const { data: blob } = await admin.storage.from(DOC_BUCKET).download(file.path);
      if (!blob) {
        allegatiWarnings.push(
          `Allegato "${label}" (${file.name}): download non riuscito, non incluso.`,
        );
        continue;
      }
      const payload = new Uint8Array(await blob.arrayBuffer());
      if (imageMime) {
        pagine.push({ bytes: payload, mime: imageMime });
      } else {
        const fileName = file.path.split("/").pop() ?? "documento.pdf";
        pushAllegato(label, fileName, payload, mime as SucAllegato["mime"]);
      }
    }
    if (pagine.length > 0) {
      try {
        const pdf = await imagesToPdf(pagine, label);
        const baseName =
          label.toLowerCase().replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "") ||
          "documento";
        if (pushAllegato(label, `${baseName}.pdf`, pdf, "application/pdf")) {
          convertiti += pagine.length;
        }
      } catch {
        allegatiWarnings.push(
          `Allegato "${label}": conversione delle foto in PDF non riuscita (immagine corrotta?), non incluso. Convertirlo a mano e allegarlo nel software AdE.`,
        );
      }
    }
  }

  const built = buildSucXml(row as PracticeRow, extraction.data, {
    cfFornitore: process.env.SUC_CF_FORNITORE,
    allegati,
  });
  built.warnings.push(...allegatiWarnings);
  if (allegati.length > 0) {
    built.warnings.push(
      `Quadro EG: allegati ${allegati.length} documenti dalla checklist (in base64 dentro l'XML)` +
        (convertiti > 0
          ? `; ${convertiti} foto convertite automaticamente in PDF/A (unite per documento).`
          : "."),
    );
  }

  const log: LogEvent[] = Array.isArray(row.log) ? (row.log as LogEvent[]) : [];
  log.push({ action: "export_xml_suc", at: stamp() });
  await admin.from("practices").update({ log }).eq("id", practiceId);
  revalidatePath(`/crm/pratiche/${practiceId}`);

  return { ok: true, ...built };
}

/*
  Appunti chiamata (@05): campo di lavoro di Lorenzo per le informazioni
  raccolte in chiamata col cliente. A differenza di `notes` (append di righe
  timestampate), qui il testo e libero e si salva per intero: e un documento
  vivo che Lorenzo rilegge e corregge, e fara da sorgente per l'estrazione AI
  del dossier dichiarazione.
*/
export async function updateCallNotes(
  practiceId: string,
  text: string,
): Promise<WorkflowResult> {
  await requireAdmin();

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("call_notes, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const next = text.trim();
  if (next === (data.call_notes ?? "").toString().trim()) return { ok: true };

  const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
  log.push({ action: "appunti_chiamata_aggiornati", at: stamp() });

  const { error } = await admin
    .from("practices")
    .update({ call_notes: next, log })
    .eq("id", practiceId);
  if (error) {
    console.error("[crm] updateCallNotes:", error.message);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  return { ok: true };
}

export async function addNote(
  practiceId: string,
  text: string,
): Promise<WorkflowResult> {
  await requireAdmin();
  const note = text.trim();
  if (!note) return { ok: false, error: "Nota vuota." };

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("notes, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const now = stamp();
  const existing = (data.notes ?? "").toString().trim();
  const line = `[${now}] ${note}`;
  const notes = existing ? `${existing}\n${line}` : line;
  const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
  log.push({ action: "nota_aggiunta", at: now });

  const { error } = await admin
    .from("practices")
    .update({ notes, log })
    .eq("id", practiceId);
  if (error) {
    console.error("[crm] addNote:", error.message);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  return { ok: true };
}

/* ---------------------------------------------------------------------------
   Imposte di Stato, pagamento offline, documenti pronti, recesso (@05/@10).
   Stessa filosofia: scrittura via service_role + requireAdmin; le email partono
   come conseguenza dell'azione e, se inviate, lasciano una comunicazione AUTO.
--------------------------------------------------------------------------- */

function loadArrays(data: {
  communications?: unknown;
  log?: unknown;
}): { communications: Communication[]; log: LogEvent[] } {
  return {
    communications: Array.isArray(data.communications)
      ? (data.communications as Communication[])
      : [],
    log: Array.isArray(data.log) ? (data.log as LogEvent[]) : [],
  };
}

// Comunicazione delle imposte di Stato al cliente (autoliquidazione F24, @10).
export async function setStateTaxes(
  practiceId: string,
  amount: number,
): Promise<WorkflowResult> {
  await requireAdmin();
  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, error: "Importo non valido." };
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("client_email, communications, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const { communications, log } = loadArrays(data);
  const now = stamp();
  log.push({ action: `imposte_comunicate:${amount}`, at: now });

  const notice = data.client_email
    ? await notifyTaxesCommunicated(data.client_email, amount)
    : null;
  if (notice?.sent) {
    communications.push({
      channel: "EMAIL",
      direction: "OUTBOUND",
      source: "AUTO",
      subject: notice.subject,
      occurredAt: now,
    });
    log.push({ action: "email_inviata", at: now });
  }

  const { error } = await admin
    .from("practices")
    .update({ state_taxes: amount, communications, log })
    .eq("id", practiceId);
  if (error) {
    console.error("[crm] setStateTaxes:", error.message);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/area-riservata/ordine");
  revalidatePath("/area-riservata/dashboard");
  return { ok: true };
}

export type OfflineMethod = "BANK_TRANSFER" | "CASH" | "OTHER";

const offlineLabels: Record<OfflineMethod, string> = {
  BANK_TRANSFER: "bonifico",
  CASH: "contanti",
  OTHER: "altro",
};

// Pagamento offline (bonifico/contanti/in studio): eccezione al checkout online
// (@05). Porta la pratica a PAGATO con payment_recorded_by=ADMIN + prova testuale.
export async function registerOfflinePayment(
  practiceId: string,
  input: { amount: number; method: OfflineMethod; date: string; note?: string },
): Promise<WorkflowResult> {
  await requireAdmin();
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Importo non valido." };
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select(
      "payment_status, client_email, communications, log, opened_at, payment_notes, due_date, selected_package, checklist, has_real_estate, real_estate_count, has_will, has_minor_heirs",
    )
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };
  if (data.payment_status === "PAID") {
    return { ok: false, error: "La pratica risulta gia pagata." };
  }

  const now = stamp();
  const today = new Date().toISOString().slice(0, 10);
  const { communications, log } = loadArrays(data);
  log.push({ action: `pagamento_offline:${input.method}`, at: now });

  const noteLine = `[${now}] Pagamento ${offlineLabels[input.method]} di ${input.amount}€ del ${input.date || today}${
    input.note?.trim() ? ` - ${input.note.trim()}` : ""
  }`;
  const payment_notes = data.payment_notes
    ? `${data.payment_notes}\n${noteLine}`
    : noteLine;

  const patch: Partial<PracticeRow> = {
    status: "PAGATO",
    action_owner: "CLIENT",
    payment_status: "PAID",
    payment_method: input.method,
    payment_recorded_by: "ADMIN",
    paid_at: new Date().toISOString(),
    opened_at: data.opened_at ?? today,
    payment_notes,
  };

  // Auto-calcolo consegna prevista da SLA pacchetto (se non gia impostata).
  if (!data.due_date) {
    const due = await slaDueDate(data.selected_package, today);
    if (due) {
      patch.due_date = due;
      log.push({ action: "consegna_auto_sla", at: now });
    }
  }

  // Checklist documenti auto-generata al pagamento, come nel webhook Stripe.
  if (!Array.isArray(data.checklist) || data.checklist.length === 0) {
    patch.checklist = generateChecklist({
      hasRealEstate: Boolean(data.has_real_estate),
      realEstateCount: data.real_estate_count,
      hasWill: Boolean(data.has_will),
      hasMinorHeirs: Boolean(data.has_minor_heirs),
    });
    log.push({ action: "checklist_generata", at: now });
  }

  const notice = data.client_email
    ? await notifyStatusChange(data.client_email, "PAGATO")
    : null;
  if (notice?.sent) {
    communications.push({
      channel: "EMAIL",
      direction: "OUTBOUND",
      source: "AUTO",
      subject: notice.subject,
      occurredAt: now,
    });
    log.push({ action: "email_inviata", at: now });
  }
  patch.communications = communications;
  patch.log = log;

  const { error } = await admin.from("practices").update(patch).eq("id", practiceId);
  if (error) {
    console.error("[crm] registerOfflinePayment:", error.message);
    return { ok: false, error: "Registrazione non riuscita." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm/pratiche");
  revalidatePath("/crm");
  revalidatePath("/crm/calendario");
  revalidatePath("/area-riservata/ordine");
  return { ok: true };
}

// Avvisa il cliente che i documenti finali sono pronti (@05).
export async function notifyFinalDocsReadyAction(
  practiceId: string,
): Promise<WorkflowResult> {
  await requireAdmin();
  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("client_email, communications, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };
  if (!data.client_email) return { ok: false, error: "Nessuna email cliente." };

  const notice = await notifyFinalDocsReady(data.client_email);
  if (!notice.sent) {
    return {
      ok: false,
      error: "Email non inviata (provider email non ancora configurato).",
    };
  }
  const { communications, log } = loadArrays(data);
  const now = stamp();
  communications.push({
    channel: "EMAIL",
    direction: "OUTBOUND",
    source: "AUTO",
    subject: notice.subject,
    occurredAt: now,
  });
  log.push({ action: "documenti_pronti_notificati", at: now });
  log.push({ action: "email_inviata", at: now });
  await admin
    .from("practices")
    .update({ communications, log })
    .eq("id", practiceId);
  revalidatePath(`/crm/pratiche/${practiceId}`);
  return { ok: true };
}

// Data di consegna prevista (popola il calendario). Vuota = rimuove la data.
export async function setDueDate(
  practiceId: string,
  date: string,
): Promise<WorkflowResult> {
  await requireAdmin();
  const value = date.trim();
  if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { ok: false, error: "Data non valida." };
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
  log.push({ action: value ? "consegna_impostata" : "consegna_rimossa", at: stamp() });

  const { error } = await admin
    .from("practices")
    .update({ due_date: value || null, log })
    .eq("id", practiceId);
  if (error) {
    console.error("[crm] setDueDate:", error.message);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm");
  revalidatePath("/crm/calendario");
  return { ok: true };
}

// --- To-Do della pratica (@05) ---------------------------------------------

function loadTasks(data: { tasks?: unknown }): TaskItem[] {
  return Array.isArray(data.tasks) ? (data.tasks as TaskItem[]) : [];
}

export async function addTask(
  practiceId: string,
  title: string,
  dueDate?: string,
): Promise<WorkflowResult> {
  await requireAdmin();
  const text = title.trim();
  if (!text) return { ok: false, error: "Inserisci un promemoria." };

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("tasks, log")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const tasks = loadTasks(data);
  tasks.push({ title: text, dueDate: dueDate?.trim() || null, done: false });
  const log: LogEvent[] = Array.isArray(data.log) ? (data.log as LogEvent[]) : [];
  log.push({ action: "todo_aggiunto", at: stamp() });

  const { error } = await admin
    .from("practices")
    .update({ tasks, log })
    .eq("id", practiceId);
  if (error) {
    console.error("[crm] addTask:", error.message);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm");
  return { ok: true };
}

export async function toggleTask(
  practiceId: string,
  index: number,
  done: boolean,
): Promise<WorkflowResult> {
  await requireAdmin();
  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("tasks")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const tasks = loadTasks(data);
  if (!tasks[index]) return { ok: false, error: "Promemoria non trovato." };
  tasks[index] = { ...tasks[index], done };

  const { error } = await admin
    .from("practices")
    .update({ tasks })
    .eq("id", practiceId);
  if (error) return { ok: false, error: "Aggiornamento non riuscito." };
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm");
  return { ok: true };
}

export async function removeTask(
  practiceId: string,
  index: number,
): Promise<WorkflowResult> {
  await requireAdmin();
  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("tasks")
    .eq("id", practiceId)
    .maybeSingle();
  if (!data) return { ok: false, error: "Pratica non trovata." };

  const tasks = loadTasks(data);
  if (!tasks[index]) return { ok: true };
  tasks.splice(index, 1);

  const { error } = await admin
    .from("practices")
    .update({ tasks })
    .eq("id", practiceId);
  if (error) return { ok: false, error: "Aggiornamento non riuscito." };
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm");
  return { ok: true };
}

// Esito del recesso dal CRM (in gestione / accettato / respinto) + email cliente.
export async function updateWithdrawal(
  practiceId: string,
  status: WithdrawalStatus,
  note?: string,
): Promise<WorkflowResult> {
  await requireAdmin();
  const updated = await setWithdrawalStatus(practiceId, status, note);
  if (!updated) {
    return { ok: false, error: "Nessuna richiesta di recesso da aggiornare." };
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("status, client_email, communications, log")
    .eq("id", practiceId)
    .maybeSingle();
  const { communications, log } = loadArrays(data ?? {});
  const now = stamp();
  log.push({ action: `recesso:${status}`, at: now });

  // Richiesta risolta: il badge torna all'owner naturale dello stato pratica;
  // finche e in gestione (IN_REVIEW) la palla resta a Lorenzo.
  const actionOwner: ActionOwner =
    status === "ACCEPTED" || status === "REJECTED"
      ? (data?.status ? ownerByStatus[data.status] : "ADMIN")
      : "ADMIN";

  if (
    data?.client_email &&
    (status === "IN_REVIEW" || status === "ACCEPTED" || status === "REJECTED")
  ) {
    const notice = await notifyWithdrawalOutcome(
      data.client_email,
      status,
      note?.trim() ?? "",
    );
    if (notice.sent) {
      communications.push({
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: notice.subject,
        occurredAt: now,
      });
      log.push({ action: "email_inviata", at: now });
    }
  }

  await admin
    .from("practices")
    .update({ communications, log, action_owner: actionOwner })
    .eq("id", practiceId);
  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/crm");
  revalidatePath("/area-riservata/recesso");
  return { ok: true };
}
