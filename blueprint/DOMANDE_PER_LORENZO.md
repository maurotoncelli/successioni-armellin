# Domande e informazioni da raccogliere dal Geom. Lorenzo Armellin

> Documento di supporto alla Bibbia di progetto. Da compilare nella prossima riunione.
> Le risposte sbloccano i "Nodi da sciogliere" nei vari capitoli (indicati tra parentesi).

Legenda: [ ] = da chiedere · scrivere la risposta sotto ciascuna voce.
Nota: alcune voci sono PRE-COMPILATE da fonti pubbliche (Collegio Geometri di Pisa, elenchi online) e vanno SOLO CONFERMATE/corrette con Lorenzo. Contrassegno: "(da web - DA CONFERMARE)".

---

## 1. Anagrafica e dati dello studio (per footer, pagine legali, fatturazione)
- [ ] Ragione sociale / intestazione esatta dello studio:
  - (da web - DA CONFERMARE) Geom. Lorenzo Armellin (ditta individuale / studio tecnico)
- [ ] Partita IVA e Codice Fiscale:
  - (da web - DA CONFERMARE) P.IVA 02432220503 · C.F. RMLLNZ90E27G843J
- [ ] Numero e data di iscrizione all'Albo dei Geometri (e collegio provinciale):
  - (da web - DA CONFERMARE) Collegio Geometri e Geometri Laureati della Provincia di Pisa, n. 1969, iscritto dal 21/01/2022
- [x] Indirizzo completo dello studio:
  - CONFERMATO (studio operativo da mostrare sul sito): Via Vittorio Veneto 31, 56025 Pontedera (PI)
  - Nota: il Collegio riporta Via Cappelletto 55, Santa Maria a Monte (PI) - probabile indirizzo di residenza/registrazione, NON da usare sul sito.
- [ ] PEC, email ordinaria, telefono, eventuale numero WhatsApp Business:
  - (da web - DA CONFERMARE) PEC lorenzo.armellin@geopec.it · email geom.armellin@gmail.com · tel/cell 320 1570567
  - Nota: per il sito serviranno email dedicate sul dominio (vedi @07), non la Gmail personale.
- [ ] Dati di nascita (per pagine legali/fatturazione, dato sensibile):
  - (da web - DA CONFERMARE) nato a Pontedera (PI) il 27/05/1990
- [ ] Orari di lavoro / disponibilita (impatta promesse di tempistica e SLA - @01):

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
- [ ] Ha gia un dominio web? Quale? Dove e registrato?
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
- [ ] Come raccoglie oggi la firma del cliente su mandato e dichiarazione? (cartaceo, firma digitale, altro) -> serve per decidere lo strumento di firma online
- [ ] Possiede una firma digitale/CNS? Di che tipo?
- [x] Ha un commercialista e/o un avvocato di riferimento? (chi validera informativa, T&C, DPIA)
  - CONFERMATO (Riunione 1): ha **due commercialisti di riferimento**. DA CHIEDERE: nominativi/contatti e se uno di loro (o un avvocato) puo validare informativa privacy, Condizioni di Vendita e l'eventuale DPIA.
- [ ] Software di fatturazione elettronica gia in uso? (FattureInCloud, Aruba, altro)
- [ ] Conferma trattamento IVA/Cassa e come vuole mostrare i prezzi (IVA inclusa o + IVA)?
- [ ] Svolge anche attivita di mediazione immobiliare? (rileva per antiriciclaggio)
- [ ] Recessi/rimborsi: il software di fatturazione consente di emettere note di credito via API (per integrarle nel CRM) o resta un passo manuale?
- [ ] Vuole permettere al cliente di richiedere il recesso direttamente dall'area riservata (self-service) o solo via email/PEC?
- [ ] Criterio per il rimborso parziale (lavoro gia svolto): percentuali/regole di riferimento o decisione caso per caso?

## 5. Pricing e business (per @01, @13)
- [ ] Conferma i prezzi proposti? Semplice 290 / Completo 490 (+60/immobile extra) / Zero Stress 790 / Usufrutto 150
  - (Riunione 1) Lorenzo dice che "i prezzi proposti potrebbero anche andar bene". Riferimento attuale: oggi fa pagare **600 EUR a successione** (tariffa unica). Conferma definitiva della scaletta a 3 pacchetti DA CHIUDERE.
- [ ] Sono sostenibili come margine al netto di IVA, Cassa, commissioni e ADV?
- [ ] Obiettivo di fatturato/reddito mensile desiderato?
- [ ] E disposto, oltre ~30 pratiche/mese, a delegare a un collaboratore?
- [ ] **Casi complessi oltre ~800 EUR**: confermare la gestione via **preventivo personalizzato** (no 4o pacchetto pubblico) emesso dal CRM dopo consulenza telefonica (vedi @04/@05). Quali fattori fanno scattare il "su misura" (n. immobili, terreni/particelle agricole, annessi, testamento, eredi all'estero, recupero documenti)?
- [ ] **Soglia "non serve la successione"**: Lorenzo stima che sotto ~80.000 EUR nel 90% dei casi la dichiarazione non serve. Confermare il criterio operativo da usare nel form (riferimento di legge: esonero se eredita al coniuge/parenti in linea retta + attivo <= 100.000 EUR + nessun immobile/diritto reale immobiliare, art. 28 c.7 TUS). Vogliamo dirlo al cliente in modo onesto e offrire una verifica (vedi @04)?
- [ ] **Tutela dalla perdita su incarichi pesanti**: ok al meccanismo "cambio pacchetto con conguaglio" (addebito/rimborso della differenza one-click dal CRM) + invito a leggere la guida alla scelta del pacchetto e a una chiamata di riallineamento prima/dopo l'acquisto?
- [ ] **SLA di consegna per pacchetto** (giorni LAVORATIVI dalla documentazione completa, riferiti al NOSTRO invio, esclusi enti terzi): confermare la proposta Semplice **5** / Completo **10** / Zero Stress **3** (corsia prioritaria) / Su misura concordato. Sono sostenibili col suo throughput (2 pratiche/mattina)? Sara mostrato su Tariffe e nelle Condizioni di Vendita art. 7 (@03/@10).

## 6. Brand e marketing (per @02, @09)
- [ ] Ha gia un logo / elementi di brand (colori, font)?
- [ ] Ha gia una scheda Google Business Profile? Con quante recensioni?
- [ ] Puo realmente raccogliere ~20 recensioni iniziali da clienti storici?
- [ ] Disponibilita per lo shooting fotografico + video in studio (data, mezza giornata)? Concept pronto: `shooting/Concept_Shooting_Lorenzo.md`.
- [ ] Video di benvenuto: disponibile a girarlo (60-90s, prima persona)? Eventuali punti da includere nello script.
- [ ] Ha foto/materiali esistenti utilizzabili?
- [ ] Budget mensile che intende destinare all'advertising?

## 7. Materiali da farsi consegnare
- [ ] Visura camerale / dati fiscali per le pagine legali.
- [ ] Eventuale esempio (anonimizzato) di file di import/export del gestionale.
- [ ] Eventuali testi, brochure o materiali gia esistenti.

## 8. Biografia e credenziali (per pagina "Chi Sono" e E-E-A-T - @02/@03/@09)
> Serve a costruire la pagina autore/bio: in un settore YMYL la fiducia nasce da una persona reale, competente e verificabile.

Formazione e percorso:
- [ ] Diploma di geometra: istituto e anno (da web - DA CONFERMARE: diploma 2009). Eventuale laurea?
- [ ] Anni di esperienza nel settore e tappe principali del percorso (dove ha lavorato prima di mettersi in proprio).
- [ ] Da quando esercita in proprio (apertura P.IVA/studio) e da quando si occupa di successioni.
- [ ] Perche si e specializzato nelle successioni (storia/motivazione personale: ottimo per il copy empatico).

Credenziali e abilitazioni (prove di autorevolezza da esibire sul sito):
- [ ] Conferma iscrizione Albo (n. 1969, Collegio Pisa) e link alla scheda pubblica del Collegio.
- [ ] Abilitazione ENTRATEL come intermediario (data/estremi): e il requisito chiave per trasmettere le successioni (@10).
- [ ] Possesso di firma digitale/CNS (tipo).
- [ ] Altre abilitazioni/certificazioni (es. certificatore energetico, sicurezza cantieri D.Lgs. 81/08, antincendio, ecc.).
- [ ] Iscrizioni a registri/elenchi (es. CTU presso il Tribunale, albo fornitori, ecc.).
- [ ] Corsi/aggiornamenti professionali rilevanti, soprattutto su successioni/fiscale.
- [ ] Eventuali associazioni di categoria o reti professionali.

Numeri e prova sociale (E-E-A-T):
- [ ] Numero indicativo di pratiche di successione gia gestite (per "X pratiche seguite").
- [ ] Casi/esperienze significative raccontabili in forma anonima.
- [ ] Eventuali partner abituali (commercialista, notaio, avvocato) da citare come rete di garanzia.

Tocco umano (per ritratto e copy - @02):
- [ ] Come si presenterebbe in 2 righe a un cliente in difficolta? (tono in prima persona)
- [ ] Valori/approccio al lavoro che vuole trasmettere.
- [ ] Lingue parlate (utile se ci sono eredi all'estero).
- [ ] Disponibilita a un breve testo/video di presentazione e allo shooting (@09).
