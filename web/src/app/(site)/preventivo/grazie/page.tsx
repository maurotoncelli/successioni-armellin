import type { Metadata } from "next";
import { CheckCircle2, FileText, Phone, CreditCard } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { documentsList } from "@/content/site";
import { cta, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Grazie",
  robots: { index: false },
};

type Esito = "a" | "b" | "c";

function resolveEsito(value?: string): Esito {
  if (value === "a" || value === "c") return value;
  return "b";
}

export default async function GraziePage({
  searchParams,
}: {
  searchParams: Promise<{ esito?: string }>;
}) {
  const { esito: rawEsito } = await searchParams;
  const esito = resolveEsito(rawEsito);

  const esitoConfig = {
    a: {
      title: text("grazie", "esito_a_title"),
      body: text("grazie", "esito_a_body"),
      cta: cta("grazie", "esito_a_cta"),
      icon: <Phone className="h-7 w-7 text-accent" />,
    },
    b: {
      title: text("grazie", "esito_b_title"),
      body: text("grazie", "esito_b_riallineamento"),
      cta: cta("grazie", "esito_b_cta"),
      icon: <CreditCard className="h-7 w-7 text-accent" />,
    },
    c: {
      title: text("grazie", "esito_c_title"),
      body: text("grazie", "esito_c_body"),
      cta: cta("grazie", "esito_c_cta"),
      icon: <Phone className="h-7 w-7 text-accent" />,
    },
  }[esito];

  return (
    <Section tone="muted">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 text-3xl sm:text-4xl">
            {text("grazie", "header_title")}
          </h1>
        </div>

        <Card className="mt-10">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand">
              {esitoConfig.icon}
            </span>
            <div>
              <h2 className="text-xl">{esitoConfig.title}</h2>
              <p className="mt-2 leading-relaxed text-text-muted">
                {esitoConfig.body}
              </p>
              <div className="mt-5">
                <ButtonLink href={esitoConfig.cta.href} variant="primary">
                  {esitoConfig.cta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl">{text("grazie", "documenti_title")}</h2>
          <ul className="mt-4 space-y-2.5">
            {documentsList.slice(0, 5).map((doc) => (
              <li key={doc.name} className="flex items-start gap-2.5 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{doc.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            {text("grazie", "documenti_disclaimer")}
          </p>
          <p className="mt-1 text-sm font-medium text-accent">
            {text("grazie", "documenti_hook")}
          </p>
        </Card>

        <p className="mt-8 text-center text-sm text-text-muted">
          {text("grazie", "next_body")}
        </p>
      </div>
    </Section>
  );
}
