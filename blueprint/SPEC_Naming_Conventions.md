# SPEC - Naming Conventions (Single Source of Truth)

> Registro dei NOMI ESATTI usati in tutto il progetto. L'AI deve usare queste stringhe identiche. Non inventare varianti.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22
> Riferimenti: @SPEC_Data_Model, @SPEC_Event_Taxonomy, @SPEC_Env_Vars, @07_Stack.

## Codice (convenzioni generali)
- Linguaggio: TypeScript (strict).
- Componenti React: PascalCase (es. PricingCard).
- File componente: PascalCase.tsx; util/lib: kebab-case.ts.
- Funzioni/variabili: camelCase. Costanti: UPPER_SNAKE.
- Tipi/Interfacce: PascalCase. Schemi Zod: camelCase con suffisso Schema (es. leadSchema).

## Database (vedi @SPEC_Data_Model)
- Tabelle/colonne: snake_case. Valori enum: UPPER_SNAKE.
- Tabelle: contacts, profiles, practices, document_catalog, document_requirements, documents, communications, tasks, withdrawal_requests, practice_adjustments, scheduled_actions, log_events, packages, addons, faqs, content_entries, media_assets.

## Identificativo pratica (codice umano)
- Formato: `SUC-AAAA-NNNN` (es. `SUC-2026-0001`). `AAAA` = anno, `NNNN` = progressivo azzerato a inizio anno (zero-padded a 4 cifre, estendibile).
- Generato alla creazione della practice; campo `practice_code` UNIQUE (@SPEC_Data_Model).
- Usato per: Brogliaccio PDF, oggetto/corpo email, riferimento in fattura, ricerca rapida nel CRM, comunicazione a voce col cliente. L'uuid resta solo tecnico (URL/relazioni).

## Rotte (URL) - vedi @03
- Pubbliche: `/`, `/tariffe`, `/chi-sono`, `/come-funziona`, `/faq`, `/guide`, `/guide/[slug]`, `/contatti`
- Funnel: `/preventivo`, `/preventivo/grazie`, `/checkout`
- Cliente: `/area-riservata`
- Legali: `/privacy`, `/cookie-policy`, `/termini-condizioni`, `/garanzia`
- Servizio: `/404`

## API / endpoint (vedi @SPEC_API_Contracts)
- `POST /api/lead`
- `POST /api/stripe/webhook`
- `POST /api/auth/otp` (richiesta OTP/magic link)
- `POST /api/checkout` (crea sessione Stripe per ordine singolo, @04)
- `POST /api/documents/upload` (o server action equivalente)
- `GET  /api/documents/[id]/download` (signed URL)
- `POST /api/revalidate` (revalidation on-demand contenuti, protetto da secret, invocato dal CRM)
- Server action CRM (solo ADMIN): `sendPreventivo`, `sendPaymentLink`, `registerOfflinePayment`, `changePackage`, `requestCustomQuote`, `refundPractice`, `cancelScheduledAction`, `updatePracticeNotes`, `setDueDate`, `logCommunication`, `addTask`, `toggleTask`, `updateTask`, `deleteTask`, `reviewDocument`, `generateChecklist`, `addRequirement`, `updateRequirement`, `setRequirementApplicability`, `removeRequirement`, `createCustomDocType`, `handleWithdrawal`, `setStatus`, `communicateTaxes` (registra/comunica le imposte di Stato al cliente, @06), `recordSubmission` (salva protocollo/estremi di registrazione dall'Attestazione AdE), `exportGestionale`.
- Azioni cliente (area riservata): `requestWithdrawal`, `getOrder` (oltre a upload/download e getChecklist).
- Server action CMS (solo ADMIN): `upsertPackage`, `upsertAddon`, `deleteAddon`, `upsertFaq`, `deleteFaq`, `upsertContent`, `uploadMedia`, `updateMedia`, `publishContent`.

## Storage (Supabase Storage)
- Bucket privato documenti: `client-documents`
- Struttura path: `client-documents/{practice_id}/{document_type}/{uuid}-{filename}`
- Bucket pubblico asset sito: `site-assets` (immagini gestite dal CMS); path `site-assets/{key}/{uuid}-{filename}`
- Cache tags revalidation: `packages`, `faqs`, `content:{collection}`

## Eventi GA4 (vedi @SPEC_Event_Taxonomy)
- page_view, form_start, form_step, generate_lead, view_quote, quote_no_obligation, view_document_guide, download_document_list, request_custom_quote, begin_checkout, purchase, change_package, file_upload, file_download

## Job / automazioni (Inngest/Trigger.dev) - vedi @12
- `lead.created`
- `custom_quote.requested`
- `preventivo.sent`
- `payment.succeeded`
- `payment.offline_recorded`
- `package.changed`
- `document.rejected`
- `practice.in_lavorazione`
- `practice.closed`
- `review.request` (cron 48h)
- `nas.export.prepared`
- `offline.conversion.sent`

## Stati pratica: etichette interne vs client-facing
| Enum (interno) | CRM (admin) | Area cliente (client-facing) |
|----------------|-------------|------------------------------|
| LEAD | Nuovo Lead | - |
| PREVENTIVO_INVIATO | Preventivo Inviato | Preventivo ricevuto |
| PAGATO | Pagato/Incaricato | Pagamento confermato |
| ATTESA_DOC | In Attesa Documenti | Documenti da caricare |
| LAVORAZIONE | In Lavorazione | In lavorazione |
| INVIATA | Inviata/Attesa AdE | Inviata all'Agenzia |
| CHIUSA | Chiusa | Conclusa |
| ANNULLATA | Persa/Annullata | Annullata |

## Variabili d'ambiente (vedi @SPEC_Env_Vars)
- Prefisso `NEXT_PUBLIC_` solo per valori esponibili al client; tutto il resto solo server.
