import type { Metadata } from "next";
import { getRequestLocale, t, tCta } from "@/lib/locale";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { getFaqs, type Faq } from "@/lib/cms";

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
  const grouped = groupByCategory(await getFaqs(locale));
  const ctaButton = await tCta("faq", "cta_button");
  const ctaPhone = await tCta("faq", "cta_phone");

  return (
    <>
      <PageHero
        eyebrow={await t("faq", "hero_eyebrow", "FAQ")}
        title={await t("faq", "hero_title")}
        subtitle={await t("faq", "hero_subtitle")}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-8 sm:space-y-12">
          {grouped.map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl">{category}</h2>
              <div className="mt-5 divide-y divide-primary/10 rounded-2xl border border-primary/10">
                {items.map((item) => (
                  <details key={item.question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium text-primary">
                      {item.question}
                      <ChevronDown className="h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
                      {item.answer}
                    </p>
                  </details>
                ))}
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
