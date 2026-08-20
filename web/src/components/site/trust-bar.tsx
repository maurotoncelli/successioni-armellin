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
      <div aria-hidden className="h-0.5 bg-accent" />
      {/*
        Flex su div, non grid su <ul>: in Safari/WebKit gli <li> restano
        list-item e la griglia non parte — le 6 voci si impilano in colonna.
      */}
      <div
        role="list"
        className="mx-auto flex w-full max-w-6xl flex-nowrap items-stretch divide-x divide-white/10 px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-7"
      >
        {items.map((item, i) => {
          const Icon = trustIcons[i] ?? IconTrustAlbo;
          return (
            <div
              key={item}
              role="listitem"
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1.5 text-center sm:gap-2 sm:px-3"
            >
              <Icon className="h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              <span className="text-[10px] font-semibold leading-snug sm:text-xs lg:text-sm">
                {item}
              </span>
            </div>
          );
        })}
      </div>
      <div aria-hidden className="h-0.5 bg-accent" />
    </div>
  );
}
