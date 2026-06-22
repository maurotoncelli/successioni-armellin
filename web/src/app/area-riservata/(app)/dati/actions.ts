"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { saveIban } from "@/lib/practice-extras";

export type IbanResult =
  | { ok: true; last4: string }
  | { ok: false; error: string };

// Salvataggio IBAN (cifrato) da parte del cliente loggato.
export async function saveIbanAction(iban: string): Promise<IbanResult> {
  const view = await getClientView();
  if (!view?.practice) return { ok: false, error: "Sessione non valida." };
  const res = await saveIban(view.practice.id, iban);
  if (res.ok) revalidatePath("/area-riservata/dati");
  return res;
}
