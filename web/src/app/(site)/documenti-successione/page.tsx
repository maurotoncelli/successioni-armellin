import type { Metadata } from "next";
import { t, tCta, tList, tObj } from "@/lib/locale";
import { FileText, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { documentsList, type DocItem } from "@/content/site";
import { CHROME_UI_IT } from "@/lib/site-ui-labels";

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await tObj("site_ui", "chrome_ui", CHROME_UI_IT);
  return {
    title: chrome.meta_documenti,
    description: await t("documenti", "hero_subtitle"),
  };
}

export default async function DocumentiPage() {
  const ctaPreventivo = await tCta("documenti", "cta_preventivo");
  // Lista data-driven (documenti.lista); fallback alla lista statica.
  const docs = await tList<DocItem>("documenti", "lista");
  const items = docs.length > 0 ? docs : documentsList;

  return (
    <>
      <PageHero
        eyebrow={await t("documenti", "hero_eyebrow", "Guida ai documenti")}
        title={await t("documenti", "hero_title")}
        subtitle={await t("documenti", "hero_subtitle")}
        back
      />

      <Section>
        <SectionHeading
          title={await t("documenti", "evergreen_title")}
          intro={await t("documenti", "evergreen_intro")}
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:mt-12 sm:grid-cols-2">
          {items.map((doc) => (
            <Card key={doc.name} className="flex gap-4">
              <FileText className="h-6 w-6 shrink-0 text-accent" />
              <div>
                <h3 className="text-base">{doc.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{doc.description}</p>
                <span className="mt-2 inline-block rounded-full bg-bg-muted px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  {doc.when}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <div className="mx-auto max-w-3xl text-center">
          <Sparkles className="mx-auto h-8 w-8 text-accent" />
          <p className="mt-4 text-lg leading-relaxed text-primary">
            {await t("documenti", "hook_recupero")}
          </p>
          <div className="mt-8">
            <ButtonLink href={ctaPreventivo.href} variant="primary" size="lg">
              {ctaPreventivo.label}
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-text-muted">
            {await t("documenti", "disclaimer_ymyl")}
          </p>
        </div>
      </Section>
    </>
  );
}
