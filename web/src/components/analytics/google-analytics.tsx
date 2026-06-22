"use client";

import Script from "next/script";

/*
  GA4 con Consent Mode v2. Default = TUTTO NEGATO (GDPR): si attiva solo dopo
  consenso esplicito (consent-banner). Se NEXT_PUBLIC_GA4_MEASUREMENT_ID non e
  impostato non rendiamo nulla (no-op). Il flag salvato in localStorage viene
  riletto qui per ripristinare il consenso nelle visite successive.
*/

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent','default',{
            ad_storage:'denied',
            analytics_storage:'denied',
            ad_user_data:'denied',
            ad_personalization:'denied',
            wait_for_update:500
          });
          try {
            if (localStorage.getItem('cookie-consent') === 'granted') {
              gtag('consent','update',{
                ad_storage:'granted',
                analytics_storage:'granted',
                ad_user_data:'granted',
                ad_personalization:'granted'
              });
            }
          } catch (e) {}
          gtag('js', new Date());
          gtag('config','${gaId}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
