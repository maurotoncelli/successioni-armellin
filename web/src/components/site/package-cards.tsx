import { Check, MessageCircle } from "lucide-react";
import { getPackages } from "@/lib/cms";
import { ButtonLink } from "@/components/ui/button";
import { cta, list, text } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function PackageCards() {
  const packages = await getPackages();

  // Quarta scheda "su misura": non e' un pacchetto acquistabile (niente prezzo,
  // il preventivo viene emesso dopo consulenza) ma va mostrata accanto agli
  // altri per chiarire che i casi fuori standard hanno comunque una strada.
  const custom = {
    title: text("pacchetti", "su_misura_title", "Preventivo personalizzato"),
    tagline: text(
      "pacchetti",
      "su_misura_tagline",
      "Per le successioni più complesse",
    ),
    priceLabel: text("pacchetti", "su_misura_price_label", "Su misura"),
    body: text(
      "pacchetti",
      "su_misura_body",
      "Più di 8 immobili, terreni agricoli, aziende o quote societarie? I casi più complessi non stanno in un pacchetto standard: ti prepariamo un preventivo dedicato, senza sorprese.",
    ),
    features: list<string>("pacchetti", "su_misura_features"),
    cta: cta("pacchetti", "su_misura_cta", {
      label: "Richiedi il preventivo",
      href: "/preventivo",
    }),
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {packages
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((pkg) => {
          const featured = Boolean(pkg.badge);
          return (
            <div
              key={pkg.key}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-bg p-7 shadow-sm",
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
                <span className="text-sm text-text-muted">onorario</span>
              </div>
              {pkg.slaDays && (
                <p className="mt-1 text-sm text-text-muted">
                  Invio entro {pkg.slaDays} giorni lavorativi dai documenti
                  completi
                </p>
              )}

              <p className="mt-5 text-sm leading-relaxed text-text">
                {pkg.description}
              </p>

              <ul className="mt-5 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/preventivo"
                variant={featured ? "primary" : "outline"}
                className="mt-7 w-full"
              >
                Scegli {pkg.name}
              </ButtonLink>
            </div>
          );
        })}

      <div
        className={cn(
          "group relative flex flex-col rounded-2xl border border-dashed border-primary/25 bg-bg-muted/60 p-7 shadow-sm",
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
        <p className="mt-1 text-sm text-text-muted">
          Definito insieme, prima di iniziare
        </p>

        <p className="mt-5 text-sm leading-relaxed text-text">{custom.body}</p>

        <ul className="mt-5 flex-1 space-y-3">
          {custom.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <ButtonLink href={custom.cta.href} variant="outline" className="mt-7 w-full">
          {custom.cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
