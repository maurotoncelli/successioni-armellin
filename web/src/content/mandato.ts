import { obj, text } from "@/lib/content";

/*
  Testo del MANDATO PROFESSIONALE (unica fonte di verita).
  Usato sia dalla pagina /area-riservata/mandato (rendering) sia dal download
  .txt nel form di firma: prima era duplicato in due punti con refusi.

  STATO: testo definitivo dal 14/07/2026 (decisione di Mauro+Lorenzo: si
  pubblica senza passaggio dall'avvocato), coerente con le Condizioni di
  vendita (@/content/legal).

  I dati del professionista arrivano da footer.studio / settings (stessa fonte
  di verita di footer e documenti legali).
*/

export type MandatoParams = {
  practiceCode: string;
  signerName: string;
};

export function buildMandatoParagraphs({
  practiceCode,
  signerName,
}: MandatoParams): string[] {
  const studio = obj<{
    ragione_sociale?: string;
    forma_giuridica?: string;
    piva?: string;
    cf?: string;
    albo?: string;
    indirizzo?: string;
  }>("footer", "studio", {});
  const pec = text("settings", "pec", "");
  const email = text("settings", "email", "");

  return [
    `Il/La sottoscritto/a ${signerName} (di seguito, il "Cliente") conferisce a ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, P.IVA ${studio.piva ?? ""}, C.F. ${
      studio.cf ?? ""
    }, iscritto all'${
      studio.albo ?? "Albo professionale"
    }, PEC ${pec}, email ${email} (di seguito, il "Professionista"), l'incarico professionale di seguito descritto, relativo alla pratica ${practiceCode}.`,

    "1. OGGETTO. L'incarico ha ad oggetto l'assistenza alla predisposizione della dichiarazione di successione e la sua trasmissione telematica all'Agenzia delle Entrate, che il Professionista effettua in qualità di intermediario abilitato Entratel, nonché gli adempimenti connessi previsti dal pacchetto acquistato (es. volture catastali). Sono escluse le attività non comprese nel pacchetto, che potranno essere oggetto di separato preventivo.",

    "2. CORRISPETTIVO. L'onorario e quello del pacchetto acquistato, indicato nella sezione \"Il tuo acquisto\" dell'area personale e già corrisposto in fase di ordine. Le imposte e i tributi dovuti allo Stato (imposta di successione, ipotecaria, catastale, bolli, tributi speciali) NON sono compresi nell'onorario: sono calcolati sulla base della specifica situazione, comunicati al Cliente prima dell'invio della dichiarazione e versati dal Cliente, senza alcun ricarico da parte del Professionista.",

    "3. OBBLIGHI DEL CLIENTE. Il Cliente si impegna a fornire dati e documenti veritieri, completi e tempestivi, e resta responsabile della loro correttezza. I termini di consegna indicati decorrono dal momento in cui la documentazione necessaria risulta completa e validata dal Professionista, e non comprendono i tempi degli enti terzi (Agenzia delle Entrate, Catasto, banche).",

    "4. DILIGENZA E RESPONSABILITA. Il Professionista esegue l'incarico con la diligenza professionale richiesta dalla natura dell'attività (obbligazione di mezzi), avvalendosi della supervisione fiscale di un commercialista. Per quanto non previsto dal presente mandato si applicano le Condizioni di vendita accettate in fase di acquisto, incluse le previsioni su limitazioni di responsabilità, modifica del pacchetto e conguaglio.",

    "5. RECESSO. Resta fermo il diritto di recesso di cui agli artt. 52-59 del Codice del Consumo, secondo quanto indicato nelle Condizioni di vendita e nella pagina Recesso del sito. In caso di recesso dopo l'avvio della lavorazione, il Cliente corrisponde un importo proporzionale al servizio già reso.",

    "6. DATI PERSONALI. Il trattamento dei dati personali del Cliente e dei soggetti coinvolti nella pratica (inclusi il defunto e gli altri eredi) e descritto nell'Informativa Privacy disponibile sul sito, che il Cliente dichiara di aver letto. Il Cliente garantisce di essere legittimato a comunicare i dati di soggetti terzi.",

    "7. CONFERIMENTO E FIRMA. Il presente mandato e conferito a distanza. La firma avviene, a scelta del Cliente, in modalità elettronica (selezione della casella di accettazione e del pulsante di firma nell'area personale, con registrazione di data e ora) oppure mediante sottoscrizione autografa del documento scaricato e successivo caricamento della copia firmata.",

    "(La versione italiana del presente mandato fa fede.)",
  ];
}

export function buildMandatoText(params: MandatoParams): string {
  return (
    `MANDATO PROFESSIONALE - Pratica ${params.practiceCode}\n\n` +
    buildMandatoParagraphs(params).join("\n\n") +
    `\n\nLuogo e data: _________________________\n\nFirma del Cliente: _________________________\n`
  );
}
