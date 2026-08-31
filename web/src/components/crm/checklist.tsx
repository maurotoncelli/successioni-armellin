"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Check,
  X,
  Download,
  Loader2,
  RotateCcw,
  Upload,
  ListPlus,
  Trash2,
  FilePlus2,
  Bell,
} from "lucide-react";
import type { RequirementStatus } from "@/content/crm-data";
import {
  approveDocument,
  rejectDocument,
  createChecklistNow,
  addChecklistItemAction,
  removeChecklistItemAction,
  removeDraftAction,
  notifyDraftReadyAction,
} from "@/app/crm/pratiche/[id]/actions";

export type CrmDocItem = {
  index: number;
  label: string;
  required: boolean;
  status: RequirementStatus;
  /** Nomi dei file caricati (piu file per voce, es. fronte/retro). */
  files: string[];
  reason?: string;
  /** Origine della voce: "manual" = aggiunta a mano da Lorenzo su questa pratica. */
  source?: "auto" | "manual";
  /** Bozza precompilata allegata alla voce (distinta dai file del cliente). */
  draft?: { name: string; note?: string };
};

/* Testi CRM (solo italiano): niente i18n nel gestionale, ma niente copy sparsa. */
const L = {
  statusUnavailable: "Non applicabile",
  addItem: "Aggiungi voce",
  addTitle: "Nuova voce di checklist (solo per questa pratica)",
  labelField: "Etichetta della voce",
  labelPlaceholder: "Es. Delega di rappresentanza",
  requiredField: "Documento obbligatorio",
  noteField: "Nota per il cliente (facoltativa)",
  notePlaceholder: "Istruzioni mostrate al cliente sotto la voce.",
  draftField: "Bozza da allegare (facoltativa, PDF/JPG/PNG)",
  notifyField: "Avvisa il cliente via email e notifica",
  save: "Aggiungi",
  cancel: "Annulla",
  removeItem: "Togli questa voce (solo voci aggiunte a mano e senza file)",
  prepareDraft: "Prepara bozza",
  replaceDraft: "Sostituisci bozza",
  removeDraft: "Togli bozza",
  draftLabel: "Bozza:",
  notifyClient: "Avvisa il cliente",
  draftHint:
    "Il cliente scarica la bozza, la completa/firma e la ricarica. Non conta come documento consegnato.",
  uploadForClient: "Carica per il cliente (es. documenti consegnati in studio)",
  approve: "Approva",
  reject: "Rifiuta",
  awaitingReupload: "In attesa di nuovo caricamento",
  rejectPrompt: "Motivo del rifiuto (verra mostrato al cliente):",
  genericError: "Operazione non riuscita, riprova.",
};

const reqStatusMeta: Record<RequirementStatus, { label: string; cls: string }> = {
  ATTESO: { label: "Da caricare", cls: "text-crm-muted" },
  CARICATO: { label: "Caricato", cls: "text-crm-amber" },
  APPROVATO: { label: "Approvato", cls: "text-crm-green" },
  RIFIUTATO: { label: "Da rifare", cls: "text-crm-rose" },
  NON_APPLICABILE: { label: L.statusUnavailable, cls: "text-crm-muted" },
};

export function CrmChecklist({
  practiceId,
  items,
  hasClientEmail = false,
}: {
  practiceId: string;
  items: CrmDocItem[];
  hasClientEmail?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadIndex = useRef<number | null>(null);
  const draftInput = useRef<HTMLInputElement>(null);
  const draftIndex = useRef<number | null>(null);

  // Upload da parte di Lorenzo (cliente seguito in studio): il documento
  // nasce direttamente APPROVATO.
  function pickFile(index: number) {
    uploadIndex.current = index;
    fileInput.current?.click();
  }

  async function uploadPicked(files: FileList | null) {
    const index = uploadIndex.current;
    if (!files || files.length === 0 || index === null) return;
    setBusy(index);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("practiceId", practiceId);
        form.set("index", String(index));
        form.set("file", file);
        const res = await fetch("/api/crm/documents/upload", {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(body?.error ?? L.genericError);
          break;
        }
      }
      router.refresh();
    } finally {
      setBusy(null);
      uploadIndex.current = null;
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  // Apertura file: link diretto alla rotta GET (redirect a URL firmato).
  // Niente window.open dopo un await: i popup blocker lo bloccavano.
  function downloadHref(index: number, fileIdx: number): string {
    const sp = new URLSearchParams({
      practiceId,
      index: String(index),
      file: String(fileIdx),
    });
    return `/api/crm/documents/download?${sp.toString()}`;
  }

  function draftDownloadHref(index: number): string {
    const sp = new URLSearchParams({
      practiceId,
      index: String(index),
      kind: "draft",
    });
    return `/api/crm/documents/download?${sp.toString()}`;
  }

  // Carica/sostituisce la bozza di una voce esistente, poi chiede se avvisare.
  function pickDraft(index: number) {
    draftIndex.current = index;
    draftInput.current?.click();
  }

  async function uploadDraftPicked(files: FileList | null) {
    const index = draftIndex.current;
    const file = files?.[0];
    if (!file || index === null) return;
    setBusy(index);
    setError(null);
    try {
      const form = new FormData();
      form.set("practiceId", practiceId);
      form.set("index", String(index));
      form.set("file", file);
      const res = await fetch("/api/crm/documents/draft", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(body?.error ?? L.genericError);
        return;
      }
      if (window.confirm(L.notifyField + "?")) {
        await notifyDraftReadyAction(practiceId, index);
      }
      router.refresh();
    } finally {
      setBusy(null);
      draftIndex.current = null;
      if (draftInput.current) draftInput.current.value = "";
    }
  }

  function removeDraftFor(index: number) {
    setBusy(index);
    setError(null);
    startTransition(async () => {
      await removeDraftAction(practiceId, index);
      router.refresh();
      setBusy(null);
    });
  }

  function notifyDraft(index: number) {
    setBusy(index);
    setError(null);
    startTransition(async () => {
      const res = await notifyDraftReadyAction(practiceId, index);
      if (!res.ok) setError(res.error);
      router.refresh();
      setBusy(null);
    });
  }

  function removeItem(index: number) {
    setBusy(index);
    setError(null);
    startTransition(async () => {
      const res = await removeChecklistItemAction(practiceId, index);
      if (!res.ok) setError(res.error);
      router.refresh();
      setBusy(null);
    });
  }

  function approve(index: number) {
    setBusy(index);
    startTransition(async () => {
      await approveDocument(practiceId, index);
      router.refresh();
      setBusy(null);
    });
  }

  function reject(index: number) {
    const reason = window.prompt(L.rejectPrompt, "");
    if (reason === null) return;
    setBusy(index);
    startTransition(async () => {
      await rejectDocument(practiceId, index, reason);
      router.refresh();
      setBusy(null);
    });
  }

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={(e) => uploadPicked(e.target.files)}
      />
      <input
        ref={draftInput}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => uploadDraftPicked(e.target.files)}
      />
      {error && (
        <p className="mt-3 rounded-lg bg-crm-rose/10 p-2.5 text-xs text-crm-rose">
          {error}
        </p>
      )}
      <ul className="mt-4 space-y-2">
      {items.map((doc) => {
        const meta = reqStatusMeta[doc.status];
        const isBusy = busy === doc.index;
        const hasFile = doc.files.length > 0;
        const canRemove = doc.source === "manual" && !hasFile;
        return (
          <li
            key={doc.index}
            className="rounded-lg border border-crm-border bg-crm-bg2/40 px-3 py-2.5 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-crm-text2" />
                <span className="truncate text-crm-text">{doc.label}</span>
                {!doc.required && (
                  <span className="text-xs text-crm-muted">(facolt.)</span>
                )}
                {hasFile && (
                  <span className="flex min-w-0 flex-wrap items-center gap-x-2 text-xs text-crm-muted">
                    {doc.files.map((name, fileIdx) => (
                      <a
                        key={`${fileIdx}-${name}`}
                        href={downloadHref(doc.index, fileIdx)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Scarica ${name}`}
                        className="inline-flex max-w-44 items-center gap-1 truncate underline-offset-2 hover:text-crm-text hover:underline"
                      >
                        <Download className="h-3 w-3 shrink-0" />
                        <span className="truncate">{name}</span>
                      </a>
                    ))}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${meta.cls}`}>
                  {meta.label}
                </span>
                {isBusy && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-crm-muted" />
                )}
                {doc.status !== "NON_APPLICABILE" && (
                  <>
                    <button
                      onClick={() => pickFile(doc.index)}
                      disabled={isBusy}
                      title={L.uploadForClient}
                      className="grid h-6 w-6 place-items-center rounded bg-crm-bg2 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                    >
                      <Upload className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => pickDraft(doc.index)}
                      disabled={isBusy}
                      title={doc.draft ? L.replaceDraft : L.prepareDraft}
                      className="grid h-6 w-6 place-items-center rounded bg-crm-bg2 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                    >
                      <FilePlus2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                {hasFile && doc.status !== "APPROVATO" && (
                  <button
                    onClick={() => approve(doc.index)}
                    disabled={isBusy}
                    title={L.approve}
                    className="grid h-6 w-6 place-items-center rounded bg-crm-green/15 text-crm-green hover:bg-crm-green/25 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                {hasFile && doc.status !== "RIFIUTATO" && (
                  <button
                    onClick={() => reject(doc.index)}
                    disabled={isBusy}
                    title={L.reject}
                    className="grid h-6 w-6 place-items-center rounded bg-crm-rose/15 text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {!hasFile && doc.status === "RIFIUTATO" && (
                  <span title={L.awaitingReupload} className="text-crm-muted">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </span>
                )}
                {canRemove && (
                  <button
                    onClick={() => removeItem(doc.index)}
                    disabled={isBusy}
                    title={L.removeItem}
                    className="grid h-6 w-6 place-items-center rounded bg-crm-bg2 text-crm-text2 hover:text-crm-rose disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            {doc.draft && (
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded border border-crm-border/70 bg-crm-bg2/60 px-2.5 py-1.5 text-xs">
                <span className="font-medium text-crm-text2">{L.draftLabel}</span>
                <a
                  href={draftDownloadHref(doc.index)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Scarica ${doc.draft.name}`}
                  className="inline-flex max-w-56 items-center gap-1 truncate text-crm-text underline-offset-2 hover:underline"
                >
                  <Download className="h-3 w-3 shrink-0" />
                  <span className="truncate">{doc.draft.name}</span>
                </a>
                {doc.draft.note && (
                  <span className="text-crm-muted">— {doc.draft.note}</span>
                )}
                <button
                  onClick={() => notifyDraft(doc.index)}
                  disabled={isBusy}
                  title={L.notifyClient}
                  className="ms-auto inline-flex items-center gap-1 rounded bg-crm-bg2 px-1.5 py-0.5 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                >
                  <Bell className="h-3 w-3" />
                  {L.notifyClient}
                </button>
                <button
                  onClick={() => removeDraftFor(doc.index)}
                  disabled={isBusy}
                  title={L.removeDraft}
                  className="inline-flex items-center gap-1 rounded bg-crm-bg2 px-1.5 py-0.5 text-crm-text2 hover:text-crm-rose disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </li>
        );
      })}
      </ul>

      {adding ? (
        <AddItemForm
          practiceId={practiceId}
          defaultNotify={hasClientEmail}
          onClose={() => setAdding(false)}
          onError={setError}
        />
      ) : (
        <button
          onClick={() => {
            setError(null);
            setAdding(true);
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-crm-border bg-crm-bg2/60 px-3 py-2 text-sm font-medium text-crm-text hover:bg-crm-bg2"
        >
          <ListPlus className="h-4 w-4" />
          {L.addItem}
        </button>
      )}
    </>
  );
}

/*
  Aggiunta di una voce alla checklist di QUESTA pratica, con bozza opzionale.
  Flusso: crea la voce (server action) -> se c'e un file, lo carica come bozza
  sulla nuova voce -> se richiesto e la bozza c'e, avvisa il cliente.
*/
function AddItemForm({
  practiceId,
  defaultNotify,
  onClose,
  onError,
}: {
  practiceId: string;
  defaultNotify: boolean;
  onClose: () => void;
  onError: (msg: string | null) => void;
}) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(true);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notify, setNotify] = useState(defaultNotify);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const trimmed = label.trim();
    if (!trimmed) {
      onError(L.labelField + " obbligatoria.");
      return;
    }
    setSaving(true);
    onError(null);
    try {
      const res = await addChecklistItemAction(practiceId, {
        label: trimmed,
        required,
        help: note.trim() || undefined,
      });
      if (!res.ok) {
        onError(res.error);
        return;
      }
      if (file) {
        const form = new FormData();
        form.set("practiceId", practiceId);
        form.set("index", String(res.index));
        form.set("file", file);
        const up = await fetch("/api/crm/documents/draft", {
          method: "POST",
          body: form,
        });
        if (!up.ok) {
          const body = (await up.json().catch(() => null)) as
            | { error?: string }
            | null;
          onError(body?.error ?? L.genericError);
          router.refresh();
          return;
        }
        if (notify) await notifyDraftReadyAction(practiceId, res.index);
      }
      router.refresh();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-crm-border bg-crm-bg2/40 p-3 text-sm">
      <p className="text-xs font-medium text-crm-text2">{L.addTitle}</p>
      <label className="block">
        <span className="text-xs text-crm-muted">{L.labelField}</span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={L.labelPlaceholder}
          className="mt-1 w-full rounded border border-crm-border bg-crm-bg px-2.5 py-1.5 text-crm-text outline-none focus:border-crm-text2"
        />
      </label>
      <label className="flex items-center gap-2 text-crm-text">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        {L.requiredField}
      </label>
      <label className="block">
        <span className="text-xs text-crm-muted">{L.noteField}</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={L.notePlaceholder}
          rows={2}
          className="mt-1 w-full rounded border border-crm-border bg-crm-bg px-2.5 py-1.5 text-crm-text outline-none focus:border-crm-text2"
        />
      </label>
      <label className="block">
        <span className="text-xs text-crm-muted">{L.draftField}</span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-xs text-crm-text2 file:mr-2 file:rounded file:border-0 file:bg-crm-bg2 file:px-2 file:py-1 file:text-crm-text"
        />
      </label>
      {file && (
        <label className="flex items-center gap-2 text-crm-text">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
          />
          {L.notifyField}
        </label>
      )}
      <p className="text-[11px] leading-4 text-crm-muted">{L.draftHint}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-crm-green/15 px-3 py-1.5 font-medium text-crm-green hover:bg-crm-green/25 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ListPlus className="h-4 w-4" />
          )}
          {L.save}
        </button>
        <button
          onClick={onClose}
          disabled={saving}
          className="rounded-lg px-3 py-1.5 text-crm-text2 hover:text-crm-text disabled:opacity-50"
        >
          {L.cancel}
        </button>
      </div>
    </div>
  );
}

/*
  Pulsante "Genera checklist" per le pratiche create a mano nel CRM (la
  checklist normalmente nasce al pagamento): permette a Lorenzo di iniziare
  subito a caricare i documenti di un cliente seguito in studio.
*/
export function GenerateChecklistButton({ practiceId }: { practiceId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await createChecklistNow(practiceId);
      if (!res.ok) setError(res.error);
      router.refresh();
    });
  }

  return (
    <div className="mt-3">
      <button
        onClick={generate}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-crm-border bg-crm-bg2/60 px-3 py-2 text-sm font-medium text-crm-text hover:bg-crm-bg2 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ListPlus className="h-4 w-4" />
        )}
        Genera checklist adesso
      </button>
      {error && <p className="mt-2 text-xs text-crm-rose">{error}</p>}
    </div>
  );
}
