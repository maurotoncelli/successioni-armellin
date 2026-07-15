import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { CrmNotificationRow } from "@/lib/supabase/types";

/*
  Centro notifiche del CRM (@05). Diverso dagli "Alert automatici":
  - gli alert sono DERIVATI dallo stato delle pratiche e ricompaiono finche
    la condizione persiste (scadenze, documenti da validare, ...);
  - le notifiche sono EVENTI puntuali scritti quando accadono (pagamento,
    nuovo lead, recesso, documenti inviati) e Lorenzo puo eliminarle una
    volta lette, singolarmente o tutte insieme.
  La scrittura e best-effort: un errore qui non deve MAI far fallire
  l'operazione principale (webhook, lead, recesso).
*/

export type CrmNotificationKind =
  | "pagamento"
  | "rimborso"
  | "lead"
  | "recesso"
  | "documenti"
  | "mandato"
  | "iban";

export type CrmNotification = {
  id: string;
  kind: CrmNotificationKind;
  title: string;
  body: string;
  practiceId: string | null;
  practiceCode: string;
  createdAt: string;
};

function mapRow(row: CrmNotificationRow): CrmNotification {
  return {
    id: row.id,
    kind: row.kind as CrmNotificationKind,
    title: row.title,
    body: row.body,
    practiceId: row.practice_id,
    practiceCode: row.practice_code,
    createdAt: row.created_at,
  };
}

export async function pushCrmNotification(input: {
  kind: CrmNotificationKind;
  title: string;
  body?: string;
  practiceId?: string | null;
  practiceCode?: string;
  /**
   * Anti-rumore per eventi ripetuti in raffica (es. upload multi-file della
   * stessa voce checklist): se negli ultimi N minuti esiste gia una notifica
   * identica (stesso kind+titolo+pratica), non se ne crea un'altra.
   */
  dedupeMinutes?: number;
}): Promise<void> {
  if (!isAdminConfigured) return;
  try {
    if (input.dedupeMinutes && input.practiceId) {
      const since = new Date(
        Date.now() - input.dedupeMinutes * 60_000,
      ).toISOString();
      const { data: dup } = await getAdminClient()
        .from("crm_notifications")
        .select("id")
        .eq("kind", input.kind)
        .eq("title", input.title)
        .eq("practice_id", input.practiceId)
        .gte("created_at", since)
        .limit(1);
      if (dup && dup.length > 0) return;
    }
    const { error } = await getAdminClient().from("crm_notifications").insert({
      kind: input.kind,
      title: input.title,
      body: input.body ?? "",
      practice_id: input.practiceId ?? null,
      practice_code: input.practiceCode ?? "",
    });
    if (error) throw error;
  } catch (err) {
    console.error("[crm-notifications] push:", err);
  }
}

export async function listCrmNotifications(limit = 30): Promise<CrmNotification[]> {
  if (!isAdminConfigured) return [];
  try {
    const { data, error } = await getAdminClient()
      .from("crm_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[crm-notifications] list:", err);
    return [];
  }
}

export async function countCrmNotifications(): Promise<number> {
  if (!isAdminConfigured) return 0;
  try {
    const { count, error } = await getAdminClient()
      .from("crm_notifications")
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch (err) {
    console.error("[crm-notifications] count:", err);
    return 0;
  }
}

export async function deleteCrmNotification(id: string): Promise<void> {
  if (!isAdminConfigured) return;
  const { error } = await getAdminClient()
    .from("crm_notifications")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function clearCrmNotifications(): Promise<void> {
  if (!isAdminConfigured) return;
  const { error } = await getAdminClient()
    .from("crm_notifications")
    .delete()
    .gte("created_at", "1970-01-01");
  if (error) throw error;
}
