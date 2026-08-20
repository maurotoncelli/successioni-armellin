import type { Metadata } from "next";
import { getRequestLocale, navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Emph } from "@/components/site/emph";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reviews } from "@/components/site/reviews";
import { CtaBand } from "@/components/site/cta-band";
import { WelcomeVideo } from "@/components/site/welcome-video";
import { WelcomeVideoJsonLd } from "@/components/site/welcome-video-jsonld";
import {
  IconAlbo,
  IconEntratel,
  IconPiva,
} from "@/components/site/chi-sono-icons";
import {
  IconExternal,
  IconStudio,
} from "@/components/site/come-funziona-icons";
import { getWelcomeVideoLabels } from "@/lib/welcome-video-labels";
import {
  getWelcomeCaptionTracks,
  isWelcomeVideoReady,
  WELCOME_VIDEO_POSTER,
  WELCOME_VIDEO_SRC,
} from "@/lib/welcome-video";
import { siteBaseUrl } from "@/lib/seo-locale";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await navPageTitle("/chi-sono", "Chi sono"),
    description: await t("chi_siamo", "hero_subtitle"),
  };
}

type Indirizzo = { via: string; cap: string; citta: string };

const credenzialiIcons = [IconAlbo, IconEntratel, IconPiva] as const;

export default async function ChiSonoPage() {
  const credenziali = await tList<{ voce: string; dettaglio: string }>(
    "chi_siamo",
    "credenziali_list",
  );
  const indirizzo = await tObj<Indirizzo>("chi_siamo", "studio_indirizzo", {
    via: "",
    cap: "",
    citta: "",
  });
  const finalButton = await tCta("chi_siamo", "cta_finale_button");
  const finalPhone = await tCta("chi_siamo", "cta_finale_phone");
  const locale = await getRequestLocale();
  const welcomeLabels = await getWelcomeVideoLabels();
  const welcomeReady = isWelcomeVideoReady();
  const welcomeSrc = welcomeReady ? WELCOME_VIDEO_SRC : null;
  const welcomeCaptions = welcomeReady ? getWelcomeCaptionTracks(locale) : [];
  const indirizzoLine = [indirizzo.via, `${indirizzo.cap} ${indirizzo.citta}`.trim()]
    .filter(Boolean)
    .join(", ");
  const mapLink = indirizzoLine
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzoLine)}`
    : "/contatti";

  return (
    <>
      {welcomeReady ? (
        <WelcomeVideoJsonLd
          name={welcomeLabels.title}
          description={welcomeLabels.caption}
          siteUrl={siteBaseUrl()}
        />
      ) : null}
      <PageHero
        eyebrow={await t("chi_siamo", "hero_eyebrow", "Chi sono")}
        title={await t("chi_siamo", "hero_title")}
        subtitle={await t("chi_siamo", "hero_subtitle")}
      />

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-primary/10 shadow-sm md:mx-0 md:aspect-square md:max-w-md">
            <Image
              src="/images/lorenzo-ritratto.jpg"
              alt={await t(
                "chi_siamo",
                "ritratto_alt",
                "Geom. Lorenzo Armellin",
              )}
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover object-[center_25%]"
            />
          </div>
          <div className="md:py-2">
            <h2 className="text-3xl leading-snug">
              {await t("chi_siamo", "team_title")}
            </h2>
            <p className="mt-5 leading-relaxed text-text-muted">
              <Emph text={await t("chi_siamo", "team_body")} />
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              <Emph text={await t("chi_siamo", "perche_geometra_body")} />
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <WelcomeVideo
          labels={welcomeLabels}
          poster={WELCOME_VIDEO_POSTER}
          src={welcomeSrc}
          captions={welcomeCaptions}
        />
      </Section>

      {/* Banda navy: le credenziali come dichiarazione di autorevolezza
          (stesso linguaggio della trust bar in home). */}
      <Section tone="primary">
        <SectionHeading
          invert
          title={await t("chi_siamo", "credenziali_title")}
        />
        {/* Mobile compatto: righe orizzontali icona+testo; da sm card verticali. */}
        <div className="mx-auto mt-6 grid max-w-3xl gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          {credenziali.map((c, i) => {
            const Icon = credenzialiIcons[i] ?? IconAlbo;
            return (
              <div
                key={c.voce}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 text-left shadow-lg shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.11] hover:shadow-xl hover:shadow-black/35 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:block sm:p-6 sm:text-center"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 ring-1 ring-accent/40 sm:mx-auto sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm leading-snug text-white sm:mt-4 sm:text-base">
                    {c.voce}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/60 sm:mt-1 sm:text-sm">
                    {c.dettaglio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative min-h-56 overflow-hidden rounded-2xl md:min-h-[20rem]">
            <Image
              src="/images/studio-pontedera-via-veneto.jpg"
              alt={await t(
                "chi_siamo",
                "studio_foto_alt",
                "Via Vittorio Veneto, Pontedera",
              )}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div>
            <IconStudio className="h-9 w-9 text-accent" />
            <h2 className="mt-4 text-2xl sm:text-3xl">
              {await t("chi_siamo", "studio_title")}
            </h2>
            {indirizzoLine && (
              <p className="mt-3 text-sm font-semibold text-primary sm:text-base">
                {indirizzoLine}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {await t("chi_siamo", "studio_nota")}
            </p>
            <a
              href={mapLink}
              target={indirizzoLine ? "_blank" : undefined}
              rel={indirizzoLine ? "noopener noreferrer" : undefined}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
            >
              {await t(
                "chi_siamo",
                "studio_maps_label",
                "Apri in Google Maps",
              )}
              <IconExternal className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading title={await t("chi_siamo", "recensioni_title")} />
        <div className="mt-8 sm:mt-12">
          <Reviews />
        </div>
      </Section>

      <CtaBand
        title={await t("chi_siamo", "cta_finale_title")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
