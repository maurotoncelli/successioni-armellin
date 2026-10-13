/*
  GA4 + Google Ads, Consent Mode v2. Il tag sta nel primo HTML (non dopo
  l'idratazione): lo strumento di Google lo vede, e il consenso di chi ha già
  accettato i cookie vale prima del primo invio.
  Default = tutto negato (GDPR). url_passthrough e ads_data_redaction sono il
  modo previsto da Google per misurare un clic sull'annuncio senza cookie.
*/

const TAG_ID = /^[A-Z][A-Z0-9-]{4,40}$/;

function tagId(value: string | undefined): string {
  const id = (value ?? "").trim();
  return TAG_ID.test(id) ? id : "";
}

export function GoogleAnalytics({
  gaId,
  adsId,
}: {
  gaId: string;
  adsId?: string;
}) {
  const ga = tagId(gaId);
  const ads = tagId(adsId);
  if (!ga) return null;
  const loader = ads || ga;
  const adsConfig = ads
    ? `gtag('config','${ads}',{allow_enhanced_conversions:true});`
    : "";
  const snippet = `
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
    gtag('set','ads_data_redaction',true);
    gtag('set','url_passthrough',true);
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
    gtag('config','${ga}');
    ${adsConfig}
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: snippet }} />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${loader}`} />
    </>
  );
}
