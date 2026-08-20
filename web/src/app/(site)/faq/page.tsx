import type { Metadata } from "next";
import { getRequestLocale, t, tCta } from "@/lib/locale";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { getFaqs, type Faq } from "@/lib/cms";
import { faqCategoryIntroKey, splitFeaturedFaqs } from "@/lib/faq-featured";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await t("faq", "hero_title", "Domande frequenti"),
    description: await t("faq", "hero_subtitle"),
  };
}

function groupByCategory(items: Faq[]) {
  const map = new Map<string, Faq[]>();
  for (const item of items) {
    const arr = map.get(item.category) ?? [];
    arr.push(item);
    map.set(item.category, arr);
  }
  return Array.from(map.entries());
}

export default async function FaqPage() {
  const locale = await getRequestLocale();
  const faqs = await getFaqs(locale);
  const { featured, rest } = splitFeaturedFaqs(faqs);
  const grouped = groupByCategory(rest.length > 0 ? rest : faqs);
  const showFeaturedPeak = featured.length > 0 && rest.length > 0;
  const groupedWithIntro = await Promise.all(
    grouped.map(async ([category, items]) => {
      const introKey = faqCategoryIntroKey(category);
      return {
        category,
        items,
        intro: introKey ? await t("faq", introKey) : null,
      };
    }),
  );
  const ctaButton = await tCta("faq", "cta_button");
  const ctaPhone = await tCta("faq", "cta_phone");

  const faqLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <PageHero
        eyebrow={await t("faq", "hero_eyebrow", "FAQ")}
        title={await t("faq", "hero_title")}
        subtitle={await t("faq", "hero_subtitle")}
      />

      {showFeaturedPeak ? (
        <Section>
          <h2 className="font-display text-2xl text-secondary sm:text-3xl">
            {await t("faq", "featured_title", "Prima i dubbi che bloccano")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted sm:text-base">
            {await t("faq", "cat_perche_intro")}
          </p>
          <div className="mx-auto mt-6 max-w-3xl sm:mt-8">
            <FaqAccordion items={featured} featured openFirst />
          </div>
        </Section>
      ) : null}

      <Section tone="muted">
        <div className="mx-auto max-w-3xl space-y-10 sm:space-y-14">
          {groupedWithIntro.map(({ category, items, intro }) => (
            <div key={category}>
              <h2 className="font-display text-2xl text-secondary">{category}</h2>
              {intro ? (
                <p className="mt-2 text-sm text-text-muted sm:text-base">
                  {intro}
                </p>
              ) : null}
              <div className="mt-5">
                <FaqAccordion items={items} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title={await t("faq", "cta_title")}
        button={ctaButton}
        phone={ctaPhone}
      />
    </>
  );
}
