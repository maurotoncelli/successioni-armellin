import { Download, FileCheck, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { FinalDocsClient } from "@/components/area/final-docs";
import { ReviewBanner } from "@/components/area/review-banner";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";
import { text } from "@/lib/content";
import { t, tList, tObj } from "@/lib/locale";
import {
  CLAIM_UI_IT,
  FINAL_DOCS_PREVIEW_IT,
  FINAL_DOCS_UI_IT,
  type ClaimUiLabels,
  type ConclusaPreviewLabels,
  type FinalDocsUiLabels,
} from "@/lib/area-ui-labels";

export default async function ConclusaPage() {
  const view = await requireClientView();
  const [
    title,
    subtitleOpen,
    subtitleClosed,
    reviewTitle,
    reviewCta,
    reviewBody,
    emptyTitle,
    emptyBody,
    finalDocsUi,
    preview,
    claimUi,
  ] = await Promise.all([
    t("area", "conclusa_title", "Documenti finali"),
    t(
      "area",
      "conclusa_subtitle_open",
      "La tua pratica è conclusa. Qui trovi i documenti da scaricare.",
    ),
    t(
      "area",
      "conclusa_subtitle_closed",
      "I documenti finali saranno disponibili a pratica conclusa.",
    ),
    t(
      "area",
      "review_title",
      "La pratica è conclusa: lasciaci una recensione?",
    ),
    t("area", "review_cta", "Lascia una recensione su Google"),
    t(
      "area",
      "review_body",
      "Se ti sei trovato bene con Lorenzo, una recensione su Google ci aiuta tantissimo.",
    ),
    t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
    t(
      "area",
      "empty_body",
      "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
    ),
    tObj<FinalDocsUiLabels>("area", "final_docs_ui", FINAL_DOCS_UI_IT),
    tList<{ label: string; description: string }>(
      "area",
      "final_docs_preview",
    ).then((list) =>
      list.length > 0 ? list : FINAL_DOCS_PREVIEW_IT,
    ) as Promise<ConclusaPreviewLabels>,
    tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
  ]);

  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading title={title} subtitle={subtitleClosed} />
        <NoPracticeState
          defaultEmail={view.user.email ?? ""}
          title={emptyTitle}
          body={emptyBody}
          claimLabels={claimUi}
        />
      </div>
    );
  }

  const extras = await getSafeExtras(p.id);
  const realDocs = extras.finalDocuments ?? [];
  const concluded = p.status === "CHIUSA";
  const reviewUrl = text("settings", "review_url");

  return (
    <div>
      <PageHeading
        title={title}
        subtitle={concluded ? subtitleOpen : subtitleClosed}
      />

      {concluded && reviewUrl && (
        <div className="mb-6">
          <ReviewBanner
            reviewUrl={reviewUrl}
            labels={{
              title: reviewTitle,
              cta: reviewCta,
              body: reviewBody,
            }}
          />
        </div>
      )}

      {realDocs.length > 0 ? (
        <FinalDocsClient docs={realDocs} labels={finalDocsUi} />
      ) : (
        <>
          <Card className="mb-6 border-primary/15 bg-bg-muted">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
              <p className="text-sm text-text-muted">{finalDocsUi.not_ready}</p>
            </div>
          </Card>

          <div className="space-y-3">
            {preview.map((doc) => (
              <Card key={doc.label} className="flex items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text">{doc.label}</p>
                  <p className="text-sm text-text-muted">{doc.description}</p>
                </div>
                <button
                  disabled
                  className={buttonClasses({
                    variant: "outline",
                    className: "shrink-0 py-2 text-sm",
                  })}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">{finalDocsUi.download}</span>
                </button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
