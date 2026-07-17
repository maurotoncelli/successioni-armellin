import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { IbanForm } from "@/components/area/iban-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";

export default async function DatiPage() {
  const view = await requireClientView();
  const practice = view.practice;
  if (!practice) {
    return (
      <div>
        <PageHeading title="I tuoi dati" subtitle="Dati aggiuntivi." />
        <NoPracticeState defaultEmail={view.user.email ?? ""} />
      </div>
    );
  }

  const extras = await getSafeExtras(practice.id);

  return (
    <div>
      <PageHeading
        title="I tuoi dati"
        subtitle="Alcuni dati aggiuntivi che ci servono per completare la pratica."
      />
      <Card>
        <IbanForm
          initialLast4={extras.iban?.last4}
          clearedAt={extras.iban ? undefined : extras.ibanClearedAt}
        />
      </Card>
    </div>
  );
}
