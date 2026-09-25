import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import type { Esito } from "@/lib/quote";

/*
  Contatore questionari preventivo completati (anche senza lasciare email).
  NO-DDL: JSON in Storage `practice-docs/site/_quote-stats.json`.
  Complementare alle notifiche CRM (che Lorenzo puo cancellare): qui il totale
  resta per le Statistiche. `byDay` (giorno di Roma → completati) serve a
  confrontare periodi, es. il test prezzo unico; tiene gli ultimi BY_DAY_KEEP giorni.
*/

const STORAGE_PATH = "site/_quote-stats.json";
const BY_DAY_KEEP = 400;

export type QuoteStats = {
  totalCompleted: number;
  byEsito: Record<Esito, number>;
  byDay: Record<string, number>;
  updatedAt: string | null;
  lastEsito: Esito | null;
};

function emptyStats(): QuoteStats {
  return {
    totalCompleted: 0,
    byEsito: { a: 0, b: 0, c: 0 },
    byDay: {},
    updatedAt: null,
    lastEsito: null,
  };
}

const ROME_DAY = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome" });

/** Giorno di calendario a Roma, "YYYY-MM-DD". */
export function romeDayKey(date = new Date()): string {
  return ROME_DAY.format(date);
}

function isEsito(v: unknown): v is Esito {
  return v === "a" || v === "b" || v === "c";
}

function normalizeByDay(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const [day, n] of Object.entries(raw as Record<string, unknown>)) {
    const count = Math.max(0, Number(n) || 0);
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && count > 0) out[day] = count;
  }
  return out;
}

function bumpDay(byDay: Record<string, number>, delta: number): Record<string, number> {
  const today = romeDayKey();
  const next = { ...byDay, [today]: Math.max(0, (byDay[today] ?? 0) + delta) };
  if (next[today] === 0) delete next[today];
  const days = Object.keys(next).sort();
  for (const old of days.slice(0, Math.max(0, days.length - BY_DAY_KEEP))) delete next[old];
  return next;
}

function normalize(raw: unknown): QuoteStats {
  if (!raw || typeof raw !== "object") return emptyStats();
  const o = raw as Partial<QuoteStats>;
  const by =
    o.byEsito && typeof o.byEsito === "object"
      ? (o.byEsito as Partial<Record<Esito, number>>)
      : {};
  return {
    totalCompleted: Math.max(0, Number(o.totalCompleted) || 0),
    byEsito: {
      a: Math.max(0, Number(by.a) || 0),
      b: Math.max(0, Number(by.b) || 0),
      c: Math.max(0, Number(by.c) || 0),
    },
    byDay: normalizeByDay(o.byDay),
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
    lastEsito: isEsito(o.lastEsito) ? o.lastEsito : null,
  };
}

export async function getQuoteStats(): Promise<QuoteStats> {
  if (!isAdminConfigured) return emptyStats();
  try {
    const { data, error } = await getAdminClient()
      .storage.from(DOC_BUCKET)
      .download(STORAGE_PATH);
    if (error || !data) return emptyStats();
    return normalize(JSON.parse(await data.text()));
  } catch (err) {
    console.error("[quote-stats] read:", err);
    return emptyStats();
  }
}

/** Somma dei completati tra due giorni di Roma inclusi ("YYYY-MM-DD"). */
export function sumQuoteDays(stats: QuoteStats, fromDay: string, toDay: string): number {
  let total = 0;
  for (const [day, n] of Object.entries(stats.byDay)) {
    if (day >= fromDay && day <= toDay) total += n;
  }
  return total;
}

async function persistQuote(next: QuoteStats): Promise<QuoteStats> {
  const admin = getAdminClient();
  await ensureDocBucket(admin);
  const blob = Buffer.from(JSON.stringify(next), "utf8");
  const { error } = await admin.storage.from(DOC_BUCKET).upload(STORAGE_PATH, blob, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw error;
  return next;
}

export async function incrementQuoteCompleted(
  esito: Esito,
): Promise<QuoteStats | null> {
  if (!isAdminConfigured) return null;
  try {
    const current = await getQuoteStats();
    const next: QuoteStats = {
      totalCompleted: current.totalCompleted + 1,
      byEsito: {
        ...current.byEsito,
        [esito]: current.byEsito[esito] + 1,
      },
      byDay: bumpDay(current.byDay, 1),
      updatedAt: new Date().toISOString(),
      lastEsito: esito,
    };
    return await persistQuote(next);
  } catch (err) {
    console.error("[quote-stats] increment:", err);
    return null;
  }
}

function pickEsitoForAdjust(stats: QuoteStats): Esito | null {
  if (stats.lastEsito && stats.byEsito[stats.lastEsito] > 0) return stats.lastEsito;
  const order: Esito[] = ["b", "c", "a"];
  let best: Esito | null = null;
  let max = 0;
  for (const k of order) {
    if (stats.byEsito[k] > max) {
      max = stats.byEsito[k];
      best = k;
    }
  }
  return best;
}

/** Toglie o rimette un questionario completato (CRM: tasto − / Annulla). */
export async function adjustQuoteCompleted(
  delta: 1 | -1,
): Promise<QuoteStats | null> {
  if (!isAdminConfigured) return null;
  try {
    const current = await getQuoteStats();
    const esito = pickEsitoForAdjust(current);
    if (delta < 0) {
      if (!esito || current.totalCompleted <= 0 || current.byEsito[esito] <= 0) {
        return current;
      }
      const next: QuoteStats = {
        totalCompleted: current.totalCompleted - 1,
        byEsito: { ...current.byEsito, [esito]: current.byEsito[esito] - 1 },
        byDay: bumpDay(current.byDay, -1),
        updatedAt: new Date().toISOString(),
        lastEsito: esito,
      };
      return await persistQuote(next);
    }
    const restore = esito ?? "b";
    const next: QuoteStats = {
      totalCompleted: current.totalCompleted + 1,
      byEsito: { ...current.byEsito, [restore]: current.byEsito[restore] + 1 },
      byDay: bumpDay(current.byDay, 1),
      updatedAt: new Date().toISOString(),
      lastEsito: restore,
    };
    return await persistQuote(next);
  } catch (err) {
    console.error("[quote-stats] adjust:", err);
    return null;
  }
}
