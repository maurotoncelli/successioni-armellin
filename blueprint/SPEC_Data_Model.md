# SPEC - Data Model (Single Source of Truth)

> FONTE DI VERITA dello schema dati. Qualsiasi capitolo che usa entita/campi/enum deve LINKARE questo file, non ridefinirli.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22
> Riferimenti: @07_Stack (Supabase/Postgres), @05_CRM, @06_Area_Riservata, @11_Sicurezza (RLS), @10_Legale_Compliance (retention).

## Convenzioni
- Database: PostgreSQL (Supabase). Tabelle e colonne in snake_case. Valori enum in UPPER_SNAKE.
- Chiavi primarie: uuid (default gen_random_uuid()).
- Timestamp: created_at, updated_at (timestamptz). updated_at gestito da trigger.
- Autenticazione gestita da Supabase Auth (schema auth.users). I dati applicativi vivono in public.

## Enum canonici
- role: ADMIN | CLIENT
- practice_status: LEAD | PREVENTIVO_INVIATO | PAGATO | ATTESA_DOC | LAVORAZIONE | INVIATA | CHIUSA | ANNULLATA
- package_type: SEMPLICE | COMPLETO | ZERO_STRESS
- quote_outcome: NON_OBBLIGO | PREZZO_IMMEDIATO | SU_MISURA  (esiti A/B/C del form, @04)
- estate_value_band: UNDER_100K | FROM_100K_TO_1M | OVER_1M
- applicant_relation: CONIUGE | FIGLIO | FRATELLO | ALTRO
- payment_status: NONE | PENDING | PAID | PARTIALLY_REFUNDED | REFUNDED
- payment_method: STRIPE | BANK_TRANSFER | CASH | OTHER  (STRIPE = online; gli altri = pagamento registrato a mano da Lorenzo, @05)
- adjustment_type: UPGRADE | DOWNGRADE | CUSTOM  (conguaglio cambio pacchetto / preventivo su misura, @05)
- adjustment_status: PENDING | PAID | REFUNDED | CANCELLED
- scheduled_action_status: SCHEDULED | SENT | CANCELLED  (finestra di annullamento automazioni, @05)
- action_owner: ADMIN | CLIENT | EXTERNAL | NONE  (chi deve compiere la prossima azione su una pratica aperta; usato per filtri/badge "Tocca a te / In attesa del cliente / In attesa AdE", @05. Derivato dallo stato + stato checklist e materializzato per filtrare velocemente)
- comm_channel: EMAIL | WHATSAPP | SMS | PHONE | IN_PERSON | OTHER  (canale di una comunicazione, @05)
- comm_direction: INBOUND | OUTBOUND  (in entrata dal cliente / in uscita verso il cliente)
- comm_source: AUTO | MANUAL  (AUTO = inviata dal sistema/automazione; MANUAL = registrata a mano da Lorenzo)
- document_type: ID_CARD | CF | DEATH_CERTIFICATE | FAMILY_SELF_CERT | VISURA | PROVENANCE_DEED | FLOOR_PLAN | WILL | GUARDIAN_AUTH | BANK_BALANCE | IBAN_DOC | F24 | SUCCESSION_DECLARATION | INVOICE | RECEIPT | OTHER  (sono i `code` standard del document_catalog; i tipi custom vivono solo nel catalogo, vedi sotto). Note dai casi reali (RIFERIMENTO 11.1): BANK_BALANCE = certificazione di saldo/giacenza di conti, libretti, titoli alla DATA DEL DECESSO; F24 = modello/quietanza di pagamento imposte autoliquidate; SUCCESSION_DECLARATION = copia della dichiarazione presentata; RECEIPT = attestazione di avvenuta presentazione/registrazione (questi ultimi tre sono tipicamente `is_final`)
- approval_status: PENDING | APPROVED | REJECTED  (stato del singolo file caricato)
- requirement_status: ATTESO | CARICATO | APPROVATO | RIFIUTATO | NON_APPLICABILE  (stato della voce di checklist; mappa client-facing: ATTESO=Da caricare, CARICATO=Caricato, RIFIUTATO=Da rifare, APPROVATO=interno, NON_APPLICABILE=nascosta al cliente) (@05/@06)
- extraction_status: QUEUED | PROCESSING | DONE | ERROR | SKIPPED  (stato dell'estrazione OCR/AI di un documento, @05; fast-follow V1.1)

## Tabelle

### contacts
Anagrafica/rubrica del CRM, indipendente dall'autenticazione. Un contatto puo avere piu pratiche (storico cliente).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| first_name | text | |
| last_name | text | |
| email | text | unique |
| phone | text | nullable |
| source | text | provenienza lead (es. form, ads, referral) |
| marketing_consent | boolean | default false |
| notes | text | note interne admin |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### profiles
Estende auth.users con dati applicativi e collega l'utente loggato alla sua anagrafica. id = auth.users.id.
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | = auth.users.id |
| contact_id | uuid FK -> contacts.id | collega l'account all'anagrafica |
| role | role | default CLIENT |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### practices
Unita centrale: nasce come LEAD dal form e attraversa la pipeline (@05).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | identificativo TECNICO (mai mostrato a voce); usato in URL/relazioni |
| practice_code | text UNIQUE | identificativo UMANO leggibile, formato `SUC-AAAA-NNNN` (@SPEC_Naming). Su Brogliaccio, email, riferimento fattura, citabile al telefono |
| contact_id | uuid FK -> contacts.id | anagrafica titolare della pratica (erede/cliente) |
| status | practice_status | default LEAD |
| action_owner | action_owner | default NONE; chi deve agire (ADMIN/CLIENT/EXTERNAL); derivato da status + stato checklist e materializzato per i filtri "Tocca a te / In attesa del cliente" (@05) |
| applicant_relation | applicant_relation | relazione di chi compila col defunto |
| deceased_name | text | nullable al lead |
| deceased_cf | text | CODICE FISCALE del defunto; validato e INDICIZZATO. Chiave di ricerca e di rilevamento duplicati/dichiarazioni integrative (NON unique hard, vedi nota) |
| date_of_death | date | per urgenza/scadenza 12 mesi |
| deceased_residence | text | competenza AdE |
| has_will | boolean | default false |
| heirs_count | int | default 1 |
| has_minor_heirs | boolean | flag Giudice Tutelare |
| has_real_estate | boolean | default false |
| real_estate_count | int | nullable |
| has_agricultural_land | boolean | default false; terreni/particelle agricole, annessi (flag complessita catastale, @04) |
| has_other_assets | boolean | default false; quote societarie/aziende/veicoli (flag complessita, @04) |
| requires_custom_quote | boolean | default false; true = caso complesso -> Esito C (@04/@05) |
| estate_value_band | estate_value_band | nullable |
| quote_outcome | quote_outcome | esito form A/B/C (@04); guida l'instradamento in thank-you e CRM |
| suggested_package | package_type | nullable; calcolato dal form (@04). Null se NON_OBBLIGO/SU_MISURA |
| selected_package | package_type | nullable; scelto/confermato |
| price | numeric(10,2) | onorario TOTALE dell'ordine (pacchetto + add-on + sovrapprezzi); per SU_MISURA = importo personalizzato impostato da Lorenzo (@05) |
| extra_property_fee | numeric(10,2) | +60/immobile oltre il 3 |
| line_items | jsonb | SNAPSHOT della composizione dell'ordine: array di { type: PACKAGE\|ADDON\|SURCHARGE, key, label, amount }. Fonte per riepilogo/fattura/conguaglio, indipendente da futuri cambi di listino (@04/@05) |
| payment_status | payment_status | default NONE |
| payment_method | payment_method | nullable; STRIPE per online, BANK_TRANSFER/CASH/OTHER per pagamento registrato a mano (@05) |
| stripe_payment_intent_id | text | nullable (assente per pagamenti offline) |
| paid_at | timestamptz | nullable |
| opened_at | timestamptz | nullable; apertura della scheda di lavorazione (= incarico/pagamento). Origine per il calendario e per "pratiche aperte" (@05) |
| docs_approved_at | timestamptz | nullable; istante in cui TUTTI i documenti obbligatori risultano approvati (ingresso in LAVORAZIONE). E da qui che decorre lo SLA di consegna (NON dal pagamento), @05/@10 |
| due_date | date | nullable; data di consegna prevista al cliente. Suggerita automaticamente = docs_approved_at + SLA del pacchetto (giorni lavorativi); modificabile da Lorenzo. Null finche i documenti non sono completi (@05) |
| submitted_at | timestamptz | nullable; data di invio telematico all'AdE (stato INVIATA) |
| includes_voltura | boolean | default false; voltura catastale richiesta con la dichiarazione (di norma true se has_real_estate). Conferma il valore del pacchetto Completo (@01) |
| submission_info | jsonb | nullable; PROVA di presentazione registrata all'invio (da Attestazione AdE, RIFERIMENTO 11.1): { telematic_protocol, registration_volume, registration_number, registration_year, competent_office, pages }. Usata per riferimento/ricerca e mostrata al cliente; il PDF originale resta in `documents` (RECEIPT, is_final) |
| state_taxes_amount | numeric(10,2) | nullable; TOTALE imposte di Stato (ipotecaria+catastale+bollo+tributi+eventuale imposta di successione) calcolate e COMUNICATE al cliente PRIMA dell'invio (promessa di trasparenza, FAQ @03). NON e l'onorario |
| state_taxes_breakdown | jsonb | nullable; dettaglio voci { ipotecaria, catastale, bollo, tributi_speciali, imposta_successione } per il riepilogo al cliente (@06) |
| state_taxes_communicated_at | timestamptz | nullable; quando le imposte sono state comunicate al cliente |
| payment_recorded_by | text | nullable; ADMIN se pagamento registrato manualmente, SYSTEM se via webhook |
| iban | text | CIFRATO a livello applicativo (@11) |
| call_notes | text | appunti della chiamata di consulenza (@05) |
| payment_notes | text | note sui pagamenti (es. estremi bonifico, accordi rateali) (@05) |
| notes | text | note interne generali / appunti extra (@05) |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

> Identificazione univoca di una successione: il PK tecnico e `id` (uuid). Per uso umano si usa `practice_code` (`SUC-AAAA-NNNN`). Il `deceased_cf` NON e un identificativo univoco affidabile (uno stesso defunto puo generare una dichiarazione integrativa/sostitutiva, o essere trattato in pratiche distinte); va usato come chiave di RICERCA e per AVVISARE in caso di possibile duplicato (constraint soft, non unique). Eventuale unicita "1 pratica attiva per CF defunto" si gestisce a livello applicativo con conferma, non con vincolo DB rigido.

> SCOPE (decisione di design, da esempio reale RIFERIMENTO 11.1): il nostro sistema e un CRM + portale cliente, NON un compilatore della dichiarazione. La compilazione del Modello AdE (quadri EA eredi, EB/EC catasto, EO titoli, ER conti, EE/EF imposte) avviene in **Sogei/Successioni Online**. Percio NON replichiamo nel DB il dettaglio di eredi, immobili, conti e titoli: ne teniamo solo i FLAG/CONTEGGI utili a qualificare, prezzare e generare la checklist (`has_real_estate`, `real_estate_count`, `has_will`, `heirs_count`, `has_minor_heirs`, `has_agricultural_land`, `has_other_assets`, `estate_value_band`), piu la PROVA di presentazione (`submission_info`), le IMPOSTE comunicate (`state_taxes_*`) e i DOCUMENTI (`documents`). Hook futuro: se introdurremo OCR/pre-compilazione o export verso Sogei, si aggiungeranno tabelle dedicate `heirs` e `assets` (oggi volutamente assenti per non duplicare Sogei).

### document_catalog
Catalogo dei TIPI di documento riutilizzabili: tipi standard di sistema (seed dai valori di document_type) + tipi CUSTOM creati da Lorenzo per casi particolari (@05). Serve a generare le checklist e a riusare i tipi custom su pratiche future.
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| code | text UNIQUE | UPPER_SNAKE; per gli standard = valore di document_type; per i custom generato (es. CUSTOM_<slug>) |
| label | text | etichetta leggibile mostrata in checklist (es. "Visura catastale") |
| help_text | text | nullable; spiegazione "cos'e / come ottenerlo" (tooltip lato cliente, @06) |
| default_required | boolean | default true |
| relevance_rule | text | nullable; condizione di pertinenza per la generazione automatica (es. "has_real_estate", "has_will", "has_minor_heirs") |
| is_system | boolean | true = standard di sistema (non eliminabile); false = custom creato da Lorenzo |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |

### document_requirements
Voci della CHECKLIST di UNA pratica: la lista (gestita da Lorenzo e mostrata al cliente) di cosa serve per quella pratica. Una voce puo avere 0..N file caricati (`documents`).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| catalog_id | uuid FK -> document_catalog.id | nullable (null se voce libera ad hoc) |
| label | text | etichetta mostrata (puo personalizzare, es. "Carta d'identita di Maria Rossi") |
| help_text | text | nullable; istruzioni per il cliente |
| is_required | boolean | obbligatoria (true) o facoltativa (false) |
| status | requirement_status | default ATTESO |
| is_custom | boolean | true = voce aggiunta ad hoc da Lorenzo |
| sort_order | int | ordine in checklist |
| rejection_reason | text | nullable; motivo se RIFIUTATO |
| admin_note | text | nullable; nota interna |
| created_by | text | SYSTEM (generazione automatica) / ADMIN (aggiunta da Lorenzo) |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

> Generazione: alla transizione a PAGATO/ATTESA_DOC un job crea le requirements dal `document_catalog` filtrando per `relevance_rule` sui dati della pratica (immobili, testamento, minorenni, ecc.). Lorenzo poi le modifica (aggiunge/rimuove/segna NON_APPLICABILE, cambia required/facoltativa, crea voci custom). La checklist e l'unica fonte di verita condivisa CRM (@05) <-> area cliente (@06).

### documents
File caricati e prodotti, collegati alla pratica e (per gli upload del cliente) alla voce di checklist.
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| requirement_id | uuid FK -> document_requirements.id | nullable; collega il file caricato alla voce di checklist (null per i documenti finali prodotti) |
| type | document_type | categorizzazione (per i custom: OTHER + label dalla requirement) |
| storage_path | text | path nel bucket privato |
| original_filename | text | |
| is_final | boolean | true = documento finale (ricevute/visure/fattura) |
| approval_status | approval_status | default PENDING |
| rejection_reason | text | nullable |
| uploaded_at | timestamptz | default now() |
| updated_at | timestamptz | |

### document_extractions (OCR/AI - fast-follow V1.1, dietro feature flag)
Bozza dei dati letti automaticamente da un documento tramite OCR + AI (@05 "Estrazione assistita"). E un AUSILIO: la verita resta il dato confermato/corretto da Lorenzo. Un record per documento elaborato.
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| document_id | uuid FK -> documents.id | on delete cascade; documento sorgente |
| status | extraction_status | QUEUED / PROCESSING / DONE / ERROR / SKIPPED |
| provider | text | servizio OCR/AI usato (UE), per audit |
| fields | jsonb | array di campi estratti: `{ key, value, confidence (0-1), page, bbox?, section }` |
| overrides | jsonb | correzioni manuali di Lorenzo per campo (override del valore proposto) |
| confirmed_by | text | nullable; ADMIN quando confermato |
| confirmed_at | timestamptz | nullable |
| error | text | nullable; messaggio errore (no PII) |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |
> Il **"Riepilogo dati consigliati"** della pratica e l'aggregazione (lato app) dei `fields`/`overrides` confermati per documento. Nessuna decisione automatizzata con effetti legali (decide Lorenzo, @10). I valori sensibili (es. IBAN) seguono cifratura applicativa e cancellazione dopo l'uso (@11/@10). Non esposta al CLIENT (RLS: ADMIN/SYSTEM only).

### practice_adjustments
Conguagli per cambio pacchetto e preventivi personalizzati (@05). Ogni riga = un addebito/rimborso della differenza, separato dal pagamento iniziale della pratica.
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| type | adjustment_type | UPGRADE (addebito differenza) / DOWNGRADE (rimborso differenza) / CUSTOM |
| from_package | package_type | nullable; pacchetto precedente |
| to_package | package_type | nullable; nuovo pacchetto (null se CUSTOM/su misura) |
| amount | numeric(10,2) | importo del conguaglio (sempre positivo; il segno e dato da type) |
| status | adjustment_status | default PENDING |
| stripe_ref | text | nullable; payment_intent (upgrade) o refund id (downgrade) |
| created_by | text | ADMIN/SYSTEM |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### communications
Cronologia delle comunicazioni col cliente per ciascuna pratica: sia quelle AUTOMATICHE inviate dal sistema (email/WhatsApp di stato, solleciti) sia quelle registrate A MANO da Lorenzo (es. chiamata inattesa, email/PEC ricevuta). Distinta da `log_events` (audit tecnico delle azioni): qui c'e il "diario relazione cliente" leggibile (@05).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| channel | comm_channel | EMAIL/WHATSAPP/SMS/PHONE/IN_PERSON/OTHER |
| direction | comm_direction | INBOUND (dal cliente) / OUTBOUND (al cliente) |
| source | comm_source | AUTO (sistema) / MANUAL (Lorenzo) |
| subject | text | nullable; oggetto/titolo breve |
| body | text | nullable; contenuto o sintesi/nota (per i manuali = appunti di Lorenzo) |
| occurred_at | timestamptz | quando e avvenuta; per i manuali e impostabile (data/ora reali, anche passate) |
| template_key | text | nullable; per le AUTO, quale template e stato usato |
| created_by | text | ADMIN (manuale) / SYSTEM (automatica) |
| created_at | timestamptz | default now() |

> Le automazioni che inviano email/WhatsApp (@05) creano anche un record `communications` (source=AUTO) cosi la cronologia e completa. Allegati non gestiti qui in v1 (riferirsi a `documents` se serve).

### withdrawal_requests
Richieste di recesso/rimborso avviate dal cliente (area riservata, @06) o registrate da Lorenzo (email/PEC). Tracciano la richiesta per la finestra dei 14 giorni e l'audit; l'esecuzione del rimborso avviene dal pannello recesso del CRM (@05).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| channel | text | AREA_RISERVATA / EMAIL / PEC / ALTRO |
| reason | text | nullable; motivo facoltativo indicato dal cliente |
| status | text | RICHIESTO / IN_GESTIONE / RIMBORSATO / NON_DOVUTO / ANNULLATO |
| requested_at | timestamptz | default now(); fa fede per la finestra dei 14 giorni |
| handled_by | text | nullable; ADMIN quando gestita |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |
> L'esito economico (rimborso integrale/parziale/non dovuto) e la sua esecuzione Stripe sono gestiti in @05; qui si traccia la richiesta e il suo stato.

### tasks
Promemoria / To-Do di Lorenzo: annotazioni manuali su cosa fare, legate a una pratica o generali (`practice_id` nullo). Interni (mai inviati al cliente), distinti da scheduled_actions (automazioni) e dagli alert di sistema (@05).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | NULLABLE; null = To-Do generale non legato a una pratica; on delete cascade |
| title | text | testo del promemoria |
| due_date | date | nullable; per il raggruppamento Oggi/In arrivo/Arretrati in home |
| is_done | boolean | default false |
| completed_at | timestamptz | nullable; valorizzato quando is_done=true |
| created_by | text | ADMIN |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### scheduled_actions
Azioni/automazioni schedulate con finestra di annullamento (undo-send) e supporto a "Annulla ultima azione" (@05).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| action | text | es. "email_chiusura", "email_preventivo", "review_request" |
| run_at | timestamptz | quando il job effettivo verra eseguito (now + finestra annullamento) |
| status | scheduled_action_status | default SCHEDULED |
| payload | jsonb | dati per l'esecuzione (no PII inutile) |
| cancelled_by | text | nullable; ADMIN se annullata manualmente |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

> Nota: gli effetti NON reversibili automaticamente (refund Stripe, offline conversion Google Ads) NON usano scheduled_actions come unico presidio: richiedono conferma esplicita e pulsante dedicato (@05).

### log_events
Audit/cronologia per CRM e compliance (@05/@11).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| practice_id | uuid FK -> practices.id | on delete cascade |
| actor | text | ADMIN/CLIENT/SYSTEM |
| action | text | es. "preventivo_inviato", "documento_rifiutato", "documento_approvato", "checklist_voce_aggiunta", "checklist_voce_rimossa", "tipo_documento_custom_creato", "cambio_pacchetto", "azione_annullata", "rettifica_inviata", "imposte_comunicate", "dichiarazione_presentata", "estrazione_completata", "estrazione_confermata" |
| metadata | jsonb | dettagli opzionali (no PII inutile) |
| created_at | timestamptz | default now() |

## Contenuti sito (CMS leggero, gestito dal CRM)
> Layer di contenuti EDITABILE da Lorenzo dal CRM e consumato dal sito pubblico. Il sito resta statico/cache (SSG+ISR): le pagine NON leggono il DB a ogni visita; alla pubblicazione il CRM invalida la cache (revalidate on-demand) e rigenera solo le pagine impattate (@07). Pattern Draft/Published + locale per i18n; testi legali fanno fede in IT (@10).

### packages
Pacchetti acquistabili: UNICA fonte per pagina Tariffe (@03) e checkout (@04). Gli attributi sono editabili; l'identita resta l'enum `package_type` per non rompere relazioni e snapshot.
| Campo | Tipo | Note |
|-------|------|------|
| key | package_type PK | identita stabile (SEMPLICE/COMPLETO/ZERO_STRESS) |
| name | text | nome commerciale mostrato |
| tagline | text | nullable; sottotitolo |
| description | text | descrizione/cosa include |
| features | jsonb | elenco voci incluse (array di stringhe) |
| price | numeric(10,2) | onorario corrente |
| extra_property_fee | numeric(10,2) | nullable; +X per immobile aggiuntivo |
| sla_days | int | nullable; SLA di consegna in GIORNI LAVORATIVI, decorrenti da docs_approved_at (@05/@10). Usato per suggerire due_date e per il claim su Tariffe |
| badge | text | nullable; es. "Piu scelto" |
| sort_order | int | ordine in pagina |
| is_active | boolean | default true; se false non acquistabile/non mostrato |
| updated_at | timestamptz | |

> Snapshot prezzo: il prezzo applicato a una pratica e gia salvato su `practices.price`/`extra_property_fee` al momento dell'incarico; modificare un `packages.price` NON altera le pratiche esistenti (storico preservato). Un cambio prezzo segnala il promemoria di rivedere le Condizioni di Vendita (@10).

### addons
Servizi aggiuntivi/upsell acquistabili insieme a un pacchetto (es. Riunione di Usufrutto). Gestiti dal CMS come i pacchetti; NON sono un carrello, ma opzioni del singolo ordine (@04).
| Campo | Tipo | Note |
|-------|------|------|
| key | text PK | slug stabile (es. RIUNIONE_USUFRUTTO) |
| name | text | nome mostrato |
| description | text | nullable |
| price | numeric(10,2) | prezzo onorario dell'add-on |
| is_active | boolean | default true |
| sort_order | int | |
| updated_at | timestamptz | |

### faqs
Domande frequenti mostrate su /faq e in homepage (schema FAQPage, @09).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| locale | text | es. it, en, ar... |
| question | text | |
| answer | text | (markdown semplice) |
| category | text | nullable; raggruppamento |
| sort_order | int | |
| is_published | boolean | default false |
| updated_at | timestamptz | |

### content_entries
Testi/blocchi/configurazioni editabili e generici (hero, sezioni pagina, microcopy, impostazioni). Chiave logica + locale.
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| collection | text | es. "home", "tariffe", "chi_siamo", "settings" |
| key | text | es. "hero_title", "hero_subtitle" |
| locale | text | it/en/... |
| value | jsonb | testo o struttura (validati con Zod lato app, con fallback di default) |
| is_published | boolean | default false |
| version | int | default 1; incrementato a ogni pubblicazione (audit/rollback) |
| updated_at | timestamptz | |
> Unicita logica: (collection, key, locale). I testi legali (T&C, privacy) restano versionati e pubblicati con attenzione; la versione IT fa fede (@10).

### media_assets
Immagini/asset del sito gestiti dal CRM (bucket PUBBLICO separato dai documenti privati dei clienti).
| Campo | Tipo | Note |
|-------|------|------|
| id | uuid PK | |
| key | text | uso logico (es. "hero_home", "team_lorenzo") |
| storage_path | text | path nel bucket pubblico `site-assets` |
| alt_text | text | accessibilita/SEO |
| width | int | nullable; per evitare layout shift (next/image) |
| height | int | nullable |
| is_published | boolean | default true |
| updated_at | timestamptz | |

## Relazioni
- contacts 1—N practices (contact_id) -> storico cliente
- contacts 1—1 profiles (profiles.contact_id) -> accesso area cliente
- practices 1—N document_requirements (checklist della pratica)
- document_requirements 1—N documents (file caricati per quella voce)
- document_catalog 1—N document_requirements (tipo -> voci che lo usano)
- practices 1—N documents
- practices 1—N communications (cronologia comunicazioni)
- practices 1—N tasks (To-Do; practice_id nullable per i To-Do generali)
- practices 1—N withdrawal_requests (richieste di recesso)
- practices 1—N practice_adjustments
- practices 1—N scheduled_actions
- practices 1—N log_events
- documents 1—N document_extractions (un'estrazione OCR/AI per documento elaborato; practice_id ridondato per RLS/query)
- packages 1—N practices (via package_type su selected_package/suggested_package; relazione logica per enum, non FK rigida)
- (contenuti) packages / addons / faqs / content_entries / media_assets sono entita indipendenti dalle pratiche (CMS sito); la composizione acquistata e salvata come snapshot in practices.line_items

## RLS (principi - dettaglio in @11)
- RLS attiva su TUTTE le tabelle.
- CLIENT: puo leggere/scrivere solo le proprie practices/documents (collegate alla propria anagrafica). Puo LEGGERE i propri practice_adjustments (trasparenza sul conguaglio), in sola lettura.
- document_requirements: CLIENT legge SOLO le voci della propria pratica con status != NON_APPLICABILE (le voci non applicabili non sono mostrate); puo aggiornare lo stato caricando file (ATTESO->CARICATO) ma NON puo creare/eliminare voci ne marcare APPROVATO/RIFIUTATO/NON_APPLICABILE (azioni ADMIN). ADMIN: gestione completa.
- document_catalog: lettura ADMIN/SYSTEM; scrittura ADMIN (creazione/modifica tipi custom). Non esposto direttamente al CLIENT (le label arrivano via document_requirements).
- communications: ADMIN/SYSTEM only (diario interno; non esposto al CLIENT in v1).
- document_extractions: ADMIN/SYSTEM only (bozza dati OCR/AI; mai esposta al CLIENT). Scrittura dei `fields` via service_role (job); `overrides`/conferma solo ADMIN.
- tasks: ADMIN only (promemoria interni di Lorenzo; mai esposti al CLIENT).
- withdrawal_requests: il CLIENT puo CREARE e LEGGERE le richieste della propria pratica (stato), ma non modificarne l'esito; gestione/avanzamento solo ADMIN.
- Contenuti sito (packages, addons, faqs, content_entries, media_assets): LETTURA PUBBLICA solo dei record pubblicati/attivi (`is_published`/`is_active`), tipicamente servita da pagine statiche/cache (non query per-visita); SCRITTURA e lettura dei draft solo ADMIN. Bucket `site-assets` pubblico in lettura, upload solo ADMIN.
- scheduled_actions: ADMIN/SYSTEM only (mai esposta al CLIENT).
- ADMIN: accesso completo (role = ADMIN).
- service_role solo lato server (bypassa RLS) per operazioni di sistema (webhook, job, esecuzione/annullamento scheduled_actions).

Esempio di policy (pattern di riferimento):
```sql
-- Un cliente vede solo le pratiche legate alla propria anagrafica
create policy "client_select_own_practices"
on public.practices for select
to authenticated
using ( contact_id = (select contact_id from public.profiles where id = auth.uid()) );

-- L'admin vede tutto
create policy "admin_all_practices"
on public.practices for all
to authenticated
using ( (select role from public.profiles where id = auth.uid()) = 'ADMIN' )
with check ( (select role from public.profiles where id = auth.uid()) = 'ADMIN' );
```

## Retention (coordinata con @10)
- Documenti con is_final = true (SUCCESSION_DECLARATION, RECEIPT, F24, VISURA aggiornate, INVOICE): conservati (accesso area cliente; archivio NAS) ~10 anni (@10 par. 4.1).
- Documenti di input sensibili (ID_CARD, CF, BANK_BALANCE, IBAN_DOC, ecc.): minimizzati/cancellati dopo la lavorazione (~30 gg dalla chiusura, @10).
- iban: cifrato; cancellato dopo l'uso (F24) secondo policy di retention.
- submission_info / state_taxes_*: metadati della pratica (non file), conservati con la pratica.
- document_extractions: bozze/dati estratti collegati a documenti di input sensibili -> stessa retention degli input (cancellati con/poco dopo i documenti sorgente); i valori sensibili (IBAN) seguono la policy dedicata. Non si conservano oltre il documento da cui derivano (@10/@11).
