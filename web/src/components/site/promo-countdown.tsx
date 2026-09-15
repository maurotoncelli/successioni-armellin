"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/*
  Conto alla rovescia della promo (lib/promo.ts). Solo presentazione: la
  scadenza arriva dal server (`endsAt`) e lo sconto vero lo decide il server
  in `buildOrder`, mai il timer. Al termine il componente sparisce (la pagina,
  al prossimo caricamento, torna al listino pieno).

  useSyncExternalStore: sul server / prima dell'idratazione lo snapshot è
  null, così niente mismatch di idratazione e niente setState in effect.
*/

export type CountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const DEFAULT_LABELS: CountdownLabels = {
  days: "giorni",
  hours: "ore",
  minutes: "min",
  seconds: "sec",
};

function subscribe(onChange: () => void): () => void {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

function getNow(): number {
  return Math.floor(Date.now() / 1000) * 1000;
}

function getServerNow(): number | null {
  return null;
}

function split(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function PromoCountdown({
  endsAt,
  labels = DEFAULT_LABELS,
  variant = "boxes",
  className,
}: {
  endsAt: string;
  labels?: CountdownLabels;
  /**
    boxes = 4 riquadri (esito/checkout); inline = "3g 04:12:55" (banner);
    auto = inline su mobile, riquadri da sm (risparmia altezza sopra i bottoni).
  */
  variant?: "boxes" | "inline" | "auto";
  className?: string;
}) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const end = Date.parse(endsAt);
  if (now === null) {
    // Placeholder della stessa altezza per evitare salti al mount.
    return (
      <span
        className={cn(
          variant === "boxes" ? "inline-block h-12" : variant === "auto" ? "inline-block h-5 sm:h-12" : "inline-block",
          className,
        )}
        aria-hidden="true"
      />
    );
  }
  const remaining = end - now;
  if (remaining <= 0) return null;
  const { days, hours, minutes, seconds } = split(remaining);

  const inline = (extra?: string) => (
    <span
      className={cn("font-mono tabular-nums", extra, className)}
      role="timer"
      aria-live="off"
      dir="ltr"
    >
      {days > 0 ? `${days}${labels.days.charAt(0)} ` : ""}
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
  if (variant === "inline") return inline();

  const cells: { value: number; label: string }[] = [
    { value: days, label: labels.days },
    { value: hours, label: labels.hours },
    { value: minutes, label: labels.minutes },
    { value: seconds, label: labels.seconds },
  ];
  const boxes = (
    <span
      className={cn(
        "inline-flex items-stretch gap-1.5",
        variant === "auto" && "max-sm:hidden",
        className,
      )}
      role="timer"
      aria-live="off"
      dir="ltr"
    >
      {cells.map((c) => (
        <span
          key={c.label}
          className="flex min-w-[2.75rem] flex-col items-center rounded-md border border-primary/15 bg-bg px-1.5 py-1 text-primary"
        >
          <span className="font-display text-base font-bold leading-none tabular-nums sm:text-lg">
            {pad(c.value)}
          </span>
          <span className="mt-0.5 text-[10px] uppercase leading-none tracking-wide text-text-muted">
            {c.label}
          </span>
        </span>
      ))}
    </span>
  );
  if (variant === "boxes") return boxes;
  return (
    <>
      {inline("text-base font-bold text-primary sm:hidden")}
      {boxes}
    </>
  );
}
