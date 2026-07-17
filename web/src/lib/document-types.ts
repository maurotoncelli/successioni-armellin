import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import {
  BUILTIN_DOCUMENT_TYPES,
  type DocWhen,
  type DocumentTypeDef,
  type DocumentTypeState,
} from "@/lib/document-types-shared";

export type { DocWhen, DocumentTypeDef, DocumentTypeState };
export { BUILTIN_DOCUMENT_TYPES, WHEN_LABELS } from "@/lib/document-types-shared";

/*
  Catalogo tipologie documenti per checklist automatica.
  NO-DDL: override Lorenzo in Storage `practice-docs/site/_document-types.json`
  (attiva/disattiva, verificato, tipi custom).
*/

const STORAGE_PATH = "site/_document-types.json";

const EMPTY_STATE: DocumentTypeState = {
  active: {},
  checked: {},
  custom: [],
  updatedAt: null,
};

function normalize(raw: unknown): DocumentTypeState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_STATE, custom: [] };
  const o = raw as Partial<DocumentTypeState>;
  const custom = Array.isArray(o.custom)
    ? o.custom
        .filter((c) => c && typeof c === "object" && typeof c.id === "string")
        .map((c) => ({
          id: String(c.id),
          label: String(c.label || "Documento"),
          required: Boolean(c.required),
          help: String(c.help || ""),
          when: (["always", "real_estate", "will", "minors"] as const).includes(
            c.when as DocWhen,
          )
            ? (c.when as DocWhen)
            : "always",
          builtin: false,
        }))
    : [];
  return {
    active:
      o.active && typeof o.active === "object"
        ? (o.active as Record<string, boolean>)
        : {},
    checked:
      o.checked && typeof o.checked === "object"
        ? (o.checked as Record<string, boolean>)
        : {},
    custom,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
  };
}

export async function getDocumentTypesState(): Promise<DocumentTypeState> {
  if (!isAdminConfigured) return { ...EMPTY_STATE, custom: [] };
  try {
    const { data, error } = await getAdminClient()
      .storage.from(DOC_BUCKET)
      .download(STORAGE_PATH);
    if (error || !data) return { ...EMPTY_STATE, custom: [] };
    return normalize(JSON.parse(await data.text()));
  } catch (err) {
    console.error("[document-types] read:", err);
    return { ...EMPTY_STATE, custom: [] };
  }
}

export async function saveDocumentTypesState(
  state: Omit<DocumentTypeState, "updatedAt">,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isAdminConfigured) {
    return { ok: false, error: "Database non collegato." };
  }
  const next: DocumentTypeState = {
    active: state.active,
    checked: state.checked,
    custom: state.custom.map((c) => ({ ...c, builtin: false })),
    updatedAt: new Date().toISOString(),
  };
  try {
    const admin = getAdminClient();
    await ensureDocBucket(admin);
    const blob = Buffer.from(JSON.stringify(next), "utf8");
    const { error } = await admin.storage.from(DOC_BUCKET).upload(STORAGE_PATH, blob, {
      contentType: "application/json",
      upsert: true,
    });
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error("[document-types] save:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }
}

/** Catalogo effettivo (builtin + custom) con flag active/checked risolti. */
export function resolveDocumentCatalog(state: DocumentTypeState): Array<
  DocumentTypeDef & { active: boolean; checked: boolean }
> {
  const all = [...BUILTIN_DOCUMENT_TYPES, ...state.custom];
  return all.map((t) => ({
    ...t,
    active: state.active[t.id] !== false,
    checked: Boolean(state.checked[t.id]),
  }));
}

export function isTypeActive(state: DocumentTypeState, id: string): boolean {
  return state.active[id] !== false;
}
