import { tList } from "@/lib/locale";
import {
  IconTrustAlbo,
  IconTrustEntratel,
  IconTrustFiscal,
  IconTrustGdpr,
  IconTrustPay,
  IconTrustSsl,
} from "@/components/site/trust-bar-icons";

const trustIcons = [
  IconTrustAlbo,
  IconTrustEntratel,
  IconTrustFiscal,
  IconTrustPay,
  IconTrustGdpr,
  IconTrustSsl,
] as const;

export async function TrustBar() {
  const items = await tList<string>("home", "trustbar_items");
  if (items.length === 0) return null;

  return (
    <div className="border-y border-primary/10 bg-sand text-primary">
      {/* Mobile compatto: righe orizzontali icona+testo su 2 colonne strette;
          da sm si torna al layout verticale centrato (3 col, poi 6 a lg). */}
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-3 gap-y-2.5 px-4 py-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-5 sm:px-8 sm:py-8 lg:grid-cols-6 lg:gap-y-0">
        {items.map((item, i) => {
          const Icon = trustIcons[i] ?? IconTrustAlbo;
          return (
            <li
              key={item}
              className="flex items-center gap-2 text-left sm:flex-col sm:items-center sm:gap-2 sm:px-1 sm:text-center"
            >
              <Icon className="h-4.5 w-4.5 shrink-0 text-accent sm:h-7 sm:w-7" />
              <span className="text-[11px] font-medium leading-tight text-primary sm:text-sm sm:leading-snug">
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
