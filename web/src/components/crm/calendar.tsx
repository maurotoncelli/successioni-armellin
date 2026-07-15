"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
import { calEventMeta, type CalEvent, type CalEventType } from "@/content/crm-data";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];
const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const SOON_DAYS = 14;

// Tipi di evento che rappresentano una scadenza (da evidenziare se vicina/scaduta).
const DEADLINE_TYPES: ReadonlySet<CalEventType> = new Set([
  "scadenza",
  "consegna",
  "todo",
]);

function daysTo(today: string, dateStr: string): number {
  const a = Date.parse(`${today}T00:00:00Z`);
  const b = Date.parse(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.POSITIVE_INFINITY;
  return Math.round((b - a) / 86_400_000);
}

// Classe extra per evidenziare le scadenze: rosso se scaduta, giallo se imminente.
// Gli eventi "assolti" (dichiarazione inviata, to-do spuntato) non allarmano.
function urgencyRing(today: string, e: CalEvent): string {
  if (!DEADLINE_TYPES.has(e.type) || e.done) return "";
  const d = daysTo(today, e.dateStr);
  if (d < 0) return "ring-1 ring-crm-rose";
  if (d <= SOON_DAYS) return "ring-1 ring-crm-amber";
  return "";
}

type View = "mese" | "agenda";

export function Calendar({
  events,
  today,
}: {
  events: CalEvent[];
  today: string;
}) {
  const todayYear = Number(today.slice(0, 4));
  const todayMonth = Number(today.slice(5, 7)) - 1; // 0-based
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [view, setView] = useState<View>("mese");

  function shift(delta: number) {
    const m = month + delta;
    if (m < 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else if (m > 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth(m);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-crm-text">Calendario lavori</h1>
          <p className="text-sm text-crm-text2">
            Date chiave di tutte le pratiche. Clic su un evento per aprire la scheda.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-crm-border bg-crm-surface p-1">
          <button
            type="button"
            onClick={() => setView("mese")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "mese" ? "bg-crm-accent/15 text-crm-accent" : "text-crm-text2 hover:text-crm-text",
            )}
          >
            <CalendarDays className="h-4 w-4" />
            Mese
          </button>
          <button
            type="button"
            onClick={() => setView("agenda")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "agenda" ? "bg-crm-accent/15 text-crm-accent" : "text-crm-text2 hover:text-crm-text",
            )}
          >
            <List className="h-4 w-4" />
            Agenda
          </button>
        </div>
      </div>

      <Legend />

      {view === "mese" ? (
        <MonthView
          year={year}
          month={month}
          events={events}
          today={today}
          onShift={shift}
        />
      ) : (
        <AgendaView events={events} today={today} />
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-crm-text2">
      {(Object.keys(calEventMeta) as CalEventType[]).map((t) => (
        <span key={t} className="inline-flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", calEventMeta[t].dot)} />
          {calEventMeta[t].label}
        </span>
      ))}
    </div>
  );
}

function MonthView({
  year,
  month,
  events,
  today,
  onShift,
}: {
  year: number;
  month: number;
  events: CalEvent[];
  today: string;
  onShift: (d: number) => void;
}) {
  const firstDay = new Date(year, month, 1);
  // getDay(): 0=domenica -> trasformo in settimana lunedi-first
  const leading = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function eventsForDay(day: number): CalEvent[] {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.dateStr === ds);
  }

  return (
    <div className="rounded-[14px] border border-crm-border bg-crm-surface">
      <div className="flex items-center justify-between border-b border-crm-border px-4 py-3">
        <h2 className="text-sm font-semibold text-crm-text">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onShift(-1)}
            className="grid h-8 w-8 place-items-center rounded-lg text-crm-text2 hover:bg-crm-hover"
            aria-label="Mese precedente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onShift(1)}
            className="grid h-8 w-8 place-items-center rounded-lg text-crm-text2 hover:bg-crm-hover"
            aria-label="Mese successivo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-crm-border">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-2 py-2 text-center text-xs font-medium text-crm-muted">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const ds = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : "";
          const isToday = ds === today;
          const dayEvents = day ? eventsForDay(day) : [];
          return (
            <div
              key={i}
              className={cn(
                "min-h-[92px] border-b border-r border-crm-border p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0",
                !day && "bg-crm-bg2/30",
              )}
            >
              {day && (
                <>
                  <div
                    className={cn(
                      "mb-1 inline-grid h-6 w-6 place-items-center rounded-full text-xs",
                      isToday ? "crm-gradient font-semibold text-white" : "text-crm-text2",
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((e, j) => (
                      <Link
                        key={j}
                        href={`/crm/pratiche/${e.practiceId}`}
                        className={cn(
                          "block truncate rounded px-1.5 py-0.5 text-[11px] font-medium",
                          calEventMeta[e.type].chip,
                          urgencyRing(today, e),
                          e.done && "opacity-50",
                        )}
                        title={`${calEventMeta[e.type].label} · ${e.code}`}
                      >
                        {e.code.replace("SUC-2026-", "#")} {e.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView({ events, today }: { events: CalEvent[]; today: string }) {
  const upcoming = [...events]
    .filter((e) => e.dateStr >= today)
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

  return (
    <div className="rounded-[14px] border border-crm-border bg-crm-surface">
      {upcoming.length === 0 && (
        <p className="p-6 text-sm text-crm-muted">Nessun evento in arrivo.</p>
      )}
      <ul>
        {upcoming.map((e, i) => {
          const d = daysTo(today, e.dateStr);
          const isSoon = DEADLINE_TYPES.has(e.type) && !e.done && d <= SOON_DAYS;
          return (
            <li key={i} className="border-b border-crm-border last:border-0">
              <Link
                href={`/crm/pratiche/${e.practiceId}`}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 hover:bg-crm-hover/40",
                  e.done && "opacity-50",
                )}
              >
                <span className="w-24 shrink-0 text-sm text-crm-text2">{e.dateStr}</span>
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", calEventMeta[e.type].dot)} />
                <span className="text-sm text-crm-text">
                  {e.type === "todo" ? `${calEventMeta.todo.label}: ${e.label}` : calEventMeta[e.type].label}
                </span>
                {isSoon && (
                  <span className="rounded-full bg-crm-amber/15 px-2 py-0.5 text-[11px] font-medium text-crm-amber">
                    {d === 0 ? "oggi" : d === 1 ? "domani" : `tra ${d} gg`}
                  </span>
                )}
                <span className="ml-auto font-mono text-xs text-crm-accent">{e.code}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
