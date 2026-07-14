import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import {
  GuideIndex,
  type ArticlePreview,
  type Categoria,
} from "@/components/site/guide-index";
import { getArticles } from "@/lib/cms";
import { cta, get, list, obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guide alle successioni",
  description: text("guide", "hero_subtitle"),
};

export default async function GuidePage() {
  const articles = await getArticles();
  const categorie = list<Categoria>("guide", "categorie");
  const showSearch = get<boolean>("guide", "hero_search", true);
  const ctaButton = cta("guide", "cta_button");
  const toolBanner = obj<{
    title: string;
    body: string;
    cta_label: string;
    href: string;
  }>("guide", "strumenti_banner", { title: "", body: "", cta_label: "", href: "" });

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
        {toolBanner.href && (
          <Link
            href={toolBanner.href}
            className="group mb-10 flex flex-col gap-4 rounded-2xl border border-accent/30 bg-sand p-6 transition-colors hover:border-accent sm:flex-row sm:items-center"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
              <Calculator className="h-6 w-6 text-accent" />
            </span>
            <span className="flex-1">
              <span className="block font-serif text-lg font-semibold text-primary">
                {toolBanner.title}
              </span>
              <span className="mt-1 block text-sm text-text-muted">
                {toolBanner.body}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark">
              {toolBanner.cta_label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        )}
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
