import type { Metadata } from "next";
import Link from "next/link";
import { getRequestLocale, t, tCta, tList } from "@/lib/locale";
import Image from "next/image";
import {
  ArrowRight,
  House,
  ShieldCheck,
  HeartHandshake,
  Check,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrustBar } from "@/components/site/trust-bar";
import { PackageCards } from "@/components/site/package-cards";
import { Reviews } from "@/components/site/reviews";
import { CtaBand } from "@/components/site/cta-band";
import { WelcomeVideo } from "@/components/site/welcome-video";
import { WelcomeVideoJsonLd } from "@/components/site/welcome-video-jsonld";
import { HeroLoopVideo } from "@/components/site/hero-loop-video";
import { getWelcomeVideoLabels } from "@/lib/welcome-video-labels";
import {
  getWelcomeCaptionTracks,
  isWelcomeVideoReady,
  WELCOME_VIDEO_POSTER,
  WELCOME_VIDEO_SRC,
} from "@/lib/welcome-video";
import {
  HERO_LOOP_MOBILE_POSTER,
  HERO_LOOP_MOBILE_SRC,
  HERO_LOOP_POSTER,
  HERO_LOOP_SRC,
} from "@/lib/hero-loop";
import { siteBaseUrl } from "@/lib/seo-locale";

import { cn } from "@/lib/utils";

type HomeStep = {
  titolo: string;
  testo: string;
  immagine?: { src: string; alt: string };
};

const vantaggiIcons = [House, ShieldCheck, HeartHandshake];

/** absolute: meta_title include già il brand — evita doppio template. */
export async function generateMetadata(): Promise<Metadata> {
  const title = await t(
    "home",
    "meta_title",
    "Successioni Online | Geom. Lorenzo Armellin",
  );
  return { title: { absolute: title } };
}

export default async function HomePage() {
  const heroCtaPrimary = await tCta("home", "hero_cta_primary");
  const heroCtaSecondary = await tCta("home", "hero_cta_secondary");
  const vantaggi = await tList<{ titolo: string; testo: string }>(
    "home",
    "problema_vantaggi",
  );
  const steps = await tList<HomeStep>("home", "come_funziona_steps");
  const confronto = await tList<{ voce: string; faidate: string; noi: string }>(
    "home",
    "faidate_confronto",
  );
  const tariffeCta = await tCta("home", "tariffe_cta");
  const chisonoCta = await tCta("home", "chisono_cta");
  const faqCta = await tCta("home", "faq_cta");
  const finalButton = await tCta("home", "cta_finale_button");
  const finalPhone = await tCta("home", "cta_finale_phone");
  const locale = await getRequestLocale();
  const welcomeLabels = await getWelcomeVideoLabels();
  const welcomeReady = isWelcomeVideoReady();
  const welcomeSrc = welcomeReady ? WELCOME_VIDEO_SRC : null;
  const welcomeCaptions = welcomeReady ? getWelcomeCaptionTracks(locale) : [];

  return (
    <>
      {welcomeReady ? (
        <WelcomeVideoJsonLd
          name={welcomeLabels.title}
          description={welcomeLabels.caption}
          siteUrl={siteBaseUrl()}
        />
      ) : null}
      {/* Hero: loop muted — desktop 1920×600, mobile 9:16 dedicato. */}
      <section className="relative flex min-h-[380px] items-center overflow-hidden bg-primary text-white sm:min-h-[420px] lg:min-h-[520px]">
        <HeroLoopVideo
          src={HERO_LOOP_SRC}
          poster={HERO_LOOP_POSTER}
          mobileSrc={HERO_LOOP_MOBILE_SRC}
          mobilePoster={HERO_LOOP_MOBILE_POSTER}
          objectPosition="center center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 via-42% to-primary/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <Container className="relative py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              {await t("home", "hero_specialization_badge")}
            </p>
            <h1 className="mt-4 font-display text-3xl text-white drop-shadow-sm sm:mt-5 sm:text-5xl lg:text-6xl">
              {await t("home", "hero_title")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg">
              {await t("home", "hero_subtitle")}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <ButtonLink href={heroCtaPrimary.href} variant="primary" size="lg">
                {heroCtaPrimary.label}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </ButtonLink>
              <ButtonLink
                href={heroCtaSecondary.href}
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10"
              >
                {heroCtaSecondary.label}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <TrustBar />

      {/* Cos'e' l'app: sezione richiesta dalla verifica branding OAuth di
          Google (la home deve spiegare in modo esplicito e ben visibile scopo
          dell'applicazione, uso dei dati Google e link alla privacy). */}
      <Section className="!py-8 sm:!py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl">
            {await t("home", "app_scopo_title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
            {await t("home", "app_scopo_body")}
          </p>
          <p className="mt-3 text-sm text-text-muted">
            {await t("home", "app_scopo_legal_prefix")}{" "}
            <Link
              href="/privacy"
              className="font-medium text-accent underline hover:text-accent-dark"
            >
              {await t("home", "app_scopo_privacy_label")}
            </Link>
            {" · "}
            <Link
              href="/termini-condizioni"
              className="font-medium text-accent underline hover:text-accent-dark"
            >
              {await t("home", "app_scopo_terms_label")}
            </Link>
          </p>
        </div>
      </Section>

      {/* Problema / Soluzione — tone muted per staccare dallo scopo app (bianco) */}
      <Section tone="muted">
        <SectionHeading
          title={await t("home", "problema_title")}
          intro={await t("home", "problema_intro")}
        />
        {/* Mobile compatto: card orizzontali (icona a sinistra); da md layout
            verticale centrato a 3 colonne. */}
        <div className="mt-6 grid gap-3 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {vantaggi.map((v, i) => {
            const Icon = vantaggiIcons[i % vantaggiIcons.length];
            return (
              <Card
                key={v.titolo}
                className="flex items-start gap-3.5 p-4 text-left sm:p-6 md:block md:text-center"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-accent md:mx-auto md:h-12 md:w-12">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg leading-snug md:mt-4 md:text-xl">
                    {v.titolo}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted md:mt-2">
                    {v.testo}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Come funziona — sequenza collegata + foto data-driven. */}
      <Section id="come-funziona" tone="sand">
        <SectionHeading
          eyebrow={await t("home", "come_funziona_eyebrow", "Semplice")}
          title={await t("home", "come_funziona_title")}
        />
        <ol className="relative mx-auto mt-6 grid max-w-5xl gap-7 sm:mt-12 sm:gap-10 md:grid-cols-3 md:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute top-5 right-[16.5%] left-[16.5%] hidden h-px bg-gradient-to-r from-primary/20 via-accent/50 to-primary/20 md:block"
          />
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li key={step.titolo} className="relative md:px-6 lg:px-8">
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-12 bottom-[-1.75rem] left-5 w-px bg-gradient-to-b from-accent/40 to-primary/15 md:hidden"
                  />
                )}
                <div className="flex items-start gap-4 md:flex-col">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-sm font-bold text-primary ring-2 ring-accent">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5 md:pt-0">
                    {step.immagine?.src ? (
                      <div className="relative mt-1 aspect-[4/3] overflow-hidden rounded-xl md:mt-5">
                        <Image
                          src={step.immagine.src}
                          alt={step.immagine.alt}
                          fill
                          sizes="(max-width: 768px) 80vw, 280px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <h3 className="mt-3 text-lg leading-snug sm:mt-4 sm:text-xl">
                      {step.titolo}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted sm:mt-2">
                      {step.testo}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-center text-sm text-text-muted sm:mt-10">
          {await t("home", "come_funziona_sla_note")}
        </p>
      </Section>

      {/* Tariffe (estratto) */}
      <Section>
        <SectionHeading
          eyebrow={await t("home", "tariffe_eyebrow", "Tariffe")}
          title={await t("home", "tariffe_title")}
          intro={await t("home", "tariffe_intro")}
        />
        <div className="mt-6 sm:mt-12">
          <PackageCards />
        </div>
        <div className="mt-6 text-center sm:mt-10">
          <ButtonLink href={tariffeCta.href} variant="outline" size="lg">
            {tariffeCta.label}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </ButtonLink>
        </div>
      </Section>

      {/* Fai da te */}
      <Section tone="muted">
        <SectionHeading
          title={await t("home", "faidate_title")}
          intro={await t("home", "faidate_intro")}
        />
        <div className="mx-auto mt-6 max-w-4xl sm:mt-12">
          <div className="relative grid grid-cols-[1.2fr_1fr_1fr] overflow-hidden rounded-2xl border border-primary/10 bg-bg shadow-md sm:grid-cols-[1.5fr_1fr_1fr]">
            {/* Intestazioni: solo etichette colonna, senza X/logo (i segni restano nelle righe) */}
            <div className="flex items-end border-b border-primary/10 bg-bg-muted/40 p-4 sm:p-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/80">
                {await t("home", "faidate_col_corner", "Confronto")}
              </span>
            </div>
            <div className="flex items-end justify-center border-b border-primary/10 bg-bg-muted/40 p-4 sm:p-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                {await t("home", "faidate_col_diy", "Fai-da-te")}
              </span>
            </div>
            <div className="relative flex items-end justify-center border-b border-accent/20 bg-sand p-4 sm:p-5">
              <span className="absolute -top-px left-0 right-0 h-1 bg-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                {await t("home", "faidate_col_us", "Con noi")}
              </span>
            </div>

            {/* Righe (zebra: sfondo alternato per leggibilita) */}
            {confronto.map((row, i) => (
              <div key={row.voce} className="contents">
                <div
                  className={cn(
                    "flex items-center border-t border-primary/[0.06] p-3 text-sm font-medium text-primary sm:p-5",
                    i % 2 === 1 && "bg-primary/[0.025]",
                  )}
                >
                  {row.voce}
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center gap-1.5 border-t border-primary/[0.06] p-3 text-center text-sm text-text-muted sm:gap-2 sm:p-5",
                    i % 2 === 1 && "bg-primary/[0.025]",
                  )}
                >
                  <X className="h-4 w-4 shrink-0 text-error/70" />
                  <span>{row.faidate}</span>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center gap-1.5 border-t border-accent/15 bg-sand p-3 text-center text-sm font-semibold text-primary sm:gap-2 sm:p-5",
                    i % 2 === 1 && "brightness-[0.985]",
                  )}
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{row.noi}</span>
                </div>
              </div>
            ))}

            {/* Chiusura: CTA a tutta larghezza sotto il confronto */}
            <div className="col-span-3 border-t border-primary/10 bg-bg-muted/60 p-5 text-center">
              <ButtonLink href={heroCtaPrimary.href} variant="primary">
                {heroCtaPrimary.label}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Video di benvenuto — subito dopo il confronto: è qui che nasce il
          dubbio "mi fido a pagare?", il volto che parla chiude il cerchio. */}
      <Section>
        <WelcomeVideo
          labels={welcomeLabels}
          poster={WELCOME_VIDEO_POSTER}
          src={welcomeSrc}
          captions={welcomeCaptions}
        />
      </Section>

      {/* Recensioni */}
      <Section tone="muted">
        <SectionHeading
          title={await t("home", "recensioni_title")}
          intro={await t("home", "recensioni_intro")}
        />
        <div className="mt-6 sm:mt-12">
          <Reviews />
        </div>
      </Section>

      {/* Chi sono (estratto) */}
      <Section tone="sand">
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-primary/10 shadow-sm">
            <Image
              src="/images/lorenzo-ritratto.jpg"
              alt="Geom. Lorenzo Armellin"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-4xl">
              {await t("home", "chisono_title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-muted sm:mt-4 sm:text-lg">
              {await t("home", "chisono_estratto")}
            </p>
            <div className="mt-5 sm:mt-8">
              <ButtonLink href={chisonoCta.href} variant="secondary">
                {chisonoCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ (estratto) */}
      <Section tone="muted">
        <SectionHeading title={await t("home", "faq_title")} />
        <div className="mt-8 text-center">
          <Link
            href={faqCta.href}
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-dark"
          >
            {faqCta.label}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </Section>

      <CtaBand
        title={await t("home", "cta_finale_title")}
        subtitle={await t("home", "cta_finale_subtitle")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
