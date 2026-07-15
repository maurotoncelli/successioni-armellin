"use client";

import { useEffect, useMemo, useRef } from "react";
import { Trophy, X } from "lucide-react";

/*
  Celebrazione "pratica conclusa" (@05, gamification per Lorenzo): overlay con
  coriandoli + annuncio + fanfara di vittoria. Il suono e sintetizzato al volo
  con la Web Audio API (nessun file audio da servire) e parte in risposta a un
  gesto dell'utente (il click che ha chiuso la pratica), quindi l'autoplay
  policy del browser non lo blocca.
*/

const CONFETTI_COLORS = [
  "#818cf8", // accent
  "#a78bfa", // purple
  "#2dd4bf", // teal
  "#fbbf24", // amber
  "#fb7185", // rose
  "#34d399", // green
];

const CONFETTI_COUNT = 60;

function playFanfare() {
  try {
    type AudioContextCtor = typeof AudioContext;
    const Ctx: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();

    // Arpeggio maggiore ascendente + accordo finale: la classica "vittoria".
    const notes: { freq: number; at: number; dur: number; gain: number }[] = [
      { freq: 523.25, at: 0.0, dur: 0.16, gain: 0.28 }, // C5
      { freq: 659.25, at: 0.14, dur: 0.16, gain: 0.28 }, // E5
      { freq: 783.99, at: 0.28, dur: 0.16, gain: 0.28 }, // G5
      { freq: 1046.5, at: 0.42, dur: 0.5, gain: 0.32 }, // C6 (tenuta)
      // accordo finale sotto la tenuta
      { freq: 523.25, at: 0.42, dur: 0.5, gain: 0.12 },
      { freq: 659.25, at: 0.42, dur: 0.5, gain: 0.12 },
      { freq: 783.99, at: 0.42, dur: 0.5, gain: 0.12 },
    ];

    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = n.freq;
      const t0 = ctx.currentTime + n.at;
      const t1 = t0 + n.dur;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(n.gain, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t1);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t0);
      osc.stop(t1 + 0.05);
    }

    // Chiudi il contesto quando la fanfara e finita (libera l'hardware audio).
    window.setTimeout(() => {
      void ctx.close();
    }, 1500);
  } catch {
    // Niente audio? Pazienza: la festa resta visiva.
  }
}

type ConfettoStyle = React.CSSProperties & Record<"--drift", string>;

export function Celebration({
  closedTotal,
  onClose,
}: {
  closedTotal: number;
  onClose: () => void;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    playFanfare();
    const t = window.setTimeout(() => closeRef.current(), 8000);
    return () => window.clearTimeout(t);
  }, []);

  // Coriandoli generati una volta sola (posizioni/ritardi/colori casuali).
  const confetti = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => {
        const style: ConfettoStyle = {
          left: `${Math.random() * 100}%`,
          backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          width: `${6 + Math.random() * 6}px`,
          height: `${10 + Math.random() * 8}px`,
          animationDelay: `${Math.random() * 1.2}s`,
          animationDuration: `${2.6 + Math.random() * 2}s`,
          "--drift": `${(Math.random() - 0.5) * 240}px`,
        };
        return <span key={i} className="crm-confetto" style={style} />;
      }),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Pratica conclusa"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti}
      </div>

      <div
        className="crm-celebration-card relative w-full max-w-sm rounded-2xl border border-crm-border bg-crm-surface p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-crm-muted hover:bg-crm-hover hover:text-crm-text"
          aria-label="Chiudi"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="crm-celebration-trophy mx-auto grid h-16 w-16 place-items-center rounded-full crm-gradient text-white">
          <Trophy className="h-8 w-8" />
        </span>

        <h2 className="mt-4 text-2xl font-bold text-crm-text">
          Pratica conclusa!
        </h2>
        <p className="mt-2 text-sm text-crm-text2">
          Un&apos;altra famiglia servita: il cliente ha ricevuto l&apos;email e
          trova i documenti finali nella sua area.
        </p>
        <p className="mt-3 text-sm font-semibold text-crm-accent">
          {closedTotal === 1
            ? "È la prima pratica chiusa dell'anno: si comincia!"
            : `Sono ${closedTotal} le pratiche chiuse quest'anno. Grande!`}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg crm-gradient px-4 py-2.5 text-sm font-semibold text-white"
        >
          Evviva
        </button>
      </div>
    </div>
  );
}
