import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
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
    cta_chiama: "tel:+39",
    cta_whatsapp: "#",
  });
  const email = obj<Email>("contatti", "email", { generale: "", pec: "" });
  const studio = obj<Studio>("contatti", "studio", {
    via: "",
    cap: "",
    citta: "",
  });

  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title={text("contatti", "hero_title")}
        subtitle={text("contatti", "hero_subtitle")}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
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
        <p className="mt-10 text-center text-sm text-text-muted">
          {text("contatti", "mappa_nota")}
        </p>
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
