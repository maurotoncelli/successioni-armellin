import Link from "next/link";
import { BadgeCheck, FileText, Lock, RotateCcw, type LucideIcon } from "lucide-react";
import { tObj } from "@/lib/locale";
import {
  PAYMENT_TRUST_UI_IT,
  type PaymentTrustIcon,
  type PaymentTrustUiLabels,
} from "@/lib/site-ui-labels";

const ICONS: Record<PaymentTrustIcon, LucideIcon> = {
  albo: BadgeCheck,
  stripe: Lock,
  invoice: FileText,
  refund: RotateCcw,
};

/* "Paghi tranquillo": solo fatti verificabili (albo, Stripe, fattura, recesso e garanzia). */
export async function PaymentTrust() {
  const ui = await tObj<PaymentTrustUiLabels>(
    "site_ui",
    "payment_trust_ui",
    PAYMENT_TRUST_UI_IT,
  );
  if (!ui.items?.length) return null;

  return (
    <div
      data-track-section="payment_trust"
      className="mx-auto mt-4 max-w-3xl rounded-2xl border border-success/20 bg-bg p-5 shadow-sm sm:p-8"
    >
      <div className="flex items-center gap-2.5">
        <Lock className="h-5 w-5 shrink-0 text-success" />
        <h3 className="text-lg sm:text-xl">{ui.title}</h3>
      </div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {ui.items.map((item) => {
          const Icon = ICONS[item.icon] ?? BadgeCheck;
          return (
            <li key={item.title} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-primary">{item.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex flex-col gap-2 border-t border-primary/10 pt-4 text-xs leading-relaxed text-text-muted sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <p>{ui.methods}</p>
        <Link
          href="/garanzia"
          className="shrink-0 font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {ui.guarantee_link}
        </Link>
      </div>
    </div>
  );
}
