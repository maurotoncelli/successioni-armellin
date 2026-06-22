# 07. Stack Tecnologico e Infrastruttura

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-07
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @05_CRM, @06_Area_Riservata, @10_Legale_Compliance, @11_Sicurezza, @12_Operations
- Owner:

## Sintesi
Scelte tecnologiche definitive del progetto, consolidate attorno a Supabase per ridurre il numero di fornitori e centralizzare la sicurezza (RLS). Si sciolgono le alternative ("X oppure Y") presenti negli appunti e si aggiungono i tasselli operativi mancanti (job queue, monitoring, rate limiting).

> HUB TECNICO: questo capitolo e il punto di ingresso tecnico. I dettagli canonici vivono nelle SPEC e NON vanno duplicati qui:
> [SPEC_Data_Model](SPEC_Data_Model.md) · [SPEC_Naming_Conventions](SPEC_Naming_Conventions.md) · [SPEC_API_Contracts](SPEC_API_Contracts.md) · [SPEC_Design_Tokens](SPEC_Design_Tokens.md) · [SPEC_Event_Taxonomy](SPEC_Event_Taxonomy.md) · [SPEC_Env_Vars](SPEC_Env_Vars.md) · [SPEC_Coding_Standards](SPEC_Coding_Standards.md) · [DECISIONI](DECISIONI.md)

---

## Stato attuale del progetto

### Principio guida
Un solo prodotto full-stack (Next.js) + un solo backend-as-a-service (Supabase) per dati, auth, storage e realtime. Vendor aggiuntivi solo dove indispensabili (pagamenti, email, messaggistica, code, monitoring). Residenza dati in UE ove possibile (@10_Legale_Compliance).

### Stack scelto

Frontend e applicazione
- Next.js (App Router) + TypeScript: SSR/SEO, server actions e route handlers (niente backend Node separato).
- Tailwind CSS per lo stile.
- Componenti UI accessibili: shadcn/ui (Radix) - utile per WCAG (@03).
- Animazioni: Motion (Framer Motion), sobrie. GSAP solo se servira scroll avanzato (evitare doppio motore per le performance).
- Form: React Hook Form + Zod (validazione condivisa client/server).

Internazionalizzazione (multilingua) - REQUISITO
- Obiettivo: sito multilingua per stranieri residenti in Italia, ben strutturato e indicizzato (SEO).
- Lingue al lancio (CONFERMATE): italiano (default) + inglese, arabo, tedesco, spagnolo, russo, turco, cinese semplificato (zh-Hans), hindi, albanese (sq), francese (fr). Tutte le lingue partono insieme con il sito (no fasatura).
- Lingue africane: il francese (gia incluso) e la lingua d'accesso per gran parte dell'Africa francofona (Senegal, Costa d'Avorio, Mali, Camerun...). Gruppo aggiuntivo per il Corno d'Africa: somalo (so), amarico (am), tigrino (ti); wolof (wo) come opzione prevalentemente orale. CAVEAT: per queste lingue la disponibilita di traduttori legali qualificati e la resa SEO sono limitate -> valutare costo/beneficio prima di includerle (DA CONFERMARE quante e quali).
- Nota "marocchino": i residenti marocchini sono coperti dall'arabo standard (testi formali); il darija e solo parlato e il tamazight/berbero e di nicchia -> nessuna lingua aggiuntiva dedicata.
- Tecnologia: Next.js App Router i18n con `next-intl`; routing per sotto-percorso `/[locale]` su dominio unico (es. `/en`, `/de`, `/ar`); rilevamento `Accept-Language` con scelta manuale persistente (cookie). Stringhe in file di messaggi per locale; numeri/date/valuta via API `Intl`.
- SEO multilingua (vedi @09): tag `hreflang` per ogni locale + `x-default`, sitemap per locale, `<title>`/meta e slug tradotti, dati strutturati localizzati.
- Strategia traduzioni (budget limitato): TUTTO tramite AI con modelli avanzati, senza revisione umana sistematica. Mitigazione del rischio YMYL: i testi legali fanno fede in ITALIANO (lingua prevalente in caso di discrepanza, vedi @10); usare glossario/termini bloccati per i termini fiscali ricorrenti per coerenza tra lingue.
- Latino e greco antico NON sono lingue/locale del sito (SEO nullo, rischio percezione gadget). L'effetto "colto" si ottiene con un motto latino editoriale in Chi Sono/footer (@03).
- RTL: l'arabo richiede `dir="rtl"`; layout e componenti devono usare proprieta logiche (start/end) e supportare RTL (impatta @02/@SPEC_Design_Tokens).
- Font: garantire copertura degli script non-latini (arabo, cinese CJK, cirillico, devanagari) con fallback dedicati (es. famiglia Noto): Inter copre latino/cirillico ma NON arabo/CJK/devanagari (@SPEC_Design_Tokens).
- Ambito traduzione: pagine marketing core + form preventivo (@04) + UI area riservata (@06) + email transazionali + articoli dedicati agli stranieri in Italia (@09). Traduzione AI per tutto. Il CRM admin resta solo in italiano (uso interno di Lorenzo).

Backend, database e accesso dati
- Supabase (Postgres gestito), regione UE (es. Francoforte).
- Sicurezza dati: Row Level Security (RLS) come backbone (@11).
- Accesso dati via client supabase-js (rispetta la RLS) lato client e server; ORM Drizzle opzionale per query complesse tipizzate lato server.
- Si abbandona Prisma come layer principale per evitare il bypass della RLS (resta riconsiderabile solo con motivazione esplicita).
- Realtime CRM: Supabase Realtime (aggiornamento card Kanban).

Autenticazione
- Supabase Auth, passwordless: OTP via email e/o Magic Link (si integra con la RLS tramite JWT). Si abbandona Auth.js. Niente social login (Google/Apple) in v1 (vedi @06); eventuale Google in fase 2 con match sull'email della pratica.

Storage documenti
- Supabase Storage (regione UE) con policy RLS per bucket privato. Si rinuncia ad AWS S3 in v1 (migrabile in futuro se necessario).
- Scansione malware con **ClamAV (in UE)** avviata da un job all'upload: il file resta in quarantena finche non risulta pulito (no servizi che condividono i campioni, GDPR) (@11).
- IBAN con **cifratura applicativa (envelope encryption)**, chiave in KMS/secret separata dal DB, oltre all'at-rest (@11/@10).

Pagamenti e fatturazione
- Stripe (Checkout / Payment Element) + webhook per begin_checkout/purchase.
- **Pagamento a rate / BNPL** (Riunione 1 / spunto competitor): metodi nativi Stripe attivati al checkout - carta e bonifico come primari, piu **PayPal (Pay in 3), Klarna, Scalapay** dove idonei. Si rateizza solo l'**ONORARIO** (le imposte di Stato restano a parte, @10); l'incasso per noi resta immediato (il rischio credito e del provider BNPL). Le opzioni rate sono **mostrate gia in fase di pagamento** (e accennate su Tariffe/checkout) per ridurre l'attrito, utili soprattutto su Zero Stress / preventivi su misura. Si lega all'idea "50/50" prevista in fase 2 (@05). Disponibilita per importo/paese gestita da Stripe.
- Fatturazione elettronica via API verso il software in uso da Lorenzo (FattureInCloud/Aruba) - da confermare (vedi DOMANDE_PER_LORENZO).

Comunicazioni
- Email transazionali: Resend con template React Email; configurare SPF/DKIM/DMARC sul dominio.
- WhatsApp (se attivato in v1): WhatsApp Cloud API (Meta) diretta, piu economica di Twilio; richiede verifica business Meta e template approvati.

Deliverability (evitare la cartella SPAM) - REQUISITO
> Problema osservato (Riunione 1): le email di preventivo di alcuni competitor (es. Successione24) finiscono in spam. La consegna del preventivo e mission-critical: se non arriva, si perde il cliente.
- **Autenticazione completa**: SPF + DKIM (firma Resend) + DMARC. Partire con DMARC `p=none` per monitorare i report, poi salire a `p=quarantine`/`p=reject` quando allineato.
- **Sottodominio di invio dedicato** (es. `send.dominio.it`) per isolare la reputazione delle transazionali dalla casella di posta reale di Lorenzo; return-path personalizzato (allineamento DMARC).
- **From coerente e autenticato** (es. `assistenza@dominio.it`), MAI Gmail personale come mittente; `reply-to` verso la casella reale.
- **Warm-up**: avvio graduale del volume; Resend usa IP condivisi a buona reputazione (IP dedicato solo se i volumi lo giustificano).
- **Igiene del contenuto**: buon rapporto testo/HTML, niente solo-immagine, pochi link e tutti verso il proprio dominio (no shortener), evitare parole-trigger e MAIUSCOLE/eccessi; lista pulita con gestione bounce; link unsubscribe SOLO nelle email marketing (non nelle transazionali).
- **Mitigazione di prodotto (non dipendere solo dall'email)**: il preventivo e SEMPRE visibile a schermo nella thank-you (@04) e nell'area riservata (@06); l'email e una notifica, non l'unico canale. Microcopy "controlla anche lo spam e aggiungici ai contatti"; opzionale notifica WhatsApp/SMS "ti abbiamo inviato il preventivo".
- **BIMI/monitoraggio** (idea futura): logo verificato e dashboard di deliverability (Resend) per tenere d'occhio bounce/complaint.

Automazioni e job
- Job queue/scheduler con retry: Inngest (o Trigger.dev) per email di stato, webhook, OCR/estrazione documenti e cron.
- Sincronizzazione notturna Cloud -> NAS: modello "pull" lato ufficio (QNAP HBS 3 sul NAS TS-x31K, alt. Rclone), non push dal cloud (@12).

Estrazione documenti OCR/AI (fast-follow V1.1, dietro feature flag)
> Legge i documenti caricati e predispone una BOZZA dei dati utili a Lorenzo (scheda pratica, correggibili a mano) per velocizzare la compilazione su Sogei. E un ausilio assistito, mai automatico (decide Lorenzo, @05/@10).
- **OCR/layout**: servizio gestito **in regione UE** (es. Google Document AI o Azure Document Intelligence, regione UE), con **DPA** e **no-training** sui dati.
- **Strutturazione (mapping campi)**: LLM **in UE** (es. Mistral o Azure OpenAI in regione UE), prompt con schema target per tipo documento; nessuna PII verso servizi senza DPA.
- **Orchestrazione**: job asincrono Inngest (dopo lo scan malware ClamAV), con retry e stato per documento; rielaborazione on-demand. Output in `document_extractions` (@SPEC_Data_Model).
- **Dati sensibili**: IBAN con cifratura applicativa e cancellazione dopo l'uso (@11); trattamento incluso in DPIA (@10).
- **Limite noto**: nessun import automatico affidabile in Sogei -> output = report che velocizza l'inserimento manuale (DOMANDE).

Tracciamento e consensi
- GA4 + Google Tag Manager con Consent Mode v2; valutare analytics EU-friendly (Plausible/Umami) in affiancamento (@08).

Osservabilita e sicurezza operativa
- Error tracking: Sentry (@12).
- Rate limiting: Upstash Redis ratelimit; anti-bot su form/OTP: Cloudflare Turnstile (@11).

Contenuti / Blog SEO
- MDX in v1 per gli articoli pillar/long-form (versionati nel repo, @09). Niente headless CMS esterno.
- Contenuti strutturati del sito (pacchetti/prezzi, FAQ, testi chiave, immagini) gestiti da un **CMS leggero interno** su Supabase + editor nel CRM (vedi sotto).

Contenuti data-driven (CMS leggero) - REQUISITO (Riunione 1)
> Obiettivo: Lorenzo modifica dal CRM prezzi/descrizioni dei pacchetti, FAQ, testi e foto del sito, SENZA toccare il codice e SENZA rallentare il sito. Modello dati: `packages`, `faqs`, `content_entries`, `media_assets` (@SPEC_Data_Model).
- **Performance prima di tutto - statico + cache**: le pagine pubbliche restano **SSG/ISR** e sono servite dalla **CDN di Vercel**. I contenuti vengono letti a build-time e poi serviti dalla cache: **nessuna query al DB a ogni visita** (il "data-driven" non significa render dinamico per utente).
- **Pubblicazione = invalidazione mirata**: quando Lorenzo pubblica una modifica, il CRM chiama una **revalidation on-demand** (`revalidateTag`/`revalidatePath`) tramite endpoint protetto; si rigenerano SOLO le pagine impattate (es. tag `packages`, `faqs`, `content:home`). Il visitatore vede sempre HTML cache-ato; l'aggiornamento e quasi immediato senza redeploy.
- **Bozza -> Anteprima -> Pubblica**: il pubblico legge solo i record pubblicati (`is_published`/`is_active`); l'anteprima usa la **Draft Mode** di Next.js (solo ADMIN). Versioning su `content_entries.version` per audit/rollback.
- **Validazione e robustezza**: ogni contenuto e validato con **Zod** con **valori di default di fallback**, così un campo mancante o malformato non rompe il build/la pagina.
- **Immagini**: bucket pubblico `site-assets` (separato dai documenti privati) + `next/image` (ottimizzazione, dimensioni note per evitare layout shift) servite via CDN; upload/sostituzione dal CRM con `alt_text`.
- **i18n**: contenuti per `locale`; le altre lingue possono essere riempite via AI (@07 traduzioni). I testi LEGALI fanno fede in italiano (@10).
- **Guardrail prezzi/legale**: il prezzo applicato a una pratica e gia uno snapshot su `practices` (modificare un listino non tocca le pratiche esistenti); cambiare prezzi/descrizioni mostra un promemoria di rivedere le Condizioni di Vendita (@10). Editor contenuti solo ADMIN, ogni modifica a audit log.
- **Scope v1**: pacchetti, FAQ, testi delle pagine core, immagini, poche impostazioni globali. NON un page-builder libero (over-engineering): struttura a chiavi note e tipizzate.

Testing
- Vitest (unit) + Playwright (E2E sui flussi critici: form, checkout, upload).

Hosting e ambienti
- Hosting app: Vercel (naturale per Next.js); impostare la regione delle funzioni in UE (es. fra1).
- Ambienti separati: sviluppo, staging, produzione, con progetti Supabase distinti.

Domini ed Email
- Struttura dominio (proposta):
  - `www.dominio.it` / `dominio.it` -> sito pubblico.
  - `/area-riservata` (sul dominio principale) -> area cliente.
  - `app.dominio.it` (sottodominio dedicato) -> CRM admin di Lorenzo, separato dal sito pubblico per sicurezza/cookie.
  - `staging.dominio.it` -> ambiente di staging (protetto).
- Email, due piani distinti da non confondere:
  - Invio TRANSAZIONALE/automatico (Resend, @05): generato dall'app. Mittente proposto `assistenza@dominio.it` con `reply-to` verso la casella reale di Lorenzo; eventuale sottodominio di invio `send.dominio.it` per isolare la reputazione.
  - Casella di POSTA reale di Lorenzo (legge/risponde): fornita dal suo provider email (registrar o Google/Microsoft). Diversa dall'invio transazionale (DOMANDE_PER_LORENZO).
- DNS necessari:
  - Sito/sottodomini: A/CNAME verso Vercel; CNAME per `app`/`staging`.
  - Deliverability invio (Resend): SPF, DKIM, DMARC e (opz.) return-path personalizzato.
  - Casella di posta: record MX + SPF del provider scelto.
  - Verifica dominio per i servizi (Resend, Google Business/Search Console).

---

## Idee future
- OCR documenti (Google Cloud Vision / AWS Textract) per pre-compilare anagrafiche (@05) - da introdurre dopo la v1.
- Migrazione storage a S3 EU se i volumi/costi lo giustificano.
- Headless CMS per il blog se la produzione di contenuti diventa intensa.
- App mobile / PWA per upload documenti ancora piu fluido.

---

## Nodi da sciogliere
- NAS confermato: QNAP TS-x31K (Riunione 1); strumento sync QNAP HBS 3 (alt. Rclone). Resta da precisare modello/dischi (@12, DOMANDE_PER_LORENZO).
- Software gestionale e formato di import/export: determina il modulo di esportazione del CRM (@05, DOMANDE_PER_LORENZO).
- Software di fatturazione elettronica da integrare (@10, @13, DOMANDE_PER_LORENZO).
- Attivazione di WhatsApp in v1 oppure solo email (impatta costi e setup Meta).
- Scelta finale job queue: Inngest vs Trigger.dev (entrambe valide; decidere in fase di setup).
- Budget/risorsa per traduzioni professionali (11+ lingue al lancio = volume rilevante; DOMANDE_PER_LORENZO).
- Lingue africane aggiuntive (somalo/amarico/tigrino/wolof): confermare quali includere considerando disponibilita traduttori e ROI (DOMANDE_PER_LORENZO).
- Nome dominio definitivo e dove e registrato (gestione DNS) (DOMANDE_PER_LORENZO).
- Provider della casella di posta reale di Lorenzo (registrar/Google/Microsoft).
- Conferma struttura sottodomini (app per il CRM vs path /admin).

## Passi successivi
- [ ] Creare i progetti Supabase (dev/staging/prod) in regione UE.
- [ ] Inizializzare il repo Next.js + TypeScript + Tailwind + shadcn/ui.
- [ ] Definire lo schema dati e le policy RLS (coordinare con @05, @06, @11).
- [ ] Configurare Stripe (test/live) e i webhook.
- [ ] Configurare Resend + record DNS (SPF/DKIM/DMARC).
- [ ] Integrare Sentry, Upstash rate limit e Turnstile.
- [ ] Raccogliere da Lorenzo le info su NAS, gestionale e fatturazione (DOMANDE_PER_LORENZO).

---

## Decisioni congelate (lock-in)
- Frontend: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Motion.
- Backend/dati: Supabase (Postgres, Auth, Storage, Realtime) in UE; RLS come backbone di sicurezza.
- Accesso dati: supabase-js (RLS); Drizzle opzionale lato server. Prisma abbandonato come layer principale.
- Auth: Supabase Auth passwordless (OTP/Magic Link). Auth.js abbandonato.
- Storage: Supabase Storage (no S3 in v1); bucket pubblico `site-assets` per le immagini del sito, separato dal bucket privato dei documenti.
- Contenuti data-driven via CMS leggero interno (Supabase + editor CRM): pacchetti/prezzi, FAQ, testi, immagini editabili da Lorenzo. Sito statico SSG/ISR servito da CDN, con revalidation on-demand alla pubblicazione (no query DB per-visita). Bozza/Anteprima/Pubblica + versioning; Zod con fallback; MDX solo per i long-form.
- Pagamenti: Stripe.
- Email: Resend; WhatsApp via Cloud API (se attivato).
- Job/automazioni: Inngest o Trigger.dev (con retry).
- Monitoring/sicurezza: Sentry + Upstash rate limit + Cloudflare Turnstile.
- Hosting: Vercel con funzioni in regione UE.
- Struttura domini: sito pubblico su dominio principale, area cliente su `/area-riservata`, CRM admin su sottodominio dedicato (`app.`).
- Email transazionali via Resend con `reply-to` verso la casella reale di Lorenzo; deliverability con SPF/DKIM/DMARC.
- Multilingua (requisito): 11+ lingue al lancio (IT, EN, AR, DE, ES, RU, TR, zh-Hans, HI, SQ, FR) + gruppo africano opzionale (somalo/amarico/tigrino/wolof, da confermare). Next.js i18n con next-intl, routing `/[locale]` su dominio unico, hreflang+x-default, supporto RTL (arabo) e font per script non-latini (incl. amarico/tigrino in script etiope ge'ez); traduzioni interamente AI (modelli avanzati), testi legali validi in italiano; latino/greco esclusi come locale; CRM solo in italiano.

---

## Snippet canonici (pattern di riferimento)
Includere in fase di sviluppo un esempio per pattern, da replicare per uniformita:
- Policy RLS: vedi esempio in [SPEC_Data_Model](SPEC_Data_Model.md).
- Schema Zod + server action: input validato lato server, tipi via z.infer (@SPEC_Coding_Standards).
- Job Inngest: nome evento da @SPEC_Naming_Conventions, con retry/dead-letter (@12).
- Template email React Email: tono e brand da @02; trigger dal CRM (@05).

## Interfacce / Contratti (consuma -> espone)
- Consuma: DECISIONI, tutte le SPEC.
- Espone agli altri capitoli: infrastruttura dati (Supabase/Postgres+RLS), Auth, Storage, job queue, hosting, integrazioni (Stripe/Resend/WhatsApp). Gli altri moduli (04/05/06/08) costruiscono sopra questa base.

## Criteri di accettazione
- Tutti i servizi dati (DB/Storage) sono in regione UE.
- RLS attiva su tutte le tabelle; i segreti non compaiono mai nel bundle client.
- La build passa lint, type-check e test prima del deploy.
- Esistono i tre ambienti (dev/staging/prod) con variabili separate (@SPEC_Env_Vars).

## Rischi / Compliance & Riferimenti
- Rischio sicurezza: RLS mal configurata espone dati tra clienti; va testata (@11).
- Rischio residenza dati: alcuni fornitori (Stripe, Meta, Vercel) possono trattare dati fuori UE; gestire con SCC (@10).
- Rischio performance: animazioni pesanti (doppio motore GSAP+Motion) penalizzano Core Web Vitals; mantenere sobrieta.
- Rischio lock-in fornitore: forte dipendenza da Supabase; mitigata dall'uso di Postgres standard (portabile).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni stack tecnologico, area riservata, cold storage).
