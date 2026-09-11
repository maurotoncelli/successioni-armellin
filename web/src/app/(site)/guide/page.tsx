import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import {
  GuideIndex,
  type ArticlePreview,
  type Categoria,
} from "@/components/site/guide-index";
import { getArticles } from "@/lib/cms";
import { get } from "@/lib/content";
import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import { GUIDE_UI_IT } from "@/lib/site-ui-labels";

export async function generateMetadata(): Promise<Metadata> {
  const ui = await tObj("site_ui", "guide_ui", GUIDE_UI_IT);
  return {
    title: ui.meta_title,
    description: await t("guide", "hero_subtitle"),
  };
}

export default async function GuidePage() {
  const locale = await getRequestLocale();
  const articles = await getArticles(locale);
  const categorie = await tList<Categoria>("guide", "categorie");
  const showSearch = get<boolean>("guide", "hero_search", true, locale);
  const ctaButton = await tCta("guide", "cta_button");
  const guideUi = await tObj("site_ui", "guide_ui", GUIDE_UI_IT);
  const dateLocale = locale === "ar" ? "ar" : "it-IT";
  const previews: ArticlePreview[] = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    categorySlug: a.categorySlug,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    readingMinutes: a.readingMinutes,
    featured: a.featured,
  }));

  return (
    <>
      <PageHero
        eyebrow={await t("guide", "hero_eyebrow", "Guide")}
        title={await t("guide", "hero_title")}
        subtitle={await t("guide", "hero_subtitle")}
      />

      <Section>
        <GuideIndex
          articles={previews}
          categorie={categorie}
          showSearch={showSearch}
          labels={guideUi}
          dateLocale={dateLocale}
          hrefPrefix={locale === "ar" ? "/ar" : ""}
        />
      </Section>

      <CtaBand title={await t("guide", "cta_title")} button={ctaButton} />
    </>
  );
}
