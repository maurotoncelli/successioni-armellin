import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { CtaBand } from "@/components/site/cta-band";
import { guides } from "@/content/site";
import { cta, list, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guide alle successioni",
  description: text("guide", "hero_subtitle"),
};

export default function GuidePage() {
  const categorie = list<{ nome: string; slug: string }>("guide", "categorie");
  const ctaButton = cta("guide", "cta_button");

  return (
    <>
      <PageHero
        eyebrow="Guide"
        title={text("guide", "hero_title")}
        subtitle={text("guide", "hero_subtitle")}
      />

      <Section>
        <div className="flex flex-wrap justify-center gap-2">
          {categorie.map((cat) => (
            <span
              key={cat.slug}
              className="rounded-full border border-primary/15 bg-bg-muted px-4 py-1.5 text-sm font-medium text-text-muted"
            >
              {cat.nome}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <SectionHeading title={text("guide", "in_evidenza_title")} align="left" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <Card key={guide.slug} className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {guide.category}
                </span>
                <h3 className="mt-2 text-xl">{guide.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                  {guide.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Leggi la guida
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand title={text("guide", "cta_title")} button={ctaButton} />
    </>
  );
}
