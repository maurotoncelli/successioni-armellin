import type { Metadata } from "next";
import { getRequestLocale, navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
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
              {await t("chi_siamo", "team_body")}
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              {await t("chi_siamo", "perche_geometra_body")}
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

      <Section tone="sand">
        <SectionHeading title={await t("chi_siamo", "credenziali_title")} />
        {/* Mobile compatto: righe orizzontali icona+testo; da sm card verticali. */}
        <div className="mx-auto mt-6 grid max-w-3xl gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          {credenziali.map((c, i) => {
            const Icon = credenzialiIcons[i] ?? IconAlbo;
            return (
              <Card
                key={c.voce}
                className="flex items-center gap-3 p-3.5 text-left sm:block sm:p-6 sm:text-center"
              >
                <Icon className="h-6 w-6 shrink-0 text-accent sm:mx-auto sm:h-8 sm:w-8" />
                <div className="min-w-0">
                  <h3 className="text-sm leading-snug sm:mt-3 sm:text-base">
                    {c.voce}
                  </h3>
                  <p className="mt-0.5 text-xs text-text-muted sm:mt-1 sm:text-sm">
                    {c.dettaglio}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative min-h-56 overflow-hidden rounded-2xl md:min-h-[20rem]">
            <Image
              src="/images/pontedera-studio.jpg"
              alt={await t(
                "chi_siamo",
                "studio_foto_alt",
                "Duomo di Pontedera",
              )}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[center_30%]"
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
