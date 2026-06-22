# SPEC - Content Blocks (Single Source of Truth)

> Registro tecnico dei blocchi di contenuto editabili del sito. Derivato da `STRUTTURA_CONTENUTI_SITO.md` (testi/segnaposto) e agganciato a `content_entries` (@SPEC_Data_Model) e ai manager CMS (@05/@07).
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22
> Riferimenti: STRUTTURA_CONTENUTI_SITO, @03_Architettura_Informazione, @05_CRM, @07_Stack, @10_Legale_Compliance, SPEC_Data_Model.

## Regole
- Identita di un blocco = **(collection, key, locale)** in `content_entries` (unicita logica). `value` e `jsonb`.
- Ogni `key` ha un **tipo** (sotto) e un **default** (fallback se non pubblicato/mancante). I default sono i testi `[BOZZA]` in STRUTTURA (qui sintetizzati): la fonte copy resta STRUTTURA, qui sta il contratto tecnico.
- **Validazione**: ogni value e validato con **Zod** lato app secondo il tipo; se invalido/mancante -> default. Pubblicazione con `is_published` + `version` (audit/rollback).
- **Locale**: `translatable=si` -> esiste un record per ogni locale (IT fa fede, traduzioni AI @07). `translatable=no` -> valore unico (es. href, numeri, flag).
- **Data-driven (NON content_entries)**: pacchetti/add-on (`packages`/`addons`), FAQ (`faqs`), articoli (`articles`), immagini/fac-simile (`media_assets`). Qui marcati `[REF]` con la tabella sorgente; il sito li legge dalle loro tabelle, non da `content_entries`.
- **Rendering**: pagine statiche/ISR con on-demand revalidation alla pubblicazione (@07). Nessuna query per-visita.

## Tipi e forme (schema Zod di riferimento)
| Tipo | Forma `value` | Note |
|------|---------------|------|
| `string` | `string` | riga breve; no HTML |
| `richtext` | `string` (markdown) | paragrafo; markdown sanificato (@11) |
| `bool` | `boolean` | flag |
| `cta` | `{ label: string, href: string }` | `label` translatable; `href` no |
| `image_ref` | `{ asset_key: string }` | risolto su `media_assets.key`; alt da `media_assets` |
| `list` | `array<item>` | forma dell'item descritta nella colonna Note |
| `object` | oggetto strutturato | forma descritta nella colonna Note |

> Convenzione naming: `collection` = pagina/area (snake_case); `key` = `sezione_campo` (snake_case). CTA con suffisso azione (`_cta`, `_button`), titoli `_title`, sottotitoli `_subtitle`/`_body`.

---

## GLOBALI

### collection `navbar`
| key | tipo | translatable | default ([BOZZA]) / note |
|-----|------|--------------|--------------------------|
| logo | image_ref | no | asset logo; link a `/` |
| menu | list | si | item `{label, href}`; voci: Come funziona, Tariffe, Chi sono, Guide, FAQ, Contatti |
| cta | cta | label si | "Calcola il preventivo gratis" -> `/preventivo` |
| cta_phone | cta | label si | "Parla con Lorenzo" -> `tel:` (numero in `settings`) |
| lang_switcher | object | no | `{ enabled: bool, locales: string[] }`; nomi nativi, persistenza scelta |

### collection `globals`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| mobile_cta | cta | label si | barra fissa mobile: "Calcola il preventivo gratis" -> `/preventivo` (+ icona tel) |
| trustbar_items | list | si | item `string`; vedi `home.trustbar_items` (riusato) |

### collection `footer`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| studio | object | parz. | `{ ragione_sociale, piva, albo, indirizzo }` (valori da `settings`/DOMANDE) |
| trust_line | string | si | "Geom. abilitato Entratel - con supervisione fiscale di un commercialista" |
| legal_menu | list | si | item `{label, href}`: Privacy, Cookie, T&C, Garanzia, Recesso |
| credit | string | si | "Realizzato da AT STUDIO" |

### collection `settings` (configurazioni globali)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| phone | string | no | numero telefono (usato da cta_phone, contatti) |
| whatsapp | string | no | url wa.me |
| email | string | no | email generale |
| pec | string | no | PEC |
| address | object | no | `{ via, cap, citta }` |
| opening_hours | list | si | item `{giorni, orario}` |
| social | list | no | item `{rete, url}` |

> CMP (banner consensi) = iubenda/Consent Mode v2 (@08/@10): NON e un blocco editabile.

---

## HOME — collection `home`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | "La tua pratica di successione, senza muoverti da casa." |
| hero_subtitle | richtext | si | promessa + "le imposte le calcoliamo noi prima" |
| hero_cta_primary | cta | label si | -> `/preventivo` |
| hero_cta_secondary | cta | label si | -> `#come-funziona` |
| hero_image | image_ref | no | ritratto/visual |
| hero_specialization_badge | string | si | "Il geometra specializzato nelle successioni" |
| trustbar_items | list | si | item `string` (Albo, Entratel, commercialista, Stripe, GDPR, SSL) |
| social_proof_stats | list | si | item `{valore, label}`; valori da DOMANDE |
| problema_title | string | si | — |
| problema_intro | richtext | si | — |
| problema_vantaggi | list | si | item `{titolo, testo}` (3) |
| come_funziona_title | string | si | — |
| come_funziona_steps | list | si | item `{icona, titolo, testo}` (3) |
| come_funziona_sla_note | string | si | "invio entro X gg dalla documentazione completa" |
| tariffe_title | string | si | — |
| tariffe_intro | richtext | si | onorario fisso, imposte a parte |
| tariffe_cta | cta | label si | -> `/tariffe` |
| faidate_title | string | si | "Si puo fare gratis... perche noi?" |
| faidate_intro | richtext | si | ammette opzione gratuita |
| faidate_confronto | list | si | item `{voce, faidate, noi}` |
| recensioni_title | string | si | — |
| recensioni_intro | string | si | — |
| chisono_title | string | si | — |
| chisono_estratto | richtext | si | geometra + commercialista |
| chisono_video | image_ref | no | video benvenuto (poster facade) |
| chisono_cta | cta | label si | -> `/chi-sono` |
| faq_title | string | si | — |
| faq_cta | cta | label si | -> `/faq` |
| cta_finale_title | string | si | — |
| cta_finale_subtitle | string | si | richiama garanzia |
| cta_finale_button | cta | label si | -> `/preventivo` |
| cta_finale_phone | cta | label si | -> `tel:` |

> `[REF]` in Home: card pacchetti (`packages`), recensioni (widget Google @09), voci FAQ [HOME] (`faqs`).

---

## TARIFFE — collection `tariffe`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | "Prezzi chiari. Quello che vedi e quello che paghi." |
| hero_subtitle | richtext | si | onorario fisso + imposte separate |
| card_badge_popolare | string | si | "Il piu scelto" |
| box_trasparenza_title | string | si | — |
| box_trasparenza_body | richtext | si | onorario vs imposte, no ricarichi |
| box_trasparenza_split | object | si | `{onorario, iva_cassa, totale, nota_imposte}` |
| sovrapprezzo_title | string | si | — |
| sovrapprezzo_list | list | si | item `{voce, importo}` (valori DOMANDE) |
| sla_title | string | si | — |
| sla_note | richtext | si | da documentazione completa, esclusi enti terzi |
| deliverable_title | string | si | — |
| deliverable_list | list | si | item `string` (documenti finali) |
| esempio_title | string | si | — |
| esempio_files | list | no | `[REF]` `media_assets` (fac-simile) |
| addon_intro | string | si | — |
| rate_text | richtext | si | BNPL su onorario, non imposte |
| su_misura_text | richtext | si | caso particolare, no prezzo |
| su_misura_cta | cta | label si | -> `/preventivo` |
| ti_serve_title | string | si | "Forse non ti serve nemmeno." |
| ti_serve_body | richtext | si | esonero, verifica gratis |
| ti_serve_cta | cta | label si | -> `/preventivo` |
| guida_scelta_title | string | si | — |
| guida_scelta_body | richtext | si | guida + chiamata riallineamento |
| guida_scelta_cta_guida | cta | label si | -> `#guida` |
| guida_scelta_cta_call | cta | label si | -> `tel:` |
| microtrust | string | si | geometra Entratel + commercialista |
| cta_finale_title | string | si | — |
| cta_finale_button | cta | label si | -> `/preventivo` |

> `[REF]`: 3 card pacchetto + `sla_days` (`packages`), add-on (`addons`), fac-simile (`media_assets`).

---

## CHI SONO — collection `chi_siamo`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | "Ciao, sono Lorenzo Armellin." |
| hero_subtitle | richtext | si | geometra abilitato Entratel |
| hero_ritratto | image_ref | no | foto volto |
| bio_body | richtext | si | testo definitivo DOMANDE |
| credenziali_title | string | si | — |
| credenziali_list | list | si | item `{voce, dettaglio}` (Albo, Entratel, P.IVA) |
| team_title | string | si | "Il meglio dei due mondi" |
| team_body | richtext | si | geometra + commercialista |
| team_membri | list | si | item `{ruolo, nome, focus, foto(image_ref)}` (nomi/foto DOMANDE) |
| perche_geometra_body | richtext | si | rimanda FAQ 24 |
| studio_title | string | si | — |
| studio_indirizzo | object | no | `{via, cap, citta}` |
| studio_mappa | object | no | embed mappa |
| studio_nota | string | si | "lo studio esiste davvero" |
| video_ref | image_ref | no | video 60-90s (facade, sottotitoli) |
| video_caption | string | si | — |
| motto_latino | string | no | motto |
| motto_traduzione | string | si | traduzione IT |
| recensioni_title | string | si | `[REF]` widget Google |
| cta_finale_title | string | si | — |
| cta_finale_button | cta | label si | -> `/preventivo` |
| cta_finale_phone | cta | label si | -> `tel:` |

---

## DOCUMENTI — collection `documenti`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | "Quali documenti servono?" |
| hero_subtitle | richtext | si | gratis + "lo recuperiamo noi" |
| interattiva_title | string | si | — |
| interattiva_domande | list | si | item `string` (mini-domande driver `relevance_rule`) |
| interattiva_risultato_intro | string | si | "Ecco cosa ti servira:" |
| evergreen_title | string | si | — |
| evergreen_intro | richtext | si | — |
| evergreen_gruppi | list | no | `[REF]` `document_catalog` (data-driven dal CRM) |
| hook_recupero | richtext | si | USP recupero documentale |
| disclaimer_ymyl | richtext | si | lista indicativa, conferma Lorenzo |
| cta_preventivo | cta | label si | -> `/preventivo` |
| cta_pdf | cta | label si | scarica lista PDF |
| cta_email | cta | label si | ricevi via email (lead soft) |
| link_correlati | list | si | item `{label, href}` |

---

## FAQ — collection `faq` (domande/risposte `[REF]` `faqs`)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | — |
| hero_subtitle | richtext | si | — |
| hero_search | bool | no | true |
| cat_capire_intro | string | si | intro categoria A |
| cat_costi_intro | string | si | intro categoria B |
| cat_perche_intro | string | si | intro categoria C |
| cat_come_intro | string | si | intro categoria D |
| cat_dopo_intro | string | si | intro categoria E |
| cta_title | string | si | — |
| cta_button | cta | label si | -> `/preventivo` |
| cta_phone | cta | label si | -> `tel:` |

> `[REF]`: tutte le 24 Q&A in `faqs` (question, answer, category, is_home, sort_order, locale). Risposte sorgente in @03. Schema `FAQPage` generato dalle voci.

---

## RECESSO — collection `recesso`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | — |
| hero_subtitle | richtext | si | complementare a T&C |
| cosa_title | string | si | "Hai 14 giorni per ripensarci" |
| cosa_body | richtext | si | — |
| avvio_title | string | si | — |
| avvio_body | richtext | si | consenso avvio immediato |
| iniziato_title | string | si | — |
| iniziato_body | richtext | si | pagamento proporzionale |
| come_title | string | si | — |
| come_body | richtext | si | dall'area riservata / email-PEC |
| come_cta_area | cta | label si | -> `/area-riservata/recesso` |
| come_modulo | image_ref | no | modulo tipo PDF |
| rimborso_title | string | si | — |
| rimborso_body | richtext | si | tempi di legge |
| garanzia_title | string | si | — |
| garanzia_body | richtext | si | recesso vs garanzia |
| garanzia_link | cta | label si | -> `/garanzia` |
| faq_list | list | si | item `{q, a}` (mini-FAQ, opz.) |
| tc_link | richtext | si | rimando a `/termini-condizioni` |

---

## COME FUNZIONA — collection `come_funziona`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | — |
| hero_subtitle | richtext | si | — |
| steps | list | si | item `{numero, titolo, testo, icona, dettaglio}` (3) |
| sla_title | string | si | — |
| sla_body | richtext | si | da documentazione completa |
| valore_title | string | si | "Cosa facciamo che un software non fa" |
| valore_body | richtext | si | controllo catastale + commercialista |
| distanza_body | richtext | si | tutto a distanza, c'e sempre una chiamata |
| deliverable_title | string | si | — |
| deliverable_list | list | si | item `string` |
| cta_title | string | si | — |
| cta_button | cta | label si | -> `/preventivo` |
| cta_phone | cta | label si | -> `tel:` |

---

## CONTATTI — collection `contatti`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | "Parla con noi" |
| hero_subtitle | richtext | si | persona reale |
| telefono | object | no | `{label, numero, cta_chiama, cta_whatsapp}` |
| email | object | no | `{generale, pec}` |
| studio | object | no | `{via, cap, citta}` |
| orari | list | si | item `{giorni, orario}` |
| canali_title | string | si | "Ti seguiamo anche nella tua lingua" |
| canali_body | richtext | si | WhatsApp/email tradotti, conferme scritte |
| form_title | string | si | — |
| form_campi | list | no | definizione campi (Nome, Email, Tel, Messaggio, Consenso) + Turnstile |
| form_nota | string | si | tempo risposta |
| form_success | string | si | messaggio successo |
| mappa_embed | object | no | embed mappa |
| mappa_nota | string | si | — |
| cta_body | string | si | — |
| cta_button | cta | label si | -> `/preventivo` |

---

## GUIDE (hub) — collection `guide` (articoli `[REF]` `articles`)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| hero_title | string | si | — |
| hero_subtitle | richtext | si | — |
| hero_search | bool | no | true |
| categorie | list | si | item `{nome, slug}` |
| in_evidenza_title | string | si | — |
| cta_title | string | si | — |
| cta_button | cta | label si | -> `/preventivo` |

## ARTICOLO (template) — collection `article` (campi singolo articolo `[REF]` `articles`)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| autore_box | object | si | `{autore, ruolo, reviewed_by, foto(image_ref), link}` (E-E-A-T) |
| disclaimer | richtext | si | box "stima non vincolante" |
| cta_box | object | si | `{titolo, button{label,href}, phone}` |
| fonti | richtext | si | fonti ufficiali (AdE, Normattiva) |

> `[REF]` `articles`: title, slug, excerpt, body, category, author, reviewed_by, cover, locale, published_at/updated_at, reading_time, correlati. Markup `Article`/`BlogPosting`.

---

## PREVENTIVO — collection `preventivo` (logica form in @04)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| intro_title | string | si | — |
| intro_subtitle | richtext | si | — |
| progress_label | string | si | "Passo {n} di 4" |
| step1_title | string | si | — |
| step2_title | string | si | — |
| step3_title | string | si | — |
| step4_title | string | si | — |
| help_text | list | si | item `string` (microcopy rassicurante) |
| consenso_privacy | string | si | obbligatorio (link informativa) |
| consenso_marketing | string | si | facoltativo |
| cta_submit | cta | label si | "Invia e ricevi il preventivo gratuito" |
| trust_items | list | si | item `string` |

## THANK-YOU — collection `grazie` (3 esiti, logica @04)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| header_title | string | si | — |
| esito_a_title | string | si | "Forse non devi fare la dichiarazione" |
| esito_a_body | richtext | si | esonero, verifica gratis |
| esito_a_cta | cta | label si | verifica gratuita |
| esito_b_title | string | si | — |
| esito_b_cta | cta | label si | -> `/checkout` |
| esito_b_riallineamento | richtext | si | guida + cambio pacchetto |
| esito_c_title | string | si | — |
| esito_c_body | richtext | si | preventivo su misura |
| esito_c_cta | cta | label si | richiedi preventivo/chiamata |
| documenti_title | string | si | (Esiti B/C) |
| documenti_disclaimer | string | si | lista indicativa |
| documenti_hook | string | si | "lo recuperiamo noi" |
| documenti_cta_pdf | cta | label si | scarica PDF |
| documenti_cta_email | cta | label si | ricevi via email |
| next_body | richtext | si | prossimi passi |

> `[REF]`: pacchetto suggerito (`packages`), lista documenti (`document_catalog` + `relevance_rule`).

---

## CHECKOUT — collection `checkout` (riepilogo/pagamento @04/@06)
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| header_title | string | si | — |
| header_subtitle | string | si | — |
| riepilogo_title | string | si | — |
| modifica_link | cta | label si | -> `/tariffe` |
| prezzo_split | object | si | `{onorario, iva_cassa, totale}` (calcolo server) |
| prezzo_imposte_nota | richtext | si | imposte separate, no ricarichi |
| microtrust | string | si | geometra + commercialista + Stripe |
| pagamento_title | string | si | — |
| pagamento_metodi | list | si | item `string` (Carta, PayPal, Bonifico) |
| rate_nota | richtext | si | BNPL su onorario |
| consenso_tc | string | si | accetta T&C + privacy (obblig.) |
| consenso_avvio | string | si | avvio immediato / perdita recesso (obblig.) |
| recesso_link | cta | label si | -> `/recesso` |
| cta_pay | cta | label si | "Paga in modo sicuro" |
| cta_nota | string | si | transazione cifrata |
| trust_items | list | si | item `string` |
| success_title | string | si | pagamento riuscito + prossimi passi |
| error_title | string | si | pagamento non riuscito |

> `[REF]`: riepilogo ordine (`orders`/`packages`/`addons`); prezzo SEMPRE ricalcolato lato server (@11).

---

## HUB LEGALE — collection `legale`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| privacy_title | string | si | — |
| privacy_body | richtext/embed | si | iubenda (versionato @10) |
| cookie_title | string | si | — |
| cookie_body | richtext/embed | si | iubenda + Consent Mode v2 |
| tc_title | string | si | — |
| tc_body | richtext | si | testo formale (bozze_legali) - validare legale |
| garanzia_title | string | si | — |
| garanzia_body | richtext | si | copertura + differenza dal recesso |
| garanzia_cta | cta | label si | -> `/preventivo` |

> Testi legali: IT fa fede, versionati e pubblicati con attenzione (@10).

---

## PAGINE DI SISTEMA — collection `sistema`
| key | tipo | translatable | default / note |
|-----|------|--------------|----------------|
| e404_title | string | si | — |
| e404_body | string | si | — |
| e404_cta | list | si | item `{label, href}` |
| e500_title | string | si | — |
| e500_body | string | si | + contatto |
| manutenzione_title | string | si | — |
| manutenzione_body | string | si | — |
| sessione_title | string | si | — |
| sessione_body | string | si | link login @06 |

---

## Fuori perimetro (gestiti altrove)
- **Area riservata** (`/area-riservata/*`): @06 (app cliente, non `content_entries`).
- **CRM `/admin`**: @05 (app interna).
- **Tabelle data-driven**: `packages`, `addons`, `faqs`, `articles`, `document_catalog`, `media_assets` (@SPEC_Data_Model) - gestite dai manager CMS, qui solo referenziate `[REF]`.

## Passi successivi
- [ ] Validare i tipi/forme con lo schema Zod effettivo (un file `lib/content/schema.ts` per collection).
- [ ] Definire i **default** completi (i `[BOZZA]` di STRUTTURA) come oggetto di fallback per ogni key.
- [x] Generare lo **seed** di `content_entries` (IT) da questo registro -> `seed/content_entries.it.json` (232 voci).
- [ ] Definire i manager CMS per collection (form di editing per Lorenzo, @05) -> vedi "CMS - Manager per collection" in @05.
