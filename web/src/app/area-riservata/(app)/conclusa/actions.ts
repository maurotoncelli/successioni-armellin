"use server";

import { getClientView } from "@/lib/area";
import { finalDocUrl } from "@/lib/practice-extras";

export type FinalUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// URL firmato per scaricare un documento finale (solo la propria pratica).
export async function getFinalDocUrl(index: number): Promise<FinalUrlResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: "Sessione non valida." };
  const url = await finalDocUrl(view.practice.id, index);
  if (!url) return { ok: false, error: "File non disponibile." };
  return { ok: true, url };
}
