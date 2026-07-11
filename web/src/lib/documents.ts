import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import type { ChecklistItem, RequirementStatus } from "@/content/crm-data";

/*
  Gestione documenti della pratica su Supabase Storage (bucket PRIVATO).
  Modello di sicurezza: tutto l'accesso allo Storage passa SOLO dal server con
  service_role; la PROPRIETA viene verificata dai chiamanti (area cliente via
  getClientView, CRM via requireAdmin). Lo stato dei documenti vive nel jsonb
  `checklist` della pratica (nessuna tabella dedicata in questa fase, @SPEC_Data_Model).
  Tipi/limiti allineati a @06 (PDF/JPG/PNG, peso massimo).
*/

export const DOC_BUCKET = "practice-docs";
export const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png"];

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

export async function uploadDocument(
  practiceId: string,
  index: number,
  file: File,
): Promise<ChecklistItem> {
  const admin = getAdminClient();
  await ensureBucket(admin);

  const checklist = await getChecklist(admin, practiceId);
  const item = checklist[index];
  if (!item) throw new Error("Voce della checklist non trovata.");

  const path = `${practiceId}/${index}-${sanitizeName(file.name)}`;
  if (item.filePath && item.filePath !== path) {
    await admin.storage.from(DOC_BUCKET).remove([item.filePath]);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from(DOC_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) throw error;

  const updated: ChecklistItem = {
    ...item,
    status: "CARICATO",
    reason: undefined,
    filePath: path,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };
  checklist[index] = updated;
  await saveChecklist(admin, practiceId, checklist);
  return updated;
}

export async function removeDocument(practiceId: string, index: number): Promise<void> {
  const admin = getAdminClient();
  const checklist = await getChecklist(admin, practiceId);
  const item = checklist[index];
  if (!item) return;
  if (item.filePath) {
    await admin.storage.from(DOC_BUCKET).remove([item.filePath]);
  }
  checklist[index] = {
    ...item,
    status: "ATTESO",
    reason: undefined,
    filePath: undefined,
    fileName: undefined,
    uploadedAt: undefined,
  };
  await saveChecklist(admin, practiceId, checklist);
}

export async function signedDocUrl(
  practiceId: string,
  index: number,
): Promise<string | null> {
  const admin = getAdminClient();
  const checklist = await getChecklist(admin, practiceId);
  const filePath = checklist[index]?.filePath;
  if (!filePath) return null;
  const { data } = await admin.storage
    .from(DOC_BUCKET)
    .createSignedUrl(filePath, 60);
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
