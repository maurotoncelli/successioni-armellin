import "server-only";
import Stripe from "stripe";

/*
  Client Stripe (solo server). La chiave segreta non deve mai finire nel bundle
  client: l'import di "server-only" lo garantisce.
  Come per Supabase, il sistema resta funzionante anche senza chiavi: in quel
  caso `isStripeConfigured` e false e i flussi di pagamento mostrano un avviso
  invece di rompersi (utile in fase di prototipo/demo).
*/

const secretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(secretKey);

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!secretKey) {
    throw new Error(
      "Stripe non configurato: imposta STRIPE_SECRET_KEY in .env.local / Vercel.",
    );
  }
  if (!cached) {
    // apiVersion volutamente omessa: si usa quella pinnata dall'SDK installato.
    cached = new Stripe(secretKey);
  }
  return cached;
}
