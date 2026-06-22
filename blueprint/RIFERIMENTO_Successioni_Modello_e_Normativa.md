# RIFERIMENTO - Modello della Successione e Normativa (dominio)

> Documento di SUPPORTO della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).
> Scopo: avere "sott'occhio" il modello aggiornato della dichiarazione di successione e le norme/spiegazioni di riferimento, da una sola fonte. Alimenta i contenuti del sito (@09 SEO, FAQ @03), i testi del form (@04), l'area cliente/checklist (@06) e i testi legali (@10).
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22
> Dipendenze: @04_Form, @06_Area_Riservata, @09_Go_To_Market, @10_Legale_Compliance.

> ATTENZIONE (YMYL): questo file e una sintesi informativa, NON consulenza fiscale/legale. I valori (aliquote, franchigie, soglie, termini) vanno SEMPRE verificati sulle fonti ufficiali (sezione "Fonti ufficiali"). La materia e cambiata con la riforma 2025: aggiornare almeno una volta l'anno.

---

## 0. Risposta diretta: si trova tutto sui canali ufficiali?
SI. Le due cose stanno su canali ufficiali distinti:
- **Il modello, le istruzioni e il software** -> sito dell'**Agenzia delle Entrate** (agenziaentrate.gov.it): modello "Dichiarazione di successione e domanda di volture catastali", istruzioni di compilazione, software di compilazione/trasmissione, guida al calcolo dell'imposta, provvedimenti.
- **I testi di legge vigenti** -> **Normattiva** (normattiva.it) per il testo consolidato e in vigore (TUS D.Lgs 346/1990, D.Lgs 139/2024) e **Gazzetta Ufficiale** (gazzettaufficiale.it) per la pubblicazione.

I link puntuali sono nella sezione "Fonti ufficiali".

---

## 1. Cos'e (in breve)
- **Successione**: trasferimento del patrimonio del defunto (de cuius) agli eredi/legatari, alla data del decesso (apertura della successione).
- **Dichiarazione di successione**: adempimento FISCALE telematico verso l'Agenzia delle Entrate; non e l'accettazione dell'eredita ne un atto notarile. Serve a dichiarare l'attivo ereditario e a liquidare le imposte dovute, e (se ci sono immobili) ad aggiornare il Catasto (voltura).
- Modello unico: "**Dichiarazione di successione e domanda di volture catastali**" (la stessa dichiarazione puo richiedere la voltura automatica).

## 2. Chi deve presentarla
- Eredi, chiamati all'eredita, legatari (o i loro rappresentanti legali); amministratori dell'eredita, curatori dell'eredita giacente, esecutori testamentari, trustee.
- E sufficiente che la presenti UNO degli obbligati (la dichiarazione vale per tutti).
- Puo essere trasmessa da un **intermediario abilitato** (es. geometra abilitato ENTRATEL, commercialista, CAF) - e il caso del Geom. Armellin (@01/@10).

## 3. Quando NON e obbligatoria (esonero - art. 28, c.7, TUS)
L'obbligo NON sussiste se ricorrono CONTEMPORANEAMENTE tutte e tre le condizioni:
1. l'eredita e devoluta al **coniuge** e/o ai **parenti in linea retta** (figli, genitori);
2. l'**attivo ereditario** ha valore **non superiore a 100.000 euro**;
3. **non** comprende **beni immobili o diritti reali immobiliari**.
Note operative:
- Basta **un solo immobile** (anche minimo) per far scattare l'obbligo, a prescindere dal valore.
- Le condizioni possono venir meno per sopravvenienze.
- Sono inoltre previsti casi di esonero/non obbligo (es. rinuncia all'eredita prima della scadenza; cfr. art. 28, c.5).
- Collegamento di prodotto: e la base del "gate di non-obbligo" (Esito A del form, @04). Lorenzo usa una soglia PRUDENZIALE (~80.000) rispetto ai 100.000 di legge - confermare (DOMANDE_PER_LORENZO).

## 4. Termini di presentazione
- **12 mesi** dalla data di apertura della successione (di norma = data del decesso) - art. 31 TUS.
- Decorrenze differite in casi specifici (es. eredita giacente, accettazione con beneficio d'inventario, nomina curatore): il termine parte da quando il soggetto e legalmente in grado di agire.

## 5. Il modello AGGIORNATO 2025 (cosa e cambiato nella forma)
- Modello e istruzioni vigenti: approvati con **Provvedimento Agenzia delle Entrate del 13 febbraio 2025** (prot. n. 47335/2025), in adeguamento al D.Lgs 139/2024.
- Il quadro delle imposte e stato rinominato "**LIQUIDAZIONE DELLE IMPOSTE ED ALTRI TRIBUTI**".
- **Quadro EF - nuova Sezione V-bis "Imposta di successione"**: da compilare SOLO per successioni aperte dal 1 gennaio 2025; contiene i righi per l'imposta autoliquidata (es. EF18-bis "imposta calcolata", EF18-ter "pagamento dell'imposta", EF19 "totale da versare") e la gestione delle modalita di pagamento (unica soluzione/rateazione), nonche l'eventuale credito d'imposta.
- Output del software: file telematico **XML con estensione ".SUC"**.
- **Modello 4 (cartaceo)**: ancora usato per decessi avvenuti **prima del 3 ottobre 2006** e per integrative/sostitutive di dichiarazioni gia presentate con Modello 4.
- Residenti all'estero: in via eccezionale possono presentare il modello cartaceo se impossibilitati alla trasmissione telematica.

## 6. Autoliquidazione 2025 (cosa e cambiato nella sostanza) - D.Lgs 139/2024
- Per le successioni aperte **dal 1 gennaio 2025**, l'imposta di successione e **autoliquidata dal contribuente** in dichiarazione (non piu liquidata d'ufficio). L'ufficio mantiene il controllo a posteriori.
- Per le successioni aperte **prima del 1 gennaio 2025**: resta la liquidazione d'ufficio (avviso di liquidazione; pagamento entro 60 giorni dalla notifica).
- **Versamento imposta di successione autoliquidata**: entro **90 giorni** dal termine di presentazione della dichiarazione (si puo pagare anche contestualmente alla presentazione).
- **Rateazione**: ammessa se l'importo e **>= 1.000 euro**; **acconto minimo 20%**, saldo in **8 rate trimestrali** (fino a **12 rate** se l'importo supera 20.000 euro), con interessi.
- **Dichiarazione integrativa/sostitutiva**: e prevista nuovamente l'autoliquidazione, con versamento entro 90 giorni dalla presentazione.
- Pagamento tramite **F24** (per l'imposta di successione autoliquidata, codice tributo **1539**; altri codici per ipotecaria/catastale/bollo/tributi). Possibile l'addebito su c/c indicato in dichiarazione.

## 7. Imposte e tributi (panoramica)
> Il sito/prezzi del progetto distinguono SEMPRE onorario (servizio) dalle imposte di Stato (a carico dell'erede) (@01/@10). Questa sezione riguarda le imposte di Stato.

### 7.1 Imposta di successione - aliquote e franchigie (art. 7 / art. 2 d.l. 262/2006; art. 7 TUS)
| Beneficiario | Aliquota | Franchigia (per beneficiario) |
|--------------|----------|-------------------------------|
| Coniuge e parenti in linea retta (figli, genitori) | 4% | 1.000.000 EUR |
| Fratelli e sorelle | 6% | 100.000 EUR |
| Altri parenti fino al 4 grado, affini in linea retta, affini in linea collaterale fino al 3 grado | 6% | nessuna |
| Altri soggetti (estranei) | 8% | nessuna |
| Persone con disabilita grave (L. 104/1992), qualunque grado di parentela | aliquota secondo parentela | 1.500.000 EUR |

L'imposta si applica sul valore eccedente la franchigia.

### 7.2 Imposte ipotecaria e catastale (solo se ci sono immobili) - D.Lgs 347/1990
- **Ipotecaria: 2%** del valore catastale (minimo 200 EUR).
- **Catastale: 1%** del valore catastale (minimo 200 EUR).
- Con **agevolazione "prima casa"** in capo a un erede: ipotecaria e catastale si applicano in **misura fissa (200 EUR ciascuna)**.
- Vanno **autoliquidate e versate contestualmente** alla presentazione della dichiarazione.

### 7.3 Altri tributi (se immobili)
- Imposta di **bollo**, **tassa ipotecaria**, **tributi speciali catastali** (importi fissi, dovuti per le formalita catastali).

## 8. Volture catastali
- Se ci sono immobili, con la dichiarazione si puo chiedere la **voltura automatica** al Catasto.
- Se NON ci si avvale della voltura automatica, va presentata richiesta di voltura ai competenti uffici provinciali - Territorio **entro 30 giorni** dalla registrazione della dichiarazione.
- E qui che pesa la competenza del geometra (verifica dati catastali, particelle, annessi, atti di provenienza) - USP del progetto (@01).

## 9. Come si presenta (canali)
- **Telematico** tramite il software dell'Agenzia delle Entrate, inviato direttamente dal contribuente abilitato o da un **intermediario abilitato ENTRATEL** (il caso di Lorenzo).
- Tramite ufficio AdE su appuntamento (il contribuente compila, l'ufficio trasmette).
- Cartaceo (Modello 4) solo nei casi residui (vedi sez. 5).

## 10. Strumenti/software ufficiali
- **Software AdE "Dichiarazione di successione e domanda di volture catastali"** (compilazione + creazione file .SUC + invio telematico). E il riferimento di Lorenzo (vedi nota su Sogei/Successioni Online, @05/DOMANDE).
- **Procedura web "Successione online"** nell'area riservata AdE: per i casi piu semplici (compilazione guidata online).
- **ALIS 2.x** (foglio di lavoro AdE): strumento di ausilio all'autoliquidazione dell'imposta da riportare nel quadro EF.
- **F24**: versamento imposte (codici tributo dedicati, es. 1539 imposta di successione).

## 11. Documenti tipici necessari (mappa con il data model)
Indicativi; variano col caso. Allineati a `document_type` (@SPEC_Data_Model) per la checklist dell'area cliente (@06):
- Certificato/estratto di **morte** (DEATH_CERTIFICATE).
- **Documento d'identita** e **codice fiscale** del defunto e degli eredi (ID_CARD, CF).
- **Autocertificazione stato di famiglia** / dati eredi e grado di parentela (FAMILY_SELF_CERT).
- **Testamento** (se presente), eventuale verbale di pubblicazione (WILL).
- **Visure catastali** e **atti di provenienza** degli immobili, **planimetrie** (VISURA, PROVENANCE_DEED, FLOOR_PLAN).
- Saldi/giacenze di **conti, libretti, titoli** alla data del decesso; **IBAN** per eventuali rimborsi (IBAN_DOC).
- Autorizzazione del **Giudice Tutelare** se eredi minori/incapaci (GUARDIAN_AUTH).
- Documenti finali prodotti: **ricevuta di presentazione/registrazione**, **fattura**, **esiti** (RECEIPT, INVOICE).

## 11.1 Mappa dei quadri del Modello AdE -> nostri campi (da esempio reale, anonimizzato)
> Ricavata da una dichiarazione gia presentata da Lorenzo (caso con immobili + conti + quote + prima casa + voltura). L'esempio reale resta PRIVATO e fuori dalla bibbia: qui teniamo solo la struttura, utile per form (@04), data model (@SPEC_Data_Model), checklist (@06) e calcolo imposte.

| Quadro | Cosa contiene | A cosa serve da noi |
|--------|---------------|---------------------|
| **Dati Generali** | CF defunto, tipo dichiarazione (prima/sostitutiva, per legge/testamento), n. beneficiari, dati dichiarante (UN erede), **CF intermediario** (Lorenzo), elenco quadri compilati, data impegno/presentazione | `deceased_cf` = identificatore pratica; dichiarante != intermediario -> serve **mandato/delega** dell'erede; conferma flusso ENTRATEL |
| **EA - Eredi/chiamati/legatari** | Per ogni soggetto: CF, anagrafica, comune di nascita, **grado di parentela** (01 coniuge, 02 figli...), tipo (erede/legatario/chiamato), eventuale rinuncia | Lista eredi della pratica; il grado guida **franchigia/aliquota** e il gate "non serve" del form |
| **EB Terreni / EC Fabbricati (Catasto)** | Provincia, comune, **foglio/particella/subalterno**, categoria, classe, consistenza, **rendita catastale**, quota di possesso, valore, devoluzione, **agevolazione prima casa** | Cuore del valore-geometra (verifica catastale). NON chiesto al cliente nel form: lo ricava Lorenzo dai documenti. Numero immobili -> "+60/immobile" |
| **EO - Azioni/obbligazioni/titoli/quote** | CF societa, quantita, descrizione titolo, valore, devoluzione | Voce attivo; indice di complessita -> fascia/preventivo |
| **ER - Rendite, crediti e altri beni** | Tipo cespite (es. conto corrente), descrizione (banca/numero), valore, devoluzione | Voce attivo (liquidita); base per sblocco conti |
| **EE - Prospetto riepilogativo asse** | Totali per categoria e **attivo ereditario netto** | Sintesi valore pratica; utile per soglie/esoneri e copy trasparenza |
| **EF - Liquidazione imposte ed altri tributi** | Sez. I ipotecaria 2%, Sez. II catastale 1%, Sez. III-V bollo/tasse/tributi, **Sez. V-bis imposta di successione** (autoliquidazione 2025), totale da versare, Sez. VI sanzioni/interessi | Valida il **calcolatore imposte** e la FAQ "quanto pago"; numeri reali del metodo |
| **EG - Elenco documenti/certificati/dich. sostitutive** | Quante dichiarazioni sostitutive, testamento, albero genealogico, ecc. | Seed del **`document_catalog`/checklist** |
| **EH - Dich. sostitutive, agevolazioni e riduzioni** | Dichiarante, dati defunto/eredi, testamento si/no, rinunce, incapaci, **prima casa (EH14-18)** con requisiti barrati | Domande del form (testamento? prima casa?); agevolazioni che cambiano le imposte |
| **Attestazione di presentazione** | Protocollo telematico, **volume/numero/anno** di registrazione, ufficio competente, n. pagine, QR di verifica | **Documento finale** consegnato (area cliente, retention 10 anni @10) |

Implicazioni di prodotto gia confermate dall'esempio:
- Il **form pubblico (@04) resta leggero**: raccoglie solo cio che qualifica (tipo eredita, presenza/numero immobili indicativo, parentela, valore di massima) per pacchetto/esito. I dati catastali di dettaglio NON si chiedono al cliente.
- I **documenti finali** da archiviare/scaricare sono il **Modello compilato + l'Attestazione di presentazione** (coerente con retention 10 anni e area cliente).
- Tra **data impegno e invio** passano pochi giorni: conferma che lo SLA dipende dalla raccolta/validazione documenti, non dall'invio (@05/@10).

## 11.2 Caso-studio ANONIMO (numeri arrotondati) - per FAQ/pillar
> Esempio reale reso non identificabile (no nomi/CF, importi arrotondati). Usabile nei contenuti "quanto costa / quante imposte" (@03/@09) per spiegare con onesta la separazione onorario/imposte.
- **Famiglia**: coniuge + 2 figli (3 eredi, quote 1/3 ciascuno).
- **Asse ereditario**: ~117.000 EUR (immobili ~73.000 + titoli ~2.700 + liquidita ~41.000).
- **Immobili**: presente **una "prima casa"** + altre unita; con voltura catastale.
- **Imposte di Stato totali**: **~1.200 EUR** (ipotecaria ~560 + catastale ~380 + bollo/tributi ~250).
- **Imposta di successione**: **0 EUR** (eredi diretti, ampiamente sotto la franchigia di 1.000.000 EUR a testa).
- **Onorario del servizio**: separato e a parte (e cio che incassa il sito).
- Messaggio chiave: con eredi diretti spesso l'imposta di successione e zero; si pagano soprattutto ipotecaria/catastale/bollo sugli immobili, che **calcoliamo e comunichiamo prima** dell'invio.

## 12. Sanzioni (sintesi)
- **Omessa** presentazione: sanzione sull'imposta dovuta (con riduzioni in caso di ravvedimento) oltre interessi.
- **Tardiva** / **infedele**: sanzioni ridotte/proporzionali secondo i casi.
- Gli importi/percentuali sono soggetti a modifiche normative: verificare sulle fonti ufficiali e con il professionista. Da NON usare come testo definitivo sul sito senza verifica (@10).

## 13. Fonti ufficiali (link)
Modello, istruzioni, software, guide (Agenzia delle Entrate):
- Scheda "Dichiarazione di successione": https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione
- "Come e quando presentare": https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc
- "Come pagare le imposte" (aliquote, franchigie, autoliquidazione): https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini
- "Guida al calcolo dell'imposta di successione" (PDF): https://www.agenziaentrate.gov.it/portale/documents/d/guest/guida-calcolo-imposta-successione
- Software e modello/istruzioni: cercare "software dichiarazione di successione" e "modello dichiarazione di successione" sul portale AdE (sezione Software / Modelli).

Testi di legge (Normattiva - testo vigente):
- **TUS - D.Lgs 31 ottobre 1990, n. 346** (Testo unico imposte su successioni e donazioni): https://www.normattiva.it (cercare "decreto legislativo 346 1990"). Articoli chiave: art. 7 (aliquote/franchigie), art. 28 (obbligo/esoneri), art. 31 (termini).
- **D.Lgs 18 settembre 2024, n. 139** (riforma imposte indirette diverse dall'IVA - autoliquidazione): https://www.normattiva.it (cercare "decreto legislativo 139 2024").
- **D.Lgs 31 ottobre 1990, n. 347** (imposte ipotecaria e catastale).
- Provvedimenti/circolari AdE: Provvedimento del 13 febbraio 2025 (prot. 47335/2025); Circolare n. 3/E del 16 aprile 2025; Provv. n. 42444/2017 (abilitazione geometri alla trasmissione telematica).
- Gazzetta Ufficiale: https://www.gazzettaufficiale.it

## 14. Note di manutenzione
- Verificare e aggiornare aliquote, franchigie, soglie, termini e codici tributo ad ogni anno fiscale (e dopo ogni provvedimento AdE). Coordinare con @09 (contenuti datati) e @10 (testi legali).
- Questo file e la fonte di dominio: i capitoli che ne usano i contenuti (FAQ, guide, copy) devono linkarlo, non duplicarne i valori (regola anti-drift).
