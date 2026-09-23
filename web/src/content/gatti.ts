import { coerceLocale, type Locale } from "@/lib/content";

/** Video YouTube incorporabili (oEmbed 200, 16:9). Partono solo al clic. */
export const KITTEN_VIDEOS = [
  { id: "BSQ721bmvDM", captionKey: "video_rest" },
  { id: "jDhksyGUhR0", captionKey: "video_short" },
  { id: "W3przYWJclM", captionKey: "video_day" },
  { id: "y0sF5xhGreA", captionKey: "video_long" },
] as const;

export type KittenCaptionKey = (typeof KITTEN_VIDEOS)[number]["captionKey"];

export type GattiCopy = {
  link: string;
  title: string;
  intro: string;
  play: string;
  note: string;
  video_rest: string;
  video_short: string;
  video_day: string;
  video_long: string;
};

const COPY: Record<Locale, GattiCopy> = {
  it: {
    link: "Se ti serve una pausa: video di gattini",
    title: "Triste? Video di gattini",
    intro: "Una pausa di un minuto. Quando vuoi, torni al preventivo.",
    play: "Guarda",
    note: "Il video parte solo se lo avvii tu. È su YouTube.",
    video_rest: "Gattini che riposano",
    video_short: "Due minuti di gattini",
    video_day: "Una giornata di gattini",
    video_long: "Venti minuti, se vuoi restare",
  },
  en: {
    link: "If you need a pause: kitten videos",
    title: "Sad? Kitten videos",
    intro: "A one-minute pause. Come back to the quote whenever you want.",
    play: "Watch",
    note: "The video starts only when you press play. It is on YouTube.",
    video_rest: "Kittens resting",
    video_short: "Two minutes of kittens",
    video_day: "A day of kittens",
    video_long: "Twenty minutes, if you want to stay",
  },
  de: {
    link: "Wenn du eine Pause brauchst: Katzenvideos",
    title: "Traurig? Katzenvideos",
    intro: "Eine Minute Pause. Zum Angebot kommst du zurück, wann du willst.",
    play: "Ansehen",
    note: "Das Video startet nur, wenn du es selbst startest. Es liegt auf YouTube.",
    video_rest: "Kätzchen, die ruhen",
    video_short: "Zwei Minuten Kätzchen",
    video_day: "Ein Tag mit Kätzchen",
    video_long: "Zwanzig Minuten, wenn du bleiben willst",
  },
  es: {
    link: "Si necesitas una pausa: vídeos de gatitos",
    title: "¿Triste? Vídeos de gatitos",
    intro: "Una pausa de un minuto. Vuelves al presupuesto cuando quieras.",
    play: "Ver",
    note: "El vídeo empieza solo si lo inicias tú. Está en YouTube.",
    video_rest: "Gatitos descansando",
    video_short: "Dos minutos de gatitos",
    video_day: "Un día de gatitos",
    video_long: "Veinte minutos, si quieres quedarte",
  },
  fr: {
    link: "S'il te faut une pause : vidéos de chatons",
    title: "Triste ? Vidéos de chatons",
    intro: "Une pause d'une minute. Tu reviens au devis quand tu veux.",
    play: "Regarder",
    note: "La vidéo ne démarre que si tu la lances. Elle est sur YouTube.",
    video_rest: "Des chatons au repos",
    video_short: "Deux minutes de chatons",
    video_day: "Une journée de chatons",
    video_long: "Vingt minutes, si tu veux rester",
  },
  ru: {
    link: "Если нужна пауза: видео с котятами",
    title: "Грустно? Видео с котятами",
    intro: "Пауза на минуту. К расчёту можно вернуться когда угодно.",
    play: "Смотреть",
    note: "Ролик начинается, только если его запустить. Он на YouTube.",
    video_rest: "Котята отдыхают",
    video_short: "Две минуты котят",
    video_day: "День котят",
    video_long: "Двадцать минут, если хочется остаться",
  },
  tr: {
    link: "Bir mola gerekirse: yavru kedi videoları",
    title: "Üzgün müsün? Yavru kedi videoları",
    intro: "Bir dakikalık mola. Teklife istediğin zaman dönersin.",
    play: "İzle",
    note: "Video yalnızca sen başlatırsan oynar. YouTube'da.",
    video_rest: "Dinlenen yavru kediler",
    video_short: "İki dakika yavru kedi",
    video_day: "Yavru kedilerin bir günü",
    video_long: "Yirmi dakika, kalmak istersen",
  },
  zh: {
    link: "如果需要歇一歇：小猫视频",
    title: "难过吗？小猫视频",
    intro: "歇一分钟。想回去看报价的时候，随时可以。",
    play: "播放",
    note: "视频只有你点了才开始。来自 YouTube。",
    video_rest: "休息的小猫",
    video_short: "两分钟小猫",
    video_day: "小猫的一天",
    video_long: "二十分钟，如果你想再留一会儿",
  },
  hi: {
    link: "अगर थोड़ा रुकना हो: बिल्ली के बच्चों के वीडियो",
    title: "उदास? बिल्ली के बच्चों के वीडियो",
    intro: "एक मिनट का विराम। अनुमान पर जब चाहो लौट सकते हो।",
    play: "देखें",
    note: "वीडियो तभी चलता है जब आप शुरू करते हैं। यह YouTube पर है।",
    video_rest: "आराम करते बिल्ली के बच्चे",
    video_short: "दो मिनट बिल्ली के बच्चे",
    video_day: "बिल्ली के बच्चों का एक दिन",
    video_long: "बीस मिनट, अगर रुकना हो",
  },
  ar: {
    link: "إذا احتجت استراحة: فيديوهات قطط صغيرة",
    title: "حزين؟ فيديوهات قطط صغيرة",
    intro: "استراحة لدقيقة. تعود إلى العرض متى شئت.",
    play: "شاهد",
    note: "يبدأ الفيديو فقط إذا شغلته أنت. وهو على يوتيوب.",
    video_rest: "قطط صغيرة تستريح",
    video_short: "دقيقتان من القطط الصغيرة",
    video_day: "يوم من القطط الصغيرة",
    video_long: "عشرون دقيقة، إن أردت البقاء",
  },
  sq: {
    link: "Nëse të duhet një pushim: video me kotele",
    title: "I trishtuar? Video me kotele",
    intro: "Një minutë pushim. Te preventivi kthehesh kur të duash.",
    play: "Shiko",
    note: "Videoja fillon vetëm nëse e nis ti. Është në YouTube.",
    video_rest: "Kotele që pushojnë",
    video_short: "Dy minuta kotele",
    video_day: "Një ditë kotele",
    video_long: "Njëzet minuta, nëse do të rrish",
  },
};

export function gattiCopy(locale: string | null | undefined): GattiCopy {
  return COPY[coerceLocale(locale)];
}
