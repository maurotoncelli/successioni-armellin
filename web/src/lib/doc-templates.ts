/*
  Modelli scaricabili abbinati alle voci checklist.
  Default in document-types-shared; override CRM in Storage (_document-types.json).
  L'abbinamento per etichetta resta per le checklist gia generate.
*/

import {
  BUILTIN_DOCUMENT_TYPES,
  DEFAULT_TEMPLATES_BY_TYPE,
  LABEL_TEMPLATE_FALLBACKS,
  type DocumentTypeState,
  type ManagedDocTemplate,
} from "@/lib/document-types-shared";

export type DocTemplate = {
  href: string;
  name: string;
};

function toPublic(t: ManagedDocTemplate): DocTemplate {
  const href = t.storagePath
    ? `/api/doc-templates/download?path=${encodeURIComponent(t.storagePath)}`
    : t.href;
  return { href, name: t.name };
}

function resolveTypeId(
  label: string,
  state?: DocumentTypeState | null,
): string | null {
  const all = [
    ...BUILTIN_DOCUMENT_TYPES,
    ...(state?.custom ?? []),
  ];
  const exact = all.find(
    (t) => t.label.trim().toLowerCase() === label.trim().toLowerCase(),
  );
  if (exact) return exact.id;

  // Visure generate come "Visura catastale - immobile N"
  if (/^visura catastale/i.test(label)) return "visura";

  for (const fb of LABEL_TEMPLATE_FALLBACKS) {
    if (fb.pattern.test(label)) return fb.typeId;
  }
  return null;
}

function templatesForTypeId(
  typeId: string,
  state?: DocumentTypeState | null,
): ManagedDocTemplate[] {
  if (state && Object.prototype.hasOwnProperty.call(state.templatesByTypeId, typeId)) {
    return state.templatesByTypeId[typeId] ?? [];
  }
  return DEFAULT_TEMPLATES_BY_TYPE[typeId] ?? [];
}

/**
 * Sync: solo default (senza override CRM). Usato come fallback client-side
 * se la pagina non ha passato i template risolti.
 */
export function templatesForLabel(label: string): DocTemplate[] {
  const typeId = resolveTypeId(label, null);
  if (!typeId) return [];
  return templatesForTypeId(typeId, null).map(toPublic);
}

/** Con stato CRM: risolve override + href Storage. */
export function templatesForLabelWithState(
  label: string,
  state: DocumentTypeState,
): DocTemplate[] {
  const typeId = resolveTypeId(label, state);
  if (!typeId) return [];
  return templatesForTypeId(typeId, state).map(toPublic);
}
