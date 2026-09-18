export type CheckoutPlan = "full" | "deposit" | "balance";

export const CHECKOUT_PLANS: CheckoutPlan[] = ["full", "deposit", "balance"];

export function isCheckoutPlan(value: unknown): value is CheckoutPlan {
  return value === "full" || value === "deposit" || value === "balance";
}

/** Spezza l'onorario in due metà che sommano esattamente al totale (centesimi). */
export function splitHonorarium(total: number): { deposit: number; balance: number } {
  const cents = Math.round(Number(total) * 100);
  if (!Number.isFinite(cents) || cents < 2) {
    return { deposit: 0, balance: 0 };
  }
  const depositCents = Math.floor(cents / 2);
  return {
    deposit: depositCents / 100,
    balance: (cents - depositCents) / 100,
  };
}
