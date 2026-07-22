import type { Metadata } from "next";
import { navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reviews } from "@/components/site/reviews";
import { CtaBand } from "@/components/site/cta-band";
import { WelcomeVideo } from "@/components/site/welcome-video";
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
  isWelcomeVideoReady,
  WELCOME_VIDEO_POSTER,
  WELCOME_VIDEO_SRC,
} from "@/lib/welcome-video";

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
  const welcomeLabels = await getWelcomeVideoLabels();
  const welcomeSrc = isWelcomeVideoReady() ? WELCOME_VIDEO_SRC : null;
  const indirizzoLine = [indirizzo.via, `${indirizzo.cap} ${indirizzo.citta}`.trim()]
    .filter(Boolean)
    .join(", ");
  const mapLink = indirizzoLine
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzoLine)}`
    : "/contatti";

  return (
    <>
      <PageHero
        eyebrow={await t("chi_siamo", "hero_eyebrow", "Chi sono")}
        title={await t("chi_siamo", "hero_title")}
        subtitle={await t("chi_siamo", "hero_subtitle")}
      />

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-primary/10 shadow-sm md:mx-0 md:aspect-square md:max-w-md">
            <Image
              src="/images/lorenzo-ritratto.png"
              alt={await t(
                "chi_siamo",
                "ritratto_alt",
                "Geom. Lorenzo Armellin",
              )}
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover object-[center_18%]"
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
        />
      </Section>

      <Section tone="sand">
        <SectionHeading title={await t("chi_siamo", "credenziali_title")} />
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:mt-10 sm:grid-cols-3">
          {credenziali.map((c, i) => {
            const Icon = credenzialiIcons[i] ?? IconAlbo;
            return (
              <Card key={c.voce} className="text-center">
                <Icon className="mx-auto h-8 w-8 text-accent" />
                <h3 className="mt-3 text-base">{c.voce}</h3>
                <p className="mt-1 text-sm text-text-muted">{c.dettaglio}</p>
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
