import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { getRequestLocale } from "@/lib/locale";
import { localePath } from "@/lib/seo-locale";
import { HideOnPaths } from "@/components/site/hide-on-paths";
import { fillPct, getPromoContext } from "@/components/site/promo-ui";

/*
  Barra promo sopra la navbar (non sticky: scorre via, la navbar resta).
  Sparisce da sola alla scadenza (server) e non compare nel checkout.
*/
export async function PromoBanner() {
  const ctx = await getPromoContext();
  if (!ctx.promo) return null;
  const locale = await getRequestLocale();
  return (
    <HideOnPaths prefixes={["/checkout"]}>
      <div className="bg-primary text-white">
        <Link
          href={localePath("/preventivo", locale)}
          data-cta="promo_banner"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-3 py-1.5 text-center text-xs leading-tight hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-sm 2xl:max-w-[1440px]"
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
