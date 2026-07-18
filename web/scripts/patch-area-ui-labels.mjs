#!/usr/bin/env node
/**
 * Aggiunge/aggiorna le chiavi area.*_ui in content_entries.it.json e .ar.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const IT = {
  docs_ui: {
    counter: "Documenti: {uploaded} di {total}",
    all_uploaded: "Tutti caricati",
    missing_n: "Mancano {n}",
    optional: "(facoltativo)",
    delete_file: "Elimina questo file",
    uploading: "Caricamento…",
    upload: "Carica",
    reupload: "Ricarica",
    add_another: "Aggiungi un altro file",
    multi_page_hint: "fronte/retro o una foto per pagina: le uniamo noi",
    done_title: "Fatto!",
    done_body:
      "Lorenzo ha ricevuto i tuoi documenti e li sta controllando. Ti avvisiamo se manca qualcosa — puoi stare tranquillo.",
    submit_cta: "Ho finito — invia a Lorenzo",
    missing_one: "Manca 1 documento",
    missing_many: "Mancano {n} documenti",
    templates_title: "Ti serve il modulo? Te lo diamo noi:",
    templates_help:
      "Scarica il modello, stampalo e compilalo in ogni parte, firmalo e ricaricalo qui (va bene anche una foto ben leggibile), insieme alla copia del documento d'identità di chi firma.",
    err_file_too_big: "File troppo grande (massimo 10 MB).",
    err_too_many: "Puoi caricare al massimo 10 file per voce.",
    err_upload_failed: "Caricamento non riuscito.",
    err_upload_network: "Caricamento non riuscito, controlla la connessione.",
    err_delete_failed: "Eliminazione non riuscita.",
    err_delete_network: "Eliminazione non riuscita, riprova.",
    state_da_caricare: "Da caricare",
    state_caricato: "Caricato",
    state_da_rifare: "Da rifare",
  },
  mandate_ui: {
    signed_title: "Mandato firmato.",
    signed_paper: "Mandato cartaceo firmato ricevuto.",
    signed_electronic: "Firma elettronica registrata (data e ora).",
    signed_thanks: "Grazie, possiamo procedere con la tua pratica.",
    accept_checkbox:
      "Ho letto e accetto il mandato, le condizioni e l'informativa privacy.",
    accept_cta: "Accetto e firmo online",
    paper_title: "Preferisci la firma cartacea?",
    paper_body:
      "Scarica il mandato, firmalo a mano e ricaricalo: per noi va benissimo.",
    download_blank: "Scarica il mandato",
    upload_signed: "Carica il mandato firmato",
    err_file_too_big: "File troppo grande (massimo 10 MB).",
    err_upload_failed: "Caricamento non riuscito.",
    err_upload_network: "Caricamento non riuscito, controlla la connessione.",
    heading: "Mandato professionale - Pratica {code}",
  },
  iban_ui: {
    saved:
      "IBAN salvato in modo cifrato (termina con ••{last4}). Puoi aggiornarlo inserendone uno nuovo.",
    cleared:
      "L'IBAN è stato utilizzato per il versamento (F24) e poi cancellato per sicurezza il {date}. Se serve di nuovo puoi reinserirlo.",
    label: "IBAN dell'erede",
    hint: "Dato sensibile: serve solo per l'eventuale addebito delle imposte (F24). Conservato in modo cifrato.",
    save: "Salva",
  },
  claim_ui: {
    title: "Hai già una pratica? Collega questo accesso",
    body: "Inserisci il codice pratica (es. SUC-2026-0022) e l'email usata per il pagamento o per il preventivo. Deve coincidere con l'email di questo login.",
    code_label: "Codice pratica",
    email_label: "Email dell'acquisto / preventivo",
    needs_email:
      "Esci da questo account e accedi con {email} (usa il link nell'email di pagamento, oppure richiedi un nuovo magic link dalla pagina di login).",
    linking: "Collegamento…",
    cta: "Collega la pratica",
  },
  withdrawal_ui: {
    status_requested: "Inviata",
    status_in_review: "In gestione",
    status_accepted: "Accettata",
    status_rejected: "Respinta",
    registered_title: "Richiesta registrata.",
    registered_body:
      "Lorenzo ha ricevuto la tua richiesta e ti ricontatterà. Stato attuale: {status}.",
    rejected_prev: "Una precedente richiesta è stata respinta",
    rejected_retry: "Puoi inviarne una nuova.",
    reason_label: "Motivo (facoltativo)",
    reason_placeholder: "Se vuoi, raccontaci perché…",
    cta: "Richiedi recesso",
    alt_contact:
      "In alternativa puoi scrivere a studio@successioniarmellin.it o via PEC.",
    refund_issued:
      "Il rimborso è stato emesso sulla carta usata per il pagamento: di norma lo vedi accreditato entro 5-10 giorni lavorativi (tempi della tua banca o dell'emittente della carta; a volte compare come storno della spesa originale).",
    refund_pending:
      "Se è dovuto un rimborso, lo emettiamo con lo stesso metodo di pagamento. Una volta emesso, la banca lo accredita di norma entro 5-10 giorni lavorativi.",
  },
  invoice_ui: {
    download: "Scarica fattura",
    number: "Fattura n. {number}",
    issued_soon:
      "Fattura n. {number} emessa. Il PDF sarà disponibile a breve.",
    pending: "La fattura sarà disponibile qui non appena emessa.",
  },
  final_docs_ui: {
    download_zip: "Scarica tutto (ZIP)",
    download: "Scarica",
    not_ready:
      "I documenti finali non sono ancora disponibili. Qui sotto trovi l'anteprima di cosa riceverai a pratica conclusa.",
  },
  profilo_ui: {
    contacts: "Recapiti",
    name: "Nome",
    email: "Email",
    phone: "Telefono",
    phone_empty: "non inserito",
    phone_edit: "Modifica numero",
    phone_add: "Aggiungi numero",
    dial_aria: "Prefisso internazionale",
    dial_other: "Altro…",
    dial_custom_aria: "Prefisso personalizzato",
    phone_hint: "Scegli il prefisso paese (+39, +49…) poi il numero nazionale.",
    save: "Salva",
    cancel: "Annulla",
    security: "Sicurezza",
    password_intro:
      "Se vuoi, puoi creare una password per accedere più in fretta, senza aspettare il link via email.",
    password_saved:
      "Password salvata: dal prossimo accesso puoi usarla insieme agli altri metodi.",
    password_change: "Cambia password",
    password_create: "Crea o cambia password",
    password_new: "Nuova password (minimo 8 caratteri)",
    password_confirm: "Ripeti la password",
    password_mismatch: "Le due password non coincidono.",
    password_save: "Salva password",
    prefs_title: "Preferenze notifiche",
    prefs_body:
      "Le email operative (pagamento, documenti, imposte, chiusura) restano sempre attive. Qui puoi disattivare solo i messaggi facoltativi, come la richiesta di recensione.",
    prefs_email: "Email facoltative (es. recensione)",
    prefs_wa: "WhatsApp (in arrivo)",
    prefs_saved: "Preferenze salvate.",
    logout: "Esci",
  },
  ordine_ui: {
    includes_named: 'Cosa include "{name}"',
    includes_generic: "Cosa include il pacchetto",
    includes_missing: "Dettaglio non disponibile.",
    taxes_title: "Imposte",
    taxes_body:
      "Queste somme non sono il nostro onorario: sono imposte che si versano allo Stato (modello F24, autoliquidazione). Te le calcoliamo e comunichiamo prima dell'invio.",
    taxes_need_iban: "Per l'addebito delle imposte serve il tuo IBAN.",
    taxes_iban_cta: "Inserisci l'IBAN ora →",
    taxes_iban_saved: "IBAN registrato (•••• {last4}).",
    taxes_iban_edit: "Modifica",
    taxes_pending:
      "Le imposte ti verranno calcolate e comunicate prima dell'invio.",
    withdrawal_prompt: "Hai cambiato idea?",
    withdrawal_cta: "Richiedi il recesso",
  },
  documenti_page_ui: {
    cancelled_subtitle:
      "La pratica è stata annullata: non serve caricare nulla.",
    cancelled_body:
      "Questa pratica è stata annullata, quindi il caricamento dei documenti è disattivato. I documenti d'identità e gli altri file caricati verranno cancellati dai nostri sistemi secondo la privacy policy.",
  },
  final_docs_preview: [
    {
      label: "Ricevuta di presentazione - Agenzia delle Entrate",
      description: "Attestazione telematica con protocollo di registrazione.",
    },
    {
      label: "Dichiarazione di successione (copia)",
      description: "Il modello presentato all'Agenzia.",
    },
    {
      label: "Visure catastali aggiornate (volture)",
      description: "Gli immobili intestati agli eredi.",
    },
    {
      label: "Fattura dell'onorario",
      description: "Documento fiscale del nostro compenso.",
    },
  ],
};

const AR = {
  docs_ui: {
    counter: "المستندات: {uploaded} من {total}",
    all_uploaded: "تم تحميل الكل",
    missing_n: "ينقص {n}",
    optional: "(اختياري)",
    delete_file: "حذف هذا الملف",
    uploading: "جاري التحميل…",
    upload: "تحميل",
    reupload: "أعد التحميل",
    add_another: "أضف ملفًا آخر",
    multi_page_hint: "وجه/ظهر أو صورة لكل صفحة: ندمجها نحن",
    done_title: "تم!",
    done_body:
      "تلقّى Lorenzo مستنداتك وهو يراجعها. سنُعلمك إن نقص شيء — يمكنك الاطمئنان.",
    submit_cta: "انتهيت — أرسل إلى Lorenzo",
    missing_one: "ينقص مستند واحد",
    missing_many: "ينقص {n} مستندات",
    templates_title: "تحتاج النموذج؟ نقدّمه لك:",
    templates_help:
      "نزّل النموذج، اطبعه واملأه بالكامل، وقّعه ثم أعد تحميله هنا (صورة واضحة مقبولة)، مع نسخة من وثيقة هوية الموقّع.",
    err_file_too_big: "الملف كبير جدًا (الحد الأقصى 10 ميجابايت).",
    err_too_many: "يمكنك تحميل 10 ملفات كحد أقصى لكل بند.",
    err_upload_failed: "فشل التحميل.",
    err_upload_network: "فشل التحميل، تحقق من الاتصال.",
    err_delete_failed: "فشل الحذف.",
    err_delete_network: "فشل الحذف، أعد المحاولة.",
    state_da_caricare: "بانتظار التحميل",
    state_caricato: "تم التحميل",
    state_da_rifare: "يجب إعادة التحميل",
  },
  mandate_ui: {
    signed_title: "تم توقيع التفويض.",
    signed_paper: "تم استلام التفويض الورقي الموقّع.",
    signed_electronic: "تم تسجيل التوقيع الإلكتروني (التاريخ والوقت).",
    signed_thanks: "شكرًا، يمكننا متابعة معاملتك.",
    accept_checkbox:
      "قرأت وأوافق على التفويض والشروط وإشعار الخصوصية.",
    accept_cta: "أوافق وأوقّع عبر الإنترنت",
    paper_title: "تفضل التوقيع الورقي؟",
    paper_body:
      "نزّل التفويض، وقّعه يدويًا ثم أعد تحميله: هذا مناسب لنا تمامًا.",
    download_blank: "تنزيل التفويض",
    upload_signed: "تحميل التفويض الموقّع",
    err_file_too_big: "الملف كبير جدًا (الحد الأقصى 10 ميجابايت).",
    err_upload_failed: "فشل التحميل.",
    err_upload_network: "فشل التحميل، تحقق من الاتصال.",
    heading: "تفويض مهني - المعاملة {code}",
  },
  iban_ui: {
    saved:
      "تم حفظ IBAN بشكل مشفّر (ينتهي بـ ••{last4}). يمكنك تحديثه بإدخال رقم جديد.",
    cleared:
      "استُخدم IBAN للسداد (F24) ثم حُذف لأسباب أمنية في {date}. إن لزم يمكنك إدخاله مجددًا.",
    label: "IBAN الوريث",
    hint: "بيان حسّاس: يُستخدم فقط لاحتمال خصم الضرائب (F24). يُحفظ مشفّرًا.",
    save: "حفظ",
  },
  claim_ui: {
    title: "لديك معاملة بالفعل؟ اربط هذا الدخول",
    body: "أدخل رمز المعاملة (مثل SUC-2026-0022) والبريد المستخدم للدفع أو العرض. يجب أن يطابق بريد هذا الدخول.",
    code_label: "رمز المعاملة",
    email_label: "بريد الشراء / العرض",
    needs_email:
      "اخرج من هذا الحساب وادخل بـ {email} (استخدم الرابط في بريد الدفع، أو اطلب رابط دخول جديد من صفحة تسجيل الدخول).",
    linking: "جاري الربط…",
    cta: "اربط المعاملة",
  },
  withdrawal_ui: {
    status_requested: "مُرسلة",
    status_in_review: "قيد المعالجة",
    status_accepted: "مقبولة",
    status_rejected: "مرفوضة",
    registered_title: "تم تسجيل الطلب.",
    registered_body:
      "تلقّى Lorenzo طلبك وسيتواصل معك. الحالة الحالية: {status}.",
    rejected_prev: "رُفض طلب سابق",
    rejected_retry: "يمكنك إرسال طلب جديد.",
    reason_label: "السبب (اختياري)",
    reason_placeholder: "إن رغبت، أخبرنا لماذا…",
    cta: "اطلب الانسحاب",
    alt_contact:
      "بدلًا من ذلك يمكنك الكتابة إلى studio@successioniarmellin.it أو عبر PEC.",
    refund_issued:
      "تم إصدار الاسترداد على البطاقة المستخدمة للدفع: عادةً يظهر خلال 5-10 أيام عمل (حسب بنكك أو جهة إصدار البطاقة؛ وقد يظهر كإلغاء للعملية الأصلية).",
    refund_pending:
      "إن كان الاسترداد مستحقًا، نصدره بنفس وسيلة الدفع. بعد الإصدار، يضيفه البنك عادةً خلال 5-10 أيام عمل.",
  },
  invoice_ui: {
    download: "تنزيل الفاتورة",
    number: "فاتورة رقم {number}",
    issued_soon: "صدرت الفاتورة رقم {number}. سيكون ملف PDF متاحًا قريبًا.",
    pending: "ستتوفر الفاتورة هنا فور إصدارها.",
  },
  final_docs_ui: {
    download_zip: "تنزيل الكل (ZIP)",
    download: "تنزيل",
    not_ready:
      "المستندات النهائية غير متاحة بعد. أدناه معاينة لما ستستلمه عند اختتام المعاملة.",
  },
  profilo_ui: {
    contacts: "بيانات الاتصال",
    name: "الاسم",
    email: "البريد",
    phone: "الهاتف",
    phone_empty: "غير مُدخل",
    phone_edit: "تعديل الرقم",
    phone_add: "إضافة رقم",
    dial_aria: "مفتاح الدولة",
    dial_other: "آخر…",
    dial_custom_aria: "مفتاح مخصص",
    phone_hint: "اختر مفتاح الدولة (+39، +49…) ثم الرقم المحلي.",
    save: "حفظ",
    cancel: "إلغاء",
    security: "الأمان",
    password_intro:
      "إن رغبت، يمكنك إنشاء كلمة مرور للدخول أسرع دون انتظار رابط البريد.",
    password_saved:
      "تم حفظ كلمة المرور: من الدخول التالي يمكنك استخدامها مع الطرق الأخرى.",
    password_change: "تغيير كلمة المرور",
    password_create: "إنشاء أو تغيير كلمة المرور",
    password_new: "كلمة مرور جديدة (8 أحرف على الأقل)",
    password_confirm: "أعد كلمة المرور",
    password_mismatch: "كلمتا المرور غير متطابقتين.",
    password_save: "حفظ كلمة المرور",
    prefs_title: "تفضيلات الإشعارات",
    prefs_body:
      "رسائل البريد التشغيلية (الدفع، المستندات، الضرائب، الإغلاق) تبقى دائمًا مفعّلة. هنا يمكنك إيقاف الرسائل الاختيارية فقط، مثل طلب المراجعة.",
    prefs_email: "بريد اختياري (مثل المراجعة)",
    prefs_wa: "WhatsApp (قريبًا)",
    prefs_saved: "تم حفظ التفضيلات.",
    logout: "خروج",
  },
  ordine_ui: {
    includes_named: 'ماذا تشمل "{name}"',
    includes_generic: "ماذا تشمل الباقة",
    includes_missing: "التفاصيل غير متاحة.",
    taxes_title: "الضرائب",
    taxes_body:
      "هذه المبالغ ليست أتعابنا: هي ضرائب تُدفع للدولة (نموذج F24، تصفية ذاتية). نحسبها ونبلّغك بها قبل الإرسال.",
    taxes_need_iban: "لخصم الضرائب نحتاج IBAN الخاص بك.",
    taxes_iban_cta: "أدخل IBAN الآن ←",
    taxes_iban_saved: "IBAN مسجّل (•••• {last4}).",
    taxes_iban_edit: "تعديل",
    taxes_pending: "سيُحسب مبلغ الضرائب ويُبلَّغ به قبل الإرسال.",
    withdrawal_prompt: "غيّرت رأيك؟",
    withdrawal_cta: "اطلب الانسحاب",
  },
  documenti_page_ui: {
    cancelled_subtitle: "أُلغيت المعاملة: لا حاجة لتحميل شيء.",
    cancelled_body:
      "أُلغيت هذه المعاملة، لذلك تعطّل تحميل المستندات. ستُحذف وثائق الهوية والملفات الأخرى من أنظمتنا وفق سياسة الخصوصية.",
  },
  final_docs_preview: [
    {
      label: "إيصال التقديم - وكالة الضرائب",
      description: "شهادة إلكترونية برقم بروتوكول التسجيل.",
    },
    {
      label: "إقرار التركة (نسخة)",
      description: "النموذج المقدَّم إلى الوكالة.",
    },
    {
      label: "كشوف عقارية محدّثة (نقل ملكية)",
      description: "العقارات المسجّلة بأسماء الورثة.",
    },
    {
      label: "فاتورة الأتعاب",
      description: "المستند الضريبي لأتعابنا.",
    },
  ],
};

function upsert(filePath, locale, values) {
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  const byKey = new Map(
    data.entries
      .filter((e) => e.collection === "area")
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
        collection: "area",
        key,
        locale,
        is_published: true,
        value,
      });
    }
  }
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`patched ${filePath} (+${Object.keys(values).length} keys)`);
}

upsert(join(root, "src/content/content_entries.it.json"), "it", IT);
upsert(join(root, "src/content/content_entries.ar.json"), "ar", AR);
