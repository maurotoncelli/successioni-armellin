"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CalendarClock, Clock, Search, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { localePath } from "@/lib/seo-locale";
import type { Locale } from "@/lib/content";
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

export type ToolPreview = {
  title: string;
  body: string;
  cta_label: string;
  href: string;
  icon?: "calculator" | "calendar";
};

const TOOLS_FILTER = "strumenti";

const ICONS = {
  calculator: Calculator,
  calendar: CalendarClock,
} as const;

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
  locale,
}: {
  article: ArticlePreview;
  labels: GuideUiLabels;
  dateLocale: string;
  locale: Locale;
}) {
  return (
    <Link
      href={localePath(`/guide/${article.slug}`, locale)}
      className="group block h-full"
    >
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

function ToolCard({
  tool,
  labels,
  locale,
}: {
  tool: ToolPreview;
  labels: GuideUiLabels;
  locale: Locale;
}) {
  const Icon = ICONS[tool.icon === "calendar" ? "calendar" : "calculator"];
  return (
    <Link
      href={localePath(tool.href, locale)}
      className="group flex h-full flex-col rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent-dark">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {labels.free_tool}
        </span>
      </div>
      <h3 className="mt-4 text-xl text-primary group-hover:text-accent">
        {tool.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
        {tool.body}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark">
        {tool.cta_label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
      </span>
    </Link>
  );
}

export function GuideIndex({
  articles,
  categorie,
  tools = [],
  toolsHeading,
  toolsIntro,
  showSearch = true,
  labels = GUIDE_UI_IT,
  dateLocale = "it-IT",
  locale = "it",
}: {
  articles: ArticlePreview[];
  categorie: Categoria[];
  tools?: ToolPreview[];
  toolsHeading?: string;
  toolsIntro?: string;
  showSearch?: boolean;
  labels?: GuideUiLabels;
  dateLocale?: string;
  locale?: Locale;
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const hasTools = tools.length > 0;

  useEffect(() => {
    function applyHash() {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#strumenti" && hasTools) {
        setActiveCat(TOOLS_FILTER);
      }
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [hasTools]);

  const usedCategorie = useMemo(() => {
    const present = new Set(articles.map((a) => a.categorySlug));
    return categorie.filter((c) => present.has(c.slug));
  }, [articles, categorie]);

  const q = query.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    if (activeCat === TOOLS_FILTER) return [];
    return articles.filter((a) => {
      const matchCat = !activeCat || a.categorySlug === activeCat;
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [articles, q, activeCat]);

  const filteredTools = useMemo(() => {
    if (!hasTools) return [];
    if (activeCat && activeCat !== TOOLS_FILTER) return [];
    if (!q) return tools;
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q),
    );
  }, [tools, hasTools, q, activeCat]);

  const empty = filteredArticles.length === 0 && filteredTools.length === 0;
  const showToolsBlock = filteredTools.length > 0;
  const heading = toolsHeading || labels.free_tool;

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
          {hasTools && (
            <button
              type="button"
              onClick={() => setActiveCat(TOOLS_FILTER)}
              aria-pressed={activeCat === TOOLS_FILTER}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                (activeCat === TOOLS_FILTER
                  ? "bg-primary text-white"
                  : "border border-primary/15 bg-bg-muted text-text-muted hover:border-accent hover:text-accent")
              }
            >
              {heading}
            </button>
          )}
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
        {filteredArticles.length > 0 && (
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  labels={labels}
                  dateLocale={dateLocale}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}

        {showToolsBlock && (
          <section
            id="strumenti"
            className={
              filteredArticles.length > 0
                ? "mt-10 scroll-mt-24 sm:mt-14"
                : "scroll-mt-24"
            }
          >
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-2xl text-primary sm:text-3xl">
                {heading}
              </h2>
              {toolsIntro && (
                <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
                  {toolsIntro}
                </p>
              )}
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  tool={tool}
                  labels={labels}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        )}

        {empty && (
          <p className="py-12 text-center text-text-muted">{labels.empty}</p>
        )}
      </div>
    </div>
  );
}
