/*
  Etichette UI dell'area personale (form client + stringhe di pagina).
  I valori IT qui sotto sono fallback; le traduzioni vivono in content_entries.*.json
  (collection "area", chiavi *_ui).
*/

export type DocsUiLabels = {
  counter: string; // "Documenti: {uploaded} di {total}"
  all_uploaded: string;
  missing_n: string; // "Mancano {n}"
  optional: string;
  delete_file: string;
  uploading: string;
  upload: string;
  reupload: string;
  add_another: string;
  multi_page_hint: string;
  done_title: string;
  done_body: string;
  submit_cta: string;
  missing_one: string;
  missing_many: string; // "Mancano {n} documenti"
  templates_title: string;
  templates_help: string;
  err_file_too_big: string;
  err_too_many: string;
  err_upload_failed: string;
  err_upload_network: string;
  err_delete_failed: string;
  err_delete_network: string;
  state_da_caricare: string;
  state_caricato: string;
  state_da_rifare: string;
};

export type MandateUiLabels = {
  signed_title: string;
  signed_paper: string;
  signed_electronic: string;
  signed_thanks: string;
  accept_checkbox: string;
  accept_cta: string;
  paper_title: string;
  paper_body: string;
  download_blank: string;
  upload_signed: string;
  err_file_too_big: string;
  err_upload_failed: string;
  err_upload_network: string;
  heading: string; // "Mandato professionale - Pratica {code}"
};

export type IbanUiLabels = {
  saved: string; // "...••{last4}..."
  cleared: string; // "...{date}..."
  label: string;
  hint: string;
  save: string;
};

export type ClaimUiLabels = {
  title: string;
  body: string;
  code_label: string;
  email_label: string;
  needs_email: string; // "...{email}..."
  linking: string;
  cta: string;
};

export type WithdrawalUiLabels = {
  status_requested: string;
  status_in_review: string;
  status_accepted: string;
  status_rejected: string;
  registered_title: string;
  registered_body: string; // "...{status}..."
  rejected_prev: string;
  rejected_retry: string;
  reason_label: string;
  reason_placeholder: string;
  cta: string;
  alt_contact: string;
  refund_issued: string;
  refund_pending: string;
};

export type InvoiceUiLabels = {
  download: string;
  number: string; // "Fattura n. {number}"
  issued_soon: string; // "Fattura n. {number} emessa..."
  pending: string;
};

export type FinalDocsUiLabels = {
  download_zip: string;
  download: string;
  not_ready: string;
};

export type ProfiloUiLabels = {
  contacts: string;
  name: string;
  email: string;
  phone: string;
  phone_empty: string;
  phone_edit: string;
  phone_add: string;
  dial_aria: string;
  dial_other: string;
  dial_custom_aria: string;
  phone_hint: string;
  save: string;
  cancel: string;
  security: string;
  password_intro: string;
  password_saved: string;
  password_change: string;
  password_create: string;
  password_new: string;
  password_confirm: string;
  password_mismatch: string;
  password_save: string;
  prefs_title: string;
  prefs_body: string;
  prefs_email: string;
  prefs_wa: string;
  prefs_saved: string;
  comms_lang_title: string;
  comms_lang_body: string;
  comms_lang_notice: string;
  comms_lang_it: string;
  comms_lang_ar: string;
  comms_lang_en: string;
  comms_lang_tr: string;
  comms_lang_fr: string;
  comms_lang_sq: string;
  comms_lang_de: string;
  comms_lang_es: string;
  comms_lang_ru: string;
  comms_lang_zh: string;
  comms_lang_hi: string;
  logout: string;
};

export type OrdineUiLabels = {
  includes_named: string; // 'Cosa include "{name}"'
  includes_generic: string;
  includes_missing: string;
  taxes_title: string;
  taxes_body: string;
  taxes_need_iban: string;
  taxes_iban_cta: string;
  taxes_iban_saved: string; // "...{last4}..."
  taxes_iban_edit: string;
  taxes_pending: string;
  withdrawal_prompt: string;
  withdrawal_cta: string;
};

export type DocumentiPageLabels = {
  cancelled_subtitle: string;
  cancelled_body: string;
};

export type ConclusaPreviewLabels = {
  label: string;
  description: string;
}[];

export const DOCS_UI_IT: DocsUiLabels = {
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
};

export const MANDATE_UI_IT: MandateUiLabels = {
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
};

export const IBAN_UI_IT: IbanUiLabels = {
  saved:
    "IBAN salvato in modo cifrato (termina con ••{last4}). Puoi aggiornarlo inserendone uno nuovo.",
  cleared:
    "L'IBAN è stato utilizzato per il versamento (F24) e poi cancellato per sicurezza il {date}. Se serve di nuovo puoi reinserirlo.",
  label: "IBAN dell'erede",
  hint: "Dato sensibile: serve solo per l'eventuale addebito delle imposte (F24). Conservato in modo cifrato.",
  save: "Salva",
};

export const CLAIM_UI_IT: ClaimUiLabels = {
  title: "Hai già una pratica? Collega questo accesso",
  body: "Inserisci il codice pratica (es. SUC-2026-0022) e l'email usata per il pagamento o per il preventivo. Deve coincidere con l'email di questo login.",
  code_label: "Codice pratica",
  email_label: "Email dell'acquisto / preventivo",
  needs_email:
    "Esci da questo account e accedi con {email} (usa il link nell'email di pagamento, oppure richiedi un nuovo magic link dalla pagina di login).",
  linking: "Collegamento…",
  cta: "Collega la pratica",
};

export const WITHDRAWAL_UI_IT: WithdrawalUiLabels = {
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
};

export const INVOICE_UI_IT: InvoiceUiLabels = {
  download: "Scarica fattura",
  number: "Fattura n. {number}",
  issued_soon:
    "Fattura n. {number} emessa. Il PDF sarà disponibile a breve.",
  pending: "La fattura sarà disponibile qui non appena emessa.",
};

export const FINAL_DOCS_UI_IT: FinalDocsUiLabels = {
  download_zip: "Scarica tutto (ZIP)",
  download: "Scarica",
  not_ready:
    "I documenti finali non sono ancora disponibili. Qui sotto trovi l'anteprima di cosa riceverai a pratica conclusa.",
};

export const PROFILO_UI_IT: ProfiloUiLabels = {
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
  comms_lang_title: "Lingua delle comunicazioni scritte",
  comms_lang_body:
    "Email e messaggi sulla pratica (pagamenti, documenti, recesso). È indipendente dalla lingua dell’interfaccia.",
  comms_lang_notice:
    "Le traduzioni sono automatiche / di cortesia. I documenti ufficiali e i testi che fanno fede restano in italiano.",
  comms_lang_it: "Italiano",
  comms_lang_ar: "العربية",
  comms_lang_en: "English",
  comms_lang_tr: "Türkçe",
  comms_lang_fr: "Français",
  comms_lang_sq: "Shqip",
  comms_lang_de: "Deutsch",
  comms_lang_es: "Español",
  comms_lang_ru: "Русский",
  comms_lang_zh: "中文",
  comms_lang_hi: "हिन्दी",
  logout: "Esci",
};

export const ORDINE_UI_IT: OrdineUiLabels = {
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
};

export const DOCUMENTI_PAGE_IT: DocumentiPageLabels = {
  cancelled_subtitle:
    "La pratica è stata annullata: non serve caricare nulla.",
  cancelled_body:
    "Questa pratica è stata annullata, quindi il caricamento dei documenti è disattivato. I documenti d'identità e gli altri file caricati verranno cancellati dai nostri sistemi secondo la privacy policy.",
};

export const FINAL_DOCS_PREVIEW_IT: ConclusaPreviewLabels = [
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
];

export function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
    template,
  );
}
