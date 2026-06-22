"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Send, Plus } from "lucide-react";
import {
  pipelineOrder,
  statusLabels,
  type Communication,
  type PracticeStatus,
} from "@/content/crm-data";
import {
  changeStatus,
  addCommunication,
  addNote,
} from "@/app/crm/pratiche/[id]/actions";
import { hasExternalEffect } from "@/lib/transitions";
import { TransitionConfirm } from "@/components/crm/transition-confirm";

const statusOptions: PracticeStatus[] = [...pipelineOrder, "ANNULLATA"];

const inputCls =
  "rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent";

export function StatusChanger({
  practiceId,
  status,
}: {
  practiceId: string;
  status: PracticeStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<PracticeStatus>(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function doSave() {
    setError(null);
    startTransition(async () => {
      const res = await changeStatus(practiceId, value);
      if (res.ok) {
        setConfirming(false);
        router.refresh();
      } else {
        setError(res.error);
        setConfirming(false);
      }
    });
  }

  function save() {
    if (value === status) return;
    setError(null);
    // Transizione a effetto esterno (invia email) -> conferma; altrimenti diretto.
    if (hasExternalEffect(value)) setConfirming(true);
    else doSave();
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as PracticeStatus)}
        className={inputCls}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
      <button
        onClick={save}
        disabled={pending || value === status}
        className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Cambia stato
      </button>
      {error && <span className="text-xs text-crm-rose">{error}</span>}

      {confirming && (
        <TransitionConfirm
          targetStatus={value}
          pending={pending}
          onConfirm={doSave}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

const channelLabels: Record<Communication["channel"], string> = {
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
  PHONE: "Telefono",
  IN_PERSON: "Di persona",
};

export function AddCommunication({ practiceId }: { practiceId: string }) {
  const router = useRouter();
  const [channel, setChannel] = useState<Communication["channel"]>("PHONE");
  const [direction, setDirection] =
    useState<Communication["direction"]>("OUTBOUND");
  const [subject, setSubject] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await addCommunication(practiceId, {
        channel,
        direction,
        subject,
      });
      if (res.ok) {
        setSubject("");
        router.refresh();
      } else setError(res.error);
    });
  }

  return (
    <div className="mt-4 space-y-2 border-t border-crm-border pt-4">
      <p className="text-xs font-medium text-crm-muted">Registra contatto</p>
      <div className="flex flex-wrap gap-2">
        <select
          value={channel}
          onChange={(e) =>
            setChannel(e.target.value as Communication["channel"])
          }
          className={inputCls}
        >
          {(Object.keys(channelLabels) as Communication["channel"][]).map((c) => (
            <option key={c} value={c}>
              {channelLabels[c]}
            </option>
          ))}
        </select>
        <select
          value={direction}
          onChange={(e) =>
            setDirection(e.target.value as Communication["direction"])
          }
          className={inputCls}
        >
          <option value="OUTBOUND">In uscita</option>
          <option value="INBOUND">In entrata</option>
        </select>
      </div>
      <div className="flex gap-2">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Oggetto del contatto…"
          className={`${inputCls} flex-1`}
        />
        <button
          onClick={submit}
          disabled={pending || !subject.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Registra
        </button>
      </div>
      {error && <p className="text-xs text-crm-rose">{error}</p>}
    </div>
  );
}

export function AddNote({ practiceId }: { practiceId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await addNote(practiceId, text);
      if (res.ok) {
        setText("");
        router.refresh();
      } else setError(res.error);
    });
  }

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Aggiungi una nota…"
        className={`${inputCls} w-full resize-y`}
      />
      <button
        onClick={submit}
        disabled={pending || !text.trim()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-1.5 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Aggiungi nota
      </button>
      {error && <p className="text-xs text-crm-rose">{error}</p>}
    </div>
  );
}
