import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { MandateForm } from "@/components/area/mandate-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";

export default async function MandatoPage() {
  const { practice, account } = await requireClientView();
  if (!practice) {
    return (
      <div>
        <PageHeading title="Mandato e consensi" subtitle="Firma l'incarico." />
        <NoPracticeState />
      </div>
    );
  }

  const extras = await getSafeExtras(practice.id);

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
          <p className="mt-2">
            Il/La sottoscritto/a {account.name} conferisce al Geom. Lorenzo
            Armellin l&apos;incarico di predisporre e trasmettere la dichiarazione
            di successione e gli adempimenti connessi, secondo il pacchetto
            acquistato.
          </p>
          <p className="mt-2">
            Il professionista opera con la supervisione fiscale di un
            commercialista. L&apos;onorario è quello indicato in &quot;Il tuo
            acquisto&quot;; le imposte di Stato sono separate e a carico
            dell&apos;erede.
          </p>
          <p className="mt-2">
            (Testo fac-simile per il prototipo: la versione definitiva sarà
            validata con il legale.)
          </p>
        </div>

        <div className="mt-5">
          <MandateForm
            signerName={account.name}
            practiceCode={account.practiceCode}
            initial={extras.mandate}
          />
        </div>
      </Card>
    </div>
  );
}
