import type { Locale } from "@/lib/content";
import {
  formatReopenDate,
  type OfflinePreset,
  type SiteOfflineState,
} from "@/lib/site-offline-shared";

type OfflinePresetCopy = {
  vacation_title: string;
  vacation_body: string;
  maintenance_title: string;
  /** Template con `{date}`. */
  maintenance_body: string;
  maintenance_body_soon: string;
};

/*
  Copy pubblico dei preset vacanza/manutenzione.
  Fonte runtime dedicata (non solo nested in content_entries): evita che titolo/body
  restino IT quando i CTA di offline_ui sono già localizzati.
*/
export const OFFLINE_PUBLIC_COPY: Record<Locale, OfflinePresetCopy> = {
  it: {
    vacation_title: "Siamo in vacanza",
    vacation_body:
      "In questo periodo non siamo operativi, ma puoi comunque scriverci: ti risponderemo non appena torniamo.",
    maintenance_title: "Sito in manutenzione",
    maintenance_body:
      "Stiamo facendo alcuni aggiornamenti. Riapertura prevista per il {date}. Puoi comunque scriverci via email o WhatsApp.",
    maintenance_body_soon:
      "Stiamo facendo alcuni aggiornamenti. Torniamo online a breve. Puoi comunque scriverci via email o WhatsApp.",
  },
  en: {
    vacation_title: "We're on holiday",
    vacation_body:
      "We're not operating right now, but you can still write to us: we'll reply as soon as we're back.",
    maintenance_title: "Site under maintenance",
    maintenance_body:
      "We're making some updates. Expected reopening on {date}. You can still email or WhatsApp us.",
    maintenance_body_soon:
      "We're making some updates. We'll be back online shortly. You can still email or WhatsApp us.",
  },
  ar: {
    vacation_title: "نحن في إجازة",
    vacation_body:
      "لسنا متاحين في هذه الفترة، لكن يمكنك مراسلتنا وسنرد فور عودتنا.",
    maintenance_title: "الموقع تحت الصيانة",
    maintenance_body:
      "نجري بعض التحديثات. إعادة الفتح المتوقعة في {date}. يمكنك مراسلتنا عبر البريد أو واتساب.",
    maintenance_body_soon:
      "نجري بعض التحديثات. سنعود قريباً. يمكنك مراسلتنا عبر البريد أو واتساب.",
  },
  de: {
    vacation_title: "Wir sind im Urlaub",
    vacation_body:
      "In dieser Zeit sind wir nicht erreichbar, aber Sie können uns trotzdem schreiben: Wir antworten, sobald wir zurück sind.",
    maintenance_title: "Website in Wartung",
    maintenance_body:
      "Wir führen einige Updates durch. Geplante Wiedereröffnung am {date}. Sie können uns weiterhin per E-Mail oder WhatsApp schreiben.",
    maintenance_body_soon:
      "Wir führen einige Updates durch. Wir sind bald wieder online. Sie können uns weiterhin per E-Mail oder WhatsApp schreiben.",
  },
  es: {
    vacation_title: "Estamos de vacaciones",
    vacation_body:
      "En este periodo no estamos operativos, pero puedes escribirnos: te responderemos en cuanto volvamos.",
    maintenance_title: "Sitio en mantenimiento",
    maintenance_body:
      "Estamos haciendo algunas actualizaciones. Reapertura prevista el {date}. Puedes escribirnos por email o WhatsApp.",
    maintenance_body_soon:
      "Estamos haciendo algunas actualizaciones. Volvemos en breve. Puedes escribirnos por email o WhatsApp.",
  },
  fr: {
    vacation_title: "Nous sommes en vacances",
    vacation_body:
      "Nous ne sommes pas opérationnels pour le moment, mais vous pouvez nous écrire : nous vous répondrons dès notre retour.",
    maintenance_title: "Site en maintenance",
    maintenance_body:
      "Nous effectuons quelques mises à jour. Réouverture prévue le {date}. Vous pouvez toujours nous écrire par e-mail ou WhatsApp.",
    maintenance_body_soon:
      "Nous effectuons quelques mises à jour. Nous serons de retour bientôt. Vous pouvez toujours nous écrire par e-mail ou WhatsApp.",
  },
  ru: {
    vacation_title: "Мы в отпуске",
    vacation_body:
      "Сейчас мы не работаем, но вы можете написать нам: ответим, как только вернёмся.",
    maintenance_title: "Сайт на обслуживании",
    maintenance_body:
      "Мы проводим обновления. Ожидаемое открытие — {date}. Вы можете написать нам по email или WhatsApp.",
    maintenance_body_soon:
      "Мы проводим обновления. Скоро снова будем онлайн. Вы можете написать нам по email или WhatsApp.",
  },
  tr: {
    vacation_title: "Tatildeyiz",
    vacation_body:
      "Bu dönemde faaliyette değiliz ama yine de yazabilirsiniz: döner dönmez yanıtlarız.",
    maintenance_title: "Site bakımda",
    maintenance_body:
      "Bazı güncellemeler yapıyoruz. Planlanan yeniden açılış: {date}. E-posta veya WhatsApp ile yazabilirsiniz.",
    maintenance_body_soon:
      "Bazı güncellemeler yapıyoruz. Kısa sürede tekrar çevrimiçi olacağız. E-posta veya WhatsApp ile yazabilirsiniz.",
  },
  zh: {
    vacation_title: "我们正在休假",
    vacation_body:
      "此期间我们暂不营业，但仍可留言：我们回来后会尽快回复。",
    maintenance_title: "网站维护中",
    maintenance_body:
      "我们正在进行一些更新。预计于 {date} 重新开放。您仍可通过邮件或 WhatsApp 联系我们。",
    maintenance_body_soon:
      "我们正在进行一些更新，很快恢复上线。您仍可通过邮件或 WhatsApp 联系我们。",
  },
  hi: {
    vacation_title: "हम छुट्टी पर हैं",
    vacation_body:
      "इस अवधि में हम उपलब्ध नहीं हैं, फिर भी लिख सकते हैं: लौटते ही जवाब देंगे।",
    maintenance_title: "साइट मेंटेनेंस में है",
    maintenance_body:
      "हम कुछ अपडेट कर रहे हैं। अपेक्षित पुनः आरंभ: {date}। आप ईमेल या WhatsApp से लिख सकते हैं।",
    maintenance_body_soon:
      "हम कुछ अपडेट कर रहे हैं। जल्द ही वापस ऑनलाइन होंगे। आप ईमेल या WhatsApp से लिख सकते हैं।",
  },
  sq: {
    vacation_title: "Jemi me pushime",
    vacation_body:
      "Në këtë periudhë nuk jemi operativë, por mund të na shkruani: do t'ju përgjigjemi sapo të kthehemi.",
    maintenance_title: "Faqja në mirëmbajtje",
    maintenance_body:
      "Po bëjmë disa përditësime. Rihapja e parashikuar më {date}. Mund të na shkruani me email ose WhatsApp.",
    maintenance_body_soon:
      "Po bëjmë disa përditësime. Do të kthehemi së shpejti. Mund të na shkruani me email ose WhatsApp.",
  },
};

/** Titoli IT dei preset: se lo Storage ha ancora questi testi, localizziamo anche con preset custom. */
const IT_PRESET_TITLES: Record<Exclude<OfflinePreset, "custom">, string> = {
  vacation: OFFLINE_PUBLIC_COPY.it.vacation_title,
  maintenance: OFFLINE_PUBLIC_COPY.it.maintenance_title,
};

function inferPreset(state: SiteOfflineState): Exclude<OfflinePreset, "custom"> | null {
  if (state.preset === "vacation" || state.preset === "maintenance") {
    return state.preset;
  }
  // Editor CRM: modificare titolo/body marca "custom", ma spesso il testo resta il modello IT.
  if (state.title === IT_PRESET_TITLES.vacation) return "vacation";
  if (state.title === IT_PRESET_TITLES.maintenance) return "maintenance";
  return null;
}

export function resolveOfflinePublicCopy(
  state: SiteOfflineState,
  locale: Locale,
): { title: string; body: string } {
  const preset = inferPreset(state);
  if (!preset) {
    return { title: state.title, body: state.body };
  }

  const copy = OFFLINE_PUBLIC_COPY[locale] ?? OFFLINE_PUBLIC_COPY.it;
  if (preset === "vacation") {
    return { title: copy.vacation_title, body: copy.vacation_body };
  }

  const when = formatReopenDate(state.reopenDate, locale);
  return {
    title: copy.maintenance_title,
    body: when
      ? copy.maintenance_body.replaceAll("{date}", when)
      : copy.maintenance_body_soon,
  };
}

export function offlineNoticeUsesWrench(state: SiteOfflineState): boolean {
  return inferPreset(state) === "maintenance";
}
