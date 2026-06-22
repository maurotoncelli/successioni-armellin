# 08. Tracciamento, Dati e Analytics

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-08
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-18
- Dipendenze: @04_Form_Multistep, @05_CRM, @09_Go_To_Market, @10_Legale_Compliance
- Owner:

## Sintesi
Sistema di misurazione per ottimizzare le campagne e capire dove gli utenti abbandonano: GA4 + Google Tag Manager, eventi del funnel, Consent Mode v2, tracciamento server-side delle transazioni e conversioni offline dal CRM verso Google Ads. Obiettivo: nutrire l'algoritmo con dati corretti e misurare CPL/CAC/ROI reali.

---

## Stato attuale del progetto

### Setup
- Google Tag Manager come contenitore unico dei tag; GA4 come piattaforma di analisi.
- Data Layer applicativo (Next.js) che spinge gli eventi del funnel.
- Consent Mode v2: stato di default "denied" per ad_storage, analytics_storage, ad_user_data, ad_personalization; aggiornamento al consenso tramite CMP (@10).
- Analytics EU-friendly (Plausible o Umami) in affiancamento per metriche interne senza dati personali.

### Eventi del funnel (GA4)
| Evento | Trigger | Parametri principali | Scopo |
|--------|---------|----------------------|-------|
| page_view | navigazione (post-consenso) | page | base |
| form_start | avvio form pre-valutazione (@04) | - | interesse iniziale |
| form_step | completamento step | step_number, step_name | dove si abbandona |
| generate_lead | submit Step 4 (@04) | suggested_package, value (onorario stimato), currency | conversione chiave per Ads |
| begin_checkout | avvio pagamento | package, value, currency=EUR | alta intenzione (retargeting) |
| purchase | pagamento Stripe completato | transaction_id, value, currency, package | ROI; importato in Ads |
| file_upload | upload documento (area cliente) | doc_type | engagement |
| file_download | download documento finale | doc_type | post-vendita |

### Tracciamento server-side (affidabilita)
- purchase inviato anche server-to-server dal webhook Stripe via GA4 Measurement Protocol (resiliente agli ad-blocker).
- Enhanced Conversions: invio di identificatori hashati (es. email) lato server, senza esporre PII (@10).

### Conversioni offline (dal CRM a Google Ads)
- Quando Lorenzo porta la pratica in "Chiusa" (pagata), il backend invia la conversione con valore reale a Google Ads/GA4 (offline conversion import o Measurement Protocol).
- Permette all'algoritmo di ottimizzare sul cliente realmente acquisito e cercare utenti simili.
- Nota consenso (GCLID): l'uso del GCLID a livello utente per l'offline import rientra nel consenso "advertising". In caso di rifiuto, non si usa a livello utente e ci si affida al modeling di Consent Mode (@10).

### Dashboard direzionale (KPI)
- Metriche: Costo per Lead (CPL), Costo per Acquisizione (CAC), tasso di conversione lead->cliente, ROAS/ROI, drop-off per step del form.
- Collegamento ai target del @01 e ai budget del @13.

---

## Idee future
- Server-side tagging completo (GTM server container) per maggiore affidabilita e privacy.
- Attribuzione multi-touch e analisi per canale/campagna (locale vs nazionale, @09).
- Alert automatici su anomalie (calo conversioni, CPL fuori soglia).

---

## Nodi da sciogliere
- [RISOLTO] Scelta CMP: CMP certificata da Google, proposta iubenda (alt. Cookiebot), integrata con Consent Mode v2; no CMP fai-da-te. Dettaglio in @10.
- Confermare l'uso delle Enhanced Conversions (richiede gestione hashing/PII conforme).
- Definire le soglie di alert per i KPI.

## Passi successivi
- [ ] Creare proprieta GA4 e contenitore GTM.
- [ ] Implementare il Data Layer e gli eventi del funnel (@04).
- [ ] Configurare Consent Mode v2 + CMP (@10).
- [ ] Implementare purchase server-side dal webhook Stripe (@07).
- [ ] Configurare l'offline conversion sul passaggio a "Chiusa" (@05).
- [ ] Costruire la dashboard KPI.

---

## Decisioni congelate (lock-in)
- GA4 + GTM con Data Layer applicativo; eventi del funnel come da tabella.
- Consent Mode v2 con default "denied" e aggiornamento via CMP certificata (iubenda; no fai-da-te).
- purchase tracciato anche server-side (Measurement Protocol) dal webhook Stripe.
- Offline conversions inviate al passaggio in "Chiusa".
- Nessuna PII grezza in analytics; enhanced conversions solo con identificatori hashati.

---

## Rischi / Compliance & Riferimenti
- Rischio GDPR/cookie: tag attivati prima del consenso -> violazione; Consent Mode obbligatorio (@10).
- Rischio dati sporchi: senza tracciamento corretto di generate_lead/purchase, le campagne bruciano budget (@09).
- Rischio perdita conversioni: ad-blocker lato client -> mitigato dal server-side.
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezione eventi GA4, offline conversions, data layer).
