"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { isPracticeCancelled } from "@/content/area-data";
import { getAdminClient } from "@/lib/supabase/admin";
import { pushCrmNotification } from "@/lib/crm-notifications";
import type { Communication, LogEvent } from "@/content/crm-data";
import { actionText } from "@/lib/action-locale";

export type SubmitResult = { ok: true } | { ok: false; error: string };

// "Ho finito - invia a Lorenzo": passa la palla all'admin e registra l'evento.
export async function submitDocuments(): Promise<SubmitResult> {
  const view = await getClientView();
  if (!view?.practice) {
    return {
      ok: false,
      error: await actionText("area_errors", "session_invalid", "Sessione non valida."),
    };
  }
  if (isPracticeCancelled(view.practice)) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "practice_cancelled",
        "La pratica è annullata: azione non disponibile.",
      ),
    };
  }

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
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "docs_submit_failed",
        "Invio non riuscito, riprova.",
      ),
    };
  }

  await pushCrmNotification({
    kind: "documenti",
    title: "Il cliente ha inviato i documenti",
    body: `${view.practice.clientName || "Il cliente"} ha completato il caricamento: documenti pronti per la revisione.`,
    practiceId,
    practiceCode: view.practice.code,
  });

  revalidatePath("/area-riservata/documenti");
  revalidatePath("/area-riservata/dashboard");
  return { ok: true };
}
