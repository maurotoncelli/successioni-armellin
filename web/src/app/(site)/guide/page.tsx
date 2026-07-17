import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
            className="group mb-6 flex flex-col overflow-hidden rounded-2xl border border-accent/30 bg-sand transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md sm:mb-10 sm:flex-row sm:items-stretch"
          >
            <span className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-dark">
                <Calculator className="h-4 w-4" />
                Strumento gratuito
              </span>
              <span className="block font-serif text-xl font-semibold text-primary sm:text-2xl">
                {toolBanner.title}
              </span>
              <span className="block max-w-xl text-sm leading-relaxed text-text-muted">
                {toolBanner.body}
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark">
                {toolBanner.cta_label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
            <span className="relative block h-40 shrink-0 sm:h-auto sm:w-64 md:w-80">
              <Image
                src="/images/strumento-valore-catastale.png"
                alt="Illustrazione: casa, calcolatrice e documento con simbolo euro"
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover object-center"
              />
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
