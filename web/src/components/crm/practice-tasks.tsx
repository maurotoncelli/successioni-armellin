"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { TaskItem } from "@/content/crm-data";
import { addTask, toggleTask, removeTask } from "@/app/crm/pratiche/[id]/actions";
import { cn } from "@/lib/utils";

export function PracticeTasks({
  practiceId,
  tasks,
}: {
  practiceId: string;
  tasks: TaskItem[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    startTransition(async () => {
      await addTask(practiceId, title, dueDate || undefined);
      setTitle("");
      setDueDate("");
      router.refresh();
      setAdding(false);
    });
  }

  function toggle(index: number, done: boolean) {
    setBusy(index);
    startTransition(async () => {
      await toggleTask(practiceId, index, done);
      router.refresh();
      setBusy(null);
    });
  }

  function remove(index: number) {
    setBusy(index);
    startTransition(async () => {
      await removeTask(practiceId, index);
      router.refresh();
      setBusy(null);
    });
  }

  return (
    <div>
      {tasks.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {tasks.map((t, i) => (
            <li key={i} className="group flex items-start gap-2.5 text-sm">
              <button
                type="button"
                onClick={() => toggle(i, !t.done)}
                disabled={busy === i}
                className={cn(
                  "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border",
                  t.done
                    ? "border-crm-green bg-crm-green/20 text-crm-green"
                    : "border-crm-border-strong hover:border-crm-accent",
                )}
                aria-label={t.done ? "Segna da fare" : "Completa"}
              >
                {busy === i ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : t.done ? (
                  "✓"
                ) : null}
              </button>
              <span className={cn("flex-1", t.done ? "text-crm-muted line-through" : "text-crm-text")}>
                {t.title}
                {t.dueDate && <span className="text-crm-muted"> · {t.dueDate}</span>}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={busy === i}
                className="text-crm-muted opacity-0 transition-opacity hover:text-crm-rose group-hover:opacity-100"
                aria-label="Elimina"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-crm-muted">Nessun promemoria.</p>
      )}

      <form onSubmit={add} className="mt-4 space-y-2 border-t border-crm-border pt-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nuovo promemoria…"
          className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
          />
          <button
            type="submit"
            disabled={adding || !title.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-1.5 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Aggiungi
          </button>
        </div>
      </form>
    </div>
  );
}
