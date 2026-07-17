import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { CatastaleCalculator } from "@/components/site/catastale-calculator";
import { cta, list, text } from "@/lib/content";

/*
  Strumento pubblico: calcolo del valore catastale ai fini della successione
  (@09 SEO: query ad alto intento "valore catastale successione"). La logica
  e la STESSA del generatore della dichiarazione (lib/catasto.ts), quindi il
  numero mostrato coincide con quello delle pratiche vere.
*/

const pageTitle =
  "Calcolo del valore catastale per la successione (gratis, online)";
const pageDescription = text(
  "strumenti",
  "catastale_hero_subtitle",
  "Calcola in un click il valore catastale di case e terreni ai fini dell'imposta di successione: rendita rivalutata per i coefficienti ufficiali.",
);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/strumenti/valore-catastale" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/strumenti/valore-catastale",
    type: "website",
    locale: "it_IT",
  },
};

type FormulaRow = { tipo: string; formula: string };
type FaqRow = { q: string; a: string };

export default function ValoreCatastalePage() {
  const formulaRows = list<FormulaRow>("strumenti", "catastale_formule");
  const faqRows = list<FaqRow>("strumenti", "catastale_faq");
  const ctaButton = cta("strumenti", "catastale_cta_button");

  // Structured data: lo strumento come applicazione gratuita + FAQ visibili
  // in pagina (Google richiede che il markup rispecchi contenuto reale).
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calcolo del valore catastale per la successione",
    description: pageDescription,
    url: "https://www.successioniarmellin.it/strumenti/valore-catastale",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "it-IT",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <PageHero
        eyebrow={text("strumenti", "catastale_hero_eyebrow", "Strumenti")}
        title={text(
          "strumenti",
          "catastale_hero_title",
          "Quanto vale un immobile ai fini della successione?",
        )}
        subtitle={text(
          "strumenti",
          "catastale_hero_subtitle",
          "Inserisci la rendita catastale (la trovi nella visura) e ottieni subito il valore catastale su cui si calcolano le imposte di successione.",
        )}
        back
      />

      <Section>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
          <CatastaleCalculator
            labels={{
              fabbricato: text("strumenti", "catastale_tab_fabbricato", "Fabbricato"),
              terreno: text(
                "strumenti",
                "catastale_tab_terreno",
                "Terreno agricolo",
              ),
              rendita: text(
                "strumenti",
                "catastale_label_rendita",
                "Rendita catastale (€)",
              ),
              renditaHelp: text(
                "strumenti",
                "catastale_help_rendita",
                "La trovi nella visura catastale, colonna \"Rendita\". Se ti manca, spesso la possiamo recuperare noi.",
              ),
              redditoDominicale: text(
                "strumenti",
                "catastale_label_rd",
                "Reddito dominicale (€)",
              ),
              redditoDominicaleHelp: text(
                "strumenti",
                "catastale_help_rd",
                "La trovi nella visura catastale del terreno. Vale per i terreni NON edificabili.",
              ),
              categoria: text(
                "strumenti",
                "catastale_label_categoria",
                "Categoria catastale",
              ),
              primaCasa: text(
                "strumenti",
                "catastale_label_prima_casa",
                "Per l'erede sarà \"prima casa\" (agevolazione: coefficiente ridotto a 110)",
              ),
              risultato: text(
                "strumenti",
                "catastale_label_risultato",
                "Valore catastale ai fini della successione",
              ),
              formulaIntro: text("strumenti", "catastale_label_formula", "Calcolo:"),
            }}
          />

          <div>
            <SectionHeading
              align="left"
              title={text(
                "strumenti",
                "catastale_come_title",
                "Come funziona il calcolo",
              )}
              intro={text(
                "strumenti",
                "catastale_come_body",
                "Per la dichiarazione di successione gli immobili non si valutano a prezzo di mercato ma a valore catastale: la rendita rivalutata del 5% moltiplicata per un coefficiente stabilito per legge (per i terreni: reddito dominicale rivalutato del 25% per 90).",
              )}
            />
            {formulaRows.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-xl border border-primary/10">
                <table className="w-full text-sm">
                  <tbody>
                    {formulaRows.map((row, i) => (
                      <tr
                        key={row.tipo}
                        className={i % 2 ? "bg-bg-muted/50" : "bg-bg"}
                      >
                        <td className="px-4 py-2.5 font-medium text-primary">
                          {row.tipo}
                        </td>
                        <td className="px-4 py-2.5 text-text-muted">{row.formula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/10 bg-bg-muted p-4 text-sm text-text-muted">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p>
                {text(
                  "strumenti",
                  "catastale_note",
                  "I terreni edificabili fanno eccezione: si dichiarano a valore venale (di mercato), non catastale. Il risultato è indicativo: eventuali agevolazioni e casi particolari vanno verificati sul caso concreto — è esattamente il lavoro che facciamo noi.",
                )}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {faqRows.length > 0 && (
        <Section tone="muted">
          <SectionHeading
            title={text(
              "strumenti",
              "catastale_faq_title",
              "Domande frequenti sul valore catastale",
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
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {row.a}
                </p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <CtaBand
        title={text(
          "strumenti",
          "catastale_cta_title",
          "Vuoi sapere quanto costa tutta la successione, imposte incluse?",
        )}
        button={ctaButton}
      />
    </>
  );
}
