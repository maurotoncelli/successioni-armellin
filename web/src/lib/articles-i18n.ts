import "server-only";
import type { Article } from "@/content/articles";
import { getArticleAr } from "@/content/articles.ar";
import { DEFAULT_LOCALE, list } from "@/lib/content";

/*
  Overlay lingue ≠ IT sulle guide (fixture IT in articles.ts).
  - AR: seed in content/articles.ar.ts
  - categoria leggibile: sempre da guide.categorie (slug → nome locale)
*/

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

  if (locale !== DEFAULT_LOCALE && locale === "ar") {
    const overlay = getArticleAr(article.slug);
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
