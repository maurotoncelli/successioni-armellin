# Domande e informazioni da raccogliere dal Geom. Lorenzo Armellin

> Documento di supporto alla Bibbia di progetto. Da compilare nella prossima riunione.
> Le risposte sbloccano i "Nodi da sciogliere" nei vari capitoli (indicati tra parentesi).

Legenda: [ ] = da chiedere · scrivere la risposta sotto ciascuna voce.
Nota: alcune voci sono PRE-COMPILATE da fonti pubbliche (Collegio Geometri di Pisa, elenchi online) e vanno SOLO CONFERMATE/corrette con Lorenzo. Contrassegno: "(da web - DA CONFERMARE)".

---

## 1. Anagrafica e dati dello studio (per footer, pagine legali, fatturazione)
- [x] Ragione sociale / intestazione esatta dello studio:
  - CONFERMATO (Riunione 2, 22/06): **ditta individuale** - Geom. Lorenzo Armellin.
- [x] Partita IVA e Codice Fiscale:
  - CONFERMATO (Riunione 2): P.IVA 02432220503 · C.F. RMLLNZ90E27G843J.
- [x] Numero e data di iscrizione all'Albo dei Geometri (e collegio provinciale):
  - CONFERMATO (Riunione 2): iscrizione Albo OK (Collegio Geometri Pisa, n. 1969). Nota: verificare la data (il web riporta 21/01/2022, ma Lorenzo lavora in proprio dal 2012 - possibile re-iscrizione/trasferimento collegio).
- [x] Indirizzo completo dello studio:
  - CONFERMATO (studio operativo da mostrare sul sito): Via Vittorio Veneto 31, 56025 Pontedera (PI)
  - Nota: il Collegio riporta Via Cappelletto 55, Santa Maria a Monte (PI) - probabile indirizzo di residenza/registrazione, NON da usare sul sito.
- [ ] PEC, email ordinaria, telefono, eventuale numero WhatsApp Business:
  - (da web - DA CONFERMARE) PEC lorenzo.armellin@geopec.it · email geom.armellin@gmail.com · tel/cell 320 1570567
  - Nota: per il sito serviranno email dedicate sul dominio (vedi @07), non la Gmail personale.
- [ ] Dati di nascita (per pagine legali/fatturazione, dato sensibile):
  - (da web - DA CONFERMARE) nato a Pontedera (PI) il 27/05/1990
- [x] Orari di lavoro / disponibilita (impatta promesse di tempistica e SLA - @01):
  - CONFERMATO (Riunione 2): **orario ufficio 9:00-13:00 e 15:00-19:00**. Tempo di lavorazione: se ha tutti i documenti, completa la pratica in **3-4 giorni**.
- [ ] **Numero REA** (Repertorio Economico Amministrativo) ed eventuale CCIAA di iscrizione: da recuperare dalla visura camerale (serve nel footer per la ditta individuale).
- [ ] **Email dedicata sul dominio** per il footer e le richieste GDPR (es. `info@dominio` e `privacy@dominio`): da creare una volta registrato il dominio (oggi solo Gmail personale, non da pubblicare).

> NOTA IMPLEMENTAZIONE (footer + pagine legali data-driven): i dati di questa sezione alimentano il **footer** (`footer.studio` + `settings`) e vengono interpolati automaticamente nelle pagine legali (privacy, condizioni, cookie) tramite i token `{{piva}}`, `{{cf}}`, `{{rea}}`, `{{pec}}`, `{{albo}}`, ecc. Finche non sono confermati restano a video come "DA CONFERMARE". **Prima del go-live**: inserire i valori definitivi in `web/src/content/content_entries.it.json` (collection `footer`/`settings`) - una sola modifica si riflette ovunque. P.IVA/C.F. risultano gia indicati in Riunione 2 (P.IVA 02432220503 · C.F. RMLLNZ90E27G843J): da ri-verificare formalmente sulla visura prima di pubblicarli, insieme a numero/data Albo e REA.

## 2. Operativita attuale (per CRM e simulazione lavoro - @05)
- [ ] Quante pratiche di successione gestisce oggi (al mese / all'anno)?
  - (Riunione 1) Throughput: se la giornata fila, fa 2 successioni in una mattina. Volume mensile/annuo ancora DA QUANTIFICARE.
- [ ] Quanto tempo medio dedica a una pratica (Semplice / Completa / complessa)?
  - (Riunione 1) Indicativo: caso lineare ~1,5-2 h (2 a mattina). Tempo per casi complessi DA DETTAGLIARE.
- [x] Quale software gestionale usa per le successioni? (DeCuius, DE.A.S., altro)
  - CONFERMATO (Riunione 1): usa **Sogei - Successioni Online** (software dell'Agenzia delle Entrate). NON DeCuius/DE.A.S.
  - Impatto: il modulo "Esporta per Gestionale" (@05/@07) va ripensato sul formato AdE/Sogei (probabilmente il valore reale e il Brogliaccio PDF + dati da reinserire, non un CSV verso DeCuius). DA APPROFONDIRE: il software Sogei consente import dati esterni?
- [ ] In che formato importa/esporta i dati dal gestionale? (CSV, Excel, altro)
  - (Riunione 1) Da verificare su Sogei Successioni Online: ammette import di un tracciato esterno o si compila solo a mano?
- [ ] Sogei Successioni Online permette di **importare i dati** (es. da un file) oppure i campi vanno digitati a mano uno per uno?
  - Perche lo chiediamo: vogliamo aggiungere un aiuto che **legge in automatico i documenti caricati dai clienti** (visure, certificati, estratti conto) e ti **prepara una bozza dei dati gia compilata** nella scheda, che tu correggi se serve. Se Sogei accetta un import, possiamo farti risparmiare ancora piu tempo; altrimenti l'aiuto resta un comodo riepilogo da cui ricopiare velocemente.
- [x] Come gestisce oggi documenti e comunicazioni coi clienti? (email, WhatsApp, carta)
  - CONFERMATO (Riunione 1): lavora **tutto dall'ufficio**, NON si reca in banca per il cliente. C'e **sempre una chiamata** in cui spiega tutto al cliente. Il preventivo varia in base a immobili, annessi, particelle agricole, altri beni.
  - Implicazione di prodotto: la chiamata di consulenza/riallineamento e parte integrante del servizio -> il flusso non e puro self-service (vedi @04 nodo preventivo, @05).

## 3. Asset tecnici e infrastruttura (per stack e cold storage - @07, @12)
- [x] Ha un NAS (es. Synology/QNAP) o un PC con HDD esterni? Marca/modello?
  - (Riunione 1) NAS **QNAP serie TS-x31K** (sigla fornita: "x31K"). DA PRECISARE il modello esatto (TS-131K 1 bay / TS-231K 2 bay / TS-431K 4 bay), numero e taglia dei dischi e se in RAID. Impatto: sync cold storage pull-only via QNAP HBS 3 (Hybrid Backup Sync) o Rclone (@12).
- [ ] Sistema operativo del PC d'ufficio (Windows/Mac)?
- [ ] Connessione internet dell'ufficio (fibra, banda, IP statico)?
- [x] Ha gia un dominio web? Quale? Dove e registrato?
  - CONFERMATO (Riunione 2): **dominio DA FARE** (ancora da registrare). Proposta naming da @02/ANALISI_COMPETITORS.
- [ ] Chi gestisce/ha accesso al pannello DNS del dominio? (serve per SPF/DKIM/DMARC e sottodomini)
- [ ] Ha caselle email professionali sul dominio? Provider? (registrar/Google/Microsoft)
- [ ] Quale indirizzo vuole usare come "reply-to" per le email automatiche del sistema?
- [ ] Preferisce CRM su sottodominio dedicato (`app.dominio.it`) o su path (`/admin`)?
- [x] Multilingua: lingue al lancio - IT, EN, AR, DE, ES, RU, TR, cinese semplificato, hindi, albanese, francese (i marocchini sono coperti dall'arabo; il francese copre l'Africa francofona). CONFERMATO.
- [ ] Lingue africane aggiuntive (somalo/amarico/tigrino/wolof): quali includere? Caveat: traduttori legali difficili da reperire e SEO marginale; il francese gia copre gran parte dell'Africa francofona.
- [x] Traduzioni: interamente AI con modelli avanzati (budget limitato, niente revisione umana). Testi legali validi in italiano. CONFERMATO.
- [ ] Motto latino per Chi Sono/footer: averne uno preferito o lo proponiamo noi.
- [ ] Credit footer "AT STUDIO": wording esatto (es. "Realizzato da AT STUDIO") ed eventuale URL a cui linkarlo.

## 4. Legale e fiscale (per @10)
- [x] Come raccoglie oggi la firma del cliente su mandato e dichiarazione? (cartaceo, firma digitale, altro) -> serve per decidere lo strumento di firma online
  - CONFERMATO (Riunione 2): **oggi firma in CARTACEO**, ma e disposto ad aggiornarsi (firma online) se richiesto. Decisione: v1 supporta il fallback cartaceo (scarica/firma/ricarica) come baseline + FES ad accettazione tracciata consigliata (Lorenzo aperto ad adottarla). Vedi DECISIONI/@06/@10.
- [x] Possiede una firma digitale/CNS? Di che tipo?
  - CONFERMATO (Riunione 2): **firma digitale CNS di Aruba**.
- [x] Ha un commercialista e/o un avvocato di riferimento? (chi validera informativa, T&C, DPIA)
  - CONFERMATO (Riunione 1): ha **due commercialisti di riferimento**. Riunione 2: come partner abituale da citare sul sito si parte dal **commercialista dedicato** (supervisione fiscale). DA CHIEDERE ancora: chi valida informativa privacy, Condizioni di Vendita e DPIA.
- [x] Software di fatturazione elettronica gia in uso? (FattureInCloud, Aruba, altro)
  - CONFERMATO (Riunione 2): **fatturazione con Aruba**.
- [x] Conferma trattamento IVA/Cassa e come vuole mostrare i prezzi (IVA inclusa o + IVA)?
  - CONFERMATO (Riunione 2): **regime forfettario, NO IVA**. I prezzi mostrati sono il prezzo finale dell'onorario ("tutto incluso", senza IVA). DA VERIFICARE col commercialista: eventuale contributo integrativo Cassa Geometri (CIPAG) in fattura e se includerlo nel prezzo a display.
- [x] Svolge anche attivita di mediazione immobiliare? (rileva per antiriciclaggio)
  - CONFERMATO (Riunione 2): **NO mediazione immobiliare** -> antiriciclaggio non applicabile (coerente con @10).
- [ ] Recessi/rimborsi: il software di fatturazione consente di emettere note di credito via API (per integrarle nel CRM) o resta un passo manuale?
- [ ] Vuole permettere al cliente di richiedere il recesso direttamente dall'area riservata (self-service) o solo via email/PEC?
- [ ] Criterio per il rimborso parziale (lavoro gia svolto): percentuali/regole di riferimento o decisione caso per caso?

## 5. Pricing e business (per @01, @13)
- [x] Conferma i prezzi proposti? Semplice 290 / Completo 490 / Zero Stress / Usufrutto 150
  - CONFERMATO (Riunione 2) con CAPIENZA per pacchetto:
    - **Completo 490 EUR**: fino a **5 eredi**, **da 1 a 3 immobili**, fino a **5 conti bancari**.
    - **Zero Stress**: **da 3 a 8 immobili**, non oltre **5 conti**, **recupero documenti** incluso, fino a **5 eredi**. (DA CHIARIRE: sovrapposizione a 3 immobili tra Completo e Zero Stress -> proposta: Completo 1-3 immobili, Zero Stress quando >3 immobili o quando serve il recupero documenti. Prezzo Zero Stress: confermare se resta 790.)
    - **Semplice 290** (soli conti/liquidita, nessun immobile): non ridiscusso, si mantiene.
  - **Servizi correlati / add-on**: **Riunione di usufrutto 150 EUR** (spostata negli add-on, non upsell a se) + **Adeguamento/ricalcolo IMU** come servizio aggiuntivo (prezzo PROPOSTO da noi: **90 EUR** base, vedi DECISIONI - Lorenzo deve confermare).
- [ ] Sono sostenibili come margine al netto di Cassa, commissioni e ADV? (regime forfettario, no IVA)
- [x] Obiettivo di fatturato/reddito mensile desiderato?
  - CONFERMATO (Riunione 2): **minimo 10.000 EUR/mese, ideale 15.000 EUR/mese**; crescita insieme all'aumento del budget ADV secondo i piani.
- [ ] E disposto, oltre ~30 pratiche/mese, a delegare a un collaboratore? (Riunione 1: si, in prospettiva)
- [x] **Casi complessi**: gestione via **preventivo personalizzato** (no 4o pacchetto pubblico) emesso dal CRM dopo consulenza (@04/@05). Fattori che fanno scattare il "su misura":
  - CONFERMATO (Riunione 2): **SI -> su misura**: tanti immobili (oltre la capienza Zero Stress), **particelle agricole**, **terreni**. **NO -> restano nei pacchetti standard**: annessi, testamento, eredi all'estero. **Recupero documenti -> su misura SOLO se in conflitto con il pacchetto 490** (altrimenti e gestito da Zero Stress).
- [x] **Soglia "non serve la successione" / quando e gratis** (foto/screenshot fornito da Lorenzo, Riunione 2):
  - Criterio di legge (esonero, art. 28 c.7 TUS): la dichiarazione **NON e dovuta** SOLO se ricorrono **tutte e tre** le condizioni insieme: (1) eredita devoluta **esclusivamente al coniuge e/o parenti in linea retta** (figli, genitori); (2) **attivo ereditario lordo <= 100.000 EUR**; (3) **nessun bene immobile o diritto reale immobiliare**. Se anche una sola manca, va presentata.
  - "Gratis": il cliente puo sempre farla da solo (precompilata gratuita AdE con SPID); inoltre tra coniuge/figli operano franchigie elevate (1 mln a erede) per cui spesso **non e dovuta imposta di successione**, ma la **dichiarazione** puo comunque servire (es. se ci sono immobili).
  - Decisione: il form (Esito A) avvisa onestamente quando con buona probabilita non serve, offrendo una verifica. Usare il criterio legale dei 100k + linea retta + niente immobili; la stima prudente di Lorenzo (~80k) resta come soglia di cautela interna. Vedi @04.
- [x] **Tutela dalla perdita - "cambio pacchetto con conguaglio"**: CONFERMATO (Riunione 2).
- [x] **SLA di consegna per pacchetto** (giorni LAVORATIVI dalla documentazione completa, riferiti al NOSTRO invio): CONFERMATO (Riunione 2) - "tempi consegna si". Nota: lavorazione effettiva ~3-4 giorni con documenti completi; gli SLA pubblici restano prudenziali (cuscinetto). Mostrati su Tariffe e Condizioni di Vendita art. 7 (@03/@10).

## 6. Brand e marketing (per @02, @09)
- [x] Ha gia un logo / elementi di brand (colori, font)?
  - CONFERMATO (Riunione 2): per ora si usa il **monogramma "A" su sfondo dorato** gia realizzato nel prototipo; in futuro si ricalibra il logo definitivo.
- [x] Ha gia una scheda Google Business Profile? Con quante recensioni?
  - CONFERMATO (Riunione 2): **SI**, si procede con la scheda Google Business Profile.
- [x] Puo realmente raccogliere ~20 recensioni iniziali da clienti storici?
  - CONFERMATO (Riunione 2): **SI**, ok alle ~20 recensioni richieste.
- [x] Disponibilita per lo shooting fotografico + video in studio?
  - CONFERMATO (Riunione 2): **foto e video se ne occupa Lorenzo** (li fornisce lui).
- [x] Video di benvenuto / foto esistenti: li fornisce Lorenzo (vedi sopra).
- [ ] Budget mensile advertising: cresce per fasi insieme ai risultati (vedi obiettivi @01/@09); importo iniziale soft launch ~400 EUR/mese.

## 7. Materiali da farsi consegnare
- [ ] Visura camerale / dati fiscali per le pagine legali.
- [ ] Eventuale esempio (anonimizzato) di file di import/export del gestionale.
- [ ] Eventuali testi, brochure o materiali gia esistenti.

## 8. Biografia e credenziali (per pagina "Chi Sono" e E-E-A-T - @02/@03/@09)
> Serve a costruire la pagina autore/bio: in un settore YMYL la fiducia nasce da una persona reale, competente e verificabile.

Formazione e percorso:
- [x] Diploma di geometra: CONFERMATO (Riunione 2) **diplomato geometra** (istituto/anno da precisare).
- [x] Da quando esercita in proprio e da quando si occupa di successioni: CONFERMATO (Riunione 2) **lavora in proprio e si occupa di successioni dal 2012**.
- [ ] Perche si e specializzato nelle successioni (storia/motivazione personale: ottimo per il copy empatico).

Credenziali e abilitazioni (prove di autorevolezza da esibire sul sito):
- [ ] Conferma iscrizione Albo (n. 1969, Collegio Pisa) e link alla scheda pubblica del Collegio.
- [x] Abilitazione ENTRATEL come intermediario: CONFERMATO (Riunione 2) **abilitato Entratel** (requisito chiave, @10).
- [x] Possesso di firma digitale/CNS (tipo): CONFERMATO (Riunione 2) **CNS Aruba**.
- [ ] Altre abilitazioni/certificazioni (es. certificatore energetico, sicurezza cantieri D.Lgs. 81/08, antincendio, ecc.).
- [ ] Iscrizioni a registri/elenchi (es. CTU presso il Tribunale, albo fornitori, ecc.).
- [ ] Corsi/aggiornamenti professionali rilevanti, soprattutto su successioni/fiscale.
- [ ] Eventuali associazioni di categoria o reti professionali.

Numeri e prova sociale (E-E-A-T):
- [x] Numero indicativo di pratiche di successione gia gestite: CONFERMATO (Riunione 2) **circa un centinaio di successioni** (usare "oltre 100 successioni seguite").
- [ ] Casi/esperienze significative raccontabili in forma anonima.
- [x] Eventuali partner abituali da citare come rete di garanzia: CONFERMATO (Riunione 2) per ora il **commercialista dedicato** (supervisione fiscale).

Tocco umano (per ritratto e copy - @02):
- [ ] Come si presenterebbe in 2 righe a un cliente in difficolta? (tono in prima persona)
- [x] Valori/approccio al lavoro che vuole trasmettere: CONFERMATO (Riunione 2) - Lorenzo si descrive come persona **onesta, pratica, realista, reperibile, dedicata, lavoratrice**. Copy dei valori elaborato in @02 (sezione "Valori del brand").
- [ ] Lingue parlate (utile se ci sono eredi all'estero).
- [ ] Disponibilita a un breve testo/video di presentazione e allo shooting (@09).
