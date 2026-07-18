"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, Home, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  moltiplicatoreFabbricato,
  valoreCatastaleFabbricato,
  valoreCatastaleTerreno,
  RIVALUTAZIONE_RENDITA,
  RIVALUTAZIONE_REDDITO_DOMINICALE,
  MOLTIPLICATORE_TERRENI,
} from "@/lib/catasto";
import { trackEvent } from "@/lib/analytics";
import {
  CATASTALE_CATEGORIE_IT,
  type CatastaleCategoria,
} from "@/lib/site-ui-labels";

/*
  Calcolatore pubblico del valore catastale ai fini successori (@09 SEO).
  Tutto lato client, nessun dato salvato: stessa logica pura (lib/catasto)
  usata dal generatore della dichiarazione, quindi risultato identico a
  quello che Lorenzo usa nelle pratiche vere.
*/

type Tipo = "fabbricato" | "terreno";

function parseImporto(raw: string): number | null {
  let cleaned = raw.trim().replace(/\s/g, "");
  if (!cleaned) return null;
  if (cleaned.includes(",")) {
    // Formato italiano: i punti sono separatori delle migliaia.
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    const dots = cleaned.split(".").length - 1;
    // "631.37" -> decimale; "1.234" o "1.234.567" -> migliaia.
    if (dots > 1 || (dots === 1 && /\.\d{3}$/.test(cleaned))) {
      cleaned = cleaned.replace(/\./g, "");
    }
  }
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function eur(n: number, numberLocale: string): string {
  return `${n.toLocaleString(numberLocale)} €`;
}

type Props = {
  labels: {
    fabbricato: string;
    terreno: string;
    rendita: string;
    renditaHelp: string;
    redditoDominicale: string;
    redditoDominicaleHelp: string;
    categoria: string;
    primaCasa: string;
    risultato: string;
    formulaIntro: string;
  };
  categorie?: CatastaleCategoria[];
  numberLocale?: string;
};

export function CatastaleCalculator({
  labels,
  categorie = CATASTALE_CATEGORIE_IT,
  numberLocale = "it-IT",
}: Props) {
  const [tipo, setTipo] = useState<Tipo>("fabbricato");
  const [rendita, setRendita] = useState("");
  const [categoria, setCategoria] = useState<string>("A");
  const [primaCasa, setPrimaCasa] = useState(false);
  const trackedRef = useRef(false);

  const importo = parseImporto(rendita);

  const result = useMemo(() => {
    if (importo === null) return null;
    if (tipo === "terreno") {
      return {
        valore: valoreCatastaleTerreno(importo),
        formula: `${importo.toLocaleString(numberLocale)} € × ${RIVALUTAZIONE_REDDITO_DOMINICALE.toLocaleString(numberLocale)} × ${MOLTIPLICATORE_TERRENI}`,
      };
    }
    const mult = moltiplicatoreFabbricato(categoria, primaCasa);
    return {
      valore: valoreCatastaleFabbricato(importo, categoria, primaCasa),
      formula: `${importo.toLocaleString(numberLocale)} € × ${RIVALUTAZIONE_RENDITA.toLocaleString(numberLocale)} × ${mult.toLocaleString(numberLocale)}`,
    };
  }, [tipo, importo, categoria, primaCasa, numberLocale]);

  // Un solo evento per sessione di calcolo (primo risultato mostrato).
  // Effetto e non render body: trackEvent e un side effect (gtag).
  useEffect(() => {
    if (result && !trackedRef.current) {
      trackedRef.current = true;
      trackEvent("tool_valore_catastale", { tipo });
    }
  }, [result, tipo]);

  const tabs: { key: Tipo; label: string; icon: typeof Home }[] = [
    { key: "fabbricato", label: labels.fabbricato, icon: Home },
    { key: "terreno", label: labels.terreno, icon: TreePine },
  ];

  return (
    <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm sm:p-8">
      <div className="grid grid-cols-2 gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTipo(t.key)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[10px] border px-4 py-3 text-sm font-medium transition-colors",
              tipo === t.key
                ? "border-accent bg-accent/10 text-accent-dark"
                : "border-primary/15 bg-bg text-text-muted hover:border-accent/40",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="importo-catastale"
            className="mb-1.5 block text-sm font-medium text-primary"
          >
            {tipo === "fabbricato" ? labels.rendita : labels.redditoDominicale}
          </label>
          <input
            id="importo-catastale"
            type="text"
            inputMode="decimal"
            value={rendita}
            onChange={(e) => setRendita(e.target.value)}
            placeholder={tipo === "fabbricato" ? "es. 631,37" : "es. 45,80"}
            className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-text-muted">
            {tipo === "fabbricato" ? labels.renditaHelp : labels.redditoDominicaleHelp}
          </p>
        </div>

        {tipo === "fabbricato" && (
          <>
            <div>
              <label
                htmlFor="categoria-catastale"
                className="mb-1.5 block text-sm font-medium text-primary"
              >
                {labels.categoria}
              </label>
              <select
                id="categoria-catastale"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                disabled={primaCasa}
                className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none disabled:opacity-50"
              >
                {categorie.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-3 text-sm text-text">
              <input
                type="checkbox"
                checked={primaCasa}
                onChange={(e) => setPrimaCasa(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
              />
              <span>{labels.primaCasa}</span>
            </label>
          </>
        )}
      </div>

      <div
        className={cn(
          "mt-6 rounded-xl border p-5 transition-colors",
          result
            ? "border-accent/30 bg-accent/5"
            : "border-dashed border-primary/15 bg-bg-muted",
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
          <Calculator className="h-4 w-4" />
          {labels.risultato}
        </div>
        {result ? (
          <>
            <p className="mt-2 font-display text-3xl font-bold text-primary">
              {eur(result.valore, numberLocale)}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {labels.formulaIntro} {result.formula}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-text-muted">—</p>
        )}
      </div>
    </div>
  );
}
