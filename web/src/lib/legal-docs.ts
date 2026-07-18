import { legalDocs, type LegalDoc, type LegalSlug } from "@/content/legal";
import { legalDocsAr } from "@/content/legal.ar";

/**
 * Documento legale per locale.
 * IT = testo di fede; AR = cortesia (fallback IT per altre lingue).
 */
export function getLegalDoc(
  slug: LegalSlug,
  locale: string = "it",
): LegalDoc {
  if (locale === "ar") return legalDocsAr[slug];
  return legalDocs[slug];
}

export type { LegalDoc, LegalSlug };
