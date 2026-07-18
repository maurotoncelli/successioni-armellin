import type { Metadata } from "next";
import { t, tCta, tObj } from "@/lib/locale";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { CHROME_UI_IT } from "@/lib/site-ui-labels";

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await tObj("site_ui", "chrome_ui", CHROME_UI_IT);
  return {
    title: chrome.meta_recesso,
    description: await t("recesso", "hero_subtitle"),
  };
}

const blocks: { titleKey: string; bodyKey: string }[] = [
  { titleKey: "cosa_title", bodyKey: "cosa_body" },
  { titleKey: "avvio_title", bodyKey: "avvio_body" },
  { titleKey: "iniziato_title", bodyKey: "iniziato_body" },
  { titleKey: "come_title", bodyKey: "come_body" },
  { titleKey: "rimborso_title", bodyKey: "rimborso_body" },
  { titleKey: "garanzia_title", bodyKey: "garanzia_body" },
];

export default async function RecessoPage() {
  const comeCtaArea = await tCta("recesso", "come_cta_area");
  const garanziaLink = await tCta("recesso", "garanzia_link");
  const resolvedBlocks = await Promise.all(
    blocks.map(async (block) => ({
      titleKey: block.titleKey,
      title: await t("recesso", block.titleKey),
      body: await t("recesso", block.bodyKey),
    })),
  );

  return (
    <>
      <PageHero
        eyebrow={await t("recesso", "hero_eyebrow", "Le tue tutele")}
        title={await t("recesso", "hero_title")}
        subtitle={await t("recesso", "hero_subtitle")}
        back
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-6">
          {resolvedBlocks.map((block) => (
            <Card key={block.titleKey}>
              <h2 className="text-xl">{block.title}</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                {block.body}
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
            {await t("recesso", "tc_link")}
          </p>
        </div>
      </Section>
    </>
  );
}
