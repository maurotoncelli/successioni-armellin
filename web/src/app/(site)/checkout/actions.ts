"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { isStripeConfigured } from "@/lib/stripe";
import { decodeHeirs, heirsSummary, isPackageKey, totalHeirs } from "@/lib/quote";

/*
  Crea la pratica SOLO al momento del pagamento (flusso "result-first" del sito):
  l'utente ha gia visto pacchetto e prezzo senza lasciare dati. La pratica nasce
  "anonima" (nessun contatto): l'email arriva da Stripe e il webhook la riporta
  sulla pratica. Cosi non creiamo lead-spazzatura per ogni visitatore.
*/

export type CheckoutPracticeInput = {
  packageKey: string;
  realEstateCount?: number | null;
  /** Composizione eredi serializzata (es. "1.2.0.0.0.0"), dal quiz. */
  comp?: string;
  heirs?: string;
  hasRealEstate?: string;
  hasWill?: string;
  hasOther?: string;
};

export type CheckoutPracticeResult =
  | { ok: true; practiceId: string }
  | { ok: false; reason: "not_configured" | "error" };

export async function createCheckoutPractice(
  input: CheckoutPracticeInput,
): Promise<CheckoutPracticeResult> {
  if (!isPackageKey(input.packageKey)) return { ok: false, reason: "error" };
  // Niente DB o Stripe -> non creiamo pratiche orfane: il pagamento non e attivo.
  if (!isAdminConfigured || !isStripeConfigured) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const admin = getAdminClient();
    const nowStamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const composition = decodeHeirs(input.comp);
    const heirsCount = composition
      ? totalHeirs(composition)
      : Number.parseInt(input.heirs || "0", 10) || 0;

    const { data: practice, error } = await admin
      .from("practices")
      .insert({
        status: "LEAD",
        action_owner: "CLIENT",
        client_name: "",
        relation: composition ? heirsSummary(composition) : "",
        heirs_count: heirsCount,
        has_will: input.hasWill === "si",
        has_real_estate: input.hasRealEstate === "si",
        real_estate_count:
          input.hasRealEstate === "si" ? (input.realEstateCount ?? null) : null,
        requires_custom_quote: false,
        suggested_package: input.packageKey,
        selected_package: input.packageKey,
        notes: "Checkout diretto dal sito (in attesa di pagamento).",
        log: [{ action: "checkout_avviato", at: nowStamp }],
      })
      .select("id")
      .single();
    if (error) throw error;

    revalidatePath("/crm");
    revalidatePath("/crm/pratiche");
    return { ok: true, practiceId: practice.id };
  } catch (err) {
    console.error("[checkout] createCheckoutPractice errore:", err);
    return { ok: false, reason: "error" };
  }
}
