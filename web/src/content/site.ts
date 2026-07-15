/*
  Fixture locali del prototipo per i contenuti STRUTTURATI che nel modello reale
  vivono in tabelle dedicate (packages, addons, faqs) e non nel seed content_entries.
  Valori [BOZZA] segnaposto, allineati a blueprint/SPEC_Data_Model.md.
  In Fase 4 verranno sostituiti da letture Supabase. NON sono prezzi/copy definitivi.
*/

export type PackageType = "SEMPLICE" | "COMPLETO" | "ZERO_STRESS";

export type Package = {
  key: PackageType;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  price: number;
  extraPropertyFee: number | null;
  slaDays: number | null;
  badge: string | null;
  sortOrder: number;
};

export const packages: Package[] = [
  {
    key: "SEMPLICE",
    name: "Successione Semplice",
    tagline: "Per i casi lineari, senza immobili",
    description:
      "La dichiarazione di successione predisposta e inviata all'Agenzia delle Entrate, quando non ci sono immobili da gestire.",
    features: [
      "Predisposizione della dichiarazione",
      "Invio telematico all'Agenzia delle Entrate",
      "Calcolo delle imposte comunicato prima dell'invio",
      "Assistenza di una persona reale",
    ],
    price: 290,
    extraPropertyFee: null,
    slaDays: 10,
    badge: null,
    sortOrder: 1,
  },
  {
    key: "COMPLETO",
    name: "Successione Completa",
    tagline: "Con immobili e voltura catastale",
    description:
      "Tutto incluso quando ci sono immobili: controllo dei dati catastali, dichiarazione e voltura catastale. Copre fino a 5 eredi, da 1 a 3 immobili e fino a 5 conti bancari.",
    features: [
      "Tutto quello del pacchetto Semplice",
      "Fino a 5 eredi, 1-3 immobili, fino a 5 conti",
      "Controllo dei dati catastali da geometra",
      "Voltura catastale inclusa",
    ],
    price: 490,
    extraPropertyFee: 60,
    slaDays: 15,
    badge: "Il più scelto",
    sortOrder: 2,
  },
  {
    key: "ZERO_STRESS",
    name: "Zero Stress",
    tagline: "Ce ne occupiamo noi, dall'inizio alla fine",
    description:
      "La massima tranquillità per i casi più corposi: da 3 a 8 immobili, fino a 5 conti e 5 eredi. Recuperiamo noi i documenti mancanti e ti aggiorniamo a ogni step.",
    features: [
      "Tutto quello del pacchetto Completo",
      "Da 3 a 8 immobili, fino a 5 conti e 5 eredi",
      "Recupero documenti presso enti e banche",
      "Priorità di lavorazione",
    ],
    price: 790,
    extraPropertyFee: 60,
    slaDays: 10,
    badge: null,
    sortOrder: 3,
  },
];

export type Addon = {
  key: string;
  name: string;
  description: string;
  price: number;
};

export const addons: Addon[] = [
  {
    key: "RIUNIONE_USUFRUTTO",
    name: "Riunione di usufrutto",
    description:
      "Aggiornamento catastale a seguito dell'estinzione dell'usufrutto.",
    price: 150,
  },
  {
    key: "ADEGUAMENTO_IMU",
    name: "Adeguamento e ricalcolo IMU",
    description:
      "Ricalcolo dell'IMU dopo la successione e aggiornamento per i nuovi intestatari.",
    price: 90,
  },
  {
    key: "VOLTURA_EXTRA",
    name: "Voltura aggiuntiva",
    description: "Voltura per immobili oltre quelli inclusi nel pacchetto.",
    price: 60,
  },
];

export type Faq = {
  question: string;
  answer: string;
  category: string;
};

export const faqs: Faq[] = [
  {
    category: "Capire la successione",
    question: "Cos'è la dichiarazione di successione?",
    answer:
      "È l'adempimento fiscale con cui si comunica all'Agenzia delle Entrate il patrimonio del defunto trasferito agli eredi. Va presentata di norma entro 12 mesi dal decesso.",
  },
  {
    category: "Capire la successione",
    question: "Entro quando va presentata?",
    answer:
      "Generalmente entro 12 mesi dalla data del decesso. Presentarla in ritardo può comportare sanzioni: ce ne occupiamo noi nei tempi corretti.",
  },
  {
    category: "Costi e imposte",
    question: "Quanto costa il vostro servizio?",
    answer:
      "Paghi un onorario fisso in base al pacchetto. Le imposte sono separate, a carico dell'erede, e te le calcoliamo e comunichiamo prima dell'invio.",
  },
  {
    category: "Costi e imposte",
    question: "Le imposte sono comprese nel prezzo?",
    answer:
      "No: il prezzo del pacchetto è l'onorario professionale. Le imposte (successione, ipotecaria, catastale, bolli) si versano con F24 e sono separate. Te le calcoliamo noi prima.",
  },
  {
    category: "Costi e imposte",
    question: "Cos'è l'agevolazione prima casa in successione?",
    answer:
      "Se almeno un erede ha i requisiti prima casa sull'immobile ereditato, le imposte ipotecaria e catastale si pagano in misura fissa (200 euro ciascuna) invece che in percentuale sul valore catastale. Verifichiamo noi se ti spetta e la indichiamo in dichiarazione.",
  },
  {
    category: "Perché non da soli",
    question: "Posso farla gratis da solo sul sito dell'Agenzia?",
    answer:
      "Sì, esiste la successione precompilata gratuita ed è un'opzione onesta. Richiede però SPID e competenza: non valida i dati catastali e gli eventuali errori (e le sanzioni) restano a tuo carico.",
  },
  {
    category: "Come funziona",
    question: "Devo andare in qualche ufficio?",
    answer:
      "No. Questionario, documenti, comunicazioni e invio all'Agenzia avvengono online. C'è sempre una chiamata con Lorenzo per spiegarti tutto.",
  },
  {
    category: "Come funziona",
    question: "Quali documenti servono?",
    answer:
      "Dipende dal tuo caso: ti diamo una lista personalizzata. Se ti manca qualcosa, spesso lo possiamo recuperare noi (visure, atti di provenienza).",
  },
  {
    category: "Dopo il servizio",
    question: "Cosa ricevo a fine pratica?",
    answer:
      "Ricevuta di presentazione/registrazione, copia della dichiarazione, esito F24 e, dove prevista, esito della voltura catastale, oltre alla nostra fattura.",
  },
];

export type Review = {
  author: string;
  location: string;
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    author: "Maria R.",
    location: "Pisa",
    rating: 5,
    text:
      "In un momento difficile mi hanno tolto un peso enorme. Tutto da casa, sempre disponibili a rispondere ai miei dubbi.",
  },
  {
    author: "Giovanni B.",
    location: "Pontedera",
    rating: 5,
    text:
      "Prezzo chiaro fin dall'inizio, nessuna sorpresa. Hanno recuperato loro le visure che non trovavo.",
  },
  {
    author: "Anna T.",
    location: "Livorno",
    rating: 5,
    text:
      "Professionali e umani. Mi hanno spiegato tutto con parole semplici, senza burocratese.",
  },
];

/*
  Le anteprime delle guide (ex `guides`/`GuidePreview`) sono confluite negli
  articoli data-driven: vedi `@/content/articles` e l'accesso via `@/lib/cms`.
*/

export type DocItem = {
  name: string;
  description: string;
  when: string;
};

export const documentsList: DocItem[] = [
  {
    name: "Documento d'identità e codice fiscale",
    description: "Di tutti gli eredi e del defunto.",
    when: "Sempre",
  },
  {
    name: "Certificato di morte",
    description:
      "O la dichiarazione sostitutiva di certificato di morte e stato di famiglia del defunto: il modello te lo diamo noi.",
    when: "Sempre",
  },
  {
    name: "Autocertificazione stato di famiglia di ciascun erede",
    description: "Serve a individuare gli eredi: un modello per ciascuno, te lo diamo noi.",
    when: "Sempre",
  },
  {
    name: "Visure catastali",
    description: "Degli immobili in successione. Possiamo recuperarle noi.",
    when: "Se ci sono immobili",
  },
  {
    name: "Atti di provenienza",
    description: "Rogiti, donazioni o precedenti dichiarazioni di successione.",
    when: "Se ci sono immobili",
  },
  {
    name: "Testamento",
    description: "Copia del testamento pubblicato, se presente.",
    when: "Se c'è un testamento",
  },
  {
    name: "Certificazione di saldo dei conti",
    description: "Giacenza di conti, libretti e titoli alla data del decesso.",
    when: "Se ci sono conti/investimenti",
  },
];
