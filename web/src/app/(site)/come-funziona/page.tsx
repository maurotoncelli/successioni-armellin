import type { Metadata } from "next";
import { navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import {
  IconCheck,
  IconExternal,
  IconQuiz,
  IconRemote,
  IconSendPractice,
  IconStudio,
  IconTimeline,
  IconUploadDocs,
  IconVerify,
} from "@/components/site/come-funziona-icons";

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

  return (
    <>
      <PageHero
        eyebrow={await t("come_funziona", "hero_eyebrow", "Il processo")}
        title={await t("come_funziona", "hero_title")}
        subtitle={await t("come_funziona", "hero_subtitle")}
      />

      {/* Sequenza: nodi numerati collegati da una linea (da md). */}
      <Section>
        <ol className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute top-5 right-[16.5%] left-[16.5%] hidden h-px bg-gradient-to-r from-primary/20 via-accent/50 to-primary/20 md:block"
          />
          {steps.map((step, i) => {
            const Icon = stepIcons[i] ?? IconQuiz;
            const isLast = i === steps.length - 1;
            return (
              <li key={step.numero} className="relative md:px-8">
                {/* Connettore verticale su mobile */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-12 bottom-[-2.5rem] left-5 w-px bg-gradient-to-b from-accent/40 to-primary/15 md:hidden"
                  />
                )}
                <div className="flex items-start gap-4 md:flex-col">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg font-display text-sm font-bold text-primary ring-2 ring-accent">
                    {step.numero}
                  </span>
                  <div className="min-w-0 pt-0.5 md:pt-0">
                    <Icon className="h-9 w-9 text-primary" />
                    <h3 className="mt-4 text-xl leading-snug">{step.titolo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {step.testo}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
                      {step.dettaglio}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* Pannelli: icone stroke grandi, senza box colorati. */}
      <Section tone="sand">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm">
            <IconTimeline className="h-9 w-9 text-accent" />
            <h3 className="mt-5 text-xl">
              {await t("come_funziona", "sla_title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {await t("come_funziona", "sla_body")}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm">
            <IconVerify className="h-9 w-9 text-primary" />
            <h3 className="mt-5 text-xl">
              {await t("come_funziona", "valore_title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {await t("come_funziona", "valore_body")}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm">
            <IconRemote className="h-9 w-9 text-primary" />
            <h3 className="mt-5 text-xl">
              {await t("come_funziona", "distanza_title", "Tutto online")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {await t("come_funziona", "distanza_body")}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm sm:p-8 md:mt-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
            <IconStudio className="h-10 w-10 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl">
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
