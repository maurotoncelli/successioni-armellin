import type { Metadata } from "next";
import Image from "next/image";
import { getRequestLocale, navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
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

  return (
    <>
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
      />

      {/* Sequenza: nodi numerati + foto. */}
      <Section>
        <ol className="relative mx-auto grid max-w-5xl gap-7 sm:gap-10 md:grid-cols-3 md:gap-0">
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
                      <div className="relative mt-1 aspect-[4/3] overflow-hidden rounded-xl md:mt-4">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 768px) 80vw, 280px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Icon className="h-9 w-9 text-primary" />
                    )}
                    <h3 className="mt-3 text-lg leading-snug sm:mt-4 sm:text-xl">
                      {step.titolo}
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
      </Section>

      {/* Picco visivo: video processo, dopo i 3 passi illustrati.
          Master 1080p + 720p mobile; fallback benvenuto se manca il file. */}
      <Section id="video" tone="muted" className="scroll-mt-24">
        <WelcomeVideo
          labels={processVideoLabels}
          poster={COME_FUNZIONA_VIDEO_POSTER}
          src={processVideoSrc}
          srcMobile={processVideoSrcMobile}
          captions={processVideoCaptions}
          captionsSelectId="come-funziona-captions-lang"
        />
      </Section>

      {/* Pannelli: su mobile accordion (testo al tap), da md card a 3 colonne. */}
      <Section tone="sand">
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
        <ul className="mx-auto mt-6 grid w-fit max-w-2xl gap-3.5 sm:mt-8">
          {deliverable.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span className="text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={await t("come_funziona", "cta_title")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
