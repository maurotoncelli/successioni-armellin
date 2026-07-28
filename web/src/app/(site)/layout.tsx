import type { Metadata } from "next";
import { headers } from "next/headers";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";
import { HideOnPaths } from "@/components/site/hide-on-paths";
import { SiteOfflineNotice } from "@/components/site/site-offline-notice";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import { ContactTracker } from "@/components/analytics/contact-tracker";
import { getSiteOfflineState } from "@/lib/site-offline";
import { getRequestLocale, t, tObj } from "@/lib/locale";
import { COOKIE_UI_IT, type CookieUiLabels } from "@/lib/site-ui-labels";
import { buildLocaleAlternates, SEO_PATH_LOCALES } from "@/lib/seo-locale";

const OG_LOCALE: Record<string, string> = {
  it: "it_IT",
  en: "en_US",
  ar: "ar_AR",
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  ru: "ru_RU",
  tr: "tr_TR",
  zh: "zh_CN",
  hi: "hi_IN",
  sq: "sq_AL",
};

export async function generateMetadata(): Promise<Metadata> {
  const barePath = (await headers()).get("x-pathname") || "/";
  const locale = await getRequestLocale();
  // Modalita offline attiva: noindex, altrimenti Google indicizza la pagina
  // "Sito in manutenzione" al posto dei contenuti veri (gia successo a luglio).
  const offline = await getSiteOfflineState();
  const defaultTitle = await t(
    "home",
    "meta_title",
    "Successioni Online | Geom. Lorenzo Armellin",
  );
  const defaultDescription = await t(
    "home",
    "meta_description",
    "Dichiarazione di successione online con un professionista reale: Geom. Lorenzo Armellin, iscritto all'Albo. Preventivo chiaro, documenti e pratica da casa — anche di persona a Pontedera.",
  );
  // Template solo qui (non nel root): meta_title home include già il brand
  // come `default`; le pagine figlie usano titolo corto + questo template.
  const brandSuffix =
    locale === "ar" ? "المهندس لورنزو أرميلين" : "Geom. Lorenzo Armellin";
  const titleTemplate = `%s | ${brandSuffix}`;
  const ogLocale = OG_LOCALE[locale] || "it_IT";
  const alternateLocale = [
    "it_IT",
    ...SEO_PATH_LOCALES.map((l) => OG_LOCALE[l]).filter(
      (v): v is string => Boolean(v) && v !== ogLocale,
    ),
  ];

  return {
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: defaultDescription,
    alternates: buildLocaleAlternates(barePath, locale),
    ...(offline.enabled ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      locale: ogLocale,
      alternateLocale,
      siteName: "Successioni Armellin",
    },
  };
}

/*
  Dati strutturati sitewide: lo studio come ProfessionalService (local SEO,
  knowledge panel). Dati anagrafici reali del footer/contatti: le directory
  esterne riportano una P.IVA vecchia, qui fa fede quella attuale.
*/
const BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.successioniarmellin.it/#studio",
  name: "Successioni Armellin - Geom. Lorenzo Armellin",
  description:
    "Dichiarazione di successione online seguita da un geometra iscritto all'Albo: preventivo chiaro, documenti e pratica da casa, invio telematico all'Agenzia delle Entrate.",
  url: "https://www.successioniarmellin.it/",
  telephone: "+393201570567",
  email: "studio@successioniarmellin.it",
  vatID: "IT02432220503",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Vittorio Veneto 31",
    postalCode: "56025",
    addressLocality: "Pontedera",
    addressRegion: "PI",
    addressCountry: "IT",
  },
  areaServed: { "@type": "Country", name: "Italia" },
  priceRange: "€€",
  knowsAbout: [
    "Dichiarazione di successione",
    "Volture catastali",
    "Imposta di successione",
  ],
  founder: {
    "@type": "Person",
    name: "Lorenzo Armellin",
    jobTitle: "Geometra",
    memberOf: {
      "@type": "Organization",
      name: "Collegio Geometri e Geometri Laureati di Pisa (n. 1969)",
    },
  },
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const offline = await getSiteOfflineState();
  const offlineOn = offline.enabled;
  const cookieUi = await tObj<CookieUiLabels>(
    "site_ui",
    "cookie_ui",
    COOKIE_UI_IT,
  );

  return (
    <div className="flex min-h-full flex-col bg-bg text-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_LD) }}
      />
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {gaId && <ContactTracker />}
      <Navbar />
      <main className={offlineOn ? "flex-1" : "flex-1 pb-20 lg:pb-0"}>
        {offlineOn ? <SiteOfflineNotice state={offline} /> : children}
      </main>
      <Footer />
      {!offlineOn && (
        <HideOnPaths prefixes={["/preventivo", "/checkout"]}>
          <MobileCta />
        </HideOnPaths>
      )}
      <ConsentBanner labels={cookieUi} />
    </div>
  );
}
