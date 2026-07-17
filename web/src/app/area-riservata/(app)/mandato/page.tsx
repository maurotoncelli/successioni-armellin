import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { MandateForm } from "@/components/area/mandate-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";
import { buildMandatoParagraphs, buildMandatoText } from "@/content/mandato";

export default async function MandatoPage() {
  const view = await requireClientView();
  const { practice, account } = view;
  if (!practice) {
    return (
      <div>
        <PageHeading title="Mandato e consensi" subtitle="Firma l'incarico." />
        <NoPracticeState defaultEmail={view.user.email ?? ""} />
      </div>
    );
  }

  const extras = await getSafeExtras(practice.id);
  const mandatoParams = {
    practiceCode: account.practiceCode,
    signerName: account.name,
  };
  const paragraphs = buildMandatoParagraphs(mandatoParams);

  return (
    <div>
      <PageHeading
        title="Mandato e consensi"
        subtitle="Leggi e firma l'incarico: ci autorizza a procedere con la tua pratica."
      />

      <Card>
        <div className="max-h-72 overflow-y-auto rounded-lg border border-primary/10 bg-bg-muted p-4 text-sm leading-relaxed text-text-muted">
          <p className="font-semibold text-text">
            Mandato professionale - Pratica {account.practiceCode}
          </p>
          {paragraphs.map((para, i) => (
            <p key={i} className="mt-2">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-5">
          <MandateForm
            signerName={account.name}
            practiceCode={account.practiceCode}
            mandateText={buildMandatoText(mandatoParams)}
            initial={extras.mandate}
          />
        </div>
      </Card>
    </div>
  );
}
