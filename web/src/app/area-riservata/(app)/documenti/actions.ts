"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { getAdminClient } from "@/lib/supabase/admin";
import type { Communication, LogEvent } from "@/content/crm-data";

export type SubmitResult = { ok: true } | { ok: false; error: string };

// "Ho finito - invia a Lorenzo": passa la palla all'admin e registra l'evento.
export async function submitDocuments(): Promise<SubmitResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: "Sessione non valida." };

  const admin = getAdminClient();
  const practiceId = view.practice.id;

  const { data } = await admin
    .from("practices")
    .select("log, communications")
    .eq("id", practiceId)
    .maybeSingle();

  const now = new Date().toISOString();
  const log: LogEvent[] = Array.isArray(data?.log) ? (data.log as LogEvent[]) : [];
  const communications: Communication[] = Array.isArray(data?.communications)
    ? (data.communications as Communication[])
    : [];

  log.push({ action: "DOCUMENTS_SUBMITTED", at: now });
  communications.push({
    channel: "EMAIL",
    direction: "INBOUND",
    source: "AUTO",
    subject: "Il cliente ha inviato i documenti caricati",
    occurredAt: now,
  });

  const { error } = await admin
    .from("practices")
    .update({ log, communications, action_owner: "ADMIN" })
    .eq("id", practiceId);
  if (error) {
    console.error("[area] submitDocuments:", error.message);
    return { ok: false, error: "Invio non riuscito, riprova." };
  }

  revalidatePath("/area-riservata/documenti");
  revalidatePath("/area-riservata/dashboard");
  return { ok: true };
}
