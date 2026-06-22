# SPEC - API Contracts (Single Source of Truth)

> Contratti di input/output per endpoint e server action. Gli schemi Zod sono condivisi tra client e server.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-21
> Riferimenti: @SPEC_Data_Model, @SPEC_Naming_Conventions, @04_Form, @05_CRM, @06_Area_Riservata, @11_Sicurezza.

## Principi
- Validazione SEMPRE lato server con Zod (non fidarsi del client).
- Accesso dati via supabase-js con RLS; service_role solo per webhook/job.
- Errori in formato uniforme: { error: { code, message } }.

## POST /api/lead
Crea una practice in stato LEAD dal form (@04).
- Request (leadSchema):
```ts
{
  contact_first_name: string,
  contact_last_name: string,
  contact_email: string /*email*/,
  contact_phone?: string,
  applicant_relation: 'CONIUGE'|'FIGLIO'|'FRATELLO'|'ALTRO',
  date_of_death: string /*ISO date*/,
  deceased_residence: string,
  has_will: boolean,
  heirs_count: number,
  has_minor_heirs: boolean,
  has_real_estate: boolean,
  real_estate_count?: number,
  estate_value_band: 'UNDER_100K'|'FROM_100K_TO_1M'|'OVER_1M',
  consent_privacy: true, /*obbligatorio*/
  consent_marketing?: boolean,
  turnstile_token: string
}
```
- Effetti: upsert del contact (per email) e creazione practice (status LEAD, contact_id, suggested_package calcolato), evento GA4 generate_lead, job `lead.created`.
- Response: { practice_id: string, suggested_package: PackageType, estimated_price: number }

## POST /api/stripe/webhook
Riceve eventi Stripe (verifica firma + idempotenza, @11).
- `checkout/payment_intent succeeded` (pagamento iniziale): practice.payment_status=PAID, payment_method=STRIPE, payment_recorded_by=SYSTEM, status=PAGATO, paid_at; crea profilo/invito area; job `payment.succeeded`; evento purchase server-side (@08).
- `payment_intent succeeded` collegato a un conguaglio UPGRADE: aggiorna il practice_adjustment a PAID; evento change_package (UPGRADE).
- `charge.refunded` (totale): payment_status=REFUNDED (recesso/garanzia, @05).
- `charge.refunded` (parziale): payment_status=PARTIALLY_REFUNDED; se collegato a conguaglio DOWNGRADE, aggiorna l'adjustment a REFUNDED; evento change_package (DOWNGRADE).
- Tutti gli eventi rilevanti scrivono log_events e sono idempotenti (chiave: stripe event id).

## POST /api/checkout
Crea la sessione di pagamento per UN ordine singolo (no carrello multi-prodotto, @04).
- Request: { practice_id, package: PackageType, addons?: string[] /*key*/, property_count?: number, consents: { tc: true, privacy: true, immediate_start?: boolean } }
- Effetti: compone il totale e lo SNAPSHOT `line_items` (pacchetto + add-on + sovrapprezzo immobili) dai listini pubblicati (`packages`/`addons`); crea la sessione Stripe; salva line_items/price sulla pratica; evento begin_checkout. La conferma avviene via webhook.
- Response: { checkout_url } (Stripe Checkout) oppure client_secret (Payment Element).

## POST /api/auth/otp
Richiesta accesso passwordless (@06).
- Request: { email: string }
- Effetto: invio Magic Link/OTP via Supabase Auth (rate limited, @11).

## Documenti (server action o route)
- upload: { practice_id, requirement_id, file } -> valida tipo/peso, salva su `client-documents`, crea record documents (PENDING) collegato alla voce di checklist; porta la requirement da ATTESO a CARICATO. Evento file_upload.
- download: { document_id } -> verifica RLS, restituisce signed URL a scadenza. Evento file_download.
- getChecklist(practice_id) -> elenco document_requirements applicabili (CLIENT: solo status != NON_APPLICABILE) con stato, label, help_text e file collegati.
- getOrder(practice_id) -> (CLIENT, propria pratica) riepilogo acquisto da `line_items` + price + payment_status/method/paid_at + eventuali practice_adjustments + URL fattura se disponibile. Sola lettura.
- requestWithdrawal(practice_id, { reason? }) -> (CLIENT) crea una `withdrawal_requests` (channel=AREA_RISERVATA, status=RICHIESTO) finche la pratica non e completata; notifica Lorenzo (pannello recesso @05); email di conferma ricezione (supporto durevole). Non esegue rimborsi (decisione/esecuzione lato ADMIN, `refundPractice`).
- getDocumentGuide({ has_real_estate?, has_will?, has_minor_heirs?, has_agricultural_land?, has_other_assets?, heirs_count? }) -> lista PUBBLICA dei documenti tipici, derivata da `document_catalog` filtrato per `relevance_rule` (label + help_text), raggruppata per scenario. Pre-acquisto, no login. USA LA STESSA funzione pura di matching usata da `generateChecklist` (@SPEC_Data_Model), cosi guida pre-acquisto e checklist post-acquisto coincidono. Servita da pagina statica/cache (catalogo pubblicato), nessuna scrittura.

## Letture CRM (solo ADMIN)
- listPractices({ q?, status[]?, action_owner[]?, payment_status[]?, flags?, date_range?{field,from,to}, sort?, page? }) -> elenco pratiche filtrato/ordinato/paginato; `q` cerca su practice_code, deceased_cf, nome/email/telefono contatto. Alimenta viste Kanban/Lista.
- listCalendar({ from, to, types[]? }) -> eventi calendario (opened_at, due_date, scadenza 12 mesi derivata, submitted_at, promemoria) nel range, ciascuno con practice_id per aprire la scheda.
- listCommunications(practice_id) -> cronologia comunicazioni (AUTO + MANUAL) ordinata per occurred_at desc.
- listTasks({ scope?: 'all'|'today'|'upcoming'|'overdue'|'open', practice_id? }) -> To-Do filtrati per la home o per la scheda; raggruppabili per due_date.
- getDashboard() -> contatori home operativa (schede attive con breakdown action_owner, completate nell'anno, da fare, in scadenza) + alert automatici.

## Azioni CRM (server action, solo ADMIN)
- sendPreventivo(practice_id, selected_package, price, extra_property_fee?) -> status PREVENTIVO_INVIATO; crea il link di pagamento e invia l'email; job `preventivo.sent`.
- sendPaymentLink(practice_id) -> (ri)genera e invia il link di pagamento Stripe per l'importo corrente (anche su misura), via email + opz. WhatsApp/SMS. Usato durante la chiamata. Non cambia stato finche non si paga.
- registerOfflinePayment(practice_id, method: 'BANK_TRANSFER'|'CASH'|'OTHER', amount, paid_at, payment_notes?) -> payment_status=PAID, payment_method, payment_recorded_by=ADMIN, status=PAGATO; NESSUNA chiamata Stripe; job `payment.offline_recorded`; promemoria fattura (semaforo, @05). Eccezione al pagamento online (@05).
- changePackage(practice_id, to_package | custom_amount) -> calcola la differenza vs importo gia pagato; se UPGRADE crea Payment Intent/Link per la differenza; se DOWNGRADE esegue refund parziale Stripe; crea practice_adjustment; job `package.changed`; evento change_package. Per pagamenti offline il conguaglio si registra a mano (registerOfflinePayment con segno coerente / nota).
- requestCustomQuote(practice_id) -> marca requires_custom_quote=true; job `custom_quote.requested` (notifica a Lorenzo per la chiamata). Tipicamente innescato dal form (Esito C, @04).
- refundPractice(practice_id, type: 'FULL'|'PARTIAL', amount?, reason) -> refund Stripe (totale/parziale) per recesso/garanzia (@05/@10); aggiorna payment_status; richiede conferma esplicita.
- handleWithdrawal(withdrawal_request_id, { status, refund? }) -> (ADMIN) avanza la richiesta di recesso (IN_GESTIONE/RIMBORSATO/NON_DOVUTO); se rimborso, richiama refundPractice; aggiorna pratica ad ANNULLATA quando pertinente; comunicazioni su supporto durevole (@05).
- cancelScheduledAction(scheduled_action_id) -> se status=SCHEDULED la porta a CANCELLED e annulla il job (finestra di annullamento / undo-send, @05).
- updatePracticeNotes(practice_id, { call_notes?, payment_notes?, notes? }) -> aggiorna le aree appunti della scheda; log_events.
- setDueDate(practice_id, due_date | null) -> imposta/azzera la data di consegna prevista (calendario/alert, @05).
- logCommunication(practice_id, { channel, direction, occurred_at?, subject?, body? }) -> registra a mano una comunicazione (source=MANUAL, created_by=ADMIN); occurred_at default now ma modificabile. Non invia nulla. Le AUTO sono create dai job di invio.
- addTask({ practice_id?, title, due_date? }) -> crea un To-Do (practice_id nullo = generale).
- toggleTask(task_id, is_done) -> segna Fatto/Da fare; valorizza/azzera completed_at.
- updateTask(task_id, { title?, due_date? }) / deleteTask(task_id) -> modifica/elimina un To-Do.

## Contenuti sito / CMS (server action, solo ADMIN)
- upsertPackage(key, { name?, tagline?, description?, features?, price?, extra_property_fee?, sla_days?, badge?, sort_order?, is_active? }) -> aggiorna un pacchetto; alla pubblicazione invalida tag `packages` (Tariffe + checkout). Cambio prezzo -> promemoria revisione T&C; cambio `sla_days` -> promemoria revisione art. 7 T&C (@10) e si riflette sul `due_date` suggerito delle nuove pratiche (@05).
- upsertFaq(id?, { locale, question, answer, category?, sort_order?, is_published }) / deleteFaq(id) -> gestisce le FAQ; invalida tag `faqs`.
- upsertContent(collection, key, locale, value, { is_published }) -> aggiorna un blocco/testo; incrementa version alla pubblicazione; invalida tag `content:{collection}`.
- uploadMedia({ key, file, alt_text }) / updateMedia(id, {...}) -> carica/aggiorna un'immagine nel bucket pubblico `site-assets`.
- publishContent({ targets[] }) -> pubblica le bozze e chiama la revalidation on-demand per i tag/percorsi impattati (@07).
- Endpoint protetto `POST /api/revalidate` (secret/Bearer, solo invocato dal CRM) -> esegue `revalidateTag`/`revalidatePath`.
- upsertAddon(key, { name?, description?, price?, sort_order?, is_active? }) / deleteAddon(key) -> gestisce gli add-on/upsell; invalida tag `packages` (riepilogo checkout/tariffe).
- Letture pubbliche (sito): `getPackages()`, `getAddons()`, `getFaqs(locale)`, `getContent(collection, locale)`, `getMedia(key)` -> servite da pagine statiche/cache (solo record pubblicati/attivi), NON per-richiesta.
- reviewDocument(document_id, decision: 'APPROVED'|'REJECTED', rejection_reason?) -> aggiorna approval_status del file e lo status della requirement collegata (APPROVATO/RIFIUTATO); se REJECTED job `document.rejected` (WhatsApp/email).
- generateChecklist(practice_id) -> crea le document_requirements dal document_catalog filtrando per relevance_rule sui dati pratica (di norma automatico alla transizione Pagato/Attesa Doc); created_by=SYSTEM.
- addRequirement(practice_id, { catalog_id? | label, help_text?, is_required }) -> aggiunge una voce alla checklist (da catalogo o libera ad hoc, is_custom=true); created_by=ADMIN; log `checklist_voce_aggiunta`.
- updateRequirement(requirement_id, { label?, help_text?, is_required?, sort_order? }) -> modifica/riordina una voce.
- setRequirementApplicability(requirement_id, applicable: boolean) -> marca NON_APPLICABILE (nascosta al cliente, tracciata) o la ripristina; nessuna cancellazione silenziosa.
- removeRequirement(requirement_id) -> rimuove una voce aggiunta per errore (solo se senza file approvati); log `checklist_voce_rimossa`.
- createCustomDocType({ label, help_text?, default_required, save_to_catalog: boolean }) -> crea un tipo documento custom; se save_to_catalog crea document_catalog (is_system=false) riusabile, altrimenti resta voce ad hoc della pratica; log `tipo_documento_custom_creato`.
- setStatus(practice_id, status) -> transizioni consentite (@05); le transizioni a effetto esterno passano per conferma + scheduled_actions (invio ritardato annullabile); job/evento associati.
- exportGestionale(practice_id) -> Brogliaccio PDF (Sogei Successioni Online, @05); import esterno da verificare.

> Effetti non reversibili automaticamente (refundPractice, offline conversion): SEMPRE dietro conferma esplicita, mai su drag e mai affidati alla sola finestra di undo (@05).

## Note
- Tutte le mutation registrano un log_events (audit, @SPEC_Data_Model).
- Le transizioni di stato seguono la pipeline del @05 (no salti arbitrari).
