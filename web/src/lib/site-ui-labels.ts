export type PreventivoUiLabels = {
  yes: string;
  no: string;
  unknown: string;
  will_q_before: string;
  will_q_term: string;
  will_q_after: string;
  will_tip_aria: string;
  will_tip: string;
  will_yes_note: string;
  will_unknown_note: string;
  heirs_legend: string;
  heirs_hint: string;
  heir_coniuge: string;
  heir_figli: string;
  heir_genitori: string;
  heir_fratelli: string;
  heir_nipoti: string;
  heir_altri: string;
  less: string;
  more: string;
  real_estate_q: string;
  real_estate_count: string;
  real_estate_placeholder: string;
  real_estate_hint: string;
  over_100k_q: string;
  other_assets_q: string;
  back: string;
  next: string;
};

export type CheckoutUiLabels = {
  stripe_blurb: string;
  err_start: string;
  err_not_configured: string;
  err_retry: string;
  err_network: string;
  need_quote_before: string;
  need_quote_link: string;
  need_quote_after: string;
  loading: string;
  cancelled: string;
  total_fee: string;
  /** Template surcharge: `{extra}` × `{fee}` */
  extra_property: string;
  empty_order: string;
  empty_cta: string;
  meta_title: string;
};

export type ConfermaUiLabels = {
  title_paid: string;
  title_pending: string;
  body_paid: string;
  body_pending: string;
  email_note_before: string;
  email_note_strong: string;
  email_note_after: string;
  cta_area: string;
  cta_home: string;
  taxes_note: string;
  meta_title: string;
};

export type ContactUiLabels = {
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
};

export type SoftLeadUiLabels = {
  name: string;
  email: string;
  phone: string;
  phone_optional: string;
  submitting: string;
  err_save: string;
  notes?: string;
};

export type OfflineUiLabels = {
  email_cta: string;
  whatsapp: string;
  already_practice: string;
  area_cta: string;
};

export type CookieUiLabels = {
  body: string;
  policy_label: string;
  accept_all: string;
  necessary_only: string;
  preferences: string;
};

export type ContattiMapUiLabels = {
  meta_title: string;
  email_label: string;
  studio_label: string;
  map_eyebrow: string;
  map_title: string; // "Lo studio a {citta}"
  maps_cta: string;
  map_iframe_title: string; // "...{address}"
  photo_caption: string;
  photo_credit: string;
};

export type GuideUiLabels = {
  search_placeholder: string;
  search_aria: string;
  all: string;
  free_tool: string;
  back: string;
  author_heading: string;
  related: string;
  featured: string;
  reading_minutes: string; // "{n} min di lettura"
  read_guide: string;
  read: string;
  empty: string;
  updated: string; // "Aggiornato il {date}"
  sources: string;
  breadcrumb_aria: string;
  breadcrumb_guides: string;
  meta_title: string;
  meta_not_found: string;
  tool_alt: string;
};

export type ChromeUiLabels = {
  lang_aria: string;
  menu_open: string;
  menu_close: string;
  back: string;
  meta_result: string;
  meta_recesso: string;
  meta_documenti: string;
};

export const PREVENTIVO_UI_IT: PreventivoUiLabels = {
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
};

export const CHECKOUT_UI_IT: CheckoutUiLabels = {
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
  cancelled:
    "Pagamento annullato. Nessun addebito effettuato: puoi riprovare quando vuoi.",
  total_fee: "Totale onorario",
  extra_property: "Immobili aggiuntivi ({extra} × {fee}€)",
  empty_order:
    "Non risulta una pratica con un pacchetto da pagare. Calcola prima il preventivo: ti proponiamo il pacchetto giusto e colleghiamo il pagamento alla tua pratica.",
  empty_cta: "Vai al preventivo →",
  meta_title: "Completa l'ordine",
};

export const CONFERMA_UI_IT: ConfermaUiLabels = {
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
};

export const CONTACT_UI_IT: ContactUiLabels = {
  name: "Nome e cognome",
  email: "Email",
  phone: "Telefono (facoltativo)",
  message: "Messaggio",
  submit: "Invia messaggio",
};

export const SOFT_LEAD_UI_IT: SoftLeadUiLabels = {
  name: "Nome e cognome (facoltativo)",
  email: "Email",
  phone: "Telefono",
  phone_optional: "Telefono (facoltativo)",
  submitting: "Invio in corso…",
  err_save:
    "Al momento non riusciamo a registrare la richiesta. Riprova più tardi o chiamaci.",
  notes: "Nota (facoltativa)",
};

export const OFFLINE_UI_IT: OfflineUiLabels = {
  email_cta: "Scrivici via email",
  whatsapp: "WhatsApp",
  already_practice: "Hai già una pratica?",
  area_cta: "Accedi all'area personale",
};

export const COOKIE_UI_IT: CookieUiLabels = {
  body: "Usiamo cookie tecnici (necessari) e, con il tuo consenso, cookie di statistica per migliorare il sito. Puoi accettare o rifiutare quelli non necessari.",
  policy_label: "Cookie policy",
  accept_all: "Accetta tutti",
  necessary_only: "Solo necessari",
  preferences: "Preferenze cookie",
};

export const CONTATTI_MAP_UI_IT: ContattiMapUiLabels = {
  meta_title: "Contatti",
  email_label: "Email",
  studio_label: "Studio",
  map_eyebrow: "Dove ci trovi",
  map_title: "Lo studio a {citta}",
  maps_cta: "Apri in Google Maps",
  map_iframe_title: "Mappa dello studio - {address}",
  photo_caption: "Duomo di Pontedera",
  photo_credit: "Foto: SeesaTheDoctor / Wikimedia (CC BY 4.0)",
};

export type CatastaleCategoria = { value: string; label: string };

export const CATASTALE_CATEGORIE_IT: CatastaleCategoria[] = [
  { value: "A", label: "Abitazione – gruppo A (esclusa A/10)" },
  { value: "A10", label: "A/10 – Uffici e studi privati" },
  { value: "B", label: "Gruppo B (collegi, scuole, uffici pubblici…)" },
  { value: "C", label: "Gruppo C – pertinenze (box, cantine…), esclusa C/1" },
  { value: "C1", label: "C/1 – Negozi e botteghe" },
  { value: "D", label: "Gruppo D (opifici, alberghi, capannoni…)" },
  { value: "E", label: "Gruppo E (stazioni, edifici speciali…)" },
];

export const GUIDE_UI_IT: GuideUiLabels = {
  search_placeholder: "Cerca tra le guide (es. imposte, documenti, esonero)",
  search_aria: "Cerca tra le guide",
  all: "Tutte",
  free_tool: "Strumento gratuito",
  back: "Torna alle guide",
  author_heading: "Chi ha scritto questa guida",
  related: "Guide correlate",
  featured: "In evidenza",
  reading_minutes: "{n} min di lettura",
  read_guide: "Leggi la guida",
  read: "Leggi",
  empty:
    "Nessuna guida trovata per la tua ricerca. Prova con un altro termine o scrivici: rispondiamo a tutti.",
  updated: "Aggiornato il {date}",
  sources: "Fonti ufficiali",
  breadcrumb_aria: "Percorso",
  breadcrumb_guides: "Guide",
  meta_title: "Guide alle successioni",
  meta_not_found: "Guida non trovata",
  tool_alt: "Illustrazione: casa, calcolatrice e documento con simbolo euro",
};

export const CHROME_UI_IT: ChromeUiLabels = {
  lang_aria: "Seleziona lingua",
  menu_open: "Apri menu",
  menu_close: "Chiudi menu",
  back: "Indietro",
  meta_result: "Il tuo risultato",
  meta_recesso: "Diritto di recesso",
  meta_documenti: "Documenti per la successione",
};
