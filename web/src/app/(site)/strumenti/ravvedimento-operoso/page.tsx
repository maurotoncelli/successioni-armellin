import type { Metadata } from "next";
import { Info } from "lucide-react";
import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import {
  RAVVEDIMENTO_UI_IT,
  type RavvedimentoUiLabels,
} from "@/lib/site-ui-labels";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { RavvedimentoCalculator } from "@/components/site/ravvedimento-calculator";
import { buildLocaleAlternates, localePath } from "@/lib/seo-locale";

/*
  Strumento pubblico: calcolo del ravvedimento operoso per la dichiarazione
  di successione tardiva (@SEO: "ravvedimento operoso successione",
  "dichiarazione di successione in ritardo sanzioni"). Logica pura in
  lib/ravvedimento.ts, form in components/site/ravvedimento-calculator.tsx.
*/

const BARE = "/strumenti/ravvedimento-operoso";
const META_TITLE_IT =
  "Calcolo ravvedimento operoso successione: sanzioni e interessi (gratis)";
const META_DESC_IT =
  "Dichiarazione di successione in ritardo? Calcola subito sanzione ridotta e interessi legali con il ravvedimento operoso: inserisci data del decesso, data di presentazione e imposte.";

type StepRow = { title: string; body: string };
type FaqRow = { q: string; a: string };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const pageTitle = await t("strumenti", "ravvedimento_meta_title", META_TITLE_IT);
  const pageDescription = await t("strumenti", "ravvedimento_meta_description", META_DESC_IT);
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

export default async function RavvedimentoPage() {
  const locale = await getRequestLocale();
  const pageTitle = await t("strumenti", "ravvedimento_meta_title", META_TITLE_IT);
  const pageDescription = await t("strumenti", "ravvedimento_meta_description", META_DESC_IT);
  const ui = await tObj<RavvedimentoUiLabels>(
    "strumenti",
    "ravvedimento_ui",
    RAVVEDIMENTO_UI_IT,
  );
  const steps = await tList<StepRow>("strumenti", "ravvedimento_passi");
  const faqRows = await tList<FaqRow>("strumenti", "ravvedimento_faq");
  const ctaButton = await tCta("strumenti", "ravvedimento_cta_button", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const tel = await tObj("contatti", "telefono", {
    cta_whatsapp: "https://wa.me/393201570567",
  });
  const pageUrl = `https://www.successioniarmellin.it${localePath(BARE, locale)}`;
  // Importi e date nel formato della lingua letta (1.307,05 € / €1,307.05 / 1 307,05 €).
  const INTL_LOCALE: Record<string, string> = {
    it: "it-IT",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    ar: "ar",
    ru: "ru-RU",
    tr: "tr-TR",
    zh: "zh-CN",
    hi: "hi-IN",
    sq: "sq-AL",
  };
  const numberLocale = INTL_LOCALE[locale] ?? "it-IT";
  const dateLocale = numberLocale;

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: locale === "ar" ? "ar" : "it-IT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    provider: {
      "@type": "ProfessionalService",
      name: "Successioni Armellin - Geom. Lorenzo Armellin",
      url: "https://www.successioniarmellin.it",
    },
  };
  const faqLd =
    faqRows.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqRows.map((row) => ({
            "@type": "Question",
            name: row.q,
            acceptedAnswer: { "@type": "Answer", text: row.a },
          })),
        }
      : null;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: await t("strumenti", "hub_hero_title", "Strumenti utili"),
        item: `https://www.successioniarmellin.it${localePath("/strumenti", locale)}`,
      },
      { "@type": "ListItem", position: 2, name: pageTitle, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <PageHero
        eyebrow={await t("strumenti", "hub_hero_eyebrow", "Strumenti utili")}
        title={await t(
          "strumenti",
          "ravvedimento_hero_title",
          "Dichiarazione di successione in ritardo? Calcola il ravvedimento operoso",
        )}
        subtitle={await t(
          "strumenti",
          "ravvedimento_hero_subtitle",
          "Inserisci la data del decesso, quando presenterai la dichiarazione e le imposte dovute: ottieni subito sanzione ridotta, interessi legali e totale da versare.",
        )}
        back
      />

      <Section>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-10">
          <RavvedimentoCalculator
            labels={ui}
            numberLocale={numberLocale}
            dateLocale={dateLocale}
            catastaleHref={localePath("/strumenti/valore-catastale", locale)}
            preventivoHref={localePath("/preventivo", locale)}
            whatsappBase={String(tel.cta_whatsapp || "https://wa.me/393201570567")}
          />

          <div>
            <SectionHeading
              align="left"
              title={await t(
                "strumenti",
                "ravvedimento_come_title",
                "Cos'è il ravvedimento operoso nella successione",
              )}
              intro={await t(
                "strumenti",
                "ravvedimento_come_body",
                "La dichiarazione di successione va presentata entro 12 mesi dal decesso. Se il termine è passato, il ravvedimento operoso permette di regolarizzare spontaneamente pagando le imposte, una sanzione ridotta e gli interessi legali: più presto lo fai, meno paghi. È possibile finché l'Agenzia delle Entrate non ti ha notificato un atto.",
              )}
            />
            {steps.length > 0 && (
              <ol className="mt-6 space-y-3">
                {steps.map((row, i) => (
                  <li
                    key={row.title}
                    className="flex gap-4 rounded-xl border border-primary/10 bg-bg p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent-dark">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-primary">{row.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-text-muted">{row.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/10 bg-bg-muted p-4 text-sm text-text-muted">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p>
                {await t(
                  "strumenti",
                  "ravvedimento_note",
                  "Nessuna sanzione penale e nessun blocco dell'eredità: presentare in ritardo costa qualche decina o centinaia di euro in più, ma finché la dichiarazione manca gli immobili non possono essere venduti né i conti sbloccati. Il ravvedimento si perfeziona con la presentazione della dichiarazione e il pagamento di imposte, sanzione ridotta e interessi.",
                )}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {faqRows.length > 0 && (
        <Section tone="muted">
          <SectionHeading
            title={await t(
              "strumenti",
              "ravvedimento_faq_title",
              "Domande frequenti sul ravvedimento della successione",
            )}
          />
          <div className="mx-auto mt-6 max-w-2xl space-y-3 sm:mt-10">
            {faqRows.map((row) => (
              <details
                key={row.q}
                className="group rounded-xl border border-primary/10 bg-bg p-5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-medium text-primary marker:hidden">
                  {row.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{row.a}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <CtaBand
        title={await t(
          "strumenti",
          "ravvedimento_cta_title",
          "Vuoi che sistemiamo noi la successione in ritardo, ravvedimento incluso?",
        )}
        button={ctaButton}
      />
    </>
  );
}
