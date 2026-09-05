"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { isStripeConfigured } from "@/lib/stripe";
import { decodeHeirs, heirsSummary, isPackageKey, totalHeirs } from "@/lib/quote";
import { readRequestAttribution } from "@/lib/attribution";
import { parseAttribution } from "@/lib/attribution-shared";
import { getPackages, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import { getActionLocale } from "@/lib/action-locale";
import type { QuizSnapshot } from "@/lib/quiz-summary";
import type { LogEvent } from "@/content/crm-data";

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

    // Onorario esatto (pacchetto + eventuali immobili/eredi extra) e risposte
    // del questionario in chiaro: nel CRM la pratica nasce gia' leggibile.
    const [packagesIt, addonsIt] = await Promise.all([getPackages("it"), getAddons("it")]);
    const orderIt = buildOrder(
      { packageKey: input.packageKey, realEstateCount: input.realEstateCount, heirsCount },
      packagesIt,
      addonsIt,
    );
    const snapshot: QuizSnapshot = {
      esito: "b",
      packageKey: input.packageKey,
      packageName: packagesIt.find((p) => p.key === input.packageKey)?.name ?? null,
      lineItems: orderIt?.lineItems.map((li) => ({ key: li.key, label: li.label, amount: li.amount })),
      total: orderIt?.total ?? null,
      answers: {
        hasWill: input.hasWill ?? "",
        heirs: composition,
        heirsTotal: heirsCount,
        hasRealEstate: input.hasRealEstate ?? "",
        realEstateCount: input.realEstateCount ?? null,
        hasOther: input.hasOther ?? "",
      },
      locale: await getActionLocale(),
    };

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
        ...(orderIt ? { price: orderIt.total, line_items: orderIt.lineItems } : {}),
        log: [
          { action: "questionario_compilato", at: nowStamp, quiz: snapshot },
          { action: "checkout_avviato", at: nowStamp },
        ] satisfies LogEvent[],
        attribution: parseAttribution(await readRequestAttribution()),
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
