import { CheckCircle2, Tag } from "lucide-react";
import { getRequestLocale, tObj } from "@/lib/locale";
import { PROMO_UI_IT, type PromoUiLabels } from "@/lib/site-ui-labels";
import {
  formatPromoEnd,
  getActivePromo,
  promoPrice,
  type Promo,
} from "@/lib/promo";
import { cn } from "@/lib/utils";

/*
  Pezzi server della promo (lib/promo.ts): etichette tradotte, prezzo barrato
  + scontato, lista "cosa è compreso". Se la promo non è attiva, i componenti
  prezzo mostrano solo il listino pieno e il banner restituisce null.
*/

export const INTL_LOCALE: Record<string, string> = {
  it: "it-IT",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  ar: "ar",
  ru: "ru-RU",
  tr: "tr-TR",
  zh: "zh-CN",
  hi: "hi-IN",
  sq: "sq-AL",
};

export type PromoContext = {
  promo: Promo | null;
  ui: PromoUiLabels;
  intlLocale: string;
  /** Giorno di fine già formattato (vuoto se promo assente). */
  endDate: string;
};

/** Promo attiva + etichette nel locale della richiesta. */
export async function getPromoContext(): Promise<PromoContext> {
  const [locale, ui] = await Promise.all([
    getRequestLocale(),
    tObj<PromoUiLabels>("site_ui", "promo_ui", PROMO_UI_IT),
  ]);
  const promo = getActivePromo();
  const intlLocale = INTL_LOCALE[locale] ?? "it-IT";
  return {
    promo,
    ui,
    intlLocale,
    endDate: promo ? formatPromoEnd(promo, intlLocale) : "",
  };
}

export function fillPct(tpl: string, promo: Promo): string {
  return tpl.replace("{pct}", String(promo.percent));
}

/** Formatta un importo in euro senza decimali inutili (392 → "392", 391,5 → "391,50"). */
export function formatAmount(amount: number, intlLocale: string): string {
  const hasCents = Math.abs(amount - Math.round(amount)) > 0.001;
  return new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
  Prezzo di listino con, se la promo è attiva, il pieno barrato e lo scontato
  in evidenza + pillola "−20% lancio". `size` regola la tipografia.
*/
export function PromoPrice({
  amount,
  ctx,
  size = "lg",
  className,
}: {
  amount: number;
  ctx: PromoContext;
  size?: "lg" | "md";
  className?: string;
}) {
  const big =
    size === "lg"
      ? "font-display text-4xl font-bold"
      : "font-display text-3xl font-bold sm:text-4xl";
  if (!ctx.promo) {
    return (
      <span className={cn(big, "text-primary", className)}>
        {formatAmount(amount, ctx.intlLocale)}&euro;
      </span>
    );
  }
  const discounted = promoPrice(amount, ctx.promo);
  return (
    <span className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn(big, "text-accent-dark")}>
        {formatAmount(discounted, ctx.intlLocale)}&euro;
      </span>
      <s className="text-lg font-medium text-text-muted decoration-text-muted/70">
        {formatAmount(amount, ctx.intlLocale)}&euro;
      </s>
      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
        <Tag className="h-3 w-3" />
        {fillPct(ctx.ui.badge, ctx.promo)}
      </span>
    </span>
  );
}

/** "Prezzo di lancio valido fino al 25 settembre" (null senza promo). */
export function PromoValidUntil({
  ctx,
  className,
}: {
  ctx: PromoContext;
  className?: string;
}) {
  if (!ctx.promo) return null;
  return (
    <p className={cn("text-xs font-medium text-accent-dark", className)}>
      {ctx.ui.valid_until.replace("{date}", ctx.endDate)}
    </p>
  );
}

/**
  Fascia sotto le card prezzo (tariffe): lista "cosa è compreso" su due
  colonne. Serve a rendere leggibile il valore subito sotto la cifra, non
  dentro le card compresse.
*/
export function PromoIncludedBand({ ctx, className }: { ctx: PromoContext; className?: string }) {
  if (ctx.ui.included_items.length === 0) return null;
  const half = Math.ceil(ctx.ui.included_items.length / 2);
  const cols = [ctx.ui.included_items.slice(0, half), ctx.ui.included_items.slice(half)];
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/10 bg-bg p-5 shadow-sm sm:p-7",
        className,
      )}
    >
      <h3 className="font-display text-xl font-semibold text-primary">
        {ctx.ui.included_title}
      </h3>
      <div className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
        {cols.map((col, i) => (
          <ul key={i} className="space-y-1.5 text-sm sm:text-[15px]">
            {col.map((item) => (
              <li key={item} className="flex items-start gap-2 text-text">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/** Lista "Cosa è compreso nel prezzo" con spunte. */
export function IncludedList({
  ctx,
  className,
  compact = false,
}: {
  ctx: PromoContext;
  className?: string;
  compact?: boolean;
}) {
  if (ctx.ui.included_items.length === 0) return null;
  return (
    <div className={className}>
      <h3
        className={cn(
          "font-display font-semibold text-primary",
          compact ? "text-sm" : "text-base",
        )}
      >
        {ctx.ui.included_title}
      </h3>
      <ul className={cn("mt-2 space-y-1.5", compact ? "text-sm" : "text-sm sm:text-[15px]")}>
        {ctx.ui.included_items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-text">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
