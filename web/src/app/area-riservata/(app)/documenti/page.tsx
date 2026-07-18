import { Camera } from "lucide-react";
import { PageHeading } from "@/components/area/ui";
import { Card } from "@/components/ui/card";
import { DocumentsClient, type DocItem } from "@/components/area/documents";
import { NoPracticeState } from "@/components/area/empty";
import { requireClientView } from "@/lib/area";
import { isPracticeCancelled, toClientDocState } from "@/content/area-data";
import { listItemFiles } from "@/lib/documents";
import { getDocumentTypesState } from "@/lib/document-types";
import { templatesForLabelWithState } from "@/lib/doc-templates";
import { t, tObj } from "@/lib/locale";
import {
  CLAIM_UI_IT,
  DOCS_UI_IT,
  DOCUMENTI_PAGE_IT,
  type ClaimUiLabels,
  type DocsUiLabels,
  type DocumentiPageLabels,
} from "@/lib/area-ui-labels";

export default async function DocumentiPage() {
  const view = await requireClientView();
  const [
    title,
    subtitle,
    photoTip,
    emptyTitle,
    emptyBody,
    docsUi,
    pageUi,
    claimUi,
  ] = await Promise.all([
    t("area", "documenti_title", "I tuoi documenti"),
    t(
      "area",
      "documenti_subtitle",
      "Carica i documenti richiesti. Puoi anche fare foto col telefono.",
    ),
    t(
      "area",
      "documenti_photo_tip",
      "Foto nitide, tutto il foglio inquadro, niente bagliori. PDF e JPG/PNG fino a 10 MB.",
    ),
    t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
    t(
      "area",
      "empty_body",
      "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
    ),
    tObj<DocsUiLabels>("area", "docs_ui", DOCS_UI_IT),
    tObj<DocumentiPageLabels>("area", "documenti_page_ui", DOCUMENTI_PAGE_IT),
    tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
  ]);

  const practice = view.practice;
  if (!practice) {
    return (
      <div>
        <PageHeading title={title} subtitle={subtitle} />
        <NoPracticeState
          defaultEmail={view.user.email ?? ""}
          title={emptyTitle}
          body={emptyBody}
          claimLabels={claimUi}
        />
      </div>
    );
  }

  if (isPracticeCancelled(practice)) {
    return (
      <div>
        <PageHeading title={title} subtitle={pageUi.cancelled_subtitle} />
        <Card className="border-primary/15 bg-bg-muted">
          <p className="text-sm text-text-muted">{pageUi.cancelled_body}</p>
        </Card>
      </div>
    );
  }

  const docTypesState = await getDocumentTypesState();
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
        templates: templatesForLabelWithState(d.label, docTypesState),
      },
    ];
  });

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />
      <div
        role="status"
        className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/35 bg-warning/10 p-4 text-sm leading-relaxed text-text"
      >
        <Camera className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <p>{photoTip}</p>
      </div>
      <DocumentsClient initial={items} labels={docsUi} />
    </div>
  );
}
