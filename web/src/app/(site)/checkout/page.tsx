import type { Metadata } from "next";
import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import {
  CHECKOUT_UI_IT,
  type CheckoutUiLabels,
} from "@/lib/site-ui-labels";
import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { CheckoutPanel } from "@/components/site/checkout-panel";
import { getPackages, getAddons } from "@/lib/cms";
import { getPractice } from "@/lib/crm";
import { buildOrder } from "@/lib/order";
import { isPackageKey } from "@/lib/quote";
import type { PackageKey } from "@/lib/supabase/types";

export async function generateMetadata(): Promise<Metadata> {
  const ui = await tObj<CheckoutUiLabels>("site_ui", "checkout_ui", CHECKOUT_UI_IT);
  return {
    title: ui.meta_title,
    robots: { index: false },
  };
}

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    practice?: string;
    annullato?: string;
    pkg?: string;
    recount?: string;
    comp?: string;
    heirs?: string;
    hasre?: string;
    will?: string;
    other?: string;
  }>;
}) {
  const sp = await searchParams;
  const { practice: practiceId, annullato } = sp;
  const checkoutUi = await tObj<CheckoutUiLabels>(
    "site_ui",
    "checkout_ui",
    CHECKOUT_UI_IT,
  );

  const locale = await getRequestLocale();
  const [packages, addons] = await Promise.all([
    getPackages(locale),
    getAddons(locale),
  ]);
  const practice = practiceId ? await getPractice(practiceId) : undefined;

  // Due sorgenti: pratica esistente (link dal CRM) OPPURE parametri dal preventivo
  // pubblico (flusso "result-first": la pratica si crea al pagamento).
  const paramPackage = isPackageKey(sp.pkg) ? sp.pkg : undefined;
  const paramReCount = sp.recount ? Number.parseInt(sp.recount, 10) : null;

  const packageKey = (practice?.selectedPackage ??
    practice?.suggestedPackage ??
    paramPackage) as PackageKey | undefined;

  const realEstateCount = practice?.realEstateCount ?? paramReCount ?? null;

  const order = packageKey
    ? buildOrder(
        {
          packageKey,
          realEstateCount,
        },
        packages,
        addons,
        { extraProperty: checkoutUi.extra_property },
      )
    : null;

  const pkg = packageKey ? packages.find((p) => p.key === packageKey) : undefined;

  const trustItems = await tList<string>("checkout", "trust_items");
  const modificaLink = await tCta("checkout", "modifica_link");
  const recessoLink = await tCta("checkout", "recesso_link");

  return (
    <div className="bg-bg-muted py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl">
              {await t("checkout", "header_title")}
            </h1>
            <p className="mt-3 text-text-muted">
              {await t("checkout", "header_subtitle")}
            </p>
          </div>

          {annullato && (
            <p className="mx-auto mt-6 max-w-2xl rounded-[10px] bg-amber-50 p-3 text-center text-sm text-amber-700">
              {checkoutUi.cancelled}
            </p>
          )}

          <div className="mt-6 grid gap-6 sm:mt-10 lg:grid-cols-5">
            {/* Riepilogo */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl">{await t("checkout", "riepilogo_title")}</h2>
                  <Link
                    href={modificaLink.href}
                    className="text-sm font-medium text-accent hover:text-accent-dark"
                  >
                    {modificaLink.label}
                  </Link>
                </div>

                {order && pkg ? (
                  <>
                    <div className="mt-5 space-y-2.5 border-b border-primary/10 pb-4">
                      {order.lineItems.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <span className="text-text">{item.label}</span>
                          <span className="shrink-0 font-medium text-primary">
                            {item.amount}&euro;
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        {checkoutUi.total_fee}
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">
                        {order.total}&euro;
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2 rounded-[10px] bg-sand/60 p-3 text-xs leading-relaxed text-text-muted">
                      <Info className="h-4 w-4 shrink-0 text-accent" />
                      <span>{await t("checkout", "prezzo_imposte_nota")}</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-5 text-sm text-text-muted">
                    <p>{checkoutUi.empty_order}</p>
                    <Link
                      href="/preventivo"
                      className="mt-3 inline-block font-medium text-accent hover:text-accent-dark"
                    >
                      {checkoutUi.empty_cta}
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Pagamento */}
            <div className="lg:col-span-3">
              <Card>
                <h2 className="text-xl">{await t("checkout", "pagamento_title")}</h2>
                <div className="mt-4">
                  <CheckoutPanel
                    practiceId={practiceId ?? null}
                    packageKey={order ? (packageKey ?? null) : null}
                    realEstateCount={realEstateCount}
                    answers={{
                      comp: sp.comp ?? "",
                      heirs: sp.heirs ?? "",
                      hasRealEstate: sp.hasre ?? "",
                      hasWill: sp.will ?? "no",
                      hasOther: sp.other ?? "no",
                    }}
                    payLabel={(await tCta("checkout", "cta_pay")).label}
                    consensoTc={await t("checkout", "consenso_tc")}
                    consensoAvvio={await t("checkout", "consenso_avvio")}
                    ctaNota={await t("checkout", "cta_nota")}
                    rateNota={await t("checkout", "rate_nota")}
                    recessoLink={{
                      href: recessoLink.href,
                      label: recessoLink.label,
                    }}
                    ui={checkoutUi}
                  />
                </div>
              </Card>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted">
            {trustItems.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-text-muted">
            {await t("checkout", "microtrust")}
          </p>
        </div>
      </Container>
    </div>
  );
}
