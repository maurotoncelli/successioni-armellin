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
import { cta, get, list, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guide alle successioni",
  description: text("guide", "hero_subtitle"),
};

export default async function GuidePage() {
  const articles = await getArticles();
  const categorie = list<Categoria>("guide", "categorie");
  const showSearch = get<boolean>("guide", "hero_search", true);
  const ctaButton = cta("guide", "cta_button");

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
        eyebrow={text("guide", "hero_eyebrow", "Guide")}
        title={text("guide", "hero_title")}
        subtitle={text("guide", "hero_subtitle")}
      />

      <Section>
        <GuideIndex
          articles={previews}
          categorie={categorie}
          showSearch={showSearch}
        />
      </Section>

      <CtaBand title={text("guide", "cta_title")} button={ctaButton} />
    </>
  );
}
