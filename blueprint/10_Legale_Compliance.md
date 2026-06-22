# 10. Legale e Compliance

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-10
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @01_Executive_Summary, @04_Form_Multistep, @06_Area_Riservata, @08_Tracciamento, @11_Sicurezza, RIFERIMENTO_Successioni_Modello_e_Normativa
- Owner:

## Sintesi
Quadro dei vincoli legali e di compliance che condizionano sito, checkout, area riservata e CRM: abilitazione professionale, fiscalita delle successioni (autoliquidazione 2025), GDPR (ruoli, basi giuridiche, DPA, retention, DPIA), diritto di recesso del consumatore, antiriciclaggio, fatturazione e contratto/T&C.

> CAVEAT IMPORTANTE: questo capitolo definisce requisiti e impostazioni operative, ma i testi legali finali (informativa privacy, cookie policy, condizioni di vendita/T&C, DPIA) devono essere redatti o validati da un avvocato e da un commercialista. Il presente documento non costituisce consulenza legale.

---

## Stato attuale del progetto

### 1. Abilitazione professionale (prerequisito - SODDISFATTO)
- Lorenzo e geometra iscritto all'albo e abilitato ENTRATEL come intermediario per la trasmissione telematica di dichiarazioni di successione e volture (rif. Provv. AdE 42444/2017).
- Obbligo collegato: conservazione dell'originale della dichiarazione firmata dal cliente e della documentazione a supporto.
- Serve un mandato/incarico professionale esplicito conferito dal cliente prima dell'invio telematico.

### 2. Fiscalita delle successioni (impatta i contenuti del sito - YMYL)
> Sintesi operativa completa (modello 2025, esoneri, termini, aliquote/franchigie, imposte ipocatastali, software, link ufficiali) nella fonte di dominio: [RIFERIMENTO_Successioni_Modello_e_Normativa](RIFERIMENTO_Successioni_Modello_e_Normativa.md). Qui si tengono solo i riflessi legali/compliance.
- Dal 1 gennaio 2025 (D.Lgs. 139/2024) vige l'AUTOLIQUIDAZIONE: l'imposta di successione e calcolata e versata dal contribuente in sede di dichiarazione (quadro EF), con F24 entro 90 giorni dal termine di presentazione (cod. tributo 1539); rateazione possibile (acconto min. 20%).
- Imposte ipotecaria, catastale e di bollo: autoliquidate alla presentazione quando vi sono immobili.
- Principio guida per il copy: il sito vende solo l'ONORARIO; le imposte di Stato sono separate, comunicate al centesimo prima dell'invio e versate dall'erede. Nessun ricarico sulle imposte.
- Tutti i contenuti (calcolatore, FAQ, blog) devono riflettere l'autoliquidazione 2025 e riportare disclaimer "stima non vincolante".

### 3. GDPR (Reg. UE 2016/679)
- Ruolo: lo Studio Geom. Lorenzo Armellin e TITOLARE del trattamento.
- Responsabili del trattamento (data processor) da regolare con DPA: hosting/app, database e storage (es. Supabase/AWS), pagamenti (Stripe), email (Resend), messaggistica (Twilio/Meta WhatsApp), analytics (Google), eventuale OCR. Vedi @07_Stack per i fornitori effettivi.
- Categorie di dati: identificativi e di contatto, dati patrimoniali/finanziari, codice fiscale, documenti (carta d'identita, certificato di morte, visure). Trattamento ad alto rischio per natura finanziaria, larga scala e vulnerabilita degli interessati (persone in lutto).
- Basi giuridiche:
  - Esecuzione del contratto (art. 6.1.b) per l'erogazione del servizio e il form di preventivo.
  - Obbligo legale (art. 6.1.c) per conservazione fiscale/contabile.
  - Consenso (art. 6.1.a) per marketing/newsletter e per cookie non tecnici.
  - Legittimo interesse (art. 6.1.f) per sicurezza e prevenzione abusi, previo bilanciamento.
- Adempimenti previsti: informativa privacy, cookie policy, registro dei trattamenti (art. 30), valutazione DPIA (art. 35, verosimilmente necessaria), procedura data breach (notifica entro 72h), gestione diritti degli interessati.
- Misure di sicurezza: cifratura in transito e at-rest, Row Level Security, controllo accessi, minimizzazione; dettaglio in @11_Sicurezza.
- Trasferimenti extra-UE: preferenza per residenza dati in UE; se alcuni fornitori (es. Stripe, Meta) trasferiscono negli USA, basarsi su clausole contrattuali standard (SCC)/decisioni di adeguatezza.
- **Estrazione automatica dati dai documenti (OCR/AI, fast-follow V1.1)**: trattamento che usa OCR + AI per proporre una bozza di dati a Lorenzo (@05/@07). Da includere nella **DPIA** e nel registro dei trattamenti. Vincoli: fornitori **in UE** con **DPA** e **no-training** sui dati; e un **ausilio** (NON una decisione automatizzata con effetti giuridici ex art. 22 GDPR: la valutazione e sempre umana, di Lorenzo); base giuridica = esecuzione del contratto/servizio; minimizzazione dei dati inviati; retention dell'estratto allineata al documento sorgente (IBAN con policy dedicata). Informare l'interessato nell'informativa privacy.

### 4. Data retention (coerente con l'area cliente - risolve l'incoerenza degli appunti)
- Documenti fiscali/contabili e ricevute: conservazione minima 10 anni (art. 2220 c.c. e obblighi fiscali).
- Documenti di input sensibili caricati dal cliente (es. carta d'identita): minimizzazione; conservazione limitata al tempo necessario alla lavorazione, poi cancellazione dal cloud.
- IBAN: dato sensibile usato per l'autoliquidazione (F24); cifratura applicativa dedicata (@11) e cancellazione una volta esaurito l'uso, salvo obblighi.
- Archivio storico cliente: nell'area riservata restano scaricabili i DOCUMENTI FINALI (ricevute AdE, visure aggiornate, fattura), non gli input grezzi. Questo elimina la contraddizione "cancella dal cloud dopo 30 giorni vs archivio scaricabile" presente negli appunti.
- Cold storage su NAS locale: e un trattamento a sua volta, da mettere in sicurezza (vedi @11_Sicurezza, @12_Operations).

#### 4.1 Matrice di retention per tipo di documento/dato (PROPOSTA - da validare con commercialista/legale)
Principi: conservare il minimo indispensabile, per il tempo necessario alla finalita o agli obblighi di legge, poi cancellare. Ogni voce e collegabile a una categoria del `document_catalog` (@SPEC_Data_Model) cosi la regola e applicabile in automatico.

| Categoria | Esempi | Dove vive | Retention proposta | Base / motivazione |
|---|---|---|---|---|
| Input identificativi sensibili | Carta d'identita, codice fiscale erede/defunto, certificato di morte | Cloud (bucket privato) | Cancellazione **entro 30 gg dalla chiusura/consegna** della pratica | Minimizzazione GDPR; servono solo alla lavorazione |
| Input patrimoniali grezzi | Visure/atti di provenienza, rogiti, estratti conto, dossier titoli | Cloud (bucket privato) | Cancellazione **entro 30 gg dalla chiusura/consegna** | Minimizzazione; ricostruibili dalle fonti ufficiali |
| IBAN (per F24) | Coordinate per addebito autoliquidazione | DB cifrato (envelope, @11) | Cancellazione **subito dopo l'addebito/emissione F24** | Dato sensibile, finalita esaurita |
| Documenti finali della pratica | Dichiarazione di successione presentata, ricevute/protocolli AdE, visure aggiornate post-voltura | Area cliente + cold storage NAS | **10 anni** | Possibili accertamenti e bisogno dell'erede nel tempo |
| Documenti fiscali/contabili | Fattura onorario, ricevute di pagamento | Sistema contabile + archivio | **10 anni** | Art. 2220 c.c. e obblighi fiscali |
| Contratto/mandato e consensi | Incarico, consensi recesso/avvio immediato, conferme su supporto durevole | DB + archivio | **Durata del rapporto + 10 anni** | Prescrizione ordinaria (prova del consenso) |
| Dati account area cliente | Anagrafica, email, credenziali | DB | Fino a **cancellazione account** o **24 mesi di inattivita** | Finalita del servizio; minimizzazione |
| Comunicazioni/CRM | Timeline comunicazioni, note, to-do | DB | **Durata pratica + 24 mesi** | Gestione relazione e prova |
| Log applicativi/di sicurezza | Accessi, eventi, log audit | DB/log | **6-12 mesi** | Sicurezza e indagini incidenti (@11) |
| Backup | PITR / snapshot DB | Supabase | **Rolling (7-30 gg)** | Continuita operativa (@11/@12) |
| Cold storage NAS | Copia cifrata documenti finali | NAS QNAP (cifrato) | Allineata alle voci sopra (max **10 anni**) | Archivio; stessa durata della fonte |

Note operative:
- I conteggi partono da un evento chiaro: per gli input grezzi dalla **chiusura/consegna pratica**; per fattura/finali dalla **data documento**.
- La cancellazione e un job automatico (purge) con log dell'avvenuta eliminazione (@11/@12); eventuali blocchi legali (litigation hold) sospendono il purge.
- Le durate definitive vanno confermate dal commercialista/legale prima del lancio.

### 5. Diritto di recesso (Codice del Consumo, artt. 52-59)
- Vendita a distanza a consumatori: recesso di 14 giorni; per i servizi decorre dalla conclusione del contratto.
- Per iniziare la lavorazione subito senza obbligo di rimborso a piena esecuzione, al checkout occorre raccogliere:
  1) consenso espresso del consumatore all'avvio immediato della prestazione durante il periodo di recesso;
  2) presa d'atto che, a prestazione completata, il diritto di recesso si perde (art. 59.1.a);
  3) conferma su supporto durevole (email) ai sensi dell'art. 51.
- Se il cliente recede dopo l'avvio ma prima del completamento, paga l'importo proporzionale al servizio gia reso.
- Obblighi informativi precontrattuali (art. 49): identita del professionista, caratteristiche del servizio, prezzo totale, condizioni di recesso e modulo tipo.
- Trasparenza verso il cliente: oltre alle T&C formali, e prevista una **pagina pubblica dedicata `/recesso`** che spiega modalita e condizioni in linguaggio chiaro (vedi @03 e `bozze_legali/Recesso_e_Checkout_IT_BOZZA.md`), linkata dal checkout, dal footer e dall'area riservata.
- La garanzia commerciale "Soddisfatti o Rimborsati" e aggiuntiva e volontaria: va formulata in modo chiaro e non ingannevole (condizioni e tempi di rimborso espliciti).

### 5.1 Firma del mandato e dei consensi (PROPOSTA)
Strumento scelto per v1: **Firma Elettronica Semplice (FES) con accettazione tracciata**. Per un contratto di servizio B2C non e richiesta la firma qualificata; la FES e valida ed efficace (eIDAS / CAD art. 20-21), proporzionata, senza costi e a basso attrito.
- **Audit trail forte** per ogni accettazione: timestamp, IP, user-agent, **versione e hash del documento**, identita utente loggato; log immutabile (@11). Conferma su **supporto durevole** (email) ai sensi dell'art. 51 Cod. Consumo.
- **Collocazione nel flusso**:
  - Consensi essenziali (T&C, privacy, recesso/avvio immediato): al **checkout** (@04).
  - **Mandato/incarico**: nell'**area riservata** (`/area-riservata/mandato`), al primo accesso e **prima dell'avvio lavorazione**; evento `mandate_signed`, PDF con dati di audit, scaricabile (@06).
- **Delega di presentazione telematica** (Sogei): in v1 stessa accettazione tracciata; **fallback download -> firma -> upload** se un documento specifico richiede firma autografa.
- **Evoluzione futura**: FEA/FEQ tramite provider (Namirial/Yousign/InfoCert) solo se emergesse un'esigenza probatoria forte; non necessaria in v1.

### 6. Antiriciclaggio (D.Lgs. 231/2007) - NON applicabile
- I geometri NON rientrano tra i soggetti obbligati per l'attivita professionale tipica (verificato su art. 3). Nessun obbligo di adeguata verifica/segnalazione per le successioni.
- Eccezione: se Lorenzo esercitasse anche mediazione immobiliare iscritta, scatterebbero gli obblighi solo per quella veste.

### 7. Fatturazione e fiscalita dell'onorario (da validare col commercialista)
- Fattura elettronica via SdI obbligatoria.
- IVA 22% sull'onorario; contributo integrativo Cassa Geometri (CIPAG) addebitato in fattura.
- Imposte di Stato anticipate dal cliente: trattate come anticipazioni in nome e per conto (art. 15 DPR 633/72), fuori dalla base imponibile IVA, se gestite correttamente.
- Per clienti consumatori (B2C) non si applica la ritenuta d'acconto.

### 8. Contratto / Termini e Condizioni di vendita
- Oggetto e perimetro del servizio per ciascun pacchetto, con esclusioni esplicite.
- Responsabilita del cliente sulla veridicita e completezza di dati e documenti forniti.
- Tempi di consegna/SLA: decorrono dalla documentazione completa e validata (non dal pagamento) e si sospendono se mancano documenti; nel CRM corrisponde a `docs_approved_at` (@05). Vedi Condizioni di Vendita art. 7.
- Limitazioni di responsabilita dello Studio e foro competente.
- Condizioni della garanzia di rimborso (casi, importi, tempistiche).
- Separazione netta onorario vs imposte di Stato.
- Multilingua: le traduzioni di informativa, cookie policy e T&C servono alla comprensione, ma va indicata la **lingua prevalente (italiano)** in caso di discrepanza; il contratto col consumatore resta regolato dalla normativa italiana. I consensi (privacy/cookie) vanno mostrati nella lingua dell'utente.

### 9. Cookie banner e gestione del consenso (CMP)
Principio strategico: compliance e fiducia vanno nella stessa direzione. Il banner e il primo segnale di serieta verso un utente fragile (YMYL), quindi NIENTE dark pattern.

- **Cos'e una CMP**: Consent Management Platform. Mostra il banner, raccoglie e CONSERVA la prova del consenso (chi/quando/cosa), blocca i tag finche non c'e consenso e comunica lo stato ai tag via Consent Mode v2 (@08).
- **CMP certificata da Google (requisito)**: per il traffico SEE/UK con funzioni pubblicitarie (Google Ads/GA4), Google impone (dal 2024) l'uso di una CMP presa dalla lista ufficiale certificata e integrata con Consent Mode. Un banner non certificato puo far disattivare le funzioni Ads.
- **Perche NON fai-da-te**: un banner custom non e certificato (problemi con Ads) e ci caricherebbe la responsabilita di: archivio storico consensi a norma Garante, categorie granulari, scansione/blocco automatico degli script prima del consenso, ri-richiesta periodica, informativa e cookie policy sempre aggiornate alla legge. Troppo rischio/manutenzione per uno studio singolo.
- **Decisione**: usare una CMP certificata (proposta: **iubenda**; alternativa Cookiebot). Genera anche informativa e cookie policy in italiano a norma Garante. Noi implementiamo solo il "collante" con Consent Mode. Costo a canone gia previsto (@13).
- **Requisiti del banner (Garante/GDPR)**:
  - "Accetta" e "Rifiuta" con PARI evidenza (stesso peso visivo); terzo livello "Personalizza" con categorie granulari.
  - Nessuna casella pre-spuntata; lo scroll non e consenso; niente cookie wall.
  - Revoca del consenso semplice e sempre disponibile; ri-richiesta periodica (~6 mesi).
  - Testo chiaro e umano (no legalese), accessibile (tastiera/contrasto/focus, @03).
- **Comportamento tecnico**: Consent Mode v2 default "denied"; nessun tag Google prima del consenso; col rifiuto restano i ping cookieless per il modeling (@08).
- **Sfumatura GCLID (offline conversions)**: l'uso del GCLID a livello utente per l'offline conversion import rientra nel consenso "advertising". Se l'utente RIFIUTA, non lo usiamo a livello utente e ci affidiamo al modeling di Consent Mode (@08).
- **Cosa resta indipendente dal banner**: i KPI di business (lead, purchase, fatturato) sono dati di prima parte da DB e Stripe (server-side), quindi misurati SEMPRE; il banner impatta solo analytics comportamentale GA4 e attribuzione Ads.

---

## Idee future
- Firma elettronica avanzata/qualificata integrata per il mandato e la dichiarazione (oggi: vedi nodo dedicato).
- Generazione automatica di informativa e consensi versionati (audit trail dei consensi prestati).
- Modulo di "centro privacy" nell'area cliente per esercizio dei diritti (accesso, cancellazione, portabilita).

---

## Nodi da sciogliere
- [RISOLTO] Firma del mandato/incarico e dei consensi: **FES con accettazione tracciata** (timestamp, IP, versione+hash, log, conferma su supporto durevole); consensi al checkout, mandato in area riservata prima dell'avvio; fallback download->firma->upload per documenti che richiedono firma autografa; FEA/FEQ rimandata (par. 5.1). Da validare dal legale.
- Necessita o meno di un DPO: da valutare in base a volumi e natura del trattamento (probabile non obbligatorio ma da motivare).
- Durate di retention definitive per ciascuna tipologia di documento: matrice PROPOSTA pronta (par. 4.1), da confermare col commercialista/legale (in particolare 30 gg input grezzi e 10 anni finali/fiscali).
- Scelta del professionista (avvocato/commercialista) che redige/valida informativa, cookie policy, T&C e DPIA. PARZIALMENTE COPERTO: e disponibile la collaborazione di un **commercialista** (per la **validazione dei contenuti/calcoli fiscali**, l'autoliquidazione e i casi complessi); resta da individuare chi valida i testi puramente legali/privacy (informativa, cookie policy, DPIA): la cookie policy/informativa sono generate dalla CMP iubenda, il resto valutare un legale.
- Posizionamento marketing "geometra + supervisione commercialista": i claim devono essere VERITIERI e proporzionati al reale coinvolgimento (supervisione fiscale/casi complessi/revisione contenuti), non "ogni pratica revisionata" se non e cosi (no pratiche commerciali ingannevoli). Responsabilita di predisposizione/trasmissione in capo a Lorenzo (intermediario Entratel) (@01/@02/@09).
- Conferma trattamento IVA/Cassa e modalita di esposizione del prezzo (rimando @01 e @13).

## Passi successivi
- [ ] Incaricare un avvocato/commercialista per testi legali e DPIA.
- [ ] Redigere informativa privacy, cookie policy e condizioni di vendita/T&C. Prime BOZZE IT pronte (DA VALIDARE da legale): `bozze_legali/Privacy_Policy_IT_BOZZA.md`, `bozze_legali/Condizioni_di_Vendita_TC_IT_BOZZA.md`, `bozze_legali/Recesso_e_Checkout_IT_BOZZA.md`. (Cookie policy generata dalla CMP iubenda.)
- [ ] Stipulare i DPA con tutti i responsabili del trattamento (vedi @07_Stack), inclusi i fornitori OCR/AI in UE (Document AI/Azure + LLM UE) con clausola no-training.
- [ ] Includere il trattamento di estrazione OCR/AI nella DPIA e nel registro dei trattamenti.
- [x] Definire e documentare la matrice di retention per tipo di documento (par. 4.1, PROPOSTA da validare).
- [ ] Implementare il job di purge automatico con log e gestione litigation hold (@11/@12).
- [ ] Progettare nel checkout le checkbox di recesso (avvio immediato + perdita del diritto) + email di conferma su supporto durevole (vedi @04_Form_Multistep, @06_Area_Riservata).
- [ ] Predisporre registro dei trattamenti e procedura data breach.
- [ ] Validare il copy fiscale del sito (autoliquidazione, disclaimer "stima non vincolante").
- [ ] Attivare e configurare la CMP certificata (iubenda): banner Accetta/Rifiuta/Personalizza + Consent Mode v2 (@08) + cookie policy/informativa generate.

---

## Decisioni congelate (lock-in)
- Titolare del trattamento: Studio Geom. Lorenzo Armellin.
- Antiriciclaggio: non applicabile all'attivita tipica del geometra.
- Il sito incassa solo l'onorario; le imposte di Stato sono separate e a carico dell'erede.
- Recesso: avvio immediato della lavorazione subordinato a consenso espresso + accettazione della perdita del recesso a piena esecuzione, con conferma su supporto durevole.
- Firma: FES con accettazione tracciata (audit: timestamp, IP, versione+hash, log) per consensi (al checkout) e mandato (in area riservata, prima dell'avvio); fallback firma autografa via upload; FEA/FEQ non in v1 (par. 5.1).
- Retention: nell'area cliente restano i documenti FINALI; gli input sensibili sono minimizzati e cancellati dopo la lavorazione. Matrice di riferimento nel par. 4.1 (input grezzi ~30 gg dalla chiusura, documenti finali e fiscali 10 anni), applicata via job di purge automatico.
- Residenza dati: preferenza UE per tutti i fornitori dove possibile.
- Cookie/consenso: CMP certificata da Google (proposta iubenda), banner Accetta/Rifiuta a pari evidenza + Personalizza, niente dark pattern; Consent Mode v2 default "denied"; no CMP fai-da-te.

---

## Rischi / Compliance & Riferimenti
- Rischio recesso non gestito: senza le checkbox/consensi corretti, il cliente puo chiedere il rimborso anche dopo l'avvio dei lavori.
- Rischio GDPR: trattamento ad alto rischio; l'assenza di DPIA/DPA e di misure adeguate espone a sanzioni e danni reputazionali.
- Rischio fiscale-reputazionale (YMYL): copy non aggiornato all'autoliquidazione 2025.
- Rischio mandato: invio telematico senza incarico/firma valida del cliente.
- Riferimenti normativi (sintesi e link ufficiali nella fonte di dominio [RIFERIMENTO_Successioni_Modello_e_Normativa](RIFERIMENTO_Successioni_Modello_e_Normativa.md)):
  - D.Lgs. 139/2024 e Circolare AdE 3/E del 16/04/2025 (autoliquidazione).
  - Provv. AdE 42444/2017 (abilitazione geometri).
  - Reg. UE 2016/679 (GDPR), artt. 6, 9, 28, 30, 35.
  - D.Lgs. 206/2005 (Codice del Consumo), artt. 49, 51, 52-59.
  - D.Lgs. 231/2007, art. 3 (antiriciclaggio - soggetti obbligati).
  - Art. 2220 c.c. (conservazione documenti); art. 15 DPR 633/72 (anticipazioni).
