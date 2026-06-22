import { PageHeading } from "@/components/area/ui";
import { DocumentsClient, type DocItem } from "@/components/area/documents";
import { NoPracticeState } from "@/components/area/empty";
import { requireClientView } from "@/lib/area";
import { toClientDocState } from "@/content/area-data";

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
        fileName: d.fileName,
      },
    ];
  });

  return (
    <div>
      <PageHeading
        title="I tuoi documenti"
        subtitle="Carica i documenti richiesti. Quando li hai caricati tutti, invia a Lorenzo."
      />
      <DocumentsClient initial={items} />
    </div>
  );
}
