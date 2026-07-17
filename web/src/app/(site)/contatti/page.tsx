import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/site/contact-form";
import { obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contatti",
  description: text("contatti", "hero_subtitle"),
};

type Telefono = {
  label: string;
  numero: string;
  cta_chiama: string;
  cta_whatsapp: string;
};
type Email = { generale: string; pec: string };
type Studio = { via: string; cap: string; citta: string };

export default function ContattiPage() {
  const telefono = obj<Telefono>("contatti", "telefono", {
    label: "Telefono",
    numero: "",
    cta_chiama: "tel:+393201570567",
    cta_whatsapp: "#",
  });
  const email = obj<Email>("contatti", "email", { generale: "", pec: "" });
  const studio = obj<Studio>("contatti", "studio", {
    via: "",
    cap: "",
    citta: "",
  });

  const indirizzo = `${studio.via}, ${studio.cap} ${studio.citta}`;
  const mapQuery = encodeURIComponent(indirizzo);
  const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&z=15&hl=it&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <>
      <PageHero
        eyebrow={text("contatti", "hero_eyebrow", "Contatti")}
        title={text("contatti", "hero_title")}
        subtitle={text("contatti", "hero_subtitle")}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <ContactInfo
              icon={<Phone className="h-5 w-5 text-accent" />}
              title={telefono.label}
              value={telefono.numero}
              href={telefono.cta_chiama}
            />
            <ContactInfo
              icon={<Mail className="h-5 w-5 text-accent" />}
              title="Email"
              value={email.generale}
              href={`mailto:${email.generale}`}
            />
            <ContactInfo
              icon={<MapPin className="h-5 w-5 text-accent" />}
              title="Studio"
              value={`${studio.via}, ${studio.cap} ${studio.citta}`}
            />
            <Card className="bg-bg-muted">
              <h3 className="text-lg">{text("contatti", "canali_title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {text("contatti", "canali_body")}
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="text-2xl">{text("contatti", "form_title")}</h2>
            <p className="mt-2 text-sm text-text-muted">
              {text("contatti", "cta_body")}
            </p>
            <div className="mt-6">
              <ContactForm
                successMessage={text(
                  "contatti",
                  "form_success",
                  "Grazie! Ti ricontattiamo a breve.",
                )}
              />
            </div>
          </Card>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          eyebrow="Dove ci trovi"
          title={`Lo studio a ${studio.citta}`}
          intro={text("contatti", "mappa_nota")}
        />

        <div className="mt-6 grid gap-6 sm:mt-10 lg:grid-cols-2">
          {/* Foto di Pontedera: responsive (mobile/tablet/desktop) via object-cover
              + sizes; il container cambia altezza per breakpoint. */}
          <figure className="relative h-64 overflow-hidden rounded-2xl border border-primary/10 shadow-sm sm:h-80 lg:h-[460px]">
            <Image
              src="/images/pontedera-studio.png"
              alt={`Veduta di ${studio.citta} (immagine indicativa)`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/40 to-transparent p-5">
              <figcaption className="flex items-start gap-2 text-white">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold">{indirizzo}</span>
                  <span className="block text-sm text-white/75">
                    Immagine indicativa di {studio.citta}
                  </span>
                </span>
              </figcaption>
            </div>
          </figure>

          {/* Mappa interattiva (lazy-load) dell'indirizzo dello studio. */}
          <div className="relative h-64 overflow-hidden rounded-2xl border border-primary/10 shadow-sm sm:h-80 lg:h-[460px]">
            <iframe
              title={`Mappa dello studio - ${indirizzo}`}
              src={mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full border-0 grayscale-[15%]"
            />
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-bg/95 px-4 py-2 text-sm font-semibold text-primary shadow-md backdrop-blur transition-colors hover:text-accent"
            >
              <ExternalLink className="h-4 w-4" />
              Apri in Google Maps
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

function ContactInfo({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          {title}
        </p>
        {href ? (
          <a href={href} className="text-primary hover:text-accent">
            {value}
          </a>
        ) : (
          <p className="text-primary">{value}</p>
        )}
      </div>
    </Card>
  );
}
