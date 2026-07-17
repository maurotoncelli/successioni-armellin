import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { CtaBand } from "@/components/site/cta-band";
import {
  IconBadge,
  IconDeliverable,
  IconQuiz,
  IconRemote,
  IconSendPractice,
  IconStudio,
  IconTimeline,
  IconUploadDocs,
  IconVerify,
} from "@/components/site/come-funziona-icons";
import { cta, list, obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Come funziona",
  description: text("come_funziona", "hero_subtitle"),
};

type Step = { numero: number; titolo: string; testo: string; dettaglio: string };
type Address = { via: string; cap: string; citta: string };
type OpeningHour = { giorni: string; orario: string };

const stepIcons = [IconQuiz, IconUploadDocs, IconSendPractice] as const;

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

      {/* Via di mezzo: lista compatta (come prima) + icone custom; da md
          i 3 step restano affiancati e leggibili insieme. */}
      <Section>
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => {
            const Icon = stepIcons[i] ?? IconQuiz;
            return (
              <div key={step.numero} className="flex gap-3.5 md:flex-col">
                <div className="relative shrink-0">
                  <IconBadge tone={i === 1 ? "accent" : "primary"}>
                    <Icon className="h-5 w-5" />
                  </IconBadge>
                  <span className="absolute -left-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary font-display text-[10px] font-bold text-white ring-2 ring-bg">
                    {step.numero}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base leading-snug sm:text-lg">{step.titolo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {step.testo}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-accent">
                    {step.dettaglio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <div className="flex items-start gap-3">
              <IconBadge tone="accent">
                <IconTimeline className="h-5 w-5" />
              </IconBadge>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl">
                  {text("come_funziona", "sla_title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {text("come_funziona", "sla_body")}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <IconBadge>
                <IconVerify className="h-5 w-5" />
              </IconBadge>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl">
                  {text("come_funziona", "valore_title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {text("come_funziona", "valore_body")}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 text-left sm:mt-10">
          <IconBadge tone="sand">
            <IconRemote className="h-5 w-5" />
          </IconBadge>
          <p className="leading-relaxed text-text-muted">
            {text("come_funziona", "distanza_body")}
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-primary/10 bg-bg p-5 sm:mt-8 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <IconBadge tone="accent">
              <IconStudio className="h-5 w-5" />
            </IconBadge>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl">
                {text("come_funziona", "visita_title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {text("come_funziona", "visita_body")}
              </p>
              {indirizzo && (
                <p className="mt-3 text-sm font-medium text-primary">
                  {indirizzo}
                </p>
              )}
              {hours.length > 0 && (
                <ul className="mt-1.5 space-y-0.5 text-sm text-text-muted">
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
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
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
        <ul className="mx-auto mt-6 grid w-fit max-w-2xl gap-2.5 sm:mt-8">
          {deliverable.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 text-accent">
                <IconDeliverable className="h-5 w-5" />
              </span>
              <span className="text-sm sm:text-base">{item}</span>
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
