"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { isPracticeCancelled } from "@/content/area-data";
import { signMandateElectronic } from "@/lib/practice-extras";
import { pushCrmNotification } from "@/lib/crm-notifications";

export type MandateResult = { ok: true } | { ok: false; error: string };

// Firma elettronica del mandato da parte del cliente loggato (sulla sua pratica).
export async function signMandate(): Promise<MandateResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: "Sessione non valida." };
  if (isPracticeCancelled(view.practice)) {
    return { ok: false, error: "La pratica è annullata: azione non disponibile." };
  }
  try {
    await signMandateElectronic(view.practice.id, view.account.name);
  } catch (err) {
    console.error("[area] signMandate:", err);
    return { ok: false, error: "Firma non riuscita, riprova." };
  }
  await pushCrmNotification({
    kind: "mandato",
    title: "Mandato firmato dal cliente",
    body: `${view.account.name || "Il cliente"} ha firmato elettronicamente il mandato professionale.`,
    practiceId: view.practice.id,
    practiceCode: view.practice.code,
  });

  revalidatePath("/area-riservata/mandato");
  return { ok: true };
}
