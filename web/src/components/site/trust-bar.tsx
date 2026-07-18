import { list } from "@/lib/content";
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

export function TrustBar() {
  const items = list<string>("home", "trustbar_items");
  if (items.length === 0) return null;

  return (
    <div className="border-y border-primary/10 bg-sand text-primary">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-6 sm:grid-cols-3 sm:gap-x-6 sm:px-8 sm:py-8 lg:grid-cols-6 lg:gap-y-0">
        {items.map((item, i) => {
          const Icon = trustIcons[i] ?? IconTrustAlbo;
          return (
            <li
              key={item}
              className="flex flex-col items-center gap-2 px-1 text-center"
            >
              <Icon className="h-6 w-6 text-accent sm:h-7 sm:w-7" />
              <span className="text-xs font-medium leading-snug text-primary sm:text-sm">
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
