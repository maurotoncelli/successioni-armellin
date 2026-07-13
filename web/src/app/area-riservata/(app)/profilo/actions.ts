"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { ensureProfile } from "@/lib/profiles";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/phone";

/*
  Aggiornamento del numero di telefono da parte del CLIENTE loggato.
  Scrive sull'anagrafica (contacts) e sulle pratiche collegate
  (practices.client_phone), cosi CRM e area restano allineati.
  La proprieta e garantita dalla sessione (getClientView + contact_id del profilo).
*/

export type UpdatePhoneResult = { ok: true; phone: string } | { ok: false; error: string };

export async function updatePhone(raw: string): Promise<UpdatePhoneResult> {
  const view = await getClientView();
  if (!view) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };
  if (!isAdminConfigured) return { ok: false, error: "Servizio non disponibile." };

  const phone = normalizePhone(raw);
  if (!phone) {
    return { ok: false, error: "Numero non valido: usa il formato 320 1234567 o +39..." };
  }

  const { contactId } = await ensureProfile(view.user);
  const admin = getAdminClient();

  if (contactId) {
    const { error } = await admin
      .from("contacts")
      .update({ phone })
      .eq("id", contactId);
    if (error) return { ok: false, error: "Salvataggio non riuscito, riprova." };
    await admin.from("practices").update({ client_phone: phone }).eq("contact_id", contactId);
  } else if (view.practice) {
    // Nessuna anagrafica collegata (caso raro): aggiorna almeno la pratica.
    const { error } = await admin
      .from("practices")
      .update({ client_phone: phone })
      .eq("id", view.practice.id);
    if (error) return { ok: false, error: "Salvataggio non riuscito, riprova." };
  } else {
    return { ok: false, error: "Nessuna pratica collegata al tuo account." };
  }

  revalidatePath("/area-riservata/profilo");
  revalidatePath("/area-riservata/dati");
  return { ok: true, phone };
}
