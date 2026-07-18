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
  de: {
    PAGATO: {
      title: "Zahlung eingegangen",
      body: "Ihr Vorgang ist gestartet. Laden Sie die erforderlichen Unterlagen hoch.",
    },
    ATTESA_DOC: {
      title: "Weitere Unterlagen erforderlich",
      body: "Vervollständigen Sie die Liste in Ihrem Persönlichen Bereich, um fortzufahren.",
    },
    LAVORAZIONE: {
      title: "Wir bearbeiten Ihren Vorgang",
      body: "Wir haben alles, was wir brauchen. Wir informieren Sie, sobald es Neuigkeiten gibt.",
    },
    INVIATA: {
      title: "Erklärung an die Agentur übermittelt",
      body: "Sobald die Quittung eintrifft, finden Sie sie unter den finalen Dokumenten.",
    },
    CHIUSA: {
      title: "Vorgang abgeschlossen",
      body: "Sie können die finalen Dokumente aus Ihrem Persönlichen Bereich herunterladen.",
    },
  },
  es: {
    PAGATO: {
      title: "Pago recibido",
      body: "Su expediente está iniciado. Suba los documentos requeridos.",
    },
    ATTESA_DOC: {
      title: "Aún faltan documentos",
      body: "Complete la lista en su área personal para continuar.",
    },
    LAVORAZIONE: {
      title: "Estamos trabajando en su expediente",
      body: "Tenemos todo lo necesario. Le informaremos en cuanto haya novedades.",
    },
    INVIATA: {
      title: "Declaración enviada a la Agencia",
      body: "Cuando llegue el recibo, lo encontrará entre los documentos finales.",
    },
    CHIUSA: {
      title: "Expediente concluido",
      body: "Puede descargar los documentos finales desde su área personal.",
    },
  },
  ru: {
    PAGATO: {
      title: "Оплата получена",
      body: "Ваше дело запущено. Загрузите необходимые документы.",
    },
    ATTESA_DOC: {
      title: "Нужны дополнительные документы",
      body: "Завершите список в личном кабинете, чтобы продолжить.",
    },
    LAVORAZIONE: {
      title: "Мы работаем над вашим делом",
      body: "У нас есть всё необходимое. Мы сообщим, как только появятся новости.",
    },
    INVIATA: {
      title: "Декларация отправлена в Агентство",
      body: "Когда поступит квитанция, вы найдёте её среди итоговых документов.",
    },
    CHIUSA: {
      title: "Дело завершено",
      body: "Вы можете скачать итоговые документы из личного кабинета.",
    },
  },
  zh: {
    PAGATO: {
      title: "已收到付款",
      body: "您的案件已启动。请上传所需文件。",
    },
    ATTESA_DOC: {
      title: "仍需补充文件",
      body: "请在个人区完成文件清单以继续办理。",
    },
    LAVORAZIONE: {
      title: "我们正在处理您的案件",
      body: "我们已备齐所需材料。如有进展会及时通知您。",
    },
    INVIATA: {
      title: "申报已提交至税务机关",
      body: "收到回执后，您可在最终文件中查看。",
    },
    CHIUSA: {
      title: "案件已办结",
      body: "您可从个人区下载最终文件。",
    },
  },
  hi: {
    PAGATO: {
      title: "भुगतान प्राप्त हुआ",
      body: "आपका प्रकरण शुरू हो गया है। आवश्यक दस्तावेज़ अपलोड करें।",
    },
    ATTESA_DOC: {
      title: "अभी भी कुछ दस्तावेज़ चाहिए",
      body: "आगे बढ़ने के लिए व्यक्तिगत क्षेत्र में सूची पूरी करें।",
    },
    LAVORAZIONE: {
      title: "हम आपके प्रकरण पर काम कर रहे हैं",
      body: "हमारे पास सब कुछ है। कोई अपडेट होते ही हम सूचित करेंगे।",
    },
    INVIATA: {
      title: "घोषणा एजेंसी को भेज दी गई",
      body: "रसीद आने पर आप इसे अंतिम दस्तावेज़ों में पाएँगे।",
    },
    CHIUSA: {
      title: "प्रकरण पूरा हुआ",
      body: "आप अंतिम दस्तावेज़ व्यक्तिगत क्षेत्र से डाउनलोड कर सकते हैं।",
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
  de: {
    PAGATO: {
      subject: "Zahlung eingegangen: laden Sie jetzt Ihre Unterlagen hoch",
      heading: "Danke, wir haben die Zahlung erhalten",
      body: "Ihr Vorgang ist offiziell gestartet. Nächster Schritt: Laden Sie die erforderlichen Unterlagen in Ihrem Persönlichen Bereich hoch — wir führen Sie Schritt für Schritt; es dauert nur wenige Minuten.",
      cta: "Unterlagen hochladen",
    },
    ATTESA_DOC: {
      subject: "Es fehlen noch Unterlagen, um fortzufahren",
      heading: "Wir benötigen noch einige Unterlagen",
      body: "Um mit Ihrer Erbschaft fortzufahren, müssen wir die Unterlagenliste vervollständigen. Alles mit Anleitungen finden Sie in Ihrem Persönlichen Bereich.",
      cta: "Unterlagen vervollständigen",
    },
    LAVORAZIONE: {
      subject: "Wir bearbeiten Ihren Vorgang",
      heading: "Wir kümmern uns darum",
      body: "Wir haben alles, was wir brauchen, und bereiten Ihre Erbschaftserklärung vor. Wir informieren Sie, sobald es Neuigkeiten gibt — Sie müssen nichts tun.",
      cta: "Status ansehen",
    },
    INVIATA: {
      subject: "Vorgang an Agenzia delle Entrate übermittelt",
      heading: "An Agenzia delle Entrate übermittelt",
      body: "Ihre Erbschaftserklärung wurde übermittelt. Sobald wir die Registrierungsquittung erhalten, finden Sie sie in Ihrem Persönlichen Bereich.",
      cta: "Zum Persönlichen Bereich",
    },
    CHIUSA: {
      subject: "Ihr Vorgang ist abgeschlossen",
      heading: "Alles erledigt!",
      body: "Ihre Erbschaft ist abgeschlossen. In Ihrem Persönlichen Bereich finden Sie die finalen Dokumente (Einreichungsquittung, Erklärung, Auszüge) zum Herunterladen und Aufbewahren.",
      cta: "Dokumente herunterladen",
    },
  },
  es: {
    PAGATO: {
      subject: "Pago recibido: suba ahora sus documentos",
      heading: "Gracias, hemos recibido el pago",
      body: "Su expediente está oficialmente iniciado. Siguiente paso: suba los documentos requeridos en su área personal — le guiamos paso a paso; solo le llevará unos minutos.",
      cta: "Subir documentos",
    },
    ATTESA_DOC: {
      subject: "Aún faltan algunos documentos para continuar",
      heading: "Aún necesitamos algunos documentos",
      body: "Para continuar con su sucesión debemos completar la lista de documentos. Encontrará todo, con instrucciones, en su área personal.",
      cta: "Completar documentos",
    },
    LAVORAZIONE: {
      subject: "Estamos trabajando en su expediente",
      heading: "Nos encargamos nosotros",
      body: "Tenemos todo lo necesario y estamos preparando su declaración de sucesión. Le informaremos en cuanto haya novedades — no tiene que hacer nada.",
      cta: "Ver estado",
    },
    INVIATA: {
      subject: "Expediente enviado a Agenzia delle Entrate",
      heading: "Enviado a Agenzia delle Entrate",
      body: "Su declaración de sucesión ha sido transmitida. Cuando recibamos el recibo de registro, lo encontrará en su área personal.",
      cta: "Ir al área personal",
    },
    CHIUSA: {
      subject: "Su expediente está concluido",
      heading: "¡Todo listo!",
      body: "Su sucesión está concluida. En su área personal encontrará los documentos finales (recibo de presentación, declaración, visuras) para descargar y conservar.",
      cta: "Descargar documentos",
    },
  },
  ru: {
    PAGATO: {
      subject: "Оплата получена: загрузите документы сейчас",
      heading: "Спасибо, мы получили оплату",
      body: "Ваше дело официально запущено. Следующий шаг: загрузите необходимые документы в личном кабинете — мы проведём вас шаг за шагом; это займёт всего несколько минут.",
      cta: "Загрузить документы",
    },
    ATTESA_DOC: {
      subject: "Для продолжения нужны ещё документы",
      heading: "Нам ещё нужны некоторые документы",
      body: "Чтобы продолжить оформление наследства, нужно завершить список документов. Всё с инструкциями вы найдёте в личном кабинете.",
      cta: "Дополнить документы",
    },
    LAVORAZIONE: {
      subject: "Мы работаем над вашим делом",
      heading: "Мы всё сделаем",
      body: "У нас есть всё необходимое, и мы готовим вашу декларацию о наследстве. Мы сообщим, как только появятся новости — от вас ничего не требуется.",
      cta: "Посмотреть статус",
    },
    INVIATA: {
      subject: "Дело отправлено в Agenzia delle Entrate",
      heading: "Отправлено в Agenzia delle Entrate",
      body: "Ваша декларация о наследстве передана. Когда мы получим квитанцию о регистрации, вы найдёте её в личном кабинете.",
      cta: "Перейти в личный кабинет",
    },
    CHIUSA: {
      subject: "Ваше дело завершено",
      heading: "Всё готово!",
      body: "Оформление наследства завершено. В личном кабинете вы найдёте итоговые документы (квитанцию о подаче, декларацию, выписки) для скачивания и хранения.",
      cta: "Скачать документы",
    },
  },
  zh: {
    PAGATO: {
      subject: "已收到付款：请立即上传文件",
      heading: "谢谢，我们已收到付款",
      body: "您的案件已正式启动。下一步：在个人区上传所需文件 — 我们会逐步引导您，只需几分钟。",
      cta: "上传文件",
    },
    ATTESA_DOC: {
      subject: "仍需一些文件才能继续",
      heading: "我们还需要一些文件",
      body: "要继续办理继承，我们需要完成文件清单。您可在个人区找到全部说明与指引。",
      cta: "补全文件",
    },
    LAVORAZIONE: {
      subject: "我们正在处理您的案件",
      heading: "交给我们即可",
      body: "我们已备齐所需材料，正在准备您的继承申报。如有进展会及时通知您 — 您无需做任何事。",
      cta: "查看状态",
    },
    INVIATA: {
      subject: "案件已提交至 Agenzia delle Entrate",
      heading: "已提交至 Agenzia delle Entrate",
      body: "您的继承申报已传送。收到登记回执后，您可在个人区查看。",
      cta: "前往个人区",
    },
    CHIUSA: {
      subject: "您的案件已办结",
      heading: "全部完成！",
      body: "您的继承已办结。在个人区可下载并保存最终文件（提交回执、申报书、查册材料）。",
      cta: "下载文件",
    },
  },
  hi: {
    PAGATO: {
      subject: "भुगतान प्राप्त: अभी दस्तावेज़ अपलोड करें",
      heading: "धन्यवाद, हमें भुगतान मिल गया",
      body: "आपका प्रकरण आधिकारिक रूप से शुरू हो गया है। अगला कदम: व्यक्तिगत क्षेत्र में आवश्यक दस्तावेज़ अपलोड करें — हम चरण दर चरण मार्गदर्शन करेंगे; इसमें कुछ मिनट लगते हैं।",
      cta: "दस्तावेज़ अपलोड करें",
    },
    ATTESA_DOC: {
      subject: "आगे बढ़ने के लिए अभी भी कुछ दस्तावेज़ चाहिए",
      heading: "हमें अभी भी कुछ दस्तावेज़ चाहिए",
      body: "आपकी उत्तराधिकार प्रक्रिया जारी रखने के लिए दस्तावेज़ सूची पूरी करनी होगी। निर्देश सहित सब कुछ व्यक्तिगत क्षेत्र में मिलेगा।",
      cta: "दस्तावेज़ पूरे करें",
    },
    LAVORAZIONE: {
      subject: "हम आपके प्रकरण पर काम कर रहे हैं",
      heading: "हम संभाल लेंगे",
      body: "हमारे पास सब कुछ है और हम आपकी उत्तराधिकार घोषणा तैयार कर रहे हैं। कोई अपडेट होते ही सूचित करेंगे — आपको कुछ नहीं करना।",
      cta: "स्थिति देखें",
    },
    INVIATA: {
      subject: "प्रकरण Agenzia delle Entrate को भेजा गया",
      heading: "Agenzia delle Entrate को भेजा गया",
      body: "आपकी उत्तराधिकार घोषणा भेज दी गई है। पंजीकरण रसीद मिलते ही आप इसे व्यक्तिगत क्षेत्र में पाएँगे।",
      cta: "व्यक्तिगत क्षेत्र पर जाएँ",
    },
    CHIUSA: {
      subject: "आपका प्रकरण पूरा हुआ",
      heading: "सब हो गया!",
      body: "आपका उत्तराधिकार पूरा हो गया है। व्यक्तिगत क्षेत्र में अंतिम दस्तावेज़ (जमा रसीद, घोषणा, विसुरे) डाउनलोड और सहेजने के लिए मिलेंगे।",
      cta: "दस्तावेज़ डाउनलोड करें",
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
    de: `Dokument erneut hochladen: ${docLabel}`,
    es: `Documento a volver a subir: ${docLabel}`,
    ru: `Документ нужно загрузить заново: ${docLabel}`,
    zh: `需重新上传的文件：${docLabel}`,
    hi: `दस्तावेज़ फिर अपलोड करें: ${docLabel}`,
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
    de: "de-DE",
    es: "es-ES",
    ru: "ru-RU",
    zh: "zh-CN",
    hi: "hi-IN",
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
    de: {
      title: `Steuern mitgeteilt: ${n} €`,
      body: "Sie sind vom Honorar getrennt und werden an den Staat gezahlt (F24). Geben Sie die IBAN ein, falls angefordert.",
    },
    es: {
      title: `Impuestos comunicados: ${n} €`,
      body: "Son independientes del honorario y se pagan al Estado (F24). Introduzca el IBAN si se solicita.",
    },
    ru: {
      title: `Сообщены налоги: ${n} €`,
      body: "Они отделены от гонорара и уплачиваются государству (F24). Укажите IBAN, если потребуется.",
    },
    zh: {
      title: `已通知税款：${n} €`,
      body: "与律师费分开，向国家缴纳（F24）。如需请填写 IBAN。",
    },
    hi: {
      title: `कर सूचित: ${n} €`,
      body: "ये शुल्क से अलग हैं और राज्य को दिए जाते हैं (F24)। अनुरोध हो तो IBAN दर्ज करें।",
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
    de: {
      title: "Finale Dokumente bereit",
      body: "Sie können sie aus Ihrem Persönlichen Bereich herunterladen.",
    },
    es: {
      title: "Documentos finales listos",
      body: "Puede descargarlos desde su área personal.",
    },
    ru: {
      title: "Итоговые документы готовы",
      body: "Вы можете скачать их из личного кабинета.",
    },
    zh: {
      title: "最终文件已就绪",
      body: "您可从个人区下载。",
    },
    hi: {
      title: "अंतिम दस्तावेज़ तैयार",
      body: "आप इन्हें व्यक्तिगत क्षेत्र से डाउनलोड कर सकते हैं।",
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
      de: {
        title: "Widerruf angenommen",
        titleRefund: "Widerruf angenommen: Erstattung ausgestellt",
        body: "Der Vorgang wurde storniert. Falls eine Erstattung fällig ist, sehen Sie sie nach Ausstellung in der Regel innerhalb von 5–10 Werktagen auf der Karte.",
        bodyRefund:
          "Erstattung ausgestellt: Sie sehen sie in der Regel innerhalb von 5–10 Werktagen auf der Karte.",
      },
      es: {
        title: "Desistimiento aceptado",
        titleRefund: "Desistimiento aceptado: reembolso emitido",
        body: "El expediente ha sido anulado. Si corresponde un reembolso, una vez emitido lo verá en la tarjeta en 5–10 días laborables.",
        bodyRefund:
          "Reembolso emitido: normalmente lo verá en la tarjeta en 5–10 días laborables.",
      },
      ru: {
        title: "Отказ принят",
        titleRefund: "Отказ принят: возврат оформлен",
        body: "Дело отменено. Если положен возврат, после оформления вы увидите его на карте в течение 5–10 рабочих дней.",
        bodyRefund:
          "Возврат оформлен: обычно вы увидите его на карте в течение 5–10 рабочих дней.",
      },
      zh: {
        title: "撤回已接受",
        titleRefund: "撤回已接受：退款已发出",
        body: "案件已取消。如有应退款项，发出后通常 5–10 个工作日内可在卡上看到。",
        bodyRefund: "退款已发出：通常 5–10 个工作日内可在卡上看到。",
      },
      hi: {
        title: "वापसी स्वीकार",
        titleRefund: "वापसी स्वीकार: रिफंड जारी",
        body: "प्रकरण रद्द हो गया। यदि रिफंड देय है, जारी होने के बाद आप इसे 5–10 कार्य दिवसों में कार्ड पर देखेंगे।",
        bodyRefund:
          "रिफंड जारी: आमतौर पर 5–10 कार्य दिवसों में कार्ड पर दिखता है।",
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
    de: {
      title: "Ergebnis Ihres Widerrufsantrags",
      body: "Wir haben Ihren Widerrufsantrag geprüft.",
    },
    es: {
      title: "Resultado de su solicitud de desistimiento",
      body: "Hemos evaluado su solicitud de desistimiento.",
    },
    ru: {
      title: "Результат вашего заявления об отказе",
      body: "Мы рассмотрели ваше заявление об отказе.",
    },
    zh: {
      title: "撤回申请结果",
      body: "我们已审核您的撤回申请。",
    },
    hi: {
      title: "आपके वापसी अनुरोध का परिणाम",
      body: "हमने आपके वापसी अनुरोध की समीक्षा की है।",
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
    de: {
      subject: "Eine Minute für eine Bewertung?",
      heading: "Hinterlassen Sie uns eine Bewertung?",
      bodyHtml: `<p style="margin:0 0 10px">Ihr Erbschaftsvorgang ist abgeschlossen. Wenn Sie mit Lorenzo zufrieden waren, hilft uns eine Google-Bewertung sehr — sie dauert nur eine Minute.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Vielen Dank, auch nur fürs Lesen.</p>`,
      ctaLabel: "Auf Google schreiben",
    },
    es: {
      subject: "¿Un minuto para una reseña?",
      heading: "¿Nos deja una reseña?",
      bodyHtml: `<p style="margin:0 0 10px">Su expediente de sucesión está concluido. Si quedó satisfecho con Lorenzo, una reseña en Google nos ayuda mucho — solo lleva un minuto.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Gracias, aunque solo por leer.</p>`,
      ctaLabel: "Escribir en Google",
    },
    ru: {
      subject: "Минута на отзыв?",
      heading: "Оставите нам отзыв?",
      bodyHtml: `<p style="margin:0 0 10px">Ваше дело по наследству завершено. Если вы остались довольны Lorenzo, отзыв в Google нам очень поможет — это займёт минуту.</p>
      <p style="margin:0;font-size:13px;color:#8a938c">Спасибо, даже просто за прочтение.</p>`,
      ctaLabel: "Написать в Google",
    },
    zh: {
      subject: "花一分钟写评价？",
      heading: "愿意给我们留个评价吗？",
      bodyHtml: `<p style="margin:0 0 10px">您的继承案件已办结。若您对 Lorenzo 满意，Google 评价对我们很有帮助 — 只需一分钟。</p>
      <p style="margin:0;font-size:13px;color:#8a938c">感谢阅读。</p>`,
      ctaLabel: "在 Google 上撰写",
    },
    hi: {
      subject: "समीक्षा के लिए एक मिनट?",
      heading: "क्या आप हमें समीक्षा देंगे?",
      bodyHtml: `<p style="margin:0 0 10px">आपका उत्तराधिकार प्रकरण पूरा हो गया है। यदि Lorenzo के साथ अनुभव अच्छा रहा, Google समीक्षा हमारी बहुत मदद करती है — एक मिनट लगता है।</p>
      <p style="margin:0;font-size:13px;color:#8a938c">पढ़ने के लिए भी धन्यवाद।</p>`,
      ctaLabel: "Google पर लिखें",
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
    de: "de-DE",
    es: "es-ES",
    ru: "ru-RU",
    zh: "zh-CN",
    hi: "hi-IN",
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
    de: {
      subject: "Die Steuern für Ihre Erbschaft",
      heading: "Steuern berechnet",
      bodyHtml: `<p style="margin:0 0 10px">Wir haben die fälligen Steuern für Ihre Erbschaft berechnet (Formular F24, Selbstanzeige):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Diese Beträge <strong>sind nicht unser Honorar</strong>: sie werden an den Staat gezahlt. In Ihrem Persönlichen Bereich finden Sie die Details und können die IBAN für die Abbuchung eingeben.</p>`,
      ctaLabel: "Zum Persönlichen Bereich",
    },
    es: {
      subject: "Los impuestos de su sucesión",
      heading: "Impuestos calculados",
      bodyHtml: `<p style="margin:0 0 10px">Hemos calculado los impuestos debidos por su sucesión (formulario F24, autoliquidación):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Estas cantidades <strong>no son nuestro honorario</strong>: se pagan al Estado. En su área personal encontrará el detalle y podrá introducir el IBAN para el cargo.</p>`,
      ctaLabel: "Ir al área personal",
    },
    ru: {
      subject: "Налоги по вашему наследству",
      heading: "Налоги рассчитаны",
      bodyHtml: `<p style="margin:0 0 10px">Мы рассчитали налоги по вашему наследству (форма F24, самооценка):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">Эти суммы <strong>не являются нашим гонораром</strong>: они уплачиваются государству. В личном кабинете вы найдёте детали и сможете указать IBAN для списания.</p>`,
      ctaLabel: "Перейти в личный кабинет",
    },
    zh: {
      subject: "您继承案件的税款",
      heading: "税款已计算",
      bodyHtml: `<p style="margin:0 0 10px">我们已计算您继承应缴税款（F24 表格，自行申报）：</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">这些金额<strong>不是我们的律师费</strong>：应向国家缴纳。在个人区可查看明细并填写 IBAN 用于扣款。</p>`,
      ctaLabel: "前往个人区",
    },
    hi: {
      subject: "आपके उत्तराधिकार के कर",
      heading: "कर की गणना",
      bodyHtml: `<p style="margin:0 0 10px">हमने आपके उत्तराधिकार के देय कर की गणना की (F24 फॉर्म, स्व-मूल्यांकन):</p>
      <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1f6f5c">${formatted}</p>
      <p style="margin:0 0 10px">ये राशियाँ <strong>हमारा शुल्क नहीं</strong> हैं: ये राज्य को दी जाती हैं। व्यक्तिगत क्षेत्र में विवरण मिलेगा और डेबिट के लिए IBAN दर्ज कर सकते हैं।</p>`,
      ctaLabel: "व्यक्तिगत क्षेत्र पर जाएँ",
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
    de: {
      subject: "Die finalen Dokumente Ihrer Erbschaft sind bereit",
      heading: "Dokumente zum Herunterladen bereit",
      bodyHtml: `<p style="margin:0">Wir haben die finalen Dokumente Ihres Vorgangs hochgeladen (Einreichungsquittung, Erklärung, Auszüge). Sie finden sie in Ihrem Persönlichen Bereich, bereit zum Herunterladen und Aufbewahren.</p>`,
      ctaLabel: "Dokumente herunterladen",
    },
    es: {
      subject: "Los documentos finales de su sucesión están listos",
      heading: "Documentos listos para descargar",
      bodyHtml: `<p style="margin:0">Hemos subido los documentos finales de su expediente (recibo de presentación, declaración, visuras). Los encontrará en su área personal, listos para descargar y conservar.</p>`,
      ctaLabel: "Descargar documentos",
    },
    ru: {
      subject: "Итоговые документы по вашему наследству готовы",
      heading: "Документы готовы к скачиванию",
      bodyHtml: `<p style="margin:0">Мы загрузили итоговые документы по вашему делу (квитанция о подаче, декларация, выписки). Вы найдёте их в личном кабинете, готовые к скачиванию и хранению.</p>`,
      ctaLabel: "Скачать документы",
    },
    zh: {
      subject: "您的继承最终文件已就绪",
      heading: "文件可供下载",
      bodyHtml: `<p style="margin:0">我们已上传您案件的最终文件（提交回执、申报书、查册材料）。您可在个人区下载并保存。</p>`,
      ctaLabel: "下载文件",
    },
    hi: {
      subject: "आपके उत्तराधिकार के अंतिम दस्तावेज़ तैयार",
      heading: "डाउनलोड के लिए दस्तावेज़ तैयार",
      bodyHtml: `<p style="margin:0">हमने आपके प्रकरण के अंतिम दस्तावेज़ (जमा रसीद, घोषणा, विसुरे) अपलोड कर दिए हैं। व्यक्तिगत क्षेत्र में डाउनलोड और सहेजने के लिए मिलेंगे।</p>`,
      ctaLabel: "दस्तावेज़ डाउनलोड करें",
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
    de: {
      IN_REVIEW: {
        subject: "Wir prüfen Ihren Widerrufsantrag",
        heading: "Antrag in Bearbeitung",
        body: "Wir haben Ihren Widerrufsantrag erhalten und prüfen ihn. Wir informieren Sie in Kürze über das Ergebnis.",
        cta: "Zum Persönlichen Bereich",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Widerruf angenommen: Erstattung ausgestellt"
          : "Widerruf angenommen",
        heading: opts.refundIssued
          ? "Widerruf angenommen, Erstattung ausgestellt"
          : "Widerruf angenommen",
        body: opts.refundIssued
          ? "Ihr Widerrufsantrag wurde angenommen und wir haben die Erstattung des fälligen Betrags ausgestellt. Sie sehen sie in der Regel auf der für die Zahlung verwendeten Karte innerhalb von <strong>5–10 Werktagen</strong> (Fristen Ihrer Bank oder des Kartenherausgebers; manchmal erscheint sie als Storno der ursprünglichen Belastung)."
          : "Ihr Widerrufsantrag wurde angenommen. Falls eine Erstattung fällig ist, stellen wir sie mit derselben Zahlungsmethode aus: Nach Ausstellung schreibt die Bank sie in der Regel innerhalb von <strong>5–10 Werktagen</strong> gut.",
        cta: "Zum Persönlichen Bereich",
      },
      REJECTED: {
        subject: "Ergebnis Ihres Widerrufsantrags",
        heading: "Widerrufsantrag",
        body: "Wir haben Ihren Widerrufsantrag geprüft. Die Gründe finden Sie unten; wir stehen für Rückfragen zur Verfügung.",
        cta: "Zum Persönlichen Bereich",
      },
    },
    es: {
      IN_REVIEW: {
        subject: "Estamos evaluando su solicitud de desistimiento",
        heading: "Solicitud en gestión",
        body: "Hemos recibido su solicitud de desistimiento y la estamos evaluando. Le informaremos en breve del resultado.",
        cta: "Ir al área personal",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Desistimiento aceptado: reembolso emitido"
          : "Desistimiento aceptado",
        heading: opts.refundIssued
          ? "Desistimiento aceptado, reembolso emitido"
          : "Desistimiento aceptado",
        body: opts.refundIssued
          ? "Su solicitud de desistimiento fue aceptada y hemos emitido el reembolso del importe debido. Normalmente lo verá en la tarjeta usada para el pago en <strong>5–10 días laborables</strong> (plazos de su banco o emisor de la tarjeta; a veces aparece como anulación del cargo original)."
          : "Su solicitud de desistimiento fue aceptada. Si corresponde un reembolso, lo emitimos con el mismo método de pago: una vez emitido, el banco normalmente lo acredita en <strong>5–10 días laborables</strong>.",
        cta: "Ir al área personal",
      },
      REJECTED: {
        subject: "Resultado de su solicitud de desistimiento",
        heading: "Solicitud de desistimiento",
        body: "Hemos evaluado su solicitud de desistimiento. Encontrará los motivos a continuación; estamos disponibles para aclaraciones.",
        cta: "Ir al área personal",
      },
    },
    ru: {
      IN_REVIEW: {
        subject: "Мы рассматриваем ваше заявление об отказе",
        heading: "Заявление в обработке",
        body: "Мы получили ваше заявление об отказе и рассматриваем его. Скоро сообщим результат.",
        cta: "Перейти в личный кабинет",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "Отказ принят: возврат оформлен"
          : "Отказ принят",
        heading: opts.refundIssued
          ? "Отказ принят, возврат оформлен"
          : "Отказ принят",
        body: opts.refundIssued
          ? "Ваше заявление об отказе принято, и мы оформили возврат причитающейся суммы. Обычно вы увидите его на карте, использованной для оплаты, в течение <strong>5–10 рабочих дней</strong> (сроки вашего банка или эмитента карты; иногда отображается как отмена исходного списания)."
          : "Ваше заявление об отказе принято. Если положен возврат, мы оформляем его тем же способом оплаты: после оформления банк обычно зачисляет средства в течение <strong>5–10 рабочих дней</strong>.",
        cta: "Перейти в личный кабинет",
      },
      REJECTED: {
        subject: "Результат вашего заявления об отказе",
        heading: "Заявление об отказе",
        body: "Мы рассмотрели ваше заявление об отказе. Причины указаны ниже; мы готовы ответить на вопросы.",
        cta: "Перейти в личный кабинет",
      },
    },
    zh: {
      IN_REVIEW: {
        subject: "我们正在审核您的撤回申请",
        heading: "申请处理中",
        body: "我们已收到您的撤回申请并正在审核。将很快告知结果。",
        cta: "前往个人区",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "撤回已接受：退款已发出"
          : "撤回已接受",
        heading: opts.refundIssued ? "撤回已接受，退款已发出" : "撤回已接受",
        body: opts.refundIssued
          ? "您的撤回申请已接受，我们已发出应退款项。通常可在付款卡上于 <strong>5–10 个工作日</strong> 内看到（取决于银行或发卡机构；有时显示为原交易撤销）。"
          : "您的撤回申请已接受。如有应退款项，我们将按原支付方式发出：发出后银行通常在 <strong>5–10 个工作日</strong> 内入账。",
        cta: "前往个人区",
      },
      REJECTED: {
        subject: "撤回申请结果",
        heading: "撤回申请",
        body: "我们已审核您的撤回申请。原因见下文；如需说明请与我们联系。",
        cta: "前往个人区",
      },
    },
    hi: {
      IN_REVIEW: {
        subject: "हम आपके वापसी अनुरोध की समीक्षा कर रहे हैं",
        heading: "अनुरोध प्रक्रिया में",
        body: "हमें आपका वापसी अनुरोध मिला है और हम इसकी समीक्षा कर रहे हैं। जल्द ही परिणाम सूचित करेंगे।",
        cta: "व्यक्तिगत क्षेत्र पर जाएँ",
      },
      ACCEPTED: {
        subject: opts.refundIssued
          ? "वापसी स्वीकार: रिफंड जारी"
          : "वापसी स्वीकार",
        heading: opts.refundIssued
          ? "वापसी स्वीकार, रिफंड जारी"
          : "वापसी स्वीकार",
        body: opts.refundIssued
          ? "आपका वापसी अनुरोध स्वीकार हो गया और हमने देय राशि का रिफंड जारी कर दिया। आमतौर पर भुगतान वाले कार्ड पर <strong>5–10 कार्य दिवसों</strong> में दिखता है (आपके बैंक या कार्ड जारीकर्ता के समय; कभी-कभी मूल शुल्क रद्द के रूप में)।"
          : "आपका वापसी अनुरोध स्वीकार हो गया। यदि रिफंड देय है, हम उसी भुगतान विधि से जारी करते हैं: जारी होने के बाद बैंक आमतौर पर <strong>5–10 कार्य दिवसों</strong> में जमा करता है।",
        cta: "व्यक्तिगत क्षेत्र पर जाएँ",
      },
      REJECTED: {
        subject: "आपके वापसी अनुरोध का परिणाम",
        heading: "वापसी अनुरोध",
        body: "हमने आपके वापसी अनुरोध की समीक्षा की। कारण नीचे हैं; स्पष्टीकरण के लिए हम उपलब्ध हैं।",
        cta: "व्यक्तिगत क्षेत्र पर जाएँ",
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
    de: {
      subject: `Ihre Rechnung ist verfügbar (Nr. ${number})`,
      heading: "Rechnung verfügbar",
      bodyHtml: `<p style="margin:0 0 10px">Wir haben die Honorarrechnung <strong>Nr. ${number}</strong> für Ihren Erbschaftsvorgang ausgestellt.</p>
      <p style="margin:0">Sie finden und können sie in Ihrem Persönlichen Bereich im Bereich «Ihr Kauf» herunterladen.</p>`,
      ctaLabel: "Rechnung herunterladen",
    },
    es: {
      subject: `Su factura está disponible (n.º ${number})`,
      heading: "Factura disponible",
      bodyHtml: `<p style="margin:0 0 10px">Hemos emitido la factura de honorarios <strong>n.º ${number}</strong> para su expediente de sucesión.</p>
      <p style="margin:0">La encontrará y podrá descargarla en su área personal, sección «Su compra».</p>`,
      ctaLabel: "Descargar factura",
    },
    ru: {
      subject: `Ваш счёт доступен (№ ${number})`,
      heading: "Счёт доступен",
      bodyHtml: `<p style="margin:0 0 10px">Мы выставили счёт за гонорар <strong>№ ${number}</strong> по вашему делу о наследстве.</p>
      <p style="margin:0">Вы найдёте и сможете скачать его в личном кабинете, раздел «Ваша покупка».</p>`,
      ctaLabel: "Скачать счёт",
    },
    zh: {
      subject: `您的发票已可用（编号 ${number}）`,
      heading: "发票已可用",
      bodyHtml: `<p style="margin:0 0 10px">我们已为您继承案件开具律师费发票 <strong>编号 ${number}</strong>。</p>
      <p style="margin:0">您可在个人区「您的购买」部分查看并下载。</p>`,
      ctaLabel: "下载发票",
    },
    hi: {
      subject: `आपका चालान उपलब्ध है (नं. ${number})`,
      heading: "चालान उपलब्ध",
      bodyHtml: `<p style="margin:0 0 10px">हमने आपके उत्तराधिकार प्रकरण के लिए शुल्क चालान <strong>नं. ${number}</strong> जारी किया है।</p>
      <p style="margin:0">आप इसे व्यक्तिगत क्षेत्र में «आपकी खरीद» अनुभाग में देख और डाउनलोड कर सकते हैं।</p>`,
      ctaLabel: "चालान डाउनलोड करें",
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
    de: {
      subject: `Ein Dokument muss erneut hochgeladen werden: ${docLabel}`,
      heading: "Ein Dokument muss überarbeitet werden",
      bodyHtml: `<p style="margin:0 0 10px">Das Dokument <strong>${esc(docLabel)}</strong> benötigt eine Korrektur:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Sie können es aus Ihrem Persönlichen Bereich erneut hochladen — das geht schnell.</p>`,
      ctaLabel: "Dokument erneut hochladen",
    },
    es: {
      subject: `Un documento debe volver a subirse: ${docLabel}`,
      heading: "Un documento debe corregirse",
      bodyHtml: `<p style="margin:0 0 10px">El documento <strong>${esc(docLabel)}</strong> necesita una corrección:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Puede volver a subirlo desde su área personal — es rápido.</p>`,
      ctaLabel: "Volver a subir documento",
    },
    ru: {
      subject: `Документ нужно загрузить заново: ${docLabel}`,
      heading: "Документ нужно исправить",
      bodyHtml: `<p style="margin:0 0 10px">Документ <strong>${esc(docLabel)}</strong> требует исправления:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">Вы можете загрузить его заново из личного кабинета — это быстро.</p>`,
      ctaLabel: "Загрузить документ заново",
    },
    zh: {
      subject: `需重新上传文件：${docLabel}`,
      heading: "文件需重新提交",
      bodyHtml: `<p style="margin:0 0 10px">文件 <strong>${esc(docLabel)}</strong> 需要更正：</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">您可从个人区重新上传 — 很快完成。</p>`,
      ctaLabel: "重新上传文件",
    },
    hi: {
      subject: `एक दस्तावेज़ फिर अपलोड करना होगा: ${docLabel}`,
      heading: "एक दस्तावेज़ फिर तैयार करना होगा",
      bodyHtml: `<p style="margin:0 0 10px">दस्तावेज़ <strong>${esc(docLabel)}</strong> में सुधार चाहिए:</p>
      <p style="margin:0 0 10px;padding:10px 12px;background:#fdecea;border-radius:8px;color:#9b2c20">${esc(reason)}</p>
      <p style="margin:0">आप इसे व्यक्तिगत क्षेत्र से फिर अपलोड कर सकते हैं — यह जल्दी होता है।</p>`,
      ctaLabel: "दस्तावेज़ फिर अपलोड करें",
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
    de: "Zahlung eingegangen: Ihr Vorgang ist aktiv",
    es: "Pago recibido: su expediente está activo",
    ru: "Оплата получена: ваше дело активно",
    zh: "已收到付款：您的案件已激活",
    hi: "भुगतान प्राप्त: आपका प्रकरण सक्रिय है",
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
    "Dokument erneut hochladen: ",
    "Documento a volver a subir: ",
    "Документ нужно загрузить заново: ",
    "需重新上传的文件：",
    "दस्तावेज़ फिर अपलोड करें: ",
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
    "Steuern mitgeteilt: ",
    "Impuestos comunicados: ",
    "Сообщены налоги: ",
    "已通知税款：",
    "कर सूचित: ",
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
    "Ein Dokument muss erneut hochgeladen werden: ",
    "Un documento debe volver a subirse: ",
    "Документ нужно загрузить заново: ",
    "需重新上传文件：",
    "एक दस्तावेज़ फिर अपलोड करना होगा: ",
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
    /^Ihre Rechnung ist verfügbar \(Nr\. (.+)\)$/,
    /^Su factura está disponible \(n\.º (.+)\)$/,
    /^Ваш счёт доступен \(№ (.+)\)$/,
    /^您的发票已可用（编号 (.+)）$/,
    /^आपका चालान उपलब्ध है \(नं\. (.+)\)$/,
  ];
  for (const re of invPatterns) {
    const m = subject.match(re);
    if (m) return invoiceEmail(m[1], locale).subject;
  }

  return subject;
}

// silence unused type if tree-shaken weirdly
export type _EmailBundle = EmailBundle;
