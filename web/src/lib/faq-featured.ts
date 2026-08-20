import type { Faq } from "@/lib/cms";

function hay(faq: Faq) {
  return `${faq.category} ${faq.question}`.toLowerCase();
}

/** Obiezioni di acquisto: gratis da soli, geometra, obbligo. */
export function isFeaturedFaq(faq: Faq) {
  const t = hay(faq);
  return /perch|soli|gratis|agenzia|geometr|commercialist|obblig|esonero|why |alone|surveyor|accountant|pflicht|gratuit|solo/.test(
    t,
  );
}

export function pickFeaturedFaqs(faqs: Faq[], n = 3): Faq[] {
  const featured = faqs.filter(isFeaturedFaq);
  if (featured.length >= n) return featured.slice(0, n);
  const rest = faqs.filter((f) => !featured.includes(f));
  return [...featured, ...rest].slice(0, n);
}

export function splitFeaturedFaqs(faqs: Faq[]) {
  const featured = faqs.filter(isFeaturedFaq);
  const rest = faqs.filter((f) => !isFeaturedFaq(f));
  return { featured, rest };
}

export function faqCategoryIntroKey(category: string): string | null {
  const c = category.toLowerCase();
  if (/perch|why |soli|allein|seul/.test(c)) return "cat_perche_intro";
  if (/cost|impos|price|preis|prix/.test(c)) return "cat_costi_intro";
  if (/capire|understand|verstehen|comprend/.test(c)) return "cat_capire_intro";
  if (/dopo|after|nach |apr[eè]s/.test(c)) return "cat_dopo_intro";
  if (/come|how |wie |comment|document|area/.test(c)) return "cat_come_intro";
  return null;
}
