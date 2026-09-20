"use client";

import { useState, useTransition } from "react";
import { Minus } from "lucide-react";
import { adjustStat, type StatAdjustKind } from "@/app/crm/statistiche/actions";
import type { VideoId } from "@/lib/video-ids";

type Props = {
  kind: StatAdjustKind;
  videoId?: VideoId;
  disabled?: boolean;
};

export function StatsAdjust({ kind, videoId, disabled }: Props) {
  const [pending, startTransition] = useTransition();
  const [undoVideo, setUndoVideo] = useState<VideoId | undefined>();
  const [canUndo, setCanUndo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function minus() {
    setError(null);
    startTransition(async () => {
      const res = await adjustStat({ kind, delta: -1, videoId });
      if (!res.ok) {
        setError(res.error ?? "Errore");
        return;
      }
      setUndoVideo(res.videoId ?? videoId);
      setCanUndo(true);
    });
  }

  function undo() {
    setError(null);
    startTransition(async () => {
      const res = await adjustStat({
        kind,
        delta: 1,
        videoId: undoVideo ?? videoId,
      });
      if (!res.ok) {
        setError(res.error ?? "Errore");
        return;
      }
      setCanUndo(false);
    });
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={minus}
        disabled={disabled || pending}
        className="inline-flex items-center gap-1 rounded-md border border-crm-border bg-crm-bg2/60 px-2 py-1 text-[11px] font-medium text-crm-text2 transition-colors hover:border-crm-accent/40 hover:text-crm-text disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Togli 1"
      >
        <Minus className="h-3 w-3" />
        Togli 1
      </button>
      {canUndo && (
        <button
          type="button"
          onClick={undo}
          disabled={pending}
          className="text-[11px] font-medium text-crm-accent hover:underline disabled:opacity-40"
        >
          Annulla
        </button>
      )}
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  );
}
