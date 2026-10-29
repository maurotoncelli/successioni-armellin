/*
  Tag Google unificato (GTM-KRWDDHRV: contiene GA4 G-TBBB3D04GF,
  Google Ads AW-18323297636 e Conversion Linker con url_passthrough).
  Renderizzato direttamente nel primo HTML.
*/

const GTM_ID = "GTM-KRWDDHRV";

const INIT_SNIPPET = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
`;

export function GoogleAnalytics() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
      />
      <script dangerouslySetInnerHTML={{ __html: INIT_SNIPPET }} />
    </>
  );
}
