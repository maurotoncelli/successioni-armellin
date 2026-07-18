import { legalDocs, type LegalDoc, type LegalSlug } from "@/content/legal";
import { legalDocsAr } from "@/content/legal.ar";
import { legalDocsEn } from "@/content/legal.en";
import { legalDocsTr } from "@/content/legal.tr";
import { legalDocsFr } from "@/content/legal.fr";
import { legalDocsSq } from "@/content/legal.sq";

/**
 * Documento legale per locale.
 * IT = testo di fede; AR/EN/TR/FR/SQ = cortesia (fallback IT per altre lingue).
 */
export function getLegalDoc(
  slug: LegalSlug,
  locale: string = "it",
): LegalDoc {
  if (locale === "ar") return legalDocsAr[slug];
  if (locale === "en") return legalDocsEn[slug];
  if (locale === "tr") return legalDocsTr[slug];
  if (locale === "fr") return legalDocsFr[slug];
  if (locale === "sq") return legalDocsSq[slug];
  return legalDocs[slug];
}

export type { LegalDoc, LegalSlug };
