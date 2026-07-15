"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { saveIban } from "@/lib/practice-extras";
import { pushCrmNotification } from "@/lib/crm-notifications";

export type IbanResult =
  | { ok: true; last4: string }
  | { ok: false; error: string };

// Salvataggio IBAN (cifrato) da parte del cliente loggato.
export async function saveIbanAction(iban: string): Promise<IbanResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: "Sessione non valida." };
  const res = await saveIban(view.practice.id, iban);
  if (res.ok) {
    await pushCrmNotification({
      kind: "iban",
      title: `IBAN inserito dal cliente (…${res.last4})`,
      body: `${view.practice.clientName || "Il cliente"} ha salvato l'IBAN per l'addebito delle imposte.`,
      practiceId: view.practice.id,
      practiceCode: view.practice.code,
      dedupeMinutes: 10,
    });
    revalidatePath("/area-riservata/dati");
  }
  return res;
}
