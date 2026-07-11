import type { ArticleBlock } from "@/content/articles";

/*
  Documenti legali del sito (data-driven, long-form strutturato).

  Perche qui e non in content_entries.*.json:
  - sono testi lunghi e strutturati (sezioni, liste, tabelle), come gli articoli
    guida (@/content/articles): tenerli tipizzati evita HTML arbitrario e li
    rende coerenti col design system anche quando arriveranno dal CMS (Fase 4).

  Identita del Titolare: NON e duplicata qui. I testi usano dei token
  ({{ragione_sociale}}, {{piva}}, {{cf}}, {{pec}}, ...) che vengono sostituiti a
  render-time con i valori di `footer.studio` / `settings` (unica fonte di
  verita, vedi components/site/legal-doc.tsx). Cosi i dati anagrafici si
  confermano una volta sola e restano allineati ovunque.

  STATO: testi PRELIMINARI generati dal blueprint (@10_Legale_Compliance) e
  dalle bozze in bozze_legali/. Devono essere VALIDATI da un legale/DPO prima del
  go-live. Il consenso cookie e gestito dal banner proprio del sito
  (components/analytics/consent-banner.tsx, GA4 Consent Mode v2, default denied);
  la revoca avviene dal link "Preferenze cookie" nel footer.
  La versione italiana fa sempre fede.
*/

export type LegalBlock = ArticleBlock;

export type LegalDoc = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  /** Etichetta data ultimo aggiornamento (placeholder finche non pubblicato). */
  updatedAt: string;
  /** Avviso di stato mostrato in cima (es. testo in validazione). */
  notice?: { tone?: "info" | "warning"; title?: string; text: string };
  body: LegalBlock[];
  cta?: { label: string; href: string };
};

export type LegalSlug = "privacy" | "termini" | "cookie" | "garanzia";

const LANG_NOTE =
  "La versione italiana di questo documento fa fede: eventuali traduzioni hanno valore di mera cortesia e, in caso di discrepanza, prevale l'italiano.";

const VALIDATION_NOTICE = {
  tone: "warning" as const,
  title: "Testo preliminare in validazione",
  text:
    "Questa e una versione di lavoro predisposta dallo Studio. Prima della pubblicazione definitiva sara validata da un professionista (legale/DPO). I dati anagrafici contrassegnati come da confermare verranno completati al go-live. " +
    LANG_NOTE,
};

export const legalDocs: Record<LegalSlug, LegalDoc> = {
  privacy: {
    slug: "privacy",
    title: "Informativa sulla privacy",
    eyebrow: "Documento legale",
    intro:
      "Come trattiamo i tuoi dati personali quando consulti il sito, richiedi un preventivo, acquisti un servizio o usi la tua area personale, in conformita al GDPR (Reg. UE 2016/679).",
    updatedAt: "Versione preliminare - data di pubblicazione da definire",
    notice: VALIDATION_NOTICE,
    body: [
      {
        type: "p",
        text: "Ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (\"GDPR\") e del D.Lgs. 196/2003 (\"Codice Privacy\") come modificato dal D.Lgs. 101/2018, lo Studio fornisce le seguenti informazioni sul trattamento dei dati personali.",
      },
      { type: "h2", text: "1. Titolare del trattamento" },
      {
        type: "ul",
        items: [
          "Titolare: {{ragione_sociale}} ({{forma_giuridica}})",
          "Sede operativa: {{indirizzo}}",
          "P.IVA: {{piva}} - Codice Fiscale: {{cf}}",
          "Iscrizione Albo: {{albo}}",
          "PEC: {{pec}} - Email: {{email}} - Telefono: {{telefono}}",
        ],
      },
      { type: "h2", text: "2. Responsabile della protezione dei dati (DPO)" },
      {
        type: "p",
        text: "La nomina di un DPO non risulta obbligatoria per l'attivita svolta; la valutazione e documentata dal Titolare e viene aggiornata in base a volumi e natura dei trattamenti. Per ogni richiesta in materia di dati personali puoi contattare il Titolare ai recapiti della sezione 1.",
      },
      { type: "h2", text: "3. Categorie di dati trattati" },
      {
        type: "p",
        text: "A seconda dell'interazione, il Titolare puo trattare le seguenti categorie di dati:",
      },
      {
        type: "ul",
        items: [
          "Dati identificativi e di contatto: nome, cognome, email, numero di telefono.",
          "Dati relativi al servizio (pratica di successione): codice fiscale, dati anagrafici e patrimoniali dell'erede e del defunto, dati su immobili, conti correnti e rapporti finanziari, gradi di parentela.",
          "Documenti: documento d'identita, certificato/atto di morte, visure, certificazioni e ulteriori documenti necessari alla pratica.",
          "Dati di pagamento: gestiti direttamente dal fornitore di pagamento (Stripe); il Titolare non memorizza i dati completi della carta.",
          "Dati tecnici e di navigazione: indirizzo IP, identificativi dei dispositivi, log, cookie e tecnologie simili (vedi sezione 11 e Cookie Policy).",
        ],
      },
      {
        type: "p",
        text: "Alcuni dati possono riguardare soggetti diversi dall'utente che li conferisce (es. altri eredi o il defunto): chi li fornisce garantisce di essere legittimato a comunicarli e si impegna a informare gli interessati della presente informativa (art. 14 GDPR).",
      },
      { type: "h2", text: "4. Finalita del trattamento e basi giuridiche" },
      {
        type: "table",
        headers: ["Finalita", "Base giuridica (GDPR)"],
        rows: [
          [
            "Riscontro alle richieste di preventivo/contatto e attivita precontrattuali",
            "Art. 6.1.b (misure precontrattuali)",
          ],
          [
            "Esecuzione del servizio professionale (predisposizione e invio telematico della dichiarazione di successione, volture)",
            "Art. 6.1.b (contratto)",
          ],
          [
            "Adempimenti fiscali, contabili e di conservazione (fatturazione, mandato professionale)",
            "Art. 6.1.c (obbligo legale)",
          ],
          ["Gestione dei pagamenti", "Art. 6.1.b e 6.1.c"],
          [
            "Sicurezza del sito, prevenzione di abusi/frodi, integrita dei sistemi",
            "Art. 6.1.f (legittimo interesse)",
          ],
          ["Marketing diretto / newsletter (se attivato)", "Art. 6.1.a (consenso)"],
          [
            "Cookie e tecnologie non tecniche/di profilazione",
            "Art. 6.1.a (consenso)",
          ],
        ],
      },
      {
        type: "p",
        text: "Non e prevista, di norma, la raccolta di categorie particolari di dati ex art. 9 GDPR. Qualora il cliente trasmetta spontaneamente dati eccedenti (es. informazioni sanitarie in un documento), il Titolare li tratta nei limiti dell'art. 9.2 e ne raccomanda la minimizzazione.",
      },
      { type: "h2", text: "5. Natura del conferimento" },
      {
        type: "p",
        text: "Il conferimento dei dati per le finalita contrattuali, fiscali e legali e necessario: il mancato conferimento impedisce l'erogazione del servizio. Il conferimento per finalita di marketing e facoltativo e l'eventuale rifiuto non pregiudica l'accesso al servizio.",
      },
      { type: "h2", text: "6. Modalita del trattamento e sicurezza" },
      {
        type: "p",
        text: "I dati sono trattati con strumenti informatici e misure tecniche e organizzative adeguate (art. 32 GDPR): cifratura in transito e a riposo, controllo degli accessi, segmentazione tramite Row Level Security, principio di minimizzazione, registrazione degli accessi (audit log). L'accesso e riservato al Titolare e ai responsabili autorizzati.",
      },
      { type: "h2", text: "7. Destinatari e responsabili del trattamento" },
      {
        type: "p",
        text: "Per erogare il servizio, il Titolare si avvale di fornitori che trattano i dati come responsabili del trattamento (art. 28 GDPR), vincolati da apposito accordo (DPA). Le principali categorie e fornitori sono:",
      },
      {
        type: "table",
        headers: ["Fornitore", "Ruolo / servizio", "Ubicazione dati"],
        rows: [
          ["Supabase", "Database, autenticazione, storage documenti", "UE"],
          [
            "Vercel",
            "Hosting e distribuzione dell'applicazione",
            "UE (funzioni) / possibile extra-UE",
          ],
          ["Stripe", "Elaborazione dei pagamenti", "UE/USA (SCC)"],
          ["Resend", "Invio email transazionali", "UE/USA (SCC)"],
          [
            "Google Workspace",
            "Email professionale dello Studio",
            "UE/USA (SCC / DPF)",
          ],
          [
            "OpenAI",
            "Estrazione assistita dei dati dai documenti della pratica (supporto interno al professionista)",
            "UE/USA (SCC / DPF)",
          ],
          [
            "Meta Platforms (WhatsApp Cloud API)",
            "Messaggistica (se attivata)",
            "UE/USA (SCC)",
          ],
          [
            "Google (Analytics/Ads)",
            "Statistiche e advertising (solo previo consenso)",
            "UE/USA (SCC)",
          ],
          ["Cloudflare (Turnstile)", "Protezione anti-abuso dei moduli (se attivata)", "UE/USA (SCC)"],
        ],
      },
      {
        type: "p",
        text: "I dati possono inoltre essere comunicati a soggetti pubblici (es. Agenzia delle Entrate, Catasto) per l'adempimento del servizio, a professionisti di fiducia (es. commercialista/notaio) ove necessario, e all'autorita giudiziaria/forze dell'ordine se richiesto per legge. I dati NON sono diffusi ne ceduti a terzi per loro autonome finalita.",
      },
      { type: "h2", text: "8. Trasferimento dei dati extra-UE" },
      {
        type: "p",
        text: "Il Titolare privilegia fornitori con dati in Unione Europea. Quando alcuni fornitori trattano dati al di fuori dell'UE (es. negli USA), il trasferimento avviene sulla base di garanzie adeguate ai sensi degli artt. 44 e ss. GDPR, in particolare le Clausole Contrattuali Standard (SCC) della Commissione Europea e/o decisioni di adeguatezza (es. EU-US Data Privacy Framework, ove applicabile).",
      },
      { type: "h2", text: "9. Periodo di conservazione" },
      {
        type: "ul",
        items: [
          "Documenti fiscali e contabili (fatture, ricevute, mandato, dichiarazione): conservati per il termine di legge, almeno 10 anni (art. 2220 c.c. e obblighi fiscali).",
          "Documenti di input sensibili caricati dal cliente (es. carta d'identita): conservati per il tempo necessario alla lavorazione e poi cancellati dal cloud (minimizzazione).",
          "Documenti finali (ricevute AdE, visure aggiornate, fattura): resi disponibili nell'area personale del cliente per la consultazione; l'archivio completo e conservato in sicurezza.",
          "Dati di contatto per preventivi non convertiti: cancellati o anonimizzati entro un periodo definito (in fase di definizione).",
          "Dati per marketing: fino a revoca del consenso.",
          "Dati tecnici/log e cookie: secondo le durate indicate nella Cookie Policy.",
        ],
      },
      { type: "h2", text: "10. Diritti dell'interessato" },
      {
        type: "p",
        text: "Puoi esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR: accesso, rettifica, cancellazione (\"diritto all'oblio\", nei limiti degli obblighi di conservazione legale), limitazione, portabilita, opposizione al trattamento basato sul legittimo interesse, revoca del consenso in ogni momento (senza pregiudicare la liceita del trattamento precedente).",
      },
      {
        type: "p",
        text: "Le richieste vanno inviate ai recapiti della sezione 1. Il Titolare risponde senza ingiustificato ritardo e comunque entro un mese. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).",
      },
      { type: "h2", text: "11. Cookie e tecnologie di tracciamento" },
      {
        type: "p",
        text: "Il sito utilizza cookie tecnici e, previo consenso, cookie di statistica (Google Analytics 4 con Consent Mode: nessun cookie di misurazione viene impostato senza consenso). Il dettaglio delle categorie, delle finalita e delle durate e riportato nella Cookie Policy dedicata, accessibile dal banner e dal footer. Il consenso e revocabile in qualsiasi momento dal link \"Preferenze cookie\" nel footer.",
      },
      { type: "h2", text: "12. Processo decisionale automatizzato e intelligenza artificiale" },
      {
        type: "p",
        text: "Non e effettuato alcun processo decisionale automatizzato che produca effetti giuridici sull'interessato ai sensi dell'art. 22 GDPR. Lo Studio utilizza strumenti di intelligenza artificiale esclusivamente come supporto interno all'attivita del professionista: in particolare, i documenti caricati per la pratica possono essere elaborati tramite il servizio API di OpenAI (responsabile del trattamento, vedi sezione 7) per estrarne i dati necessari alla predisposizione della dichiarazione (es. dati anagrafici, catastali).",
      },
      {
        type: "ul",
        items: [
          "I dati inviati tramite API non sono utilizzati da OpenAI per addestrare i propri modelli.",
          "Ogni dato estratto viene verificato e validato dal professionista prima dell'uso: la decisione finale e sempre rimessa a una persona.",
          "Il trasferimento extra-UE eventualmente connesso avviene con le garanzie della sezione 8.",
        ],
      },
      { type: "h2", text: "13. Minori" },
      {
        type: "p",
        text: "I servizi si rivolgono a persone maggiorenni. Il Titolare non raccoglie consapevolmente dati di minori senza il consenso di chi esercita la responsabilita genitoriale.",
      },
      { type: "h2", text: "14. Modifiche all'informativa" },
      {
        type: "p",
        text: "Il Titolare puo aggiornare la presente informativa. La versione vigente e sempre pubblicata su questa pagina con la data di ultimo aggiornamento; in caso di modifiche sostanziali ne sara data adeguata evidenza.",
      },
    ],
  },

  termini: {
    slug: "termini",
    title: "Condizioni di vendita",
    eyebrow: "Documento legale",
    intro:
      "I termini e le condizioni che regolano la vendita a distanza dei nostri servizi professionali ai consumatori (D.Lgs. 206/2005, Codice del Consumo).",
    updatedAt: "Versione preliminare - data di pubblicazione da definire",
    notice: VALIDATION_NOTICE,
    body: [
      { type: "h2", text: "1. Informazioni sul professionista (art. 49 Cod. Consumo)" },
      {
        type: "ul",
        items: [
          "Professionista: {{ragione_sociale}} ({{forma_giuridica}})",
          "Sede operativa: {{indirizzo}}",
          "P.IVA: {{piva}} - Codice Fiscale: {{cf}}",
          "Iscrizione Albo: {{albo}}",
          "PEC: {{pec}} - Email: {{email}} - Telefono: {{telefono}}",
        ],
      },
      { type: "h2", text: "2. Oggetto e ambito di applicazione" },
      {
        type: "p",
        text: "Le presenti Condizioni regolano la vendita a distanza dei servizi professionali offerti tramite il sito, consistenti nell'assistenza alla predisposizione e trasmissione telematica della dichiarazione di successione e degli adempimenti connessi (es. volture catastali), secondo il pacchetto acquistato.",
      },
      {
        type: "p",
        text: "L'invio telematico all'Agenzia delle Entrate e effettuato dal professionista in qualita di intermediario abilitato ENTRATEL, previo conferimento di apposito mandato/incarico e ricezione della dichiarazione firmata dal cliente. Il contratto si conclude a distanza, in modalita elettronica.",
      },
      { type: "h2", text: "3. Pacchetti, prezzi ed esclusioni" },
      {
        type: "p",
        text: "I pacchetti e i relativi prezzi (onorario) sono indicati nella pagina Tariffe. Il prezzo indicato si riferisce esclusivamente all'onorario professionale.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Onorario e imposte sono cose diverse",
        text: "Le imposte e i tributi dovuti allo Stato (es. imposta di successione in autoliquidazione, imposte ipotecaria, catastale, di bollo, tributi speciali) NON sono compresi nel prezzo del servizio: sono calcolati in base alla specifica situazione, comunicati al cliente prima dell'invio e versati dall'erede. Il professionista non applica alcun ricarico su tali importi.",
      },
      {
        type: "ul",
        items: [
          "Sono esclusi dal pacchetto, salvo diverso accordo, i servizi non espressamente indicati (es. contenzioso, pratiche notarili, consulenze fiscali complesse, casi non lineari). Eventuali attivita aggiuntive sono preventivate a parte.",
          "Preventivo personalizzato (casi complessi): per le pratiche che per natura o complessita eccedono i pacchetti standard (es. pluralita di immobili, terreni/particelle agricole, quote societarie, successioni testamentarie, eredi all'estero, recupero documentale), il prezzo e determinato tramite preventivo individuale comunicato prima dell'acquisto.",
          "Il pacchetto proposto in esito al questionario online e indicativo: dopo la verifica della documentazione puo applicarsi la procedura di modifica e conguaglio (art. 5).",
          "Verifica preliminare di non obbligo: ove dai dati forniti emerga che la dichiarazione non e dovuta per legge, il professionista lo segnala al cliente; la valutazione definitiva richiede l'esame del caso concreto.",
        ],
      },
      { type: "h2", text: "4. Conclusione del contratto" },
      {
        type: "p",
        text: "La richiesta di preventivo non e vincolante. Il contratto si perfeziona con il pagamento del pacchetto e l'accettazione esplicita delle presenti Condizioni in fase di checkout. Prima dell'acquisto il cliente prende visione delle caratteristiche del servizio, del prezzo totale, delle presenti Condizioni e dell'informativa privacy.",
      },
      { type: "h2", text: "5. Pagamento e modifica del pacchetto" },
      {
        type: "p",
        text: "Il pagamento dell'onorario avviene anticipatamente tramite il fornitore di pagamento (Stripe). La fattura e emessa secondo gli obblighi vigenti. Le imposte di Stato sono gestite separatamente e versate dall'erede secondo le modalita comunicate.",
      },
      {
        type: "p",
        text: "Modifica del pacchetto e conguaglio: qualora, d'accordo con il cliente, il pacchetto venga modificato, si procede al conguaglio della differenza. In caso di passaggio a un pacchetto superiore, il cliente integra la differenza tramite link di pagamento; in caso di pacchetto inferiore, la differenza gia versata e rimborsata con lo stesso mezzo, senza ritardo. La modifica e confermata su supporto durevole. Le imposte di Stato restano in ogni caso escluse dal conguaglio.",
      },
      { type: "h2", text: "6. Obblighi e responsabilita del cliente" },
      {
        type: "ul",
        items: [
          "Il cliente fornisce dati e documenti veritieri, completi e tempestivi ed e responsabile della loro correttezza.",
          "Il professionista non risponde di ritardi, errori o sanzioni derivanti da informazioni o documenti errati, incompleti o forniti in ritardo dal cliente, ne dei tempi di lavorazione di enti terzi (Agenzia delle Entrate, Catasto, banche).",
          "Il cliente si impegna a conferire il mandato e a firmare la dichiarazione nei termini richiesti.",
        ],
      },
      { type: "h2", text: "7. Tempi di esecuzione" },
      {
        type: "p",
        text: "I tempi di consegna indicati sul sito sono stime che decorrono dal momento in cui il cliente ha fornito tutta la documentazione necessaria, completa, corretta e validata dal professionista (e non dalla data del pagamento), e non comprendono i tempi degli enti terzi. Finche la documentazione e incompleta o in attesa di integrazione, il termine resta sospeso e riprende a decorrere dalla ricezione/validazione dell'ultimo documento mancante.",
      },
      { type: "h2", text: "8. Diritto di recesso (artt. 52-59 Cod. Consumo)" },
      {
        type: "ul",
        items: [
          "Il consumatore ha diritto di recedere dal contratto entro 14 giorni senza fornire motivazioni; per i servizi il termine decorre dalla conclusione del contratto.",
          "Per esercitare il recesso il cliente puo usare il modulo tipo o una qualsiasi dichiarazione esplicita inviata ai recapiti della sezione 1. Il professionista conferma senza ritardo la ricezione.",
          "Avvio immediato: se il cliente chiede espressamente che la lavorazione inizi durante il periodo di recesso, presta consenso espresso all'avvio immediato e prende atto che perde il diritto di recesso a prestazione integralmente eseguita (art. 59, c.1, lett. a).",
          "Recesso dopo l'avvio ma prima del completamento: il cliente corrisponde un importo proporzionale al servizio gia reso fino alla comunicazione del recesso (art. 57, c.3).",
          "Il rimborso eventualmente dovuto e effettuato con lo stesso mezzo di pagamento, senza ritardo e comunque entro 14 giorni.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Spieghiamo il recesso in parole semplici nella pagina dedicata /recesso. Questo testo formale e quello che fa fede.",
      },
      { type: "h2", text: "9. Garanzia commerciale \"Soddisfatti o Rimborsati\"" },
      {
        type: "p",
        text: "Il professionista puo offrire, in aggiunta e volontariamente, una garanzia di rimborso alle condizioni indicate nella pagina Garanzia. Tale garanzia e aggiuntiva e non limita i diritti di legge del consumatore.",
      },
      { type: "h2", text: "10. Limitazioni di responsabilita" },
      {
        type: "p",
        text: "Il professionista esegue l'incarico secondo diligenza professionale (obbligazione di mezzi). Salvo dolo o colpa grave, e nei limiti di legge, la responsabilita e parametrata all'importo dell'onorario corrisposto per la pratica. Il professionista non risponde di eventi imputabili a terzi, forza maggiore o malfunzionamenti di fornitori esterni.",
      },
      { type: "h2", text: "11. Proprieta dei documenti e accesso" },
      {
        type: "p",
        text: "I documenti finali (ricevute, visure aggiornate, fattura) sono resi disponibili nell'area personale del cliente per la consultazione e il download, secondo i tempi indicati. La conservazione e regolata dall'informativa privacy.",
      },
      { type: "h2", text: "12. Trattamento dei dati personali" },
      {
        type: "p",
        text: "Il trattamento dei dati e descritto nell'Informativa Privacy disponibile sul sito, che costituisce parte integrante del rapporto.",
      },
      { type: "h2", text: "13. Modifiche" },
      {
        type: "p",
        text: "Il professionista puo modificare le presenti Condizioni; al rapporto si applica la versione accettata al momento dell'acquisto. La versione vigente e sempre pubblicata sul sito.",
      },
      { type: "h2", text: "14. Legge applicabile, foro e risoluzione delle controversie" },
      {
        type: "p",
        text: "Al contratto si applica la legge italiana. Per i consumatori resta fermo il foro inderogabile di residenza/domicilio del consumatore. Reclami ai recapiti della sezione 1. Il consumatore puo ricorrere alla piattaforma europea ODR (https://ec.europa.eu/consumers/odr) e agli organismi di mediazione/ADR competenti.",
      },
    ],
  },

  cookie: {
    slug: "cookie",
    title: "Cookie Policy",
    eyebrow: "Documento legale",
    intro:
      "I cookie e le tecnologie simili che utilizziamo, e come gestire i tuoi consensi.",
    updatedAt: "Versione preliminare - data di pubblicazione da definire",
    notice: {
      tone: "info",
      title: "Come gestiamo il consenso",
      text:
        "Il consenso e raccolto tramite il banner del sito: i cookie non necessari restano disattivati finche non li accetti (Consent Mode). Puoi cambiare idea in ogni momento dal link Preferenze cookie nel footer. " +
        LANG_NOTE,
    },
    body: [
      { type: "h2", text: "Cosa sono i cookie" },
      {
        type: "p",
        text: "I cookie sono piccoli file di testo che i siti salvano sul tuo dispositivo per farlo funzionare, ricordare le tue preferenze o raccogliere statistiche. Insieme ai cookie usiamo tecnologie simili (es. local storage, pixel).",
      },
      { type: "h2", text: "Categorie che utilizziamo" },
      {
        type: "table",
        headers: ["Categoria", "A cosa servono", "Base / consenso"],
        rows: [
          [
            "Tecnici / necessari",
            "Funzionamento del sito, sicurezza, sessione di accesso all'area personale, memorizzazione delle scelte sui cookie.",
            "Sempre attivi (non richiedono consenso)",
          ],
          [
            "Analitici (Google Analytics 4)",
            "Statistiche aggregate su come viene usato il sito per migliorarlo. Grazie al Consent Mode, nessun cookie di misurazione viene impostato senza il tuo consenso.",
            "Solo previo consenso",
          ],
          [
            "Marketing",
            "Misurazione delle campagne pubblicitarie e attribuzione (es. Google Ads). Al momento non attivi: se attivati, richiederanno il consenso dal banner.",
            "Solo previo consenso",
          ],
        ],
      },
      { type: "h2", text: "Come gestisci il consenso" },
      {
        type: "p",
        text: "Al primo accesso un banner ti permette di accettare o rifiutare i cookie non necessari, con pari evidenza tra le scelte. Puoi modificare o revocare il consenso in qualsiasi momento dal link \"Preferenze cookie\" nel footer del sito; la revoca non pregiudica la liceita dei trattamenti precedenti.",
      },
      { type: "h2", text: "Disattivazione dal browser" },
      {
        type: "p",
        text: "Puoi gestire o eliminare i cookie anche dalle impostazioni del tuo browser. La disattivazione dei cookie tecnici puo compromettere alcune funzioni del sito (es. l'accesso all'area personale).",
      },
      { type: "h2", text: "Titolare e contatti" },
      {
        type: "p",
        text: "Titolare del trattamento: {{ragione_sociale}}, {{indirizzo}}. Email: {{email}} - PEC: {{pec}}. Per il dettaglio sul trattamento dei dati personali vedi l'Informativa sulla privacy.",
      },
    ],
  },

  garanzia: {
    slug: "garanzia",
    title: "La nostra garanzia",
    eyebrow: "Le tue tutele",
    intro:
      "La promessa Soddisfatti o Rimborsati: una tutela in piu che offriamo noi, oltre ai tuoi diritti di legge.",
    updatedAt: "Versione preliminare - condizioni di dettaglio da definire",
    notice: {
      tone: "warning",
      title: "Condizioni in fase di definizione",
      text:
        "Casi coperti, importi e tempistiche della garanzia sono in corso di definizione e saranno pubblicati in forma definitiva prima del go-live. " +
        LANG_NOTE,
    },
    body: [
      { type: "h2", text: "La promessa" },
      {
        type: "p",
        text: "Vogliamo che tu sia tranquillo dall'inizio alla fine. Per questo, oltre alle tutele di legge, offriamo volontariamente una garanzia \"Soddisfatti o Rimborsati\": se qualcosa non va come avevamo concordato, ne parliamo e troviamo una soluzione, fino al rimborso nei casi previsti.",
      },
      { type: "h2", text: "Come funziona" },
      {
        type: "ol",
        items: [
          "Ci segnali il problema scrivendoci o dalla tua area personale.",
          "Verifichiamo insieme la situazione, in modo trasparente.",
          "Se rientra nei casi coperti, procediamo al rimborso con lo stesso metodo di pagamento, nei tempi indicati. (Casi, importi e tempi specifici: da definire.)",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Garanzia e recesso sono due cose diverse",
        text: "Il recesso e un tuo diritto di legge nei primi 14 giorni (vedi pagina Recesso). La garanzia Soddisfatti o Rimborsati e una promessa commerciale in piu, aggiuntiva e volontaria, che non limita in alcun modo i tuoi diritti di consumatore.",
      },
      { type: "h2", text: "Cosa non copre" },
      {
        type: "ul",
        items: [
          "Le imposte e i tributi dovuti allo Stato (non sono nostro onorario e non hanno ricarico).",
          "Ritardi o esiti dipendenti da documenti errati, incompleti o forniti in ritardo dal cliente.",
          "Tempi e decisioni di enti terzi (Agenzia delle Entrate, Catasto, banche).",
        ],
      },
    ],
    cta: { label: "Calcola il preventivo gratis", href: "/preventivo" },
  },
};

export function getLegalDoc(slug: LegalSlug): LegalDoc {
  return legalDocs[slug];
}
