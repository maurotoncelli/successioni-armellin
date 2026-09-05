import type { Metadata } from "next";
import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import {
  CHROME_UI_IT,
  CHECKOUT_UI_IT,
  SOFT_LEAD_UI_IT,
  type CheckoutUiLabels,
  type SoftLeadUiLabels,
} from "@/lib/site-ui-labels";
import Link from "next/link";
import { CheckCircle2, Phone, CreditCard, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { documentsList, type DocItem } from "@/content/site";
import { BackLink } from "@/components/site/back-link";
import { DocList } from "@/components/site/doc-list";
import { SoftLead, type SoftLeadAnswers } from "@/components/site/soft-lead";
import { TrackQuoteComplete } from "@/components/site/track-quote-complete";
import { getPackages, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import type { QuizSnapshot } from "@/lib/quiz-summary";
import {
  computeEsito,
  decodeHeirs,
  isAllDirectLine,
  isPackageKey,
  suggestedPackage,
  totalHeirs,
  type Esito,
} from "@/lib/quote";

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await tObj("site_ui", "chrome_ui", CHROME_UI_IT);
  return {
    title: chrome.meta_result,
    robots: { index: false },
  };
}

function resolveEsito(value?: string): Esito {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "a" || v === "c") return v;
  return "b";
}

export default async function GraziePage({
  searchParams,
}: {
  searchParams: Promise<{
    esito?: string;
    pkg?: string;
    recount?: string;
    comp?: string;
    heirs?: string;
    hasre?: string;
    will?: string;
    other?: string;
    k100?: string;
  }>;
}) {
  const sp = await searchParams;

  const recount = sp.recount ? Number.parseInt(sp.recount, 10) : null;
  const composition = decodeHeirs(sp.comp);
  const answers: SoftLeadAnswers = {
    heirsComposition: composition,
    heirs: composition ? String(totalHeirs(composition)) : (sp.heirs ?? ""),
    hasRealEstate: sp.hasre ?? "",
    realEstateCount: Number.isFinite(recount) ? recount : null,
    hasWill: sp.will ?? "no",
    hasOther: sp.other ?? "no",
    over100k: sp.k100,
  };

  // Ricalcolo server-side solo se il link porta le risposte del quiz (hasre):
  // così non ci si fida della sola query (>3 immobili → C), ma i link senza
  // parametri (bookmark/vecchie email) mantengono l'esito dichiarato.
  const hasQuizAnswers = Boolean(sp.hasre);
  const esito: Esito = hasQuizAnswers
    ? computeEsito({
        hasWill: answers.hasWill,
        allDirectLine: composition ? isAllDirectLine(composition) : false,
        hasRealEstate: answers.hasRealEstate,
        realEstateCount: answers.realEstateCount,
        hasOther: answers.hasOther,
        over100k: answers.over100k,
      })
    : resolveEsito(sp.esito);

  // Telefono / WhatsApp reali (data-driven).
  const tel = await tObj("contatti", "telefono", {
    cta_chiama: "tel:+393201570567",
    cta_whatsapp: "https://wa.me/393201570567",
  });
  const softLeadUi = await tObj<SoftLeadUiLabels>(
    "site_ui",
    "soft_lead_ui",
    SOFT_LEAD_UI_IT,
  );
  const waPrefill = await t(
    "grazie",
    "esito_c_whatsapp_prefill",
    "Ciao Lorenzo, ho compilato il questionario sul sito e mi risulta un preventivo su misura. Vorrei approfondire il mio caso insieme a te.",
  );
  const waBase = String(tel.cta_whatsapp || "https://wa.me/393201570567");
  const waHref = `${waBase}${waBase.includes("?") ? "&" : "?"}text=${encodeURIComponent(waPrefill)}`;
  // Esito B: prefill neutro (domande sul preventivo, non "su misura").
  const waPrefillEsitoB = await t(
    "grazie",
    "soft_email_whatsapp_prefill",
    "Ciao Lorenzo, ho appena calcolato il preventivo sul sito e avrei qualche domanda prima di procedere.",
  );
  const waHrefEsitoB = `${waBase}${waBase.includes("?") ? "&" : "?"}text=${encodeURIComponent(waPrefillEsitoB)}`;

  // Lista documenti data-driven (stessi nomi della checklist); fallback statico.
  const docsFromContent = await tList<DocItem>("documenti", "lista");
  const docItems = docsFromContent.length > 0 ? docsFromContent : documentsList;

  // Esito B: mostriamo SUBITO il pacchetto consigliato (nome + prezzo) senza
  // chiedere nulla. Il prezzo e calcolato dalle risposte (pacchetto + immobili
  // + eredi oltre la capienza inclusa: righe SURCHARGE mostrate una per una).
  let suggestedPkg:
    | {
        name: string;
        price: number;
        tagline: string | null;
        total: number;
        surcharges: { key: string; label: string; amount: number }[];
      }
    | null = null;
  let checkoutHref = "/checkout";
  const chrome = await tObj("site_ui", "chrome_ui", CHROME_UI_IT);
  const checkoutUi = await tObj<CheckoutUiLabels>(
    "site_ui",
    "checkout_ui",
    CHECKOUT_UI_IT,
  );

  const locale = await getRequestLocale();
  const heirsCount = composition
    ? totalHeirs(composition)
    : Number.parseInt(answers.heirs || "0", 10) || null;
  // Snapshot in chiaro per il CRM (etichette IT): esito, pacchetto + cifra
  // esatta, risposte. Niente "esito a/b/c" per Lorenzo.
  const crmSnapshot: QuizSnapshot = {
    esito,
    packageKey: null,
    answers: {
      hasWill: answers.hasWill,
      heirs: composition,
      heirsTotal: heirsCount ?? 0,
      hasRealEstate: answers.hasRealEstate,
      realEstateCount: answers.realEstateCount,
      hasOther: answers.hasOther,
      over100k: answers.over100k,
    },
    locale,
  };

  if (esito === "b") {
    // Con le risposte del quiz il pacchetto si ricava da quelle; altrimenti
    // dall'URL (mai ZERO_STRESS, fuori vetrina).
    const fromUrl =
      isPackageKey(sp.pkg) && sp.pkg !== "ZERO_STRESS" ? sp.pkg : null;
    const packageKey = hasQuizAnswers
      ? (suggestedPackage(esito, answers.hasRealEstate) ?? "COMPLETO")
      : (fromUrl ?? "COMPLETO");
    const [packages, addons, packagesIt] = await Promise.all([
      getPackages(locale),
      getAddons(locale),
      locale === "it" ? null : getPackages("it"),
    ]);
    const pkg = packages.find((p) => p.key === packageKey);
    const orderIt = buildOrder(
      { packageKey, realEstateCount: answers.realEstateCount, heirsCount },
      packagesIt ?? packages,
      addons,
    );
    crmSnapshot.packageKey = packageKey;
    crmSnapshot.packageName =
      (packagesIt ?? packages).find((p) => p.key === packageKey)?.name ?? null;
    crmSnapshot.lineItems = orderIt?.lineItems.map((li) => ({
      key: li.key,
      label: li.label,
      amount: li.amount,
    }));
    crmSnapshot.total = orderIt?.total ?? null;
    const order = buildOrder(
      { packageKey, realEstateCount: answers.realEstateCount, heirsCount },
      packages,
      addons,
      {
        extraProperty: checkoutUi.extra_property,
        extraHeir: checkoutUi.extra_heir,
      },
    );
    if (pkg && order) {
      suggestedPkg = {
        name: pkg.name,
        price: pkg.price,
        tagline: pkg.tagline,
        total: order.total,
        surcharges: order.lineItems
          .filter((li) => li.type === "SURCHARGE")
          .map((li) => ({ key: li.key, label: li.label, amount: li.amount })),
      };
    }
    const params = new URLSearchParams({ pkg: packageKey });
    if (answers.realEstateCount)
      params.set("recount", String(answers.realEstateCount));
    if (sp.comp) params.set("comp", sp.comp);
    if (answers.heirs) params.set("heirs", answers.heirs);
    if (answers.hasRealEstate) params.set("hasre", answers.hasRealEstate);
    params.set("will", answers.hasWill);
    params.set("other", answers.hasOther);
    checkoutHref = `/checkout?${params.toString()}`;
  }

  const guidaCta = await tCta("grazie", "esito_b_guida", {
    label: "guida",
    href: "/tariffe#guida",
  });
  const faqLink = await tCta("grazie", "documenti_faq_link", {
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
          className="font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {guidaCta.label}
        </Link>
        {parts.slice(1).join("{guida}")}
      </>
    );
  }

  const trackFingerprint = [
    esito,
    sp.pkg ?? "",
    sp.comp ?? "",
    sp.heirs ?? "",
    sp.hasre ?? "",
    sp.will ?? "",
    sp.other ?? "",
    sp.k100 ?? "",
    sp.recount ?? "",
  ].join("|");

  return (
    <Section tone="muted">
      <TrackQuoteComplete snapshot={crmSnapshot} fingerprint={trackFingerprint} />
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <BackLink label={chrome.back} fallbackHref="/preventivo" />
        </div>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 text-3xl sm:text-4xl">
            {await t("grazie", "header_title", "Ecco il risultato per il tuo caso")}
          </h1>
        </div>

        <Card className="mt-10">
          {esito === "b" && (
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand">
                <CreditCard className="h-7 w-7 text-accent" />
              </span>
              <div className="w-full">
                <h2 className="text-xl">{await t("grazie", "esito_b_title")}</h2>
                {suggestedPkg && (
                  <div className="mt-3 rounded-[10px] border border-accent/30 bg-sand/50 p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-primary">
                        {(
                          await t(
                            "grazie",
                            "esito_b_package_line",
                            "Pacchetto {name}",
                          )
                        ).replace("{name}", suggestedPkg.name)}
                      </span>
                      <span
                        className={
                          suggestedPkg.surcharges.length > 0
                            ? "shrink-0 font-display text-lg font-semibold text-primary"
                            : "shrink-0 font-display text-xl font-bold text-accent"
                        }
                      >
                        {suggestedPkg.price}&euro;
                      </span>
                    </div>
                    {suggestedPkg.tagline && (
                      <p className="mt-1 text-sm text-text-muted">
                        {suggestedPkg.tagline}
                      </p>
                    )}
                    {/* Oltre la capienza inclusa (3 immobili / 5 eredi): ogni
                        extra e' una riga esplicita, poi il totale. Il listino
                        in vetrina resta 290 / 490 / su misura. */}
                    {suggestedPkg.surcharges.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-accent/20 pt-3 text-sm">
                        {suggestedPkg.surcharges.map((s) => (
                          <div
                            key={s.key}
                            className="flex items-baseline justify-between gap-3"
                          >
                            <span className="text-text">{s.label}</span>
                            <span className="shrink-0 font-medium text-primary">
                              +{s.amount}&euro;
                            </span>
                          </div>
                        ))}
                        <div className="flex items-baseline justify-between gap-3 border-t border-accent/20 pt-2">
                          <span className="font-semibold text-primary">
                            {checkoutUi.total_fee}
                          </span>
                          <span className="shrink-0 font-display text-xl font-bold text-accent">
                            {suggestedPkg.total}&euro;
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-text-muted">
                      {await t(
                        "grazie",
                        "esito_b_taxes_note",
                        "+ imposte calcolate sul tuo caso: te le comunichiamo prima dell'invio.",
                      )}
                    </p>
                  </div>
                )}
                <p className="mt-3 leading-relaxed text-text-muted">
                  {renderBody(await t("grazie", "esito_b_riallineamento"))}
                </p>
                <div className="mt-5">
                  <ButtonLink href={checkoutHref} variant="primary">
                    {(await tCta("grazie", "esito_b_cta")).label}
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
                <h2 className="text-xl">{await t("grazie", "esito_a_title")}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">
                  {await t("grazie", "esito_a_body")}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={tel.cta_chiama} variant="primary">
                    {(await tCta("grazie", "esito_a_cta")).label}
                  </ButtonLink>
                  <ButtonLink href={tel.cta_whatsapp} variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    {await t("grazie", "esito_a_whatsapp", "WhatsApp")}
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
                <h2 className="text-xl">{await t("grazie", "esito_c_title")}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">
                  {await t("grazie", "esito_c_body")}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={waHref} variant="primary">
                    <MessageCircle className="h-4 w-4" />
                    {await t("grazie", "esito_c_whatsapp", "Scrivi su WhatsApp")}
                  </ButtonLink>
                  <ButtonLink href={tel.cta_chiama} variant="outline">
                    <Phone className="h-4 w-4" />
                    {(await tCta("grazie", "esito_c_cta")).label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Cattura contatto OPZIONALE dopo il valore. Esito A (esonero): niente
            form email — resta solo verifica gratuita telefono/WhatsApp. */}
        {esito === "c" && (
          <div className="mt-6">
            <SoftLead
              kind="custom_quote"
              answers={answers}
              title={await t(
                "grazie",
                "soft_custom_title",
                "Lascia i recapiti: ti richiamiamo noi",
              )}
              description={await t(
                "grazie",
                "soft_custom_desc",
                "Le risposte del questionario ci bastano per partire. Lascia email e telefono: Lorenzo ti ricontatta per approfondire insieme i dettagli.",
              )}
              submitLabel={await t(
                "grazie",
                "soft_custom_submit",
                "Richiedi di essere ricontattato",
              )}
              consensoPrivacy={await t("preventivo", "consenso_privacy")}
              consensoMarketing={await t("preventivo", "consenso_marketing")}
              successTitle={await t(
                "grazie",
                "soft_custom_ok_title",
                "Richiesta ricevuta!",
              )}
              successBody={await t(
                "grazie",
                "soft_custom_ok_body",
                "Lorenzo ti ricontatta a breve per approfondire il caso e prepararti il preventivo su misura.",
              )}
              requirePhone
              showNotes
              notesLabel={await t(
                "grazie",
                "soft_custom_notes_label",
                "Nota per Lorenzo (facoltativa)",
              )}
              notesPlaceholder={await t(
                "grazie",
                "soft_custom_notes_placeholder",
                "Es. tipo di immobili, terreni, aziende/quote, urgenze o dubbi…",
              )}
              footnote={await t(
                "grazie",
                "soft_custom_footnote",
                "Nessun impegno: ti ricontattiamo entro un giorno lavorativo per studiare il caso insieme.",
              )}
              fieldLabels={softLeadUi}
            />
          </div>
        )}
        {esito === "b" && (
          <div className="mt-6">
            <SoftLead
              kind="email_quote"
              answers={answers}
              title={await t(
                "grazie",
                "soft_email_title",
                "Preferisci pensarci? Ricevi questo preventivo via email",
              )}
              description={await t(
                "grazie",
                "soft_email_desc",
                "Ti inviamo il riepilogo del preventivo cosi lo ritrovi quando vuoi. Nessuna pressione.",
              )}
              submitLabel={await t(
                "grazie",
                "soft_email_submit",
                "Inviami il preventivo via email",
              )}
              consensoPrivacy={await t("preventivo", "consenso_privacy")}
              consensoMarketing={await t("preventivo", "consenso_marketing")}
              successTitle={await t(
                "grazie",
                "soft_email_ok_title",
                "Fatto! Controlla la casella email",
              )}
              successBody={await t(
                "grazie",
                "soft_email_ok_body",
                "Ti abbiamo inviato il riepilogo del preventivo. Quando vuoi, riprendi da li.",
              )}
              successTitleNoEmail={await t(
                "grazie",
                "soft_email_ok_title_noemail",
                "Richiesta registrata!",
              )}
              successBodyNoEmail={await t(
                "grazie",
                "soft_email_ok_body_noemail",
                "Abbiamo registrato la tua richiesta: ti invieremo il riepilogo del preventivo a breve.",
              )}
              fieldLabels={softLeadUi}
            />

            {/* Chi e' indeciso spesso preferisce una voce: telefono e WhatsApp
                accanto all'invito email, stessi recapiti dell'esito C. */}
            <div className="mt-5 text-center">
              <p className="text-sm text-text-muted">
                {await t(
                  "grazie",
                  "soft_email_call_title",
                  "Sei indeciso o hai una domanda? Fai due parole con Lorenzo, senza impegno.",
                )}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <ButtonLink href={tel.cta_chiama} variant="outline">
                  <Phone className="h-4 w-4" />
                  {(await tCta("grazie", "esito_c_cta")).label}
                </ButtonLink>
                <ButtonLink href={waHrefEsitoB} variant="outline">
                  <MessageCircle className="h-4 w-4" />
                  {await t("grazie", "esito_c_whatsapp", "Scrivi su WhatsApp")}
                </ButtonLink>
              </div>
            </div>
          </div>
        )}

        {/* Esito A = forse non serve la dichiarazione: non mostrare la lista
            documenti "Intanto ecco cosa ti servira". */}
        {esito !== "a" && (
          <Card className="mt-6">
            <h2 className="text-xl">{await t("grazie", "documenti_title")}</h2>
            <DocList
              items={docItems.slice(0, 5)}
              faqLabel={faqLink.label}
              faqHref={faqLink.href}
            />
            <p className="mt-4 text-sm text-text-muted">
              {await t("grazie", "documenti_disclaimer")}
            </p>
            <p className="mt-1 text-sm font-medium text-accent">
              {await t("grazie", "documenti_hook")}
            </p>
          </Card>
        )}
      </div>
    </Section>
  );
}
