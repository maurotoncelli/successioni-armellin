"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  saveDocumentTypesState,
  type DocWhen,
  type DocumentTypeDef,
  type DocumentTypeState,
} from "@/lib/document-types";

export type SaveDocTypesResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveDocumentTypes(
  input: {
    active: Record<string, boolean>;
    checked: Record<string, boolean>;
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

  const state: Omit<DocumentTypeState, "updatedAt"> = {
    active: input.active,
    checked: input.checked,
    custom,
  };

  const res = await saveDocumentTypesState(state);
  if (!res.ok) return res;

  revalidatePath("/crm/tipologie-documenti");
  return { ok: true };
}
