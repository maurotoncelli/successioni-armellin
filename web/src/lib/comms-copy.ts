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
  en: {
    PAGATO: {
      title: "Payment received",
      body: "Your case is started. Upload the required documents.",
    },
    ATTESA_DOC: {
      title: "More documents are needed",
      body: "Complete the list in your client area to continue.",
    },
    LAVORAZIONE: {
      title: "We're working on your case",
      body: "We have everything we need. We'll update you when there's news.",
    },
    INVIATA: {
      title: "Declaration filed with the Agency",
      body: "When the receipt arrives you'll find it among the final documents.",
    },
    CHIUSA: {
      title: "Case completed",
      body: "You can download the final documents from your client area.",
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
  en: {
    PAGATO: {
      subject: "Payment received: upload your documents now",
      heading: "Thank you, we've received the payment",
      body: "Your case is officially started. Next step: upload the required documents in your client area — we guide you step by step; it only takes a few minutes.",
      cta: "Upload documents",
    },
    ATTESA_DOC: {
      subject: "Some documents are still needed to proceed",
      heading: "We still need some documents",
      body: "To continue with your succession we need to complete the document list. You'll find everything, with instructions, in your client area.",
      cta: "Complete documents",
    },
    LAVORAZIONE: {
      subject: "We're working on your case",
      heading: "We've got this",
      body: "We have everything we need and are preparing your succession declaration. We'll update you when there's news — nothing for you to do.",
      cta: "View status",
    },
    INVIATA: {
      subject: "Case filed with Agenzia delle Entrate",
      heading: "Filed with Agenzia delle Entrate",
      body: "Your succession declaration has been transmitted. When we receive the registration receipt you'll find it in your client area.",
      cta: "Go to client area",
    },
    CHIUSA: {
      subject: "Your case is completed",
      heading: "All done!",
      body: "Your succession is completed. In your client area you'll find the final documents (filing receipt, declaration, searches) to download and keep.",
      cta: "Download documents",
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
  if (locale === "en") {
    return {
      title: `Document to re-upload: ${docLabel}`,
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
      : locale === "en"
        ? amount.toLocaleString("en-GB")
        : amount.toLocaleString("it-IT");
  if (locale === "ar") {
    return {
      title: `أُبلغت الضرائب: ${n} €`,
      body: "منفصلة عن الأتعاب وتُدفع للدولة (F24). أدخل IBAN إن طُلب.",
    };
  }
  if (locale === "en") {
    return {
      title: `Taxes notified: ${n} €`,
      body: "They are separate from the fee and paid to the State (F24). Enter the IBAN if requested.",
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
  if (locale === "en") {
    return {
      title: "Final documents ready",
      body: "You can download them from your client area.",
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
  if (locale === "en") {
    if (outcome === "ACCEPTED") {
      return {
        title: refundIssued
          ? "Withdrawal accepted: refund issued"
          : "Withdrawal accepted",
        body: refundIssued
          ? "Refund issued: you normally see it on the card within 5–10 business days."
          : "The case has been cancelled. If a refund is due, once issued you see it on the card within 5–10 business days.",
      };
    }
    return {
      title: "Outcome of your withdrawal request",
      body: "We have reviewed your withdrawal request.",
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
  if (locale === "en") {
    return {
      subject: "A minute for a review?",
      heading: "Would you leave us a review?",
      bodyHtml: `<p style="margin:0 0 10px">Your succession case is completed. If you had a good experience with Lorenzo, a Google review helps us a lot — it takes a minute.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Thank you, even just for reading.</p>`,
      ctaLabel: "Write on Google",
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
      : locale === "en"
        ? `${amount.toLocaleString("en-GB")} €`
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
  if (locale === "en") {
    return {
      subject: "The taxes for your succession",
      heading: "Taxes calculated",
      bodyHtml: `<p style="margin:0 0 10px">We have calculated the taxes due for your succession (F24 form, self-assessment):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">These amounts <strong>are not our fee</strong>: they are paid to the State. In your client area you'll find the details and can enter the IBAN for the debit.</p>`,
      ctaLabel: "Go to client area",
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
  if (locale === "en") {
    return {
      subject: "Your succession final documents are ready",
      heading: "Documents ready to download",
      bodyHtml: `<p style="margin:0">We have uploaded the final documents for your case (filing receipt, declaration, searches). You'll find them in your client area, ready to download and keep.</p>`,
      ctaLabel: "Download documents",
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

  if (locale === "en") {
    const acceptedBodyEn = opts.refundIssued
      ? "Your withdrawal request was accepted and we issued the refund on the amount due. You'll normally see it on the card used for payment within <strong>5–10 business days</strong> (your bank or card issuer's timing; sometimes it appears as a reversal of the original charge)."
      : "Your withdrawal request was accepted. If a refund is due, we issue it with the same payment method: once issued, the bank normally credits it within <strong>5–10 business days</strong>.";
    const mapEn = {
      IN_REVIEW: {
        subject: "We're reviewing your withdrawal request",
        heading: "Request in progress",
        body: "We've received your withdrawal request and are reviewing it. We'll update you shortly with the outcome.",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Withdrawal accepted: refund issued"
          : "Withdrawal accepted",
        heading: opts.refundIssued
          ? "Withdrawal accepted, refund issued"
          : "Withdrawal accepted",
        body: acceptedBodyEn,
      },
      REJECTED: {
        subject: "Outcome of your withdrawal request",
        heading: "Withdrawal request",
        body: "We have reviewed your withdrawal request. You'll find the reasons below; we're available for any clarification.",
      },
    }[outcome];
    return {
      subject: mapEn.subject,
      heading: mapEn.heading,
      bodyHtml: `<p style="margin:0 0 10px">${mapEn.body}</p>${noteBlock}`,
      ctaLabel: "Go to client area",
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
  if (locale === "en") {
    return {
      subject: `Your invoice is available (no. ${number})`,
      heading: "Invoice available",
      bodyHtml: `<p style="margin:0 0 10px">We have issued the fee invoice <strong>no. ${number}</strong> for your succession case.</p>
      <p style="margin:0">You'll find it and can download it in your client area, under "Your purchase".</p>`,
      ctaLabel: "Download invoice",
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
  if (locale === "en") {
    return {
      subject: `A document must be re-uploaded: ${docLabel}`,
      heading: "A document must be redone",
      bodyHtml: `<p style="margin:0 0 10px">The document <strong>${esc(docLabel)}</strong> needs a correction:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">You can re-upload it from your client area — it's quick.</p>`,
      ctaLabel: "Re-upload document",
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
  if (locale === "en") return "Payment received: your case is active";
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
    const en = STATUS_CLIENT.en[status];
    if (!it) continue;
    const known = [it, ar, en].filter(Boolean) as Array<{
      title: string;
      body: string;
    }>;
    if (known.some((k) => title === k.title && body === k.body)) {
      const next = STATUS_CLIENT[locale][status] ?? it;
      return { title: next.title, body: next.body };
    }
    if (known.some((k) => title === k.title)) {
      const next = STATUS_CLIENT[locale][status] ?? it;
      return { title: next.title, body: next.body };
    }
  }

  const docPrefixes = [
    "Documento da rifare: ",
    "مستند يجب إعادة تحميله: ",
    "Document to re-upload: ",
  ];
  for (const prefix of docPrefixes) {
    if (title.startsWith(prefix)) {
      return documentRejectedNotif(title.slice(prefix.length), body, locale);
    }
  }

  const taxPrefixes = [
    "Imposte comunicate: ",
    "أُبلغت الضرائب: ",
    "Taxes notified: ",
  ];
  for (const prefix of taxPrefixes) {
    if (title.startsWith(prefix)) {
      const rest = title.slice(prefix.length);
      const amount = Number(rest.replace(/[^\d.,]/g, "").replace(",", "."));
      if (Number.isFinite(amount) && amount > 0) {
        return taxesNotif(amount, locale);
      }
    }
  }

  const finalTitles = [
    finalDocsNotif("it").title,
    finalDocsNotif("ar").title,
    finalDocsNotif("en").title,
  ];
  if (finalTitles.includes(title)) return finalDocsNotif(locale);

  for (const refund of [true, false] as const) {
    const titles = [
      withdrawalNotif("ACCEPTED", refund, "it").title,
      withdrawalNotif("ACCEPTED", refund, "ar").title,
      withdrawalNotif("ACCEPTED", refund, "en").title,
    ];
    if (titles.includes(title)) {
      return { ...withdrawalNotif("ACCEPTED", refund, locale), body };
    }
  }
  const rejectedTitles = [
    withdrawalNotif("REJECTED", false, "it").title,
    withdrawalNotif("REJECTED", false, "ar").title,
    withdrawalNotif("REJECTED", false, "en").title,
  ];
  if (rejectedTitles.includes(title)) {
    return { ...withdrawalNotif("REJECTED", false, locale), body };
  }

  return { title, body };
}

/** Subject email/comunicazioni gia salvati → lingua preferita. */
export function presentCommSubject(
  subject: string,
  locale: CommsLocale,
): string {
  const groups: string[][] = [];
  for (const status of Object.keys(STATUS_EMAIL.it) as PracticeStatus[]) {
    const subjects = [
      STATUS_EMAIL.it[status]?.subject,
      STATUS_EMAIL.ar[status]?.subject,
      STATUS_EMAIL.en[status]?.subject,
    ].filter((s): s is string => !!s);
    if (subjects.length) groups.push(subjects);
  }
  groups.push([
    paymentReceivedCommSubject("it"),
    paymentReceivedCommSubject("ar"),
    paymentReceivedCommSubject("en"),
  ]);
  groups.push([
    reviewEmail("it").subject,
    reviewEmail("ar").subject,
    reviewEmail("en").subject,
  ]);
  groups.push([
    taxesEmail(0, "it").subject,
    taxesEmail(0, "ar").subject,
    taxesEmail(0, "en").subject,
  ]);
  groups.push([
    finalDocsEmail("it").subject,
    finalDocsEmail("ar").subject,
    finalDocsEmail("en").subject,
  ]);
  for (const refund of [false, true]) {
    groups.push([
      withdrawalEmail("ACCEPTED", "", { refundIssued: refund }, "it", (s) => s)
        .subject,
      withdrawalEmail("ACCEPTED", "", { refundIssued: refund }, "ar", (s) => s)
        .subject,
      withdrawalEmail("ACCEPTED", "", { refundIssued: refund }, "en", (s) => s)
        .subject,
    ]);
  }
  groups.push([
    withdrawalEmail("IN_REVIEW", "", {}, "it", (s) => s).subject,
    withdrawalEmail("IN_REVIEW", "", {}, "ar", (s) => s).subject,
    withdrawalEmail("IN_REVIEW", "", {}, "en", (s) => s).subject,
  ]);
  groups.push([
    withdrawalEmail("REJECTED", "", {}, "it", (s) => s).subject,
    withdrawalEmail("REJECTED", "", {}, "ar", (s) => s).subject,
    withdrawalEmail("REJECTED", "", {}, "en", (s) => s).subject,
  ]);

  for (const group of groups) {
    if (group.includes(subject)) {
      if (locale === "ar") return group[1] ?? group[0];
      if (locale === "en") return group[2] ?? group[0];
      return group[0];
    }
  }

  const docPrefixes = [
    "Un documento va ricaricato: ",
    "مستند يجب إعادة تحميله: ",
    "A document must be re-uploaded: ",
  ];
  for (const prefix of docPrefixes) {
    if (subject.startsWith(prefix)) {
      return documentRejectedEmail(
        subject.slice(prefix.length),
        "",
        locale,
        (s) => s,
      ).subject;
    }
  }

  const invIt = /^La tua fattura e disponibile \(n\. (.+)\)$/;
  const invAr = /^فاتورتك متاحة \(رقم (.+)\)$/;
  const invEn = /^Your invoice is available \(no\. (.+)\)$/;
  const mIt = subject.match(invIt);
  const mAr = subject.match(invAr);
  const mEn = subject.match(invEn);
  if (mIt || mAr || mEn) {
    return invoiceEmail((mIt ?? mAr ?? mEn)![1], locale).subject;
  }

  return subject;
}

// silence unused type if tree-shaken weirdly
export type _EmailBundle = EmailBundle;
