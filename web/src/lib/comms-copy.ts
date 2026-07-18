import type { PracticeStatus } from "@/content/crm-data";
import {
  COMMS_LOCALES,
  type CommsLocale,
} from "@/lib/comms-locale-shared";

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
  tr: {
    PAGATO: {
      title: "Ödeme alındı",
      body: "İşleminiz başlatıldı. Gerekli belgeleri yükleyin.",
    },
    ATTESA_DOC: {
      title: "Hâlâ belge gerekiyor",
      body: "Devam etmek için kişisel alandaki listeyi tamamlayın.",
    },
    LAVORAZIONE: {
      title: "İşleminiz üzerinde çalışıyoruz",
      body: "Gerekli her şey elimizde. Yenilik olduğunda sizi bilgilendiririz.",
    },
    INVIATA: {
      title: "Beyanname Agenzia'ya gönderildi",
      body: "Makbuz geldiğinde nihai belgeler arasında bulursunuz.",
    },
    CHIUSA: {
      title: "İşlem tamamlandı",
      body: "Nihai belgeleri kişisel alanınızdan indirebilirsiniz.",
    },
  },
  fr: {
    PAGATO: {
      title: "Paiement reçu",
      body: "Votre dossier est lancé. Téléversez les documents demandés.",
    },
    ATTESA_DOC: {
      title: "Des documents sont encore nécessaires",
      body: "Complétez la liste dans votre espace personnel pour continuer.",
    },
    LAVORAZIONE: {
      title: "Nous travaillons sur votre dossier",
      body: "Nous avons tout le nécessaire. Nous vous informerons dès qu'il y aura du nouveau.",
    },
    INVIATA: {
      title: "Déclaration envoyée à l'Agence",
      body: "Lorsque le reçu arrive, vous le trouverez parmi les documents finaux.",
    },
    CHIUSA: {
      title: "Dossier terminé",
      body: "Vous pouvez télécharger les documents finaux depuis votre espace personnel.",
    },
  },
  sq: {
    PAGATO: {
      title: "Pagesa u mor",
      body: "Praktika juaj ka filluar. Ngarkoni dokumentet e kërkuara.",
    },
    ATTESA_DOC: {
      title: "Duhet ende dokumente",
      body: "Plotësoni listën në zonën personale për të vazhduar.",
    },
    LAVORAZIONE: {
      title: "Po punojmë me praktikën tuaj",
      body: "Kemi gjithçka që na duhet. Do t'ju njoftojmë sapo të ketë lajme.",
    },
    INVIATA: {
      title: "Deklarata u dërgua te Agjencia",
      body: "Kur të mbërrijë faturimi, e gjeni mes dokumenteve përfundimtare.",
    },
    CHIUSA: {
      title: "Praktika u mbyll",
      body: "Mund t'i shkarkoni dokumentet përfundimtare nga zona personale.",
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
  tr: {
    PAGATO: {
      subject: "Ödeme alındı: şimdi belgelerinizi yükleyin",
      heading: "Teşekkürler, ödemenizi aldık",
      body: "İşleminiz resmi olarak başlatıldı. Sonraki adım: kişisel alanınızda istenen belgeleri yükleyin — adım adım rehberlik ederiz; yalnızca birkaç dakika sürer.",
      cta: "Belgeleri yükle",
    },
    ATTESA_DOC: {
      subject: "Devam etmek için hâlâ bazı belgeler gerekiyor",
      heading: "Hâlâ bazı belgelere ihtiyacımız var",
      body: "Veraset işleminize devam etmek için belge listesini tamamlamamız gerekiyor. Talimatlarla birlikte her şeyi kişisel alanınızda bulursunuz.",
      cta: "Belgeleri tamamla",
    },
    LAVORAZIONE: {
      subject: "İşleminiz üzerinde çalışıyoruz",
      heading: "Biz ilgileniyoruz",
      body: "Gerekli her şey elimizde ve veraset beyannamenizi hazırlıyoruz. Yenilik olduğunda sizi bilgilendiririz — sizin bir şey yapmanız gerekmez.",
      cta: "Durumu gör",
    },
    INVIATA: {
      subject: "İşlem Agenzia delle Entrate'ye gönderildi",
      heading: "Agenzia delle Entrate'ye gönderildi",
      body: "Veraset beyannameniz iletildi. Kayıt makbuzunu aldığımızda kişisel alanınızda bulursunuz.",
      cta: "Kişisel alana git",
    },
    CHIUSA: {
      subject: "İşleminiz tamamlandı",
      heading: "Hepsi tamam!",
      body: "Veraset işleminiz tamamlandı. Kişisel alanınızda indirip saklayabileceğiniz nihai belgeleri (sunum makbuzu, beyanname, tapu kayıtları) bulursunuz.",
      cta: "Belgeleri indir",
    },
  },
  fr: {
    PAGATO: {
      subject: "Paiement reçu : téléversez maintenant vos documents",
      heading: "Merci, nous avons reçu le paiement",
      body: "Votre dossier est officiellement lancé. Prochaine étape : téléverser les documents demandés dans votre espace personnel — nous vous guidons pas à pas ; cela ne prend que quelques minutes.",
      cta: "Téléverser les documents",
    },
    ATTESA_DOC: {
      subject: "Il manque encore des documents pour avancer",
      heading: "Nous avons encore besoin de quelques documents",
      body: "Pour poursuivre votre succession, nous devons compléter la liste des documents. Vous trouverez tout, avec les instructions, dans votre espace personnel.",
      cta: "Compléter les documents",
    },
    LAVORAZIONE: {
      subject: "Nous travaillons sur votre dossier",
      heading: "On s'en occupe",
      body: "Nous avons tout le nécessaire et préparons votre déclaration de succession. Nous vous informerons dès qu'il y aura du nouveau — rien à faire de votre côté.",
      cta: "Voir l'état",
    },
    INVIATA: {
      subject: "Dossier envoyé à l'Agenzia delle Entrate",
      heading: "Envoyé à l'Agenzia delle Entrate",
      body: "Votre déclaration de succession a été transmise. Lorsque nous recevrons le reçu d'enregistrement, vous le trouverez dans votre espace personnel.",
      cta: "Aller à l'espace personnel",
    },
    CHIUSA: {
      subject: "Votre dossier est terminé",
      heading: "Tout est fait !",
      body: "Votre succession est terminée. Dans votre espace personnel, vous trouverez les documents finaux (reçu de dépôt, déclaration, extraits) à télécharger et conserver.",
      cta: "Télécharger les documents",
    },
  },
  sq: {
    PAGATO: {
      subject: "Pagesa u mor: ngarkoni tani dokumentet",
      heading: "Faleminderit, pagesën e kemi marrë",
      body: "Praktika juaj është nisur zyrtarisht. Hapi tjetër: ngarkoni dokumentet e kërkuara në zonën personale — ju udhëzojmë hap pas hapi; zgjat vetëm disa minuta.",
      cta: "Ngarko dokumentet",
    },
    ATTESA_DOC: {
      subject: "Mungojnë ende disa dokumente për të vazhduar",
      heading: "Na duhen ende disa dokumente",
      body: "Për të vazhduar me trashëgiminë tuaj duhet të plotësojmë listën e dokumenteve. Gjeni gjithçka, me udhëzime, në zonën personale.",
      cta: "Plotëso dokumentet",
    },
    LAVORAZIONE: {
      subject: "Po punojmë me praktikën tuaj",
      heading: "Ne e trajtojmë",
      body: "Kemi gjithçka që na duhet dhe po përgatisim deklaratën tuaj të trashëgimisë. Do t'ju njoftojmë sapo të ketë lajme — nuk duhet të bëni asgjë.",
      cta: "Shih statusin",
    },
    INVIATA: {
      subject: "Praktika u dërgua te Agenzia delle Entrate",
      heading: "U dërgua te Agenzia delle Entrate",
      body: "Deklarata juaj e trashëgimisë është dërguar. Kur të marrim faturimin e regjistrimit, e gjeni në zonën personale.",
      cta: "Shko te zona personale",
    },
    CHIUSA: {
      subject: "Praktika juaj është mbyllur",
      heading: "Gjithçka u bë!",
      body: "Trashëgimia juaj është mbyllur. Në zonën personale gjeni dokumentet përfundimtare (faturim dorëzimi, deklaratë, vëzhgime) për t'i shkarkuar dhe ruajtur.",
      cta: "Shkarko dokumentet",
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
  const titles: Record<CommsLocale, string> = {
    it: `Documento da rifare: ${docLabel}`,
    ar: `مستند يجب إعادة تحميله: ${docLabel}`,
    en: `Document to re-upload: ${docLabel}`,
    tr: `Yeniden yüklenecek belge: ${docLabel}`,
    fr: `Document à recharger : ${docLabel}`,
    sq: `Dokument për t'u ringarkuar: ${docLabel}`,
  };
  return { title: titles[locale] ?? titles.it, body: reason };
}

export function taxesNotif(amount: number, locale: CommsLocale = "it") {
  const localeTag: Record<CommsLocale, string> = {
    it: "it-IT",
    ar: "ar",
    en: "en-GB",
    tr: "tr-TR",
    fr: "fr-FR",
    sq: "sq-AL",
  };
  const n = amount.toLocaleString(localeTag[locale] ?? "it-IT");
  const copy: Record<CommsLocale, { title: string; body: string }> = {
    it: {
      title: `Imposte comunicate: ${n} €`,
      body: "Sono separate dall'onorario e si versano allo Stato (F24). Inserisci l'IBAN se richiesto.",
    },
    ar: {
      title: `أُبلغت الضرائب: ${n} €`,
      body: "منفصلة عن الأتعاب وتُدفع للدولة (F24). أدخل IBAN إن طُلب.",
    },
    en: {
      title: `Taxes notified: ${n} €`,
      body: "They are separate from the fee and paid to the State (F24). Enter the IBAN if requested.",
    },
    tr: {
      title: `Vergiler bildirildi: ${n} €`,
      body: "Ücretten ayrıdır ve Devlete ödenir (F24). İstenirse IBAN girin.",
    },
    fr: {
      title: `Impôts communiqués : ${n} €`,
      body: "Ils sont distincts des honoraires et se versent à l'État (F24). Saisissez l'IBAN si demandé.",
    },
    sq: {
      title: `Taksat u njoftuan: ${n} €`,
      body: "Janë të ndara nga shpërblimi dhe paguhen te Shteti (F24). Vendosni IBAN nëse kërkohet.",
    },
  };
  return copy[locale] ?? copy.it;
}

export function finalDocsNotif(locale: CommsLocale = "it") {
  const copy: Record<CommsLocale, { title: string; body: string }> = {
    it: {
      title: "Documenti finali pronti",
      body: "Puoi scaricarli dalla tua area personale.",
    },
    ar: {
      title: "المستندات النهائية جاهزة",
      body: "يمكنك تنزيلها من منطقتك الشخصية.",
    },
    en: {
      title: "Final documents ready",
      body: "You can download them from your client area.",
    },
    tr: {
      title: "Nihai belgeler hazır",
      body: "Kişisel alanınızdan indirebilirsiniz.",
    },
    fr: {
      title: "Documents finaux prêts",
      body: "Vous pouvez les télécharger depuis votre espace personnel.",
    },
    sq: {
      title: "Dokumentet përfundimtare janë gati",
      body: "Mund t'i shkarkoni nga zona personale.",
    },
  };
  return copy[locale] ?? copy.it;
}

export function withdrawalNotif(
  outcome: "ACCEPTED" | "REJECTED",
  refundIssued: boolean,
  locale: CommsLocale = "it",
) {
  if (outcome === "ACCEPTED") {
    const accepted: Record<
      CommsLocale,
      { title: string; body: string; titleRefund: string; bodyRefund: string }
    > = {
      it: {
        title: "Recesso accettato",
        titleRefund: "Recesso accettato: rimborso emesso",
        body: "La pratica è stata annullata. Se è dovuto un rimborso, una volta emesso lo vedi sulla carta entro 5-10 giorni lavorativi.",
        bodyRefund:
          "Rimborso emesso: di norma lo vedi sulla carta entro 5-10 giorni lavorativi.",
      },
      ar: {
        title: "قُبل العدول",
        titleRefund: "قُبل العدول: صدر الاسترداد",
        body: "أُلغيت المعاملة. إن وُجد استرداد مستحق، بعد إصداره تراه على البطاقة خلال 5–10 أيام عمل.",
        bodyRefund:
          "صدر الاسترداد: عادة تراه على البطاقة خلال 5–10 أيام عمل.",
      },
      en: {
        title: "Withdrawal accepted",
        titleRefund: "Withdrawal accepted: refund issued",
        body: "The case has been cancelled. If a refund is due, once issued you see it on the card within 5–10 business days.",
        bodyRefund:
          "Refund issued: you normally see it on the card within 5–10 business days.",
      },
      tr: {
        title: "Cayma kabul edildi",
        titleRefund: "Cayma kabul edildi: iade yapıldı",
        body: "İşlem iptal edildi. İade gerekiyorsa, yapıldıktan sonra genellikle 5–10 iş günü içinde kartınızda görünür.",
        bodyRefund:
          "İade yapıldı: genellikle 5–10 iş günü içinde kartınızda görünür.",
      },
      fr: {
        title: "Rétractation acceptée",
        titleRefund: "Rétractation acceptée : remboursement émis",
        body: "Le dossier a été annulé. Si un remboursement est dû, une fois émis vous le voyez sur la carte sous 5–10 jours ouvrés.",
        bodyRefund:
          "Remboursement émis : vous le voyez normalement sur la carte sous 5–10 jours ouvrés.",
      },
      sq: {
        title: "Tërheqja u pranua",
        titleRefund: "Tërheqja u pranua: rimbursimi u lëshua",
        body: "Praktika u anulua. Nëse duhet rimbursim, pasi të lëshohet e shihni në kartë brenda 5–10 ditëve pune.",
        bodyRefund:
          "Rimbursimi u lëshua: zakonisht e shihni në kartë brenda 5–10 ditëve pune.",
      },
    };
    const c = accepted[locale] ?? accepted.it;
    return refundIssued
      ? { title: c.titleRefund, body: c.bodyRefund }
      : { title: c.title, body: c.body };
  }
  const rejected: Record<CommsLocale, { title: string; body: string }> = {
    it: {
      title: "Esito sulla richiesta di recesso",
      body: "Abbiamo valutato la tua richiesta di recesso.",
    },
    ar: {
      title: "نتيجة طلب العدول",
      body: "قيّمنا طلب العدول الخاص بك.",
    },
    en: {
      title: "Outcome of your withdrawal request",
      body: "We have reviewed your withdrawal request.",
    },
    tr: {
      title: "Cayma talebinizin sonucu",
      body: "Cayma talebinizi değerlendirdik.",
    },
    fr: {
      title: "Suite à votre demande de rétractation",
      body: "Nous avons examiné votre demande de rétractation.",
    },
    sq: {
      title: "Rezultati i kërkesës suaj për tërheqje",
      body: "Kemi vlerësuar kërkesën tuaj për tërheqje.",
    },
  };
  return rejected[locale] ?? rejected.it;
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
  const copy: Record<
    CommsLocale,
    { subject: string; heading: string; bodyHtml: string; ctaLabel: string }
  > = {
    it: {
      subject: "Un minuto per una recensione?",
      heading: "Ci aiuti con una recensione?",
      bodyHtml: `<p style="margin:0 0 10px">La tua pratica di successione è conclusa. Se ti sei trovato bene con Lorenzo, una recensione su Google ci aiuta tantissimo — ci vuole un minuto.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Grazie di cuore, anche solo per aver letto.</p>`,
      ctaLabel: "Scrivi su Google",
    },
    ar: {
      subject: "دقيقة لمراجعة؟",
      heading: "هل تساعدنا بمراجعة؟",
      bodyHtml: `<p style="margin:0 0 10px">أُغلقت معاملة الميراث. إن كنت راضيًا عن لورنزو، مراجعة على Google تساعدنا كثيرًا — تستغرق دقيقة.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">شكرًا من القلب، حتى لمجرد القراءة.</p>`,
      ctaLabel: "اكتب على Google",
    },
    en: {
      subject: "A minute for a review?",
      heading: "Would you leave us a review?",
      bodyHtml: `<p style="margin:0 0 10px">Your succession case is completed. If you had a good experience with Lorenzo, a Google review helps us a lot — it takes a minute.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Thank you, even just for reading.</p>`,
      ctaLabel: "Write on Google",
    },
    tr: {
      subject: "Bir dakikalık değerlendirme?",
      heading: "Bize bir değerlendirme bırakır mısınız?",
      bodyHtml: `<p style="margin:0 0 10px">Veraset işleminiz tamamlandı. Lorenzo ile iyi bir deneyim yaşadıysanız, Google'da bir değerlendirme bize çok yardımcı olur — bir dakika sürer.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Okuduğunuz için bile teşekkürler.</p>`,
      ctaLabel: "Google'da yaz",
    },
    fr: {
      subject: "Une minute pour un avis ?",
      heading: "Nous laisseriez-vous un avis ?",
      bodyHtml: `<p style="margin:0 0 10px">Votre dossier de succession est terminé. Si vous avez été satisfait avec Lorenzo, un avis Google nous aide beaucoup — cela prend une minute.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Merci, même pour la simple lecture.</p>`,
      ctaLabel: "Écrire sur Google",
    },
    sq: {
      subject: "Një minutë për një vlerësim?",
      heading: "Do të na lini një vlerësim?",
      bodyHtml: `<p style="margin:0 0 10px">Praktika juaj e trashëgimisë është mbyllur. Nëse keni qenë të kënaqur me Lorenzo, një vlerësim në Google na ndihmon shumë — zgjat një minutë.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Faleminderit, edhe vetëm për leximin.</p>`,
      ctaLabel: "Shkruaj në Google",
    },
  };
  return copy[locale] ?? copy.it;
}

export function taxesEmail(
  amount: number,
  locale: CommsLocale = "it",
): { subject: string; heading: string; bodyHtml: string; ctaLabel: string } {
  const localeTag: Record<CommsLocale, string> = {
    it: "it-IT",
    ar: "ar",
    en: "en-GB",
    tr: "tr-TR",
    fr: "fr-FR",
    sq: "sq-AL",
  };
  const formatted = `${amount.toLocaleString(localeTag[locale] ?? "it-IT")} €`;
  const copy: Record<
    CommsLocale,
    { subject: string; heading: string; bodyHtml: string; ctaLabel: string }
  > = {
    it: {
      subject: "Le imposte della tua successione",
      heading: "Imposte calcolate",
      bodyHtml: `<p style="margin:0 0 10px">Abbiamo calcolato le imposte dovute per la tua successione (modello F24, autoliquidazione):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Queste somme <strong>non sono il nostro onorario</strong>: si versano allo Stato. Nella tua area personale trovi il dettaglio e puoi inserire l'IBAN per l'addebito.</p>`,
      ctaLabel: "Vai all'area personale",
    },
    ar: {
      subject: "ضرائب ميراثك",
      heading: "حُسبت الضرائب",
      bodyHtml: `<p style="margin:0 0 10px">حسبنا الضرائب المستحقة لميراثك (نموذج F24، تصفية ذاتية):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">هذه المبالغ <strong>ليست أتعابنا</strong>: تُدفع للدولة. في منطقتك الشخصية تجد التفاصيل ويمكنك إدخال IBAN للخصم.</p>`,
      ctaLabel: "إلى المنطقة الشخصية",
    },
    en: {
      subject: "The taxes for your succession",
      heading: "Taxes calculated",
      bodyHtml: `<p style="margin:0 0 10px">We have calculated the taxes due for your succession (F24 form, self-assessment):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">These amounts <strong>are not our fee</strong>: they are paid to the State. In your client area you'll find the details and can enter the IBAN for the debit.</p>`,
      ctaLabel: "Go to client area",
    },
    tr: {
      subject: "Verasetinizin vergileri",
      heading: "Vergiler hesaplandı",
      bodyHtml: `<p style="margin:0 0 10px">Verasetiniz için ödenmesi gereken vergileri hesapladık (F24 formu, kendi beyanınız):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Bu tutarlar <strong>bizim ücretimiz değildir</strong>: Devlete ödenir. Kişisel alanınızda ayrıntıları bulur ve tahsilat için IBAN girebilirsiniz.</p>`,
      ctaLabel: "Kişisel alana git",
    },
    fr: {
      subject: "Les impôts de votre succession",
      heading: "Impôts calculés",
      bodyHtml: `<p style="margin:0 0 10px">Nous avons calculé les impôts dus pour votre succession (formulaire F24, autoliquidation) :</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Ces montants <strong>ne sont pas nos honoraires</strong> : ils se versent à l'État. Dans votre espace personnel, vous trouverez le détail et pourrez saisir l'IBAN pour le prélèvement.</p>`,
      ctaLabel: "Aller à l'espace personnel",
    },
    sq: {
      subject: "Taksat e trashëgimisë suaj",
      heading: "Taksat u llogaritën",
      bodyHtml: `<p style="margin:0 0 10px">Kemi llogaritur taksat e detyrueshme për trashëgiminë tuaj (formular F24, vetëdeklarim):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Këto shuma <strong>nuk janë shpërblimi ynë</strong>: paguhen te Shteti. Në zonën personale gjeni detajet dhe mund të vendosni IBAN për debitimin.</p>`,
      ctaLabel: "Shko te zona personale",
    },
  };
  return copy[locale] ?? copy.it;
}

export function finalDocsEmail(locale: CommsLocale = "it") {
  const copy: Record<
    CommsLocale,
    { subject: string; heading: string; bodyHtml: string; ctaLabel: string }
  > = {
    it: {
      subject: "I documenti finali della tua successione sono pronti",
      heading: "Documenti pronti da scaricare",
      bodyHtml: `<p style="margin:0">Abbiamo caricato i documenti finali della tua pratica (ricevuta di presentazione, dichiarazione, visure). Li trovi nella tua area personale, pronti da scaricare e conservare.</p>`,
      ctaLabel: "Scarica i documenti",
    },
    ar: {
      subject: "المستندات النهائية لميراثك جاهزة",
      heading: "مستندات جاهزة للتنزيل",
      bodyHtml: `<p style="margin:0">حمّلنا المستندات النهائية لمعاملتك (إيصال التقديم والتصريح والكشوف). تجدها في منطقتك الشخصية جاهزة للتنزيل والحفظ.</p>`,
      ctaLabel: "تنزيل المستندات",
    },
    en: {
      subject: "Your succession final documents are ready",
      heading: "Documents ready to download",
      bodyHtml: `<p style="margin:0">We have uploaded the final documents for your case (filing receipt, declaration, searches). You'll find them in your client area, ready to download and keep.</p>`,
      ctaLabel: "Download documents",
    },
    tr: {
      subject: "Verasetinizin nihai belgeleri hazır",
      heading: "İndirmeye hazır belgeler",
      bodyHtml: `<p style="margin:0">İşleminizin nihai belgelerini yükledik (sunum makbuzu, beyanname, tapu kayıtları). Kişisel alanınızda indirip saklamaya hazır bulursunuz.</p>`,
      ctaLabel: "Belgeleri indir",
    },
    fr: {
      subject: "Les documents finaux de votre succession sont prêts",
      heading: "Documents prêts à télécharger",
      bodyHtml: `<p style="margin:0">Nous avons téléversé les documents finaux de votre dossier (reçu de dépôt, déclaration, extraits). Vous les trouverez dans votre espace personnel, prêts à télécharger et conserver.</p>`,
      ctaLabel: "Télécharger les documents",
    },
    sq: {
      subject: "Dokumentet përfundimtare të trashëgimisë suaj janë gati",
      heading: "Dokumente gati për shkarkim",
      bodyHtml: `<p style="margin:0">Kemi ngarkuar dokumentet përfundimtare të praktikës suaj (faturim dorëzimi, deklaratë, vëzhgime). I gjeni në zonën personale, gati për shkarkim dhe ruajtje.</p>`,
      ctaLabel: "Shkarko dokumentet",
    },
  };
  return copy[locale] ?? copy.it;
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

  type Row = { subject: string; heading: string; body: string; cta: string };
  const tables: Record<
    CommsLocale,
    Record<"IN_REVIEW" | "ACCEPTED" | "REJECTED", Row>
  > = {
    it: {
      IN_REVIEW: {
        subject: "Stiamo valutando la tua richiesta di recesso",
        heading: "Richiesta in gestione",
        body: "Abbiamo preso in carico la tua richiesta di recesso e la stiamo valutando. Ti aggiorniamo a breve con l'esito.",
        cta: "Vai all'area personale",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Recesso accettato: rimborso emesso"
          : "Recesso accettato",
        heading: opts.refundIssued
          ? "Recesso accettato, rimborso emesso"
          : "Recesso accettato",
        body: opts.refundIssued
          ? "La tua richiesta di recesso e stata accettata e abbiamo emesso il rimborso sull'importo dovuto. Lo vedrai sulla carta usata per il pagamento di norma entro <strong>5-10 giorni lavorativi</strong> (tempi della tua banca o dell'emittente della carta; a volte compare come storno della spesa originale)."
          : "La tua richiesta di recesso e stata accettata. Se e dovuto un rimborso, lo emettiamo con lo stesso metodo di pagamento: una volta emesso, la banca lo accredita di norma entro <strong>5-10 giorni lavorativi</strong>.",
        cta: "Vai all'area personale",
      },
      REJECTED: {
        subject: "Esito della tua richiesta di recesso",
        heading: "Richiesta di recesso",
        body: "Abbiamo valutato la tua richiesta di recesso. Trovi di seguito le motivazioni; restiamo a disposizione per chiarimenti.",
        cta: "Vai all'area personale",
      },
    },
    ar: {
      IN_REVIEW: {
        subject: "نقيّم طلب العدول الخاص بك",
        heading: "الطلب قيد المعالجة",
        body: "استلمنا طلب العدول ونقيّمه. سنُبلّغك بالنتيجة قريبًا.",
        cta: "إلى المنطقة الشخصية",
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
        cta: "إلى المنطقة الشخصية",
      },
      REJECTED: {
        subject: "نتيجة طلب العدول",
        heading: "طلب العدول",
        body: "قيّمنا طلب العدول. تجد الأسباب أدناه؛ نحن متاحون لأي توضيح.",
        cta: "إلى المنطقة الشخصية",
      },
    },
    en: {
      IN_REVIEW: {
        subject: "We're reviewing your withdrawal request",
        heading: "Request in progress",
        body: "We've received your withdrawal request and are reviewing it. We'll update you shortly with the outcome.",
        cta: "Go to client area",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Withdrawal accepted: refund issued"
          : "Withdrawal accepted",
        heading: opts.refundIssued
          ? "Withdrawal accepted, refund issued"
          : "Withdrawal accepted",
        body: opts.refundIssued
          ? "Your withdrawal request was accepted and we issued the refund on the amount due. You'll normally see it on the card used for payment within <strong>5–10 business days</strong> (your bank or card issuer's timing; sometimes it appears as a reversal of the original charge)."
          : "Your withdrawal request was accepted. If a refund is due, we issue it with the same payment method: once issued, the bank normally credits it within <strong>5–10 business days</strong>.",
        cta: "Go to client area",
      },
      REJECTED: {
        subject: "Outcome of your withdrawal request",
        heading: "Withdrawal request",
        body: "We have reviewed your withdrawal request. You'll find the reasons below; we're available for any clarification.",
        cta: "Go to client area",
      },
    },
    tr: {
      IN_REVIEW: {
        subject: "Cayma talebinizi inceliyoruz",
        heading: "Talep işleniyor",
        body: "Cayma talebinizi aldık ve inceliyoruz. Kısa süre içinde sonucu size bildireceğiz.",
        cta: "Kişisel alana git",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Cayma kabul edildi: iade yapıldı"
          : "Cayma kabul edildi",
        heading: opts.refundIssued
          ? "Cayma kabul edildi, iade yapıldı"
          : "Cayma kabul edildi",
        body: opts.refundIssued
          ? "Cayma talebiniz kabul edildi ve ödenmesi gereken tutar için iadeyi yaptık. Genellikle ödemede kullanılan kartta <strong>5–10 iş günü</strong> içinde görünür (bankanızın veya kartı veren kuruluşun süreleri; bazen orijinal harcamanın iptali olarak görünür)."
          : "Cayma talebiniz kabul edildi. İade gerekiyorsa aynı ödeme yöntemiyle yaparız: yapıldıktan sonra banka genellikle <strong>5–10 iş günü</strong> içinde hesabınıza geçirir.",
        cta: "Kişisel alana git",
      },
      REJECTED: {
        subject: "Cayma talebinizin sonucu",
        heading: "Cayma talebi",
        body: "Cayma talebinizi değerlendirdik. Gerekçeleri aşağıda bulursunuz; açıklama için buradayız.",
        cta: "Kişisel alana git",
      },
    },
    fr: {
      IN_REVIEW: {
        subject: "Nous examinons votre demande de rétractation",
        heading: "Demande en cours",
        body: "Nous avons reçu votre demande de rétractation et l'examinons. Nous vous informerons bientôt du résultat.",
        cta: "Aller à l'espace personnel",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Rétractation acceptée : remboursement émis"
          : "Rétractation acceptée",
        heading: opts.refundIssued
          ? "Rétractation acceptée, remboursement émis"
          : "Rétractation acceptée",
        body: opts.refundIssued
          ? "Votre demande de rétractation a été acceptée et nous avons émis le remboursement du montant dû. Vous le verrez normalement sur la carte utilisée pour le paiement sous <strong>5–10 jours ouvrés</strong> (délais de votre banque ou de l'émetteur de la carte ; parfois cela apparaît comme une annulation de la dépense d'origine)."
          : "Votre demande de rétractation a été acceptée. Si un remboursement est dû, nous l'émettons avec le même mode de paiement : une fois émis, la banque le crédite normalement sous <strong>5–10 jours ouvrés</strong>.",
        cta: "Aller à l'espace personnel",
      },
      REJECTED: {
        subject: "Suite à votre demande de rétractation",
        heading: "Demande de rétractation",
        body: "Nous avons examiné votre demande de rétractation. Vous trouverez les motifs ci-dessous ; nous restons disponibles pour toute précision.",
        cta: "Aller à l'espace personnel",
      },
    },
    sq: {
      IN_REVIEW: {
        subject: "Po shqyrtojmë kërkesën tuaj për tërheqje",
        heading: "Kërkesa në trajtim",
        body: "Kemi marrë kërkesën tuaj për tërheqje dhe po e shqyrtojmë. Do t'ju njoftojmë së shpejti me rezultatin.",
        cta: "Shko te zona personale",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Tërheqja u pranua: rimbursimi u lëshua"
          : "Tërheqja u pranua",
        heading: opts.refundIssued
          ? "Tërheqja u pranua, rimbursimi u lëshua"
          : "Tërheqja u pranua",
        body: opts.refundIssued
          ? "Kërkesa juaj për tërheqje u pranua dhe kemi lëshuar rimbursimin e shumës së detyrueshme. Zakonisht e shihni në kartën e pagesës brenda <strong>5–10 ditëve pune</strong> (afatet e bankës ose të emetuesit të kartës; ndonjëherë shfaqet si anulim i shpenzimit fillestar)."
          : "Kërkesa juaj për tërheqje u pranua. Nëse duhet rimbursim, e lëshojmë me të njëjtën metodë pagese: pasi të lëshohet, banka zakonisht e krediton brenda <strong>5–10 ditëve pune</strong>.",
        cta: "Shko te zona personale",
      },
      REJECTED: {
        subject: "Rezultati i kërkesës suaj për tërheqje",
        heading: "Kërkesë për tërheqje",
        body: "Kemi vlerësuar kërkesën tuaj për tërheqje. Motivet i gjeni më poshtë; jemi në dispozicion për sqarime.",
        cta: "Shko te zona personale",
      },
    },
  };

  const row = (tables[locale] ?? tables.it)[outcome];
  return {
    subject: row.subject,
    heading: row.heading,
    bodyHtml: `<p style="margin:0 0 10px">${row.body}</p>${noteBlock}`,
    ctaLabel: row.cta,
  };
}

export function invoiceEmail(number: string, locale: CommsLocale = "it") {
  const copy: Record<
    CommsLocale,
    { subject: string; heading: string; bodyHtml: string; ctaLabel: string }
  > = {
    it: {
      subject: `La tua fattura e disponibile (n. ${number})`,
      heading: "Fattura disponibile",
      bodyHtml: `<p style="margin:0 0 10px">Abbiamo emesso la fattura dell'onorario <strong>n. ${number}</strong> per la tua pratica di successione.</p>
      <p style="margin:0">La trovi e la puoi scaricare nella tua area personale, nella sezione "Il tuo acquisto".</p>`,
      ctaLabel: "Scarica la fattura",
    },
    ar: {
      subject: `فاتورتك متاحة (رقم ${number})`,
      heading: "الفاتورة متاحة",
      bodyHtml: `<p style="margin:0 0 10px">أصدرنا فاتورة الأتعاب <strong>رقم ${number}</strong> لمعاملة الميراث.</p>
      <p style="margin:0">تجدها ويمكنك تنزيلها في منطقتك الشخصية، قسم «مشترياتك».</p>`,
      ctaLabel: "تنزيل الفاتورة",
    },
    en: {
      subject: `Your invoice is available (no. ${number})`,
      heading: "Invoice available",
      bodyHtml: `<p style="margin:0 0 10px">We have issued the fee invoice <strong>no. ${number}</strong> for your succession case.</p>
      <p style="margin:0">You'll find it and can download it in your client area, under "Your purchase".</p>`,
      ctaLabel: "Download invoice",
    },
    tr: {
      subject: `Faturanız hazır (no. ${number})`,
      heading: "Fatura hazır",
      bodyHtml: `<p style="margin:0 0 10px">Veraset işleminiz için ücret faturası <strong>no. ${number}</strong> düzenledik.</p>
      <p style="margin:0">Kişisel alanınızda, «Satın alımınız» bölümünde bulup indirebilirsiniz.</p>`,
      ctaLabel: "Faturayı indir",
    },
    fr: {
      subject: `Votre facture est disponible (n° ${number})`,
      heading: "Facture disponible",
      bodyHtml: `<p style="margin:0 0 10px">Nous avons émis la facture d'honoraires <strong>n° ${number}</strong> pour votre dossier de succession.</p>
      <p style="margin:0">Vous la trouverez et pourrez la télécharger dans votre espace personnel, section « Votre achat ».</p>`,
      ctaLabel: "Télécharger la facture",
    },
    sq: {
      subject: `Fatura juaj është e disponueshme (nr. ${number})`,
      heading: "Fatura e disponueshme",
      bodyHtml: `<p style="margin:0 0 10px">Kemi lëshuar faturën e shpërblimit <strong>nr. ${number}</strong> për praktikën tuaj të trashëgimisë.</p>
      <p style="margin:0">E gjeni dhe mund ta shkarkoni në zonën personale, te seksioni «Blerja juaj».</p>`,
      ctaLabel: "Shkarko faturën",
    },
  };
  return copy[locale] ?? copy.it;
}

export function documentRejectedEmail(
  docLabel: string,
  reason: string,
  locale: CommsLocale,
  esc: (s: string) => string,
) {
  const copy: Record<
    CommsLocale,
    { subject: string; heading: string; bodyHtml: string; ctaLabel: string }
  > = {
    it: {
      subject: `Un documento va ricaricato: ${docLabel}`,
      heading: "Un documento va rifatto",
      bodyHtml: `<p style="margin:0 0 10px">Il documento <strong>${esc(docLabel)}</strong> ha bisogno di una correzione:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Puoi ricaricarlo dalla tua area personale, e una cosa veloce.</p>`,
      ctaLabel: "Ricarica il documento",
    },
    ar: {
      subject: `مستند يجب إعادة تحميله: ${docLabel}`,
      heading: "مستند يجب إعادة إعداده",
      bodyHtml: `<p style="margin:0 0 10px">المستند <strong>${esc(docLabel)}</strong> يحتاج إلى تصحيح:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">يمكنك إعادة تحميله من منطقتك الشخصية، أمر سريع.</p>`,
      ctaLabel: "إعادة تحميل المستند",
    },
    en: {
      subject: `A document must be re-uploaded: ${docLabel}`,
      heading: "A document must be redone",
      bodyHtml: `<p style="margin:0 0 10px">The document <strong>${esc(docLabel)}</strong> needs a correction:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">You can re-upload it from your client area — it's quick.</p>`,
      ctaLabel: "Re-upload document",
    },
    tr: {
      subject: `Yeniden yüklenmesi gereken bir belge: ${docLabel}`,
      heading: "Bir belge yeniden hazırlanmalı",
      bodyHtml: `<p style="margin:0 0 10px"><strong>${esc(docLabel)}</strong> belgesinin düzeltilmesi gerekiyor:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Kişisel alanınızdan yeniden yükleyebilirsiniz — hızlıdır.</p>`,
      ctaLabel: "Belgeyi yeniden yükle",
    },
    fr: {
      subject: `Un document doit être rechargé : ${docLabel}`,
      heading: "Un document doit être refait",
      bodyHtml: `<p style="margin:0 0 10px">Le document <strong>${esc(docLabel)}</strong> nécessite une correction :</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Vous pouvez le recharger depuis votre espace personnel — c'est rapide.</p>`,
      ctaLabel: "Recharger le document",
    },
    sq: {
      subject: `Një dokument duhet ringarkuar: ${docLabel}`,
      heading: "Një dokument duhet rifarë",
      bodyHtml: `<p style="margin:0 0 10px">Dokumenti <strong>${esc(docLabel)}</strong> ka nevojë për korrigjim:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Mund ta ringarkoni nga zona personale — është e shpejtë.</p>`,
      ctaLabel: "Ringarko dokumentin",
    },
  };
  return copy[locale] ?? copy.it;
}

/** Subject storico comunicazioni webhook (allineato a email PAGATO). */
export function paymentReceivedCommSubject(locale: CommsLocale = "it"): string {
  const subjects: Record<CommsLocale, string> = {
    it: "Pagamento ricevuto: la tua pratica e attiva",
    ar: "تم استلام الدفع: معاملتك نشطة",
    en: "Payment received: your case is active",
    tr: "Ödeme alındı: işleminiz aktif",
    fr: "Paiement reçu : votre dossier est actif",
    sq: "Pagesa u mor: praktika juaj është aktive",
  };
  return subjects[locale] ?? subjects.it;
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
    if (!it) continue;
    const known = COMMS_LOCALES.map((loc) => STATUS_CLIENT[loc][status]).filter(
      Boolean,
    ) as Array<{ title: string; body: string }>;
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
    "Yeniden yüklenecek belge: ",
    "Document à recharger : ",
    "Dokument për t'u ringarkuar: ",
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
    "Vergiler bildirildi: ",
    "Impôts communiqués : ",
    "Taksat u njoftuan: ",
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

  const finalTitles = COMMS_LOCALES.map((loc) => finalDocsNotif(loc).title);
  if (finalTitles.includes(title)) return finalDocsNotif(locale);

  for (const refund of [true, false] as const) {
    const titles = COMMS_LOCALES.map(
      (loc) => withdrawalNotif("ACCEPTED", refund, loc).title,
    );
    if (titles.includes(title)) {
      return { ...withdrawalNotif("ACCEPTED", refund, locale), body };
    }
  }
  const rejectedTitles = COMMS_LOCALES.map(
    (loc) => withdrawalNotif("REJECTED", false, loc).title,
  );
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
  const localeIdx = COMMS_LOCALES.indexOf(locale);
  const pick = (group: string[]) =>
    group[localeIdx >= 0 ? localeIdx : 0] ?? group[0];

  const groups: string[][] = [];
  for (const status of Object.keys(STATUS_EMAIL.it) as PracticeStatus[]) {
    const subjects = COMMS_LOCALES.map(
      (loc) => STATUS_EMAIL[loc][status]?.subject,
    ).filter((x): x is string => !!x);
    if (subjects.length) groups.push(subjects);
  }
  groups.push(COMMS_LOCALES.map((loc) => paymentReceivedCommSubject(loc)));
  groups.push(COMMS_LOCALES.map((loc) => reviewEmail(loc).subject));
  groups.push(COMMS_LOCALES.map((loc) => taxesEmail(0, loc).subject));
  groups.push(COMMS_LOCALES.map((loc) => finalDocsEmail(loc).subject));
  for (const refund of [false, true]) {
    groups.push(
      COMMS_LOCALES.map(
        (loc) =>
          withdrawalEmail("ACCEPTED", "", { refundIssued: refund }, loc, (x) => x)
            .subject,
      ),
    );
  }
  groups.push(
    COMMS_LOCALES.map(
      (loc) => withdrawalEmail("IN_REVIEW", "", {}, loc, (x) => x).subject,
    ),
  );
  groups.push(
    COMMS_LOCALES.map(
      (loc) => withdrawalEmail("REJECTED", "", {}, loc, (x) => x).subject,
    ),
  );

  for (const group of groups) {
    if (group.includes(subject)) return pick(group);
  }

  const docPrefixes = [
    "Un documento va ricaricato: ",
    "مستند يجب إعادة تحميله: ",
    "A document must be re-uploaded: ",
    "Yeniden yüklenmesi gereken bir belge: ",
    "Un document doit être rechargé : ",
    "Një dokument duhet ringarkuar: ",
  ];
  for (const prefix of docPrefixes) {
    if (subject.startsWith(prefix)) {
      return documentRejectedEmail(
        subject.slice(prefix.length),
        "",
        locale,
        (x) => x,
      ).subject;
    }
  }

  const invPatterns: RegExp[] = [
    /^La tua fattura e disponibile \(n\. (.+)\)$/,
    /^فاتورتك متاحة \(رقم (.+)\)$/,
    /^Your invoice is available \(no\. (.+)\)$/,
    /^Faturanız hazır \(no\. (.+)\)$/,
    /^Votre facture est disponible \(n° (.+)\)$/,
    /^Fatura juaj është e disponueshme \(nr\. (.+)\)$/,
  ];
  for (const re of invPatterns) {
    const m = subject.match(re);
    if (m) return invoiceEmail(m[1], locale).subject;
  }

  return subject;
}

// silence unused type if tree-shaken weirdly
export type _EmailBundle = EmailBundle;
