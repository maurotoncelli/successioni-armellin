import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import type { Esito } from "@/lib/quote";

/*
  Contatore questionari preventivo completati (anche senza lasciare email).
  NO-DDL: JSON in Storage `practice-docs/site/_quote-stats.json`.
  Complementare alle notifiche CRM (che Lorenzo puo cancellare): qui il totale
  resta per le Statistiche.
*/

const STORAGE_PATH = "site/_quote-stats.json";

export type QuoteStats = {
  totalCompleted: number;
  byEsito: Record<Esito, number>;
  updatedAt: string | null;
};

const EMPTY: QuoteStats = {
  totalCompleted: 0,
  byEsito: { a: 0, b: 0, c: 0 },
  updatedAt: null,
};

function normalize(raw: unknown): QuoteStats {
  if (!raw || typeof raw !== "object") return { ...EMPTY, byEsito: { ...EMPTY.byEsito } };
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
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
  };
}

export async function getQuoteStats(): Promise<QuoteStats> {
  if (!isAdminConfigured) return { ...EMPTY, byEsito: { ...EMPTY.byEsito } };
  try {
    const { data, error } = await getAdminClient()
      .storage.from(DOC_BUCKET)
      .download(STORAGE_PATH);
    if (error || !data) return { ...EMPTY, byEsito: { ...EMPTY.byEsito } };
    return normalize(JSON.parse(await data.text()));
  } catch (err) {
    console.error("[quote-stats] read:", err);
    return { ...EMPTY, byEsito: { ...EMPTY.byEsito } };
  }
}

export async function incrementQuoteCompleted(
  esito: Esito,
): Promise<QuoteStats | null> {
  if (!isAdminConfigured) return null;
  try {
    const admin = getAdminClient();
    await ensureDocBucket(admin);
    const current = await getQuoteStats();
    const next: QuoteStats = {
      totalCompleted: current.totalCompleted + 1,
      byEsito: {
        ...current.byEsito,
        [esito]: current.byEsito[esito] + 1,
      },
      updatedAt: new Date().toISOString(),
    };
    const blob = Buffer.from(JSON.stringify(next), "utf8");
    const { error } = await admin.storage.from(DOC_BUCKET).upload(STORAGE_PATH, blob, {
      contentType: "application/json",
      upsert: true,
    });
    if (error) throw error;
    return next;
  } catch (err) {
    console.error("[quote-stats] increment:", err);
    return null;
  }
}
