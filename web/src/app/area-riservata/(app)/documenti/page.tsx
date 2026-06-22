import { PageHeading } from "@/components/area/ui";
import { DocumentsClient, type DocItem } from "@/components/area/documents";
import { currentPractice, toClientDocState } from "@/content/area-data";

export default function DocumentiPage() {
  const items: DocItem[] = currentPractice.checklist.flatMap((d) => {
    const state = toClientDocState(d.status);
    if (!state) return [];
    return [
      {
        label: d.label,
        required: d.required,
        state,
        reason: d.reason,
        help: d.help,
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
