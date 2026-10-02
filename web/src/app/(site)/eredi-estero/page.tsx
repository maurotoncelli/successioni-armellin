import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { getRequestLocale, tObj } from "@/lib/locale";
import { absoluteUrl } from "@/lib/seo-locale";
import { erediEsteroCopy } from "@/content/eredi-estero";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { PackageCards } from "@/components/site/package-cards";
import { PaymentTrust } from "@/components/site/payment-trust";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { SectionViewTracker } from "@/components/analytics/section-view-tracker";

const PATH = "/eredi-estero";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = erediEsteroCopy(locale);
  const it = absoluteUrl(PATH);
  const en = absoluteUrl(`/en${PATH}`);
  return {
    title: copy.meta_title,
    description: copy.meta_description,
    // Esiste solo in italiano e in inglese: le altre lingue puntano all'inglese.
    alternates: {
      canonical: locale === "it" ? it : en,
      languages: { it, en, "x-default": en },
    },
  };
}

export default async function ErediEsteroPage() {
  const locale = await getRequestLocale();
  const copy = erediEsteroCopy(locale);
  const tel = await tObj("contatti", "telefono", {
    cta_whatsapp: "https://wa.me/393201570567",
  });
  const waBase = String(tel.cta_whatsapp || "https://wa.me/393201570567");
  const waHref = `${waBase}${waBase.includes("?") ? "&" : "?"}text=${encodeURIComponent(copy.whatsapp_prefill)}`;

  return (
    <>
      <SectionViewTracker page={PATH} />
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        image={{
          src: "/images/lorenzo-lavoro-poster.jpg",
          alt: copy.hero_image_alt,
          position: "70% center",
        }}
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={waHref}
            variant="whatsapp"
            size="lg"
            className="w-full sm:w-auto"
            cta="eredi_estero_hero_whatsapp"
          >
            <MessageCircle className="h-4 w-4" />
            {copy.cta_whatsapp}
          </ButtonLink>
          <ButtonLink
            href="/preventivo"
            variant="outline"
            size="lg"
            className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto"
            cta="eredi_estero_hero_preventivo"
          >
            {copy.cta_quote}
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-white/75">{copy.hero_note}</p>
      </PageHero>

      <Section>
        <div data-track-section="help">
          <SectionHeading title={copy.help_title} intro={copy.help_intro} />
          <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {copy.help_items.map((item) => (
              <li key={item.title} className="rounded-2xl border border-primary/10 bg-bg p-5 shadow-sm sm:p-6">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <h3 className="mt-3 font-display text-lg text-primary sm:text-xl">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted sm:text-base">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="sand">
        <div data-track-section="steps">
          <SectionHeading title={copy.steps_title} />
          <ol className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
            {copy.steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl bg-bg p-5 shadow-sm sm:p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg text-primary sm:text-xl">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted sm:text-base">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <ButtonLink href={waHref} variant="whatsapp" size="lg" cta="eredi_estero_steps_whatsapp">
              <MessageCircle className="h-4 w-4" />
              {copy.cta_whatsapp}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <div data-track-section="prices">
          <SectionHeading title={copy.price_title} intro={copy.price_intro} />
          <div className="mt-6 sm:mt-10">
            <PackageCards />
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-text-muted">
            {copy.price_note}
          </p>
        </div>
      </Section>

      <PaymentTrust />

      <Section tone="muted">
        <div data-track-section="faq" className="mx-auto max-w-3xl">
          <SectionHeading title={copy.faq_title} />
          <div className="mt-6 sm:mt-10">
            <FaqAccordion items={copy.faqs.map((f) => ({ ...f, category: "" }))} />
          </div>
          <div className="mt-10">
            <h2 className="text-xl sm:text-2xl">{copy.guides_title}</h2>
            <ul className="mt-4 space-y-2">
              {copy.guides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="inline-flex items-start gap-2 font-medium text-primary underline-offset-2 hover:text-accent hover:underline"
                  >
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-accent rtl:rotate-180" />
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="primary" className="text-center">
        <div data-track-section="cta_final" className="mx-auto max-w-2xl">
          <h2 className="text-2xl text-white sm:text-4xl">{copy.final_title}</h2>
          <p className="mt-3 text-base text-white/80 sm:mt-4 sm:text-lg">{copy.final_subtitle}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
            <ButtonLink href={waHref} variant="whatsapp" size="lg" cta="eredi_estero_final_whatsapp">
              <MessageCircle className="h-4 w-4" />
              {copy.cta_whatsapp}
            </ButtonLink>
            <ButtonLink
              href="/preventivo"
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
              cta="eredi_estero_final_preventivo"
            >
              {copy.cta_quote}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
