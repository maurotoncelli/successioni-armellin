"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  PencilLine,
  Save,
  Plus,
  Trash2,
  FileDown,
} from "lucide-react";
import type {
  ExtractionResult,
  ExtractionData,
  ExtractedPerson,
  ExtractedImmobile,
} from "@/lib/extraction";
import {
  runAiExtraction,
  saveExtractionEdits,
  exportSucXml,
} from "@/app/crm/pratiche/[id]/actions";

/*
  Pannello "Dichiarazione (dati + XML)" della scheda pratica (@05):
  1. Lorenzo lancia l'estrazione AI sui documenti caricati + appunti chiamata;
  2. rivede e CORREGGE i dati campo per campo (la revisione e la fonte di
     verita, non l'AI);
  3. scarica la bozza XML .suc da controllare con il modulo AdE nel Desktop
     Telematico e inviare via Entratel.
*/

const inputCls =
  "w-full rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1 text-xs text-crm-text outline-none focus:border-crm-accent";

const emptyPerson: ExtractedPerson = {
  cognome: null,
  nome: null,
  codice_fiscale: null,
  sesso: null,
  data_nascita: null,
  comune_nascita: null,
  provincia_nascita: null,
  comune_residenza: null,
  provincia_residenza: null,
  indirizzo_residenza: null,
  grado_parentela: null,
  quota_eredita: null,
};

const emptyImmobile: ExtractedImmobile = {
  catasto: null,
  comune: null,
  provincia: null,
  codice_comune: null,
  foglio: null,
  particella: null,
  subalterno: null,
  categoria: null,
  classe: null,
  consistenza: null,
  rendita: null,
  quota_possesso: null,
  indirizzo: null,
};

function emptyData(): ExtractionData {
  return {
    defunto: {
      cognome: null,
      nome: null,
      codice_fiscale: null,
      sesso: null,
      data_nascita: null,
      comune_nascita: null,
      provincia_nascita: null,
      data_decesso: null,
      stato_civile: null,
      comune_ultima_residenza: null,
      provincia_ultima_residenza: null,
      indirizzo_ultima_residenza: null,
    },
    eredi: [],
    testamento: { presente: false, tipo: null, data_pubblicazione: null, notaio: null },
    immobili: [],
    rapporti_bancari: [],
    altri_beni: [],
    avvertenze: [],
  };
}

export function ExtractionPanel({
  practiceId,
  initial,
  aiConfigured,
  docsReady,
}: {
  practiceId: string;
  initial: ExtractionResult | null;
  aiConfigured: boolean;
  docsReady: number;
}) {
  const router = useRouter();
  const [result, setResult] = useState<ExtractionResult | null>(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ExtractionData | null>(null);
  const [warnings, setWarnings] = useState<string[] | null>(null);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<"extract" | "save" | "export" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const data = result?.status === "READY" ? result.data : undefined;

  function run() {
    setError(null);
    setWarnings(null);
    setBusy("extract");
    startTransition(async () => {
      const res = await runAiExtraction(practiceId);
      setBusy(null);
      if (res.ok) {
        setResult(res.result);
        setEditing(false);
        router.refresh();
      } else setError(res.error);
    });
  }

  function startEdit() {
    setDraft(structuredClone(data ?? emptyData()));
    setEditing(true);
    setError(null);
    setWarnings(null);
  }

  function saveEdits() {
    if (!draft) return;
    setError(null);
    setBusy("save");
    startTransition(async () => {
      const res = await saveExtractionEdits(practiceId, draft);
      setBusy(null);
      if (res.ok) {
        setResult((prev) => ({
          model: prev?.model ?? "manuale",
          extractedAt: prev?.extractedAt ?? new Date().toISOString(),
          docsUsed: prev?.docsUsed ?? [],
          docsSkipped: prev?.docsSkipped ?? [],
          usedCallNotes: prev?.usedCallNotes ?? false,
          status: "READY",
          data: draft,
          reviewedAt: new Date().toISOString(),
        }));
        setEditing(false);
        router.refresh();
      } else setError(res.error);
    });
  }

  function exportXml() {
    setError(null);
    setWarnings(null);
    setBusy("export");
    startTransition(async () => {
      const res = await exportSucXml(practiceId);
      setBusy(null);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setWarnings(res.warnings);
      const blob = new Blob([res.xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-crm-text">
            <Sparkles className="h-4 w-4 text-crm-purple" />
            Dichiarazione: dati e XML
          </p>
          <p className="mt-0.5 text-xs text-crm-muted">
            {result?.status === "READY"
              ? `Estrazione ${result.extractedAt.slice(0, 16).replace("T", " ")} · ${result.docsUsed.length} documenti${result.usedCallNotes ? " + appunti" : ""}${result.reviewedAt ? ` · revisionata ${result.reviewedAt.slice(0, 16).replace("T", " ")}` : ""}`
              : "L'AI legge documenti e appunti chiamata e prepara i dati; tu li rivedi e scarichi l'XML .suc."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!editing && (
            <button
              onClick={run}
              disabled={pending || !aiConfigured}
              className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy === "extract" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : result ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {busy === "extract"
                ? "Estrazione…"
                : result
                  ? "Ripeti estrazione"
                  : "Estrai dati con AI"}
            </button>
          )}
          {!editing && (
            <button
              onClick={startEdit}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
            >
              <PencilLine className="h-4 w-4" />
              {data ? "Revisiona" : "Compila a mano"}
            </button>
          )}
          {!editing && data && (
            <button
              onClick={exportXml}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
            >
              {busy === "export" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              Scarica XML (.suc)
            </button>
          )}
        </div>
      </div>

      {!aiConfigured && !editing && (
        <p className="mt-3 rounded-lg bg-crm-bg2/60 p-3 text-xs text-crm-muted">
          AI non ancora attiva (manca OPENAI_API_KEY): puoi comunque compilare i
          dati a mano e generare l&apos;XML.
        </p>
      )}
      {aiConfigured && !result && docsReady === 0 && !editing && (
        <p className="mt-3 rounded-lg bg-crm-bg2/60 p-3 text-xs text-crm-muted">
          Nessun documento caricato: l&apos;estrazione usera solo gli appunti
          chiamata (se presenti).
        </p>
      )}
      {busy === "extract" && (
        <p className="mt-3 text-xs text-crm-muted">
          Puo richiedere fino a un minuto con molti documenti…
        </p>
      )}
      {error && <p className="mt-3 text-xs text-crm-rose">{error}</p>}
      {result?.status === "ERROR" && !pending && !error && !editing && (
        <p className="mt-3 text-xs text-crm-rose">{result.error}</p>
      )}

      {warnings && warnings.length > 0 && (
        <div className="mt-3 rounded-lg border border-crm-amber/30 bg-crm-amber/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-crm-amber">
            <AlertTriangle className="h-3.5 w-3.5" />
            XML scaricato: cose da sistemare nel Desktop Telematico
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-crm-text2">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {editing && draft && (
        <EditForm
          draft={draft}
          setDraft={setDraft}
          onSave={saveEdits}
          onCancel={() => setEditing(false)}
          saving={busy === "save"}
        />
      )}

      {!editing && data && (
        <ReadView data={data} result={result} />
      )}
    </div>
  );
}

/* ============================== Vista lettura ============================== */

function ReadView({
  data,
  result,
}: {
  data: ExtractionData;
  result: ExtractionResult | null;
}) {
  return (
    <div className="mt-4 space-y-4">
      {data.avvertenze.length > 0 && (
        <div className="rounded-lg border border-crm-amber/30 bg-crm-amber/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-crm-amber">
            <AlertTriangle className="h-3.5 w-3.5" />
            Da verificare (segnalazioni AI)
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-crm-text2">
            {data.avvertenze.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <Block title="Defunto">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
          <Field label="Cognome" value={data.defunto.cognome} />
          <Field label="Nome" value={data.defunto.nome} />
          <Field label="Codice fiscale" value={data.defunto.codice_fiscale} />
          <Field
            label="Nascita"
            value={join(data.defunto.data_nascita, join(data.defunto.comune_nascita, data.defunto.provincia_nascita, " "), " - ")}
          />
          <Field label="Decesso" value={data.defunto.data_decesso} />
          <Field label="Stato civile" value={data.defunto.stato_civile} />
          <Field
            label="Ultima residenza"
            value={join(
              data.defunto.indirizzo_ultima_residenza,
              join(data.defunto.comune_ultima_residenza, data.defunto.provincia_ultima_residenza, " "),
              ", ",
            )}
          />
        </dl>
      </Block>

      <Block title={`Eredi (${data.eredi.length})`}>
        {data.eredi.length === 0 && (
          <p className="text-xs text-crm-muted">Nessun erede individuato.</p>
        )}
        {data.eredi.map((e, i) => (
          <dl
            key={i}
            className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-crm-border pb-2 text-xs last:border-0 last:pb-0 sm:grid-cols-3"
          >
            <Field label="Cognome e nome" value={join(e.cognome, e.nome, " ")} />
            <Field label="Codice fiscale" value={e.codice_fiscale} />
            <Field label="Parentela" value={e.grado_parentela} />
            <Field
              label="Nascita"
              value={join(e.data_nascita, join(e.comune_nascita, e.provincia_nascita, " "), " - ")}
            />
            <Field
              label="Residenza"
              value={join(e.indirizzo_residenza, join(e.comune_residenza, e.provincia_residenza, " "), ", ")}
            />
            <Field label="Quota" value={e.quota_eredita} />
          </dl>
        ))}
      </Block>

      {data.testamento.presente && (
        <Block title="Testamento">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
            <Field label="Tipo" value={data.testamento.tipo} />
            <Field label="Pubblicazione" value={data.testamento.data_pubblicazione} />
            <Field label="Notaio" value={data.testamento.notaio} />
          </dl>
        </Block>
      )}

      {data.immobili.length > 0 && (
        <Block title={`Immobili (${data.immobili.length})`}>
          {data.immobili.map((im, i) => (
            <dl
              key={i}
              className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-crm-border pb-2 text-xs last:border-0 last:pb-0 sm:grid-cols-4"
            >
              <Field label="Catasto" value={im.catasto} />
              <Field label="Comune" value={join(im.comune, im.provincia, " ")} />
              <Field
                label="Fg. / Part. / Sub."
                value={join(im.foglio, join(im.particella, im.subalterno, " / "), " / ")}
              />
              <Field label="Cat. / Classe" value={join(im.categoria, im.classe, " / ")} />
              <Field label="Consistenza" value={im.consistenza} />
              <Field label="Rendita" value={im.rendita} />
              <Field label="Quota" value={im.quota_possesso} />
              <Field label="Indirizzo" value={im.indirizzo} />
            </dl>
          ))}
        </Block>
      )}

      {data.rapporti_bancari.length > 0 && (
        <Block title={`Rapporti bancari (${data.rapporti_bancari.length})`}>
          {data.rapporti_bancari.map((r, i) => (
            <p key={i} className="text-xs text-crm-text">
              {[r.istituto, r.tipo, r.riferimento, r.saldo].filter(Boolean).join(" · ") || "—"}
            </p>
          ))}
        </Block>
      )}

      {data.altri_beni.length > 0 && (
        <Block title={`Altri beni (${data.altri_beni.length})`}>
          {data.altri_beni.map((b, i) => (
            <p key={i} className="text-xs text-crm-text">
              {[b.descrizione, b.valore].filter(Boolean).join(" · ") || "—"}
            </p>
          ))}
        </Block>
      )}

      {result && result.docsSkipped.length > 0 && (
        <p className="text-xs text-crm-muted">
          Documenti esclusi dall&apos;estrazione: {result.docsSkipped.join(", ")}
        </p>
      )}
      <p className="text-xs text-crm-muted">
        Bozza da verificare sui documenti originali. L&apos;XML scaricato va
        sempre controllato con il modulo di controllo AdE (Desktop Telematico)
        prima dell&apos;invio via Entratel.
      </p>
    </div>
  );
}

/* ============================== Form revisione ============================= */

function EditForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
}: {
  draft: ExtractionData;
  setDraft: (d: ExtractionData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  function patch(updates: Partial<ExtractionData>) {
    setDraft({ ...draft, ...updates });
  }

  return (
    <div className="mt-4 space-y-4">
      <Block title="Defunto">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(
            [
              ["cognome", "Cognome"],
              ["nome", "Nome"],
              ["codice_fiscale", "Codice fiscale"],
              ["sesso", "Sesso (M/F)"],
              ["data_nascita", "Data nascita (GG/MM/AAAA)"],
              ["comune_nascita", "Comune nascita"],
              ["provincia_nascita", "Prov. nascita"],
              ["data_decesso", "Data decesso"],
              ["stato_civile", "Stato civile"],
              ["comune_ultima_residenza", "Comune ultima residenza"],
              ["provincia_ultima_residenza", "Prov."],
              ["indirizzo_ultima_residenza", "Indirizzo"],
            ] as const
          ).map(([key, label]) => (
            <Input
              key={key}
              label={label}
              value={draft.defunto[key]}
              onChange={(v) => patch({ defunto: { ...draft.defunto, [key]: v } })}
            />
          ))}
        </div>
      </Block>

      <Block
        title={`Eredi (${draft.eredi.length})`}
        action={
          <AddButton
            label="Aggiungi erede"
            onClick={() => patch({ eredi: [...draft.eredi, { ...emptyPerson }] })}
          />
        }
      >
        {draft.eredi.map((e, idx) => (
          <RowCard
            key={idx}
            onRemove={() => patch({ eredi: draft.eredi.filter((_, i) => i !== idx) })}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                [
                  ["cognome", "Cognome"],
                  ["nome", "Nome"],
                  ["codice_fiscale", "Codice fiscale"],
                  ["sesso", "Sesso (M/F)"],
                  ["grado_parentela", "Parentela (coniuge/figlio/…)"],
                  ["quota_eredita", "Quota (es. 1/2)"],
                  ["data_nascita", "Data nascita"],
                  ["comune_nascita", "Comune nascita"],
                  ["provincia_nascita", "Prov."],
                  ["comune_residenza", "Comune residenza"],
                  ["provincia_residenza", "Prov."],
                  ["indirizzo_residenza", "Indirizzo"],
                ] as const
              ).map(([key, label]) => (
                <Input
                  key={key}
                  label={label}
                  value={e[key]}
                  onChange={(v) =>
                    patch({
                      eredi: draft.eredi.map((item, i) =>
                        i === idx ? { ...item, [key]: v } : item,
                      ),
                    })
                  }
                />
              ))}
            </div>
          </RowCard>
        ))}
      </Block>

      <Block title="Testamento">
        <label className="flex items-center gap-2 text-xs text-crm-text">
          <input
            type="checkbox"
            checked={draft.testamento.presente}
            onChange={(e) =>
              patch({ testamento: { ...draft.testamento, presente: e.target.checked } })
            }
          />
          Testamento presente
        </label>
        {draft.testamento.presente && (
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Input
              label="Tipo (olografo/pubblico…)"
              value={draft.testamento.tipo}
              onChange={(v) => patch({ testamento: { ...draft.testamento, tipo: v } })}
            />
            <Input
              label="Data pubblicazione"
              value={draft.testamento.data_pubblicazione}
              onChange={(v) =>
                patch({ testamento: { ...draft.testamento, data_pubblicazione: v } })
              }
            />
            <Input
              label="Notaio"
              value={draft.testamento.notaio}
              onChange={(v) => patch({ testamento: { ...draft.testamento, notaio: v } })}
            />
          </div>
        )}
      </Block>

      <Block
        title={`Immobili (${draft.immobili.length})`}
        action={
          <AddButton
            label="Aggiungi immobile"
            onClick={() => patch({ immobili: [...draft.immobili, { ...emptyImmobile }] })}
          />
        }
      >
        {draft.immobili.map((im, idx) => (
          <RowCard
            key={idx}
            onRemove={() =>
              patch({ immobili: draft.immobili.filter((_, i) => i !== idx) })
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  ["catasto", "Catasto (fabbricati/terreni)"],
                  ["comune", "Comune"],
                  ["provincia", "Prov."],
                  ["codice_comune", "Codice comune"],
                  ["foglio", "Foglio"],
                  ["particella", "Particella"],
                  ["subalterno", "Subalterno"],
                  ["categoria", "Categoria"],
                  ["classe", "Classe"],
                  ["consistenza", "Consistenza"],
                  ["rendita", "Rendita"],
                  ["quota_possesso", "Quota (es. 1/1)"],
                  ["indirizzo", "Indirizzo"],
                ] as const
              ).map(([key, label]) => (
                <Input
                  key={key}
                  label={label}
                  value={im[key]}
                  onChange={(v) =>
                    patch({
                      immobili: draft.immobili.map((item, i) =>
                        i === idx ? { ...item, [key]: v } : item,
                      ),
                    })
                  }
                />
              ))}
            </div>
          </RowCard>
        ))}
      </Block>

      <Block
        title={`Rapporti bancari (${draft.rapporti_bancari.length})`}
        action={
          <AddButton
            label="Aggiungi rapporto"
            onClick={() =>
              patch({
                rapporti_bancari: [
                  ...draft.rapporti_bancari,
                  { istituto: null, tipo: null, riferimento: null, saldo: null },
                ],
              })
            }
          />
        }
      >
        {draft.rapporti_bancari.map((r, idx) => (
          <RowCard
            key={idx}
            onRemove={() =>
              patch({
                rapporti_bancari: draft.rapporti_bancari.filter((_, i) => i !== idx),
              })
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  ["istituto", "Istituto"],
                  ["tipo", "Tipo"],
                  ["riferimento", "IBAN / n. rapporto"],
                  ["saldo", "Saldo"],
                ] as const
              ).map(([key, label]) => (
                <Input
                  key={key}
                  label={label}
                  value={r[key]}
                  onChange={(v) =>
                    patch({
                      rapporti_bancari: draft.rapporti_bancari.map((item, i) =>
                        i === idx ? { ...item, [key]: v } : item,
                      ),
                    })
                  }
                />
              ))}
            </div>
          </RowCard>
        ))}
      </Block>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salva revisione
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text hover:border-crm-accent/40"
        >
          Annulla
        </button>
      </div>
    </div>
  );
}

/* =============================== Elementi UI =============================== */

function Block({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-crm-border bg-crm-bg2/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-crm-text2">{title}</p>
        {action}
      </div>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

function RowCard({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="relative rounded-lg border border-crm-border bg-crm-surface/60 p-2 pr-8">
      {children}
      <button
        onClick={onRemove}
        title="Rimuovi"
        className="absolute right-2 top-2 text-crm-muted hover:text-crm-rose"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs text-crm-accent hover:underline"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[11px] text-crm-muted">{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={inputCls}
      />
    </label>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-crm-muted">{label}</dt>
      <dd className={value ? "text-crm-text" : "text-crm-muted"}>{value || "—"}</dd>
    </div>
  );
}

function join(a: string | null, b: string | null, sep: string): string | null {
  if (a && b) return `${a}${sep}${b}`;
  return a || b || null;
}
