import Link from "next/link";
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
import { cta, list, text } from "@/lib/content";

const vantaggiIcons = [House, ShieldCheck, HeartHandshake];

export default function HomePage() {
  const heroCtaPrimary = cta("home", "hero_cta_primary");
  const heroCtaSecondary = cta("home", "hero_cta_secondary");
  const vantaggi = list<{ titolo: string; testo: string }>(
    "home",
    "problema_vantaggi",
  );
  const steps = list<{ titolo: string; testo: string }>(
    "home",
    "come_funziona_steps",
  );
  const confronto = list<{ voce: string; faidate: string; noi: string }>(
    "home",
    "faidate_confronto",
  );
  const tariffeCta = cta("home", "tariffe_cta");
  const chisonoCta = cta("home", "chisono_cta");
  const faqCta = cta("home", "faq_cta");
  const finalButton = cta("home", "cta_finale_button");
  const finalPhone = cta("home", "cta_finale_phone");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              {text("home", "hero_specialization_badge")}
            </span>
            <h1 className="mt-6 font-display text-4xl text-white sm:text-6xl">
              {text("home", "hero_title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              {text("home", "hero_subtitle")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={heroCtaPrimary.href} variant="primary" size="lg">
                {heroCtaPrimary.label}
                <ArrowRight className="h-4 w-4" />
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

      {/* Problema / Soluzione */}
      <Section>
        <SectionHeading
          title={text("home", "problema_title")}
          intro={text("home", "problema_intro")}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {vantaggi.map((v, i) => {
            const Icon = vantaggiIcons[i % vantaggiIcons.length];
            return (
              <Card key={v.titolo} className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sand text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl">{v.titolo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {v.testo}
                </p>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Come funziona */}
      <Section id="come-funziona" tone="sand">
        <SectionHeading
          eyebrow="Semplice"
          title={text("home", "come_funziona_title")}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.titolo} className="relative">
              <span className="font-display text-5xl font-bold text-accent/30">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-xl">{step.titolo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.testo}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-text-muted">
          {text("home", "come_funziona_sla_note")}
        </p>
      </Section>

      {/* Tariffe (estratto) */}
      <Section>
        <SectionHeading
          eyebrow="Tariffe"
          title={text("home", "tariffe_title")}
          intro={text("home", "tariffe_intro")}
        />
        <div className="mt-12">
          <PackageCards />
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href={tariffeCta.href} variant="outline" size="lg">
            {tariffeCta.label}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Section>

      {/* Fai da te */}
      <Section tone="muted">
        <SectionHeading
          title={text("home", "faidate_title")}
          intro={text("home", "faidate_intro")}
        />
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-primary/10 bg-bg">
          <div className="grid grid-cols-3 bg-primary text-sm font-semibold text-white">
            <div className="p-4" />
            <div className="p-4 text-center">Fai-da-te</div>
            <div className="p-4 text-center text-accent">Con noi</div>
          </div>
          {confronto.map((row, i) => (
            <div
              key={row.voce}
              className={`grid grid-cols-3 text-sm ${
                i % 2 === 1 ? "bg-bg-muted" : ""
              }`}
            >
              <div className="p-4 font-medium text-primary">{row.voce}</div>
              <div className="flex items-center justify-center gap-1.5 p-4 text-text-muted">
                <X className="h-4 w-4 text-error" />
                <span className="text-center">{row.faidate}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-4">
                <Check className="h-4 w-4 text-success" />
                <span className="text-center">{row.noi}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Recensioni */}
      <Section>
        <SectionHeading
          title={text("home", "recensioni_title")}
          intro={text("home", "recensioni_intro")}
        />
        <div className="mt-12">
          <Reviews />
        </div>
      </Section>

      {/* Chi sono (estratto) */}
      <Section tone="sand">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="aspect-[4/3] rounded-2xl bg-secondary/90" aria-hidden />
          <div>
            <h2 className="text-3xl sm:text-4xl">
              {text("home", "chisono_title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">
              {text("home", "chisono_estratto")}
            </p>
            <div className="mt-8">
              <ButtonLink href={chisonoCta.href} variant="secondary">
                {chisonoCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ (estratto) */}
      <Section>
        <SectionHeading title={text("home", "faq_title")} />
        <div className="mt-8 text-center">
          <Link
            href={faqCta.href}
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-dark"
          >
            {faqCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <CtaBand
        title={text("home", "cta_finale_title")}
        subtitle={text("home", "cta_finale_subtitle")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
