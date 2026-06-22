import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { cta, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Diritto di recesso",
  description: text("recesso", "hero_subtitle"),
};

const blocks: { titleKey: string; bodyKey: string }[] = [
  { titleKey: "cosa_title", bodyKey: "cosa_body" },
  { titleKey: "avvio_title", bodyKey: "avvio_body" },
  { titleKey: "iniziato_title", bodyKey: "iniziato_body" },
  { titleKey: "come_title", bodyKey: "come_body" },
  { titleKey: "rimborso_title", bodyKey: "rimborso_body" },
  { titleKey: "garanzia_title", bodyKey: "garanzia_body" },
];

export default function RecessoPage() {
  const comeCtaArea = cta("recesso", "come_cta_area");
  const garanziaLink = cta("recesso", "garanzia_link");

  return (
    <>
      <PageHero
        eyebrow={text("recesso", "hero_eyebrow", "Le tue tutele")}
        title={text("recesso", "hero_title")}
        subtitle={text("recesso", "hero_subtitle")}
        back
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-6">
          {blocks.map((block) => (
            <Card key={block.titleKey}>
              <h2 className="text-xl">{text("recesso", block.titleKey)}</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                {text("recesso", block.bodyKey)}
              </p>
            </Card>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={comeCtaArea.href} variant="primary">
              {comeCtaArea.label}
            </ButtonLink>
            <ButtonLink href={garanziaLink.href} variant="outline">
              {garanziaLink.label}
            </ButtonLink>
          </div>

          <p className="text-sm italic text-text-muted">
            {text("recesso", "tc_link")}
          </p>
        </div>
      </Section>
    </>
  );
}
