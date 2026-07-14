import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Phone, CreditCard, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { documentsList } from "@/content/site";
import { BackLink } from "@/components/site/back-link";
import { DocList } from "@/components/site/doc-list";
import { SoftLead, type SoftLeadAnswers } from "@/components/site/soft-lead";
import { getPackages, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import { isPackageKey, type Esito } from "@/lib/quote";
import { cta, obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Il tuo risultato",
  robots: { index: false },
};

function resolveEsito(value?: string): Esito {
  if (value === "a" || value === "c") return value;
  return "b";
}

export default async function GraziePage({
  searchParams,
}: {
  searchParams: Promise<{
    esito?: string;
    pkg?: string;
    recount?: string;
    rel?: string;
    heirs?: string;
    hasre?: string;
    will?: string;
    other?: string;
    k100?: string;
  }>;
}) {
  const sp = await searchParams;
  const esito = resolveEsito(sp.esito);

  const recount = sp.recount ? Number.parseInt(sp.recount, 10) : null;
  const answers: SoftLeadAnswers = {
    relation: sp.rel ?? "",
    heirs: sp.heirs ?? "",
    hasRealEstate: sp.hasre ?? "",
    realEstateCount: Number.isFinite(recount) ? recount : null,
    hasWill: sp.will ?? "no",
    hasOther: sp.other ?? "no",
    over100k: sp.k100,
  };

  // Telefono / WhatsApp reali (data-driven).
  const tel = obj("contatti", "telefono", {
    cta_chiama: "tel:+393201570567",
    cta_whatsapp: "https://wa.me/393201570567",
  });

  // Esito B: mostriamo SUBITO il pacchetto consigliato (nome + prezzo) senza
  // chiedere nulla. Il prezzo e calcolato dalle risposte (pacchetto + immobili).
  let suggestedPkg:
    | { name: string; price: number; tagline: string | null; total: number }
    | null = null;
  let checkoutHref = "/checkout";
  if (esito === "b") {
    const packageKey = isPackageKey(sp.pkg) ? sp.pkg : "COMPLETO";
    const [packages, addons] = await Promise.all([getPackages(), getAddons()]);
    const pkg = packages.find((p) => p.key === packageKey);
    const order = buildOrder(
      { packageKey, realEstateCount: answers.realEstateCount },
      packages,
      addons,
    );
    if (pkg && order) {
      suggestedPkg = {
        name: pkg.name,
        price: pkg.price,
        tagline: pkg.tagline,
        total: order.total,
      };
    }
    const params = new URLSearchParams({ pkg: packageKey });
    if (answers.realEstateCount)
      params.set("recount", String(answers.realEstateCount));
    if (answers.relation) params.set("rel", answers.relation);
    if (answers.heirs) params.set("heirs", answers.heirs);
    if (answers.hasRealEstate) params.set("hasre", answers.hasRealEstate);
    params.set("will", answers.hasWill);
    params.set("other", answers.hasOther);
    checkoutHref = `/checkout?${params.toString()}`;
  }

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
            {text("grazie", "header_title", "Ecco il risultato per il tuo caso")}
          </h1>
        </div>

        <Card className="mt-10">
          {esito === "b" && (
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand">
                <CreditCard className="h-7 w-7 text-accent" />
              </span>
              <div className="w-full">
                <h2 className="text-xl">{text("grazie", "esito_b_title")}</h2>
                {suggestedPkg && (
                  <div className="mt-3 rounded-[10px] border border-accent/30 bg-sand/50 p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-primary">
                        Pacchetto {suggestedPkg.name}
                      </span>
                      <span className="shrink-0 font-display text-xl font-bold text-accent">
                        {suggestedPkg.total}&euro;
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
                  {renderBody(text("grazie", "esito_b_riallineamento"))}
                </p>
                <div className="mt-5">
                  <ButtonLink href={checkoutHref} variant="primary">
                    {cta("grazie", "esito_b_cta").label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}

          {esito === "a" && (
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand">
                <Phone className="h-7 w-7 text-accent" />
              </span>
              <div>
                <h2 className="text-xl">{text("grazie", "esito_a_title")}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">
                  {text("grazie", "esito_a_body")}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={tel.cta_chiama} variant="primary">
                    {cta("grazie", "esito_a_cta").label}
                  </ButtonLink>
                  <ButtonLink href={tel.cta_whatsapp} variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}

          {esito === "c" && (
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand">
                <Phone className="h-7 w-7 text-accent" />
              </span>
              <div className="w-full">
                <h2 className="text-xl">{text("grazie", "esito_c_title")}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">
                  {text("grazie", "esito_c_body")}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={tel.cta_whatsapp} variant="primary">
                    <MessageCircle className="h-4 w-4" />
                    {text("grazie", "esito_c_whatsapp", "Scrivi su WhatsApp")}
                  </ButtonLink>
                  <ButtonLink href={tel.cta_chiama} variant="outline">
                    <Phone className="h-4 w-4" />
                    {cta("grazie", "esito_c_cta").label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Cattura contatto OPZIONALE, sempre dopo il valore mostrato. */}
        <div className="mt-6">
          {esito === "c" ? (
            <SoftLead
              kind="custom_quote"
              answers={answers}
              title={text(
                "grazie",
                "soft_custom_title",
                "Richiedi il preventivo su misura",
              )}
              description={text(
                "grazie",
                "soft_custom_desc",
                "Lasciaci i tuoi recapiti: Lorenzo studia il tuo caso e ti manda un preventivo dedicato, senza impegno.",
              )}
              submitLabel={text(
                "grazie",
                "soft_custom_submit",
                "Richiedi il preventivo su misura",
              )}
              consensoPrivacy={text("preventivo", "consenso_privacy")}
              consensoMarketing={text("preventivo", "consenso_marketing")}
              successTitle={text(
                "grazie",
                "soft_custom_ok_title",
                "Richiesta ricevuta!",
              )}
              successBody={text(
                "grazie",
                "soft_custom_ok_body",
                "Lorenzo ti ricontatta a breve con il preventivo su misura.",
              )}
              requirePhone
            />
          ) : (
            <SoftLead
              kind="email_quote"
              answers={answers}
              title={text(
                "grazie",
                "soft_email_title",
                "Preferisci pensarci? Ricevi questo preventivo via email",
              )}
              description={text(
                "grazie",
                "soft_email_desc",
                "Ti inviamo il riepilogo del preventivo cosi lo ritrovi quando vuoi. Nessuna pressione.",
              )}
              submitLabel={text(
                "grazie",
                "soft_email_submit",
                "Inviami il preventivo via email",
              )}
              consensoPrivacy={text("preventivo", "consenso_privacy")}
              consensoMarketing={text("preventivo", "consenso_marketing")}
              successTitle={text(
                "grazie",
                "soft_email_ok_title",
                "Fatto! Controlla la casella email",
              )}
              successBody={text(
                "grazie",
                "soft_email_ok_body",
                "Ti abbiamo inviato il riepilogo del preventivo. Quando vuoi, riprendi da li.",
              )}
            />
          )}
        </div>

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
      </div>
    </Section>
  );
}
