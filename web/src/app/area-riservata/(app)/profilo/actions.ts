"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { ensureProfile } from "@/lib/profiles";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/ssr";
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

/*
  Crea o cambia la password dell'account (opzionale: chi non la imposta
  continua con magic link/OTP). Richiede la sessione attiva: e' il client
  Supabase dell'utente a fare updateUser, non il service_role.
*/
export type UpdatePasswordResult = { ok: true } | { ok: false; error: string };

export async function updatePassword(
  password: string,
): Promise<UpdatePasswordResult> {
  const view = await getClientView();
  if (!view) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };

  if (password.length < 8) {
    return { ok: false, error: "La password deve avere almeno 8 caratteri." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    const friendly =
      error.message ===
      "New password should be different from the old password."
        ? "La nuova password deve essere diversa da quella attuale."
        : "Salvataggio non riuscito, riprova.";
    if (friendly.startsWith("Salvataggio"))
      console.error("[area] updatePassword:", error.message);
    return { ok: false, error: friendly };
  }
  return { ok: true };
}
