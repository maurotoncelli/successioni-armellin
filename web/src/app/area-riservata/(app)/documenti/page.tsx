import { Camera } from "lucide-react";
import { PageHeading } from "@/components/area/ui";
import { Card } from "@/components/ui/card";
import { DocumentsClient, type DocItem } from "@/components/area/documents";
import { NoPracticeState } from "@/components/area/empty";
import { requireClientView } from "@/lib/area";
import { isPracticeCancelled, toClientDocState } from "@/content/area-data";
import { listItemFiles } from "@/lib/documents";

export default async function DocumentiPage() {
  const { practice } = await requireClientView();
  if (!practice) {
    return (
      <div>
        <PageHeading title="I tuoi documenti" subtitle="Checklist documenti." />
        <NoPracticeState />
      </div>
    );
  }

  if (isPracticeCancelled(practice)) {
    return (
      <div>
        <PageHeading
          title="I tuoi documenti"
          subtitle="La pratica è stata annullata: non serve caricare nulla."
        />
        <Card className="border-primary/15 bg-bg-muted">
          <p className="text-sm text-text-muted">
            Questa pratica è stata annullata, quindi il caricamento dei
            documenti è disattivato. I documenti d&apos;identità e gli altri
            file caricati verranno cancellati dai nostri sistemi secondo la
            privacy policy.
          </p>
        </Card>
      </div>
    );
  }

  const items: DocItem[] = practice.checklist.flatMap((d, index) => {
    const state = toClientDocState(d.status);
    if (!state) return [];
    return [
      {
        index,
        label: d.label,
        required: d.required,
        state,
        reason: d.reason,
        help: d.help,
        files: listItemFiles(d).map((f) => f.name),
      },
    ];
  });

  return (
    <div>
      <PageHeading
        title="I tuoi documenti"
        subtitle="Carica i documenti richiesti. Quando li hai caricati tutti, invia a Lorenzo."
      />
      <div
        role="status"
        className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/35 bg-warning/10 p-4 text-sm leading-relaxed text-text"
      >
        <Camera className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <p>
          Se fai le foto con il telefono, assicurati di avere buona luce, messa
          a fuoco nitida e testo ben leggibile. Documenti poco chiari andranno
          rifiutati e dovrai ricaricarli.
        </p>
      </div>
      <DocumentsClient initial={items} />
    </div>
  );
}
