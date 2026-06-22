# SPEC - Event Taxonomy (Single Source of Truth)

> Eventi di tracciamento canonici (dal @08). Nomi e parametri identici ovunque.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22
> Riferimenti: @08_Tracciamento, @04_Form, @05_CRM, @10_Legale_Compliance.

## Regole
- Consent Mode v2: gli eventi pubblicitari partono solo dopo consenso (@10).
- Nessuna PII grezza nei parametri. Enhanced conversions solo con identificatori hashati lato server.
- Valori monetari: value numerico + currency = "EUR".

## Eventi
| Evento | Quando | Parametri | Lato |
|--------|--------|-----------|------|
| page_view | navigazione (post-consenso) | page_path | client |
| form_start | avvio form preventivo | - | client |
| form_step | completamento step | step_number, step_name | client |
| generate_lead | submit Step 4 (@04) | suggested_package, quote_outcome, value, currency | client |
| view_quote | thank-you con esito form (@04) | quote_outcome, suggested_package, value, currency | client |
| quote_no_obligation | mostrato Esito A "potrebbe non servire" (@04) | estate_value_band | client |
| view_document_guide | uso della Guida ai documenti (@03) o blocco documenti in thank-you (@04) | source (page/thank_you), docs_count | client |
| download_document_list | scarica/riceve via email la lista documenti (@03/@04) | format (pdf/email) | client |
| request_custom_quote | CTA Esito C "preventivo su misura" (@04/@05) | reason (es. agricultural_land, other_assets, value_over_1m) | client |
| begin_checkout | avvio pagamento | package, value, currency | client |
| purchase | pagamento confermato | transaction_id, value, currency, package | server (webhook Stripe) |
| change_package | conguaglio cambio pacchetto (@05) | adjustment_type (UPGRADE/DOWNGRADE), from_package, to_package, value, currency | server |
| view_state_taxes | il cliente apre il riquadro/scheda Imposte di Stato in area riservata (@06) | - | client |
| file_upload | upload documento | doc_type | client |
| file_download | download documento finale | doc_type | client |
| (offline conversion) | pratica CHIUSA (@05) | value, currency, gclid/identificatore | server -> Google Ads |

> Nota su change_package: l'UPGRADE genera un incasso aggiuntivo (value positivo); il DOWNGRADE e un rimborso (da non inviare come purchase ad Ads). Le metriche di fatturato si riconciliano da DB/Stripe (@05), non solo da GA4.

## Mapping a job/trigger
- generate_lead -> job `lead.created`
- request_custom_quote -> job `custom_quote.requested` (notifica a Lorenzo per la chiamata, @05)
- purchase -> job `payment.succeeded`
- change_package -> job `package.changed` (crea practice_adjustment; upgrade=payment_intent, downgrade=refund)
- offline conversion -> job `offline.conversion.sent`
- email automatiche con finestra di annullamento -> schedulate via `scheduled_actions` (@05/SPEC_Data_Model), eseguite dal job a `run_at` se status ancora SCHEDULED
