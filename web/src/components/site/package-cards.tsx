import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import { getPackages } from "@/lib/cms";
import { FLAT_OFFER_CHECKOUT_HREF, getFlatOffer } from "@/lib/flat-offer";
import { FLAT_OFFER_UI_IT, type FlatOfferUiLabels } from "@/lib/site-ui-labels";
import { ButtonLink } from "@/components/ui/button";
import { PackageCardDetails } from "@/components/site/package-card-details";
import { cn } from "@/lib/utils";
import {
  formatAmount,
  getPromoContext,
  INTL_LOCALE,
  PromoPrice,
  PromoValidUntil,
} from "@/components/site/promo-ui";

/* Test prezzo unico (lib/flat-offer.ts): una card sola + nota su misura. */
async function FlatOfferCards({ price }: { price: number }) {
  const [locale, ui, tel] = await Promise.all([
    getRequestLocale(),
    tObj<FlatOfferUiLabels>("site_ui", "flat_offer_ui", FLAT_OFFER_UI_IT),
    tObj("contatti", "telefono", { cta_whatsapp: "https://wa.me/393201570567" }),
  ]);
  const intlLocale = INTL_LOCALE[locale] ?? "it-IT";
  const waBase = String(tel.cta_whatsapp || "https://wa.me/393201570567");
  const waPrefill = ui.whatsapp_prefill.replace("{price}", formatAmount(price, intlLocale));
  const waHref = `${waBase}${waBase.includes("?") ? "&" : "?"}text=${encodeURIComponent(waPrefill)}`;
  return (
    <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      <div className="relative flex flex-col rounded-2xl border border-accent bg-bg p-5 shadow-sm ring-1 ring-accent sm:p-7 lg:col-span-2">
        <span className="absolute -top-3 start-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {ui.badge}
        </span>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col">
            <h3 className="text-2xl">{ui.title}</h3>
            <p className="mt-1 text-sm text-text-muted">{ui.tagline}</p>
            <p className="mt-5 font-display text-5xl font-bold leading-none text-primary">
              {formatAmount(price, intlLocale)}&euro;
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-muted">
                {ui.price_note}
              </span>
              <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-muted">
                {ui.sla}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-accent-dark">{ui.taxes_note}</p>
            <div className="mt-6 flex flex-col gap-2.5">
              <ButtonLink
                href={FLAT_OFFER_CHECKOUT_HREF}
                variant="primary"
                className="w-full"
                cta="flat_offer_card_buy"
              >
                {ui.buy_cta}
              </ButtonLink>
              <ButtonLink
                href={waHref}
                variant="whatsapp"
                className="w-full"
                cta="flat_offer_card_whatsapp"
              >
                <MessageCircle className="h-4 w-4" />
                {ui.whatsapp_cta}
              </ButtonLink>
            </div>
            <div className="mt-5 text-center md:mt-auto md:pt-5">
              <Link
                href="/preventivo"
                data-cta="flat_offer_card"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
              >
                {ui.cta}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <p className="mt-1 text-xs text-text-muted">{ui.cta_hint}</p>
            </div>
          </div>
          <ul className="space-y-2.5 border-t border-primary/10 pt-5 text-sm sm:text-[15px] md:border-s md:border-t-0 md:ps-8 md:pt-0">
            {ui.features.map((item) => (
              <li key={item} className="flex items-start gap-2 text-text">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl border border-dashed border-primary/25 bg-bg-muted/60 p-5 shadow-sm sm:p-7">
        <h3 className="text-xl">{ui.custom_title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{ui.custom_text}</p>
        <div className="mt-5 lg:mt-auto lg:pt-6">
          <ButtonLink href="/preventivo" variant="outline" className="w-full" cta="flat_offer_custom">
            {ui.custom_cta}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export async function PackageCards() {
  const flat = getFlatOffer();
  if (flat) return <FlatOfferCards price={flat.price} />;

  const locale = await getRequestLocale();
  const [packages, promoCtx] = await Promise.all([
    getPackages(locale),
    getPromoContext(),
  ]);
  const priceSuffix = await t("pacchetti", "price_suffix", "onorario senza IVA da aggiungere");
  const slaLine = await t(
    "pacchetti",
    "sla_line",
    "Invio entro {n} giorni lavorativi dai documenti completi",
  );
  // CTA onesta: porta al quiz preventivo, non al pagamento.
  // `.replace("{name}")` resta per compatibilità con eventuali valori CMS vecchi.
  const ctaChoose = await t("pacchetti", "cta_choose", "Calcola il tuo preventivo");
  const detailsLabel = await t("pacchetti", "details_label", "Cosa include");
  const customPriceNote = await t(
    "pacchetti",
    "su_misura_price_note",
    "Definito insieme, prima di iniziare",
  );

  const custom = {
    title: await t("pacchetti", "su_misura_title", "Preventivo personalizzato"),
    tagline: await t(
      "pacchetti",
      "su_misura_tagline",
      "Per le successioni più complesse",
    ),
    priceLabel: await t("pacchetti", "su_misura_price_label", "Su misura"),
    features: await tList<string>("pacchetti", "su_misura_features"),
    cta: await tCta("pacchetti", "su_misura_cta", {
      label: "Richiedi il preventivo",
      href: "/preventivo",
    }),
  };

  // 2 pacchetti attivi + card Su misura (Zero Stress fuori vetrina):
  // 3 colonne piene da md, niente colonna orfana.
  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">
      {packages
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((pkg) => {
          const featured = Boolean(pkg.badge);
          return (
            <div
              key={pkg.key}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-bg p-5 shadow-sm sm:p-7",
                "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:ring-2 hover:ring-accent/40",
                featured
                  ? "border-accent ring-1 ring-accent"
                  : "border-primary/10",
              )}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {pkg.badge}
                </span>
              )}
              <h3 className="text-2xl">{pkg.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{pkg.tagline}</p>

              {/* Promo a tempo: pieno barrato + scontato (lib/promo.ts). */}
              <div className="mt-5">
                <PromoPrice amount={pkg.price} ctx={promoCtx} />
              </div>
              <PromoValidUntil ctx={promoCtx} className="mt-1.5" />
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-muted">
                  {priceSuffix}
                </span>
                {pkg.slaDays ? (
                  <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-muted">
                    {slaLine.replace("{n}", String(pkg.slaDays))}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 border-t border-primary/10" />

              <PackageCardDetails
                features={pkg.features}
                icon="check"
                toggleLabel={detailsLabel}
                peakFeatures={featured ? pkg.features.slice(-2) : []}
              />

              <ButtonLink
                href="/preventivo"
                variant={featured ? "primary" : "outline"}
                className="mt-5 w-full sm:mt-7"
              >
                {ctaChoose.replace("{name}", pkg.name)}
              </ButtonLink>
            </div>
          );
        })}

      <div
        className={cn(
          "group relative flex flex-col rounded-2xl border border-dashed border-primary/25 bg-bg-muted/60 p-5 shadow-sm sm:p-7",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:ring-2 hover:ring-accent/40",
        )}
      >
        <h3 className="text-2xl">{custom.title}</h3>
        <p className="mt-1 text-sm text-text-muted">{custom.tagline}</p>

        <div className="mt-5 flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-primary">
            {custom.priceLabel}
          </span>
        </div>
        <div className="mt-3">
          <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-muted">
            {customPriceNote}
          </span>
        </div>
        <div className="mt-5 border-t border-primary/10" />

        <PackageCardDetails
          features={custom.features}
          icon="message"
          toggleLabel={detailsLabel}
        />

        <ButtonLink
          href={custom.cta.href}
          variant="outline"
          className="mt-5 w-full sm:mt-7"
        >
          {custom.cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
