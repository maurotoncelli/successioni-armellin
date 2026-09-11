import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarClock } from "lucide-react";
import { getRequestLocale, t, tCta, tList } from "@/lib/locale";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { buildLocaleAlternates, localePath } from "@/lib/seo-locale";

/*
  Hub "Strumenti utili": raccoglie i calcolatori gratuiti (valore catastale,
  ravvedimento operoso). Voce di menu dedicata; le Guide non ospitano piu'
  il banner del calcolatore.
*/

const BARE = "/strumenti";
const META_TITLE_IT =
  "Strumenti utili per la successione: calcolatori gratuiti online";
const META_DESC_IT =
  "Calcolatori gratuiti per la dichiarazione di successione: valore catastale di case e terreni, ravvedimento operoso per dichiarazione in ritardo (sanzioni e interessi). Risultato immediato, nessuna registrazione.";

type ToolRow = {
  title: string;
  body: string;
  cta_label: string;
  href: string;
  icon?: "calculator" | "calendar";
};

const ICONS = {
  calculator: Calculator,
  calendar: CalendarClock,
} as const;

const TOOLS_IT: ToolRow[] = [
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
  const pageTitle = await t("strumenti", "hub_meta_title", META_TITLE_IT);
  const pageDescription = await t("strumenti", "hub_meta_description", META_DESC_IT);
  return {
    title: pageTitle,
    description: pageDescription,
    alternates: buildLocaleAlternates(BARE, locale),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: localePath(BARE, locale),
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "it_IT",
    },
  };
}

export default async function StrumentiPage() {
  const locale = await getRequestLocale();
  const pageTitle = await t("strumenti", "hub_meta_title", META_TITLE_IT);
  const pageDescription = await t("strumenti", "hub_meta_description", META_DESC_IT);
  const toolsRaw = await tList<ToolRow>("strumenti", "hub_tools");
  const tools = toolsRaw.length > 0 ? toolsRaw : TOOLS_IT;
  const ctaButton = await tCta("strumenti", "hub_cta_button", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const guidesLabel = await t(
    "strumenti",
    "hub_guides_link",
    "Leggi le guide alla successione",
  );
  const base = "https://www.successioniarmellin.it";

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: `${base}${localePath(BARE, locale)}`,
    inLanguage: locale === "ar" ? "ar" : "it-IT",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${base}${localePath(tool.href, locale)}`,
        name: tool.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <PageHero
        eyebrow={await t("strumenti", "hub_hero_eyebrow", "Strumenti utili")}
        title={await t(
          "strumenti",
          "hub_hero_title",
          "Strumenti utili per la successione",
        )}
        subtitle={await t(
          "strumenti",
          "hub_hero_subtitle",
          "Calcolatori gratuiti, con gli stessi coefficienti e le stesse aliquote che usiamo nelle pratiche vere. Nessuna registrazione, risultato immediato.",
        )}
      />

      <Section>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = ICONS[tool.icon ?? "calculator"];
            return (
              <Link
                key={tool.href}
                href={localePath(tool.href, locale)}
                className="group flex flex-col rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md sm:p-8"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent-dark">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-serif text-xl font-semibold text-primary sm:text-2xl">
                  {tool.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                  {tool.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark">
                  {tool.cta_label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          title={await t(
            "strumenti",
            "hub_why_title",
            "Perché questi strumenti sono gratuiti",
          )}
          intro={await t(
            "strumenti",
            "hub_why_body",
            "Sono gli stessi calcoli che il geometra Lorenzo Armellin fa ogni giorno per le dichiarazioni di successione. Li mettiamo a disposizione perché chi eredita possa capire subito, con numeri veri, cosa lo aspetta: imposte, valori catastali, costi di un ritardo. I risultati sono stime: il caso concreto lo verifichiamo insieme, gratis, con il preventivo.",
          )}
        />
        <div className="mt-6 text-center sm:mt-8">
          <Link
            href={localePath("/guide", locale)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-dark hover:underline"
          >
            <BookOpen className="h-4 w-4" />
            {guidesLabel}
          </Link>
        </div>
      </Section>

      <CtaBand
        title={await t(
          "strumenti",
          "hub_cta_title",
          "Vuoi sapere quanto costa tutta la successione, imposte incluse?",
        )}
        button={ctaButton}
      />
    </>
  );
}
