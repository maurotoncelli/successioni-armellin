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
import { getRequestLocale, tObj } from "@/lib/locale";
import { COOKIE_UI_IT, type CookieUiLabels } from "@/lib/site-ui-labels";
import { buildLocaleAlternates } from "@/lib/seo-locale";

export async function generateMetadata(): Promise<Metadata> {
  const barePath = (await headers()).get("x-pathname") || "/";
  const locale = await getRequestLocale();
  return {
    alternates: buildLocaleAlternates(barePath, locale),
    openGraph: {
      locale: locale === "ar" ? "ar_AR" : "it_IT",
      alternateLocale: locale === "ar" ? ["it_IT"] : ["ar_AR"],
    },
  };
}

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
