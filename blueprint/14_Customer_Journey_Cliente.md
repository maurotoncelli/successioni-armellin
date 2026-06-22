# 14. Customer Journey del Cliente (end-to-end)

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).
> Capitolo TRASVERSALE: racconta in modo continuo l'esperienza del cliente attraversando le strutture definite in @03 (sito), @04 (form), @06 (area riservata), @08 (eventi), @10 (legale). Non duplica quei capitoli: li mette in sequenza dal punto di vista umano.

## Metadati
- ID: CAP-14
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-19
- Dipendenze: @01_Executive_Summary, @02_Brand_Identity, @03_Architettura_Informazione, @04_Form_Multistep, @06_Area_Riservata, @08_Tracciamento, @09_Go_To_Market, @10_Legale_Compliance
- Owner:

## Sintesi
Descrizione accurata, passo per passo, del percorso di un cliente reale dal primo contatto fino al post-vendita: cosa fa, cosa vede, cosa pensa/sente, cosa accade dietro le quinte (sistema), quale evento viene tracciato e quali sono i punti di attrito e le leve di fiducia. Obiettivo: avere un'unica narrazione coerente per validare che la struttura del sito converta davvero e per guidare copy, UX e prototipo.

---

## Stato attuale del progetto

### Persona di riferimento (scenario guida)
- **Maria, 54 anni**, impiegata. Il padre e mancato da poche settimane. Sa di "dover fare la successione" entro 12 mesi ma non sa da dove iniziare, e in lutto, ha poco tempo e teme di sbagliare e prendere sanzioni. Non e pratica di fisco ne di SPID. Cerca da smartphone, la sera.
- Bisogni emotivi: rassicurazione, semplicita, sentirsi "in mani sicure". Bisogni pratici: capire costi, tempi e cosa deve fare lei.

> Varianti utili da tenere a mente: erede "esperto/diffidente" che confronta col fai-da-te dell'Agenzia (vedi @09); erede con piu immobili/piu eredi (caso complesso -> pacchetto alto).

### Mappa delle fasi (sintesi)
1. Trigger e bisogno
2. Scoperta (acquisizione)
3. Valutazione (homepage/empatia)
4. Pre-valutazione (form preventivo)
5. Decisione e acquisto (checkout, pagamento anticipato)
6. Onboarding (accesso area riservata, upload documenti)
7. Lavorazione (avanzamento pratica, comunicazioni)
8. Completamento (consegna documenti finali)
9. Post-vendita (recensione, recesso/garanzia, fidelizzazione)

---

### Fase 1 - Trigger e bisogno
- Cosa fa: dopo il decesso, cerca informazioni; chiede a parenti o cerca su Google "come fare la successione del papa".
- Cosa pensa/sente: confusione, ansia, urgenza diffusa ("ho tempo ma non voglio rimandare").
- Sistema: nessun contatto ancora.
- Evento (@08): -
- Leva di fiducia: presenza nei risultati con un contenuto-guida empatico (pillar @09), non solo un'offerta commerciale.

### Fase 2 - Scoperta / acquisizione
- Canali (@09): ricerca organica (pillar/guide), Google Ads (query ad alta intenzione: "costo successione online"), Google Business Profile (per query locali in Toscana), passaparola.
- Cosa fa: clicca un risultato e atterra su Homepage `/` o su una guida `/guide/[slug]`.
- Cosa vede: titolo coerente con la sua ricerca (corrispondenza intento), tono rassicurante.
- Cosa pensa/sente: "forse qui capisco / forse mi tolgo il pensiero".
- Sistema: pagina SSR veloce (@07), banner consensi/CMP (@10), Consent Mode v2 (@08).
- Evento (@08): `page_view` (+ `consent_update` dopo scelta cookie).
- Attrito/rischi: mismatch tra annuncio e pagina; pagina lenta su mobile; banner cookie invasivo.
- Leva di fiducia: trust bar (Albo, telematico, pagamenti sicuri), nessuna foto stock triste.

### Fase 3 - Valutazione (homepage / costruzione fiducia)
- Cosa fa: scorre la homepage nell'ordine dell'imbuto (@03): Hero -> Trust -> Problema/Soluzione -> Come Funziona (3 step) -> Tariffe -> Anti-obiezione (fai-da-te vs noi) -> Recensioni -> Chi Sono -> FAQ -> CTA.
- Cosa pensa/sente: passa da "chissa se e affidabile" a "questo ha capito il mio problema e mi dice il prezzo chiaro". Vede il volto reale di Lorenzo (E-E-A-T, @02).
- Momenti chiave di decisione:
  - Tariffe trasparenti (290/490/790 + box onorario vs imposte) -> riduce incertezza.
  - Blocco anti-obiezione -> disinnesca "lo faccio gratis da solo sull'Agenzia" (@03/@09).
  - Recensioni Google + Chi Sono -> riprova sociale e autorevolezza.
  - FAQ -> abbatte le ultime obiezioni (tempi, sicurezza documenti, errori).
- Sistema: contenuti statici/SSR; CTA persistente su mobile.
- Eventi (@08): `view_pricing` (sezione/pagina tariffe), `faq_open`, click CTA `select_cta` -> avvio form.
- Attrito/rischi: troppa scelta, prezzo percepito alto senza giustificazione del valore, CTA poco visibile.
- Leva di fiducia: coerenza tono (@02), garanzia/rimborso citata (@10).

### Fase 4 - Pre-valutazione (form preventivo `/preventivo`, @04)
- Cosa fa: avvia il form multi-step (4 step) e risponde a domande semplici e progressive; la logica condizionale mostra solo cio che serve (es. numero immobili, presenza testamento).
- Cosa pensa/sente: "facile, non mi sta chiedendo cose impossibili"; percezione di controllo e trasparenza.
- Sistema: validazione client+server (Zod), anti-bot Turnstile (@11), salvataggio lead, suggerimento pacchetto in base alle risposte (@04), upsert `contact` + creazione `lead`/pratica preliminare (SPEC_Data_Model, SPEC_API_Contracts).
- Eventi (@08): `generate_lead` (inizio), `form_step_complete` per step, `view_quote` (pacchetto suggerito).
- Output: pagina `/preventivo/grazie` con pacchetto consigliato, prezzo e CTA "Procedi" oppure "Ti ricontatto".
- Attrito/rischi: form troppo lungo, richiesta dati sensibili troppo presto, nessun salvataggio se abbandona.
- Leva di fiducia: privacy/consenso esplicito (@10), barra di avanzamento, microcopy rassicurante.

### Fase 5 - Decisione e acquisto (checkout, pagamento anticipato)
- Cosa fa: dalla thank-you/preventivo procede al `/checkout` e paga il pacchetto (modello a pagamento anticipato, @04/@06/@10).
- Cosa pensa/sente: il momento piu delicato ("pago prima di ricevere?"). Va rassicurata su sicurezza e diritto di recesso/garanzia.
- Sistema: Stripe Checkout; al pagamento riuscito -> webhook (@07) -> creazione/attivazione pratica, creazione account/identita passwordless, invio email di benvenuto (Resend), trigger job onboarding (@12).
- Eventi (@08): `begin_checkout`, `purchase` (server-side per affidabilita, + offline conversion verso Ads, @08).
- Attrito/rischi: ansia da pagamento anticipato; checkout con troppi campi; dubbi sul "e se poi non si puo fare?".
- Leva di fiducia: riepilogo chiaro onorario vs imposte (@10), badge Stripe/SSL, richiamo esplicito al diritto di recesso 14 gg e alla garanzia rimborso (@10).

### Fase 6 - Onboarding (accesso area riservata `/area-riservata`, @06)
- Cosa fa: riceve email, accede all'area riservata in modalita passwordless (Magic Link/OTP), trova una **checklist documenti dinamica** basata sulle risposte del form.
- Cosa pensa/sente: "ok, ora so esattamente cosa caricare"; sollievo nel vedere un percorso guidato.
- Sistema: Supabase Auth (OTP), Storage con URL firmati, RLS che isola i dati del cliente (@11), checklist generata dai dati pratica.
- Eventi (@08): `login`, `document_upload` (per file).
- Attrito/rischi: difficolta con OTP/email non arrivata; non sa quali documenti ha; upload da mobile macchinoso; formati non accettati.
- Leva di fiducia: stato sempre visibile, messaggi chiari su cosa manca, supporto umano raggiungibile (reply-to a Lorenzo, @07).

### Fase 7 - Lavorazione (avanzamento e comunicazioni)
- Cosa fa: attende; ogni tanto controlla lo stato; eventualmente carica documenti integrativi richiesti.
- Cosa pensa/sente: vuole sentirsi aggiornata e non dimenticata; l'incertezza genera ansia/ticket.
- Sistema: Lorenzo avanza la pratica nel Kanban del CRM (@05); i cambi di stato generano notifiche email automatiche al cliente; eventuali richieste di documenti aggiuntivi (loop verso Fase 6).
- Eventi (@08): -, (interni CRM tracciati lato @05).
- Attrito/rischi: silenzio = percezione di abbandono; richieste documenti poco chiare.
- Leva di fiducia: aggiornamenti proattivi a ogni step ("La tua pratica e passata a: in lavorazione"); SLA di risposta dichiarati (@01).

### Fase 8 - Completamento (consegna)
- Cosa fa: riceve notifica di pratica conclusa; accede e **scarica i documenti finali** (ricevuta Agenzia, attestazioni, volture) via URL firmati.
- Cosa pensa/sente: sollievo e gratitudine ("e fatta, senza stress"). E il picco emotivo positivo: momento ideale per chiedere la recensione.
- Sistema: stato "Chiusa" nel CRM (@05); documenti finali disponibili in area riservata; avvio job di archiviazione/cold storage (@12).
- Eventi (@08): `download_final_docs` (o equivalente), conversione completata.
- Attrito/rischi: documenti difficili da trovare/scaricare; nessuna spiegazione di cosa siano i file.
- Leva di fiducia: messaggio di chiusura caldo e umano, riepilogo di cosa e stato fatto.

### Fase 9 - Post-vendita (fidelizzazione e tutela)
- Cosa fa: 48h dopo la chiusura riceve la richiesta automatica di recensione (@09/@05); puo tornare per servizi collegati (es. Riunione Usufrutto, future pratiche).
- Cosa pensa/sente: se soddisfatta, diventa promotrice (passaparola, recensione).
- Sistema: trigger CRM richiesta recensione (@05); gestione eventuale recesso 14 gg/garanzia (@10); retention/upsell.
- Eventi (@08): `review_request_sent`, (eventuale) `review_submitted`.
- Attrito/rischi: richiesta recensione troppo insistente o non conforme alle policy Google (@09).
- Leva di fiducia: chiedere la recensione nel momento di massima soddisfazione; canale semplice (link diretto al profilo Google).

---

### Sintesi emozionale (curva)
- Ansia alta in Fase 1-2 -> fiducia crescente in Fase 3-4 -> picco di tensione in Fase 5 (pagamento anticipato) -> sollievo guidato in Fase 6-7 -> picco positivo in Fase 8 -> advocacy in Fase 9.
- Implicazione: i due momenti da curare di piu sono il **checkout (Fase 5)** e il **silenzio durante la lavorazione (Fase 7)**.

### Mappatura fase -> capitolo/SPEC (per non duplicare)
- Acquisizione/contenuti: @09.
- Pagine e ordine sezioni: @03.
- Form e logica condizionale: @04 (+ SPEC_API_Contracts, SPEC_Data_Model).
- Pagamento/area riservata: @06 (+ @07 webhook, @11 sicurezza).
- Eventi citati: nomi canonici in SPEC_Event_Taxonomy (@08).
- Comunicazioni email/stati: @05 (CRM) + @07 (Resend).
- Tutele legali (recesso/garanzia/privacy): @10.

---

## Idee future
- Customer journey map visuale (diagramma a corsie: cliente / sistema / Lorenzo) come immagine da prototipo.
- Versione "journey" per il caso complesso (piu eredi/immobili) e per l'erede diffidente (confronto col fai-da-te).
- Email/onboarding personalizzati per stato emotivo (sequenze nurturing per chi abbandona il form).
- Misurazione del funnel per fase con tassi di drop-off reali e ottimizzazione iterativa.

---

## Nodi da sciogliere
- Cosa succede se il cliente abbandona il form a meta: prevediamo salvataggio parziale + email di recupero? (decisione di prodotto, impatta @04).
- Frequenza e contenuto delle notifiche di avanzamento durante la lavorazione (equilibrio tra rassicurare e non spammare).
- Gestione del "preventivo non immediato" (lead che vuole essere ricontattato vs acquisto diretto): un solo percorso o due?
- Nomi definitivi degli eventi di tracciamento citati qui (allineare a SPEC_Event_Taxonomy).

## Passi successivi
- [ ] Validare la sequenza delle 9 fasi con Lorenzo (rispecchia il suo modo di lavorare? @05).
- [ ] Allineare gli eventi citati ai nomi canonici in SPEC_Event_Taxonomy (@08).
- [ ] Definire le email transazionali per ogni transizione di stato (testi + trigger, @05/@07).
- [ ] Usare questa journey come copione per il prototipo navigabile (GESTIONE_PROGETTO).
- [ ] Derivare da qui i punti di misurazione del funnel (drop-off per fase).

---

## Decisioni congelate (lock-in)
- Esiste una sola customer journey ufficiale di riferimento: questa (9 fasi), da cui derivano copy, UX e prototipo.
- Modello a pagamento anticipato: il checkout (Fase 5) e un momento critico e va sempre accompagnato da garanzia/recesso visibili (@10).
- Momento della richiesta recensione: 48h dopo lo stato "Chiusa" (coerente con @09/@05).
- La journey non duplica i dettagli tecnici: i valori canonici restano nelle SPEC e nei rispettivi capitoli.

---

## Rischi / Compliance & Riferimenti
- Rischio conversione: un checkout anticipato senza rassicurazioni adeguate (garanzia/recesso) abbatte il tasso d'acquisto (@10).
- Rischio retention: assenza di comunicazioni in Fase 7 genera ansia, ticket e recensioni negative.
- Rischio compliance: consensi privacy/cookie e diritto di recesso devono essere presenti nei punti giusti del percorso (@10).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni customer journey, struttura sito, form, area riservata).
