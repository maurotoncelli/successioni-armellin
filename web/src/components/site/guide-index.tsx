"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  GUIDE_UI_IT,
  type GuideUiLabels,
} from "@/lib/site-ui-labels";

export type ArticlePreview = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  featured: boolean;
};

export type Categoria = { nome: string; slug: string };

function formatDate(iso: string, dateLocale: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleCard({
  article,
  labels,
  dateLocale,
}: {
  article: ArticlePreview;
  labels: GuideUiLabels;
  dateLocale: string;
}) {
  return (
    <Link href={`/guide/${article.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col transition-shadow group-hover:shadow-md">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            {article.category}
          </span>
          {article.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              <Star className="h-3 w-3" />
              {labels.featured}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-xl text-primary group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {labels.reading_minutes.replace(
              "{n}",
              String(article.readingMinutes),
            )}
          </span>
          <span>{formatDate(article.publishedAt, dateLocale)}</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {labels.read_guide}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </span>
      </Card>
    </Link>
  );
}

export function GuideIndex({
  articles,
  categorie,
  showSearch = true,
  labels = GUIDE_UI_IT,
  dateLocale = "it-IT",
}: {
  articles: ArticlePreview[];
  categorie: Categoria[];
  showSearch?: boolean;
  labels?: GuideUiLabels;
  dateLocale?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // Mostra solo le categorie che hanno almeno un articolo.
  const usedCategorie = useMemo(() => {
    const present = new Set(articles.map((a) => a.categorySlug));
    return categorie.filter((c) => present.has(c.slug));
  }, [articles, categorie]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchCat = !activeCat || a.categorySlug === activeCat;
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [articles, query, activeCat]);

  return (
    <div>
      <div className="flex flex-col gap-5">
        {showSearch && (
          <div className="relative mx-auto w-full max-w-xl">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.search_placeholder}
              aria-label={labels.search_aria}
              className="w-full rounded-full border border-primary/15 bg-bg py-3 ps-12 pe-4 text-sm text-primary shadow-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent"
            />
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCat(null)}
            aria-pressed={activeCat === null}
            className={
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
              (activeCat === null
                ? "bg-primary text-white"
                : "border border-primary/15 bg-bg-muted text-text-muted hover:border-accent hover:text-accent")
            }
          >
            {labels.all}
          </button>
          {usedCategorie.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCat(cat.slug)}
              aria-pressed={activeCat === cat.slug}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                (activeCat === cat.slug
                  ? "bg-primary text-white"
                  : "border border-primary/15 bg-bg-muted text-text-muted hover:border-accent hover:text-accent")
              }
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-10">
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                labels={labels}
                dateLocale={dateLocale}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-text-muted">{labels.empty}</p>
        )}
      </div>
    </div>
  );
}
