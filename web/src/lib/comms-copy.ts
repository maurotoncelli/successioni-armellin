import type { PracticeStatus } from "@/content/crm-data";
import type { CommsLocale } from "@/lib/comms-locale-shared";

/*
  Copy comunicazioni cliente (email + notifiche in-app) per locale.
  IT = fonte operativa; AR = cortesia (traduzione automatica).
  Usato al push/send e in lettura (overlay se la preferenza cambia).
*/

export type StatusClientCopy = {
  title: string;
  body: string;
  href: string;
};

export type StatusEmailCopy = {
  subject: string;
  heading: string;
  body: string;
  cta: string;
};

const STATUS_HREF: Record<string, string> = {
  PAGATO: "/area-riservata/documenti",
  ATTESA_DOC: "/area-riservata/documenti",
  LAVORAZIONE: "/area-riservata/dashboard",
  INVIATA: "/area-riservata/dashboard",
  CHIUSA: "/area-riservata/conclusa",
};

const STATUS_CLIENT: Record<
  CommsLocale,
  Partial<Record<PracticeStatus, Omit<StatusClientCopy, "href">>>
> = {
  it: {
    PAGATO: {
      title: "Pagamento ricevuto",
      body: "La pratica è avviata. Carica i documenti richiesti.",
    },
    ATTESA_DOC: {
      title: "Servono ancora dei documenti",
      body: "Completa la lista in area personale per andare avanti.",
    },
    LAVORAZIONE: {
      title: "Stiamo lavorando alla tua pratica",
      body: "Abbiamo tutto il necessario. Ti aggiorniamo appena ci sono novità.",
    },
    INVIATA: {
      title: "Dichiarazione inviata all'Agenzia",
      body: "Appena arriva la ricevuta la trovi tra i documenti finali.",
    },
    CHIUSA: {
      title: "Pratica conclusa",
      body: "Puoi scaricare i documenti finali dalla tua area personale.",
    },
  },
  ar: {
    PAGATO: {
      title: "تم استلام الدفع",
      body: "المعاملة نشطة. حمّل المستندات المطلوبة.",
    },
    ATTESA_DOC: {
      title: "ما زالت هناك مستندات ناقصة",
      body: "أكمل القائمة في المنطقة الشخصية للمتابعة.",
    },
    LAVORAZIONE: {
      title: "نعمل على معاملتك",
      body: "لدينا كل ما يلزم. سنُحدّثك عند وجود جديد.",
    },
    INVIATA: {
      title: "أُرسل التصريح إلى الوكالة",
      body: "عند وصول الإيصال تجده بين المستندات النهائية.",
    },
    CHIUSA: {
      title: "أُغلقت المعاملة",
      body: "يمكنك تنزيل المستندات النهائية من منطقتك الشخصية.",
    },
  },
};

const STATUS_EMAIL: Record<
  CommsLocale,
  Partial<Record<PracticeStatus, StatusEmailCopy>>
> = {
  it: {
    PAGATO: {
      subject: "Pagamento ricevuto: ora carica i documenti",
      heading: "Grazie, abbiamo ricevuto il pagamento",
      body: "La tua pratica e ufficialmente avviata. Il prossimo passo e caricare i documenti richiesti nella tua area personale: ti guidiamo passo passo, e ci vogliono pochi minuti.",
      cta: "Carica i documenti",
    },
    ATTESA_DOC: {
      subject: "Mancano alcuni documenti per procedere",
      heading: "Ci servono ancora alcuni documenti",
      body: "Per andare avanti con la tua successione abbiamo bisogno di completare la lista dei documenti. Trovi tutto, con le istruzioni, nella tua area personale.",
      cta: "Completa i documenti",
    },
    LAVORAZIONE: {
      subject: "Stiamo lavorando alla tua pratica",
      heading: "Ci pensiamo noi",
      body: "Abbiamo tutto il necessario e stiamo predisponendo la tua dichiarazione di successione. Ti aggiorniamo appena ci sono novita: non devi fare nulla.",
      cta: "Vedi lo stato",
    },
    INVIATA: {
      subject: "Pratica inviata all'Agenzia delle Entrate",
      heading: "Inviata all'Agenzia delle Entrate",
      body: "La tua dichiarazione di successione e stata trasmessa. Appena riceviamo la ricevuta di registrazione la trovi nella tua area personale.",
      cta: "Vai all'area personale",
    },
    CHIUSA: {
      subject: "La tua pratica e conclusa",
      heading: "Tutto fatto!",
      body: "La tua successione e conclusa. Nella tua area personale trovi i documenti finali (ricevuta di presentazione, dichiarazione, visure) da scaricare e conservare.",
      cta: "Scarica i documenti",
    },
  },
  ar: {
    PAGATO: {
      subject: "تم استلام الدفع: حمّل المستندات الآن",
      heading: "شكرًا، استلمنا الدفع",
      body: "معاملتك نشطة رسميًا. الخطوة التالية هي تحميل المستندات المطلوبة في منطقتك الشخصية: نرشدك خطوة بخطوة، ويستغرق الأمر دقائق قليلة.",
      cta: "تحميل المستندات",
    },
    ATTESA_DOC: {
      subject: "تنقص بعض المستندات للمتابعة",
      heading: "ما زلنا بحاجة إلى بعض المستندات",
      body: "للمضي قدمًا في ميراثك نحتاج إلى إكمال قائمة المستندات. تجد كل شيء مع التعليمات في منطقتك الشخصية.",
      cta: "أكمل المستندات",
    },
    LAVORAZIONE: {
      subject: "نعمل على معاملتك",
      heading: "نحن نتولّى الأمر",
      body: "لدينا كل ما يلزم ونعدّ تصريحة الميراث الخاصة بك. سنُحدّثك عند وجود جديد: لا يلزمك فعل شيء.",
      cta: "عرض الحالة",
    },
    INVIATA: {
      subject: "أُرسلت المعاملة إلى وكالة الإيرادات",
      heading: "أُرسلت إلى وكالة الإيرادات",
      body: "أُرسلت تصريحة الميراث. عند استلام إيصال التسجيل تجده في منطقتك الشخصية.",
      cta: "إلى المنطقة الشخصية",
    },
    CHIUSA: {
      subject: "أُغلقت معاملتك",
      heading: "تمّ كل شيء!",
      body: "أُغلق ملف الميراث. في منطقتك الشخصية تجد المستندات النهائية (إيصال التقديم والتصريح والكشوف) للتنزيل والحفظ.",
      cta: "تنزيل المستندات",
    },
  },
};

export function statusClientCopy(
  status: PracticeStatus,
  locale: CommsLocale = "it",
): StatusClientCopy | null {
  const tpl = STATUS_CLIENT[locale][status] ?? STATUS_CLIENT.it[status];
  if (!tpl) return null;
  return { ...tpl, href: STATUS_HREF[status] ?? "/area-riservata/dashboard" };
}

export function statusEmailCopy(
  status: PracticeStatus,
  locale: CommsLocale = "it",
): StatusEmailCopy | null {
  return STATUS_EMAIL[locale][status] ?? STATUS_EMAIL.it[status] ?? null;
}

export function documentRejectedNotif(
  docLabel: string,
  reason: string,
  locale: CommsLocale = "it",
) {
  if (locale === "ar") {
    return {
      title: `مستند يجب إعادة تحميله: ${docLabel}`,
      body: reason,
    };
  }
  return {
    title: `Documento da rifare: ${docLabel}`,
    body: reason,
  };
}

export function taxesNotif(amount: number, locale: CommsLocale = "it") {
  const n =
    locale === "ar"
      ? amount.toLocaleString("ar")
      : amount.toLocaleString("it-IT");
  if (locale === "ar") {
    return {
      title: `أُبلغت الضرائب: ${n} €`,
      body: "منفصلة عن الأتعاب وتُدفع للدولة (F24). أدخل IBAN إن طُلب.",
    };
  }
  return {
    title: `Imposte comunicate: ${n} €`,
    body: "Sono separate dall'onorario e si versano allo Stato (F24). Inserisci l'IBAN se richiesto.",
  };
}

export function finalDocsNotif(locale: CommsLocale = "it") {
  if (locale === "ar") {
    return {
      title: "المستندات النهائية جاهزة",
      body: "يمكنك تنزيلها من منطقتك الشخصية.",
    };
  }
  return {
    title: "Documenti finali pronti",
    body: "Puoi scaricarli dalla tua area personale.",
  };
}

export function withdrawalNotif(
  outcome: "ACCEPTED" | "REJECTED",
  refundIssued: boolean,
  locale: CommsLocale = "it",
) {
  if (locale === "ar") {
    if (outcome === "ACCEPTED") {
      return {
        title: refundIssued
          ? "قُبل العدول: صدر الاسترداد"
          : "قُبل العدول",
        body: refundIssued
          ? "صدر الاسترداد: عادة تراه على البطاقة خلال 5–10 أيام عمل."
          : "أُلغيت المعاملة. إن وُجد استرداد مستحق، بعد إصداره تراه على البطاقة خلال 5–10 أيام عمل.",
      };
    }
    return {
      title: "نتيجة طلب العدول",
      body: "قيّمنا طلب العدول الخاص بك.",
    };
  }
  if (outcome === "ACCEPTED") {
    return {
      title: refundIssued
        ? "Recesso accettato: rimborso emesso"
        : "Recesso accettato",
      body: refundIssued
        ? "Rimborso emesso: di norma lo vedi sulla carta entro 5-10 giorni lavorativi."
        : "La pratica è stata annullata. Se è dovuto un rimborso, una volta emesso lo vedi sulla carta entro 5-10 giorni lavorativi.",
    };
  }
  return {
    title: "Esito sulla richiesta di recesso",
    body: "Abbiamo valutato la tua richiesta di recesso.",
  };
}

type EmailBundle = {
  subject: string;
  heading: string;
  bodyHtml: (esc: (s: string) => string, eur: (n: number) => string) => string;
  ctaLabel: string;
  ctaPath: string;
};

export function reviewEmail(locale: CommsLocale = "it"): {
  subject: string;
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
} {
  if (locale === "ar") {
    return {
      subject: "دقيقة لمراجعة؟",
      heading: "هل تساعدنا بمراجعة؟",
      bodyHtml: `<p style="margin:0 0 10px">أُغلقت معاملة الميراث. إن كنت راضيًا عن لورنزو، مراجعة على Google تساعدنا كثيرًا — تستغرق دقيقة.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">شكرًا من القلب، حتى لمجرد القراءة.</p>`,
      ctaLabel: "اكتب على Google",
    };
  }
  return {
    subject: "Un minuto per una recensione?",
    heading: "Ci aiuti con una recensione?",
    bodyHtml: `<p style="margin:0 0 10px">La tua pratica di successione è conclusa. Se ti sei trovato bene con Lorenzo, una recensione su Google ci aiuta tantissimo — ci vuole un minuto.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Grazie di cuore, anche solo per aver letto.</p>`,
    ctaLabel: "Scrivi su Google",
  };
}

export function taxesEmail(
  amount: number,
  locale: CommsLocale = "it",
): { subject: string; heading: string; bodyHtml: string; ctaLabel: string } {
  const formatted =
    locale === "ar"
      ? `${amount.toLocaleString("ar")} €`
      : `${amount.toLocaleString("it-IT")} €`;
  if (locale === "ar") {
    return {
      subject: "ضرائب ميراثك",
      heading: "حُسبت الضرائب",
      bodyHtml: `<p style="margin:0 0 10px">حسبنا الضرائب المستحقة لميراثك (نموذج F24، تصفية ذاتية):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">هذه المبالغ <strong>ليست أتعابنا</strong>: تُدفع للدولة. في منطقتك الشخصية تجد التفاصيل ويمكنك إدخال IBAN للخصم.</p>`,
      ctaLabel: "إلى المنطقة الشخصية",
    };
  }
  return {
    subject: "Le imposte della tua successione",
    heading: "Imposte calcolate",
    bodyHtml: `<p style="margin:0 0 10px">Abbiamo calcolato le imposte dovute per la tua successione (modello F24, autoliquidazione):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Queste somme <strong>non sono il nostro onorario</strong>: si versano allo Stato. Nella tua area personale trovi il dettaglio e puoi inserire l'IBAN per l'addebito.</p>`,
    ctaLabel: "Vai all'area personale",
  };
}

export function finalDocsEmail(locale: CommsLocale = "it") {
  if (locale === "ar") {
    return {
      subject: "المستندات النهائية لميراثك جاهزة",
      heading: "مستندات جاهزة للتنزيل",
      bodyHtml: `<p style="margin:0">حمّلنا المستندات النهائية لمعاملتك (إيصال التقديم والتصريح والكشوف). تجدها في منطقتك الشخصية جاهزة للتنزيل والحفظ.</p>`,
      ctaLabel: "تنزيل المستندات",
    };
  }
  return {
    subject: "I documenti finali della tua successione sono pronti",
    heading: "Documenti pronti da scaricare",
    bodyHtml: `<p style="margin:0">Abbiamo caricato i documenti finali della tua pratica (ricevuta di presentazione, dichiarazione, visure). Li trovi nella tua area personale, pronti da scaricare e conservare.</p>`,
    ctaLabel: "Scarica i documenti",
  };
}

export function withdrawalEmail(
  outcome: "ACCEPTED" | "REJECTED" | "IN_REVIEW",
  note: string,
  opts: { refundIssued?: boolean },
  locale: CommsLocale,
  esc: (s: string) => string,
): { subject: string; heading: string; bodyHtml: string; ctaLabel: string } {
  const noteBlock = note
    ? `<p style="margin:0;padding:10px 12px;background:#f4f5f3;border-radius:8px">${esc(note)}</p>`
    : "";

  if (locale === "ar") {
    const map = {
      IN_REVIEW: {
        subject: "نقيّم طلب العدول الخاص بك",
        heading: "الطلب قيد المعالجة",
        body: "استلمنا طلب العدول ونقيّمه. سنُبلّغك بالنتيجة قريبًا.",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "قُبل العدول: صدر الاسترداد"
          : "قُبل العدول",
        heading: opts.refundIssued
          ? "قُبل العدول وصدر الاسترداد"
          : "قُبل العدول",
        body: opts.refundIssued
          ? "قُبل طلب العدول وأصدرنا الاسترداد بالمبلغ المستحق. تراه عادة على بطاقة الدفع خلال <strong>5–10 أيام عمل</strong> (أوقات بنكك أو جهة إصدار البطاقة)."
          : "قُبل طلب العدول. إن وُجد استرداد مستحق نصدره بنفس طريقة الدفع: بعد الإصدار يضيفه البنك عادة خلال <strong>5–10 أيام عمل</strong>.",
      },
      REJECTED: {
        subject: "نتيجة طلب العدول",
        heading: "طلب العدول",
        body: "قيّمنا طلب العدول. تجد الأسباب أدناه؛ نحن متاحون لأي توضيح.",
      },
    }[outcome];
    return {
      subject: map.subject,
      heading: map.heading,
      bodyHtml: `<p style="margin:0 0 10px">${map.body}</p>${noteBlock}`,
      ctaLabel: "إلى المنطقة الشخصية",
    };
  }

  const acceptedBody = opts.refundIssued
    ? "La tua richiesta di recesso e stata accettata e abbiamo emesso il rimborso sull'importo dovuto. Lo vedrai sulla carta usata per il pagamento di norma entro <strong>5-10 giorni lavorativi</strong> (tempi della tua banca o dell'emittente della carta; a volte compare come storno della spesa originale)."
    : "La tua richiesta di recesso e stata accettata. Se e dovuto un rimborso, lo emettiamo con lo stesso metodo di pagamento: una volta emesso, la banca lo accredita di norma entro <strong>5-10 giorni lavorativi</strong>.";
  const map = {
    IN_REVIEW: {
      subject: "Stiamo valutando la tua richiesta di recesso",
      heading: "Richiesta in gestione",
      body: "Abbiamo preso in carico la tua richiesta di recesso e la stiamo valutando. Ti aggiorniamo a breve con l'esito.",
    },
    ACCEPTED: {
      subject: opts.refundIssued
        ? "Recesso accettato: rimborso emesso"
        : "Recesso accettato",
      heading: opts.refundIssued
        ? "Recesso accettato, rimborso emesso"
        : "Recesso accettato",
      body: acceptedBody,
    },
    REJECTED: {
      subject: "Esito della tua richiesta di recesso",
      heading: "Richiesta di recesso",
      body: "Abbiamo valutato la tua richiesta di recesso. Trovi di seguito le motivazioni; restiamo a disposizione per chiarimenti.",
    },
  }[outcome];
  return {
    subject: map.subject,
    heading: map.heading,
    bodyHtml: `<p style="margin:0 0 10px">${map.body}</p>${noteBlock}`,
    ctaLabel: "Vai all'area personale",
  };
}

export function invoiceEmail(number: string, locale: CommsLocale = "it") {
  if (locale === "ar") {
    return {
      subject: `فاتورتك متاحة (رقم ${number})`,
      heading: "الفاتورة متاحة",
      bodyHtml: `<p style="margin:0 0 10px">أصدرنا فاتورة الأتعاب <strong>رقم ${number}</strong> لمعاملة الميراث.</p>
      <p style="margin:0">تجدها ويمكنك تنزيلها في منطقتك الشخصية، قسم «مشترياتك».</p>`,
      ctaLabel: "تنزيل الفاتورة",
    };
  }
  return {
    subject: `La tua fattura e disponibile (n. ${number})`,
    heading: "Fattura disponibile",
    bodyHtml: `<p style="margin:0 0 10px">Abbiamo emesso la fattura dell'onorario <strong>n. ${number}</strong> per la tua pratica di successione.</p>
      <p style="margin:0">La trovi e la puoi scaricare nella tua area personale, nella sezione "Il tuo acquisto".</p>`,
    ctaLabel: "Scarica la fattura",
  };
}

export function documentRejectedEmail(
  docLabel: string,
  reason: string,
  locale: CommsLocale,
  esc: (s: string) => string,
) {
  if (locale === "ar") {
    return {
      subject: `مستند يجب إعادة تحميله: ${docLabel}`,
      heading: "مستند يجب إعادة إعداده",
      bodyHtml: `<p style="margin:0 0 10px">المستند <strong>${esc(docLabel)}</strong> يحتاج إلى تصحيح:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">يمكنك إعادة تحميله من منطقتك الشخصية، أمر سريع.</p>`,
      ctaLabel: "إعادة تحميل المستند",
    };
  }
  return {
    subject: `Un documento va ricaricato: ${docLabel}`,
    heading: "Un documento va rifatto",
    bodyHtml: `<p style="margin:0 0 10px">Il documento <strong>${esc(docLabel)}</strong> ha bisogno di una correzione:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Puoi ricaricarlo dalla tua area personale, e una cosa veloce.</p>`,
    ctaLabel: "Ricarica il documento",
  };
}

/** Subject storico comunicazioni webhook (allineato a email PAGATO). */
export function paymentReceivedCommSubject(locale: CommsLocale = "it"): string {
  if (locale === "ar") return "تم استلام الدفع: معاملتك نشطة";
  return "Pagamento ricevuto: la tua pratica e attiva";
}

/**
 * Ripresenta titolo/body notifiche gia salvate nella lingua preferita corrente.
 * Match esatto o prefissi noti (documento / imposte).
 */
export function presentNotificationCopy(
  title: string,
  body: string,
  locale: CommsLocale,
): { title: string; body: string } {
  for (const status of Object.keys(STATUS_CLIENT.it) as PracticeStatus[]) {
    const it = STATUS_CLIENT.it[status];
    const ar = STATUS_CLIENT.ar[status];
    if (!it || !ar) continue;
    if (
      (title === it.title && body === it.body) ||
      (title === ar.title && body === ar.body)
    ) {
      const next = STATUS_CLIENT[locale][status] ?? it;
      return { title: next.title, body: next.body };
    }
    if (title === it.title || title === ar.title) {
      const next = STATUS_CLIENT[locale][status] ?? it;
      return { title: next.title, body: next.body };
    }
  }

  const docIt = "Documento da rifare: ";
  const docAr = "مستند يجب إعادة تحميله: ";
  if (title.startsWith(docIt) || title.startsWith(docAr)) {
    const label = title.startsWith(docIt)
      ? title.slice(docIt.length)
      : title.slice(docAr.length);
    return documentRejectedNotif(label, body, locale);
  }

  const taxIt = "Imposte comunicate: ";
  const taxAr = "أُبلغت الضرائب: ";
  if (title.startsWith(taxIt) || title.startsWith(taxAr)) {
    const rest = title.startsWith(taxIt)
      ? title.slice(taxIt.length)
      : title.slice(taxAr.length);
    const amount = Number(rest.replace(/[^\d.,]/g, "").replace(",", "."));
    if (Number.isFinite(amount) && amount > 0) {
      return taxesNotif(amount, locale);
    }
  }

  const finals = [
    finalDocsNotif("it"),
    finalDocsNotif("ar"),
    withdrawalNotif("ACCEPTED", false, "it"),
    withdrawalNotif("ACCEPTED", true, "it"),
    withdrawalNotif("REJECTED", false, "it"),
    withdrawalNotif("ACCEPTED", false, "ar"),
    withdrawalNotif("ACCEPTED", true, "ar"),
    withdrawalNotif("REJECTED", false, "ar"),
  ];
  for (const cand of finals) {
    if (title === cand.title) {
      // Prefer exact title remaps via withdrawal/final helpers already listed
      if (title === finalDocsNotif("it").title || title === finalDocsNotif("ar").title) {
        return finalDocsNotif(locale);
      }
      if (
        title === withdrawalNotif("ACCEPTED", true, "it").title ||
        title === withdrawalNotif("ACCEPTED", true, "ar").title
      ) {
        return { ...withdrawalNotif("ACCEPTED", true, locale), body };
      }
      if (
        title === withdrawalNotif("ACCEPTED", false, "it").title ||
        title === withdrawalNotif("ACCEPTED", false, "ar").title
      ) {
        return { ...withdrawalNotif("ACCEPTED", false, locale), body };
      }
      if (
        title === withdrawalNotif("REJECTED", false, "it").title ||
        title === withdrawalNotif("REJECTED", false, "ar").title
      ) {
        return { ...withdrawalNotif("REJECTED", false, locale), body };
      }
    }
  }

  return { title, body };
}

/** Subject email/comunicazioni gia salvati → lingua preferita. */
export function presentCommSubject(
  subject: string,
  locale: CommsLocale,
): string {
  const pairs: Array<[string, string]> = [];
  for (const status of Object.keys(STATUS_EMAIL.it) as PracticeStatus[]) {
    const it = STATUS_EMAIL.it[status]?.subject;
    const ar = STATUS_EMAIL.ar[status]?.subject;
    if (it && ar) pairs.push([it, ar]);
  }
  pairs.push([
    paymentReceivedCommSubject("it"),
    paymentReceivedCommSubject("ar"),
  ]);
  pairs.push([reviewEmail("it").subject, reviewEmail("ar").subject]);
  pairs.push([taxesEmail(0, "it").subject, taxesEmail(0, "ar").subject]);
  pairs.push([finalDocsEmail("it").subject, finalDocsEmail("ar").subject]);
  for (const refund of [false, true]) {
    pairs.push([
      withdrawalEmail("ACCEPTED", "", { refundIssued: refund }, "it", (s) => s)
        .subject,
      withdrawalEmail("ACCEPTED", "", { refundIssued: refund }, "ar", (s) => s)
        .subject,
    ]);
  }
  pairs.push([
    withdrawalEmail("IN_REVIEW", "", {}, "it", (s) => s).subject,
    withdrawalEmail("IN_REVIEW", "", {}, "ar", (s) => s).subject,
  ]);
  pairs.push([
    withdrawalEmail("REJECTED", "", {}, "it", (s) => s).subject,
    withdrawalEmail("REJECTED", "", {}, "ar", (s) => s).subject,
  ]);

  for (const [it, ar] of pairs) {
    if (subject === it || subject === ar) {
      return locale === "ar" ? ar : it;
    }
  }

  const docIt = "Un documento va ricaricato: ";
  const docAr = "مستند يجب إعادة تحميله: ";
  if (subject.startsWith(docIt) || subject.startsWith(docAr)) {
    const label = subject.startsWith(docIt)
      ? subject.slice(docIt.length)
      : subject.slice(docAr.length);
    return documentRejectedEmail(label, "", locale, (s) => s).subject;
  }

  const invIt = /^La tua fattura e disponibile \(n\. (.+)\)$/;
  const invAr = /^فاتورتك متاحة \(رقم (.+)\)$/;
  const mIt = subject.match(invIt);
  const mAr = subject.match(invAr);
  if (mIt || mAr) {
    return invoiceEmail((mIt ?? mAr)![1], locale).subject;
  }

  return subject;
}

// silence unused type if tree-shaken weirdly
export type _EmailBundle = EmailBundle;
