"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Lightbulb,
  Plus,
  PencilLine,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import type { SiteNote } from "@/lib/site-notes";
import {
  addSiteNote,
  editSiteNote,
  removeSiteNote,
} from "@/app/crm/migliorie/actions";
import { cn } from "@/lib/utils";

/*
  Appunti "Migliorie sito": card semplici (titolo + testo libero) da creare al
  volo, modificare in place ed eliminare. Nessuno stato/priorita: e un blocco
  note operativo, la lavorazione avviene "in blocco" quando Lorenzo/Mauro
  decidono di metterci mano.
*/

const inputCls =
  "w-full rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text outline-none placeholder:text-crm-muted focus:border-crm-accent";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SiteNotes({ notes }: { notes: SiteNote[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-crm-text">Migliorie sito</h1>
          <p className="text-sm text-crm-text2">
            Appunti sulle modifiche da fare al sito: segnale quando te ne
            accorgi, lavorale in blocco quando vuoi.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Nuovo appunto
          </button>
        )}
      </div>

      {creating && (
        <NoteEditor
          onDone={() => {
            setCreating(false);
            router.refresh();
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {notes.length === 0 && !creating ? (
        <div className="rounded-[14px] border border-dashed border-crm-border bg-crm-surface/50 p-10 text-center">
          <Lightbulb className="mx-auto h-8 w-8 text-crm-muted" />
          <p className="mt-3 text-sm font-medium text-crm-text">
            Nessun appunto per ora.
          </p>
          <p className="mt-1 text-sm text-crm-text2">
            Quando noti qualcosa da migliorare sul sito, segnalo qui.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onChanged={() => router.refresh()} />
          ))}
        </ul>
      )}
    </div>
  );
}

/* Editor condiviso: creazione (senza note) e modifica (con note precompilata). */
function NoteEditor({
  note,
  onDone,
  onCancel,
}: {
  note?: SiteNote;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setError(null);
    startTransition(async () => {
      const res = note
        ? await editSiteNote(note.id, title, body)
        : await addSiteNote(title, body);
      if (res.ok) onDone();
      else setError(res.error);
    });
  }

  return (
    <div className="rounded-[14px] border border-crm-accent/40 bg-crm-surface p-4">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titolo (es. Testo hero da rivedere)"
        className={cn(inputCls, "font-medium")}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Dettagli: cosa cambiare, dove, perché…"
        rows={4}
        className={cn(inputCls, "mt-2 resize-y")}
      />
      {error && <p className="mt-2 text-xs text-crm-rose">{error}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border px-3 py-2 text-sm font-medium text-crm-text2 hover:bg-crm-hover hover:text-crm-text"
        >
          <X className="h-4 w-4" />
          Annulla
        </button>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Salva
        </button>
      </div>
    </div>
  );
}

function NoteCard({
  note,
  onChanged,
}: {
  note: SiteNote;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="list-none">
        <NoteEditor
          note={note}
          onDone={() => {
            setEditing(false);
            onChanged();
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  function remove() {
    startTransition(async () => {
      const res = await removeSiteNote(note.id);
      if (res.ok) onChanged();
      setConfirmingDelete(false);
    });
  }

  return (
    <li className="group flex flex-col rounded-[14px] border border-crm-border bg-crm-surface p-4 transition-colors hover:border-crm-accent/40">
      <div className="flex items-start justify-between gap-2">
        <h2 className="min-w-0 font-medium text-crm-text">
          {note.title || "Senza titolo"}
        </h2>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="grid h-7 w-7 place-items-center rounded-lg text-crm-muted hover:bg-crm-hover hover:text-crm-text"
            title="Modifica"
          >
            <PencilLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="grid h-7 w-7 place-items-center rounded-lg text-crm-muted hover:bg-crm-rose/15 hover:text-crm-rose"
            title="Elimina"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {note.body && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-crm-text2">
          {note.body}
        </p>
      )}

      <p className="mt-auto pt-3 text-[11px] text-crm-muted">
        {formatDate(note.updatedAt)}
      </p>

      {confirmingDelete && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-crm-rose/30 bg-crm-rose/10 px-3 py-2">
          <span className="text-xs text-crm-rose">Eliminare l&apos;appunto?</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="rounded-md bg-crm-rose px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50"
            >
              {pending ? "…" : "Elimina"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={pending}
              className="rounded-md border border-crm-border px-2.5 py-1 text-xs text-crm-text2 hover:text-crm-text"
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
