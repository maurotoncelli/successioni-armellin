import type { Metadata } from "next";
import { getRequestLocale, t, tCta, tObj } from "@/lib/locale";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock,
  ChevronRight,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { BackLink } from "@/components/site/back-link";
import { ArticleBody } from "@/components/site/article-body";
import { getArticle, getArticles, getRelatedArticles } from "@/lib/cms";
import { GUIDE_UI_IT } from "@/lib/site-ui-labels";

type Params = { slug: string };

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const article = await getArticle(slug, locale);
  const ui = await tObj("site_ui", "guide_ui", GUIDE_UI_IT);
  if (!article) return { title: ui.meta_not_found };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

function formatDate(iso: string, dateLocale: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const article = await getArticle(slug, locale);
  if (!article) notFound();

  const dateLocale = locale === "ar" ? "ar" : "it-IT";
  const guideUi = await tObj("site_ui", "guide_ui", GUIDE_UI_IT);
  const knowLorenzo = (
    await tCta("home", "chisono_cta", {
      label: "Conosci Lorenzo",
      href: "/chi-sono",
    })
  ).label;
  const talkLorenzo = (
    await tCta("navbar", "cta_phone", {
      label: "Parla con Lorenzo",
      href: "tel:+393201570567",
    })
  ).label;

  const related = await getRelatedArticles(slug, 3, locale);
  const ctaBox = await tObj("article", "cta_box", {
    titolo: "Vuoi che ce ne occupiamo noi?",
    button: { label: "Calcola il preventivo gratis", href: "/preventivo" },
    phone: "tel:+393201570567",
  });
  const disclaimer = await t("article", "disclaimer");
  const authorBox = await tObj("article", "autore_box", {
    autore: article.author,
    ruolo: "Geometra abilitato Entratel",
    reviewed_by: article.reviewedBy,
    link: "/chi-sono",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.author },
    inLanguage: locale === "ar" ? "ar" : "it-IT",
    articleSection: article.category,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: guideUi.breadcrumb_guides,
        item: "/guide",
      },
      { "@type": "ListItem", position: 2, name: article.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="bg-primary text-white">
        <Container className="py-10 sm:py-14 lg:py-16">
          <nav
            aria-label={guideUi.breadcrumb_aria}
            className="flex flex-wrap items-center gap-1.5 text-sm text-white/70"
          >
            <Link href="/guide" className="hover:text-white">
              {guideUi.breadcrumb_guides}
            </Link>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            <span className="text-white/90">{article.category}</span>
          </nav>

          <div className="mt-6 max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              {article.category}
            </span>
            <h1 className="mt-3 text-3xl text-white sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" />
                {article.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {guideUi.reading_minutes.replace(
                  "{n}",
                  String(article.readingMinutes),
                )}
              </span>
              <span>
                {guideUi.updated.replace(
                  "{date}",
                  formatDate(article.updatedAt, dateLocale),
                )}
              </span>
            </div>
          </div>
        </Container>
      </div>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <article className="min-w-0">
            <ArticleBody blocks={article.body} />

            {disclaimer && (
              <p className="mt-10 rounded-2xl border border-primary/10 bg-bg-muted p-5 text-sm leading-relaxed text-text-muted">
                {disclaimer}
              </p>
            )}

            {article.sources.length > 0 && (
              <div className="mt-8">
                <h2 className="text-base font-semibold text-primary">
                  {guideUi.sources}
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {article.sources.map((src) => (
                    <li key={src.href}>
                      <a
                        href={src.href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent underline-offset-2 hover:underline"
                      >
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <BackLink label={guideUi.back} fallbackHref="/guide" />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card>
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {guideUi.author_heading}
                </span>
              </div>
              <p className="mt-3 font-semibold text-primary">
                {authorBox.autore}
              </p>
              <p className="text-sm text-text-muted">{authorBox.ruolo}</p>
              <p className="mt-2 text-sm text-text-muted">
                {authorBox.reviewed_by}
              </p>
              <Link
                href={authorBox.link}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
              >
                {knowLorenzo}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Card>

            <Card className="bg-sand">
              <p className="font-semibold text-primary">{ctaBox.titolo}</p>
              <div className="mt-4 flex flex-col gap-3">
                <ButtonLink href={ctaBox.button.href} variant="primary">
                  {ctaBox.button.label}
                </ButtonLink>
                {ctaBox.phone && ctaBox.phone !== "tel:+39" && (
                  <ButtonLink href={ctaBox.phone} variant="outline">
                    <Phone className="h-4 w-4" />
                    {talkLorenzo}
                  </ButtonLink>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="muted">
          <h2 className="text-2xl text-primary">{guideUi.related}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/guide/${rel.slug}`}
                className="group block h-full"
              >
                <Card className="flex h-full flex-col transition-shadow group-hover:shadow-md">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {rel.category}
                  </span>
                  <h3 className="mt-2 text-lg text-primary group-hover:text-accent">
                    {rel.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                    {rel.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {guideUi.read}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
