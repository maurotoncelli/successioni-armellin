import type { Metadata } from "next";
import {
  Check,
  MapPin,
  ExternalLink,
  ClipboardList,
  Upload,
  Send,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { CtaBand } from "@/components/site/cta-band";
import { cta, list, obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Come funziona",
  description: text("come_funziona", "hero_subtitle"),
};

type Step = { numero: number; titolo: string; testo: string; dettaglio: string };
type Address = { via: string; cap: string; citta: string };
type OpeningHour = { giorni: string; orario: string };

const stepVisuals = [
  {
    icon: ClipboardList,
    // Illustrazione astratta: modulo / domande
    art: (
      <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden>
        <rect x="18" y="16" width="124" height="88" rx="12" className="fill-white/90" />
        <rect x="34" y="32" width="72" height="8" rx="4" className="fill-primary/25" />
        <rect x="34" y="48" width="92" height="6" rx="3" className="fill-primary/15" />
        <rect x="34" y="62" width="84" height="6" rx="3" className="fill-primary/15" />
        <circle cx="118" cy="78" r="14" className="fill-accent" />
        <path
          d="M112 78h12M118 72v12"
          className="stroke-white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    icon: Upload,
    art: (
      <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden>
        <rect x="28" y="22" width="70" height="76" rx="10" className="fill-white/90" />
        <rect x="40" y="36" width="46" height="6" rx="3" className="fill-primary/20" />
        <rect x="40" y="50" width="38" height="6" rx="3" className="fill-primary/15" />
        <rect x="72" y="40" width="60" height="58" rx="10" className="fill-accent/90" />
        <path
          d="M102 72V52M92 60l10-10 10 10"
          className="stroke-white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    icon: Send,
    art: (
      <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden>
        <circle cx="52" cy="60" r="28" className="fill-white/90" />
        <circle cx="52" cy="52" r="10" className="fill-primary/20" />
        <path
          d="M38 78c4-10 24-10 28 0"
          className="stroke-primary/30"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M78 40l52 20-52 20 10-20-10-20z"
          className="fill-accent"
        />
        <path
          d="M88 60h28"
          className="stroke-white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

export default function ComeFunzionaPage() {
  const steps = list<Step>("come_funziona", "steps");
  const deliverable = list<string>("come_funziona", "deliverable_list");
  const finalButton = cta("come_funziona", "cta_button");
  const finalPhone = cta("come_funziona", "cta_phone");
  const address = obj<Address>("settings", "address", {
    via: "",
    cap: "",
    citta: "",
  });
  const hours = list<OpeningHour>("settings", "opening_hours");
  const indirizzo = [address.via, `${address.cap} ${address.citta}`.trim()]
    .filter(Boolean)
    .join(", ");
  const mapLink = indirizzo
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzo)}`
    : "/contatti";

  return (
    <>
      <PageHero
        eyebrow={text("come_funziona", "hero_eyebrow", "Il processo")}
        title={text("come_funziona", "hero_title")}
        subtitle={text("come_funziona", "hero_subtitle")}
      />

      <Section>
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          {steps.map((step, i) => {
            const visual = stepVisuals[i] ?? stepVisuals[0];
            const Icon = visual.icon;
            const reverse = i % 2 === 1;
            return (
              <div
                key={step.numero}
                className={`grid items-center gap-6 overflow-hidden rounded-2xl border border-primary/10 bg-bg shadow-sm md:grid-cols-2 md:gap-8 ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[5/3] bg-gradient-to-br from-sand via-bg-muted to-primary/10 p-6 sm:p-8">
                  <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-lg font-bold text-white shadow-sm">
                    {step.numero}
                  </div>
                  <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-accent shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mx-auto h-full max-w-[220px]">{visual.art}</div>
                </div>
                <div className="px-5 pb-6 md:px-8 md:py-8 md:pb-8">
                  <h3 className="text-xl sm:text-2xl">{step.titolo}</h3>
                  <p className="mt-3 leading-relaxed text-text-muted">
                    {step.testo}
                  </p>
                  <p className="mt-3 text-sm font-medium text-accent">
                    {step.dettaglio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="relative overflow-hidden">
            <span className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
              <Clock className="h-7 w-7" />
            </span>
            <h3 className="text-xl">{text("come_funziona", "sla_title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("come_funziona", "sla_body")}
            </p>
          </Card>
          <Card className="relative overflow-hidden">
            <span className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h3 className="text-xl">{text("come_funziona", "valore_title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("come_funziona", "valore_body")}
            </p>
          </Card>
        </div>
        <p className="mt-8 text-center leading-relaxed text-text-muted">
          {text("come_funziona", "distanza_body")}
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-primary/10 bg-bg p-5 sm:mt-10 sm:p-7">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl">
                {text("come_funziona", "visita_title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {text("come_funziona", "visita_body")}
              </p>
              {indirizzo && (
                <p className="mt-4 text-sm font-medium text-primary">
                  {indirizzo}
                </p>
              )}
              {hours.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-sm text-text-muted">
                  {hours.map((h) => (
                    <li key={h.giorni}>
                      <span className="font-medium text-text">{h.giorni}:</span>{" "}
                      {h.orario}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={mapLink}
                target={indirizzo ? "_blank" : undefined}
                rel={indirizzo ? "noopener noreferrer" : undefined}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
              >
                {text(
                  "come_funziona",
                  "visita_maps_label",
                  "Apri in Google Maps",
                )}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title={text("come_funziona", "deliverable_title")} />
        <ul className="mx-auto mt-6 grid w-fit max-w-2xl gap-3 sm:mt-10">
          {deliverable.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="mt-1 h-5 w-5 shrink-0 text-success" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={text("come_funziona", "cta_title")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
