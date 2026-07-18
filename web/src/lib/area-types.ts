// Tipi condivisi area personale (no "server-only": usati anche lato client).

export type Account = {
  name: string;
  email: string;
  phone: string;
  practiceCode: string;
  /** Soft email (es. recensione GMB). Le email transazionali restano sempre attive. */
  notifyEmail: boolean;
  /** Preferenza futura WhatsApp (canale non ancora attivo). */
  notifyWhatsapp: boolean;
  /** Lingua email/notifiche scritte (it|ar). Distinta dalla lingua UI. */
  commsLocale: "it" | "ar";
};
