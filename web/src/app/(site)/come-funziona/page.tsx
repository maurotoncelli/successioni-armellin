import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { getRequestLocale, navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { SectionViewTracker } from "@/components/analytics/section-view-tracker";
import { getFaqs, getPackages, type Faq } from "@/lib/cms";
import { faqCategoryIntroKey } from "@/lib/faq-featured";
import { WelcomeVideo } from "@/components/site/welcome-video";
import { WelcomeVideoJsonLd } from "@/components/site/welcome-video-jsonld";
import { getComeFunzionaVideoLabels } from "@/lib/come-funziona-video-labels";
import {
  COME_FUNZIONA_VIDEO_DURATION_ISO,
  COME_FUNZIONA_VIDEO_POSTER,
  COME_FUNZIONA_VIDEO_SRC,
  getComeFunzionaCaptionTracks,
  getComeFunzionaVideoSrc,
  getComeFunzionaVideoSrcMobile,
  isComeFunzionaVideoReady,
} from "@/lib/come-funziona-video";
import { siteBaseUrl } from "@/lib/seo-locale";
import {
  IconCheck,
  IconExternal,
  IconQuiz,
  IconSendPractice,
  IconStudio,
  IconUploadDocs,
} from "@/components/site/come-funziona-icons";
import { ComeFunzionaPanels } from "@/components/site/come-funziona-panels";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await navPageTitle("/come-funziona", "Come funziona"),
    description: await t("come_funziona", "hero_subtitle"),
  };
}

type Step = { numero: number; titolo: string; testo: string; dettaglio: string };
type Address = { via: string; cap: string; citta: string };
type OpeningHour = { giorni: string; orario: string };

const stepIcons = [IconQuiz, IconUploadDocs, IconSendPractice] as const;

/**
 * Mini FAQ di pagina: una domanda per ciascuna area utile a chi sta capendo
 * il processo (come funziona / costi / dopo il servizio). Fallback: prime 3.
 */
function pickProcessFaqs(faqs: Faq[]): Faq[] {
  const wanted = ["cat_come_intro", "cat_costi_intro", "cat_dopo_intro"];
  const picked: Faq[] = [];
  for (const key of wanted) {
    const f = faqs.find(
      (x) => faqCategoryIntroKey(x.category) === key && !picked.includes(x),
    );
    if (f) picked.push(f);
  }
  if (picked.length < 3) {
    for (const f of faqs) {
      if (picked.length >= 3) break;
      if (!picked.includes(f)) picked.push(f);
    }
  }
  return picked;
}

/** Stesse foto della home (passo 3 = nuovo ritratto Lorenzo). */
const stepImages = [
  {
    src: "/images/come-funziona-step-1-quiz.jpg",
    alt: "Persona al computer che risponde alle domande del preventivo online",
  },
  {
    src: "/images/come-funziona-step-2-documenti.jpg",
    alt: "Persona che fotografa un documento con lo smartphone",
  },
  {
    src: "/images/come-funziona-step-3-lorenzo.jpg",
    alt: "Geom. Lorenzo Armellin al computer mentre predispone la pratica",
  },
] as const;

export default async function ComeFunzionaPage() {
  const steps = await tList<Step>("come_funziona", "steps");
  const deliverable = await tList<string>("come_funziona", "deliverable_list");
  const finalButton = await tCta("come_funziona", "cta_button");
  const finalPhone = await tCta("come_funziona", "cta_phone");
  const address = await tObj<Address>("settings", "address", {
    via: "",
    cap: "",
    citta: "",
  });
  const hours = await tList<OpeningHour>("settings", "opening_hours");
  const indirizzo = [address.via, `${address.cap} ${address.citta}`.trim()]
    .filter(Boolean)
    .join(", ");
  const mapLink = indirizzo
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzo)}`
    : "/contatti";
  const locale = await getRequestLocale();
  const processVideoLabels = await getComeFunzionaVideoLabels();
  const processVideoSrc = getComeFunzionaVideoSrc();
  const processVideoSrcMobile = getComeFunzionaVideoSrcMobile();
  const processVideoCaptions = getComeFunzionaCaptionTracks(locale);
  const processVideoReady = isComeFunzionaVideoReady();

  // Anti-rimbalzo (07/09): CTA nell'hero e dopo i passi, fascia prezzi, mini FAQ.
  const packages = await getPackages(locale);
  const minPrice = packages.length
    ? Math.min(...packages.map((p) => p.price))
    : 290;
  const priceSuffix = await t("pacchetti", "price_suffix", "onorario senza IVA");
  const heroCtaLabel = await t("come_funziona", "hero_cta_label", finalButton.label);
  const heroCtaHint = await t("come_funziona", "hero_cta_hint");
  const heroVideoLabel = await t("come_funziona", "hero_video_label");
  const heroTrust = (await tList<string>("come_funziona", "hero_trust_items")).map(
    (item) => item.replace("{price}", String(minPrice)),
  );
  const stepsCtaTitle = await t("come_funziona", "steps_cta_title");
  const stepsCtaLabel = await t("come_funziona", "steps_cta_label", finalButton.label);
  const stepsCtaHint = await t("come_funziona", "steps_cta_hint");
  const pricesEyebrow = await t("come_funziona", "prices_eyebrow");
  const pricesTitle = await t("come_funziona", "prices_title");
  const pricesIntro = await t("come_funziona", "prices_intro");
  const pricesCustomName = await t("come_funziona", "prices_custom_name", "Su misura");
  const pricesCustomBody = await t("come_funziona", "prices_custom_body");
  const pricesExtraHint = await t("come_funziona", "prices_extra_hint");
  const pricesLink = await tCta("come_funziona", "prices_link", {
    label: "Confronta i pacchetti nel dettaglio",
    href: "/tariffe",
  });
  const faqTitle = await t("come_funziona", "faq_title");
  const faqLink = await tCta("come_funziona", "faq_link", {
    label: "Tutte le domande frequenti",
    href: "/faq",
  });
  const processFaqs = pickProcessFaqs(await getFaqs(locale));
  const previewHref = finalButton.href || "/preventivo";

  return (
    <>
      <SectionViewTracker page="/come-funziona" />
      {processVideoReady ? (
        <WelcomeVideoJsonLd
          name={processVideoLabels.title}
          description={processVideoLabels.caption}
          siteUrl={siteBaseUrl()}
          contentPath={COME_FUNZIONA_VIDEO_SRC}
          posterPath={COME_FUNZIONA_VIDEO_POSTER}
          duration={COME_FUNZIONA_VIDEO_DURATION_ISO}
          uploadDate="2026-08-25T12:00:00+02:00"
        />
      ) : null}
      <PageHero
        eyebrow={await t("come_funziona", "hero_eyebrow", "Il processo")}
        title={await t("come_funziona", "hero_title")}
        subtitle={await t("come_funziona", "hero_subtitle")}
      >
        {/* CTA subito visibile: prima era solo in fondo alla pagina. */}
        <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-5">
          <div>
            <ButtonLink
              href={previewHref}
              size="lg"
              cta="come_funziona_hero_preventivo"
              className="w-full sm:w-auto"
            >
              {heroCtaLabel}
            </ButtonLink>
            {heroCtaHint ? (
              <p className="mt-1.5 text-center text-xs text-white/65 sm:text-left">
                {heroCtaHint}
              </p>
            ) : null}
          </div>
          {processVideoReady && heroVideoLabel ? (
            <a
              href="#video"
              data-cta="come_funziona_hero_video"
              className="inline-flex items-center justify-center gap-2.5 self-start text-sm font-semibold text-white/90 transition-colors hover:text-white sm:self-auto sm:pb-5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10">
                <Play className="h-4 w-4 translate-x-px fill-current" />
              </span>
              {heroVideoLabel}
            </a>
          ) : null}
        </div>
        {heroTrust.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
            {heroTrust.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <IconCheck className="h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      {/* Su mobile il video (asset piu forte) viene prima dei 3 passi; da md
          torna dopo, come "picco visivo" della sequenza. */}
      <div className="flex flex-col">
      {/* Sequenza: nodi numerati + foto. */}
      <Section className="order-2 md:order-1">
        <ol
          data-track-section="steps"
          className="relative mx-auto grid max-w-5xl gap-7 sm:gap-10 md:grid-cols-3 md:gap-0"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-5 right-[16.5%] left-[16.5%] hidden h-px bg-gradient-to-r from-primary/20 via-accent/50 to-primary/20 md:block"
          />
          {steps.map((step, i) => {
            const Icon = stepIcons[i] ?? IconQuiz;
            const isLast = i === steps.length - 1;
            const img = stepImages[i];
            return (
              <li key={step.numero} className="relative md:px-6 lg:px-8">
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-12 bottom-[-1.75rem] left-5 w-px bg-gradient-to-b from-accent/40 to-primary/15 md:hidden"
                  />
                )}
                <div className="flex items-start gap-4 md:flex-col">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg text-sm font-bold text-primary ring-2 ring-accent">
                    {step.numero}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5 md:pt-0">
                    {img ? (
                      i === 0 ? (
                        <Link
                          href={previewHref}
                          data-cta="come_funziona_step1_image"
                          aria-label={step.titolo}
                          className="group relative mt-1 block aspect-[4/3] overflow-hidden rounded-xl md:mt-4"
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 768px) 80vw, 280px"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </Link>
                      ) : (
                        <div className="relative mt-1 aspect-[4/3] overflow-hidden rounded-xl md:mt-4">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 768px) 80vw, 280px"
                            className="object-cover"
                          />
                        </div>
                      )
                    ) : (
                      <Icon className="h-9 w-9 text-primary" />
                    )}
                    <h3 className="mt-3 text-lg leading-snug sm:mt-4 sm:text-xl">
                      {i === 0 ? (
                        <Link
                          href={previewHref}
                          data-cta="come_funziona_step1_title"
                          className="inline-flex items-center gap-1.5 hover:text-accent-dark"
                        >
                          {step.titolo}
                          <ArrowRight className="h-4 w-4 text-accent" />
                        </Link>
                      ) : (
                        step.titolo
                      )}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted sm:mt-2">
                      {step.testo}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent sm:mt-3">
                      {step.dettaglio}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* "Ho capito, e adesso?": CTA subito dopo i passi. */}
        <div
          data-track-section="steps_cta"
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-accent/30 bg-sand p-6 text-center sm:mt-14 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl">{stepsCtaTitle}</h2>
          {stepsCtaHint ? (
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
              {stepsCtaHint}
            </p>
          ) : null}
          <div className="mt-5">
            <ButtonLink
              href={previewHref}
              size="lg"
              cta="come_funziona_steps_preventivo"
              className="w-full sm:w-auto"
            >
              {stepsCtaLabel}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Picco visivo: video processo, dopo i 3 passi illustrati (da md).
          Master 1080p + 720p mobile; fallback benvenuto se manca il file. */}
      <Section id="video" tone="muted" className="order-1 scroll-mt-24 md:order-2">
        <div data-track-section="video">
          <WelcomeVideo
            labels={processVideoLabels}
            poster={COME_FUNZIONA_VIDEO_POSTER}
            src={processVideoSrc}
            srcMobile={processVideoSrcMobile}
            captions={processVideoCaptions}
            captionsSelectId="come-funziona-captions-lang"
            trackingTitle="come_funziona"
          />
        </div>
      </Section>
      </div>

      {/* Fascia prezzi: la seconda domanda di chi legge "come funziona". */}
      <Section>
        <SectionHeading
          eyebrow={pricesEyebrow}
          title={pricesTitle}
          intro={pricesIntro}
        />
        <div
          data-track-section="prices"
          className="mx-auto mt-8 grid max-w-4xl gap-4 sm:mt-10 sm:grid-cols-3"
        >
          {packages.map((pkg) => (
            <Link
              key={pkg.key}
              href={pricesLink.href}
              data-cta={`come_funziona_price_${pkg.key.toLowerCase()}`}
              className="group flex flex-col rounded-2xl border border-primary/10 bg-bg p-5 shadow-sm transition-colors hover:border-accent/50 sm:p-6"
            >
              <p className="text-sm font-semibold text-primary">{pkg.name}</p>
              <p className="mt-2 font-display text-3xl font-bold text-primary sm:text-4xl">
                {pkg.price}&euro;
              </p>
              <p className="mt-1 text-xs text-text-muted">{priceSuffix}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {pkg.tagline}
              </p>
              {pkg.extraPropertyFee && pricesExtraHint ? (
                <p className="mt-2 text-xs font-medium text-accent-dark">
                  {pricesExtraHint.replace("{fee}", String(pkg.extraPropertyFee))}
                </p>
              ) : null}
            </Link>
          ))}
          <Link
            href={pricesLink.href}
            data-cta="come_funziona_price_custom"
            className="group flex flex-col rounded-2xl border border-dashed border-primary/20 bg-bg-muted p-5 transition-colors hover:border-accent/50 sm:p-6"
          >
            <p className="text-sm font-semibold text-primary">{pricesCustomName}</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary/70 sm:text-4xl">
              &hellip;
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {pricesCustomBody}
            </p>
          </Link>
        </div>
        <p className="mt-6 text-center sm:mt-8">
          <Link
            href={pricesLink.href}
            data-cta="come_funziona_prices_link"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
          >
            {pricesLink.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </Section>

      {/* Pannelli: su mobile accordion (testo al tap), da md card a 3 colonne. */}
      <Section tone="sand">
        <div data-track-section="panels" />
        <ComeFunzionaPanels
          items={[
            {
              titolo: await t("come_funziona", "sla_title"),
              testo: await t("come_funziona", "sla_body"),
            },
            {
              titolo: await t("come_funziona", "valore_title"),
              testo: await t("come_funziona", "valore_body"),
            },
            {
              titolo: await t("come_funziona", "distanza_title", "Tutto online"),
              testo: await t("come_funziona", "distanza_body"),
            },
          ]}
        />

        <div className="mt-3 overflow-hidden rounded-2xl border border-primary/10 bg-bg shadow-sm sm:mt-4 md:mt-5">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-44 sm:min-h-56 md:min-h-full">
              <Image
                src="/images/studio-pontedera-via-veneto.jpg"
                alt="Via Vittorio Veneto, Pontedera"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-8">
              <IconStudio className="h-9 w-9 text-accent" />
              <h3 className="mt-3 text-xl sm:mt-4 sm:text-2xl">
                {await t("come_funziona", "visita_title")}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                {await t("come_funziona", "visita_body")}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {indirizzo && (
                    <p className="text-sm font-semibold text-primary">
                      {indirizzo}
                    </p>
                  )}
                  {hours.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-sm text-text-muted">
                      {hours.map((h) => (
                        <li key={h.giorni}>
                          <span className="font-medium text-text">
                            {h.giorni}:
                          </span>{" "}
                          {h.orario}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <a
                  href={mapLink}
                  target={indirizzo ? "_blank" : undefined}
                  rel={indirizzo ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
                >
                  {await t(
                    "come_funziona",
                    "visita_maps_label",
                    "Apri in Google Maps",
                  )}
                  <IconExternal className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title={await t("come_funziona", "deliverable_title")} />
        <ul
          data-track-section="deliverable"
          className="mx-auto mt-6 grid w-fit max-w-2xl gap-3.5 sm:mt-8"
        >
          {deliverable.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span className="text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {processFaqs.length > 0 ? (
        <Section tone="muted">
          <div data-track-section="faq" className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-2xl text-secondary sm:text-3xl">
              {faqTitle}
            </h2>
            <div className="mt-6 sm:mt-8">
              <FaqAccordion items={processFaqs} />
            </div>
            <p className="mt-5 text-center">
              <Link
                href={faqLink.href}
                data-cta="come_funziona_faq_link"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
              >
                {faqLink.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </Section>
      ) : null}

      <div data-track-section="cta_final">
        <CtaBand
          title={await t("come_funziona", "cta_title")}
          button={finalButton}
          phone={finalPhone}
        />
      </div>
    </>
  );
}
