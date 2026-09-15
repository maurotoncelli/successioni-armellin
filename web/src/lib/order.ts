import type { Package, Addon } from "@/content/site";
import type { PackageKey } from "@/lib/supabase/types";
import { getActivePromo, promoDiscount, round2, type Promo } from "@/lib/promo";

/*
  Composizione dell'ordine (onorario) per UNA pratica = UN ordine (no carrello, @04).
  Funzione PURA: dato il pacchetto, gli eventuali add-on, il numero di immobili e
  il numero di eredi, produce lo snapshot `line_items` + il totale. E' la stessa
  logica usata da risultato quiz, checkout pubblico, email di riepilogo e link di
  pagamento dal CRM, cosi il prezzo e sempre coerente.
  Le imposte di Stato restano SEPARATE (non qui).

  Regola (05/09, decisione Lorenzo/Mauro): la vetrina resta 290 / 490 / su
  misura; il Completo copre 3 immobili e 5 eredi, e oltre la capienza si
  aggiungono +60 € per immobile e +60 € per erede (righe SURCHARGE). I casi
  speciali (altri beni: quote, aziende, imbarcazioni…) restano su misura: li
  decide `computeEsito` (lib/quote.ts), non questa funzione.

  Promo a tempo (15/09): se `getActivePromo()` è attiva, in coda alle righe
  c'è una riga DISCOUNT negativa pari a -X% del subtotale e `total` è già
  scontato. Stripe riceve le righe positive + un coupon percent_off (vedi
  lib/payments.ts), così la cifra coincide al centesimo.
*/

export type OrderLineItem = {
  /** DISCOUNT = promo a tempo (lib/promo.ts): amount NEGATIVO. */
  type: "PACKAGE" | "ADDON" | "SURCHARGE" | "DISCOUNT";
  key: string;
  label: string;
  amount: number;
};

export type OrderInput = {
  packageKey: PackageKey;
  addonKeys?: string[];
  realEstateCount?: number | null;
  heirsCount?: number | null;
};

export type OrderLabels = {
  /** Template con `{extra}` e `{fee}` (default IT). */
  extraProperty?: string;
  /** Template con `{extra}` e `{fee}` (default IT). */
  extraHeir?: string;
  /** Template riga sconto con `{pct}` (default IT). */
  discount?: string;
};

export type OrderDiscount = {
  code: string;
  percent: number;
  /** Importo dello sconto, POSITIVO. */
  amount: number;
  /** Fine validità della promo (ISO). */
  endsAt: string;
};

export type ComputedOrder = {
  packageKey: PackageKey;
  lineItems: OrderLineItem[];
  /** Somma delle righe prima dello sconto (= total se nessuna promo). */
  subtotal: number;
  /** Promo applicata, null se nessuna. */
  discount: OrderDiscount | null;
  total: number;
};

/*
  Capienza inclusa e sovrapprezzi per pacchetto. Solo il Completo ha
  sovrapprezzi: il Semplice non ha immobili e non prevede extra eredi; Zero
  Stress e fuori vetrina (storico) e non viene toccato.
  Il costo per immobile extra e' editabile dal CRM (`packages.extra_property_fee`):
  vuoto = predefinito 60, 0 = disattivato. Il costo per erede extra e' fisso.
*/
export const COMPLETO_INCLUDED_PROPERTIES = 3;
export const COMPLETO_INCLUDED_HEIRS = 5;
export const DEFAULT_EXTRA_PROPERTY_FEE = 60;
export const EXTRA_HEIR_FEE = 60;

type SurchargeRules = {
  includedProperties: number;
  includedHeirs: number;
  defaultPropertyFee: number;
  heirFee: number;
};

const SURCHARGE_RULES: Partial<Record<PackageKey, SurchargeRules>> = {
  COMPLETO: {
    includedProperties: COMPLETO_INCLUDED_PROPERTIES,
    includedHeirs: COMPLETO_INCLUDED_HEIRS,
    defaultPropertyFee: DEFAULT_EXTRA_PROPERTY_FEE,
    heirFee: EXTRA_HEIR_FEE,
  },
};

const EXTRA_PROPERTY_LABEL_IT = "Immobili aggiuntivi ({extra} × {fee}€)";
const EXTRA_HEIR_LABEL_IT = "Eredi aggiuntivi ({extra} × {fee}€)";
export const DISCOUNT_LABEL_IT = "Sconto lancio −{pct}%";

function fill(tpl: string, extra: number, fee: number): string {
  return tpl.replace("{extra}", String(extra)).replace("{fee}", String(fee));
}

/**
  `promo`: undefined = usa la promo attiva adesso (default, così ogni chiamante
  è coerente senza ricordarsene); null = forza listino pieno; oggetto = promo
  esplicita (test, o ricalcolo "come era al momento X").
*/
export function buildOrder(
  input: OrderInput,
  packages: Package[],
  addons: Addon[],
  labels?: OrderLabels,
  promo: Promo | null | undefined = getActivePromo(),
): ComputedOrder | null {
  const pkg = packages.find((p) => p.key === input.packageKey);
  if (!pkg) return null;

  const lineItems: OrderLineItem[] = [
    { type: "PACKAGE", key: pkg.key, label: pkg.name, amount: pkg.price },
  ];

  const rules = SURCHARGE_RULES[pkg.key];
  if (rules) {
    // Immobili oltre la capienza inclusa.
    const propertyFee = pkg.extraPropertyFee ?? rules.defaultPropertyFee;
    const properties = input.realEstateCount ?? 0;
    if (propertyFee > 0 && properties > rules.includedProperties) {
      const extra = properties - rules.includedProperties;
      lineItems.push({
        type: "SURCHARGE",
        key: "EXTRA_PROPERTY",
        label: fill(labels?.extraProperty ?? EXTRA_PROPERTY_LABEL_IT, extra, propertyFee),
        amount: extra * propertyFee,
      });
    }

    // Eredi oltre la capienza inclusa.
    const heirs = input.heirsCount ?? 0;
    if (rules.heirFee > 0 && heirs > rules.includedHeirs) {
      const extra = heirs - rules.includedHeirs;
      lineItems.push({
        type: "SURCHARGE",
        key: "EXTRA_HEIR",
        label: fill(labels?.extraHeir ?? EXTRA_HEIR_LABEL_IT, extra, rules.heirFee),
        amount: extra * rules.heirFee,
      });
    }
  }

  // Add-on selezionati (catalogo CMS)
  for (const key of input.addonKeys ?? []) {
    const addon = addons.find((a) => a.key === key);
    if (addon) {
      lineItems.push({
        type: "ADDON",
        key: addon.key,
        label: addon.name,
        amount: addon.price,
      });
    }
  }

  const subtotal = round2(lineItems.reduce((sum, item) => sum + item.amount, 0));

  // Promo a tempo: -X% su TUTTO il totale (pacchetto, extra, add-on), come
  // riga negativa così CRM, email, area personale e fattura la vedono.
  let discount: OrderDiscount | null = null;
  if (promo && subtotal > 0) {
    const amount = promoDiscount(subtotal, promo);
    if (amount > 0) {
      discount = { code: promo.code, percent: promo.percent, amount, endsAt: promo.endsAt };
      lineItems.push({
        type: "DISCOUNT",
        key: promo.code,
        label: (labels?.discount ?? DISCOUNT_LABEL_IT).replace("{pct}", String(promo.percent)),
        amount: -amount,
      });
    }
  }

  const total = round2(subtotal - (discount?.amount ?? 0));
  return { packageKey: pkg.key, lineItems, subtotal, discount, total };
}
