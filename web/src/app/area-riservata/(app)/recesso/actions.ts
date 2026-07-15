"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { getWithdrawal, requestWithdrawal } from "@/lib/practice-extras";
import { notifyAdminWithdrawalRequest } from "@/lib/notifications";
import { getAdminClient } from "@/lib/supabase/admin";
import type { Communication, LogEvent } from "@/content/crm-data";

export type WithdrawalResult = { ok: true } | { ok: false; error: string };

/*
  Recesso self-service del cliente (@10/@05): registra la richiesta sulla propria
  pratica (NO-DDL, _extras.json), lascia traccia in cronologia e avvisa Lorenzo.
  La proprieta e garantita da getClientView (solo la pratica del cliente loggato);
  la scrittura passa da service_role come per upload/IBAN dell'area.
*/
export async function submitWithdrawal(
  reason: string,
): Promise<WithdrawalResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: "Sessione non valida." };
  const p = view.practice;

  // Guardie server-side (la UI blocca gia, ma l'azione e invocabile comunque):
  // niente recesso su pratiche chiuse/annullate ne doppie richieste pendenti.
  if (p.status === "CHIUSA" || p.status === "ANNULLATA") {
    return {
      ok: false,
      error: "La pratica è già conclusa: il recesso non è più applicabile.",
    };
  }
  const current = await getWithdrawal(p.id);
  if (current?.status === "REQUESTED" || current?.status === "IN_REVIEW") {
    return {
      ok: false,
      error: "C'è già una richiesta di recesso in corso di valutazione.",
    };
  }

  await requestWithdrawal(p.id, reason);

  const admin = getAdminClient();
  const { data } = await admin
    .from("practices")
    .select("communications, log, code, client_name")
    .eq("id", p.id)
    .maybeSingle();

  const communications: Communication[] = Array.isArray(data?.communications)
    ? (data!.communications as Communication[])
    : [];
  const log: LogEvent[] = Array.isArray(data?.log)
    ? (data!.log as LogEvent[])
    : [];
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  communications.push({
    channel: "EMAIL",
    direction: "INBOUND",
    source: "AUTO",
    subject: "Richiesta di recesso dal cliente",
    occurredAt: now,
  });
  log.push({ action: "recesso_richiesto", at: now });
  // La palla passa a Lorenzo: il badge CRM mostra "Tocca a te" (non piu
  // "In attesa del cliente") finche la richiesta non viene gestita.
  await admin
    .from("practices")
    .update({ communications, log, action_owner: "ADMIN" })
    .eq("id", p.id);

  await notifyAdminWithdrawalRequest(
    p.id,
    data?.code ?? p.code,
    data?.client_name ?? p.clientName,
    reason,
  );

  revalidatePath("/area-riservata/recesso");
  revalidatePath(`/crm/pratiche/${p.id}`);
  return { ok: true };
}
