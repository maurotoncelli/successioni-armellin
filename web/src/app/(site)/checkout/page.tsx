import type { Metadata } from "next";
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
import { cta, list, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Completa l'ordine",
  robots: { index: false },
};

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

  const [packages, addons] = await Promise.all([getPackages(), getAddons()]);
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
      )
    : null;

  const pkg = packageKey ? packages.find((p) => p.key === packageKey) : undefined;

  const trustItems = list<string>("checkout", "trust_items");
  const modificaLink = cta("checkout", "modifica_link");
  const recessoLink = cta("checkout", "recesso_link");

  return (
    <div className="bg-bg-muted py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl">
              {text("checkout", "header_title")}
            </h1>
            <p className="mt-3 text-text-muted">
              {text("checkout", "header_subtitle")}
            </p>
          </div>

          {annullato && (
            <p className="mx-auto mt-6 max-w-2xl rounded-[10px] bg-amber-50 p-3 text-center text-sm text-amber-700">
              Pagamento annullato. Nessun addebito effettuato: puoi riprovare
              quando vuoi.
            </p>
          )}

          <div className="mt-6 grid gap-6 sm:mt-10 lg:grid-cols-5">
            {/* Riepilogo */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl">{text("checkout", "riepilogo_title")}</h2>
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
                        Totale onorario
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">
                        {order.total}&euro;
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2 rounded-[10px] bg-sand/60 p-3 text-xs leading-relaxed text-text-muted">
                      <Info className="h-4 w-4 shrink-0 text-accent" />
                      <span>{text("checkout", "prezzo_imposte_nota")}</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-5 text-sm text-text-muted">
                    <p>
                      Non risulta una pratica con un pacchetto da pagare. Calcola
                      prima il preventivo: ti proponiamo il pacchetto giusto e
                      colleghiamo il pagamento alla tua pratica.
                    </p>
                    <Link
                      href="/preventivo"
                      className="mt-3 inline-block font-medium text-accent hover:text-accent-dark"
                    >
                      Vai al preventivo &rarr;
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Pagamento */}
            <div className="lg:col-span-3">
              <Card>
                <h2 className="text-xl">{text("checkout", "pagamento_title")}</h2>
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
                    payLabel={cta("checkout", "cta_pay").label}
                    consensoTc={text("checkout", "consenso_tc")}
                    consensoAvvio={text("checkout", "consenso_avvio")}
                    ctaNota={text("checkout", "cta_nota")}
                    rateNota={text("checkout", "rate_nota")}
                    recessoLink={{
                      href: recessoLink.href,
                      label: recessoLink.label,
                    }}
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
            {text("checkout", "microtrust")}
          </p>
        </div>
      </Container>
    </div>
  );
}
