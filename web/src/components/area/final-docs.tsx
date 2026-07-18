"use client";

import { useState } from "react";
import { Download, FileCheck, Loader2, AlertCircle, FolderArchive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { getFinalDocUrl } from "@/app/area-riservata/(app)/conclusa/actions";
import {
  FINAL_DOCS_UI_IT,
  type FinalDocsUiLabels,
} from "@/lib/area-ui-labels";

type Doc = { label: string; fileName: string; uploadedAt: string };

export function FinalDocsClient({
  docs,
  labels = FINAL_DOCS_UI_IT,
}: {
  docs: Doc[];
  labels?: FinalDocsUiLabels;
}) {
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function download(index: number) {
    setBusy(index);
    setError(null);
    try {
      const res = await getFinalDocUrl(index);
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setError(res.error);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {docs.length > 1 && (
        <a
          href="/api/area/final-docs/zip"
          className={buttonClasses({ className: "w-full sm:w-auto" })}
        >
          <FolderArchive className="h-4 w-4" />
          {labels.download_zip}
        </a>
      )}
      {docs.map((doc, i) => (
        <Card key={i} className="flex items-center gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <FileCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-text">{doc.label}</p>
            <p className="truncate text-sm text-text-muted">{doc.fileName}</p>
          </div>
          <button
            onClick={() => download(i)}
            disabled={busy === i}
            className={buttonClasses({
              variant: "outline",
              className: "shrink-0 py-2 text-sm",
            })}
          >
            {busy === i ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{labels.download}</span>
          </button>
        </Card>
      ))}
    </div>
  );
}
