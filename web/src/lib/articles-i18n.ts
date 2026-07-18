import "server-only";
import type { Article } from "@/content/articles";
import { getArticleAr } from "@/content/articles.ar";
import { getArticleEn } from "@/content/articles.en";
import { getArticleTr } from "@/content/articles.tr";
import { getArticleFr } from "@/content/articles.fr";
import { getArticleSq } from "@/content/articles.sq";
import { getArticleDe } from "@/content/articles.de";
import { getArticleEs } from "@/content/articles.es";
import { getArticleRu } from "@/content/articles.ru";
import { getArticleZh } from "@/content/articles.zh";
import { getArticleHi } from "@/content/articles.hi";
import { DEFAULT_LOCALE, list } from "@/lib/content";

/*
  Overlay lingue ≠ IT sulle guide (fixture IT in articles.ts).
  - AR/EN/TR/FR/SQ/DE/ES/RU/ZH/HI: content/articles.<locale>.ts
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
  if (locale === "tr") return getArticleTr(slug);
  if (locale === "fr") return getArticleFr(slug);
  if (locale === "sq") return getArticleSq(slug);
  if (locale === "de") return getArticleDe(slug);
  if (locale === "es") return getArticleEs(slug);
  if (locale === "ru") return getArticleRu(slug);
  if (locale === "zh") return getArticleZh(slug);
  if (locale === "hi") return getArticleHi(slug);
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
