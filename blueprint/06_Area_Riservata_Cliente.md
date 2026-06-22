# 06. Area Riservata Cliente

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-06
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @05_CRM, @07_Stack, @10_Legale_Compliance, @11_Sicurezza
- Owner:

## Sintesi
Lo spazio dove il cliente accede in modo semplice (passwordless), monitora lo stato della pratica, carica i documenti richiesti e scarica i documenti finali. Pensata per utenti non tecnici (over-50), mobile-first, sicura e conforme al GDPR.

> **Naming (user-facing):** nelle interfacce rivolte al cliente questa sezione si chiama **"Area personale"** (non "Area Riservata", che risultava ambiguo). Il titolo di capitolo e la **rotta tecnica `/area-riservata`** restano invariati per continuita interna. Etichetta gestita data-driven via `settings.area_label` (IT) e `area_login.header_title` per l'H1 di login. Vedi [DECISIONI.md](DECISIONI.md).

---

## Stato attuale del progetto

### Accesso (passwordless)
- Supabase Auth, ruolo CLIENT. Login primario via Magic Link email; OTP a 6 cifre come alternativa.
- Niente social login (Google/Apple) in v1 - scelta voluta: l'identita coincide con l'email del pagamento (l'account si attiva dopo il checkout), quindi il Magic Link a quell'email e il metodo piu semplice e a prova di errore; il social login rischierebbe disallineamenti email (es. Apple "Hide My Email") e account senza pratica.
- Codice/link con scadenza breve (es. 10 minuti); rilascio sessione (JWT) integrato con RLS (@07/@11).
- L'area si sblocca dopo il pagamento del pacchetto (incarico ufficiale); il magic link iniziale arriva con l'email di conferma pagamento (@05).

### Dashboard pratica
- Stato avanzamento con etichette "client-friendly" (non i nomi interni Kanban), es.: "Documenti da caricare" -> "In lavorazione" -> "Inviata all'Agenzia" -> "Conclusa".
- Tracker visivo (barra/step) + timeline degli aggiornamenti.
- Riepilogo pratica essenziale e prossima azione richiesta al cliente.

### Upload documenti
- Drag & drop + selezione file; mobile: scatto/foto da fotocamera.
- Formati ammessi: PDF, JPG, PNG (limiti di peso definiti); validazione lato client.
- Checklist documenti DINAMICA: e la stessa checklist gestita da Lorenzo nel CRM (`document_requirements`, @05/@SPEC_Data_Model). Generata dai dati della pratica e poi eventualmente personalizzata da Lorenzo (voci aggiunte, rese facoltative, tipi custom). Il cliente vede solo le voci applicabili (le "Non applicabili" non compaiono).
  - Base: documento d'identita e codice fiscale degli eredi; certificato di morte (o autocertificazione); autocertificazione stato famiglia / albero genealogico; IBAN dell'erede (per le imposte autoliquidate via F24, @10).
  - Se immobili: visure catastali, atti di provenienza, planimetrie.
  - Se testamento: copia del testamento / verbale di pubblicazione.
  - Se eredi minorenni/incapaci: autorizzazione del Giudice Tutelare.
  - Voci custom: se Lorenzo aggiunge un documento per un caso particolare, compare automaticamente in checklist con la sua etichetta e le istruzioni (help text).
- Stato di ogni documento visibile al cliente (In attesa / Approvato / Rifiutato con motivo) -> possibilita di ricaricare.

### Download documenti finali
- A pratica conclusa: ricevute Agenzia delle Entrate, visure aggiornate, fattura.
- Ogni documento finale con etichetta chiara ("cosa e") e, dove utile, link "Vedi esempio" / fac-simile (spunto competitor: ridurre l'incertezza su cosa si riceve).
- Accesso ai file tramite signed URL a scadenza (no link pubblici permanenti) (@11).
- Gli input sensibili sono soggetti a minimizzazione/retention (@10); restano i documenti finali.

### Notifiche al cliente
- Email (e WhatsApp se attivo) sugli aggiornamenti di stato e sui documenti rifiutati (trigger gestiti dal CRM, @05).

### Accessibilita e UX
- Interfaccia semplice, testi chiari, pochi passaggi; target WCAG 2.2 AA (@03).

---

## Inventario funzionalita e pulsanti (schermata per schermata)
> Analisi completa di cosa serve, voce per voce. Formato: **elemento/pulsante** -> azione -> esito/stato -> [condizioni] -> (evento @08). Le rotte sono proposte (allineare a @SPEC_Naming_Conventions); gli eventi ai nomi canonici (@SPEC_Event_Taxonomy).

### Mappa schermate (rotte sotto `/area-riservata`)
- `/area-riservata` - Accesso (login passwordless)
- `/area-riservata/dashboard` - Dashboard pratica (home)
- `/area-riservata/ordine` - Il tuo acquisto: riepilogo ordine, cosa include, importo, stato pagamento, fattura
- `/area-riservata/documenti` - Checklist e upload documenti
- `/area-riservata/documenti/[id]` - Dettaglio/anteprima singolo documento
- `/area-riservata/dati` - Dati aggiuntivi richiesti (es. IBAN, dati eredi)
- `/area-riservata/mandato` - Lettura e accettazione/firma mandato e consensi
- `/area-riservata/recesso` - Richiesta di recesso/rimborso (self-service guidato)
- `/area-riservata/conclusa` - Download documenti finali e fattura
- `/area-riservata/profilo` - Recapiti e preferenze notifiche
- (trasversali) Stati vuoti, errore, sessione scaduta, assistenza

### Elementi globali (presenti in tutte le schermate post-login)
- **Header**: logo studio (link a dashboard), nome cliente, codice pratica.
- **Menu/navigazione** (bottom-bar su mobile, sidebar su desktop): Dashboard, Il tuo acquisto, Documenti, (Dati), Conclusa (se disponibile), Profilo.
- **Pulsante "Assistenza / Contatta Lorenzo"** -> apre opzioni email/telefono/WhatsApp (se attivo) -> [sempre visibile] (evento `support_click`).
- **Pulsante "Esci" (logout)** -> termina sessione -> torna a `/area-riservata` (evento `logout`).
- **Banner sessione in scadenza** -> "Rimani connesso" / logout automatico (sicurezza @11).
- **Selettore pratica** (solo se il contatto ha piu pratiche) -> cambia pratica attiva.

### 1) Schermata di Accesso `/area-riservata`
- **Campo Email** + **Pulsante "Inviami il link di accesso"** -> invia Magic Link -> messaggio "Controlla la tua email" -> [email valida] (evento `login_link_sent`).
- **Link "Accedi con un codice (OTP)"** -> mostra inserimento codice a 6 cifre.
- **Campo OTP (6 cifre)** + **Pulsante "Verifica codice"** -> crea sessione -> redirect dashboard -> [codice valido/non scaduto] (evento `login`).
- **Pulsante "Reinvia codice"** -> reinvio con cooldown (es. 60s) -> [dopo attesa] (anti-abuso @11).
- **Stato link/codice scaduto** -> messaggio + **"Richiedi nuovo link"**.
- **Link a Privacy/Termini** in fondo.

### 2) Dashboard pratica `/area-riservata/dashboard`
- **Tracker di stato** (step/barra) con etichette client-friendly: Documenti da caricare -> In lavorazione -> Inviata all'Agenzia -> Conclusa.
- **Card "Prossima azione richiesta"** con **CTA primaria contestuale**:
  - se mancano documenti -> **"Carica i documenti"** -> va a `/documenti`.
  - se serve IBAN/dati -> **"Completa i dati"** -> va a `/dati`.
  - se serve firma -> **"Leggi e firma il mandato"** -> va a `/mandato`.
  - se conclusa -> **"Scarica i documenti finali"** -> va a `/conclusa`.
- **Riepilogo pratica** (pacchetto, defunto, n. eredi, immobili si/no) - sola lettura; **link "Vedi il tuo acquisto"** -> `/ordine` (cosa hai incluso, importo, fattura).
- **Card "Imposte di Stato" (solo quando comunicate)**: appare quando Lorenzo ha comunicato le imposte (`state_taxes_communicated_at`); mostra il totale e un **link "Vedi dettaglio"** -> `/ordine` (riquadro imposte). Ribadisce che sono separate dall'onorario e si versano allo Stato (F24). Se serve l'IBAN per l'addebito, CTA **"Inserisci IBAN"** -> `/dati`.
- **Timeline aggiornamenti** (storico stati e messaggi).
- **Indicatore avanzamento documenti** (es. "3 di 7 approvati").
- **Pulsante "Contatta l'assistenza"**.

### 2-bis) Il tuo acquisto `/area-riservata/ordine`
> Esigenza (Riunione 1): dopo il pagamento il cliente deve poter **ricontrollare cosa ha acquistato e cosa include**, in qualsiasi momento. Sola lettura, deriva dallo snapshot `line_items` della pratica (@SPEC_Data_Model), quindi resta fedele a cio che ha pagato anche se in futuro cambiano i listini.
- **Riepilogo ordine**: pacchetto acquistato + eventuali **add-on** (es. Riunione di Usufrutto) + **sovrapprezzo immobili**, ciascuno con importo; **Totale onorario** (con IVA/Cassa) e nota "imposte di Stato a parte" (@10).
- **Cosa include il pacchetto**: elenco delle prestazioni incluse (dalla descrizione del pacchetto), cosi sa esattamente cosa ha comprato.
- **Stato pagamento**: pagato / parzialmente rimborsato / rimborsato, **metodo**, **data**.
- **Documento fiscale**: **"Scarica fattura"** quando disponibile (altrimenti "fattura in emissione").
- **Cambi**: se c'e stato un cambio pacchetto/conguaglio, e mostrato in modo trasparente (collegato a `practice_adjustments`, @05).
- **Imposte di Stato (riquadro separato e distinto dall'onorario)**: appare quando Lorenzo le ha comunicate (`state_taxes_communicated_at` valorizzato, @SPEC_Data_Model). Mostra il **totale** (`state_taxes_amount`) e il **dettaglio** (`state_taxes_breakdown`: ipotecaria, catastale, bollo, tributi, imposta di successione). Copy chiaro **anti-confusione**: "Queste somme NON sono il nostro onorario: sono imposte che si versano allo Stato (modello F24, autoliquidazione 2025). Te le calcoliamo e comunichiamo PRIMA dell'invio, senza alcun ricarico." Se prevista la modalita di addebito, rimanda a `/dati` per inserire l'IBAN; altrimenti spiega che il versamento avviene con F24 (@10). Finche non comunicate: nota "Le imposte di Stato ti verranno calcolate e comunicate prima dell'invio". (evento `view_state_taxes`).
- **CTA contestuale**: **"Hai cambiato idea?"** -> link a `/area-riservata/recesso` (visibile solo se il recesso e ancora possibile, vedi sotto).

### 3) Documenti - checklist e upload `/area-riservata/documenti`
> Pattern deciso per "essere sicuri di aver caricato tutto" senza confusione: la checklist e l'unica fonte di verita, il sistema (non l'utente) decide quando si puo procedere, e c'e una sola azione alla volta.
- **Distinzione di stato chiara (causa #1 di confusione)**: lato cliente solo 3 stati semplici - **Da caricare -> Caricato -> Da rifare** (con motivo). La validazione di Lorenzo ("Approvato") e interna al CRM e NON deve bloccare ne confondere il cliente (l'"Approvato" puo comparire come conferma facoltativa, ma "Caricato" basta per procedere).
- **Lista checklist dinamica**: una riga per documento richiesto; in cima e in evidenza i "Da caricare", sotto e attenuati i "Caricati" (spunta verde). Se "Da rifare", **motivo** visibile.
- **Contatore sempre visibile** in alto: "Documenti: X di Y" + barra di avanzamento.
- Per ogni riga:
  - **Pulsante "Carica"** (se mancante) / **"Ricarica"** (se rifiutato) -> apre il caricatore.
  - **Icona/anteprima** -> apre dettaglio `/documenti/[id]`.
  - **Pulsante "Elimina"** -> rimuove il file -> [solo se stato = Caricato/In attesa, non Approvato].
  - **Tooltip "?"** -> spiega cos'e quel documento e come ottenerlo (aiuto over-50).
- **Caricatore (modale/area)**:
  - **Area drag & drop** + **Pulsante "Scegli file"**.
  - **Pulsante "Scatta foto"** (solo mobile) -> fotocamera.
  - **Barra di avanzamento** upload + **Pulsante "Annulla"**.
  - **Pulsante "Conferma caricamento"** -> crea record PENDING per il CRM (@05) -> aggiorna stato riga -> (evento `document_upload`).
  - Validazione: tipo (PDF/JPG/PNG) e peso, con messaggi d'errore chiari.
- **Pulsante-cancello sticky in basso** (meccanismo anti-confusione): si aggiorna da solo.
  - finche manca qualcosa: **informativo e disattivato**, es. "Mancano 4 documenti"; se premuto, evidenzia quali mancano.
  - quando tutti i richiesti sono almeno "Caricati": diventa **attivo e prominente** -> **"Ho finito - invia a Lorenzo"** -> avanza lo stato pratica e notifica Lorenzo (@05) -> (evento `documents_submitted`).
- **Conferma esplicita** dopo l'invio: messaggio "Fatto! Lorenzo ha ricevuto i tuoi documenti e li sta controllando. Ti avvisiamo se manca qualcosa." (il cliente sa di poter staccare).
- **Trasparenza sui tempi**: i tempi di consegna indicati partono da quando TUTTI i documenti risultano completi e validati (non dalla data di pagamento); se manca o va rifatto un documento, l'attesa si mette in pausa finche non e sistemato (coerente con Condizioni di Vendita art. 7, @10).
- **Riapertura guidata in caso di rifiuto**: se Lorenzo rifiuta un file, il cliente riceve notifica, il documento torna in "Da rifare" con motivo, il contatore scende e il pulsante-cancello torna informativo ("Manca 1 documento"). Nessuna nuova logica da imparare.

### 4) Dettaglio documento `/area-riservata/documenti/[id]`
- **Anteprima file** (viewer immagine/PDF).
- **Pulsante "Sostituisci/Ricarica"** -> caricatore -> [se non Approvato].
- **Pulsante "Elimina"** -> [se non Approvato].
- **Pulsante "Chiudi/Indietro"** -> torna alla checklist.
- (Nota: il download del proprio file caricato avviene via signed URL @11.)

### 5) Dati aggiuntivi `/area-riservata/dati`
- **Campo IBAN** (per imposte autoliquidate via F24, @10) con validazione formato -> **Pulsante "Salva"** -> [campo sicuro, dato sensibile @11].
- **Eventuali campi anagrafici eredi mancanti** -> **"Salva"**.
- Messaggio di conferma salvataggio; possibilita di modifica finche non bloccato dalla lavorazione.

### 6) Mandato e consensi `/area-riservata/mandato`
- **Visualizzatore del documento di incarico/mandato**.
- **Checkbox "Ho letto e accetto"** (mandato, condizioni, informativa) -> abilita il pulsante.
- **Pulsante "Accetto e firmo"** -> **FES con accettazione tracciata** (timestamp, IP, user-agent, **versione + hash** del documento, identita utente; log immutabile) -> (evento `mandate_signed`) -> conferma su supporto durevole via email (@10 par. 5.1). Avviene **prima dell'avvio lavorazione**.
- **Fallback firma autografa**: se un documento specifico la richiede (es. delega), percorso **scarica -> firma -> ricarica** nella stessa schermata.
- **Pulsante "Scarica copia"** del mandato firmato.

### 6-bis) Recesso / rimborso `/area-riservata/recesso`
> Self-service guidato (deciso per la v1): il cliente puo avviare la richiesta di recesso dall'area, con piena trasparenza sulle conseguenze. Base legale e testi: @10 e `bozze_legali/Recesso_e_Checkout_IT_BOZZA.md`; la richiesta alimenta il pannello recesso del CRM (@05).
- **Idoneita e visibilita**: il pulsante "Richiedi recesso" e visibile finche la pratica non e **completata**; la pagina mostra lo **stato della finestra dei 14 giorni** (entro/oltre) calcolato dalla conclusione del contratto.
- **Spiegazione chiara delle conseguenze (no legalese)**:
  - se al checkout era stato scelto l'**avvio immediato** + presa d'atto, a servizio **interamente eseguito** il recesso non spetta (art. 59);
  - se la lavorazione e **iniziata ma non completata**, e dovuto un importo **proporzionale** al lavoro gia svolto;
  - se la lavorazione **non e iniziata**, rimborso integrale dell'onorario.
- **Flusso**: **"Richiedi recesso"** -> breve form (motivo facoltativo) + riepilogo conseguenze + **conferma** -> crea una **richiesta** collegata alla pratica (`withdrawal_requests`, @SPEC_Data_Model) -> notifica a Lorenzo, che gestisce ed esegue l'eventuale rimborso dal CRM (@05). Conferma di ricezione su supporto durevole (email).
- **Alternativa**: link al **modulo tipo** scaricabile e ai recapiti (email/PEC) per chi preferisce il canale tradizionale.
- **Stato della richiesta** visibile al cliente: Inviata -> In gestione -> Rimborso eseguito / Non dovuto (con messaggio chiaro).
- Distinzione: il **recesso** (diritto di legge) e separato dalla **garanzia "Soddisfatti o Rimborsati"** (volontaria), entrambi spiegati in `/recesso` e `/garanzia` (@03/@10).

### 7) Pratica conclusa - download finali `/area-riservata/conclusa`
- **Lista documenti finali** (ricevute Agenzia, visure aggiornate, attestazioni) - ognuno con **Pulsante "Scarica"** (signed URL a scadenza @11) -> (evento `download_final_docs`).
- **Pulsante "Scarica tutto (ZIP)"**.
- **Sezione Fattura**: **"Scarica fattura"**.
- **Messaggio di chiusura** caldo + **CTA "Lascia una recensione"** (link Google) - coerente con richiesta a 48h (@09).
- [visibile solo quando stato = Conclusa].

### 8) Profilo e preferenze `/area-riservata/profilo`
- **Recapiti** (email/telefono) - modifica con verifica.
- **Preferenze notifiche** (email / WhatsApp se attivo) - toggle.
- **Selettore lingua** (se multilingua, fase futura).
- **Pulsante "Esci"**.
- **Link "Privacy" / "Gestisci i miei dati"** (centro privacy - idea futura, @10).

### 9) Stati trasversali (da progettare)
- **Stato vuoto** ("Non ci sono ancora documenti da caricare").
- **Errore di caricamento** (file troppo grande/formato errato) con rimedio.
- **Sessione scaduta** -> rimando al login.
- **Offline / rete assente** (utile su mobile) -> messaggio e retry.

---

## Idee future
- Firma elettronica AVANZATA/QUALIFICATA (FEA/FEQ) del mandato via provider, oltre alla FES gia prevista in v1 (@10 par. 5.1).
- Rinomina automatica dei file in cloud con nomenclatura fissa.
- "Centro privacy" per esercizio dei diritti (accesso/cancellazione/portabilita) (@10).
- Chat/assistenza integrata e checklist con stato "completata".
- Pre-compilazione via OCR dei dati dal documento d'identita (@05/@07).
- Eventuale "Continua con Google" come scorciatoia per gli accessi successivi (fase 2), SOLO con match obbligatorio sull'email della pratica; Apple escluso (costo developer + "Hide My Email" incompatibile col modello).

---

## Nodi da sciogliere
- [RISOLTO] Firma del mandato: **FES con accettazione tracciata** (timestamp, IP, versione+hash, log) nella schermata `/area-riservata/mandato`, prima dell'avvio; fallback firma autografa via upload; FEA/FEQ rimandata (@10 par. 5.1).
- Raccolta IBAN: dove e come (campo dedicato sicuro nell'area) e con quali tutele.
- [RISOLTO] Checkout su pagina pubblica `/checkout` PRIMA dell'accesso (area sbloccata dopo il pagamento). Modello a ORDINE SINGOLO, senza carrello multi-prodotto: `/checkout` = riepilogo ordine (pacchetto + add-on + sovrapprezzi + IVA/cassa, imposte di Stato a parte). Dettaglio in @04 "Checkout e ordine".
- [RISOLTO] Scansione antivirus/malware sui file caricati: SI in v1, **ClamAV in UE** con quarantena finche non "pulito" (@11/@07).
- [RISOLTO] Pulsante "Ho caricato tutto": SI, ma come pulsante-cancello automatico (attivo solo a checklist completa), non come bottone sempre cliccabile. Vedi sezione Documenti e Decisioni congelate.
- [RISOLTO] Schermata Mandato/firma in v1: SI, in area riservata, al primo accesso e prima dell'avvio. I consensi essenziali (T&C/privacy/recesso) restano al checkout; il mandato vero e proprio si firma qui (@10 par. 5.1).
- Modifica recapiti dal profilo: consentita in v1 (con verifica) o sola lettura?
- Notifiche in-app (campanella) oltre a email/WhatsApp: in v1 o in seguito?

## Passi successivi
- [ ] Definire la checklist documenti definitiva per ciascuno scenario.
- [ ] Definire limiti di formato/peso e messaggi di validazione upload.
- [ ] Definire le etichette di stato client-friendly e i testi della dashboard.
- [ ] Definire il flusso di raccolta IBAN in sicurezza (@10/@11).
- [ ] Definire policy signed URL e scadenze per i download (@11).
- [ ] Validare la mappa schermate/rotte e l'inventario pulsanti con @SPEC_Naming_Conventions e @SPEC_Event_Taxonomy.
- [ ] Decidere lo scope v1 di: modifica profilo, notifiche in-app. (Schermata Mandato e "Ho caricato tutto" gia decisi.)
- [ ] Disegnare i wireframe delle schermate principali (dashboard, documenti, conclusa) per il prototipo (GESTIONE_PROGETTO).

---

## Decisioni congelate (lock-in)
- Accesso passwordless (Magic Link primario, OTP alternativo) via Supabase Auth; niente social login (Google/Apple) in v1.
- Area sbloccata dopo il pagamento; nessun "paga per sbloccare" sui documenti finali (modello upfront, @01).
- Upload con checklist dinamica = la checklist gestita da Lorenzo (`document_requirements`): generata dai dati della pratica e personalizzabile (voci aggiunte/facoltative/non applicabili, tipi custom); il cliente vede solo le voci applicabili.
- Stato documenti visibile al cliente con possibilita di ricaricare i rifiutati.
- Download finali solo via signed URL a scadenza; isolamento per cliente via RLS.
- Mobile-first, target accessibilita WCAG 2.2 AA.
- Schermate v1 di base: Accesso, Dashboard, Documenti (checklist+upload), Dettaglio documento, Conclusa (download), Profilo; con assistenza e logout sempre raggiungibili. (Mandato, Dati/IBAN, "Ho caricato tutto", notifiche in-app: scope da confermare nei nodi.)
- CTA della dashboard sempre contestuale alla "prossima azione richiesta" (un'unica azione chiara per volta).
- Vista "Il tuo acquisto" (`/ordine`): il cliente puo sempre ricontrollare cosa ha acquistato e cosa include (da snapshot `line_items`), importo, stato pagamento e fattura.
- Recesso self-service in v1: pagina `/recesso` con spiegazione chiara delle conseguenze e creazione richiesta (`withdrawal_requests`) che alimenta il pannello recesso del CRM (@05); resta possibile anche via email/PEC + modulo tipo.
- Completamento documenti "a prova di confusione": checklist unica come fonte di verita + 3 stati cliente (Da caricare/Caricato/Da rifare; "Approvato" e interno) + contatore "X di Y" + pulsante-cancello sticky che si attiva da solo solo a checklist completa ("Ho finito - invia a Lorenzo") + conferma esplicita; il rifiuto riapre il cancello in modo guidato.
- Firma del mandato in v1: schermata `/area-riservata/mandato` con **FES ad accettazione tracciata** (timestamp, IP, versione+hash, log, conferma email su supporto durevole), prima dell'avvio lavorazione; fallback firma autografa via upload; FEA/FEQ rimandata (@10 par. 5.1).
- Imposte di Stato mostrate al cliente quando comunicate da Lorenzo (riquadro in "Il tuo acquisto" + card in dashboard), separate dall'onorario, con copy anti-confusione (si versano allo Stato via F24, nessun ricarico); dati da `state_taxes_*` (@SPEC_Data_Model), prova di presentazione da `submission_info`.

---

## Interfacce / Contratti (consuma -> espone)
- Consuma: Supabase Auth (passwordless), practices/documents con RLS (@SPEC_Data_Model), endpoint upload/download (@SPEC_API_Contracts), stati client-facing (@SPEC_Naming_Conventions).
- Espone: caricamento documenti (crea record PENDING per @05), stato pratica al cliente, download dei documenti finali; eventi file_upload/file_download (@08).

## Criteri di accettazione
- Un cliente autenticato vede ESCLUSIVAMENTE le proprie pratiche e i propri documenti.
- L'accesso all'area e possibile solo dopo il pagamento (stato >= PAGATO).
- I download avvengono solo tramite signed URL a scadenza (no link pubblici).
- L'upload valida tipo/peso e mostra lo stato per ciascun documento (PENDING/APPROVED/REJECTED) con possibilita di ricaricare i rifiutati.
- La checklist documenti si adatta ai dati della pratica (immobili/testamento/minorenni).
- Il cliente puo consultare in qualsiasi momento il riepilogo del proprio acquisto (cosa incluso, importo, stato, fattura) da `/ordine`.
- Il cliente puo avviare una richiesta di recesso da `/recesso` finche la pratica non e completata, con spiegazione chiara delle conseguenze; la richiesta arriva al CRM di Lorenzo.

## Rischi / Compliance & Riferimenti
- Rischio sicurezza: link/sessioni senza scadenza o RLS errata espongono dati di altri clienti (@11).
- Rischio GDPR: dati ad alta sensibilita (identita, IBAN); minimizzazione, cifratura e retention obbligatorie (@10).
- Rischio usabilita: upload complicato per over-50 -> abbandono; massima semplicita e istruzioni chiare.
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni area riservata, OTP/Magic Link, upload, download finali).
