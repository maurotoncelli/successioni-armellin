import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Info, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPackages } from "@/lib/cms";
import { cta, list, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Completa l'ordine",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const packages = await getPackages();
  const order = packages.find((p) => p.key === "COMPLETO") ?? packages[0];
  const metodi = list<string>("checkout", "pagamento_metodi");
  const trustItems = list<string>("checkout", "trust_items");
  const modificaLink = cta("checkout", "modifica_link");
  const recessoLink = cta("checkout", "recesso_link");

  return (
    <div className="bg-bg-muted py-14 sm:py-20">
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

          <div className="mt-10 grid gap-6 lg:grid-cols-5">
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

                <div className="mt-5 flex items-center justify-between border-b border-primary/10 pb-4">
                  <div>
                    <p className="font-medium text-primary">{order.name}</p>
                    <p className="text-sm text-text-muted">{order.tagline}</p>
                  </div>
                  <span className="font-display text-xl font-bold text-primary">
                    {order.price}&euro;
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    Totale onorario
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {order.price}&euro;
                  </span>
                </div>

                <div className="mt-5 flex gap-2 rounded-[10px] bg-sand/60 p-3 text-xs leading-relaxed text-text-muted">
                  <Info className="h-4 w-4 shrink-0 text-accent" />
                  <span>{text("checkout", "prezzo_imposte_nota")}</span>
                </div>
              </Card>
            </div>

            {/* Pagamento */}
            <div className="lg:col-span-3">
              <Card>
                <h2 className="text-xl">{text("checkout", "pagamento_title")}</h2>
                <div className="mt-4 space-y-2">
                  {metodi.map((m, i) => (
                    <label
                      key={m}
                      className="flex items-center gap-3 rounded-[10px] border border-primary/15 p-3.5 text-sm"
                    >
                      <input
                        type="radio"
                        name="metodo"
                        defaultChecked={i === 0}
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-text-muted">
                  {text("checkout", "rate_nota")}
                </p>

                <div className="mt-6 space-y-3">
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                    />
                    <span>{text("checkout", "consenso_tc")}</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                    />
                    <span>{text("checkout", "consenso_avvio")}</span>
                  </label>
                </div>

                <Button size="lg" className="mt-6 w-full">
                  <Lock className="h-4 w-4" />
                  {cta("checkout", "cta_pay").label}
                </Button>
                <p className="mt-2 text-center text-xs text-text-muted">
                  {text("checkout", "cta_nota")}
                </p>

                <p className="mt-4 text-center text-xs text-text-muted">
                  <Link href={recessoLink.href} className="underline">
                    {recessoLink.label}
                  </Link>
                </p>
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
