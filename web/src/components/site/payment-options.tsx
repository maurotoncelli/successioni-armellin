import { MessageCircle, ShieldCheck } from "lucide-react";
import { tObj } from "@/lib/locale";
import { FLAT_OFFER_CHECKOUT_HREF, getFlatOffer } from "@/lib/flat-offer";
import { PAYMENT_UI_IT, type PaymentUiLabels } from "@/lib/site-ui-labels";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* "Come si paga": online, tutto in anticipo o 50/50, rate dove disponibili. */
export async function PaymentOptions({
  cta,
  className,
}: {
  /** Prefisso `data-cta` dei pulsanti, es. "home_payment". */
  cta: string;
  className?: string;
}) {
  const [ui, tel] = await Promise.all([
    tObj<PaymentUiLabels>("site_ui", "payment_ui", PAYMENT_UI_IT),
    tObj("contatti", "telefono", { cta_whatsapp: "https://wa.me/393201570567" }),
  ]);
  const flat = getFlatOffer();
  const waBase = String(tel.cta_whatsapp || "https://wa.me/393201570567");
  const waHref = `${waBase}${waBase.includes("?") ? "&" : "?"}text=${encodeURIComponent(ui.whatsapp_prefill)}`;

  return (
    <div
      data-track-section="payment"
      className={cn(
        "mx-auto max-w-3xl rounded-2xl border border-primary/10 bg-bg p-5 shadow-sm sm:p-8",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-6 w-6 shrink-0 text-success" />
        <h3 className="text-xl sm:text-2xl">{ui.title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">{ui.intro}</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {ui.options.map((option) => (
          <li key={option.title} className="rounded-xl bg-bg-muted p-4">
            <p className="font-semibold text-primary">{option.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{option.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-text-muted sm:text-sm">{ui.note}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink
          href={flat ? FLAT_OFFER_CHECKOUT_HREF : "/preventivo"}
          variant="primary"
          className="w-full sm:w-auto"
          cta={`${cta}_${flat ? "buy" : "preventivo"}`}
        >
          {flat ? ui.cta_buy : ui.cta_quote}
        </ButtonLink>
        <ButtonLink
          href={waHref}
          variant="whatsapp"
          className="w-full sm:w-auto"
          cta={`${cta}_whatsapp`}
        >
          <MessageCircle className="h-4 w-4" />
          {ui.cta_whatsapp}
        </ButtonLink>
      </div>
    </div>
  );
}
