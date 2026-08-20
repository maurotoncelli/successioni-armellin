import { getRequestLocale, t, tCta, tList } from "@/lib/locale";
import { getPackages } from "@/lib/cms";
import { ButtonLink } from "@/components/ui/button";
import { PackageCardDetails } from "@/components/site/package-card-details";
import { cn } from "@/lib/utils";

export async function PackageCards() {
  const locale = await getRequestLocale();
  const packages = await getPackages(locale);
  const priceSuffix = await t("pacchetti", "price_suffix", "onorario senza IVA");
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

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-primary">
                  {pkg.price}&euro;
                </span>
              </div>
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
