# Test prezzo unico 250 € tutto incluso (UNICO250)

> Stato: **online dal 25/09/2026**, fine prevista l'08/10/2026 (merge del branch
> `test/prezzo-unico-250` su main).
> Listino di prima salvato nel tag `listino-290-490` (commit `ae7123e`).
> Richiesta di Mauro del 25/09/2026; OK di Lorenzo riferito da Mauro lo stesso giorno.
> Stesso giorno, dopo il go-live: tetti di 10 immobili e 10 eredi, pulsanti
> "Acquista il servizio" e WhatsApp sotto il prezzo nel risultato del preventivo,
> paragrafo "Come si paga".
> Codice: `web/src/lib/flat-offer.ts` (interruttore, date e tetti).

## Perché

Con il listino 290 / 490 / su misura il sito fa moltissimi preventivi ma pochi
acquisti. Il test prova per due settimane un prezzo unico di **250 € tutto
incluso** (imposte di Stato a parte). Il preventivatore resta: conferma al
cliente che il suo caso rientra nei 250 € (rinforzo di fiducia) e intercetta i
casi su misura.

È un test **diagnostico**, non un nuovo listino:

- se a 250 € le pratiche pagate al giorno non salgono, il freno non è il prezzo
  (fiducia, tempi, chiarezza del percorso);
- a 250 € con 25–30 pratiche al mese (capacità di Lorenzo da solo) il fatturato è
  6.250–7.500 €/mese, sotto il minimo di 10.000 € (@DECISIONI, Business). Per
  arrivare a 10.000 € servirebbero 40 pratiche al mese.

Va contro due indicazioni già prese: Lorenzo ha confermato la vetrina 290 / 490 il
27/07 ("non inseguire il 299") e @ANALISI_COMPETITORS consiglia di non competere
sul prezzo. Per questo il go-live richiede il suo OK esplicito.

## Decisioni di Mauro (25/09)

- **Perimetro**: 250 € coprono conti e titoli, **fino a 10 immobili** (terreni
  compresi) e **fino a 10 eredi** (anche all'estero, con o senza testamento), con
  la voltura catastale di ogni immobile. **Su misura** oltre 10 immobili o 10 eredi
  e per gli "altri beni" del quiz: quote societarie, azioni, aziende, barche. Al
  go-live il perimetro era "senza limiti di numero"; i tetti sono arrivati lo
  stesso giorno ("se sono 100, Lorenzo fallisce").
- **Risultato del preventivo**: subito dopo il prezzo, "Acquista il servizio" e
  "Scrivi su WhatsApp" verde, come prima del 22/09; "Fatti richiamare" resta sotto
  la scheda. La card di home e tariffe resta col solo "Calcola il preventivo
  gratis".
- **Come si paga**: paragrafo con pulsanti in home e in Come funziona (pagamento
  online con Stripe, tutto in anticipo oppure 50% + 50%, rate dove disponibili).
- **Nessuna scadenza pubblica**: niente date né conto alla rovescia sul sito. Il
  test si accende e si spegne con un deploy.
- **Servizi correlati**: nascosta la "Voltura aggiuntiva" (`VOLTURA_EXTRA`, già
  compresa nel prezzo); restano Riunione di usufrutto e Adeguamento IMU. Al 25/09
  tutti e tre risultano spenti nel Listino CRM, quindi sul sito la sezione non
  compare comunque.
- **Video "Come funziona"**: resta l'originale, non toccato. Dice "Qui, 490 euro,
  tutto compreso" verso i 24 secondi e mostra 490,00 € nella pagina di pagamento
  verso i 45 secondi: incongruenza accettata da Mauro per le due settimane.
- **Rimborsi**: su richiesta (chi ha pagato il listino poco prima del test e
  chiede la differenza). Nessun rimborso automatico.
- **Partenza**: appena c'è l'OK, durata due settimane.

## Come funziona (tecnico)

- **Interruttore** (`lib/flat-offer.ts`): `FLAT_OFFER_ON` e `FLAT_OFFER`
  (`code: "UNICO250"`, `price: 250`, `startsAt`, `endsAt`, `honorDays: 14`,
  `maxProperties: 10`, `maxHeirs: 10`).
  Cambia solo con un deploy: prezzi e testi devono cambiare insieme. Le date non
  accendono né spengono nulla; servono a banner CRM, statistiche e garanzia.
- **Ordine** (`lib/order.ts`, `buildOrder`): con il test acceso c'è una sola riga
  `PACKAGE` con chiave `UNICO250` e importo 250, senza supplementi +60 né promo;
  gli add-on restano righe a parte. Semplice/Completo restano solo come chiave
  interna (tempi di consegna, checklist, CRM). Zero Stress resta al suo listino.
- **Esito del quiz** (`lib/quote.ts`, `computeEsito`): "immobili: non so" resta
  nel prezzo unico; su misura con altri beni oppure oltre 10 immobili o 10 eredi
  (`exceedsFlatOfferLimits`, stesso calcolo nel quiz, nel salvataggio del lead e
  nella pagina del risultato). L'esonero (esito A) non cambia.
- **Acquisto diretto** da "Come si paga" (`FLAT_OFFER_CHECKOUT_HREF` =
  `/checkout?pkg=COMPLETO`): la pratica nasce senza risposte al questionario
  (nota "Checkout diretto dal sito") e Lorenzo raccoglie i dati dopo. Il checkout
  non controlla i tetti: se poi emergono più di 10 immobili o 10 eredi vale
  l'art. 5 delle Condizioni. Dal risultato del preventivo invece il checkout
  riceve le risposte del questionario.
- **Pagamenti** (`lib/payments.ts`): prezzo sempre ricalcolato lato server.
  - Garanzia: una pratica con riga `UNICO250` paga 250 € anche a test spento,
    fino a `endsAt` + 14 giorni (`flatOfferForPractice`). L'email al cliente dice
    "prezzo bloccato almeno 14 giorni".
  - Saldo 50/50: segue la regola dell'acconto; l'importo viene dal piano salvato
    e prezzo e righe della pratica non vengono riscritti.
  - Metadata Stripe `flat_offer=UNICO250`.
- **Testi** (`lib/content.ts`): con il test acceso la voce
  `prezzo_unico.<collection>.<key>` prende il posto di `<collection>.<key>` (gli
  oggetti si fondono, stringhe e liste si sostituiscono). A test spento le voci
  restano nel file ma non vengono lette.
- **FAQ** (`lib/cms.ts`): le due FAQ sul prezzo ("Quanto costa il vostro
  servizio?", "Le imposte sono comprese nel prezzo?") prendono la risposta da
  `prezzo_unico.faq_answers`, abbinata **per testo della domanda**. In italiano le
  FAQ vengono dal database (Listino CRM), che non si tocca: se durante il test si
  cambia il testo di quelle due domande nel CRM, torna la risposta 290/490.
- **Statistiche**: contatore giornaliero dei questionari (`lib/quote-stats.ts`,
  `byDay`), nato con il test. In anteprima Vercel e in locale i questionari non
  si contano (usano lo stesso database della produzione).
- **Fotografia del quiz** (`lib/quiz-summary.ts`): campo `offer: "UNICO250"`; il
  CRM mostra "Prezzo unico (test) · 250 € · caso con/senza immobili".

## Cosa cambia

### Sito

- **Barra sopra la navbar**: "Prezzo unico 250 € tutto incluso", senza date; non
  compare in checkout e nella pagina del risultato.
- **Home e Tariffe**: una card unica da 250 € più il riquadro "su misura", al posto
  di Semplice / Completo / Su misura.
- **Come si paga** (`components/site/payment-options.tsx`, `site_ui.payment_ui`):
  in home sotto la card e in Come funziona sotto la fascia prezzi. Non dipende dal
  test: a test spento resta, con "Calcola il preventivo gratis" al posto di
  "Acquista il servizio".
- **Tariffe**: guida alla scelta riscritta (cosa comprende, cosa no); "Voltura
  aggiuntiva" nascosta.
- **Come funziona**: fascia prezzi con la card unica. Video invariato.
- **Risultato del preventivo** (esito B): "Il tuo caso rientra nel prezzo unico",
  con l'elenco di cosa copre per quel caso (immobili, eredi, testamento…) e
  "Nessun supplemento". Subito sotto il prezzo "Acquista il servizio" (checkout con
  le risposte del questionario) e "Scrivi su WhatsApp" verde, precompilato con il
  prezzo unico, poi la riga "Dopo il pagamento…"; sotto la scheda restano solo
  "Fatti richiamare" e il resto della pagina. Nascosta la frase sul cambio di
  pacchetto. Esito C (su misura) con testo aggiornato: oltre 10 immobili o 10
  eredi, oppure altri beni.
- **Checkout e Stripe**: riga "Successione tutto incluso — prezzo unico", 250 €.
- **Area riservata**: ordine e dashboard mostrano il prezzo unico e cosa include.
- **FAQ**: le due risposte dedicate.

### CRM (sempre in italiano)

- **Listino**: banner "Test prezzo unico attivo" con date e scadenza della
  garanzia. I prezzi dei pacchetti restano modificabili ma non si vedono sul sito.
- **Scheda pratica**: "· prezzo unico" accanto al pacchetto, nota sull'importo e
  avviso su quanto applicheranno i link di pagamento. Per un importo diverso
  (preventivo su misura) si registra un pagamento manuale.
- **Statistiche**: card "Test prezzo unico 250 €": periodo del test contro i 14
  giorni prima (questionari, pratiche nate, pratiche pagate di cui a prezzo
  unico, onorari, tutto anche "al giorno"), con la nota "Come leggerlo".

### Email

- Riepilogo del preventivo al cliente (italiano e arabo; le altre lingue ricevono
  l'italiano come oggi): "rientra nel prezzo unico", tutto incluso fino a 10
  immobili e 10 eredi, imposte di Stato a parte, prezzo bloccato almeno 14 giorni.
- Notifica a Lorenzo: "Prezzo unico 250 € (test) · caso con/senza immobili".

### Testi (11 lingue)

31 voci nuove in ogni `web/src/content/content_entries.<lingua>.json`:
`site_ui.flat_offer_ui` (etichette di card, barra, risultato, checkout),
`prezzo_unico.faq_answers` e 29 sostituzioni `prezzo_unico.*` su home, tariffe,
come funziona, preventivo, risultato, checkout e promo.
`seed/content_entries.it.json` è di nuovo una copia esatta del file del sito
(era rimasto indietro di 65 voci, da prima del test).
Con i tetti: una voce nuova `site_ui.payment_ui` ("Come si paga") e due etichette
nuove in `site_ui.flat_offer_ui` (`buy_cta`, `whatsapp_cta`: pulsanti del
risultato).

### Legale (italiano + 10 traduzioni)

`web/src/content/legal*.ts`, data "Ultimo aggiornamento" 25 settembre 2026:

- **Condizioni di vendita**: art. 2 (servizi "come descritti nella pagina Tariffe
  e nel riepilogo dell'ordine"), art. 3 "Prezzo, cosa comprende ed esclusioni"
  (prezzo unico di 250 € fino a 10 immobili e 10 eredi, senza limiti di rapporti
  finanziari; oltre i tetti o con beni esclusi, preventivo individuale prima
  dell'acquisto; entro i tetti il prezzo non cambia dopo la verifica dei
  documenti), art. 4 ("pagamento dell'onorario"), art. 5 "Pagamento e casi fuori
  dal prezzo unico emersi dopo l'acquisto" (più di 10 immobili, più di 10 eredi o
  beni esclusi: proposta per la sola parte aggiuntiva; se il cliente non accetta,
  recesso con rimborso integrale), art. 7 (tempi indicativi per successioni
  senza/con immobili).
- **Garanzia**: "prezzo unico o preventivo su misura"; "servizi non compresi nel
  prezzo pagato".
- `bozze_legali/Condizioni_di_Vendita_TC_IT_BOZZA.md` allineata, con la nota per il
  legale.

## Checklist go-live

1. **OK di Lorenzo** su prezzo, perimetro, garanzia di 14 giorni e video con il 490.
   **Fatto il 25/09** (riferito da Mauro).
2. **Date**: se il go-live non è il 25/09, aggiornare `startsAt` e `endsAt` in
   `flat-offer.ts` (due settimane: `endsAt` = `startsAt` + 13 giorni) e la data
   "Ultimo aggiornamento" di Condizioni e Garanzia negli 11 `legal*.ts`.
3. **Commit** sul branch dei soli file del test (mai `bozza video/`, mai gli script
   non tracciati già presenti in `web/scripts`), push del branch, anteprima Vercel.
   **Fatto il 25/09** (commit `2aa977d`). Anteprima, protetta dal login Vercel del
   team: https://successioni-armellin-git-test-prezzo-unico-250-atstudio.vercel.app
4. **Giro in anteprima**: home, tariffe, come funziona, FAQ, preventivo con esiti
   A/B/C, checkout fino alla pagina Stripe (senza pagare se le chiavi sono live),
   area riservata, CRM (listino, statistiche, scheda pratica), una lingua europea
   e l'arabo. Fatto in locale prima del commit (sito; CRM e area riservata solo
   con typecheck e build); Mauro ha scelto di partire senza giro in anteprima.
5. **Merge su main** (deploy in produzione) e stesso giro veloce in produzione.
   **Fatto il 25/09.**
6. **Fuori dal sito**: annunci Google Ads che citano 290/490, scheda Google
   Business (servizi e prezzi; il video caricato lì dice 490 €), social,
   eventuali listini già inviati.
7. **Commercialista**: marca da bollo e contributo integrativo Cassa Geometri
   dentro i 250 € "tutto incluso".

## Durante il test

- **Da guardare**: CRM, Statistiche, card del test. Il numero decisivo sono le
  pratiche pagate al giorno; poi onorari al giorno e questionari al giorno. Per i
  questionari del periodo prima c'è solo il totale (il contatore giornaliero parte
  col test); se serve il confronto, GA4 con `node scripts/ga4-report.mjs` (da `web/`).
- **Su misura** (altri beni, oltre 10 immobili o 10 eredi): importo concordato con
  pagamento manuale dal CRM; i link di pagamento applicano sempre 250 €.
- **Acquisti diretti** da "Come si paga" (senza questionario): in CRM hanno la
  nota "Checkout diretto dal sito" e risposte vuote; se il caso supera i tetti,
  art. 5.
- **Non cambiare dal CRM** la domanda delle due FAQ sul prezzo: il test le
  riconosce da lì. La risposta si può correggere (durante il test non si vede).

## Chiusura del test

1. `flat-offer.ts`: `FLAT_OFFER_ON = false` e `endsAt` = ultimo giorno reale (la
   garanzia di 14 giorni si conta da lì).
2. **Legale**: annullare le modifiche del test negli 11 `legal*.ts` e nella bozza
   md (`git diff listino-290-490 -- 'web/src/content/legal*.ts' bozze_legali/` le
   mostra tutte), con una nuova data "Ultimo aggiornamento". Non riportare al tag
   i `content_entries`: contengono anche la nota IVA "senza IVA da aggiungere"
   (commit `d8b67a0` del 25/09), che è una correzione definitiva e non del test. Facoltativo: una riga che conferma il prezzo
   unico a chi l'ha avuto, fino alla scadenza della garanzia.
3. **Commit e deploy**. Testi, FAQ, card, barra e CRM tornano da soli al listino
   290/490: il database non è mai stato toccato. "Come si paga" resta e il suo
   pulsante torna "Calcola il preventivo gratis". Il risultato del preventivo
   torna com'era dal 22/09 (pulsanti sotto "Fatti richiamare", pagamento come
   link): se si vogliono i pulsanti sotto il prezzo anche col listino, va deciso.
4. **Pratiche a prezzo unico**: i link di pagamento applicano 250 € fino a
   `endsAt` + 14 giorni; i saldi 50/50 seguono l'acconto. In CRM si riconoscono da
   "prezzo unico".
5. **Statistiche**: la card del test resta visibile finché esistono pratiche a
   prezzo unico, così i risultati restano leggibili.
6. **Fuori dal sito**: ripristinare annunci e scheda Google.
7. Dopo la garanzia si possono togliere le voci `prezzo_unico` e il codice del
   test, oppure tenerli per un test futuro.

**Se si decide un prezzo unico diverso da 250 €**: oltre a `price`, "250" è scritto
per esteso in 9 voci di testo e in un paragrafo delle Condizioni, in 11 lingue.
Le pratiche esistenti sono marcate `UNICO250`: cambiando `code` perdono garanzia
e badge.

**Se cambiano i tetti (10 immobili / 10 eredi)**: oltre a `maxProperties` e
`maxHeirs`, il "10" è scritto per esteso in 16 testi per lingua (card, risultato,
tariffe, come funziona, FAQ, promo, quiz), negli artt. 3 e 5 delle Condizioni in
11 lingue, nelle email IT/AR (`lib/notifications.ts`), nei fallback di
`lib/site-ui-labels.ts` e nella bozza md.

## Punti aperti

- OK di Lorenzo.
- Commercialista: marca da bollo e Cassa Geometri dentro i 250 €.
- Costi di terzi (visure, recupero documenti) assorbiti nei 250 €: da confermare
  con Lorenzo.
- `web/src/content/mandato.ts` parla ancora di "pacchetto acquistato" e di
  "modifica del pacchetto e conguaglio", clausola che nelle Condizioni del test
  non c'è più. È un documento firmato e versionato: da decidere col legale.
- Video "Come funziona" del sito e video della scheda Google Business: citano
  490 € (scelta di lasciarli).
- Non legato al test: le chiavi `chi_siamo.video_captions_*` mancano in 9 lingue.
