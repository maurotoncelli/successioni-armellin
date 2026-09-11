/*
  Fixture locali del prototipo per gli ARTICOLI della sezione Guide (/guide).
  Nel modello reale (Fase 4) vivono nella tabella `articles` (title, slug,
  excerpt, body, category, author, reviewed_by, cover, locale, published_at):
  vedi blueprint/STRUTTURA_CONTENUTI_SITO.md (PAGINA Guide + TEMPLATE Articolo).
  Qui i testi sono [BOZZA] data-driven, allineati ai fatti fiscali di
  blueprint/RIFERIMENTO_Successioni_Modello_e_Normativa.md (YMYL @10).
  Le categorie usano gli slug definiti in content_entries (`guide.categorie`).
  In Fase 4 questo array verrà sostituito da letture Supabase con identica forma
  (l'accesso passa da @/lib/cms così i call-site non cambiano).
*/

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; tone?: "info" | "warning"; title?: string; text: string };

export type ArticleSource = { label: string; href: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  /** Nome leggibile della categoria (mostrato nelle card/badge). */
  category: string;
  /** Slug categoria: combacia con guide.categorie (basi, imposte, ...). */
  categorySlug: string;
  author: string;
  reviewedBy: string;
  /** ISO date (AAAA-MM-GG). */
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  /** In evidenza nell'hub (ordina in cima e marca la card). */
  featured: boolean;
  body: ArticleBlock[];
  sources: ArticleSource[];
  /** Slug di articoli correlati (interlink SEO @09). */
  related: string[];
};

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Dichiarazione di successione",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - Come pagare le imposte",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS D.Lgs. 346/1990",
  href: "https://www.normattiva.it",
};
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - Come e quando presentare la dichiarazione",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Richiesta codice fiscale (modello AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/codice-fiscale-e-tessera-sanitaria/modello-e-istruzioni-cittadini",
};
const FONTE_UE_650: ArticleSource = {
  label: "Regolamento (UE) n. 650/2012 sulle successioni transfrontaliere",
  href: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Regolamento (UE) 2016/1191 - Documenti pubblici senza legalizzazione",
  href: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "Ministero degli Esteri - Servizi consolari per gli italiani all'estero",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
};

export const articles: Article[] = [
  {
    slug: "successione-cosa-e",
    title: "Successione: cos'è e quando va presentata",
    excerpt:
      "Una guida chiara per capire l'adempimento, chi deve farlo, i termini e cosa si rischia a non presentarla.",
    category: "Capire la successione",
    categorySlug: "basi",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-01-15",
    updatedAt: "2026-06-22",
    readingMinutes: 6,
    featured: true,
    body: [
      {
        type: "p",
        text: "La dichiarazione di successione è l'adempimento fiscale con cui si comunica all'Agenzia delle Entrate il patrimonio lasciato dal defunto (il de cuius) e trasferito agli eredi. Non è l'accettazione dell'eredità e non è un atto notarile: serve a dichiarare l'attivo ereditario, a liquidare le imposte dovute e, quando ci sono immobili, ad aggiornare il Catasto con la voltura.",
      },
      { type: "h2", text: "Chi deve presentarla" },
      {
        type: "p",
        text: "Sono obbligati gli eredi, i chiamati all'eredità e i legatari (o i loro rappresentanti legali), oltre ad amministratori, curatori dell'eredità giacente, esecutori testamentari e trustee.",
      },
      {
        type: "ul",
        items: [
          "Basta che la presenti uno solo degli obbligati: la dichiarazione vale per tutti.",
          "Può essere trasmessa da un intermediario abilitato Entratel (come un geometra abilitato): è quello che facciamo noi.",
        ],
      },
      { type: "h2", text: "Entro quando va presentata" },
      {
        type: "p",
        text: "Il termine ordinario è di 12 mesi dalla data di apertura della successione, che di norma coincide con la data del decesso (art. 31 TUS). In casi particolari (eredità giacente, accettazione con beneficio d'inventario, nomina di un curatore) il termine parte da quando il soggetto è legalmente in grado di agire.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Attenzione ai tempi",
        text: "Presentarla in ritardo può comportare sanzioni e interessi. Se la scadenza dei 12 mesi è vicina, è meglio muoversi subito: ce ne occupiamo noi nei tempi corretti.",
      },
      { type: "h2", text: "Come si presenta oggi" },
      {
        type: "p",
        text: "La dichiarazione si trasmette in via telematica con il software dell'Agenzia delle Entrate. Il file prodotto (con estensione .SUC) viene inviato direttamente dal contribuente abilitato oppure, più spesso, da un intermediario abilitato Entratel. Il vecchio Modello 4 cartaceo resta solo per i casi residui (decessi prima del 3 ottobre 2006 o residenti all'estero impossibilitati alla trasmissione telematica).",
      },
      { type: "h2", text: "Cosa rischi se non la fai (o la sbagli)" },
      {
        type: "p",
        text: "L'omessa presentazione comporta una sanzione commisurata all'imposta dovuta, oltre agli interessi; la presentazione tardiva o infedele comporta sanzioni ridotte o proporzionali a seconda dei casi. Gli importi cambiano nel tempo: vanno verificati sulle fonti ufficiali e con il professionista.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Non sempre è dovuta",
        text: "In alcuni casi la dichiarazione non è nemmeno obbligatoria. Lo spieghiamo nella guida dedicata all'esonero: verifichiamo gratis il tuo caso.",
      },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
    related: ["quando-non-obbligatoria", "documenti-successione", "imposte-successione-2026"],
  },
  {
    slug: "quando-non-obbligatoria",
    title: "Quando NON sei obbligato a fare la successione",
    excerpt:
      "L'esonero previsto dalla legge: le tre condizioni che devono valere insieme e perché basta un immobile a far scattare l'obbligo.",
    category: "Capire la successione",
    categorySlug: "basi",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-02-03",
    updatedAt: "2026-06-22",
    readingMinutes: 4,
    featured: false,
    body: [
      {
        type: "p",
        text: "Non sempre la dichiarazione di successione è obbligatoria. La legge (art. 28, c. 7 del TUS) prevede un esonero quando ricorrono CONTEMPORANEAMENTE tre condizioni. Se anche una sola manca, l'obbligo torna a esistere.",
      },
      { type: "h2", text: "Le tre condizioni dell'esonero" },
      {
        type: "ol",
        items: [
          "L'eredità è devoluta al coniuge e/o ai parenti in linea retta (figli, genitori).",
          "L'attivo ereditario ha un valore non superiore a 100.000 euro.",
          "L'eredità non comprende beni immobili o diritti reali immobiliari.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Basta un immobile",
        text: "Anche un solo immobile, pure di valore minimo, fa scattare l'obbligo a prescindere dal valore complessivo. La presenza di una casa, un terreno o un box cambia tutto.",
      },
      { type: "h2", text: "Altri casi di non obbligo" },
      {
        type: "p",
        text: "Esistono ulteriori ipotesi di esonero o non obbligo, ad esempio la rinuncia all'eredità effettuata prima della scadenza dei 12 mesi (art. 28, c. 5). Le condizioni possono anche venire meno per sopravvenienze: per questo la valutazione è sempre sul caso concreto.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Te lo diciamo gratis",
        text: "Se dal tuo caso risulta che la successione potrebbe non essere dovuta, non ti vendiamo un servizio inutile: te lo diciamo. La verifica definitiva resta sul caso concreto.",
      },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
    related: ["successione-cosa-e", "imposte-successione-2026", "documenti-successione"],
  },
  {
    slug: "imposte-successione-2026",
    title: "Quanto si paga di imposte di successione",
    excerpt:
      "Franchigie, aliquote e autoliquidazione 2025: come funzionano le imposte, chi le paga e perché spesso per gli eredi diretti sono zero.",
    category: "Imposte e costi",
    categorySlug: "imposte",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-02-20",
    updatedAt: "2026-06-22",
    readingMinutes: 7,
    featured: true,
    body: [
      {
        type: "p",
        text: "Una premessa importante: il prezzo del nostro servizio (l'onorario) è una cosa, le imposte sono un'altra. Le imposte sono a carico dell'erede, separate dall'onorario, e te le calcoliamo e comunichiamo PRIMA dell'invio.",
      },
      { type: "h2", text: "Imposta di successione: aliquote e franchigie" },
      {
        type: "p",
        text: "L'imposta di successione si applica solo sul valore che eccede la franchigia, che dipende dal grado di parentela con il defunto.",
      },
      {
        type: "table",
        headers: ["Beneficiario", "Aliquota", "Franchigia (per beneficiario)"],
        rows: [
          ["Coniuge e parenti in linea retta (figli, genitori)", "4%", "1.000.000 EUR"],
          ["Fratelli e sorelle", "6%", "100.000 EUR"],
          ["Altri parenti fino al 4 grado e affini (entro i limiti di legge)", "6%", "nessuna"],
          ["Altri soggetti (estranei)", "8%", "nessuna"],
          ["Persone con disabilità grave (L. 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Per gli eredi diretti spesso è zero",
        text: "Con coniuge e figli la franchigia è di 1.000.000 di euro a testa: per questo, nella maggior parte delle successioni familiari, l'imposta di successione vera e propria è pari a zero.",
      },
      { type: "h2", text: "Imposte ipotecaria e catastale (solo con immobili)" },
      {
        type: "p",
        text: "Quando ci sono immobili si pagano l'imposta ipotecaria (2% del valore catastale, minimo 200 euro) e l'imposta catastale (1% del valore catastale, minimo 200 euro). Con l'agevolazione prima casa in capo a un erede, entrambe scendono alla misura fissa di 200 euro ciascuna. Si aggiungono bollo, tassa ipotecaria e tributi speciali catastali in misura fissa.",
      },
      { type: "h2", text: "Autoliquidazione 2025: cosa è cambiato" },
      {
        type: "p",
        text: "Per le successioni aperte dal 1 gennaio 2025, l'imposta di successione è autoliquidata dal contribuente direttamente in dichiarazione (non più liquidata d'ufficio). Il versamento va fatto entro 90 giorni dal termine di presentazione, con F24.",
      },
      {
        type: "ul",
        items: [
          "Rateazione ammessa se l'importo è almeno 1.000 euro: acconto minimo del 20% e saldo in 8 rate trimestrali (fino a 12 rate oltre i 20.000 euro), con interessi.",
          "Per le successioni aperte prima del 2025 resta la liquidazione d'ufficio con avviso e pagamento entro 60 giorni dalla notifica.",
        ],
      },
      { type: "h2", text: "Un esempio concreto (caso reale anonimo)" },
      {
        type: "p",
        text: "Famiglia con coniuge e 2 figli, asse ereditario di circa 117.000 euro (immobili, titoli e liquidità), con una prima casa e voltura catastale. Le imposte totali sono state circa 1.200 euro (ipotecaria, catastale, bollo e tributi), mentre l'imposta di successione è stata pari a zero perché gli eredi diretti erano ampiamente sotto la franchigia. L'onorario del servizio è separato.",
      },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
    related: ["agevolazione-prima-casa", "successione-cosa-e", "fai-da-te-precompilata"],
  },
  {
    slug: "agevolazione-prima-casa",
    title: "Agevolazione prima casa in successione: come funziona",
    excerpt:
      "Quando spettano le imposte fisse al posto delle percentuali, chi può chiederla e cosa serve per non perdere il beneficio.",
    category: "Imposte e costi",
    categorySlug: "imposte",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-03-10",
    updatedAt: "2026-06-22",
    readingMinutes: 5,
    featured: false,
    body: [
      {
        type: "p",
        text: "Quando in una successione c'è un immobile che può beneficiare dell'agevolazione prima casa in capo ad almeno un erede, le imposte ipotecaria e catastale non si pagano in percentuale ma in misura fissa: 200 euro ciascuna, invece del 2% e dell'1% del valore catastale. Su immobili di un certo valore il risparmio è significativo.",
      },
      { type: "h2", text: "A chi può spettare" },
      {
        type: "p",
        text: "Il beneficio richiede che almeno un erede possieda i requisiti previsti dalla legge per la prima casa (in sintesi: non essere titolare di altri diritti su immobili nello stesso Comune e non avere già goduto dell'agevolazione altrove, con la residenza nel Comune dell'immobile entro i termini di legge). Basta che i requisiti li abbia uno solo degli eredi perché l'agevolazione si applichi sull'immobile.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "I requisiti vanno verificati",
        text: "L'agevolazione si dichiara nel quadro EH del modello e va barrata correttamente. Se i requisiti non ci sono o decadono, il beneficio si perde con recupero di imposte e sanzioni: meglio una verifica tecnica prima.",
      },
      { type: "h2", text: "Cosa controlliamo noi" },
      {
        type: "p",
        text: "Da geometri, la nostra parte è proprio la verifica catastale: particelle, subalterni, categoria, rendita e atti di provenienza. Controlliamo che i dati siano corretti e che la prima casa sia dichiarata nel modo giusto, così l'agevolazione regge e non arrivano sorprese.",
      },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
    related: ["imposte-successione-2026", "documenti-successione", "successione-cosa-e"],
  },
  {
    slug: "documenti-successione",
    title: "I documenti per la successione: la lista completa",
    excerpt:
      "Tutti i documenti tipici e come recuperarli, caso per caso. Non tutti servono sempre: dipende dalla tua situazione.",
    category: "Documenti",
    categorySlug: "documenti",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-03-25",
    updatedAt: "2026-06-22",
    readingMinutes: 6,
    featured: false,
    body: [
      {
        type: "p",
        text: "I documenti per la dichiarazione di successione variano in base al caso: non servono mai tutti insieme. Di seguito i più comuni, divisi per situazione. Se ti manca qualcosa, spesso lo possiamo recuperare noi (visure, atti di provenienza, dati mancanti).",
      },
      { type: "h2", text: "Documenti sempre necessari" },
      {
        type: "ul",
        items: [
          "Certificato o estratto di morte del defunto.",
          "Documento d'identità del defunto e degli eredi; codice fiscale degli eredi.",
          "Autocertificazione dello stato di famiglia e del grado di parentela degli eredi.",
          "IBAN dell'erede (serve sempre, per rimborsi o per l'addebito delle imposte).",
        ],
      },
      { type: "h2", text: "Se ci sono immobili" },
      {
        type: "ul",
        items: [
          "Visure catastali degli immobili in successione (possiamo recuperarle noi).",
          "Atti di provenienza: rogiti, donazioni o precedenti dichiarazioni di successione.",
          "Planimetrie, dove necessarie per la verifica catastale.",
        ],
      },
      { type: "h2", text: "Se c'è un testamento o eredi particolari" },
      {
        type: "ul",
        items: [
          "Copia del testamento pubblicato ed eventuale verbale di pubblicazione.",
          "Autorizzazione del Giudice Tutelare in presenza di eredi minorenni o incapaci.",
        ],
      },
      { type: "h2", text: "Se ci sono conti e investimenti" },
      {
        type: "ul",
        items: [
          "Certificazione di saldo e giacenza di conti, libretti e titoli alla data del decesso.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Ti manca qualcosa? Spesso lo possiamo recuperare noi",
        text: "Il recupero documentale è parte del nostro lavoro: visure catastali, atti di provenienza e dati mancanti li reperiamo noi presso enti e banche.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Lista indicativa",
        text: "Questa lista è indicativa e si adatta al tuo caso. La lista definitiva la conferma Lorenzo dopo aver verificato la tua situazione concreta.",
      },
    ],
    sources: [FONTE_ADE_SCHEDA],
    related: ["successione-cosa-e", "quando-non-obbligatoria", "imposte-successione-2026"],
  },
  {
    slug: "eredi-estero",
    title: "Successione in Italia se vivi all'estero: la guida completa",
    excerpt:
      "Hai ereditato una casa o un conto in Italia ma vivi in Germania, Svizzera, Regno Unito, Argentina o altrove? Cosa cambia davvero, cosa serve e come si fa tutto a distanza, senza rientrare.",
    category: "Eredi stranieri / dall'estero",
    categorySlug: "stranieri",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-04-12",
    updatedAt: "2026-09-11",
    readingMinutes: 8,
    featured: true,
    body: [
      {
        type: "p",
        text: "Se vivi all'estero e in Italia è rimasta la casa dei genitori, un terreno o un conto, la dichiarazione di successione va presentata comunque in Italia, entro 12 mesi dal decesso. Non serve rientrare: la dichiarazione è telematica e la trasmette un intermediario abilitato, cioè noi. Il nostro servizio è nato online proprio per chi non può passare in ufficio, e chi vive all'estero è il caso in cui questo conta di più.",
      },
      { type: "h2", text: "I due casi tipici" },
      {
        type: "ul",
        items: [
          "Il defunto viveva in Italia e uno o più eredi vivono all'estero: la pratica è quella ordinaria, cambia solo il modo di raccogliere documenti e firme.",
          "Il defunto viveva all'estero e aveva beni in Italia: la dichiarazione va fatta lo stesso in Italia, con qualche regola in più su ufficio competente, imposte e legge applicabile. Ne parliamo in una guida dedicata.",
        ],
      },
      { type: "h2", text: "Cosa cambia rispetto a chi vive in Italia" },
      {
        type: "ul",
        items: [
          "Codice fiscale: ogni erede deve averne uno, anche se non ha mai vissuto in Italia. Senza, la dichiarazione non si trasmette. Si può ottenere al consolato o, più in fretta, in Italia con una delega a noi.",
          "Documenti stranieri: un certificato di morte o un testamento rilasciati all'estero possono richiedere apostille o legalizzazione e una traduzione. Dentro l'Unione europea le regole sono più semplici.",
          "Firme: la dichiarazione la trasmettiamo noi con il tuo incarico firmato a distanza. Non serve una procura notarile per la sola dichiarazione.",
          "Pagamento delle imposte: si paga con addebito su un conto italiano. Se non ne hai uno, ci sono soluzioni, compreso l'addebito sul conto dello studio come intermediario.",
          "Fuso orario e lingua: lavoriamo per iscritto, su WhatsApp ed email, così rispondi quando puoi. Se preferisci un'altra lingua, il sito e le comunicazioni sono disponibili in più lingue.",
        ],
      },
      { type: "h2", text: "Come funziona, in cinque passaggi" },
      {
        type: "ol",
        items: [
          "Compili il questionario online: due minuti, e sai subito quale pacchetto ti serve e quanto costa.",
          "Ci scrivi su WhatsApp o paghi direttamente. Ti apriamo l'area personale con la lista dei documenti per il tuo caso.",
          "Carichi i documenti quando vuoi, anche come foto dal telefono. Noi controlliamo dati catastali, atti di provenienza e codici fiscali; se manca qualcosa, spesso lo recuperiamo noi in Italia.",
          "Ti confermiamo per iscritto imposte e importi, poi firmi l'incarico a distanza e trasmettiamo la dichiarazione all'Agenzia delle Entrate.",
          "Ricevi la ricevuta di presentazione e, se ci sono immobili, la voltura catastale. Tutto resta nella tua area personale.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Non devi rientrare in Italia",
        text: "Nessun passaggio della dichiarazione di successione richiede la tua presenza fisica. Le cose che in Italia si fanno allo sportello, come richiedere un codice fiscale o una visura, le facciamo noi con la tua delega.",
      },
      { type: "h2", text: "Cosa facciamo noi, in concreto" },
      {
        type: "ul",
        items: [
          "Richiediamo il codice fiscale degli eredi che non lo hanno, con delega, presso l'Agenzia delle Entrate.",
          "Verifichiamo gli immobili al Catasto e negli atti: è il punto in cui le pratiche fatte da lontano si inceppano più spesso.",
          "Prepariamo e trasmettiamo la dichiarazione e la voltura catastale come intermediario abilitato.",
          "Se non hai un conto in Italia, concordiamo il pagamento delle imposte tramite lo studio, con importi e ricevute per iscritto.",
          "Ti diciamo con chiarezza se per qualche passaggio serve un notaio o il consolato, e quale.",
        ],
      },
      { type: "h2", text: "Quando serve anche un notaio o il consolato" },
      {
        type: "p",
        text: "La dichiarazione di successione non è un atto notarile e non lo richiede. Servono invece un notaio, o il consolato italiano che per i cittadini italiani svolge alcune funzioni notarili, per rinunciare all'eredità, per accettarla con beneficio d'inventario, per pubblicare un testamento e per vendere l'immobile ereditato. Se dai documenti emerge che il tuo caso li richiede, te lo segnaliamo e ti indichiamo a chi rivolgerti.",
      },
      { type: "h2", text: "Quanto costa" },
      {
        type: "p",
        text: "I pacchetti sono gli stessi di chi vive in Italia e li vedi nella pagina Tariffe: l'onorario include il geometra, la dichiarazione e la voltura. Le imposte di legge sono a parte per chiunque e te le comunichiamo prima della trasmissione. Se il tuo caso richiede passaggi in più, come il codice fiscale o una traduzione, te lo diciamo subito, con la cifra.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "I 12 mesi valgono anche per chi vive all'estero",
        text: "Il termine decorre dalla data del decesso, non da quando riesci a occuparti della pratica. Se è vicino, scrivici subito: la parte più lunga, per chi vive all'estero, è spesso il codice fiscale.",
      },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
    related: [
      "codice-fiscale-erede-estero",
      "successione-defunto-residente-estero",
      "documenti-esteri-successione-apostille",
      "pagare-imposte-successione-dall-estero",
      "documenti-successione",
    ],
  },
  {
    slug: "codice-fiscale-erede-estero",
    title: "Codice fiscale per un erede che vive all'estero: come ottenerlo",
    excerpt:
      "Senza il codice fiscale di ogni erede la dichiarazione non si trasmette. Chi ce l'ha già senza saperlo, come richiederlo al consolato o in Italia con delega, cosa serve.",
    category: "Eredi stranieri / dall'estero",
    categorySlug: "stranieri",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    readingMinutes: 4,
    featured: false,
    body: [
      {
        type: "p",
        text: "Il codice fiscale italiano è il dato che blocca più spesso le successioni con eredi all'estero: la dichiarazione telematica richiede quello di ogni erede e di ogni legatario, e senza non si trasmette. La buona notizia è che ottenerlo è più semplice di quanto sembri, e non richiede di venire in Italia.",
      },
      { type: "h2", text: "Forse lo hai già" },
      {
        type: "p",
        text: "Chi è nato in Italia, ha lavorato o studiato in Italia, ha una tessera sanitaria vecchia o è iscritto all'AIRE spesso ha già un codice fiscale, anche se non lo usa da anni. Controlla vecchi documenti, la tessera sanitaria o una dichiarazione dei redditi. Se non lo trovi, con i tuoi dati anagrafici possiamo verificare noi se esiste già: un codice fiscale non si richiede due volte.",
      },
      { type: "h2", text: "Come si ottiene se manca" },
      {
        type: "ol",
        items: [
          "Al consolato italiano del Paese in cui vivi: è la via ordinaria per i cittadini residenti all'estero. Si presenta il modello AA4/8 con un documento valido. I tempi dipendono dal consolato e possono essere lunghi.",
          "In Italia, presso qualunque ufficio dell'Agenzia delle Entrate, tramite una persona delegata: il modello AA4/8 va firmato da te, con la parte della delega compilata, e il delegato lo presenta con il proprio documento e la copia del tuo. È la via che usiamo noi, perché è di solito la più rapida.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Lo facciamo noi con la tua delega",
        text: "Ti mandiamo il modello precompilato, lo firmi e ce lo restituisci con la copia del documento. Lo presentiamo noi all'Agenzia delle Entrate e ti comunichiamo il codice fiscale appena attribuito.",
      },
      { type: "h2", text: "Cosa serve" },
      {
        type: "ul",
        items: [
          "Passaporto o carta d'identità in corso di validità (copia leggibile, fronte e retro).",
          "Dati anagrafici completi: cognome, nome, sesso, data e luogo di nascita, indirizzo di residenza all'estero.",
          "Il motivo della richiesta: la successione in Italia. Va indicato nel modello.",
          "Il modello AA4/8 firmato, con la delega compilata se lo presentiamo noi.",
        ],
      },
      { type: "h2", text: "Eredi che non sono cittadini italiani" },
      {
        type: "p",
        text: "Vale la stessa procedura: il modello AA4/8 si può presentare a qualunque ufficio dell'Agenzia delle Entrate tramite delegato, con una richiesta motivata. Per i cittadini stranieri il consolato italiano interviene solo in casi particolari, quindi la delega in Italia è quasi sempre la strada più semplice.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Parti da qui, se il termine è vicino",
        text: "Il codice fiscale è il passaggio con i tempi meno prevedibili di tutta la pratica. Se il decesso è avvenuto diversi mesi fa, chiedilo subito: il resto della dichiarazione si prepara in parallelo.",
      },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
    related: ["eredi-estero", "documenti-esteri-successione-apostille", "documenti-successione"],
  },
  {
    slug: "successione-defunto-residente-estero",
    title: "Il defunto viveva all'estero e aveva beni in Italia: cosa fare",
    excerpt:
      "Dichiarazione in Italia anche se il decesso è avvenuto all'estero: quale ufficio, su quali beni si pagano le imposte, cosa dice il regolamento europeo sulle successioni e quando serve un notaio.",
    category: "Eredi stranieri / dall'estero",
    categorySlug: "stranieri",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    readingMinutes: 6,
    featured: false,
    body: [
      {
        type: "p",
        text: "È il caso classico di tante famiglie emigrate: il genitore viveva da anni in Germania, in Svizzera o in Argentina, ma in Italia ha lasciato la casa del paese o un appartamento affittato. Se ci sono beni in Italia, la dichiarazione di successione va presentata in Italia, entro 12 mesi dal decesso, anche se il decesso è avvenuto all'estero e anche se tutti gli eredi vivono fuori.",
      },
      { type: "h2", text: "Su quali beni si pagano le imposte" },
      {
        type: "p",
        text: "La regola è nel Testo unico sulle successioni (art. 2). Se il defunto era residente in Italia al momento del decesso, l'imposta riguarda tutti i beni, ovunque si trovino. Se invece non era residente in Italia, l'imposta riguarda solo i beni che si trovano in Italia: immobili, conti presso banche italiane, partecipazioni in società italiane. I beni all'estero seguono le regole del Paese in cui si trovano.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Doppia imposizione",
        text: "L'Italia ha convenzioni contro le doppie imposizioni in materia di successioni con pochi Paesi, tra cui Francia, Regno Unito e Stati Uniti. Per il resto, quello che paghi in Italia sui beni italiani va coordinato con la dichiarazione nel Paese di residenza: su questo vale la pena sentire un consulente locale.",
      },
      { type: "h2", text: "A quale ufficio si presenta" },
      {
        type: "p",
        text: "Se il defunto aveva avuto una residenza in Italia prima di trasferirsi, l'ufficio competente è quello dell'Agenzia delle Entrate dell'ultima residenza italiana. Se non è mai stato residente in Italia o l'ultima residenza non è nota, la competenza è di un ufficio di Roma indicato dall'Agenzia. Con la dichiarazione telematica questo dettaglio lo gestiamo noi in fase di compilazione.",
      },
      { type: "h2", text: "Come si presenta" },
      {
        type: "p",
        text: "In via telematica tramite un intermediario abilitato, esattamente come per chi vive in Italia: raccogliamo documenti e firme a distanza e trasmettiamo noi. La legge consente ai residenti all'estero, solo se impossibilitati alla trasmissione telematica, di spedire il modello cartaceo con raccomandata: è un'eccezione che nella pratica non serve quasi mai.",
      },
      { type: "h2", text: "Chi eredita: la legge applicabile" },
      {
        type: "p",
        text: "La parte fiscale e la parte civile sono due cose diverse. Chi sono gli eredi e in quali quote lo stabilisce la legge applicabile alla successione. Nell'Unione europea vale il regolamento 650/2012: per i decessi dal 17 agosto 2015 si applica la legge del Paese in cui il defunto aveva la residenza abituale, a meno che nel testamento avesse scelto la legge del Paese di cittadinanza. Quindi un italiano residente in Germania senza testamento eredita secondo la legge tedesca, anche per la casa in Italia. Regno Unito, Irlanda e Danimarca non applicano il regolamento; per i Paesi fuori dall'Unione valgono le norme italiane di diritto internazionale privato.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Dove finisce il nostro lavoro",
        text: "Noi prepariamo e trasmettiamo la dichiarazione e la voltura sui beni in Italia. Se la successione è regolata da una legge straniera, se c'è un testamento estero da far valere o un certificato successorio europeo da ottenere, serve anche un notaio o un avvocato: appena emerge dai documenti te lo segnaliamo e ti indichiamo i passaggi.",
      },
      { type: "h2", text: "I documenti in più" },
      {
        type: "ul",
        items: [
          "Certificato di morte rilasciato all'estero: se il defunto era cittadino italiano, l'atto va trascritto nel comune italiano tramite il consolato, e da lì si ottiene un certificato italiano. Altrimenti serve il certificato estero con apostille o legalizzazione e traduzione, salvo le semplificazioni europee.",
          "Prova della residenza all'estero del defunto, ad esempio l'iscrizione AIRE o un certificato di residenza del Paese estero.",
          "Codice fiscale del defunto e di tutti gli eredi: anche gli eredi non italiani devono averlo.",
          "Testamento, se c'è, con eventuale pubblicazione o certificato successorio europeo.",
        ],
      },
      { type: "h2", text: "Agevolazione prima casa" },
      {
        type: "p",
        text: "Le imposte ipotecaria e catastale sull'immobile ereditato possono ridursi con l'agevolazione prima casa, ma per chi vive all'estero le regole sono specifiche e sono cambiate nel 2023: dipendono da dove si trova l'immobile e dal legame con l'Italia di chi eredita. La verifichiamo caso per caso prima di calcolare le imposte.",
      },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
    related: [
      "eredi-estero",
      "documenti-esteri-successione-apostille",
      "pagare-imposte-successione-dall-estero",
    ],
  },
  {
    slug: "documenti-esteri-successione-apostille",
    title: "Documenti dall'estero: apostille, traduzioni e firme a distanza",
    excerpt:
      "Certificato di morte estero, testamento straniero, documenti d'identità non italiani: quando servono apostille, legalizzazione o traduzione giurata, e come si firma tutto senza venire in Italia.",
    category: "Eredi stranieri / dall'estero",
    categorySlug: "stranieri",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    readingMinutes: 6,
    featured: false,
    body: [
      {
        type: "p",
        text: "In una successione con eredi o defunto all'estero, quasi tutti i documenti sono gli stessi di una pratica italiana. Quelli che possono arrivare da un altro Paese sono pochi ma delicati: il certificato di morte se il decesso è avvenuto all'estero, un testamento straniero, i documenti d'identità degli eredi e, in qualche caso, certificati di stato civile. Vediamo cosa serve davvero perché l'Agenzia delle Entrate e il Catasto li accettino.",
      },
      { type: "h2", text: "Tre regole a seconda del Paese" },
      {
        type: "table",
        headers: ["Paese di rilascio", "Legalizzazione", "Traduzione"],
        rows: [
          [
            "Unione europea",
            "Non serve: il regolamento 2016/1191 elimina apostille e legalizzazione per i certificati di stato civile",
            "Si può evitare chiedendo il modulo standard multilingue insieme al certificato",
          ],
          [
            "Paesi della Convenzione dell'Aja del 1961 (es. Regno Unito, Stati Uniti, Svizzera, Argentina, Brasile, Australia)",
            "Apostille, apposta dall'autorità del Paese che ha rilasciato il documento",
            "Traduzione giurata in Italia o certificata dal consolato italiano",
          ],
          [
            "Altri Paesi",
            "Legalizzazione presso il consolato italiano nel Paese di rilascio",
            "Traduzione giurata in Italia o certificata dal consolato italiano",
          ],
        ],
      },
      { type: "h2", text: "Il certificato di morte" },
      {
        type: "p",
        text: "Se il defunto era cittadino italiano e il decesso è avvenuto all'estero, la strada più semplice è far trascrivere l'atto di morte nel comune italiano tramite il consolato: da quel momento il certificato lo rilascia il comune, in italiano, e non servono né apostille né traduzione. Se il defunto non era italiano, si usa il certificato estero con le regole della tabella.",
      },
      { type: "h2", text: "Il testamento straniero" },
      {
        type: "p",
        text: "Un testamento redatto all'estero va di norma pubblicato o fatto valere in Italia tramite un notaio, con traduzione giurata e, se serve, legalizzazione. È uno dei pochi passaggi in cui serve un professionista diverso da noi: te lo indichiamo e coordiniamo la dichiarazione con i suoi tempi.",
      },
      { type: "h2", text: "Documenti d'identità non italiani" },
      {
        type: "p",
        text: "Un passaporto o una carta d'identità stranieri in corso di validità vanno bene per la dichiarazione di successione e per la richiesta del codice fiscale. Serve una copia leggibile, fronte e retro; nessuna traduzione.",
      },
      { type: "h2", text: "Le firme: cosa serve e cosa no" },
      {
        type: "ul",
        items: [
          "Per la dichiarazione di successione e la voltura non serve una procura notarile: la trasmettiamo noi come intermediario, con il tuo incarico firmato a distanza nell'area personale o restituito firmato con copia del documento.",
          "Per il codice fiscale basta la delega inclusa nel modello AA4/8, firmata da te.",
          "Servono invece un notaio o il consolato italiano, che per i cittadini italiani svolge funzioni notarili, per rinunciare all'eredità, per accettarla con beneficio d'inventario e per firmare una procura a vendere l'immobile.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Prima le foto, poi gli originali",
        text: "Per i controlli iniziali bastano foto o scansioni caricate nell'area personale. Gli originali, o le copie con apostille e traduzione, li chiediamo solo per i documenti che li richiedono davvero, e te lo diciamo prima.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Attenzione ai tempi di apostille e traduzioni",
        text: "Tra richiesta del certificato, apostille e traduzione giurata possono passare settimane. Se il termine dei 12 mesi è vicino, parti da questi documenti mentre noi prepariamo il resto.",
      },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
    related: [
      "eredi-estero",
      "codice-fiscale-erede-estero",
      "successione-defunto-residente-estero",
      "documenti-successione",
    ],
  },
  {
    slug: "pagare-imposte-successione-dall-estero",
    title: "Pagare le imposte di successione dall'estero, senza un conto italiano",
    excerpt:
      "Le imposte si versano con addebito su un conto italiano. Se vivi all'estero e non ne hai uno, ecco le tre soluzioni possibili, compreso il pagamento tramite lo studio come intermediario.",
    category: "Eredi stranieri / dall'estero",
    categorySlug: "stranieri",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    readingMinutes: 5,
    featured: false,
    body: [
      {
        type: "p",
        text: "Per chi vive all'estero il pagamento delle imposte è spesso l'ostacolo pratico più fastidioso: le somme dovute con la dichiarazione telematica si versano con addebito su un conto corrente italiano, e molti emigrati un conto in Italia non lo hanno più. Vediamo quali imposte si pagano, come, e le soluzioni quando il conto italiano manca.",
      },
      { type: "h2", text: "Quali imposte si pagano" },
      {
        type: "ul",
        items: [
          "Con la dichiarazione, se ci sono immobili: imposta ipotecaria (2%) e catastale (1%) sul valore catastale, con un minimo di 200 euro ciascuna, più imposta di bollo e tributi speciali. Si autoliquidano e si versano al momento della trasmissione.",
          "L'imposta di successione vera e propria solo se il patrimonio supera le franchigie: 1 milione di euro per ciascun figlio o per il coniuge (aliquota 4%), 100.000 euro per fratelli e sorelle (6%), nessuna franchigia per gli altri (6% o 8%). Per le successioni aperte dal 2025 la calcola il contribuente in dichiarazione e si versa entro 90 giorni dal termine di presentazione, oppure subito insieme al resto.",
        ],
      },
      { type: "h2", text: "Come si paga con la dichiarazione telematica" },
      {
        type: "p",
        text: "Le somme autoliquidate si pagano con addebito su un conto corrente aperto presso una banca convenzionata con l'Agenzia delle Entrate o presso Poste Italiane. Il conto può essere intestato al dichiarante oppure al soggetto incaricato della trasmissione telematica, cioè all'intermediario. Nella dichiarazione si indicano l'IBAN e il codice fiscale del titolare del conto.",
      },
      { type: "h2", text: "Se non hai un conto in Italia: tre soluzioni" },
      {
        type: "ol",
        items: [
          "Un coerede residente in Italia paga per tutti: la dichiarazione può indicare il conto di uno degli eredi. È la soluzione più semplice quando esiste.",
          "Paga lo studio come intermediario: ci fai un bonifico anticipato per l'importo esatto delle imposte, che ti comunichiamo per iscritto, e noi le versiamo con addebito sul conto dello studio al momento della trasmissione. Ricevi le quietanze. È una possibilità che concordiamo caso per caso.",
          "Modello F24 in Italia tramite un delegato: possibile quando la dichiarazione viene presentata in ufficio, ma è la strada più lenta e la usiamo solo se le prime due non sono praticabili.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Tutto per iscritto, prima",
        text: "Prima della trasmissione ti inviamo il conteggio delle imposte voce per voce. Paghi solo quella cifra, e solo dopo averla vista. Le imposte vanno allo Stato, non a noi: l'onorario del pacchetto è separato.",
      },
      { type: "h2", text: "Bonifici dall'estero e cambio" },
      {
        type: "p",
        text: "Le imposte sono in euro. Se il tuo conto è in un'altra valuta, considera le commissioni e il cambio della tua banca: i bonifici SEPA dai Paesi dell'area euro e dalla Svizzera costano poco, da altri Paesi è meglio verificare prima. L'onorario del pacchetto, invece, si paga sul sito con carta tramite Stripe, da qualunque Paese.",
      },
      { type: "h2", text: "Successioni aperte prima del 2025" },
      {
        type: "p",
        text: "Per i decessi fino al 31 dicembre 2024 l'imposta di successione, se dovuta, la calcola ancora l'Agenzia delle Entrate e arriva un avviso di liquidazione da pagare con F24 entro 60 giorni. Anche in questo caso, se non hai un conto italiano, possiamo gestire il versamento tramite lo studio.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Gli importi cambiano",
        text: "Aliquote, franchigie e minimi sono quelli in vigore alla data di questa guida. Verifichiamo sempre sul caso concreto e sulle fonti ufficiali prima di calcolare le imposte.",
      },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
    related: [
      "eredi-estero",
      "imposte-successione-2026",
      "successione-defunto-residente-estero",
    ],
  },
  {
    slug: "fai-da-te-precompilata",
    title: "Successione precompilata: conviene il fai-da-te?",
    excerpt:
      "La dichiarazione gratuita sul sito dell'Agenzia esiste davvero. Vediamo quando ha senso e quando conviene delegare.",
    category: "Capire la successione",
    categorySlug: "basi",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "",
    publishedAt: "2026-05-05",
    updatedAt: "2026-06-22",
    readingMinutes: 5,
    featured: false,
    body: [
      {
        type: "p",
        text: "Diciamolo subito, con onestà: si può fare la dichiarazione di successione gratis da soli. L'Agenzia delle Entrate mette a disposizione una procedura web guidata per i casi più semplici e il software ufficiale per quelli più articolati. È un'opzione legittima.",
      },
      { type: "h2", text: "Quando il fai-da-te può bastare" },
      {
        type: "p",
        text: "Se il caso è davvero lineare (pochi eredi diretti, nessun immobile o un solo immobile semplice, dati catastali già chiari e corretti) e hai dimestichezza con SPID e procedure online, la precompilata può essere sufficiente.",
      },
      { type: "h2", text: "Dove il fai-da-te diventa rischioso" },
      {
        type: "table",
        headers: ["Aspetto", "Fai-da-te", "Con noi"],
        rows: [
          ["Tempo da investire", "Ore e SPID a carico tuo", "Ce ne occupiamo noi"],
          ["Controllo dei dati catastali", "A carico tuo", "Lo fa un geometra"],
          ["Calcolo delle imposte", "Da solo", "Lo facciamo noi, prima dell'invio"],
          ["Assistenza", "Nessuna", "Una persona reale"],
          ["Rischio sanzioni per errori", "Tuo", "Gestito"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Il punto debole sono i dati catastali",
        text: "La precompilata non valida i dati catastali: è proprio lì che la maggior parte delle pratiche si blocca o sbaglia. Particelle, subalterni, annessi e atti di provenienza vanno verificati, ed è il mestiere del geometra.",
      },
      {
        type: "p",
        text: "In sintesi: se il tuo caso è semplice e ti senti sicuro, il fai-da-te è onesto. Se ci sono immobili, dubbi o poco tempo, delegare ti toglie il rischio di errori e sanzioni. In ogni caso, verifichiamo gratis la tua situazione prima di farti decidere.",
      },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
    related: ["successione-cosa-e", "imposte-successione-2026", "documenti-successione"],
  },
];
