export type OfflinePreset = "vacation" | "maintenance" | "custom";

export type SiteOfflineState = {
  enabled: boolean;
  preset: OfflinePreset;
  title: string;
  body: string;
  /** Data riapertura (YYYY-MM-DD), usata soprattutto nel preset manutenzione. */
  reopenDate: string | null;
  showContactButtons: boolean;
  updatedAt: string | null;
};

export const DEFAULT_OFFLINE_STATE: SiteOfflineState = {
  enabled: false,
  preset: "vacation",
  title: "Siamo in vacanza",
  body: "In questo periodo non siamo operativi, ma puoi comunque scriverci: ti risponderemo non appena torniamo.",
  reopenDate: null,
  showContactButtons: true,
  updatedAt: null,
};

const DATE_LOCALE_TAGS: Record<string, string> = {
  it: "it-IT",
  en: "en-GB",
  ar: "ar",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  ru: "ru-RU",
  tr: "tr-TR",
  zh: "zh-CN",
  hi: "hi-IN",
  sq: "sq-AL",
};

export function formatReopenDate(
  iso: string | null | undefined,
  locale = "it",
): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(DATE_LOCALE_TAGS[locale] ?? "it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const OFFLINE_PRESETS: Record<
  Exclude<OfflinePreset, "custom">,
  { label: string; title: string; body: (reopenDate?: string | null) => string }
> = {
  vacation: {
    label: "Vacanza",
    title: "Siamo in vacanza",
    body: () =>
      "In questo periodo non siamo operativi, ma puoi comunque scriverci: ti risponderemo non appena torniamo.",
  },
  maintenance: {
    label: "Manutenzione",
    title: "Sito in manutenzione",
    body: (reopenDate) => {
      const when = formatReopenDate(reopenDate, "it");
      return when
        ? `Stiamo facendo alcuni aggiornamenti. Riapertura prevista per il ${when}. Puoi comunque scriverci via email o WhatsApp.`
        : "Stiamo facendo alcuni aggiornamenti. Torniamo online a breve. Puoi comunque scriverci via email o WhatsApp.";
    },
  },
};
