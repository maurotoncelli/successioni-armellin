import { Download, FileCheck, Lock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { FinalDocsClient } from "@/components/area/final-docs";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";
import { finalDocuments } from "@/content/area-data";
import { text } from "@/lib/content";

export default async function ConclusaPage() {
  const view = await requireClientView();
  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading title="Documenti finali" subtitle="Disponibili a pratica conclusa." />
        <NoPracticeState defaultEmail={view.user.email ?? ""} />
      </div>
    );
  }

  const extras = await getSafeExtras(p.id);
  const realDocs = extras.finalDocuments ?? [];
  const concluded = p.status === "CHIUSA";
  // Link recensione (es. profilo Google) data-driven: finche' non e'
  // configurato in settings.review_url la card non mostra un link morto.
  const reviewUrl = text("settings", "review_url");

  return (
    <div>
      <PageHeading
        title="Documenti finali"
        subtitle={
          concluded
            ? "La tua pratica è conclusa. Qui trovi tutti i documenti."
            : "Qui troverai i documenti quando la pratica sarà conclusa."
        }
      />

      {realDocs.length > 0 ? (
        <FinalDocsClient docs={realDocs} />
      ) : (
        <>
          <Card className="mb-6 border-primary/15 bg-bg-muted">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
              <p className="text-sm text-text-muted">
                I documenti finali non sono ancora disponibili. Qui sotto trovi
                l&apos;anteprima di <strong>cosa riceverai</strong> a pratica
                conclusa.
              </p>
            </div>
          </Card>

          <div className="space-y-3">
            {finalDocuments.map((doc) => (
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
                  <span className="hidden sm:inline">Scarica</span>
                </button>
              </Card>
            ))}
          </div>
        </>
      )}

      {concluded && realDocs.length > 0 && (
        <Card className="mt-6 border-accent/30 bg-accent/5 text-center">
          <Star className="mx-auto h-6 w-6 text-accent" />
          <p className="mt-2 font-medium text-text">Grazie per la fiducia.</p>
          <p className="mt-1 text-sm text-text-muted">
            Se ti sei trovato bene, una recensione ci aiuta tantissimo.
          </p>
          {reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ className: "mt-4" })}
            >
              Lascia una recensione
            </a>
          )}
        </Card>
      )}
    </div>
  );
}
