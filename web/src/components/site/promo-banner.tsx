import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { getRequestLocale, tObj } from "@/lib/locale";
import { localePath } from "@/lib/seo-locale";
import { getFlatOffer } from "@/lib/flat-offer";
import { FLAT_OFFER_UI_IT, type FlatOfferUiLabels } from "@/lib/site-ui-labels";
import { HideOnPaths } from "@/components/site/hide-on-paths";
import { fillPct, formatAmount, getPromoContext } from "@/components/site/promo-ui";

const HIDDEN_ON = ["/checkout", "/preventivo/grazie", "/gatti"];
const BAR_LINK =
  "mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-3 py-1.5 text-center text-xs leading-tight hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-sm 2xl:max-w-[1440px]";

/*
  Barra sopra la navbar (non sticky: scorre via, la navbar resta). Mostra il
  prezzo unico durante il test (lib/flat-offer.ts), senza date né conto alla
  rovescia; altrimenti la promo a tempo, che sparisce da sola alla scadenza.
  Non compare nel checkout.
*/
export async function PromoBanner() {
  const flat = getFlatOffer();
  if (flat) return <FlatOfferBanner price={flat.price} />;

  const ctx = await getPromoContext();
  if (!ctx.promo) return null;
  const locale = await getRequestLocale();
  return (
    <HideOnPaths prefixes={HIDDEN_ON}>
      <div className="bg-primary text-white">
        <Link
          href={localePath("/preventivo", locale)}
          data-cta="promo_banner"
          className={BAR_LINK}
        >
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Tag className="h-3.5 w-3.5 shrink-0 text-accent" />
            {fillPct(ctx.ui.banner_text, ctx.promo)}
          </span>
          {ctx.endDate ? (
            <span className="text-white/85">
              {ctx.ui.valid_until.replace("{date}", ctx.endDate)}
            </span>
          ) : null}
          <span className="hidden items-center gap-1 font-medium text-accent sm:inline-flex">
            {ctx.ui.banner_cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </HideOnPaths>
  );
}

async function FlatOfferBanner({ price }: { price: number }) {
  const [locale, ui, ctx] = await Promise.all([
    getRequestLocale(),
    tObj<FlatOfferUiLabels>("site_ui", "flat_offer_ui", FLAT_OFFER_UI_IT),
    getPromoContext(),
  ]);
  return (
    <HideOnPaths prefixes={HIDDEN_ON}>
      <div className="bg-primary text-white">
        <Link
          href={localePath("/preventivo", locale)}
          data-cta="flat_offer_banner"
          className={BAR_LINK}
        >
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Tag className="h-3.5 w-3.5 shrink-0 text-accent" />
            {ui.banner_text.replace("{price}", formatAmount(price, ctx.intlLocale))}
          </span>
          <span className="text-white/85">{ui.banner_note}</span>
          <span className="hidden items-center gap-1 font-medium text-accent sm:inline-flex">
            {ui.banner_cta}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </span>
        </Link>
      </div>
    </HideOnPaths>
  );
}
