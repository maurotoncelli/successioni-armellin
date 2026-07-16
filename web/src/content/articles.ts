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

export const articles: Article[] = [
  {
    slug: "successione-cosa-e",
    title: "Successione: cos'è e quando va presentata",
    excerpt:
      "Una guida chiara per capire l'adempimento, chi deve farlo, i termini e cosa si rischia a non presentarla.",
    category: "Capire la successione",
    categorySlug: "basi",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
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
        text: "In alcuni casi la dichiarazione non è nemmeno obbligatoria. Lo spieghiamo nella guida dedicata all'esonero: verifichiamo gratis il tuo caso prima di farti pagare.",
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
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
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
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
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
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
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
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
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
          "Certificato o estratto di morte del defunto (o autocertificazione dove ammessa).",
          "Documento d'identità e codice fiscale del defunto e di tutti gli eredi.",
          "Autocertificazione dello stato di famiglia e del grado di parentela degli eredi.",
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
          "IBAN dell'erede per eventuali rimborsi o per l'addebito delle imposte.",
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
    title: "Eredi che vivono all'estero: come gestire la pratica",
    excerpt:
      "Cosa cambia quando uno degli eredi risiede fuori dall'Italia e come seguiamo la pratica a distanza, anche nella tua lingua.",
    category: "Eredi stranieri / dall'estero",
    categorySlug: "stranieri",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
    publishedAt: "2026-04-12",
    updatedAt: "2026-06-22",
    readingMinutes: 5,
    featured: false,
    body: [
      {
        type: "p",
        text: "Avere un erede che vive all'estero non è un problema: la dichiarazione di successione riguarda il patrimonio in Italia e si presenta comunque all'Agenzia delle Entrate. Cambia soprattutto il modo in cui raccogliamo documenti e firme, che gestiamo interamente a distanza.",
      },
      { type: "h2", text: "Cosa serve davvero" },
      {
        type: "ul",
        items: [
          "Il codice fiscale italiano di ogni erede (anche di chi vive all'estero): se manca, si può richiedere.",
          "I documenti d'identità e i dati anagrafici di tutti gli eredi.",
          "Un mandato o delega all'intermediario, dato che chi presenta la dichiarazione è un erede e noi la trasmettiamo per suo conto.",
        ],
      },
      {
        type: "p",
        text: "I residenti all'estero, in via eccezionale, possono presentare il modello cartaceo solo se impossibilitati alla trasmissione telematica; nella stragrande maggioranza dei casi procediamo noi in via telematica come intermediario abilitato.",
      },
      { type: "h2", text: "Tutto a distanza, anche nella tua lingua" },
      {
        type: "p",
        text: "Questionario, documenti, comunicazioni e firme avvengono online: non devi rientrare in Italia. Possiamo seguirti via email o messaggistica nella tua lingua e, dove serve, organizzare una chiamata con traduzione. I punti importanti (importi, scadenze, documenti) te li confermiamo sempre per iscritto; i documenti ufficiali restano in italiano.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Fuso orario e distanza non contano",
        text: "Carichi i documenti quando vuoi dalla tua area personale, anche da foto col telefono. Ci pensiamo noi a controllarli e a metterti in regola nei tempi.",
      },
    ],
    sources: [FONTE_ADE_SCHEDA],
    related: ["documenti-successione", "successione-cosa-e", "imposte-successione-2026"],
  },
  {
    slug: "fai-da-te-precompilata",
    title: "Successione precompilata: conviene il fai-da-te?",
    excerpt:
      "La dichiarazione gratuita sul sito dell'Agenzia esiste davvero. Vediamo quando ha senso e quando conviene delegare.",
    category: "Capire la successione",
    categorySlug: "basi",
    author: "Geom. Lorenzo Armellin",
    reviewedBy: "Rivisto sulla parte fiscale da commercialisti",
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
