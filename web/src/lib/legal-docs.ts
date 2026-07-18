import { legalDocs, type LegalDoc, type LegalSlug } from "@/content/legal";
import { legalDocsAr } from "@/content/legal.ar";
import { legalDocsEn } from "@/content/legal.en";
import { legalDocsTr } from "@/content/legal.tr";
import { legalDocsFr } from "@/content/legal.fr";
import { legalDocsSq } from "@/content/legal.sq";
import { legalDocsDe } from "@/content/legal.de";
import { legalDocsEs } from "@/content/legal.es";
import { legalDocsRu } from "@/content/legal.ru";
import { legalDocsZh } from "@/content/legal.zh";
import { legalDocsHi } from "@/content/legal.hi";

/**
 * Documento legale per locale.
 * IT = testo di fede; altre lingue UI = cortesia (fallback IT se assente).
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
  if (locale === "de") return legalDocsDe[slug];
  if (locale === "es") return legalDocsEs[slug];
  if (locale === "ru") return legalDocsRu[slug];
  if (locale === "zh") return legalDocsZh[slug];
  if (locale === "hi") return legalDocsHi[slug];
  return legalDocs[slug];
}

export type { LegalDoc, LegalSlug };
