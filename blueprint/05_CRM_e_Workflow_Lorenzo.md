# 05. CRM Custom e Workflow di Lorenzo

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-05
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @04_Form_Multistep, @06_Area_Riservata, @07_Stack, @08_Tracciamento, @10_Legale_Compliance, @11_Sicurezza
- Owner:

## Sintesi
Il CRM e il cruscotto unico da cui Lorenzo gestisce le pratiche: una Kanban board con automazioni, scheda pratica di dettaglio, validazione documenti, comunicazioni automatiche (email/WhatsApp) ed export verso il gestionale. Trasforma Lorenzo da "rincorritore di documenti" a "pilota" che prende decisioni; segreteria e solleciti sono delegati al codice.

---

## Stato attuale del progetto

### Implementazione (codice) - aggiornato 2026-06-22
- CRM navigabile in `/crm` con gate **provvisorio** (cookie + `ADMIN_PASSWORD`; se vuoto, demo libera) — sara sostituito da Supabase Auth + 2FA (@11).
- **Dati reali dal database** (Supabase UE) in LETTURA: home operativa, pratiche (Kanban/Lista), scheda pratica `[id]`, contatti con storico, calendario, statistiche. KPI/alert/calendario sono DERIVATI dalle pratiche (`web/src/lib/crm.ts`).
- Tabelle `contacts` + `practices` con seed degli 8 contatti/8 pratiche del prototipo (codici `SUC-2026-0005..0012`); nuovi codici via sequence da 0013. Collezioni (checklist/comunicazioni/task/log) in jsonb per ora (@SPEC_Data_Model, Stato implementazione).
- Mini-CMS `/crm/listino`: modifica prezzi/testi/disponibilita di pacchetti e add-on con "Salva e pubblica" (scrive nel DB + `revalidatePath`). Testato dal vivo (490->495->490 riflesso sul sito).
- **Ancora da fare (scrittura/operativita reale)**: cambio stato pratica, validazione documenti (Approva/Rifiuta), automazioni email/WhatsApp, conguagli, recesso, export. La UI esiste, la logica server no.

### Linguaggio visivo (UI)
- Il CRM "Flowdesk - Armellin" si ISPIRA visivamente al CRM personale "Flowdesk - Maurotoncelli" (variante per Armellin): codice e funzionalita sono propri/diversi, ma gli ELEMENTI GRAFICI sono ripresi (dark mode, glassmorphism, accento indigo->viola).
- Stack: STESSO del resto del progetto (Next.js + Tailwind + shadcn/ui), per coerenza e ottimizzazione (un solo repo/toolchain, componenti e auth/Supabase/RLS condivisi). NON si replica il React+CSS vanilla del Flowdesk personale: si riprende solo il linguaggio grafico via design token.
- Token e pattern UI canonici + tema pronto all'uso: vedi @SPEC_Design_Tokens (sezione "Design system del CRM interno - Flowdesk - Armellin").
- Tema distinto da quello del sito pubblico (navy/oro, serif): il CRM e uno strumento di lavoro interno, denso ed efficiente.

### Accesso e sicurezza
- Il CRM e una WEB APP (no installazione classica): Lorenzo accede da browser a un URL dedicato (es. sottodominio admin), login passwordless + 2FA (@11).
- Installabile opzionalmente come PWA (icona desktop, finestra dedicata); aggiornamenti automatici, accessibile da qualsiasi dispositivo.
- Accesso riservato al solo ruolo ADMIN (Lorenzo). Isolamento dati tramite RLS (@11).
- Ogni azione rilevante registrata in un log eventi (audit) per tracciabilita/compliance (@10).
- Nota: l'unico software installato in ufficio e l'agente di sincronizzazione del cold storage (Synology Cloud Sync/Rclone), separato dal CRM (@12).

### Kanban board (pipeline) - allineata al pagamento anticipato
Colonne (stato pratica):
1. Nuovo Lead - generato dal form (@04).
2. Preventivo Inviato - Lorenzo ha proposto pacchetto e prezzo.
3. Pagato / Incaricato - checkout Stripe completato (incarico ufficiale).
4. In Attesa Documenti - cliente invitato a caricare i file in area riservata.
5. In Lavorazione - tutti i documenti approvati; Lorenzo lavora la pratica.
6. Inviata / Attesa AdE - dichiarazione trasmessa telematicamente (opzionale).
7. Chiusa - ricevute caricate e pratica completata.
- Stato trasversale: Persa / Annullata (con gestione recesso/rimborso e garanzia, @10 - vedi "Gestione recessi e rimborsi").

### "Tocca a chi?" - indicatore di azione (Riunione 1)
> Esigenza di Lorenzo: capire a colpo d'occhio, tra i lavori aperti, dove deve agire LUI e dove sta aspettando il cliente. Ogni card mostra un **badge azione** (`action_owner`, @SPEC_Data_Model), calcolato dallo stato + stato della checklist:
- **"Tocca a te"** (ADMIN, indigo): nuovo lead da contattare; documenti caricati da validare; tutti i documenti approvati -> da lavorare; pratica pronta da inviare all'AdE.
- **"In attesa del cliente"** (CLIENT, ambra): preventivo/link di pagamento inviato e non ancora pagato; documenti ancora da caricare o da rifare.
- **"In attesa AdE/esterni"** (EXTERNAL, grigio): dichiarazione inviata, in attesa di ricevute/voltura.
- **Nessuna azione** (NONE): pratica chiusa/persa/annullata.
- Il badge alimenta il filtro rapido "Cosa devo fare io oggi" e gli alert (pratiche ferme da X giorni).

### Viste, ricerca e filtri
- **Viste multiple** sullo stesso dataset, commutabili: **Kanban** (default, per fase), **Lista/Tabella** (densa, ordinabile e filtrabile), **Calendario** (vedi sotto). La scheda si apre da qualsiasi vista.
- **Ricerca globale** (barra in alto): per **codice pratica** (`SUC-AAAA-NNNN`), **codice fiscale del defunto**, nome defunto, nome/email/telefono del cliente. Match parziale e tollerante (utile al telefono).
- **Filtri combinabili**:
  - **Stato** pipeline (multi-selezione) e scorciatoie **"In corso" vs "Completate"** (Chiuse) vs **"Perse/Annullate"**.
  - **Azione richiesta**: Tocca a te / In attesa del cliente / In attesa AdE.
  - **Pagamento**: non pagato / link inviato / pagato / rimborsato; metodo (online/offline).
  - **Caratteristiche pratica**: immobili si/no, terreni/particelle agricole, su misura, urgente.
  - **Date**: per intervallo su apertura (`opened_at`), consegna prevista (`due_date`), decesso (`date_of_death`), scadenza 12 mesi, chiusura.
- **Ordinamento**: per scadenza piu vicina, piu ferme, importo, data apertura.
- **Viste salvate** (preset): es. "Da contattare", "Documenti da validare", "In scadenza < 30 gg", "In attesa pagamento". Conteggio per preset sempre visibile.

### Calendario lavori
> Esigenza di Lorenzo: un calendario con tutti i lavori collegati alle date chiave.
- Vista **mese/settimana/agenda** con i lavori posizionati per data; click sull'evento -> apre la scheda pratica.
- **Date mostrate** (toggle per tipo, con colore): apertura scheda (`opened_at`), **consegna prevista** (`due_date`), **scadenza legale 12 mesi** (derivata da `date_of_death`, evidenziata se vicina/superata), invio AdE (`submitted_at`), promemoria/follow-up.
- **Lo SLA di consegna decorre dall'approvazione di TUTTI i documenti** (`docs_approved_at`), NON dal pagamento: se il cliente impiega settimane/mesi a reperire i documenti, l'orologio della consegna non parte (Lorenzo non puo garantire una data senza i documenti). `due_date` resta vuota finche la pratica non e in Lavorazione, poi e suggerita automaticamente (= `docs_approved_at` + `packages.sla_days` in giorni lavorativi: proposta Semplice 5 / Completo 10 / Zero Stress 3, su misura concordato) e modificabile. Coerente con le Condizioni di Vendita art. 7 (@10).
- Le **scadenze 12 mesi** e le pratiche **in ritardo** sono evidenziate (coerente con gli "Alert intelligenti").
- (Idea futura) export/sync iCal in sola lettura verso il calendario personale di Lorenzo.

### Scheda pratica (detail view)
- **Identificativo pratica** ben visibile: codice umano `SUC-AAAA-NNNN` (es. SUC-2026-0001) usato per ricerca, email, fattura e a voce col cliente; il defunto e identificato dal **codice fiscale** (chiave di ricerca/dedup, @SPEC_Data_Model). L'uuid resta solo tecnico.
- Riepilogo automatico dai dati del form (defunto + CF, data decesso/urgenza, n. eredi, testamento, immobili si/no, terreni/particelle agricole, altri beni, fascia valore, esito A/B/C, pacchetto suggerito).
- Contatto cliente (nome, email, telefono) e relazione erede.
- Selezione/modifica pacchetto e prezzo.
- **Aree appunti** (modificabili da Lorenzo, salvate con updatePracticeNotes):
  - **Appunti chiamata** (`call_notes`): cosa emerge nella consulenza telefonica (sempre presente nel suo flusso).
  - **Note pagamenti** (`payment_notes`): estremi bonifico, accordi, promemoria.
  - **Note generali / appunti extra** (`notes`): qualsiasi annotazione interna sulla pratica.
- **Riepilogo acquisto/ordine**: composizione dell'ordine dallo snapshot `line_items` (pacchetto + add-on + sovrapprezzo immobili) con importi, **Totale onorario** (IVA/Cassa), nota imposte di Stato a parte, eventuali conguagli (`practice_adjustments`) e **fattura** (stato/scarica). E la STESSA vista che il cliente trova in "Il tuo acquisto" (@06): cosi Lorenzo e cliente guardano gli stessi numeri.
- **Pannello pagamenti** (vedi "Gestione pagamenti" sotto): stato, metodo, importi, pulsanti.
- **Pannello imposte di Stato e presentazione** (vedi "Imposte di Stato e presentazione AdE"): comunica al cliente le imposte calcolate e registra gli estremi di presentazione.
- **Pannello recesso/rimborsi** (vedi "Gestione recessi e rimborsi"): eventuali richieste del cliente (`withdrawal_requests`) con stato, finestra 14 giorni e azioni.
- **Tab Documenti**: checklist gestita della pratica con anteprima, stato per voce e Approva/Rifiuta (vedi "Checklist documenti gestita").
- **Pannello "Dati consigliati" (estrazione OCR/AI assistita, fast-follow V1.1)**: riepilogo dei dati letti automaticamente dai documenti caricati (defunto, eredi, dati catastali, saldi conti...), **correggibili a mano**, con indicatore di affidabilita e link al documento sorgente (vedi "Estrazione assistita dei dati dai documenti").
- **Cose da fare (To-Do)**: lista di promemoria manuali sulla pratica, con scadenza opzionale e casella Fatto/Da fare (vedi "Promemoria / To-Do").
- **Cronologia comunicazioni** (vedi sezione dedicata): diario di tutti i contatti col cliente.
- Timeline eventi (log) e pulsanti azione (vedi sotto).
- Generazione "Brogliaccio" PDF riassuntivo (logo studio + `practice_code`) per la lavorazione tecnica.
- Download "Dossier ZIP" ordinato dei documenti.

### Gestione pagamenti (dal CRM, Stripe invisibile)
Principio: Lorenzo gestisce TUTTO dal CRM, senza mai entrare nella dashboard Stripe. Il flusso primario e **assistito** (coerente con la sua prassi: c'e sempre una chiamata).

- **Flusso primario (assistito)**: lead -> chiamata di consulenza (allinea pacchetto/prezzo, anche su misura) -> "Invia link di pagamento" (`sendPaymentLink`/`sendPreventivo`) via email + opz. WhatsApp/SMS -> il cliente paga, idealmente mentre e ancora al telefono -> la card passa a PAGATO via webhook.
- **Self-service**: per i casi semplici (Esito B) il cliente puo pagare dal sito senza chiamata; stesso esito nel CRM.
- **Stato sempre visibile** sulla card: non pagato / link inviato (in attesa) / pagato / parzialmente rimborsato / rimborsato, con il **metodo** (Stripe vs offline).
- **Solleciti automatici** se il link non viene pagato (es. +24h, +72h), fino a pagamento o scadenza.
- **Pagamento offline (eccezione)**: se il cliente paga con bonifico o in studio, Lorenzo usa "Registra pagamento manuale" (`registerOfflinePayment`): importo, metodo (bonifico/contanti/altro), data, note -> pratica a PAGATO con `payment_method` offline e `payment_recorded_by=ADMIN`. NON e la strada principale (il pagamento anticipato online resta il cuore del modello: cash-flow, automazioni, conversioni tracciate), ma rispetta la realta dello studio. Promemoria fattura come semaforo manuale.
- **Conguagli e rimborsi**: vedi "Cambio pacchetto e conguaglio" e "Gestione recessi e rimborsi". Per pagamenti offline il conguaglio si registra a mano con nota.
- **Riconciliazione**: per i pagamenti online la verita e Stripe (riconciliato nel DB); per gli offline la verita e la registrazione manuale + prova allegata. La fattura resta nel software di fatturazione di Lorenzo.

### Automazioni (stato -> trigger)
| Transizione | Tipo | Automazione |
|-------------|------|-------------|
| Form submit -> Nuovo Lead | auto | notifica a Lorenzo (in-app + email); evento generate_lead (@08) |
| -> Preventivo Inviato | manuale | email al cliente con preventivo + link di pagamento |
| Pagamento Stripe -> Pagato/Incaricato | auto (webhook) | email conferma + invito upload + magic link area riservata; evento purchase (@08) |
| -> In Attesa Documenti | auto | (cliente carica i file) |
| Documento "Rifiuta" | manuale | WhatsApp/email al cliente: ricaricare il file (motivo) |
| Tutti doc approvati -> In Lavorazione | manuale | email di rassicurazione tempi |
| -> Inviata/Attesa AdE | manuale | (opzionale) email aggiornamento stato |
| -> Chiusa | manuale | email "pratica conclusa, documenti disponibili"; offline conversion a Google Ads (@08); dopo 48h richiesta recensione (@09) |
| Richiesta recesso (cliente/manuale) | semi-auto | apre pannello recesso: calcolo finestra 14gg + tipo rimborso suggerito; email conferma ricezione |
| Conferma rimborso (Lorenzo) -> Annullata | semi-auto | refund Stripe (totale/parziale) + email conferma (supporto durevole) + promemoria nota di credito + audit log |
| -> Persa/Annullata | manuale | gestione rimborso secondo garanzia (@10) |

> Tutte le transizioni a effetto esterno passano per conferma + invio email ritardato/annullabile: vedi "Sicurezza delle automazioni" qui sotto.

> Firma/footer standard delle email transazionali: tutte le email (conferme, solleciti, stati) chiudono con una **firma coerente** = Geom. Lorenzo Armellin (abilitato Entratel) · **supervisione fiscale di un commercialista** · recapiti studio. Stesso micro-segnale di fiducia di sito/Trust Bar (@03/@02), con claim veritiero (@10). Da riportare nei template (vedi passo successivo "Definire i template email/WhatsApp").

### Sicurezza delle automazioni (conferme, invio ritardato, annullamento)
Problema reale (Riunione 1): basta trascinare per sbaglio una card in "Chiusa" (o altra colonna) e parte un'automazione irreversibile (email al cliente, conversione Google Ads, richiesta recensione, refund). Servono protezioni a piu livelli:

- **Conferma sulle transizioni a effetto esterno**: spostare una card verso uno stato che invia comunicazioni al cliente o produce effetti esterni (Preventivo Inviato, Pagato, Lavorazione, Chiusa, Annullata/refund) apre un **modale di conferma** che riepiloga cosa accadra ("Verra inviata l'email X al cliente"). Niente automazione "silenziosa" sul semplice drag. Le transizioni neutre (note interne, riordino) non chiedono conferma.
- **Invio email con finestra di annullamento (stile "undo send")**: le email automatiche NON partono all'istante ma vengono **schedulate con un ritardo** (es. 60-120 s) sulla job queue (Inngest/Trigger.dev, @07). Compare una snackbar "Email inviata tra 90s - Annulla". Entro la finestra, Lorenzo annulla il job e nulla viene spedito.
- **Annulla ultima azione / ripristina stato**: ogni transizione e registrata nel log eventi (audit); il CRM espone "Annulla ultima azione" che riporta la card allo stato precedente e, se l'automazione collegata e ancora schedulata, la cancella. Se l'effetto e gia partito (email gia uscita, refund eseguito), l'undo NON e silenzioso: vedi rettifica.
- **Comunicazione di rettifica**: se una comunicazione e gia stata inviata per errore, il CRM offre un template pronto "Messaggio inviato per errore - ignora la comunicazione precedente" da spedire al cliente con un click. Evita confusione lato cliente.
- **Effetti non reversibili automaticamente** (refund Stripe, offline conversion a Google Ads): SEMPRE dietro conferma esplicita, mai su drag, e mai dentro la sola finestra di undo (il drag non li innesca: richiedono un pulsante dedicato).

### Cambio pacchetto e conguaglio (tutela dalla perdita)
Nasce dalla preoccupazione di Lorenzo (Riunione 1) di andare in perdita quando il cliente sceglie un pacchetto troppo basso per la reale complessita. Obiettivo: rendere il cambio pacchetto e la differenza di prezzo semplicissimi, in entrambe le direzioni.

- Nella scheda pratica: "Cambia pacchetto" -> il sistema calcola la **differenza** rispetto a quanto gia pagato.
- **Upgrade (cliente deve integrare)**: genera un **link di pagamento Stripe** per la sola differenza; al pagamento, la pratica si aggiorna (evento purchase incrementale, @08) e parte l'email di conferma.
- **Downgrade (rimborso differenza)**: esegue un **refund Stripe parziale** pari alla differenza, con email di conferma su supporto durevole (riusa l'infrastruttura recessi/rimborsi).
- Tutto tracciato nel log eventi (importo originario, nuovo pacchetto, conguaglio, esito). KPI: numero di cambi pacchetto (segnale di calibrazione del form/guida alla scelta).
- Prevenzione a monte: il form a 3 esiti (@04) + la **guida alla scelta del pacchetto** (appendice chiara, linkata al checkout) + l'invito alla **chiamata di riallineamento** riducono i casi di pacchetto sbagliato; il conguaglio e la rete di sicurezza quando capita comunque.

### Preventivo personalizzato (casi complessi, Esito C del form)
Per i casi oltre la fascia Zero Stress (>~800 EUR) o con complessita (terreni/particelle agricole, annessi, altri beni, eredi all'estero), NON esiste un 4o pacchetto pubblico (creerebbe confusione, Riunione 1). Il flusso:
- Il form instrada in Esito C: lead in CRM con flag "preventivo su misura" e i dati di complessita.
- Lorenzo fa la chiamata di consulenza, poi nella scheda imposta un **importo personalizzato** e usa la transizione "Preventivo Inviato" -> email al cliente con il preventivo dedicato + link di pagamento Stripe per quell'importo.
- Da li il flusso prosegue identico (Pagato -> Attesa Doc -> ...). Il "su misura" e quindi solo un prezzo libero sulla pratica, non una nuova pipeline.

### Checklist documenti gestita (validazione + personalizzazione)
> Obiettivo (Riunione 1): Lorenzo deve gestire molte tipologie di documenti in modo chiaro e semplice, decidere cosa serve davvero per QUELLA pratica e poter aggiungere casi particolari. La checklist e UNICA e condivisa: quello che Lorenzo configura nel CRM e esattamente cio che il cliente vede e carica in area riservata (@06). Modello dati: `document_catalog` + `document_requirements` + `documents` (@SPEC_Data_Model).

**Come si presenta nel CRM (scheda pratica -> tab Documenti)**
- Una **lista a righe**, una riga per documento richiesto. Per ogni riga:
  - **etichetta chiara** (es. "Carta d'identita di Maria Rossi (erede)") + indicatore **Obbligatorio / Facoltativo**;
  - **stato della voce** (`requirement_status`): Atteso / Caricato / Approvato / Rifiutato / Non applicabile;
  - **file allegato** dal cliente con **anteprima nel CRM** (no download su PC) e, se piu file, lista;
  - **pulsanti Approva / Rifiuta** (Rifiuta con motivo predefinito o libero -> innesca la comunicazione automatica al cliente).
- **Contatore** in cima: "Approvati X di Y obbligatori" -> Lorenzo capisce a colpo d'occhio se la pratica e completa.

**Generazione automatica + personalizzazione**
- Alla transizione a Pagato/Attesa Documenti, il sistema **genera la checklist dal catalogo** filtrando per pertinenza (immobili -> visure/atti/planimetrie; testamento -> verbale; eredi minorenni -> autorizzazione GT; ecc.). Lorenzo parte gia con la lista giusta, non da zero.
- Lorenzo puo poi **modificare la checklist della singola pratica**:
  - **Aggiungi voce** da catalogo (tipo standard non incluso) o **voce libera** ad hoc;
  - **Obbligatoria <-> Facoltativa** (toggle per riga);
  - **Segna "Non applicabile"**: la voce non serve per quel caso -> sparisce dalla vista del cliente ma resta tracciata nel CRM (audit), niente cancellazioni "silenziose";
  - **Rimuovi** una voce aggiunta per errore; **riordina** (sort order); personalizza **etichetta** e **istruzioni** (help text mostrato al cliente).

**Tipi documento custom (caso particolare)**
- Se capita una pratica fuori standard, Lorenzo crea un **nuovo tipo di documento** direttamente dal gestionale (etichetta + istruzioni + obbligatorio/facoltativo): entra subito nella checklist di quella pratica e quindi nella **checklist condivisa col cliente**.
- Al salvataggio sceglie lo scope: **solo questa pratica** (voce ad hoc, default) oppure **salva nel catalogo** per riusarlo su pratiche future (`document_catalog.is_custom`). Cosi il catalogo cresce in modo controllato senza moltiplicare tipi inutili.

**Coerenza con il cliente e retention**
- Il cliente vede la stessa lista con 3 stati semplici (Da caricare / Caricato / Da rifare); "Approvato" e interno (@06). Le voci aggiunte/rese custom da Lorenzo compaiono automaticamente nella sua checklist; le "Non applicabili" no.
- Distinzione retention: i documenti di input sensibili sono minimizzati/cancellati dopo la lavorazione; restano i documenti finali (@10).

### Estrazione assistita dei dati dai documenti (OCR/AI) - fast-follow V1.1
> Esigenza (Riunione 1): far risparmiare tempo a Lorenzo nella compilazione su Sogei. Un servizio OCR + AI legge i documenti caricati e **predispone una bozza dei dati utili**, presentata come riepilogo nella scheda pratica e **correggibile a mano**. Principio cardine (YMYL): l'AI **propone**, Lorenzo **decide** sempre. Funzione dietro **feature flag**, non nell'MVP di lancio (per non rischiare la data di fine agosto); progettata ora.

**Pipeline (asincrona, dopo lo scan malware)**
1. Cliente carica un documento (area riservata) -> 2. **scansione malware** (ClamAV, @11): se infetto, stop; 3. **OCR** (estrae testo/layout); 4. **estrazione AI**: mappa il testo su **campi strutturati per tipo documento**; 5. salvataggio in `document_extractions` (dati + **confidence per campo** + riferimento documento/pagina); 6. aggregazione nel **"Riepilogo dati consigliati"** della pratica; 7. **Lorenzo rivede/corregge**; 8. i dati confermati velocizzano la compilazione su Sogei.
- Gira come **job in background** (Inngest/Trigger.dev, @07) con retry: non blocca l'upload ne il cliente. Eseguibile anche **on-demand** ("Rielabora documento").

**Cosa estrae (priorita per valore)**
- **Dati catastali** dalle visure: comune, foglio, particella, subalterno, categoria, rendita -> il dato piu prezioso (e quello che Lorenzo verifica e che fa saltare le pratiche, @01).
- **Defunto/eredi**: nome, codice fiscale, data/luogo, grado di parentela (da certificati/stato di famiglia).
- **Saldi conti** alla data del decesso (da estratti/attestazioni bancarie).
- **IBAN** per F24: dato sensibile, **cifratura applicativa** dedicata e cancellazione dopo l'uso (@11/@10).

**Come si presenta nel CRM (scheda pratica -> pannello "Dati consigliati")**
- Riepilogo a sezioni (Defunto / Eredi / Immobili / Conti / Altro) con i campi proposti.
- Per ogni campo: **valore proposto**, **indicatore di affidabilita** (alta/media/bassa), **icona "sorgente"** che apre il documento/pagina da cui e stato letto, e **campo editabile** (override sempre disponibile).
- I campi a **bassa affidabilita** sono evidenziati (Lorenzo li controlla per primi). Pulsanti **"Conferma tutto"**, **"Conferma campo"**, **"Rielabora"**.
- Stato di estrazione per documento (in coda / elaborato / errore) e azione "Rielabora".
- I dati confermati confluiscono nel Brogliaccio PDF e nel riepilogo pratica.

**Privacy/sicurezza (vincoli)**
- Provider **gestito in UE** (es. Google Document AI / Azure Document Intelligence in regione UE) + LLM **UE** (es. Mistral / Azure OpenAI UE), con **DPA** e **no-training** sui dati (@07/@10/@11).
- Trattamento da inserire in **DPIA**; e un ausilio (nessuna decisione automatizzata con effetti legali: decide Lorenzo). Minimizzazione e retention come per gli input sensibili (@10).
- **Limite dichiarato**: Sogei non offre un import automatico affidabile -> l'output e un **report che velocizza l'inserimento manuale**, non un push dentro Sogei (verifica con Lorenzo se la sua versione accetta import file, DOMANDE).

### Cronologia comunicazioni (diario relazione cliente)
> Esigenza di Lorenzo (Riunione 1): tenere traccia di TUTTO ció che passa col cliente, non solo le automazioni. Nella scheda pratica un **diario unico in ordine cronologico** (`communications`, @SPEC_Data_Model), distinto dal log tecnico delle azioni.
- **Voci automatiche** (`source=AUTO`): ogni email/WhatsApp/SMS inviato dalle automazioni (conferma pagamento, invito upload, documento rifiutato, solleciti, chiusura...) compare qui con canale, oggetto e data/ora.
- **Registrazione manuale** (`source=MANUAL`): pulsante **"Registra comunicazione"** -> Lorenzo annota un contatto avvenuto fuori dal sistema (chiamata inattesa, email/PEC ricevuta, messaggio, contatto in studio). Campi: **canale** (telefono/email/WhatsApp/di persona/altro), **direzione** (in entrata/in uscita), **data e ora** (default ora corrente, **modificabili** per registrare a posteriori), **oggetto** e **note** libere.
- **Visualizzazione**: timeline con icona per canale, freccia entrata/uscita, badge "Auto/Manuale", testo/sintesi e timestamp; filtrabile per canale.
- Niente invii da qui: la registrazione manuale **documenta** un contatto gia avvenuto, non invia nulla (gli invii restano le automazioni/azioni dedicate).

### Clienti stranieri: canale e strumenti (Riunione 1)
> Lorenzo parla italiano e poco inglese. Per i clienti stranieri (target rilevante, @09) la regola e: capirsi senza stress, ma mettere i punti vincolanti per iscritto (YMYL).
- **Canale primario = scritto tradotto**: WhatsApp/email nella lingua del cliente, tradotti con strumenti di qualita (es. DeepL). Asincrono, preciso, lascia traccia nella cronologia comunicazioni.
- **Voce quando serve**: chiamata con **traduzione in tempo reale** (telefono con traduzione nativa di sistema, oppure app su vivavoce tipo Google Traduttore/Apple Traduci) o **video call con sottotitoli tradotti** (Google Meet) per i casi importanti.
- **Punti chiave sempre per iscritto**: importi, scadenze e lista documenti vengono riepilogati per iscritto nella lingua del cliente (rileggibili), anche dopo una telefonata.
- **Documenti vincolanti in italiano**: i testi legali/ufficiali fanno fede in italiano (@10); la traduzione serve alla comprensione, non sostituisce l'originale.
- In pratica nessun strumento "blocca" il lavoro: e una prassi operativa + una leva di marketing ("assistenza nella tua lingua", @09).

### Gestione recessi e rimborsi (semi-automatica, dentro il CRM)
Obiettivo: gestire il diritto di recesso e i relativi rimborsi senza uscire dal CRM, in linea con il workflow di Lorenzo (il sistema calcola e propone, Lorenzo conferma con un click). Base legale e testi: @10 e `bozze_legali/Recesso_e_Checkout_IT_BOZZA.md`.

- **Ingresso della richiesta** (entrambe confluiscono in `withdrawal_requests`, visibili nel CRM con stato RICHIESTO/IN_GESTIONE/RIMBORSATO/NON_DOVUTO):
  - Cliente: pulsante "Richiedi recesso" nell'area riservata (visibile finche la pratica non e completata) -> crea la richiesta + notifica/alert a Lorenzo nella home operativa e nella scheda.
  - Oppure manuale: Lorenzo registra nel CRM un recesso ricevuto via email/PEC/modulo, allegando la comunicazione.
- Lorenzo gestisce e avanza la richiesta dal pannello (`handleWithdrawal`): la stessa richiesta del cliente diventa l'oggetto su cui lavora, senza doppie registrazioni.
- **Pannello recesso nella scheda pratica** (assistente alla decisione): mostra automaticamente
  - data di conclusione del contratto e stato della finestra dei 14 giorni (entro/oltre termine);
  - se al checkout sono stati prestati i consensi "avvio immediato" + "presa d'atto perdita recesso" (audit trail dai consensi, @04/@06);
  - stato attuale nella pipeline (Pagato / In Attesa Doc / In Lavorazione / Inviata / Chiusa);
  - **tipo di rimborso suggerito** in base allo stato:
    - lavorazione NON avviata -> rimborso INTEGRALE dell'onorario;
    - avviata ma non completata -> rimborso PARZIALE proporzionale (Lorenzo imposta %/importo del lavoro gia svolto: e una valutazione umana, obbligazione di mezzi);
    - servizio COMPLETATO -> nessun rimborso dovuto (recesso perso, art. 59), con comunque risposta tracciata.
- **Esecuzione rimborso (Stripe)**: pulsante "Esegui rimborso" -> crea un refund Stripe (totale o parziale) sull'importo del pagamento originale; operazione idempotente; il webhook `charge.refunded` aggiorna lo stato a "Rimborsato" e registra refund id, importo e data nel DB.
- **Comunicazioni automatiche** (Resend, supporto durevole): email di conferma ricezione del recesso e, a rimborso eseguito, email di conferma con importo e tempistica.
- **Pipeline e audit**: la pratica passa ad "Annullata" con metadati del recesso (data richiesta, canale, tipo rimborso, importo, esito); ogni passaggio finisce nel log eventi (audit) come prova.
- **Fatturazione (semaforo, non auto)**: se la fattura e gia stata emessa, il rimborso richiede una **nota di credito** nel software di fatturazione. Il CRM segnala il promemoria ma NON la emette in autonomia (dipende dal gestionale di Lorenzo, DOMANDE_PER_LORENZO).
- **KPI**: tasso di recesso, importi rimborsati, distribuzione per stato (in dashboard).

> Principio: il CRM automatizza calcolo, esecuzione tecnica (Stripe), comunicazioni e tracciamento; la DECISIONE sull'importo proporzionale e la nota di credito restano umane. Niente rimborsi automatici senza conferma di Lorenzo.

### Imposte di Stato e presentazione AdE (trasparenza + prova)
> Due momenti tipici della lavorazione, emersi dall'esempio reale (RIFERIMENTO 11.1): comunicare al cliente le imposte PRIMA dell'invio (promessa di trasparenza, FAQ @03) e registrare la PROVA di avvenuta presentazione dopo l'invio.
- **Comunica imposte** (`communicateTaxes`): nella scheda pratica Lorenzo inserisce il **totale imposte di Stato** (`state_taxes_amount`) e il **dettaglio** (`state_taxes_breakdown`: ipotecaria, catastale, bollo, tributi speciali, imposta di successione). Al salvataggio: si valorizza `state_taxes_communicated_at`, il cliente le vede in "Il tuo acquisto"/dashboard (@06), parte una comunicazione (email) e si registra in cronologia (`communications` AUTO) e nel log (`imposte_comunicate`). Copy che ribadisce: imposte separate dall'onorario, versate allo Stato con F24, nessun ricarico.
- **Registra presentazione** (`recordSubmission`): al passaggio a INVIATA Lorenzo incolla gli estremi dall'**Attestazione AdE** in `submission_info` (protocollo telematico, volume/numero/anno di registrazione, ufficio competente, n. pagine) e carica il PDF dell'attestazione come documento finale (`RECEIPT`, is_final) insieme alla copia della dichiarazione (`SUCCESSION_DECLARATION`). Valorizza `submitted_at`; log `dichiarazione_presentata`. Questi estremi sono cercabili e mostrati al cliente come prova.
- Nota: il versamento delle imposte (F24/addebito su IBAN) e a carico dell'erede; il sito incassa solo l'onorario (@01/@10). L'IBAN per l'eventuale addebito si raccoglie in `/area-riservata/dati` (@06).

### Export verso il gestionale (ponte)
- Gestionale CONFERMATO (Riunione 1): Lorenzo usa **Sogei - Successioni Online** (software dell'Agenzia delle Entrate), non DeCuius/DE.A.S.
- Conseguenza: il "ponte" probabilmente NON e un CSV verso un gestionale di terze parti, ma deve agevolare il reinserimento dei dati nel software AdE. Valore reale in v1 = **Brogliaccio PDF** ordinato (anagrafiche, eredi, immobili, dati catastali) da cui Lorenzo ricopia/verifica in Sogei.
- DA VERIFICARE (DOMANDE_PER_LORENZO): Sogei Successioni Online consente l'import di un tracciato esterno? Se si, definire il formato; se no, l'export resta un Brogliaccio leggibile (no integrazione automatica).

### Realtime e produttivita
- Aggiornamento istantaneo delle card via Supabase Realtime (@07).
- Ricerca/filtri (per stato, urgenza, cliente), reminder/scadenze (es. termine 12 mesi).

### Anagrafica clienti e storico (contacts)
- Entita Contatto/Cliente separata (`contacts`, @SPEC_Data_Model): un contatto puo avere piu pratiche nel tempo.
- Scheda contatto con storico completo delle pratiche collegate (stati, importi, date) e note interne.

### Rubrica / lista contatti acquisiti
- Elenco filtrabile/ricercabile di tutti i contatti (lead e clienti), con provenienza (source), consenso marketing, ultima attivita.
- Esportabile; base per eventuali azioni di follow-up (nel rispetto del consenso, @10).

### Scheda lavoro
- E' la vista di dettaglio della pratica (gia descritta): "scheda lavoro" e il nome usato nel CRM.

### Home operativa (dashboard di lavoro) (Riunione 1)
> La schermata di apertura del CRM: in pochi secondi Lorenzo capisce "a che punto sono e cosa devo fare adesso". Orientata all'AZIONE (diversa dalla Dashboard statistiche, orientata ai numeri).
- **Riepilogo lavoro (card di sintesi, cliccabili -> aprono la lista filtrata)**:
  - **Schede attive** (pratiche aperte non chiuse/perse), con breakdown "Tocca a te / In attesa del cliente / In attesa AdE".
  - **Completate nell'anno** (Chiuse nell'anno solare corrente) + confronto col mese.
  - **Da fare velocemente**: pratiche con badge "Tocca a te", documenti da validare, pagamenti in attesa.
  - **In scadenza** (termine 12 mesi vicino) e **pratiche ferme** da troppi giorni.
- **Alert automatici** (pannello dedicato, generati dal sistema, non AI): scadenza 12 mesi vicina/superata, pratiche silenti/ferme da X giorni, documenti caricati da validare, link di pagamento non pagati, consegne (`due_date`) imminenti/scadute. Ogni alert e cliccabile e porta alla pratica.
- **I miei To-Do (oggi / in arrivo / arretrati)**: widget con i promemoria di Lorenzo (vedi sotto), spuntabili direttamente dalla home.
- **Prossimi impegni**: mini-vista del Calendario (consegne e scadenze dei prossimi giorni).

### Promemoria / To-Do (annotazioni di Lorenzo)
> Esigenza (Riunione 1): Lorenzo deve potersi segnare a mano cosa fare, sia legato a una pratica sia in generale, e spuntarlo quando e fatto. Modello: tabella `tasks` (@SPEC_Data_Model).
- **To-Do sulla scheda lavoro**: nella scheda pratica una piccola lista "Cose da fare" -> **"Aggiungi promemoria"** con testo libero e **scadenza opzionale**; ogni voce ha una **casella Fatto/Da fare** (con data di completamento).
- **To-Do generali** (non legati a una pratica): es. "chiamare il commercialista" -> stessa lista, `practice_id` nullo.
- **Aggregazione in home**: tutti i To-Do confluiscono nel widget "I miei To-Do" della home operativa, raggruppati in **Oggi / In arrivo / Arretrati** (in base alla scadenza) e spuntabili da li; quelli legati a una pratica linkano alla scheda.
- Manuali e semplici: non inviano nulla al cliente (sono promemoria interni), distinti dagli alert automatici di sistema e dalle scheduled_actions.

### Gestione contenuti del sito (CMS dal CRM) (Riunione 1)
> Sito data-driven: Lorenzo aggiorna prezzi, descrizioni, FAQ, testi e foto dal CRM, senza toccare il codice. Architettura e performance: sito statico + revalidation on-demand (@07); modello dati `packages`/`faqs`/`content_entries`/`media_assets` (@SPEC_Data_Model).
- **Pacchetti & prezzi & SLA**: editor dei pacchetti (nome, descrizione, voci incluse, **prezzo**, sovrapprezzo per immobile, **SLA di consegna `sla_days` in giorni lavorativi**, badge, ordine, attivo si/no) e degli **add-on/upsell** (es. Riunione di Usufrutto: nome, prezzo, attivo). Tutto collegato: modificando un pacchetto, alla pubblicazione si aggiornano **pagina Tariffe e checkout** (prezzo + claim "invio entro X gg lavorativi"), e il **`due_date` suggerito** nelle nuove pratiche usa il nuovo `sla_days` (@04/@05). Per ogni campo "sensibile" un promemoria: cambio **prezzo** -> "rivedi le Condizioni di Vendita"; cambio **SLA** -> "aggiorna/valida l'art. 7 delle Condizioni di Vendita" (@10). Le pratiche gia avviate restano invariate (snapshot `line_items` e `due_date` gia calcolato).
- **FAQ**: CRUD con riordino, categoria, pubblica/bozza; alimentano /faq e l'eventuale blocco in homepage (schema FAQPage, @09).
- **Testi del sito**: editor dei blocchi chiave (hero, sezioni delle pagine core, microcopy) per chiave logica; non un page-builder libero.
- **Immagini**: caricamento/sostituzione con testo alternativo (alt) nel bucket pubblico `site-assets`; ottimizzate via next/image.
- **Flusso Bozza -> Anteprima -> Pubblica**: Lorenzo modifica in bozza, vede l'**anteprima** (Draft Mode), poi **pubblica** -> il sito si aggiorna in pochi secondi (revalidation), senza redeploy. Storico versioni per audit/rollback; ogni modifica nel log eventi.
- **i18n**: si edita l'italiano (fa fede, @10); le altre lingue possono essere riempite via AI (@07). Il CRM resta in italiano.

### CMS - Manager per collection (mappa operativa)
> Ogni "collection" del registro `SPEC_Content_Blocks` ha un editor dedicato nel CRM. I blocchi testuali stanno in `content_entries` (seed iniziale: `seed/content_entries.it.json`); i contenuti strutturati hanno tabelle proprie. Regola UI: form a campi tipizzati (validati Zod), NON un page-builder libero; ogni campo mostra etichetta umana, tipo e aiuto. Tutti i manager seguono Bozza -> Anteprima -> Pubblica con versioni.
- **Globali** (`navbar`, `globals`, `footer`, `settings`): editor unico "Impostazioni sito" -> menu, CTA, telefono/WhatsApp/email/PEC, indirizzo, orari, selettore lingue, riga di fiducia, credit, social.
- **Home** (`home`): editor a sezioni (hero, trust bar, social proof, problema, come funziona, tariffe-estratto, anti-obiezione, recensioni, chi sono-estratto, faq-estratto, CTA finale).
- **Tariffe**: due aree -> **Pacchetti/Add-on** (tabelle `packages`/`addons`: prezzo, voci, `sla_days`, sovrapprezzo, badge) + **testi pagina** (`tariffe`).
- **Pagine semplici** (`chi_siamo`, `documenti`, `recesso`, `come_funziona`, `contatti`, `guide`, `article`, `preventivo`, `grazie`, `checkout`, `sistema`): editor "Pagina" con i campi della collection.
- **FAQ** (`faqs`): CRUD domande/risposte con categoria, ordine, flag homepage, pubblica/bozza (i testi-pagina `faq` sono nel manager pagina).
- **Guide/Articoli** (`articles`): editor articoli (titolo, slug, excerpt, body, categoria, cover, autore/revisore, pubblicazione); i blocchi ricorrenti (`article`) sono testi globali.
- **Immagini** (`media_assets`): libreria asset del bucket `site-assets` con `key`, alt text, sostituzione; i blocchi `image_ref` puntano qui via `asset_key`.
- **Legale** (`legale`): per Privacy/Cookie embed iubenda; T&C/Garanzia editor testo versionato (validare con legale, @10).
- **Documenti/checklist** (`document_catalog`): non e "contenuto sito" ma alimenta la guida `/documenti-successione` e le checklist (gestito nel tab Documenti/Catalogo, vedi "Checklist documenti gestita").
- **Permessi**: scrittura solo ADMIN (RLS @11); `/api/revalidate` protetto; contenuti sanitizzati (no stored XSS).

### Dashboard statistiche (KPI) - v1 base
- KPI nativi calcolati dal DB/Stripe (verita operativa/finanziaria):
  - Numero lavori (totali e per mese), pratiche per stato.
  - Guadagni/fatturato onorari, ticket medio.
  - Tasso di conversione lead -> cliente, tempi medi di lavorazione.
- Fonti di verita delle metriche (per evitare numeri discordanti):
  - Lavori/stati/tempi: DB (`practices`, `log_events`).
  - Incassi: Stripe (riconciliati nel DB).
  - Fiscale (fatture): software di fatturazione.
  - Traffico/funnel: GA4. Spesa pubblicitaria: Google Ads.
  - Metriche combinate (ROI/ROAS/CAC): DB+Stripe (ricavi) / Google Ads (spesa).

### Sezione Analytics (ibrida)
- KPI operativi/finanziari nativi (dal DB) dentro il CRM.
- Dashboard marketing (traffico, CPL, spesa, ROAS) via Looker Studio embeddato (GA4 + Google Ads) (@08).
- Le metriche ROI/CAC complete sono previste in fase 2 (vedi Idee future).

### Assistente AI interno (solo a supporto di Lorenzo)
- Scelta strategica: l'AI e usata SOLO lato interno (CRM), a supporto di Lorenzo. NESSUNA chat AI pubblica lato cliente (deciso: in un settore YMYL e di lutto, l'errore/allucinazione e troppo rischioso e contraddice il brand personale).
- Sempre "human-in-the-loop": l'AI propone, Lorenzo verifica e conferma. L'AI non invia mai nulla in autonomia al cliente ne fornisce consulenza fiscale/legale vincolante.
- Capacita previste (a regime, fase 2):
  - Alert intelligenti: scadenze (termine 12 mesi), pratiche ferme/silenti, documenti mancanti, anomalie nel flusso.
  - OCR/estrazione documenti (visure, certificati, estratti conto) per pre-compilare anagrafiche/eredi/dati catastali: vedi sezione dedicata "Estrazione assistita dei dati dai documenti" - pianificata come fast-follow V1.1.
  - Bozze testi: email per i cambi di stato e note interne, pronte da rivedere.
  - Riassunti: sintesi dei documenti caricati / della pratica per velocizzare la lavorazione.
- Vincoli: elaborazione su dati minimizzati e conforme GDPR (@10); registro azioni AI nel log eventi; nessun dato sensibile inviato a servizi non conformi (DPA, @10/@11).

---

## Idee future
- OCR su carta d'identita/tessera sanitaria per pre-compilare anagrafiche (@07, dopo v1).
- Rinomina automatica file in cloud con nomenclatura fissa (es. Cognome_Nome_TipoDoc.pdf).
- Modelli di nota/preventivo riutilizzabili e calcolo imposte assistito.
- Statistiche marketing avanzate e ROI/CAC completi (fase 2): incrocio ricavi DB/Stripe con spesa Google Ads e attribuzione per canale (@08).
- Pagamento in due tranche (50/50) per pacchetti alti (Zero Stress).

---

## Nodi da sciogliere
- Sogei Successioni Online consente import di un tracciato esterno o l'export resta solo Brogliaccio PDF? (DOMANDE_PER_LORENZO, @07).
- Durata della finestra di annullamento email (60 vs 120 s) e quali transizioni richiedono conferma "forte" (digitare/seconda spunta) vs conferma semplice.
- Cambio pacchetto: il cliente puo richiederlo dall'area riservata o e azione solo di Lorenzo? (impatta @06).
- WhatsApp attivo in v1 o solo email per i solleciti? (impatta @07/@13).
- [RISOLTO] Firma del mandato/dichiarazione: **FES con accettazione tracciata** (audit: timestamp, IP, versione+hash, log); consensi al checkout, mandato in area riservata prima dell'avvio lavorazione (evento `mandate_signed`); fallback firma autografa via upload (@06/@10).
- Quali stati attivano email automatiche obbligatorie vs facoltative (rifinire la tabella).
- Gestione operativa del rimborso (garanzia) in stato Persa/Annullata.
- [RISOLTO] Recesso self-service in v1: SI. Il cliente avvia la richiesta da `/area-riservata/recesso` (crea `withdrawal_requests`) che entra nel pannello recesso del CRM; resta possibile anche via email/PEC + modulo tipo (@06/@10).
- Nota di credito: integrabile col software di fatturazione di Lorenzo o resta passo manuale (DOMANDE_PER_LORENZO)?
- Default del rimborso parziale: criterio/percentuali suggerite per stato di avanzamento.

## Passi successivi
- [ ] Validare le colonne Kanban e le regole di transizione (manuale/auto).
- [ ] Definire i template email/WhatsApp per ogni trigger (testi) con @10.
- [ ] Definire il layout della scheda pratica e i campi del Brogliaccio PDF.
- [ ] Definire lo schema dati pratica/documenti/log coerente con @07 e @11.
- [ ] Definire il formato di export gestionale dopo le risposte di Lorenzo.

---

## Decisioni congelate (lock-in)
- Pipeline allineata al pagamento anticipato: Lead -> Preventivo Inviato -> Pagato/Incaricato -> Attesa Documenti -> Lavorazione -> (Inviata) -> Chiusa, con stato Persa/Annullata.
- Indicatore di azione su ogni pratica (`action_owner`): "Tocca a te" / "In attesa del cliente" / "In attesa AdE", per vedere a colpo d'occhio dove agire.
- Viste multiple (Kanban / Lista / Calendario) sullo stesso dataset; ricerca globale per codice pratica, CF defunto, nome/email/telefono; filtri combinabili (stato, in corso vs completate, azione, pagamento, caratteristiche, date) + viste salvate.
- Calendario lavori con date chiave collegate: apertura scheda, consegna prevista, scadenza 12 mesi (derivata dal decesso), invio AdE; pratiche in scadenza/ritardo evidenziate.
- SLA di consegna decorre dall'approvazione di TUTTI i documenti (`docs_approved_at`), non dal pagamento; `due_date` suggerita = docs_approved_at + SLA pacchetto, modificabile. Coerente con Condizioni di Vendita art. 7 (@10).
- Cronologia comunicazioni per pratica (`communications`): voci automatiche (email/WhatsApp inviati) + registrazione manuale di contatti (chiamata/email/PEC) con canale, direzione, data/ora modificabile e note. Diario di tracciabilita, non strumento di invio.
- Home operativa orientata all'azione (schede attive con breakdown azione, completate nell'anno, da fare, in scadenza) + pannello alert automatici + widget To-Do, distinta dalla Dashboard statistiche (numeri).
- Promemoria/To-Do (`tasks`): annotabili a mano sulla scheda lavoro o generali, con scadenza opzionale e stato Fatto/Da fare; aggregati in home (Oggi/In arrivo/Arretrati). Interni, non inviano nulla al cliente.
- Sito data-driven gestito dal CRM (CMS leggero): pacchetti (prezzo, voci, **SLA `sla_days`**, sovrapprezzo, badge), add-on, FAQ, testi e immagini editabili con flusso Bozza/Anteprima/Pubblica; sito statico + revalidation on-demand (nessuna query DB per-visita, @07). Tutto collegato: prezzo/SLA si riflettono su Tariffe, checkout e `due_date` suggerito. Cambio prezzo o SLA -> promemoria revisione Condizioni di Vendita (art. 7 per lo SLA); pratiche avviate restano snapshot.
- Accesso CRM al solo ruolo ADMIN; ogni pratica isolata via RLS; log eventi di audit.
- Validazione documenti con Approva/Rifiuta; il rifiuto innesca comunicazione automatica.
- Checklist documenti UNICA e condivisa CRM<->cliente: generata dal catalogo per pertinenza, poi gestita da Lorenzo (aggiungi/rimuovi voci, obbligatoria/facoltativa, "Non applicabile" tracciata invece che cancellata, crea tipi documento custom ad hoc o salvati nel catalogo).
- Anagrafica clienti separata (contacts) con storico pratiche e rubrica contatti acquisiti.
- Funzioni v1: home operativa (riepilogo + alert + To-Do), Kanban/Lista/Calendario, scheda lavoro, anagrafica/storico clienti, rubrica contatti, checklist documenti gestita, cronologia comunicazioni, promemoria/To-Do, gestione contenuti sito (pacchetti/prezzi, FAQ, testi, immagini), Brogliaccio PDF, Dossier ZIP, magic link, automazioni email, log eventi, dashboard KPI base (lavori, guadagni, conversione) + analytics marketing via Looker Studio embeddato.
- Recessi/rimborsi gestiti nel CRM in modo semi-automatico: pannello recesso con calcolo finestra 14gg + tipo rimborso suggerito, rimborso Stripe (totale/parziale) one-click con conferma di Lorenzo, email su supporto durevole, audit log; nota di credito come promemoria (non automatica). Nessun rimborso automatico senza conferma umana.
- Sicurezza automazioni (Riunione 1): transizioni a effetto esterno con conferma obbligatoria + email automatiche con finestra di annullamento (invio ritardato sulla job queue) + "Annulla ultima azione" + template di rettifica. Refund e offline conversion solo dietro pulsante dedicato, mai su drag.
- Cambio pacchetto con conguaglio (Riunione 1): upgrade tramite link di pagamento Stripe sulla differenza; downgrade tramite refund parziale; tutto tracciato. Rete di sicurezza contro la perdita sugli incarichi pesanti.
- Pagamenti gestiti interamente dal CRM (Stripe invisibile): flusso primario assistito (chiamata -> link -> pagamento durante la telefonata). Pagamento offline (bonifico/contanti) ammesso come ECCEZIONE registrabile a mano (`registerOfflinePayment`), non come strada principale.
- Riepilogo acquisto/ordine nella scheda pratica (stessi `line_items`/importi/fattura che il cliente vede in "Il tuo acquisto" @06) + pannello recesso che mostra e gestisce le richieste del cliente (`withdrawal_requests`).
- Identificativo pratica: `practice_code` umano `SUC-AAAA-NNNN`; il defunto si identifica col codice fiscale (chiave di ricerca/dedup, non vincolo unique rigido). uuid solo tecnico.
- Scheda pratica con aree appunti distinte: appunti chiamata, note pagamenti, note generali.
- Casi complessi (>~800 EUR / Esito C del form): preventivo personalizzato con importo libero sulla pratica + link di pagamento, NESSUN 4o pacchetto pubblico.
- Gestionale CONFERMATO: Sogei - Successioni Online (AdE). L'export in v1 e un Brogliaccio PDF, non un CSV verso gestionali terzi.
- Funzioni rimandate (fase 2+): OCR, export gestionale (dipende da Lorenzo), pagamento 50/50, statistiche marketing avanzate e ROI/CAC completi.
- AI: assistente solo INTERNO al CRM (alert intelligenti, OCR, bozze, riassunti) sempre con validazione umana; ESCLUSA qualsiasi chat AI pubblica lato cliente.

---

## Interfacce / Contratti (consuma -> espone)
- Consuma: practices/documents/log_events (@SPEC_Data_Model), azioni CRM e schemi (@SPEC_API_Contracts), nomi job/stati (@SPEC_Naming_Conventions).
- Espone: transizioni di stato della pipeline e relativi job/trigger (preventivo.sent, document.rejected, practice.closed...) verso @08/@12; dati pratica per @06.

## Criteri di accettazione
- Solo un utente con ruolo ADMIN puo accedere al CRM e alle pratiche (RLS).
- Spostando una pratica a PREVENTIVO_INVIATO, parte l'email al cliente con il link di pagamento.
- Rifiutando un documento, lo stato diventa REJECTED e parte la comunicazione automatica al cliente con il motivo.
- Ogni transizione/azione registra un record in log_events.
- Le transizioni rispettano la pipeline (nessun salto non consentito).
- Al passaggio in CHIUSA parte l'offline conversion (@08) e, dopo 48h, la richiesta recensione (@09).
- Lorenzo puo cercare una pratica per codice fiscale del defunto o codice pratica e filtrare per stato (in corso vs completate), azione richiesta e date.
- Ogni pratica aperta mostra correttamente l'indicatore di azione (Tocca a te / In attesa del cliente / In attesa AdE) in base a stato e checklist.
- Il calendario mostra le pratiche per data (apertura, consegna prevista, scadenza 12 mesi, invio) e l'evento apre la scheda.
- La consegna prevista (`due_date`) si popola solo quando tutti i documenti sono approvati (`docs_approved_at`), non al pagamento.
- Lorenzo puo registrare a mano una comunicazione (canale, direzione, data/ora, note) e la vede nella cronologia insieme alle email/WhatsApp automatici.
- La home operativa mostra schede attive, completate nell'anno, alert automatici e i To-Do; ogni card/alert apre la pratica relativa.
- Lorenzo puo aggiungere un To-Do (con o senza scadenza) su una pratica o generale, spuntarlo come Fatto, e ritrovarlo aggregato in home (Oggi/In arrivo/Arretrati).

## Rischi / Compliance & Riferimenti
- Rischio incoerenza flusso: evitare il vecchio modello "pagamento alla fine" (superato dal pagamento anticipato, @01).
- Rischio GDPR: anteprime/scaricamenti documenti e retention vanno conformi (@10); accesso solo ADMIN (@11).
- Rischio automazioni: trigger senza retry perdono email/WhatsApp; usare job queue con retry (@07/@12).
- Rischio WhatsApp: template Meta da pre-approvare; messaggi solo transazionali (@10).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni CRM, giornata tipo di Lorenzo, automazioni, export, schema Prisma).
