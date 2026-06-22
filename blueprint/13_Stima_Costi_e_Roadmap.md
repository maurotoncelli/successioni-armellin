# 13. Stima Costi Finali e Roadmap

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-13
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @01_Executive_Summary, @07_Stack, @09_Go_To_Market, @11_Sicurezza, @12_Operations
- Owner:

## Sintesi
Stima dei costi (ricorrenti, una tantum, marketing e per pratica), costo per transazione, roadmap di sviluppo dal Blueprint al codice e checklist QA pre-lancio. Tutte le cifre sono indicative e da verificare sui listini correnti al momento dell'attivazione.

> Nota: la stima "30-70 EUR" presente negli appunti di partenza si riferiva alla sola scrittura del Blueprint con prezzi/modelli datati. Il costo reale del progetto e dominato dallo sviluppo e dal marketing, non dai token AI.

---

## Stato attuale del progetto

### Costi SaaS ricorrenti (stima mensile, piccola scala)
| Voce | Stima/mese | Note |
|------|-----------|------|
| Hosting app (Vercel Pro) | ~20 EUR | piano commerciale |
| Supabase (Pro) | ~25 EUR | DB+Auth+Storage; PITR come add-on extra |
| Email (Resend) | 0-20 EUR | free fino a soglia, poi a pagamento |
| WhatsApp Cloud API | 0-20 EUR | a conversazione (se attivato) |
| Job queue (Inngest/Trigger.dev) | 0-20 EUR | free tier iniziale |
| Sentry | 0-26 EUR | free/team |
| Rate limit (Upstash) | 0-10 EUR | free tier iniziale |
| CMP (Iubenda/Cookiebot) | 10-30 EUR | consensi/cookie |
| Fatturazione (FattureInCloud/Aruba) | 8-30 EUR | dipende dal piano |
| Analytics EU-friendly (opz.) | 0-9 EUR | Plausible/Umami |
| Dominio | ~1-2 EUR | ~15-20 EUR/anno |
| Totale indicativo | ~90-200 EUR/mese | cresce con i volumi |

Voci gratuite: GA4, GTM, Cloudflare Turnstile.

### Costi una tantum (setup/lancio)
| Voce | Stima | Note |
|------|-------|------|
| Shooting fotografico | 300-800 EUR | ritratto + studio (@02) |
| Logo / brand | 0-500+ EUR | AI vs designer (@02) |
| Consulenza legale (privacy, T&C, DPIA) | 500-2.000 EUR | avvocato/commercialista (@10) |
| Sviluppo sito + CRM | variabile | self-build con Cursor (abbonamento/API) vs agenzia |
| Hardware NAS (se non posseduto) | 300-600+ EUR | NAS + dischi (@12) |

Nota sviluppo self-build: se realizzato in autonomia con Cursor, il costo "vivo" e principalmente l'abbonamento/uso AI; il costo reale e il tempo. La stesura di questo Blueprint ha un costo in token modesto.

### Budget marketing
- **Soft launch (mesi 1-3): ~400 EUR/mese** (budget dimezzato, scelta approvata in Riunione 1) con **tilt sul locale** per massimizzare la resa a budget ridotto (@01/@09). Obiettivo: rodare operativita, raccogliere dati reali e cercare un collaboratore senza superare la capacita.
- Avvio "pieno" (dopo la prova, Test & Learn esteso): 600-800 EUR/mese (@09).
- Scaling sui dati: aumento solo dopo CPL/CAC validati (@08), con ricalibrazione delle proiezioni dopo 4-6 settimane di campagna.
- Attese realistiche soft launch: da ~400 EUR di solo ADV ~5-7 pratiche/mese; ~15/mese come obiettivo combinato (con GBP/SEO locale/recensioni/passaparola/referral) verso fine prova (@01).

### Costo per pratica (per il margine, @01)
- Commissioni Stripe: ~1,5% + 0,25 EUR su carte europee standard (es. ~7-8 EUR su 490 EUR). Verificare il listino e le carte non-UE.
- CAC pubblicitario: target < 100-150 EUR (da validare).
- IVA e Cassa Geometri: partite di giro/maggiorazioni in fattura (@10), non costo netto.
- Quota SaaS amortizzata per pratica: trascurabile a volumi crescenti.
- Conclusione: con onorario medio ~475 EUR, il margine resta solido una volta validato il CAC.

### Roadmap di sviluppo (Blueprint -> Code)
> **Target di go-live: fine agosto 2026** (~10 settimane da meta giugno). Tempistica tirata ma fattibile solo con scope MVP disciplinato: i punti 1-8 + 10 (essenziali) entrano nell'MVP; i punti 9 e 11 e le rifiniture possono seguire subito dopo il lancio senza bloccare il go-live. Il soft launch ADV parte a sito online (~settembre) e gira ~settembre-novembre.
1. Setup infrastruttura: repo, Supabase, ambienti, CI/CD (@07/@12).
2. Schema dati + policy RLS + test cross-tenant (@05/@11).
3. Autenticazione: admin (2FA) e client passwordless (@06/@11).
4. Sito pubblico + brand: home, tariffe, chi sono, hub legale (@02/@03/@10).
5. Form multi-step -> lead in DB + eventi GA4 (@04/@08).
6. Checkout Stripe + webhook + fatturazione (@07/@10).
7. Area riservata: upload, dashboard, download con signed URL (@06).
8. CRM: Kanban, scheda pratica, validazione, automazioni email (@05).
9. WhatsApp (se in v1) + offline conversions + job/cron (@05/@08/@12).
10. Contenuti SEO + schema.org + Google Business Profile (@09).
11. Sync notturna Cloud -> NAS (@12).
12. QA, security review, hardening e lancio (@11/@12).

**Fast-follow (subito dopo il go-live, dietro feature flag, non bloccano agosto):**
13. **Estrazione documenti OCR/AI** (V1.1): pipeline OCR + AI in UE (DPA, no-training) -> "Riepilogo dati consigliati" correggibile nella scheda pratica (@05/@07/@10/@11). Costo incrementale modesto (OCR ~centesimi/pagina + LLM pochi centesimi/doc): a ~30 pratiche/mese stimabile in poche decine di EUR/mese, da confermare a consuntivo.

### Checklist QA pre-lancio
- Flussi funzionali end-to-end (form -> pagamento -> upload -> chiusura).
- Test RLS cross-tenant (un cliente non vede dati altrui) (@11).
- Pagamenti in modalita test + verifica webhook/idempotenza.
- Email/WhatsApp transazionali e job con retry.
- Accessibilita WCAG 2.2 AA (@03) e performance/Core Web Vitals.
- SEO tecnica: meta, sitemap, schema.org, robots.
- Pagine legali, consensi e Consent Mode v2 attivi (@08/@10).
- Backup: restore di prova riuscito (@11/@12).
- Monitoring e alert attivi (@12).

---

## Idee future
- Modello di previsione costi/ricavi (break-even, proiezioni a 6-12 mesi).
- Ottimizzazione costi SaaS al crescere dei volumi (tier, riserve).
- Valutazione ROI per canale (locale vs nazionale) per riallocare budget (@09).

---

## Nodi da sciogliere
- Modalita di sviluppo: self-build con Cursor vs agenzia/sviluppatore (impatta tempi e costi) - critico per il target di fine agosto.
- [RISOLTO] Budget marketing iniziale: **soft launch ~400 EUR/mese per 3 mesi** con tilt locale, poi scaling sui dati (@01/@09).
- Software di fatturazione e relativo costo (DOMANDE_PER_LORENZO).
- Trattamento IVA/Cassa e prezzo mostrato (@01/@10).
- Necessita e costo del PITR Supabase e di un eventuale pentest (@11).

## Passi successivi
- [ ] Raccogliere i listini correnti e finalizzare la tabella costi.
- [x] Definire il budget marketing iniziale con Lorenzo (soft launch ~400 EUR/mese, 3 mesi, tilt locale).
- [ ] Bloccare lo scope MVP per il go-live di fine agosto (cosa entra / cosa slitta).
- [ ] Predisporre il cruscotto KPI del soft launch (CPC, costo contatto, costo cliente, tasso di chiusura, tempo/pratica) e ricalibrare le proiezioni dopo 4-6 settimane.
- [ ] Decidere la modalita di sviluppo e stimarne il costo/tempo.
- [ ] Validare il costo per pratica e il margine target (@01).
- [ ] Approvare la roadmap e la checklist QA come piano operativo.

---

## Decisioni congelate (lock-in)
- Tre categorie di costo distinte: SaaS ricorrenti, una tantum, marketing.
- Go-live target: fine agosto 2026 con scope MVP; il non-essenziale slitta a dopo il lancio.
- Marketing: soft launch ~400 EUR/mese per 3 mesi con tilt locale, poi avvio pieno 600-800 EUR/mese; scaling solo sui dati, ricalibrazione dopo 4-6 settimane.
- Roadmap di sviluppo nell'ordine indicato (Blueprint -> Code).
- Checklist QA pre-lancio obbligatoria prima del go-live.
- La stima "30-70 EUR" degli appunti NON rappresenta il costo del progetto.

---

## Rischi / Compliance & Riferimenti
- Rischio sottostima: i listini SaaS cambiano; le cifre vanno verificate prima dell'attivazione.
- Rischio margine: CAC non validato puo erodere il margine (@01/@08).
- Rischio qualita: saltare la checklist QA o il restore di prova espone a guasti al lancio (@11/@12).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni stima costi, budget advertising, metodo Blueprint).
