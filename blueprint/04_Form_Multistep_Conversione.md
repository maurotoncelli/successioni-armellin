# 04. Form Multi-step / Motore di Conversione

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-04
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @03_Architettura_Informazione, @05_CRM, @08_Tracciamento, @10_Legale_Compliance
- Owner:

## Sintesi
Form multi-step di pre-valutazione (lead magnet) a 4 schermate con logica condizionale, mappatura automatica al pacchetto, consenso privacy e tracciamento eventi. Obiettivo: massimizzare il completamento (micro-impegno) e generare nel CRM una scheda lead gia qualificata.

---

## Stato attuale del progetto

### Implementazione (codice) - aggiornato 2026-06-22
- Form `/preventivo` a 4 step funzionante; lo step finale raccoglie nome/email/telefono + consensi.
- **Lead reale**: il submit chiama la server action `createLead` (`web/src/app/(site)/preventivo/actions.ts`) che crea un `contact` + una `practice` LEAD nel database, con pacchetto suggerito e flag "su misura" calcolati dalle risposte (esiti A/B/C), poi instrada alla thank-you. Verificato dal vivo (lead di prova -> codice `SUC-2026-0013` -> visibile nel CRM).
- Senza DB configurato il form resta funzionante (nessuna scrittura, solo routing all'esito) come fallback.
- **Ancora da fare**: eventi GA4 (`form_start/form_step/generate_lead`), Turnstile anti-abuso, validazione Zod lato server, email automatica di conferma reale.

### Principi UX
- Una domanda/blocco facile per schermata, transizioni sobrie, barra di progresso (Passo X di 4).
- Mobile-first, pulsanti grandi per le scelte multiple, navigazione "Indietro" che NON perde i dati.
- Validazione in tempo reale (Zod) con messaggi d'errore chiari.

### Step 1 - Informazioni di base
- Data del decesso (date). Nota: termine 12 mesi per la dichiarazione -> calcolo urgenza nel CRM.
- C'e un testamento? (Si / No / Non lo so).
- Residenza del defunto (comune/provincia) -> competenza territoriale.

### Step 2 - Eredi
- Chi compila la richiesta? (Coniuge / Figlio / Fratello-Sorella / Altro).
- Numero totale di eredi (1 / 2 / 3 / 4+).
- Eredi minorenni o incapaci? (Si / No) -> se Si, flag "Giudice Tutelare" (complessita).

### Step 3 - Patrimonio
- Ci sono immobili (case, terreni, box)? (Si / No).
  - Se Si: Quanti? (1 / 2-3 / piu di 3) -> attiva la voltura catastale.
  - Se Si: sono presenti **terreni agricoli / particelle / annessi rustici**? (Si / No / Non lo so) -> flag complessita catastale (richiede verifica numeri catastali e atti citati: e proprio il valore aggiunto del geometra, vedi @01).
- Ci sono conti correnti, libretti o investimenti? (Si / No).
- Ci sono **altri beni** (es. quote societarie, partecipazioni, aziende, veicoli registrati)? (Si / No) -> flag complessita -> preventivo personalizzato.
- Valore indicativo totale dell'eredita (Sotto 100.000 / 100.000-1.000.000 / Oltre 1.000.000).

> Nota raccolta requisiti (Riunione 1): il prezzo reale varia con immobili, annessi, particelle agricole e altri beni. Queste dimensioni servono sia per suggerire il pacchetto giusto sia per intercettare i casi che richiedono un preventivo su misura (e cosi proteggere Lorenzo dalla perdita sugli incarichi pesanti).

### Step 4 - Lead capture
- Nome, Cognome, Email (obbligatori), Telefono (opzionale, consigliato).
- Consenso privacy (obbligatorio, con link all'informativa) - requisito GDPR (@10).
- Consenso marketing (separato e facoltativo).
- Protezione anti-bot (Cloudflare Turnstile) + validazione.
- CTA: "Invia e Ricevi il Preventivo Gratuito".

### Thank-you page (`/preventivo/grazie`) - 3 esiti possibili
La thank-you NON mostra sempre un prezzo: instrada verso uno di tre esiti, in base alle risposte. Questo risolve i tre dubbi emersi in Riunione 1 (cliente che potrebbe non aver bisogno, scelta del pacchetto sbagliato, casi complessi sopra ~800 EUR).

1. **Esito A - "Potrebbe non servirti la successione"** (gate di non-obbligo, vedi sotto): messaggio onesto + offerta di una verifica (consulenza telefonica gratuita o pacchetto verifica a basso costo). NON si spinge un acquisto. Forte leva di fiducia e differenziatore (nessun competitor lo fa). Il lead resta in CRM per follow-up.
2. **Esito B - Caso lineare -> prezzo immediato**: pacchetto suggerito + onorario fisso visibile + CTA "Procedi al pagamento" + invito a leggere la **guida alla scelta del pacchetto** e a una chiamata di riallineamento (vedi @05). Vale per Semplice e Completo standard.
3. **Esito C - Caso complesso -> preventivo personalizzato**: nessun prezzo automatico; messaggio "Il tuo caso richiede una valutazione su misura" + CTA "Richiedi preventivo / Prenota la chiamata". Lorenzo emette poi il preventivo dal CRM con importo dedicato e link di pagamento (vedi @05). Copre i casi oltre Zero Stress (>~800 EUR) senza introdurre un 4o pacchetto pubblico che confonderebbe.

**Blocco "Ecco i documenti che ti serviranno" (Esiti B e C)**: usando le risposte gia date, la thank-you mostra la **lista personalizzata dei documenti** (stesso motore della Guida ai documenti @03 e della checklist @06: `document_catalog` + `relevance_rule`). Riduce l'ansia e prepara il cliente. Voci raggruppate con "cos'e/come si ottiene", nota che e **indicativa** (lista definitiva confermata da Lorenzo), hook "non ce l'hai? lo recuperiamo noi", e CTA "Scarica la lista (PDF)" / "Ricevila via email". In Esito A non si mostra (prima si verifica se serve la successione).

### Logica condizionale (regole)
- **Gate di non-obbligo (precede tutto)**: se immobili = No E nessun diritto reale immobiliare E valore = "Sotto 100.000" E erede = coniuge/figlio (linea retta) E nessun testamento/complessita -> Esito A "potrebbe non servire la dichiarazione" (rif. art. 28 c.7 TUS: esonero con coniuge/parenti in linea retta + attivo <= 100.000 EUR + nessun immobile). Soglia operativa esatta da confermare con Lorenzo (lui cita ~80.000 prudenziali) - vedi DOMANDE_PER_LORENZO.
- Se immobili = No (e fuori dal gate) -> pacchetto suggerito = Semplice (Esito B).
- Se immobili = Si (1 / 2-3), nessun flag complessita -> pacchetto suggerito = Completo (Esito B).
- Se immobili = piu di 3 -> Completo + maggiorazione (+60/immobile oltre il 3) (Esito B se calcolabile, altrimenti C).
- **Flag complessita -> Esito C (preventivo personalizzato)**: terreni agricoli/particelle/annessi, altri beni (quote societarie/aziende), testamento "Si", eredi all'estero, recupero documenti, valore "Oltre 1.000.000", piu immobili in comuni diversi. Sopra la fascia di Zero Stress si va sempre su misura.
- Flag servizio (urgenza vicino alla scadenza, recupero documenti) senza complessita patrimoniale -> evidenziare opzione Zero Stress (Esito B).
- Zero Stress dipende dal livello di servizio (recupero documenti, urgenza), non solo dal patrimonio: proposto come scelta/upsell, non forzato.

### Mappatura dati (form -> CRM)
| Campo form | Campo CRM (@05) | Uso |
|------------|-----------------|-----|
| data decesso | date_of_death | urgenza, scadenza |
| testamento | has_will | iter, complessita |
| residenza defunto | (nota pratica) | competenza AdE |
| chi compila | (relazione erede) | franchigie/contesto |
| n. eredi | heirs_count | complessita/quote |
| minorenni | flag giudice tutelare | complessita |
| immobili si/no + quanti | has_real_estate | pacchetto, voltura |
| terreni agricoli/particelle/annessi | flag complessita catastale | routing preventivo personalizzato |
| altri beni (quote/aziende/veicoli) | flag complessita | routing preventivo personalizzato |
| conti/investimenti | (nota patrimonio) | pacchetto, gate non-obbligo |
| valore eredita | (fascia valore) | contesto imposte, gate non-obbligo |
| esito form (A/B/C) | quote_outcome | non-obbligo / prezzo / su misura |
| pacchetto suggerito | selected_package | preventivo |
| nome/cognome/email/tel | User | contatto |

### Tracciamento (dettaglio @08)
- form_start (avvio form), form_step_1/2/3 (avanzamento), generate_lead (submit Step 4).

### Checkout e ordine (NIENTE carrello multi-prodotto) (Riunione 1)
> Decisione: NON serve un carrello da e-commerce. Si acquista UN servizio per volta (1 pratica = 1 ordine), con un **riepilogo ordine chiaro**. Un carrello multi-item aggiungerebbe complessita e abbandoni senza benefici, in un contesto YMYL e con utenza over-50.
- **Modello "ordine singolo"**: una pratica = un ordine = un pagamento. Niente stato "carrello" persistente, niente acquisti multipli in un colpo.
- **Pagina `/checkout` = Riepilogo ordine** (non un cart): mostra il pacchetto scelto, gli eventuali **add-on/upsell** (es. Riunione di Usufrutto, urgenza), il **sovrapprezzo immobili** (+X oltre il 3o), poi **Onorario + IVA + Cassa** e la nota "**imposte di Stato a parte**" (@10). Total chiaro prima del pagamento.
- **Add-on come opzioni** (toggle/checkbox) nel riepilogo, non come prodotti separati in un cart; il totale si ricalcola. Editabili da Lorenzo via CMS (catalogo `addons`, @05/@07).
- **Snapshot `line_items`**: alla conferma, la composizione dell'ordine (pacchetto + add-on + sovrapprezzi) e salvata come snapshot sulla pratica (per riepilogo, fattura e conguaglio), indipendente da futuri cambi di listino (@SPEC_Data_Model).
- **Due ingressi, stesso ordine**: self-service (Esito B, il cliente paga da solo) o assistito (Lorenzo invia il link con l'importo composto, @05). Esito C: l'ordine nasce dal preventivo su misura di Lorenzo.
- **Modifiche dopo il pagamento**: gestite dal **cambio pacchetto / conguaglio** gia previsto (link per la differenza o rimborso parziale), che fa le veci di un "modifica carrello" post-acquisto (@05).
- **Piu successioni**: sono ordini/pratiche separate (ognuna con suo mandato, documenti, CF defunto); se capita, si fanno in sequenza - non si "mettono nel carrello" insieme.
- **Metodi di pagamento visibili al checkout**: carta e bonifico come primari + **rate/BNPL** (PayPal Pay in 3, Klarna, Scalapay) dove idonei, mostrati gia nella pagina di pagamento con microcopy "Puoi pagare a rate" (e accennati su Tariffe). Si rateizza l'**onorario**, non le imposte di Stato (@07/@10).
- **Micro-trust al checkout**: vicino al pulsante di pagamento, una riga rassicurante "Pratica seguita dal Geom. Armellin (abilitato Entratel) con supervisione fiscale di un commercialista" + pagamenti sicuri/GDPR. Riduce l'ansia "sto pagando la persona giusta?" nel momento decisivo (@02/@03). Claim veritiero (@10).
- **Consensi al checkout**: accettazione T&C, privacy, e (se sceglie l'avvio immediato) consenso art. 59 + perdita recesso a esecuzione completata (@10). Stripe Checkout/Payment Element; area riservata sbloccata dopo il pagamento (@06).

---

## Idee future
- Salvataggio progressivo e ripresa del form da link via email (recupero abbandoni).
- Domanda facoltativa "stato dei documenti" per instradare meglio verso Zero Stress.
- Pre-compilazione via OCR in fase successiva (area riservata, @05/@06).
- A/B test su copy, ordine domande e wording della CTA.

---

## Nodi da sciogliere
- Preventivo istantaneo onorario in thank-you page: SCIOLTO (Riunione 1) con il modello ibrido a 3 esiti (A non-obbligo / B prezzo immediato per casi lineari / C preventivo personalizzato per casi complessi). Le imposte restano comunque stimate manualmente.
- Soglia e criterio esatti del gate di non-obbligo (Lorenzo cita ~80.000 EUR prudenziali; legge ~100.000 con condizioni) - DA CONFERMARE (DOMANDE_PER_LORENZO).
- Esito A: la verifica "non ti serve" e gratis (consulenza telefonica) o un micro-pacchetto a pagamento? (decisione di prodotto/business, @01/@13).
- Telefono obbligatorio o opzionale? (proposta: opzionale in generale, ma OBBLIGATORIO negli Esiti A e C, dove la chiamata e parte del servizio).
- Aggiungere la domanda "stato documenti" gia in v1 per il routing a Zero Stress?

## Passi successivi
- [ ] Definire micro-copy esatto di domande, placeholder, tooltip (termini come "testamento") e messaggi d'errore.
- [ ] Definire schema Zod di validazione per ogni campo.
- [ ] Definire testo e consensi dello Step 4 con il legale (@10).
- [ ] Definire il calcolo del pacchetto suggerito (regole sopra) condiviso con @05.
- [ ] Definire layout e contenuto della thank-you page.

---

## Decisioni congelate (lock-in)
- Form a 4 step con barra di progresso e logica condizionale.
- Campi minimi al lead: Nome, Cognome, Email (obbligatori) + Telefono (opzionale).
- Consenso privacy obbligatorio allo Step 4; marketing separato e facoltativo.
- Anti-bot (Turnstile) + validazione Zod (@07).
- Mappatura automatica al pacchetto suggerito secondo le regole condizionali.
- Thank-you a 3 esiti (Riunione 1): A non-obbligo (onesta/verifica), B prezzo immediato (casi lineari), C preventivo personalizzato (casi complessi/oltre Zero Stress). Nessun 4o pacchetto pubblico.
- Lista documenti personalizzata in thank-you (Esiti B/C) e pagina Guida ai documenti (@03), generate dallo stesso motore della checklist (`document_catalog` + relevance_rule): coerenza pre-acquisto <-> post-acquisto. Lista indicativa, confermata da Lorenzo.
- Checkout a ORDINE SINGOLO senza carrello multi-prodotto: 1 pratica = 1 ordine; pagina `/checkout` = riepilogo ordine (pacchetto + add-on + sovrapprezzi + IVA/cassa, imposte di Stato a parte). Add-on come opzioni; snapshot `line_items` sulla pratica; modifiche post-acquisto via conguaglio (@05). Piu successioni = ordini separati.
- Eventi GA4: form_start, form_step_X, generate_lead (@08).

---

## Interfacce / Contratti (consuma -> espone)
- Consuma: leadSchema e regole di validazione (@SPEC_API_Contracts), enum/campi (@SPEC_Data_Model), token UI (@SPEC_Design_Tokens), eventi (@SPEC_Event_Taxonomy).
- Espone: POST /api/lead che crea una practice in stato LEAD con suggested_package; eventi form_start/form_step/generate_lead per @08; scheda lead per @05.

## Criteri di accettazione
- Dato un utente che completa i 4 step e acconsente alla privacy, quando invia, allora viene creata una practice LEAD e parte l'evento generate_lead.
- Se has_real_estate = false, allora lo step immobili non chiede il numero e suggested_package = SEMPLICE.
- Senza consenso privacy il submit e bloccato con messaggio chiaro.
- Il form e navigabile da tastiera, mostra la barra di progresso e "Indietro" non perde i dati.
- Il submit e protetto da Turnstile e validato lato server con Zod.

## Rischi / Compliance & Riferimenti
- Rischio GDPR: lead capture senza consenso/informativa corretti (@10).
- Rischio attrito: troppi campi o domande tecniche non spiegate -> abbandono; mantenere leggerezza e tooltip.
- Rischio dati errati: il valore eredita e la fascia sono indicativi, non base per calcoli fiscali (disclaimer).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni form multi-step, 4 step, logica condizionale, eventi GA4).
