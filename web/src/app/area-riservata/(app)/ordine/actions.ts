"use server";

import { getClientView } from "@/lib/area";
import { actionText } from "@/lib/action-locale";
import { invoiceUrl } from "@/lib/practice-extras";

export type InvoiceUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// URL firmato per scaricare la fattura (solo la propria pratica, via RLS/sessione).
export async function getInvoiceUrl(): Promise<InvoiceUrlResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: await actionText("area_errors", "session_invalid", "Sessione non valida.") };
  const url = await invoiceUrl(view.practice.id);
  if (!url) return { ok: false, error: await actionText("area_errors", "invoice_unavailable", "Fattura non ancora disponibile.") };
  return { ok: true, url };
}
