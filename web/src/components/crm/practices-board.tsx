"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KanbanSquare, List, Home, AlertCircle, Loader2 } from "lucide-react";
import {
  pipelineOrder,
  statusLabels,
  type Practice,
  type PracticeStatus,
} from "@/content/crm-data";
import { changeStatus } from "@/app/crm/pratiche/[id]/actions";
import { ActionBadge, StatusPill } from "@/components/crm/ui";
import { hasExternalEffect } from "@/lib/transitions";
import { TransitionConfirm } from "@/components/crm/transition-confirm";
import { cn } from "@/lib/utils";

type View = "kanban" | "list";

export function PracticesBoard({ practices }: { practices: Practice[] }) {
  const router = useRouter();
  const [view, setView] = useState<View>("kanban");
  const [items, setItems] = useState<Practice[]>(practices);
  const [pending, startTransition] = useTransition();
  const [movingId, setMovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    id: string;
    toStatus: PracticeStatus;
  } | null>(null);

  // Decide se chiedere conferma (transizione a effetto esterno = invia email)
  // oppure spostare subito (transizione neutra).
  function requestMove(id: string, toStatus: PracticeStatus) {
    const current = items.find((p) => p.id === id);
    if (!current || current.status === toStatus) return;
    if (hasExternalEffect(toStatus)) setPendingMove({ id, toStatus });
    else doMove(id, toStatus);
  }

  function doMove(id: string, toStatus: PracticeStatus) {
    const prev = items;
    setError(null);
    setMovingId(id);
    // ottimistico: sposta subito la card
    setItems((list) =>
      list.map((p) => (p.id === id ? { ...p, status: toStatus } : p)),
    );

    startTransition(async () => {
      const res = await changeStatus(id, toStatus);
      if (!res.ok) {
        setItems(prev); // rollback
        setError(res.error);
      } else {
        router.refresh();
      }
      setMovingId(null);
      setPendingMove(null);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-crm-text">Pratiche</h1>
          <p className="text-sm text-crm-text2">
            {items.length} pratiche · trascina una card per cambiare stato
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-crm-border bg-crm-surface p-1">
          <ToggleButton
            active={view === "kanban"}
            onClick={() => setView("kanban")}
            icon={<KanbanSquare className="h-4 w-4" />}
            label="Kanban"
          />
          <ToggleButton
            active={view === "list"}
            onClick={() => setView("list")}
            icon={<List className="h-4 w-4" />}
            label="Lista"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-crm-rose/30 bg-crm-rose/10 px-3 py-2 text-sm text-crm-rose">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {view === "kanban" ? (
        <KanbanView
          practices={items}
          onMove={requestMove}
          movingId={pending ? movingId : null}
        />
      ) : (
        <ListView practices={items} />
      )}

      {pendingMove && (
        <TransitionConfirm
          targetStatus={pendingMove.toStatus}
          pending={pending}
          onConfirm={() => doMove(pendingMove.id, pendingMove.toStatus)}
          onCancel={() => setPendingMove(null)}
        />
      )}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-crm-accent/15 text-crm-accent"
          : "text-crm-text2 hover:text-crm-text",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function KanbanView({
  practices,
  onMove,
  movingId,
}: {
  practices: Practice[];
  onMove: (id: string, toStatus: PracticeStatus) => void;
  movingId: string | null;
}) {
  const [overStatus, setOverStatus] = useState<PracticeStatus | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  /*
    Barra di scorrimento "proxy" SEMPRE visibile e sticky al fondo della
    finestra: quella nativa su macOS sparisce a riposo e, se la board prosegue
    sotto il bordo dello schermo, non si vede affatto. La barra nativa viene
    nascosta e questa proxy (sincronizzata nei due sensi) la sostituisce.
  */
  useEffect(() => {
    const board = boardRef.current;
    const proxy = proxyRef.current;
    const spacer = spacerRef.current;
    if (!board || !proxy || !spacer) return;

    const syncWidth = () => {
      spacer.style.width = `${board.scrollWidth}px`;
      proxy.style.display =
        board.scrollWidth > board.clientWidth + 1 ? "" : "none";
    };
    syncWidth();
    const ro = new ResizeObserver(syncWidth);
    ro.observe(board);

    // Assegnare lo stesso scrollLeft non ri-emette l'evento: niente loop.
    const onBoardScroll = () => {
      proxy.scrollLeft = board.scrollLeft;
    };
    const onProxyScroll = () => {
      board.scrollLeft = proxy.scrollLeft;
    };
    board.addEventListener("scroll", onBoardScroll, { passive: true });
    proxy.addEventListener("scroll", onProxyScroll, { passive: true });

    return () => {
      ro.disconnect();
      board.removeEventListener("scroll", onBoardScroll);
      proxy.removeEventListener("scroll", onProxyScroll);
    };
  }, []);

  return (
    <div>
      <div
        ref={boardRef}
        className="crm-scroll-hidden flex gap-4 overflow-x-auto pb-3"
      >
        {pipelineOrder.map((status) => {
          const columnItems = practices.filter((p) => p.status === status);
          const isOver = overStatus === status;
          return (
            <div
              key={status}
              className="w-72 shrink-0"
              onDragOver={(e) => {
                e.preventDefault();
                if (overStatus !== status) setOverStatus(status);
              }}
              onDragLeave={(e) => {
                // ignora i dragleave verso elementi figli
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setOverStatus((s) => (s === status ? null : s));
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                setOverStatus(null);
                const id = e.dataTransfer.getData("text/plain");
                if (id) onMove(id, status);
              }}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-crm-text2">
                  {statusLabels[status]}
                </h2>
                <span className="rounded-full bg-crm-surface px-2 py-0.5 text-xs text-crm-muted">
                  {columnItems.length}
                </span>
              </div>
              <div
                className={cn(
                  "min-h-24 space-y-2 rounded-[12px] p-1 transition-colors",
                  isOver && "bg-crm-accent/10 ring-1 ring-crm-accent/40",
                )}
              >
                {columnItems.map((p) => (
                  <KanbanCard key={p.id} practice={p} moving={movingId === p.id} />
                ))}
                {columnItems.length === 0 && (
                  <div className="rounded-[12px] border border-dashed border-crm-border px-3 py-6 text-center text-xs text-crm-muted">
                    Vuota
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra proxy: sticky, quindi visibile anche se la board prosegue
          sotto il bordo della finestra. */}
      <div
        ref={proxyRef}
        className="crm-scroll-x sticky bottom-0 z-10 -mx-1 overflow-x-auto overflow-y-hidden rounded-full bg-crm-bg/90 px-1 py-1 backdrop-blur"
        aria-hidden
      >
        <div ref={spacerRef} className="h-px" />
      </div>
    </div>
  );
}

function KanbanCard({
  practice,
  moving,
}: {
  practice: Practice;
  moving: boolean;
}) {
  return (
    <Link
      href={`/crm/pratiche/${practice.id}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", practice.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={cn(
        "block cursor-grab rounded-[12px] border border-crm-border bg-crm-surface p-3.5 transition-colors hover:border-crm-accent/40 active:cursor-grabbing",
        moving && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-crm-accent">{practice.code}</span>
        {moving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-crm-muted" />
        ) : (
          practice.urgent && (
            <span className="inline-flex items-center gap-1 text-xs text-crm-rose">
              <AlertCircle className="h-3.5 w-3.5" />
              Urgente
            </span>
          )
        )}
      </div>
      <p className="mt-1.5 text-sm font-medium text-crm-text">
        {practice.clientName}
      </p>
      <div className="mt-0.5 flex items-center gap-1 text-xs text-crm-muted">
        <Home className="h-3 w-3" />
        Defunto: {practice.deceasedName}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <ActionBadge owner={practice.actionOwner} />
        {practice.price > 0 && (
          <span className="text-xs font-medium text-crm-text2">
            {practice.price} €
          </span>
        )}
      </div>
    </Link>
  );
}

function ListView({ practices }: { practices: Practice[] }) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-crm-border bg-crm-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-crm-border text-left text-xs uppercase tracking-wide text-crm-muted">
            <th className="px-4 py-3 font-medium">Pratica</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Defunto</th>
            <th className="px-4 py-3 font-medium">Stato</th>
            <th className="px-4 py-3 font-medium">Azione</th>
            <th className="px-4 py-3 text-right font-medium">Onorario</th>
          </tr>
        </thead>
        <tbody>
          {practices.map((p) => (
            <tr
              key={p.id}
              className="border-b border-crm-border last:border-0 hover:bg-crm-hover/40"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/crm/pratiche/${p.id}`}
                  className="font-mono text-xs text-crm-accent hover:underline"
                >
                  {p.code}
                </Link>
              </td>
              <td className="px-4 py-3 text-crm-text">{p.clientName}</td>
              <td className="px-4 py-3 text-crm-text2">{p.deceasedName}</td>
              <td className="px-4 py-3">
                <StatusPill status={p.status} />
              </td>
              <td className="px-4 py-3">
                <ActionBadge owner={p.actionOwner} />
              </td>
              <td className="px-4 py-3 text-right text-crm-text2">
                {p.price > 0 ? `${p.price} €` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
