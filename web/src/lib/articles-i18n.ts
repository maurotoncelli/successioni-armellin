import "server-only";
import type { Article } from "@/content/articles";
import { getArticleAr } from "@/content/articles.ar";
import { getArticleEn } from "@/content/articles.en";
import { DEFAULT_LOCALE, list } from "@/lib/content";

/*
  Overlay lingue ≠ IT sulle guide (fixture IT in articles.ts).
  - AR: content/articles.ar.ts
  - EN: content/articles.en.ts
  - categoria leggibile: sempre da guide.categorie (slug → nome locale)
*/

type ArticleOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: Article["body"];
  sources: Article["sources"];
};

function getArticleOverlay(
  slug: string,
  locale: string,
): ArticleOverlay | undefined {
  if (locale === "ar") return getArticleAr(slug);
  if (locale === "en") return getArticleEn(slug);
  return undefined;
}

function withLocalizedCategory(article: Article, locale: string): Article {
  const cats = list<{ nome?: string; slug?: string }>(
    "guide",
    "categorie",
    locale,
  );
  const hit = cats.find((c) => c.slug === article.categorySlug);
  if (!hit?.nome) return article;
  return { ...article, category: hit.nome };
}

export function applyArticleI18n(
  article: Article,
  locale: string = DEFAULT_LOCALE,
): Article {
  let next = article;

  if (locale !== DEFAULT_LOCALE) {
    const overlay = getArticleOverlay(article.slug, locale);
    if (overlay) {
      next = {
        ...article,
        title: overlay.title,
        excerpt: overlay.excerpt,
        reviewedBy: overlay.reviewedBy,
        body: overlay.body,
        sources: overlay.sources,
      };
    }
  }

  return withLocalizedCategory(next, locale);
}

export function applyArticlesI18n(
  articles: Article[],
  locale: string = DEFAULT_LOCALE,
): Article[] {
  return articles.map((a) => applyArticleI18n(a, locale));
}
