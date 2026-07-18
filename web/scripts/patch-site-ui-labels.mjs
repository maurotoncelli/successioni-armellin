#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const IT = {
  preventivo_ui: {
    yes: "Sì",
    no: "No",
    unknown: "Non lo so",
    will_q_before: "Il",
    will_q_term: "de cuius",
    will_q_after: "ha lasciato un testamento?",
    will_tip_aria: "Cosa significa de cuius",
    will_tip:
      "De cuius (dal latino) è la persona deceduta di cui si apre la successione: il defunto o la defunta.",
    will_yes_note:
      "I pacchetti standard coprono anche i casi con testamento. Nella checklist documenti ti chiederemo la copia del testamento pubblicato.",
    will_unknown_note:
      "Va bene anche così: se emerge dopo, lo gestiamo in corso di pratica. Continua con le altre domande.",
    heirs_legend: "Chi sono gli eredi? Indica quanti per ogni tipo.",
    heirs_hint:
      "Conta tutte le persone che ereditano, compreso te se sei tra gli eredi.",
    heir_coniuge: "Coniuge (o unito civilmente)",
    heir_figli: "Figli/e",
    heir_genitori: "Genitori",
    heir_fratelli: "Fratelli/Sorelle",
    heir_nipoti: "Nipoti",
    heir_altri: "Altri eredi",
    less: "Meno {label}",
    more: "Più {label}",
    real_estate_q: "Ci sono immobili (case, terreni, box)?",
    real_estate_count: "Quanti immobili in tutto?",
    real_estate_placeholder: "Es. 2",
    real_estate_hint:
      "Conta case, terreni, box e quote: ogni immobile in più può incidere sul preventivo.",
    over_100k_q:
      "Il valore totale dell'eredità (conti, titoli, ecc.) supera i 100.000 euro?",
    other_assets_q:
      "Ci sono altri beni (quote societarie, azioni, aziende, imbarcazioni…)?",
    back: "Indietro",
    next: "Avanti",
  },
  checkout_ui: {
    stripe_blurb:
      "Pagamento sicuro tramite Stripe: carta di credito/debito e, dove disponibile, pagamento a rate. Verrai reindirizzato alla pagina protetta di Stripe.",
    err_start: "Impossibile avviare il pagamento.",
    err_not_configured:
      "Pagamenti non ancora attivi. Riprova più tardi o contattaci.",
    err_retry: "Impossibile avviare il pagamento. Riprova tra poco.",
    err_network: "Errore di rete. Riprova tra poco.",
    need_quote_before: "Per pagare, parti dal",
    need_quote_link: "calcolo del preventivo",
    need_quote_after: ": così ti proponiamo il pacchetto giusto.",
    loading: "Avvio del pagamento…",
  },
  conferma_ui: {
    title_paid: "Pagamento ricevuto, grazie!",
    title_pending: "Stiamo confermando il pagamento",
    body_paid:
      "Il tuo pagamento è andato a buon fine e la tua pratica è ora attiva. A breve riceverai un'email con il riepilogo e le istruzioni per l'area personale, dove caricare i documenti.",
    body_pending:
      "Abbiamo ricevuto l'ordine. La conferma definitiva del pagamento arriva dal nostro sistema in pochi istanti: riceverai un'email appena è tutto a posto. Puoi già accedere all'area personale.",
    email_note_before: "Accedi all'area personale con la",
    email_note_strong: "stessa email usata per il pagamento",
    email_note_after:
      ": è così che ritrovi la pratica. Se usi un'altra email (o Google con un account diverso), non la vedrai.",
    cta_area: "Vai all'area personale",
    cta_home: "Torna alla home",
    taxes_note:
      "Le imposte sono separate dall'onorario: te le calcoliamo e comunichiamo prima dell'invio.",
    meta_title: "Pagamento ricevuto",
  },
  contact_ui: {
    name: "Nome e cognome",
    email: "Email",
    phone: "Telefono (facoltativo)",
    message: "Messaggio",
    submit: "Invia messaggio",
  },
  soft_lead_ui: {
    name: "Nome e cognome (facoltativo)",
    email: "Email",
    phone: "Telefono",
    phone_optional: "Telefono (facoltativo)",
    submitting: "Invio in corso…",
    err_save:
      "Al momento non riusciamo a registrare la richiesta. Riprova più tardi o chiamaci.",
  },
  guide_ui: {
    search_placeholder: "Cerca tra le guide…",
    all: "Tutte",
    free_tool: "Strumento gratuito",
    back: "Torna alle guide",
    author_heading: "Chi ha scritto questa guida",
    related: "Guide correlate",
  },
  chrome_ui: {
    lang_aria: "Seleziona lingua",
    menu_open: "Apri menu",
    menu_close: "Chiudi menu",
  },
};

const AR = {
  preventivo_ui: {
    yes: "نعم",
    no: "لا",
    unknown: "لا أعلم",
    will_q_before: "هل ترك",
    will_q_term: "de cuius",
    will_q_after: "وصية؟",
    will_tip_aria: "ماذا يعني de cuius",
    will_tip:
      "De cuius (من اللاتينية) هو الشخص المتوفى الذي تُفتح بشأنه التركة: المتوفى أو المتوفاة.",
    will_yes_note:
      "الباقات القياسية تغطي أيضًا الحالات التي توجد فيها وصية. في قائمة المستندات سنطلب نسخة من الوصية المُعلنة.",
    will_unknown_note:
      "لا بأس: إن ظهرت لاحقًا نعالجها أثناء المعاملة. تابع الأسئلة الأخرى.",
    heirs_legend: "من هم الورثة؟ حدّد العدد لكل نوع.",
    heirs_hint: "احسب كل من يرث، بما فيهم أنت إن كنت من الورثة.",
    heir_coniuge: "الزوج/الزوجة (أو الشريك المدني)",
    heir_figli: "الأبناء",
    heir_genitori: "الوالدان",
    heir_fratelli: "الإخوة/الأخوات",
    heir_nipoti: "الأحفاد/أبناء الإخوة",
    heir_altri: "ورثة آخرون",
    less: "أقل {label}",
    more: "أكثر {label}",
    real_estate_q: "هل توجد عقارات (منازل، أراضٍ، مرآب)؟",
    real_estate_count: "كم عقارًا إجمالًا؟",
    real_estate_placeholder: "مثلًا 2",
    real_estate_hint:
      "احسب المنازل والأراضي والمرائب والحصص: كل عقار إضافي قد يؤثر على العرض.",
    over_100k_q:
      "هل تتجاوز القيمة الإجمالية للتركة (حسابات، أوراق مالية، إلخ) 100.000 يورو؟",
    other_assets_q:
      "هل توجد أصول أخرى (حصص شركات، أسهم، شركات، قوارب…)؟",
    back: "رجوع",
    next: "التالي",
  },
  checkout_ui: {
    stripe_blurb:
      "دفع آمن عبر Stripe: بطاقة ائتمان/خصم، وتقسيط حيث يتوفر. سيتم توجيهك إلى صفحة Stripe المحمية.",
    err_start: "تعذّر بدء الدفع.",
    err_not_configured: "المدفوعات غير مفعّلة بعد. أعد المحاولة لاحقًا أو تواصل معنا.",
    err_retry: "تعذّر بدء الدفع. أعد المحاولة بعد قليل.",
    err_network: "خطأ في الشبكة. أعد المحاولة بعد قليل.",
    need_quote_before: "للدفع، ابدأ من",
    need_quote_link: "حساب العرض",
    need_quote_after: ": هكذا نقترح الباقة المناسبة.",
    loading: "جاري بدء الدفع…",
  },
  conferma_ui: {
    title_paid: "تم استلام الدفع، شكرًا!",
    title_pending: "نؤكّد الدفع",
    body_paid:
      "تم الدفع بنجاح ومعاملتك نشطة الآن. ستصلك قريبًا رسالة بريد بالملخص وتعليمات المنطقة الشخصية لتحميل المستندات.",
    body_pending:
      "استلمنا الطلب. التأكيد النهائي للدفع يصل من نظامنا خلال لحظات: ستصلك رسالة بريد عند اكتمال كل شيء. يمكنك الدخول إلى المنطقة الشخصية الآن.",
    email_note_before: "ادخل إلى المنطقة الشخصية بنفس",
    email_note_strong: "البريد المستخدم للدفع",
    email_note_after:
      ": هكذا تعثر على المعاملة. إن استخدمت بريدًا آخر (أو Google بحساب مختلف) فلن تراها.",
    cta_area: "إلى المنطقة الشخصية",
    cta_home: "العودة للرئيسية",
    taxes_note:
      "الضرائب منفصلة عن الأتعاب: نحسبها ونبلّغك بها قبل الإرسال.",
    meta_title: "تم استلام الدفع",
  },
  contact_ui: {
    name: "الاسم واللقب",
    email: "البريد",
    phone: "الهاتف (اختياري)",
    message: "الرسالة",
    submit: "إرسال الرسالة",
  },
  soft_lead_ui: {
    name: "الاسم واللقب (اختياري)",
    email: "البريد",
    phone: "الهاتف",
    phone_optional: "الهاتف (اختياري)",
    submitting: "جاري الإرسال…",
    err_save:
      "تعذّر تسجيل الطلب حاليًا. أعد المحاولة لاحقًا أو اتصل بنا.",
  },
  guide_ui: {
    search_placeholder: "ابحث في الأدلة…",
    all: "الكل",
    free_tool: "أداة مجانية",
    back: "العودة إلى الأدلة",
    author_heading: "من كتب هذا الدليل",
    related: "أدلة ذات صلة",
  },
  chrome_ui: {
    lang_aria: "اختر اللغة",
    menu_open: "فتح القائمة",
    menu_close: "إغلاق القائمة",
  },
};

function upsert(filePath, locale, values) {
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  const byKey = new Map(
    data.entries
      .filter((e) => e.collection === "site_ui")
      .map((e) => [e.key, e]),
  );
  for (const [key, value] of Object.entries(values)) {
    const existing = byKey.get(key);
    if (existing) {
      existing.value = value;
      existing.locale = locale;
      existing.is_published = true;
    } else {
      data.entries.push({
        collection: "site_ui",
        key,
        locale,
        is_published: true,
        value,
      });
    }
  }
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`patched ${filePath}`);
}

upsert(join(root, "src/content/content_entries.it.json"), "it", IT);
upsert(join(root, "src/content/content_entries.ar.json"), "ar", AR);
