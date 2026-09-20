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
    <div className="bg-primary text-white">
      {/*
        Flex su div, non grid su <ul>: in Safari/WebKit gli <li> restano
        list-item e la griglia non parte — le 6 voci si impilano in colonna.
        Ogni voce è un quadrato oro a sé: niente fascia unica sopra/sotto.
      */}
      <div
        role="list"
        className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-2.5 px-3 py-5 sm:grid-cols-6 sm:gap-3 sm:px-5 sm:py-6 lg:gap-4"
      >
        {items.map((item, i) => {
          const Icon = trustIcons[i] ?? IconTrustAlbo;
          return (
            <div
              key={item}
              role="listitem"
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl px-1.5 text-center sm:gap-2 sm:rounded-2xl sm:px-2"
              style={{ border: "2px solid #b5894e" }}
            >
              <Icon className="h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              <span className="text-[9px] font-semibold leading-snug sm:text-[11px] lg:text-xs">
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
