import type { Package, Addon } from "@/content/site";
import type { PackageKey } from "@/lib/supabase/types";

/*
  Composizione dell'ordine (onorario) per UNA pratica = UN ordine (no carrello, @04).
  Funzione PURA: dato il pacchetto, gli eventuali add-on e il numero di immobili,
  produce lo snapshot `line_items` + il totale. E' la stessa logica usata sia dal
  checkout pubblico sia dalla generazione del link di pagamento dal CRM, cosi il
  prezzo e sempre coerente. Le imposte di Stato restano SEPARATE (non qui).
*/

export type OrderLineItem = {
  type: "PACKAGE" | "ADDON" | "SURCHARGE";
  key: string;
  label: string;
  amount: number;
};

export type OrderInput = {
  packageKey: PackageKey;
  addonKeys?: string[];
  realEstateCount?: number | null;
};

export type ComputedOrder = {
  packageKey: PackageKey;
  lineItems: OrderLineItem[];
  total: number;
};

const INCLUDED_PROPERTIES = 3; // oltre il 3o immobile scatta il sovrapprezzo (@01)

export function buildOrder(
  input: OrderInput,
  packages: Package[],
  addons: Addon[],
): ComputedOrder | null {
  const pkg = packages.find((p) => p.key === input.packageKey);
  if (!pkg) return null;

  const lineItems: OrderLineItem[] = [
    { type: "PACKAGE", key: pkg.key, label: pkg.name, amount: pkg.price },
  ];

  // Sovrapprezzo immobili eccedenti (solo se il pacchetto lo prevede)
  const count = input.realEstateCount ?? 0;
  if (pkg.extraPropertyFee && count > INCLUDED_PROPERTIES) {
    const extra = count - INCLUDED_PROPERTIES;
    lineItems.push({
      type: "SURCHARGE",
      key: "EXTRA_PROPERTY",
      label: `Immobili aggiuntivi (${extra} × ${pkg.extraPropertyFee}€)`,
      amount: extra * pkg.extraPropertyFee,
    });
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

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  return { packageKey: pkg.key, lineItems, total };
}
