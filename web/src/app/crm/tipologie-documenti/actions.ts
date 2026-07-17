"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import {
  getDocumentTypesState,
  saveDocumentTypesState,
  type DocWhen,
  type DocumentTypeDef,
  type DocumentTypeState,
  type ManagedDocTemplate,
} from "@/lib/document-types";
import { DEFAULT_TEMPLATES_BY_TYPE } from "@/lib/document-types-shared";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export type SaveDocTypesResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveDocumentTypes(
  input: {
    active: Record<string, boolean>;
    templatesByTypeId: Record<string, ManagedDocTemplate[]>;
    custom: Array<{
      id: string;
      label: string;
      required: boolean;
      help: string;
      when: DocWhen;
    }>;
  },
): Promise<SaveDocTypesResult> {
  await requireAdmin();

  const custom: DocumentTypeDef[] = input.custom
    .filter((c) => c.label.trim())
    .map((c) => ({
      id: c.id || `custom_${crypto.randomUUID().slice(0, 8)}`,
      label: c.label.trim(),
      required: Boolean(c.required),
      help: (c.help || "").trim(),
      when: c.when,
      builtin: false,
    }));

  const templatesByTypeId: Record<string, ManagedDocTemplate[]> = {};
  for (const [typeId, list] of Object.entries(input.templatesByTypeId)) {
    templatesByTypeId[typeId] = list
      .filter((t) => t.name.trim() && (t.href || t.storagePath))
      .map((t) => ({
        id: t.id || `tpl_${crypto.randomUUID().slice(0, 8)}`,
        name: t.name.trim(),
        href: t.storagePath
          ? `/api/doc-templates/download?path=${encodeURIComponent(t.storagePath)}`
          : t.href,
        storagePath: t.storagePath ?? null,
      }));
  }

  const state: Omit<DocumentTypeState, "updatedAt"> = {
    active: input.active,
    templatesByTypeId,
    custom,
  };

  const res = await saveDocumentTypesState(state);
  if (!res.ok) return res;

  revalidatePath("/crm/tipologie-documenti");
  revalidatePath("/area-riservata/documenti");
  return { ok: true };
}

export type UploadTemplateResult =
  | { ok: true; template: ManagedDocTemplate }
  | { ok: false; error: string };

/** Carica un PDF modello e lo aggancia alla tipologia (salva subito lo stato). */
export async function uploadDocumentTemplate(
  typeId: string,
  formData: FormData,
): Promise<UploadTemplateResult> {
  await requireAdmin();
  if (!isAdminConfigured) return { ok: false, error: "Database non collegato." };

  const file = formData.get("file");
  const nameRaw = formData.get("name");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Seleziona un file PDF." };
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "Solo PDF consentiti." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "File troppo grande (max 8 MB)." };
  }

  const displayName =
    (typeof nameRaw === "string" && nameRaw.trim()) ||
    file.name.replace(/\.pdf$/i, "") ||
    "Modello";

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
  const storagePath = `site/doc-templates/${typeId}/${Date.now()}_${safeName}`;

  try {
    const admin = getAdminClient();
    await ensureDocBucket(admin);
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await admin.storage.from(DOC_BUCKET).upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });
    if (error) throw error;

    const template: ManagedDocTemplate = {
      id: `tpl_${crypto.randomUUID().slice(0, 8)}`,
      name: displayName,
      href: `/api/doc-templates/download?path=${encodeURIComponent(storagePath)}`,
      storagePath,
    };

    const state = await getDocumentTypesState();
    const current =
      state.templatesByTypeId[typeId] ??
      DEFAULT_TEMPLATES_BY_TYPE[typeId] ??
      [];
    const nextList = [...current, template];
    const res = await saveDocumentTypesState({
      active: state.active,
      custom: state.custom,
      templatesByTypeId: {
        ...state.templatesByTypeId,
        [typeId]: nextList,
      },
    });
    if (!res.ok) return res;

    revalidatePath("/crm/tipologie-documenti");
    revalidatePath("/area-riservata/documenti");
    return { ok: true, template };
  } catch (err) {
    console.error("[document-types] upload template:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Upload non riuscito.",
    };
  }
}
