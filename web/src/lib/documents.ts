import "server-only";
import sharp from "sharp";
import { getAdminClient } from "@/lib/supabase/admin";
import type { ChecklistFile, ChecklistItem, RequirementStatus } from "@/content/crm-data";

/*
  Gestione documenti della pratica su Supabase Storage (bucket PRIVATO).
  Modello di sicurezza: tutto l'accesso allo Storage passa SOLO dal server con
  service_role; la PROPRIETA viene verificata dai chiamanti (area cliente via
  getClientView, CRM via requireAdmin). Lo stato dei documenti vive nel jsonb
  `checklist` della pratica (nessuna tabella dedicata in questa fase, @SPEC_Data_Model).

  Multi-file: ogni voce accetta fino a MAX_FILES_PER_ITEM file (es. fronte/retro
  della carta d'identita). I file vivono in `item.files`; `filePath`/`fileName`
  restano allineati al PRIMO file per retro-compatibilita con le pratiche
  esistenti. Leggere SEMPRE tramite listItemFiles().

  Compressione: le foto (JPG/PNG) vengono ricompresse lato server al caricamento
  (max 2000px, JPEG q82). Cosi una foto da telefono di 6-8 MB scende sotto il
  mezzo MB e il PDF/A generato all'export resta entro i 5 MB delle specifiche AdE.
*/

export const DOC_BUCKET = "practice-docs";
export const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png"];
// Documenti multi-pagina fotografati (es. atto notarile): all'export le foto
// della stessa voce vengono unite in un unico PDF/A, quindi il limite puo
// essere generoso.
export const MAX_FILES_PER_ITEM = 10;

type Admin = ReturnType<typeof getAdminClient>;

export async function ensureDocBucket(admin: Admin) {
  return ensureBucket(admin);
}

async function ensureBucket(admin: Admin) {
  const { data } = await admin.storage.getBucket(DOC_BUCKET);
  if (!data) {
    // Niente allowedMimeTypes a livello bucket: oltre ai documenti del cliente
    // (validati lato app con ALLOWED_DOC_TYPES) qui vivono anche i JSON interni
    // (_extras.json, _extraction.json) e i documenti finali di Lorenzo.
    await admin.storage.createBucket(DOC_BUCKET, {
      public: false,
      fileSizeLimit: MAX_DOC_BYTES,
    });
  }
}

/** Elenco file di una voce: unifica `files` (nuovo) e filePath legacy. */
export function listItemFiles(
  item: Pick<ChecklistItem, "files" | "filePath" | "fileName" | "uploadedAt">,
): ChecklistFile[] {
  if (item.files && item.files.length > 0) return item.files;
  if (item.filePath) {
    return [
      {
        path: item.filePath,
        name: item.fileName ?? item.filePath.split("/").pop() ?? "documento",
        uploadedAt: item.uploadedAt,
      },
    ];
  }
  return [];
}

// Mantiene filePath/fileName legacy allineati al primo file dell'elenco.
function withFiles(item: ChecklistItem, files: ChecklistFile[]): ChecklistItem {
  return {
    ...item,
    files: files.length > 0 ? files : undefined,
    filePath: files[0]?.path,
    fileName: files[0]?.name,
    uploadedAt: files[0]?.uploadedAt,
  };
}

async function getChecklist(admin: Admin, practiceId: string): Promise<ChecklistItem[]> {
  const { data } = await admin
    .from("practices")
    .select("checklist")
    .eq("id", practiceId)
    .maybeSingle();
  return Array.isArray(data?.checklist) ? (data.checklist as ChecklistItem[]) : [];
}

async function saveChecklist(admin: Admin, practiceId: string, checklist: ChecklistItem[]) {
  const { error } = await admin
    .from("practices")
    .update({ checklist })
    .eq("id", practiceId);
  if (error) throw error;
}

function sanitizeName(name: string): string {
  const cleaned = name.replace(/[^\w.\-]+/g, "_");
  return cleaned.slice(-80) || "file";
}

/**
 * Ricomprime le foto lato server: orientamento EXIF applicato, lato massimo
 * 2000px, JPEG q82. I PDF passano invariati. In caso di errore sharp (file
 * corrotto) il file originale viene caricato cosi com'e: meglio un originale
 * pesante che un upload fallito.
 */
async function compressUpload(
  file: File,
): Promise<{ bytes: Buffer; contentType: string; name: string }> {
  const original = Buffer.from(await file.arrayBuffer());
  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    return { bytes: original, contentType: file.type, name: file.name };
  }
  try {
    const compressed = await sharp(original)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    // Se per qualche motivo la ricompressione pesasse di piu, tieni l'originale.
    if (compressed.byteLength >= original.byteLength) {
      return { bytes: original, contentType: file.type, name: file.name };
    }
    return {
      bytes: compressed,
      contentType: "image/jpeg",
      name: file.name.replace(/\.(jpe?g|png)$/i, "") + ".jpg",
    };
  } catch {
    return { bytes: original, contentType: file.type, name: file.name };
  }
}

export type UploadOutcome = {
  item: ChecklistItem;
  /** La voce era stata RIFIUTATA: questo upload e la correzione richiesta. */
  wasRejected: boolean;
  /** Dopo l'upload restano ALTRE voci rifiutate da ricaricare. */
  otherRejectedRemaining: boolean;
};

export async function uploadDocument(
  practiceId: string,
  index: number,
  file: File,
): Promise<UploadOutcome> {
  const admin = getAdminClient();
  await ensureBucket(admin);

  const checklist = await getChecklist(admin, practiceId);
  const item = checklist[index];
  if (!item) throw new Error("Voce della checklist non trovata.");
  const wasRejected = item.status === "RIFIUTATO";

  const files = listItemFiles(item);
  if (files.length >= MAX_FILES_PER_ITEM) {
    throw new Error(
      `Massimo ${MAX_FILES_PER_ITEM} file per documento: elimina un file per caricarne un altro.`,
    );
  }

  const upload = await compressUpload(file);
  // Suffisso univoco: piu file per voce possono avere lo stesso nome.
  const path = `${practiceId}/${index}-${Date.now().toString(36)}-${sanitizeName(upload.name)}`;

  const { error } = await admin.storage
    .from(DOC_BUCKET)
    .upload(path, upload.bytes, { contentType: upload.contentType, upsert: true });
  if (error) throw error;

  const next: ChecklistFile[] = [
    ...files,
    { path, name: upload.name, uploadedAt: new Date().toISOString() },
  ];
  const updated: ChecklistItem = {
    ...withFiles(item, next),
    status: "CARICATO",
    reason: undefined,
  };
  checklist[index] = updated;
  await saveChecklist(admin, practiceId, checklist);
  return {
    item: updated,
    wasRejected,
    otherRejectedRemaining: checklist.some(
      (c, i) => i !== index && c.status === "RIFIUTATO",
    ),
  };
}

/**
 * Rimuove un singolo file della voce (fileIdx) o tutti se fileIdx e omesso.
 * La voce torna ATTESO solo quando non restano file.
 */
export async function removeDocument(
  practiceId: string,
  index: number,
  fileIdx?: number,
): Promise<void> {
  const admin = getAdminClient();
  const checklist = await getChecklist(admin, practiceId);
  const item = checklist[index];
  if (!item) return;

  const files = listItemFiles(item);
  const toRemove =
    fileIdx === undefined ? files : files[fileIdx] ? [files[fileIdx]] : [];
  if (toRemove.length > 0) {
    await admin.storage.from(DOC_BUCKET).remove(toRemove.map((f) => f.path));
  }
  const remaining =
    fileIdx === undefined ? [] : files.filter((_, i) => i !== fileIdx);

  checklist[index] = {
    ...withFiles(item, remaining),
    status: remaining.length > 0 ? item.status : "ATTESO",
    reason: undefined,
  };
  await saveChecklist(admin, practiceId, checklist);
}

export async function signedDocUrl(
  practiceId: string,
  index: number,
  fileIdx = 0,
): Promise<string | null> {
  const admin = getAdminClient();
  const checklist = await getChecklist(admin, practiceId);
  const item = checklist[index];
  if (!item) return null;
  const file = listItemFiles(item)[fileIdx];
  if (!file) return null;
  const { data } = await admin.storage
    .from(DOC_BUCKET)
    .createSignedUrl(file.path, 60);
  return data?.signedUrl ?? null;
}

export async function setDocStatus(
  practiceId: string,
  index: number,
  status: RequirementStatus,
  reason?: string,
): Promise<void> {
  const admin = getAdminClient();
  const checklist = await getChecklist(admin, practiceId);
  const item = checklist[index];
  if (!item) return;
  checklist[index] = {
    ...item,
    status,
    reason: status === "RIFIUTATO" ? reason?.trim() || "Da ricaricare" : undefined,
  };
  await saveChecklist(admin, practiceId, checklist);
}
