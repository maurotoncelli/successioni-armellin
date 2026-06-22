import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Phone, CreditCard } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { documentsList } from "@/content/site";
import { BackLink } from "@/components/site/back-link";
import { DocList } from "@/components/site/doc-list";
import { getPackages } from "@/lib/cms";
import { getPractice } from "@/lib/crm";
import type { PackageKey } from "@/lib/supabase/types";
import { cta, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Grazie",
  robots: { index: false },
};

type Esito = "a" | "b" | "c";

function resolveEsito(value?: string): Esito {
  if (value === "a" || value === "c") return value;
  return "b";
}

export default async function GraziePage({
  searchParams,
}: {
  searchParams: Promise<{ esito?: string; practice?: string }>;
}) {
  const { esito: rawEsito, practice: practiceId } = await searchParams;
  const esito = resolveEsito(rawEsito);

  const esitoBCta = cta("grazie", "esito_b_cta");
  const checkoutHref = practiceId
    ? `/checkout?practice=${practiceId}`
    : esitoBCta.href;

  // Esito B: mostriamo davvero quale pacchetto consigliamo (nome + prezzo).
  let suggestedPkg: { name: string; price: number; tagline: string } | null =
    null;
  if (esito === "b") {
    const [packages, practice] = await Promise.all([
      getPackages(),
      practiceId ? getPractice(practiceId) : Promise.resolve(undefined),
    ]);
    const key = (practice?.selectedPackage ??
      practice?.suggestedPackage ??
      "COMPLETO") as PackageKey;
    const pkg = packages.find((p) => p.key === key);
    if (pkg) {
      suggestedPkg = { name: pkg.name, price: pkg.price, tagline: pkg.tagline };
    }
  }

  const esitoConfig = {
    a: {
      title: text("grazie", "esito_a_title"),
      body: text("grazie", "esito_a_body"),
      cta: cta("grazie", "esito_a_cta"),
      icon: <Phone className="h-7 w-7 text-accent" />,
    },
    b: {
      title: text("grazie", "esito_b_title"),
      body: text("grazie", "esito_b_riallineamento"),
      cta: { label: esitoBCta.label, href: checkoutHref },
      icon: <CreditCard className="h-7 w-7 text-accent" />,
    },
    c: {
      title: text("grazie", "esito_c_title"),
      body: text("grazie", "esito_c_body"),
      cta: cta("grazie", "esito_c_cta"),
      icon: <Phone className="h-7 w-7 text-accent" />,
    },
  }[esito];

  // La parola "guida" nel testo esito B diventa un link (apre /tariffe in nuova
  // scheda). Il testo usa il token {guida}; data-driven anche nelle altre lingue.
  const guidaCta = cta("grazie", "esito_b_guida", {
    label: "guida",
    href: "/tariffe",
  });
  const faqLink = cta("grazie", "documenti_faq_link", {
    label: "Approfondisci nelle FAQ",
    href: "/faq",
  });

  function renderBody(body: string) {
    const parts = body.split("{guida}");
    if (parts.length === 1) return body;
    return (
      <>
        {parts[0]}
        <Link
          href={guidaCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {guidaCta.label}
        </Link>
        {parts.slice(1).join("{guida}")}
      </>
    );
  }

  return (
    <Section tone="muted">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <BackLink fallbackHref="/preventivo" />
        </div>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 text-3xl sm:text-4xl">
            {text("grazie", "header_title")}
          </h1>
        </div>

        <Card className="mt-10">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand">
              {esitoConfig.icon}
            </span>
            <div>
              <h2 className="text-xl">{esitoConfig.title}</h2>
              {suggestedPkg && (
                <div className="mt-3 rounded-[10px] border border-accent/30 bg-sand/50 p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-primary">
                      Pacchetto {suggestedPkg.name}
                    </span>
                    <span className="shrink-0 font-display text-xl font-bold text-accent">
                      {suggestedPkg.price}&euro;
                    </span>
                  </div>
                  {suggestedPkg.tagline && (
                    <p className="mt-1 text-sm text-text-muted">
                      {suggestedPkg.tagline}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-text-muted">
                    + imposte calcolate sul tuo caso: te le diciamo prima di
                    farti pagare.
                  </p>
                </div>
              )}
              <p className="mt-3 leading-relaxed text-text-muted">
                {renderBody(esitoConfig.body)}
              </p>
              <div className="mt-5">
                <ButtonLink href={esitoConfig.cta.href} variant="primary">
                  {esitoConfig.cta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl">{text("grazie", "documenti_title")}</h2>
          <DocList
            items={documentsList.slice(0, 5)}
            faqLabel={faqLink.label}
            faqHref={faqLink.href}
          />
          <p className="mt-4 text-sm text-text-muted">
            {text("grazie", "documenti_disclaimer")}
          </p>
          <p className="mt-1 text-sm font-medium text-accent">
            {text("grazie", "documenti_hook")}
          </p>
        </Card>

        <p className="mt-8 text-center text-sm text-text-muted">
          {text("grazie", "next_body")}
        </p>
      </div>
    </Section>
  );
}
