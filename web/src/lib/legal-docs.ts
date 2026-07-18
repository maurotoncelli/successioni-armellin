import { legalDocs, type LegalDoc, type LegalSlug } from "@/content/legal";
import { legalDocsAr } from "@/content/legal.ar";
import { legalDocsEn } from "@/content/legal.en";

/**
 * Documento legale per locale.
 * IT = testo di fede; AR/EN = cortesia (fallback IT per altre lingue).
 */
export function getLegalDoc(
  slug: LegalSlug,
  locale: string = "it",
): LegalDoc {
  if (locale === "ar") return legalDocsAr[slug];
  if (locale === "en") return legalDocsEn[slug];
  return legalDocs[slug];
}

export type { LegalDoc, LegalSlug };
