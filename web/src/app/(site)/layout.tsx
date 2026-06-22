import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";
import { HideOnPaths } from "@/components/site/hide-on-paths";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import { ContactTracker } from "@/components/analytics/contact-tracker";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  return (
    <div className="flex min-h-full flex-col bg-bg text-text">
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {gaId && <ContactTracker />}
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <HideOnPaths prefixes={["/preventivo", "/checkout"]}>
        <MobileCta />
      </HideOnPaths>
      <ConsentBanner />
    </div>
  );
}
