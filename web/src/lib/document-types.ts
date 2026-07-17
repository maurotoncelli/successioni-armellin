import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import {
  BUILTIN_DOCUMENT_TYPES,
  DEFAULT_TEMPLATES_BY_TYPE,
  type DocWhen,
  type DocumentTypeDef,
  type DocumentTypeState,
  type ManagedDocTemplate,
} from "@/lib/document-types-shared";

export type { DocWhen, DocumentTypeDef, DocumentTypeState, ManagedDocTemplate };
export {
  BUILTIN_DOCUMENT_TYPES,
  DEFAULT_TEMPLATES_BY_TYPE,
  WHEN_LABELS,
  LABEL_TEMPLATE_FALLBACKS,
} from "@/lib/document-types-shared";

/*
  Catalogo tipologie documenti + modelli PDF.
  NO-DDL: Storage `practice-docs/site/_document-types.json`
*/

const STORAGE_PATH = "site/_document-types.json";

const EMPTY_STATE: DocumentTypeState = {
  active: {},
  templatesByTypeId: {},
  custom: [],
  updatedAt: null,
};

function normalizeTemplate(raw: unknown): ManagedDocTemplate | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Partial<ManagedDocTemplate>;
  if (!t.id || !t.name || !t.href) return null;
  return {
    id: String(t.id),
    name: String(t.name),
    href: String(t.href),
    storagePath: t.storagePath ? String(t.storagePath) : null,
  };
}

function normalize(raw: unknown): DocumentTypeState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_STATE, custom: [] };
  const o = raw as Partial<DocumentTypeState> & { checked?: unknown };
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

  const templatesByTypeId: Record<string, ManagedDocTemplate[]> = {};
  if (o.templatesByTypeId && typeof o.templatesByTypeId === "object") {
    for (const [typeId, list] of Object.entries(o.templatesByTypeId)) {
      if (!Array.isArray(list)) continue;
      templatesByTypeId[typeId] = list
        .map(normalizeTemplate)
        .filter((t): t is ManagedDocTemplate => Boolean(t));
    }
  }

  return {
    active:
      o.active && typeof o.active === "object"
        ? (o.active as Record<string, boolean>)
        : {},
    templatesByTypeId,
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
    templatesByTypeId: state.templatesByTypeId,
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

export function resolveDocumentCatalog(state: DocumentTypeState): Array<
  DocumentTypeDef & { active: boolean; templates: ManagedDocTemplate[] }
> {
  const all = [...BUILTIN_DOCUMENT_TYPES, ...state.custom];
  return all.map((t) => ({
    ...t,
    active: state.active[t.id] !== false,
    templates: resolveTemplatesForTypeId(state, t.id),
  }));
}

export function isTypeActive(state: DocumentTypeState, id: string): boolean {
  return state.active[id] !== false;
}

/** Template effettivi per typeId (override salvato oppure default). */
export function resolveTemplatesForTypeId(
  state: DocumentTypeState,
  typeId: string,
): ManagedDocTemplate[] {
  if (Object.prototype.hasOwnProperty.call(state.templatesByTypeId, typeId)) {
    return state.templatesByTypeId[typeId] ?? [];
  }
  return DEFAULT_TEMPLATES_BY_TYPE[typeId] ?? [];
}

export function publicTemplateHref(t: ManagedDocTemplate): string {
  if (t.storagePath) {
    return `/api/doc-templates/download?path=${encodeURIComponent(t.storagePath)}`;
  }
  return t.href;
}
