import type { Metadata } from "next";
import { FileText, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { documentsList } from "@/content/site";
import { cta, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Documenti per la successione",
  description: text("documenti", "hero_subtitle"),
};

export default function DocumentiPage() {
  const ctaPreventivo = cta("documenti", "cta_preventivo");

  return (
    <>
      <PageHero
        eyebrow={text("documenti", "hero_eyebrow", "Guida ai documenti")}
        title={text("documenti", "hero_title")}
        subtitle={text("documenti", "hero_subtitle")}
        back
      />

      <Section>
        <SectionHeading
          title={text("documenti", "evergreen_title")}
          intro={text("documenti", "evergreen_intro")}
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {documentsList.map((doc) => (
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
            {text("documenti", "hook_recupero")}
          </p>
          <div className="mt-8">
            <ButtonLink href={ctaPreventivo.href} variant="primary" size="lg">
              {ctaPreventivo.label}
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-text-muted">
            {text("documenti", "disclaimer_ymyl")}
          </p>
        </div>
      </Section>
    </>
  );
}
