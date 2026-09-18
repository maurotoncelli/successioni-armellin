import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import {
  GuideIndex,
  type ArticlePreview,
  type Categoria,
  type ToolPreview,
} from "@/components/site/guide-index";
import { getArticles } from "@/lib/cms";
import { get } from "@/lib/content";
import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import { GUIDE_UI_IT } from "@/lib/site-ui-labels";
import { absoluteUrl, buildLocaleAlternates, localePath } from "@/lib/seo-locale";

const TOOLS_FALLBACK: ToolPreview[] = [
  {
    title: "Calcolo del valore catastale",
    body: "Quanto vale una casa o un terreno ai fini della successione? Inserisci la rendita della visura e ottieni il valore su cui si calcolano le imposte ipotecaria e catastale.",
    cta_label: "Apri il calcolatore",
    href: "/strumenti/valore-catastale",
    icon: "calculator",
  },
  {
    title: "Calcolo del ravvedimento operoso",
    body: "Dichiarazione di successione oltre i 12 mesi? Scopri quanto costano sanzione ridotta e interessi legali se regolarizzi adesso, con le aliquote in vigore.",
    cta_label: "Apri il calcolatore",
    href: "/strumenti/ravvedimento-operoso",
    icon: "calendar",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const ui = await tObj("site_ui", "guide_ui", GUIDE_UI_IT);
  const description = await t("guide", "hero_subtitle");
  return {
    title: ui.meta_title,
    description,
    alternates: buildLocaleAlternates("/guide", locale),
    openGraph: {
      title: ui.meta_title,
      description,
      url: localePath("/guide", locale),
      type: "website",
    },
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
  const toolsRaw = await tList<ToolPreview>("strumenti", "hub_tools");
  const tools = toolsRaw.length > 0 ? toolsRaw : TOOLS_FALLBACK;
  const toolsHeading = await t(
    "strumenti",
    "hub_hero_eyebrow",
    "Strumenti utili",
  );
  const toolsIntro = await t(
    "strumenti",
    "hub_hero_subtitle",
    "Calcolatori gratuiti, con gli stessi coefficienti e le stesse aliquote che usiamo nelle pratiche vere. Nessuna registrazione, risultato immediato.",
  );
  const pageTitle = await t("guide", "hero_title");
  const pageDescription = await t("guide", "hero_subtitle");
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

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: absoluteUrl(localePath("/guide", locale)),
    inLanguage: locale === "ar" ? "ar" : locale === "it" ? "it-IT" : locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        ...tools.map((tool, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(localePath(tool.href, locale)),
          name: tool.title,
        })),
        ...previews.map((article, i) => ({
          "@type": "ListItem",
          position: tools.length + i + 1,
          url: absoluteUrl(localePath(`/guide/${article.slug}`, locale)),
          name: article.title,
        })),
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <PageHero
        eyebrow={await t("guide", "hero_eyebrow", "Guide")}
        title={pageTitle}
        subtitle={pageDescription}
      />

      <Section>
        <GuideIndex
          articles={previews}
          categorie={categorie}
          tools={tools}
          toolsHeading={toolsHeading}
          toolsIntro={toolsIntro}
          showSearch={showSearch}
          labels={guideUi}
          dateLocale={dateLocale}
          locale={locale}
        />
      </Section>

      <CtaBand title={await t("guide", "cta_title")} button={ctaButton} />
    </>
  );
}
