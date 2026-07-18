# HANDOFF per il prossimo agente

> Documento di passaggio di consegne. Aggiornato: **2026-07-18 ~11:45**.
> Scopo: permettere a un nuovo agente (senza contesto) di riprendere il lavoro.
> Riferimenti chiave: @RUNBOOK_GoLive (procedura go-live), @SPEC_Env_Vars,
> @DOMANDE_PER_LORENZO, @PROSSIMO_INCONTRO_LORENZO, @07_Stack.
> Credenziali/dati sensibili (Google/Stripe/Resend/Supabase/OpenAI/Cloudflare + dati
> fiscali Lorenzo): nel file **`ACCESSI_LOCALE.md`** in root (git-ignored, NON
> committato). Non è nel repo.

## 8-terdecies. Sessione 18/07 tarda mattina — recensioni Google + foto Pontedera

**Stato:** su `main` commit `931ced5` (push fatto). Build/tsc ok.

### Recensioni Google reali — FATTO (senza sync a pagamento)
- Home / chi-sono: tolte le 3 fixture finte; ora i **2 testi veri** da Google Maps
  (Antonio Tognarelli + Mauro Toncelli). Rating 5,0 · 2 recensioni pubbliche.
- Attribution “da Google” + link Maps + CTA `settings.review_url` (g.page).
- Intro home: “Recensioni vere da Google.”
- File: `web/src/content/site.ts` (fallback), `web/src/components/site/reviews.tsx`,
  `web/src/lib/google-reviews.ts` (Places API New, cache 12h).
- **Sync automatico Places NON attivo:** Mauro ha rifiutato l’attivazione billing
  Google Maps Platform (carta obbligatoria anche “gratis”). Env opzionali
  `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` documentati in `@SPEC_Env_Vars`;
  senza chiave resta il fallback. Quando arriveranno altre recensioni →
  aggiornare a mano `site.ts` (o attivare Places se Mauro cambia idea).
- La recensione di Mauro **resta** (scelta esplicita).

### Foto Pontedera — FATTO
- `/contatti`: sostituito placeholder finto con **Duomo di Pontedera**
  (`web/public/images/pontedera-studio.jpg`, da Wikimedia CC BY 4.0,
  credit SeesaTheDoctor in figcaption). Rimosso il vecchio `.png`.

### Altro stesso commit
- Fix eslint campanella: sync props senza `setState` in `useEffect`
  (`notifications-bell.tsx`).
- **Non** committare `bozza video/` (WIP video Come funziona — riprese in corso;
  script `@15_Video_Come_Funziona_Script`).

### Aperto dopo 18/07 (tarda mattina)
- [ ] Accumolare ~20 recensioni GMB; aggiornare testi in `site.ts` (o Places)
- [ ] Video Come funziona (bozze in `bozza video/`, fuori git) + integrazione pagina
- [ ] SMS/WhatsApp; traduzioni/legal; QA cross-browser; Lenis
- [ ] Check costi pacchetti con Lorenzo; test AI XML su pratica reale
- Opzionale: RLS UPDATE `client_notifications` ristretta a `read_at`

---

## 8-duodecies. Sessione 18/07 — area notifiche + cleanup

**Stato:** feature notifiche cliente **su `main`** (`0294a6c`); batch UI/imposte/GMB
`48ae056`; cleanup bugfix + handoff **su `main`** (`11101e3`).
Proseguimento tarda mattina → §8-terdecies.

### Feature area personale (commit `0294a6c`) — FATTO
Due canali distinti (@06):
1. **Campanella alert** — tabella `client_notifications` (kind, title, body, href,
   read_at, practice_id, contact_id). Migrazione
   `supabase/migrations/20260718120000_client_notifications.sql` **già applicata
   in prod**. Profilo: `notify_email`, `notify_whatsapp`, `comms_seen_at`.
2. **Storico Comunicazioni** — pagina `/area-riservata/comunicazioni` da
   `practices.communications` (solo OUTBOUND email/WA/phone); badge “nuove” via
   `comms_seen_at`.

File chiave:
- `web/src/lib/client-notifications.ts` (+ `-shared.ts`)
- `web/src/lib/client-comms.ts`
- `web/src/components/area/notifications-bell.tsx`
- `web/src/app/area-riservata/(app)/comunicazioni/page.tsx`
- `web/src/app/area-riservata/(app)/notifiche/actions.ts`
- Hook push: CRM `pratiche/[id]/actions.ts` + webhook Stripe (PAGATO/stato/
  imposte/reject/finali/recesso)

**Preferenza email soft:** `notify_email` spegne **solo** la mail recensione GMB
a 48h (`getNotifyEmailPreference`); le email transazionali restano sempre on.
Dashboard “prossima azione” resta CTA unica; la campanella è complemento.

### Batch UI/CRM/GMB (commit `48ae056`) — FATTO
- CRM “Comunica al cliente” → stile primary `crm-gradient`
- Tabella home: riga «Tempo da investire»
- Avvisi imposte (CRM se email manca/falla; CTA IBAN area)
- Follow-up chiusura: mail GMB via Resend `scheduled_at: "in 48 hours"`
  (`notifyReviewRequest` in `notifications.ts`, da `changeStatus`)

### Cleanup / bugfix 18/07 mattina — FATTO (su `main`)
File: `client-comms.ts`, `client-notifications.ts`, `area.ts`,
`area-riservata/(app)/layout.tsx`, `notifiche/actions.ts`, `comunicazioni/page.tsx`.

| Fix | Dettaglio |
|-----|-----------|
| `parseCommStamp` UTC | Stamp CRM da `toISOString` senza `Z` erano letti come locali → badge “nuove” sballato |
| Mark-read service_role | Update scoped su `contactId` sessione (no UPDATE JWT su tutte le colonne) |
| `ClientView.contactId` | Layout usa `view.contactId` (niente doppio `ensureProfile`) |
| `setCommsSeenAt` + `after()` | `revalidatePath` layout **dopo** la response (no revalidate in render) |
| `getNotifyEmailPreference` | `limit(1)` se profili duplicati sullo stesso contatto |

`npx tsc --noEmit` + eslint sui file toccati: ok. **Non** committare `bozza video/`.

### Aperto dopo cleanup → aggiornato in §8-terdecies
- [x] Foto Pontedera vera (Duomo, `931ced5`)
- [x] Recensioni GMB reali sul sito (2 testi; sync Places rinviato)
- Resto (video, ~20 recensioni, SMS/WA, legal, QA…) → §8-terdecies «Aperto»

---

## 8-undecies. Sessione 17/07 sera — backlog Mauro chiuso (codice) + tipologiche/template

**Stato:** i 12 fix codice urgenti del 17/07 + tornate successive sono **fatti e
su `main`** (ultimo batch tipologiche/template: `0b5357e`; Come funziona icone:
`f4dc565`/`c266c0b`). Proseguimento 18/07 → §8-duodecies.

### Tipologie documenti CRM (`/crm/tipologie-documenti`) — FATTO
- Menu sidebar/topbar **Sito → Tipologie di documenti**
- Attiva/disattiva voci in checklist automatica; tipi custom
- **Modelli PDF** per tipologia: default (morte + stato famiglia in
  `public/templates/`), rinomina/rimuovi, **upload PDF** → Storage
  `site/doc-templates/...`, download area via `/api/doc-templates/download`
- Stato in Storage NO-DDL: `practice-docs/site/_document-types.json`
- File: `lib/document-types.ts`, `lib/document-types-shared.ts`,
  `lib/doc-templates.ts`, `lib/checklist.ts` (async + catalogo),
  `components/crm/document-types-editor.tsx`
- Flag “Verificato” **rimosso** (non aveva effetto operativo)

### Altri fatti 17/07 sera (sintesi)
- Esito A: niente SoftLead email; questionari tracciati (notifica `preventivo` +
  contatore Statistiche); filtri notifiche CRM Importanti/Tutte
- Meta SEO rafforzata; prezzi **senza IVA** (forfettario); banner GMB area
  (`settings.review_url` = `https://g.page/r/CVRoWf5CoiTDEAE/review`)
- Quiz testamento: tono neutro (niente “Nessun problema”)
- Come funziona: visita studio + step **compatti** con icone SVG custom
  (`come-funziona-icons.tsx`), numerini leggibili
- Mobile spacing sito (Section/PageHero/home/cards/footer)

### Aperto dopo 17/07 → chiuso/spostato il 18/07
- [x] Mail follow-up chiusura pratica con link GMB (48h via Resend, 18/07)
- [x] Tabella comparativa: riga «Tempo da investire» (18/07)
- [x] Area cliente: campanella notifiche + pagina Comunicazioni (18/07)
- Resto asset/ops/traduzioni → vedi §8-duodecies «Aperto dopo 18/07»

---

## 8-decies. Backlog Mauro 17/07 — priorità e nota CRITICA su lead/account

Lista lunga ricevuta il 17/07. **Priorità #1 (trattata sotto):** dove finisce
la pratica se il lead non è ancora registrato / se paga senza account, e se può
"perdere" la pratica. Il resto è backlog (dettaglio sotto; codice urgente chiuso
il 17/07 sera — vedi §8-undecies).

### CRITICO — Lead / pagamento senza registrazione (come funziona)

**Non serve un account per nascere come lead o per pagare.** L’account area
personale si crea al primo login (magic link / Google / telefono / password).

| Momento | Cosa viene creato | Auth account? |
|--------|-------------------|---------------|
| SoftLead (email/su misura sul risultato quiz) | `contacts` + `practices` LEAD con email/telefono | No |
| Checkout diretto dal sito (senza SoftLead) | Pratica “anonima” al click Paga; email da Stripe al webhook | No |
| Webhook Stripe `paid` | Pratica → PAGATO; aggancio/creazione `contact` per email Stripe | No |
| Login area personale | `auth.users` + `profiles.contact_id` collegato per **stessa email** (o telefono) | Sì |

**Come il cliente ritrova la pratica:** login con la **stessa email del pagamento
(o del SoftLead)**. La RLS mostra solo pratiche con `contact_id` = contatto del profilo.

**Rischio reale:** se dopo il pagamento accede con un’email diversa (es. Google
personale ≠ email Stripe), l’area risulta vuota. Mitigazioni già presenti:
- webhook crea/aggancia contatto dall’email Stripe;
- `ensureProfile` ricollega se l’email auth ≠ email del contatto agganciato;
- empty state + (dal 17/07) avviso su `/checkout/conferma`.

**Bug fixato il 17/07:** l’email SoftLead “Procedi al checkout” **non** passava
`practice=<id>` → si creava una **seconda** pratica anonima. Ora il link include
`practice=`. Card Kanban CRM: mostrano email/telefono sotto il nome (i lead senza
nome non sembrano più “pratiche misteriose”).

**Mitigazioni aggiunte il 17/07 (dopo accordo Mauro):**
1. Email PAGATO: CTA = **magic link** Supabase sulla email Stripe + codice pratica
   (`createAreaAccessLink`, `notifyStatusChange` opts).
2. **Upsert contatto per email** (`lib/contacts.ts`) in SoftLead e webhook.
3. Area vuota: form **codice pratica + email** per collegare il profilo
   (`claim/actions.ts`, `ClaimPracticeForm`) — solo se email login = email pratica.

**Gap residui:**
- login solo telefono dopo checkout solo-email → match ancora debole;
- se upsert contatto fallisce al webhook → pratica senza `contact_id` finché
  Lorenzo non sistema / cliente usa recovery.

File chiave: `preventivo/actions.ts`, `checkout/actions.ts`,
`api/stripe/webhook/route.ts`, `lib/contacts.ts`, `lib/area-access-link.ts`,
`lib/profiles.ts`, `lib/area.ts`, `area-riservata/(app)/claim/actions.ts`.

### Fatto 17/07 (lead/account) — commits `b8ab62c` + `c91293d`
- [x] SoftLead → checkout riusa `practice=`
- [x] Email/telefono sulle card Kanban CRM
- [x] Avviso stessa email su `/checkout/conferma`
- [x] Magic link + codice pratica in email PAGATO
- [x] Upsert contatto per email
- [x] Recovery area vuota (codice + email)
- [x] Handoff aggiornato

### Backlog restante (da smaltire a blocchi)

**Fix codice immediati (agente, senza Lorenzo)** — ordine urgenza:
1. [x] Add-on disattivi: RLS anonima vedeva [] → fallback fixture; ora lettura admin (17/07)
2. [x] Esito A: nascondere “Intanto ecco cosa ti servirà” (17/07)
3. [x] Testi “5 minuti” → “1 minuto” (content_entries + seed) (17/07)
4. [x] Preferenze notifiche profilo: allineare bottoni (17/07)
5. [x] Documenti area: badge “da caricare” non in doppia fila (desktop) (17/07)
6. [x] Chi sono: già ok così (titolo presente; niente da fare) (17/07)
7. [x] Statistiche CRM: nomi pacchetti da `getPackages()` / CMS (17/07)
8. [x] Kanban: colonne più compatte a desktop pieno (flex-1 da xl) (17/07)
9. [x] Link GA4 in Statistiche CRM (non sidebar) (17/07)
10. [x] Prefisso telefono profilo (+xy) (17/07)
11. [x] Mobile spacing sito (Section/PageHero/home/cards/footer) (17/07)
12. [x] Come funziona: blocco visita in studio (copy + settings.address/orari) (17/07)

**Post-12 (17/07 sera):**
- [x] Esito A: niente SoftLead “Preferisci pensarci? … via email”
- [x] Questionari completati contati (Storage + notifica `preventivo`) anche senza email
- [x] Notifiche CRM: filtri Importanti/Tutte + chip per tipo; badge esclude questionari

**Tornata 17/07 sera (2) — commits fino a `0b5357e`:**
- [x] CRM → Tipologie documenti + gestione template PDF (vedi §8-undecies)
- [x] Meta description SEO rafforzata (professionista reale + online)
- [x] Prezzi: copy **senza IVA** (forfettario) su tariffe / card / ordine area
- [x] Banner recensione GMB in evidenza (dashboard + conclusa); URL pubblicato
- [x] Quiz testamento: tolto “Nessun problema…”
- [x] Come funziona: step compatti + icone SVG custom (non illustrazioni grandi)
- [x] Mail follow-up chiusura con stesso link GMB (48h via Resend, 18/07)

**Serve asset / decisione Lorenzo / ops**
- [x] Foto Pontedera vera (Duomo, 18/07 — `931ced5`)
- [x] Recensioni GMB sul sito (2 testi reali; sync Places rinviato — no billing)
- [ ] Accumulare ~20 recensioni GMB (+ aggiornare `site.ts` o Places)
- [ ] Blocco “lingua / traduzione live” → solo quando Lorenzo attrezzato
- [x] Tabella comparativa: riga «Tempo da investire» (18/07)
- [ ] SMS Twilio / WhatsApp Business
- [ ] Video Come funziona (bozze in `bozza video/`, fuori git) + welcome/attrice
- [ ] Check costi 290/490/790 con Lorenzo
- [ ] Test AI XML su pratica reale
- [ ] Traduzioni + legal go-live
- [ ] Cross-browser QA
- [ ] Micro-animazioni Lenis (ultima, con rollback)

---

## 8-nonies. Sessione 16/07 (pomeriggio) — modalità offline sito + GA4 Measurement Protocol

### Modalità offline (commit `4ba8a65`) — FATTO, data-driven, in produzione

**Cosa fa:** dal CRM Lorenzo può mettere in pausa il **solo sito pubblico**
(vacanza / manutenzione / messaggio custom). Area personale e CRM **non** vengono
bloccati.

**Dove nel CRM:** sidebar Sito → **Modalità offline** (`/crm/modalita-offline`),
anche nel menu mobile topbar.

**Cosa è data-driven (runtime, senza redeploy):**
- Stato salvato in Storage privato NO-DDL:
  `practice-docs/site/_offline.json`
- Campi: `enabled`, `preset` (`vacation` | `maintenance` | `custom`), `title`,
  `body`, `reopenDate` (YYYY-MM-DD, opzionale), `showContactButtons`, `updatedAt`
- Lettura sito: `getSiteOfflineState()` in `web/src/lib/site-offline.ts`
  (`unstable_cache` + tag `site:offline`)
- Salvataggio CRM: `saveSiteOfflineState` + server action
  `saveOfflineMode` → `updateTag("site:offline")` + `revalidatePath("/", "layout")`
  (invalidazione immediata, no contenuto stale)

**Cosa è data-driven da content (build-time JSON, non editabile dal toggle):**
- Telefono / email / WhatsApp dei pulsanti contatto: `settings.phone|email|whatsapp`
  da `content_entries` (`SiteOfflineNotice`)

**Cosa è in codice (preset / UX fissa):**
- Testi modello Vacanza/Manutenzione: `web/src/lib/site-offline-shared.ts`
  (`OFFLINE_PRESETS`) — il CRM li applica poi li puoi sovrascrivere (diventa
  `custom`)
- Link **Area personale** sulla pagina offline: **sempre presente**
  (“Hai già una pratica? Accedi all'area personale” → `/area-riservata`)
- Navbar/footer restano montati in `(site)/layout.tsx`: in navbar c’è ancora
  il link Area personale; le voci di menu portano a pagine che mostrano lo
  stesso messaggio offline (il gate sostituisce `{children}`)

**Scope del gate (importante):**
- Solo `web/src/app/(site)/layout.tsx` → overlay `SiteOfflineNotice`
- **NON** avvolge `/area-riservata` né `/crm` / `/crm-login`
- Con offline ON: nascosto anche `MobileCta` (barra mobile preventivo)

**UI pubblica offline:**
- Titolo + messaggio dal JSON
- Se `showContactButtons`: email / WhatsApp / telefono
- Link area personale (sempre)
- Icona vacanza vs manutenzione in base al `preset`

**UI CRM editor:** `web/src/components/crm/offline-mode-editor.tsx`
- Toggle on/off, modelli, data riapertura (manutenzione), titolo/body,
  checkbox contatti, anteprima, “Salva e pubblica”

**File chiave:**
- `web/src/lib/site-offline.ts` / `site-offline-shared.ts`
- `web/src/app/crm/modalita-offline/page.tsx` + `actions.ts`
- `web/src/components/crm/offline-mode-editor.tsx`
- `web/src/components/site/site-offline-notice.tsx`
- `web/src/app/(site)/layout.tsx`

**Come testare:** CRM → attiva Vacanza → apri sito in anonimo → vedi messaggio;
apri `/area-riservata` e `/crm` → devono funzionare; disattiva → sito normale.

### GA4 purchase server-side (commit `cf7a78d`) — FATTO
- Measurement Protocol dal webhook Stripe (`sendGa4Purchase` in
  `web/src/lib/analytics-server.ts`)
- Env: `NEXT_PUBLIC_GA4_MEASUREMENT_ID` + `GA4_API_SECRET` (su Vercel, Sensitive)
- Client `purchase` su `/checkout/conferma` solo se **manca** `GA4_API_SECRET`
  (evita doppio conteggio)
- Spec aggiornata: `@SPEC_Env_Vars`

### Altri fix 16/07 pomeriggio (commit `1ded9de`)
- Copy Chi sono: titolo “Geometra sui catastali, commercialisti sui numeri” +
  body/`perche_geometra_body` (content_entries + seed)
- Banner qualità foto in area documenti
- Logo nav/footer: cerchio dorato (`rounded-full`)
- Tabella confronto home: intestazioni senza X/logo (segni solo nelle righe)

---

## 0. TL;DR (stato 14/07 sera; offline/GA4 → vedi 8-nonies)
Il sito e **online e OPERATIVO in produzione** su `https://www.successioniarmellin.it`.
**Il 14/07 e' stato completato ed eseguito con successo il primo ACQUISTO REALE da 290 EUR**
(pratica `SUC-2026-0022`, carta vera, Stripe LIVE): checkout -> webhook -> PAGATO ->
checklist auto -> email "pagamento ricevuto" -> login cliente -> firma mandato ->
richiesta recesso di test. Tutta la filiera funziona.

Stato servizi (tutto ATTIVO):
- **Stripe LIVE**: chiavi live + webhook live configurati su Vercel. Pagamenti veri OK.
- **Resend**: dominio **Verified** (DNS su Cloudflare), invii funzionanti; e' anche
  l'SMTP custom di Supabase Auth (magic link / OTP ai clienti).
- **Supabase Auth cliente**: FUNZIONA (era rotto per PKCE/redirect). Configurato via
  Management API: Site URL `https://www.successioniarmellin.it`, redirect URLs
  (www/apex/localhost), SMTP Resend, template email con `token_hash` + codice OTP a 6
  cifre come fallback, rate limit email alzato a 100/h.
- **OpenAI**: `OPENAI_API_KEY` su Vercel, estrazione AI provata su pratica demo.
- **Google Workspace**: `studio@successioniarmellin.it` attivo, MX verificati.
- **Vercel**: funzioni spostate in **fra1** (prima iad1 USA: era la causa dei click
  lenti nell'area personale, 4-5 round-trip transatlantici verso Supabase eu-central-1).
- **Legale**: testi pubblicati come DEFINITIVI dal 14/07 (decisione Mauro+Lorenzo,
  senza passaggio avvocato): rimossi i notice "in validazione", retention lead 12 mesi,
  mandato unificato in `web/src/content/mandato.ts`.
Sezione **8-ter** qui sotto = cronaca completa del 14/07 con i BUG FIX importanti.
Sezione **8-quater** = sessione 15/07 (blocchi post-incontro con Lorenzo).
Sezione **9** = TODO APERTI (leggila per prima!).
Lingua del progetto: **italiano**. Scrivere sempre in italiano con l'utente.

## 8-octies. Appunti go-live video (16/07) — da fare all'integrazione
- Sottotitoli video **multilingua** (tutte le lingue del switcher): auto-sync
  con la lingua del sito + scelta manuale sempre disponibile. Vedi
  `@RUNBOOK_GoLive` §8 e `@15_Video_Come_Funziona_Script` §6.1.
- Footer indirizzo: gia' link Google Maps (fatto in 8-sexies).

## 8-septies. Sessione 16/07 (terza tornata) — quiz testamento + FAQ documenti + credits CRM
1. **Quiz preventivo**: il testamento NON forza piu' l'esito C (su misura).
   In `lib/quote.ts` `computeEsito` ignora `hasWill` per il routing (resta
   tracciato per analytics/CRM/checklist). Su misura solo con `hasOther=si`
   o `hasRealEstate=nonso`. Nota informativa se "si": i pacchetti standard
   coprono anche i casi con testamento.
2. **Domanda**: "Il de cuius ha lasciato un testamento?" con pallino info
   (tooltip hover/focus + tap su mobile) che spiega "de cuius" = il defunto.
   Verificato desktop e mobile.
3. **Copy allineati**: rimossi i riferimenti al testamento come trigger del
   su misura (tariffe.su_misura_text, pacchetti.su_misura_body, grazie.esito_c_body).
4. **4 FAQ documenti** (categoria "Documenti e Area personale"): foto telefono,
   modelli pronti, documento rifiutato, stato approvazione. Inserite in
   fixture `site.ts` + DB produzione via `update-prod-content.mjs`.
5. **Credits**: footer sito "Realizzato da AT STUDIO · Mauro Toncelli"; nel
   CRM sidebar (desktop) e menu mobile topbar.
- Build ok. **NON committato** (chiedere a Mauro).

## 8-sexies. Sessione 16/07 (seconda tornata) — migliorie sito + SEO + CRM (FATTE, NON committate)
Mauro ha approvato i nuovi nomi pacchetti (vedi 8-quinquies): **APPLICATI IN
PRODUZIONE** via `node scripts/update-prod-content.mjs` (16/07 ~11:30, verificato
con curl: il DB ora ha "Successione con Immobili" e "Successione Estesa"; le
pagine statiche mostreranno i nuovi nomi al prossimo deploy/revalidate).
Poi seconda lista di richieste, tutto implementato (build ok, verifica visiva
locale mobile/tablet/desktop):

1. **"Commercialisti" al plurale** (impressione di studio strutturato) in tutti
   i testi pubblici: trust_line footer, trustbar, chisono_estratto, microtrust
   tariffe/checkout, team_title/team_body chi-sono, valore_body come-funziona,
   reviewed_by articoli (content_entries + articles.ts). NON toccati legal.ts/
   mandato.ts e "Molti si aspettano un commercialista..." (li' il singolare e'
   corretto).
2. **Hero home**: velo blu alleggerito (`from-primary via-primary/70 via-40%
   to-transparent`, prima copriva tutta la foto) + crop responsive del volto:
   `object-[62%_22%]` mobile, `[68%_30%]` sm, `[78%_center]` lg (prima su
   mobile si vedeva solo la libreria).
3. **Trust bar home** riorganizzata: da flex-wrap sbilanciato a griglia
   omogenea 2/3/6 colonne, icona sopra e testo centrato sotto.
4. **Tabella comparativa home**: titolo senza "gratis" ("Si può fare da soli
   sul sito dell'Agenzia delle Entrate. Allora perché noi?"), design rifatto:
   header con icone (X rossa / badge "A" oro), righe zebra, colonna "Con noi"
   in evidenza, riga finale con CTA preventivo.
5. **FAQ "agevolazione prima casa"**: VERIFICATA presente in produzione
   (DB faqs) e nelle fixture. E' data-driven (tabella faqs Supabase).
6. **Addon disattivabili dal CRM**: `getAddons` ora legge tutte le righe e
   filtra `is_active` client-side -> se Lorenzo li disattiva TUTTI dal listino
   la sezione "Servizi aggiuntivi" su /tariffe SPARISCE (renderizzata solo se
   addons.length > 0); il singolo disattivato sparisce da solo. Il fallback
   fixture resta solo per tabella vuota/errore.
7. **Banner strumento in /guide** ridisegnato: card grande con NUOVA
   illustrazione brand (`web/public/images/strumento-valore-catastale.png`,
   generata AI: casa+calcolatrice+documento nei colori navy/oro/sand),
   eyebrow "Strumento gratuito", titolo piu' grande.
8. **SEO /strumenti/valore-catastale**: canonical + Open Graph, JSON-LD
   `WebApplication` (gratis) + `FAQPage`, nuova sezione FAQ visibile in pagina
   (4 domande data-driven: `strumenti.catastale_faq` + `catastale_faq_title`).
   Title arricchito "(gratis, online)". Era gia' in sitemap con priority 0.8.
9. **SEO immagini**: audit alt fatto (tutte le <Image> del sito hanno alt
   descrittivi). Aggiunti Open Graph di DEFAULT nel root layout (siteName,
   locale it_IT, og:image = logo 512) + twitter card. **TODO GO-LIVE: le foto
   attuali sono FINTE/placeholder ("immagine indicativa" negli alt): al
   go-live sostituirle con foto vere di Lorenzo + creare og-image 1200x630
   reale.**
10. **Footer**: l'indirizzo dello studio ora e' un link a Google Maps
    (`google.com/maps/search/?api=1&query=...`, target _blank).
11. **Calendario CRM - recesso 14 giorni**: nuovo tipo evento `recesso`
    ("Fine recesso (14 gg)", chip rosa) generato per ogni pratica PAGATA:
    data = `paid_at` + 14 (art. 52 Cod. Consumo, cost. `WITHDRAWAL_DAYS` in
    lib/crm.ts). `mapPractice` ora mappa `paid_at` -> `paidAt` (campo nuovo
    opzionale su Practice). Evento `done` (spento) quando la finestra e'
    passata o pratica CHIUSA. Legenda auto-aggiornata (deriva da calEventMeta).
12. **4a scheda su misura**: testi resi piu' espliciti sui casi complessi
    ("Per le successioni più complesse", body con testamento/8+ immobili/
    terreni/aziende, feature "Per i casi che i pacchetti non coprono").
- Seed risincronizzato. **NON committato: chiedere a Mauro prima di push.**

## 8-quinquies. Sessione 16/07 — 5 lavoretti UI/contenuti (FATTI, NON committati)
Richieste di Mauro del 16/07 mattina. Tutto implementato e verificato in locale
(build ok + controllo visivo su localhost:3000). **NON committato, DB produzione
NON toccato**: vedi "resta da fare" in fondo al blocco.

1. **"Torna al sito" nell'area personale**: nuovo link (freccia + label) nel
   header di `web/src/app/area-riservata/(app)/layout.tsx`, accanto ad
   Assistenza/Esci. Su mobile resta solo l'icona (come le altre azioni).
2. **Rinomina pacchetti** (problema: "Zero Stress"/"Completa" facevano credere
   che tutto fosse gia' incluso — timore espresso da Lorenzo il 14/07):
   - SEMPLICE -> "Successione Semplice" (invariato), tagline "Solo conti e
     liquidita', nessun immobile";
   - COMPLETO -> **"Successione con Immobili"**, tagline "Da 1 a 3 immobili,
     voltura catastale inclusa";
   - ZERO_STRESS -> **"Successione Estesa"**, tagline "Da 3 a 8 immobili, con
     recupero documenti". Descrizioni/feature riallineate (perimetro immobili
     esplicito, niente "tutto incluso"). Prezzi INVARIATI.
   - Aggiornati: fixture `web/src/content/site.ts`, label CRM
     (`new-practice-form.tsx`, `brogliaccio/[id]/page.tsx`) e lo script
     `web/scripts/update-prod-content.mjs` (packageUpdates completi per i 3
     pacchetti). ATTENZIONE: in produzione i pacchetti vengono dal DB Supabase,
     quindi la rinomina online richiede di ESEGUIRE lo script.
3. **4a scheda "Preventivo personalizzato"** nella griglia pacchetti
   (`web/src/components/site/package-cards.tsx`, usata da home e /tariffe):
   card tratteggiata senza prezzo ("Su misura"), CTA verso /preventivo. Griglia
   da md:grid-cols-3 a md:grid-cols-2 xl:grid-cols-4. Testi data-driven nella
   NUOVA collection `pacchetti` (chiavi `su_misura_*`) in content_entries.
   Nota: resta anche la card "Casi particolari" in fondo a /tariffe.
4. **Navbar piu' ariosa** (`navbar-client.tsx`): container max-w-6xl ->
   max-w-7xl; voci menu con padding pillola + hover bg (px-2.5/gap-1, a 2xl
   px-3/gap-2); "Parla con Lorenzo" diventa SOLO icona telefono sotto i 1536px
   (label da 2xl in su, aria-label/title presenti). Verificato niente overflow
   a 1280px.
5. **"Cosa ricevi a fine pratica" allineata**: la lista era flush a sinistra
   sotto il titolo centrato; ora `w-fit mx-auto` centra il blocco sulla
   larghezza reale delle voci. Fixato su /tariffe E /come-funziona.
6. **Chi sono - "Le mie credenziali" vuota**: l'entry `chi_siamo.credenziali_list`
   era `is_published: false` (il loader scarta le non pubblicate) -> pubblicata.
   Ora compaiono le 3 card (Albo, Entratel, P.IVA).
- `seed/content_entries.it.json` risincronizzato (copia esatta del file web).
- **RESTA DA FARE (serve ok di Mauro)**: (a) commit+push per il deploy;
  (b) eseguire `node scripts/update-prod-content.mjs` (cwd web/, prima `--dry`)
  per rinominare i pacchetti nel DB produzione — i NUOVI NOMI vanno prima
  confermati da Lorenzo; (c) valutare se rinominare anche l'etichetta interna
  ZERO_STRESS (chiave DB: NON toccarla, e' solo un identificatore).

## 8-quater. Sessione 15/07 — blocchi post-incontro Lorenzo (piano confermato da Mauro)

### Blocco 1 — Recesso/rimborso chiude la pratica (FATTO)
- `updateWithdrawal` (CRM): recesso ACCETTATO -> pratica `ANNULLATA` automatica,
  `action_owner: NONE`, IBAN cancellato (retention @10). Il rimborso Stripe resta manuale.
- Webhook `charge.refunded`: rimborso TOTALE -> `ANNULLATA` (se non gia' chiusa/annullata).
- Area cliente in **modalita' storico** per pratiche annullate/rimborsate:
  `isPracticeCancelled()` in `web/src/content/area-data.ts` (status ANNULLATA o payment
  REFUNDED); dashboard con card "pratica annullata", pagina documenti in sola lettura,
  API upload/delete/mandato bloccate (403), link recesso e IBAN nascosti in /ordine.
- `getClientView` (lib/area.ts): con piu' pratiche privilegia quella ATTIVA
  (pagata attiva -> qualsiasi attiva -> la piu' recente anche se annullata).

### Blocco 2 — Upload documenti da CRM per clienti in studio (FATTO)
- Nuova route `POST /api/crm/documents/upload` (requireAdmin): upload su una voce
  checklist per conto del cliente; il documento nasce direttamente **APPROVATO**.
- `CrmChecklist`: pulsante upload per ogni voce (multi-file, PDF/JPG/PNG).
- Pulsante "Genera checklist adesso" (`GenerateChecklistButton` + action
  `createChecklistNow`) sulle pratiche create a mano senza checklist.

### Blocco 3 — Testi di Lorenzo + passata refusi (FATTO)
- Home: sottotitolo "...tutto online (e se vuoi anche di persona)...".
- Rimosso "senza ricarichi"; "imposte di Stato" -> "imposte" nei testi PUBBLICI
  (restano in legal.ts/mandato.ts dove serve precisione e nel CRM interno).
- "Se ti manca qualcosa, spesso lo possiamo recuperare noi" al posto delle varianti.
- Nuova FAQ "agevolazione prima casa" (fixture + DB produzione).
- **Passata accenti completa** su content_entries/site/articles/legal/mandato:
  script `web/scripts/fix-accents.mjs` (parole non ambigue) + 2 subagent per il
  verbo e/e'. ATTENZIONE storica: lo script aveva accentato per errore alcune CHIAVI
  JSON (\_meta, citta, perche_geometra_body, cat_perche_intro), gia' ripristinate.
- `seed/content_entries.it.json` ora e' una COPIA ESATTA di
  `web/src/content/content_entries.it.json` (sincronizzati il 15/07).
- **DB produzione aggiornato** con `web/scripts/update-prod-content.mjs` (one-shot):
  faqs (8 testi corretti + nuova FAQ prima casa) e packages (accenti badge/descrizione).
  Le pagine leggono faqs/packages da Supabase, NON dalle fixture.
- Pacchetto 790: nessun cambio prezzo/nome ancora — proposte di rinomina presentate
  a Mauro da girare a Lorenzo.

### Blocco 4 — Quiz preventivo ridisegnato (FATTO)
- **Prima domanda: "La persona mancata ha lasciato un testamento?"** — "si" ->
  esito C (preventivo su misura), coerente con le condizioni di vendita.
- **Eredi a contatori per tipo** (coniuge, figli, genitori, fratelli, nipoti, altri):
  tipo `HeirsComposition` in `web/src/lib/quote.ts` con encode/decode per query
  string (param `comp`, es. "1.2.0.0.0.0") e `heirsSummary()` ("Coniuge + 2 figli").
- L'esonero (esito A) ora richiede: TUTTI gli eredi coniuge/linea retta
  (`isAllDirectLine`), nessun immobile, "no" esplicito alla soglia 100k.
- Il campo DB `practices.relation` ora contiene la composizione ("Coniuge + 2 figli");
  label CRM cambiata in "Eredi (composizione)". Vecchio param `rel` eliminato.
- "Altri beni" cita esempi: quote societarie, azioni, aziende, imbarcazioni.

### Blocco 5 — Login Google + password opzionale (ATTIVO dal 15/07 mattina)
- Server actions: `signInWithGoogle` (OAuth PKCE, atterra sullo stesso
  auth/callback del magic link) e `signInWithPassword` in
  `web/src/app/area-riservata/actions.ts`.
- Login form: pulsante "Continua con Google" + terza tab "Password".
- Profilo: sezione "Sicurezza" con crea/cambia password (`updatePassword` action,
  min 8 caratteri, via `supabase.auth.updateUser`).
- **ATTIVATO il 15/07**: OAuth client creato da Mauro su Google Cloud
  (account studio@, credenziali in ACCESSI_LOCALE) e provider Google abilitato
  su Supabase via Management API. Redirect verso accounts.google.com verificato.
- **RESTA DA FARE**: pubblicare la schermata di consenso OAuth (e' in modalita'
  Test: solo gli utenti di prova possono accedere). Google Auth Platform ->
  Audience -> "Pubblica app" con l'account studio@successioniarmellin.it.

### Blocco 7 — Centro notifiche CRM eliminabile (FATTO 15/07 mattina, da committare)
- Nuova tabella `crm_notifications` (creata in produzione via Management API +
  migrazione `supabase/migrations/20260715090000_crm_notifications.sql`): eventi
  puntuali PERSISTENTI ed ELIMINABILI, complementari agli "Alert automatici"
  derivati (che ricompaiono finche' la condizione persiste). RLS attiva senza
  policy: accesso solo service_role.
- Lib `web/src/lib/crm-notifications.ts` (push/list/delete/clear, push best-effort:
  mai un errore che blocca l'operazione principale). Eventi innestati:
  pagamento ricevuto + rimborso (webhook Stripe), nuovo lead/su misura
  (createLead), recesso richiesto (submitWithdrawal), documenti inviati
  (submitDocuments), mandato firmato (signMandate).
- UI: pannello "Notifiche" in cima alla Home CRM
  (`web/src/components/crm/notifications-panel.tsx`, client component con
  rimozione ottimistica; X per singola notifica + "Elimina tutte"). Server
  actions con requireAdmin in `web/src/app/crm/notifications/actions.ts`.
- Estensione (11:15): eventi aggiunti — upload documento per voce checklist
  (dedupe 30' per non spammare col multi-file), mandato firmato caricato come
  PDF, IBAN inserito (kind `iban`). `pushCrmNotification` supporta
  `dedupeMinutes`; nuova `countCrmNotifications` alimenta la CAMPANELLA con
  badge contatore nella Topbar CRM (conteggio nel layout, visibile ovunque).

### Blocco 9 — Audit "Tocca a te / In attesa del cliente" + email cliente (FATTO 15/07, committato)
- Audit completo di `action_owner` su TUTTE le azioni e delle email al cliente.
  Logica confermata sensata nel complesso; 4 buchi trovati e fixati:
  1. `rejectDocument` (CRM): ora porta `action_owner` a CLIENT (prima il badge
     restava "Tocca a te" anche se la palla era del cliente) + log
     `documento_rifiutato`; email invariata.
  2. Upload area cliente: se il cliente ricarica l'ULTIMA voce rifiutata, la
     palla torna automaticamente ad ADMIN anche senza ripremere "Ho finito"
     (log `documento_ricaricato_dopo_rifiuto`). `uploadDocument` ora ritorna
     `UploadOutcome` (item + wasRejected + otherRejectedRemaining).
  3. `changeStatus` a PAGATO manuale ora BLOCCATO se `payment_status !== PAID`:
     evitava email "pagamento ricevuto" falsa + alert "link non pagato" perenne.
     Messaggio indirizza a "Registra pagamento offline" o al link di pagamento.
  4. Guardie pratica annullata/rimborsata su `submitDocuments`, `signMandate`,
     `saveIbanAction` (l'upload era gia' protetto; le action erano invocabili
     direttamente).
- Scelte CONFERMATE (non bug): checkout anonimo LEAD+CLIENT (no rumore),
  `setStateTaxes` non cambia owner (Lorenzo continua a lavorare la pratica in
  LAVORAZIONE mentre aspetta l'IBAN), rimborso totale via webhook non manda
  email nostra al cliente (Stripe manda la sua), ANNULLATA senza template email
  (la copre l'email esito recesso).

### Blocco 14 — Sezione "Migliorie sito" nel CRM (FATTO 15/07)
- Nuova voce in sidebar (gruppo "Sito", icona lampadina) -> /crm/migliorie:
  appunti liberi (titolo + testo) dove Mauro/Lorenzo segnano le modifiche da
  fare al sito quando se ne accorgono, per lavorarle in blocco.
- CRUD completo: "Nuovo appunto", modifica in place, eliminazione con conferma
  inline. Griglia di card in stile CRM, data ultima modifica, empty state.
- Tabella `site_notes` (creata in produzione via Management API + migrazione
  `supabase/migrations/20260715120000_site_notes.sql`), RLS attiva senza
  policy (solo service_role). Lib `web/src/lib/site-notes.ts`, action con
  requireAdmin in `web/src/app/crm/migliorie/actions.ts`, UI
  `web/src/components/crm/site-notes.tsx`.

### Blocco 13 — Audit "pratica chiusa" + celebrazione (FATTO 15/07)
- Audit del flusso di chiusura: fattura (auto FattureInCloud e MANUALE con PDF)
  arriva correttamente all'area cliente (/ordine, "Scarica fattura" con URL
  firmato) + email notifyInvoiceReady in entrambi i percorsi; documenti finali
  su /conclusa con download singolo e ZIP; email di chiusura; IBAN cancellato
  alla chiusura (retention). NESSUN buco su fattura/documenti.
- Fix di un buco reale: si poteva chiudere una pratica SENZA documenti finali
  caricati -> l'email diceva "trovi i documenti da scaricare" ma l'area era
  vuota. Ora `changeStatus` -> CHIUSA e' bloccato finche' non c'e' almeno un
  documento finale (messaggio chiaro a Lorenzo).
- Gamification: alla chiusura (scheda pratica o drag kanban, dopo la conferma)
  parte la CELEBRAZIONE: overlay coriandoli + card "Pratica conclusa!" con
  contatore delle chiuse + fanfara di vittoria sintetizzata con Web Audio API
  (nessun file audio; parte su gesto utente quindi niente blocco autoplay).
  Componente `web/src/components/crm/celebration.tsx` + keyframes in
  globals.css; `changeStatus` ritorna `celebrate.closedTotal` quando chiude.

### Blocco 12 — Calendario CRM irrobustito (FATTO 15/07)
- Audit: gli eventi derivati c'erano (apertura, consegna, invio AdE, scadenza
  12 mesi) ma "poche voci" perche' molte pratiche di prova non hanno date e i
  TO-DO CON DATA non finivano sul calendario. Migliorie in `lib/crm.ts` +
  `components/crm/calendar.tsx` + tipi in `content/crm-data.ts`:
  1. Nuovo tipo evento `todo` (ambra): i promemoria con scadenza delle pratiche
     appaiono su calendario (mese+agenda) e in "Scadenze in arrivo" della Home
     (esclusi quelli spuntati; sul calendario i fatti restano al 50% opacita).
  2. Flag `done` sugli eventi: consegna prevista e scadenza 12 mesi diventano
     "assolte" quando la dichiarazione e' INVIATA/CHIUSA -> niente ring
     rosso/ambra ne' badge urgenza su pratiche gia' inviate (prima una pratica
     INVIATA con due_date passata risultava "scaduta").
  3. `dateOnly()` difensivo su tutte le date (accetta solo YYYY-MM-DD valide,
     tronca eventuali orari) cosi un formato sporco non fa sparire l'evento.
- Dati verificati in produzione (query 15/07): 18 pratiche, 8 con apertura,
  5 con consegna, 2 con invio, 8 con data decesso, 12 con to-do. La sensazione
  di "poche voci" viene dalle pratiche di test senza date: la pulizia (Blocco 6)
  la risolvera'. NB: 0006 e 0010 (pagate, COMPLETO) sono senza due_date perche'
  pagate prima dell'auto-SLA: sono test, non backfillate apposta.

### Blocco 11 — Video "Come funziona" (SCRIPT PRONTO 15/07, riprese da fare)
- Script completo + testo voce fuori campo in
  `blueprint/15_Video_Come_Funziona_Script.md`. Video di processo lato cliente
  per la pagina /come-funziona: protagonista donna, mix camera + screen
  recording. Master 16:9 ~1:55 (MAX 2:00), tagli 60-75s e verticale 9:16 30s.
- Flusso mostrato: ricerca sito -> preventivo (VO si sofferma sui 3 esiti:
  prezzo/su misura/esonero gratis) -> pagamento Stripe 490 EUR -> area personale
  (login Google, firma mandato, upload documenti: scansione/foto/modelli, VO si
  sofferma) -> "Ho finito" -> email lavorazione -> pratica inviata/conclusa ->
  download documenti finali -> recensione (breve) -> CTA preventivo.
- Riprese schermo: SOLO pratica di prova con dati fittizi (mai dati reali),
  email di scena da casella pulita, prezzo reale a listino (490 Semplice).
- Integrazione dev quando pronto: video su /come-funziona (sotto hero), MP4
  self-hosted o Vimeo/Mux (NO YouTube), poster + sottotitoli, 2 sorgenti
  16:9/9:16, lazy-load, no autoplay con audio.

### Blocco 10 — Scrollbar kanban sempre visibile (FATTO 15/07, committato)
- Problema: la scrollbar orizzontale della board kanban (/crm/pratiche) e
  quella nativa macOS: sparisce a riposo e, se la board prosegue sotto il bordo
  della finestra, non si vede proprio.
- Fix in `practices-board.tsx`: scrollbar nativa nascosta (`.crm-scroll-hidden`)
  e sostituita da una barra "proxy" STICKY al fondo della finestra, sempre
  visibile, alta 12px con thumb accent (`.crm-scroll-x` in globals.css),
  sincronizzata bidirezionalmente con la board (scrollLeft) + ResizeObserver
  per la larghezza. Nascosta da sola se non c'e overflow.
- `crm/layout.tsx`: `main` da `overflow-x-hidden` a `overflow-x-clip` (stesso
  clipping ma non crea scroll container, altrimenti `sticky bottom-0` non
  aggancia il viewport).

### Blocco 8 — Fix placeholder "entro X giorni lavorativi" (FATTO 15/07 mattina)
- In produzione home e /tariffe mostravano letteralmente "entro X giorni
  lavorativi" (placeholder mai sostituito!). Fixate le entry
  `home.come_funziona_sla_note` ("10-15 giorni lavorativi in base al pacchetto")
  e `tariffe.sla_note` (riformulata senza numero, rimanda ai giorni indicati su
  ogni pacchetto) in content_entries.it.json + seed. SLA reali nel DB packages:
  SEMPLICE 10gg, COMPLETO 15gg, ZERO_STRESS 10gg (Lorenzo deve CONFERMARLI).
  Serve il deploy per vederle online (le entry sono lette dal JSON a build time).

### Blocco 6 — Pulizia pratiche di prova (IN ATTESA CONFERMA MAURO)
- Script `web/scripts/cleanup-test-practices.mjs`: preview di default,
  `--delete` per cancellare (pratiche + file Storage + contatti orfani).
  Tiene `SUC-2026-0022` e qualsiasi pratica con documenti reali su Storage.
- Preview del 15/07: 18 pratiche, 17 da cancellare, da tenere solo la 0022.
  Mauro deve confermare (dubbio: tenere anche SUC-2026-0020 Mauro PAGATO?).

## 1. Progetto e stack
- Monorepo Git. App Next.js (v16, App Router) nella cartella **`web/`** (Root Directory su Vercel = `web`).
- Repo GitHub: **`maurotoncelli/successioni-armellin`**, branch produzione **`main`**.
  Vercel fa **deploy automatico ad ogni push su `main`**.
- DB/Auth/Storage: **Supabase** (project ref `cfhsyrlpbrdofwtljepv`). Pagamenti: **Stripe**.
  Email transazionali: **Resend**. Email umane: **Google Workspace**.
- Contenuti **data-driven**: testi/label in `web/src/content/content_entries.it.json`
  (letti via `web/src/lib/content.ts`: helper `text`, `cta`, `list`, `obj`). Copia "seed"
  in `seed/content_entries.it.json` (tenere allineati i due file).
- Aree dell'app:
  - sito pubblico: `web/src/app/(site)/...`
  - area cliente ("Area personale", NON "Area riservata" lato UI): `web/src/app/area-riservata/...`
  - CRM interno (admin Lorenzo): `web/src/app/crm/...` + login `web/src/app/crm-login/...`

### Comandi utili (cwd: `web/`)
- Dev: `npm run dev`  ·  Build di verifica: `npm run build`  ·  Lint: via ReadLints.
- Deploy: `git push origin main` (Vercel fa il resto). NON committare mai senza richiesta esplicita dell'utente.
- Verifica produzione bypassando la cache DNS locale:
  `curl --resolve www.successioniarmellin.it:443:216.198.79.1 https://www.successioniarmellin.it/...`

## 2. Dominio e DNS (dominio su ARUBA, DNS su CLOUDFLARE dal 13/07)
- Dominio `successioniarmellin.it` registrato su **Aruba** (account Lorenzo `15411133@aruba.it`).
- **Migrazione DNS a Cloudflare FATTA il 13/07** (motivo: Aruba non permette record MX
  su sottodomini, e Resend richiede `MX send` per verificare il dominio):
  - Zona Cloudflare creata (account `studio@successioniarmellin.it`, login Google,
    piano Free). Zone id `e965ef074eb5238124103d8ec383c470`.
  - Record importati da Aruba, poi via API: **proxy arancione disattivato ovunque**
    (Vercel vuole DNS-only), eliminato record spazzatura `localhost`,
    **aggiunto `MX send -> feedback-smtp.eu-west-1.amazonses.com` prio 10** (Resend).
  - **Nameserver cambiati nel pannello Aruba** (Sostituisci Name Server):
    `athena.ns.cloudflare.com` + `santino.ns.cloudflare.com`. Al momento della
    scrittura la delega al registro .it era in propagazione (monitor attivo).
  - Token API Cloudflare "Zone DNS" in `ACCESSI_LOCALE.md` (da revocare a fine lavori).
  - D'ora in poi i record DNS si gestiscono su **dash.cloudflare.com** (o via API),
    NON piu nel pannello Aruba. Aruba resta solo registrar (rinnovo dominio).
- Record attivi (tutti DNS-only, verificati 13/07):
  - `A` `@` -> `216.198.79.1` (apex Vercel) · `CNAME` `www` -> `d35c84c1af317e07.vercel-dns-017.com`
  - `MX` `@` -> `smtp.google.com` prio 1 (Google Workspace)
  - `MX` `send` -> `feedback-smtp.eu-west-1.amazonses.com` prio 10 (Resend)
  - `TXT` `@`: SPF Google + `google-site-verification` · `TXT` `send`: SPF amazonses (Resend)
  - `TXT` `google._domainkey` (DKIM Google) · `TXT` `resend._domainkey` (DKIM Resend)
  - `TXT` `_dmarc`: `v=DMARC1; p=none;`
  - CNAME residui Aruba innocui: `admin`, `ftp`, `_domainconnect`.

## 3. Hosting Vercel (FATTO)
- Progetto collegato al repo, Root Directory `web`, dominio `www` primario + apex con 308 redirect, SSL attivo.
- Canonical: **www.successioniarmellin.it**.
- Environment Variables GIA impostate (Production; i NEXT_PUBLIC anche Preview/Dev):
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `ADMIN_EMAILS` (dal 14/07 sera =`geom.armellin@gmail.com,info@maurotoncelli.it,studio@successioniarmellin.it`,
  Lorenzo PRIMO; prima il primo indirizzo era info@maurotoncelli.it e le notifiche
  recesso arrivavano a Mauro), `FIELD_ENCRYPTION_KEY`,
  `EMAIL_FROM` (=`Successioni Armellin <studio@successioniarmellin.it>`),
  `NEXT_PUBLIC_SITE_URL` (=`https://www.successioniarmellin.it`, SOLO Production).
- **Stripe (aggiornato 14/07)**: chiavi **LIVE** (`STRIPE_SECRET_KEY`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` del webhook LIVE)
  impostate su Vercel Production. **Primo pagamento reale riuscito il 14/07.**
- **Resend (14/07)**: dominio **Verified**, `RESEND_API_KEY` su Vercel (integrazione
  Marketplace), `EMAIL_FROM` corretto, invii verificati. Resend fa anche da SMTP
  per Supabase Auth (magic link/OTP clienti).
- **OpenAI (14/07)**: `OPENAI_API_KEY` impostata su Vercel; estrazione AI provata.
- `web/vercel.json` fissa `regions: ["fra1"]` (funzioni vicine a Supabase eu-central-1).
- I valori segreti reali NON sono in questo file: stanno su Vercel e in `web/.env.local` (git-ignored). Template: `web/.env.example`.

## 4. Setup servizi: TUTTO FATTO al 14/07
I punti 1-4 del vecchio elenco (Google Workspace, Resend, Stripe LIVE, Supabase
redirect URLs) sono COMPLETATI e verificati end-to-end. Restano solo i TODO in
sezione 9. Il punto "primo login ADMIN reale su `/crm-login`" e' IN CORSO:
il 14/07 sera (screenshot ore 20:39) un tentativo di login CRM mostrava
**"Questo account non e autorizzato ad accedere al CRM"** allo step 2FA —
da investigare (vedi TODO #3).

## 5. Sicurezza pre-go-live pubblico (IMPORTANTE)
- **Rigenerare** le chiavi Supabase (anon + service_role + password DB): quelle attuali sono passate in chat, vanno ruotate prima della spinta pubblica/marketing.
- Dopo il primo accesso admin, **svuotare `ADMIN_PASSWORD`** (accesso d'emergenza anti-lockout).
- Verificare region UE + retention backup Supabase.

## 6. Modifiche recenti rilevanti al codice (capirle prima di toccare il funnel)
Commit `caf2a89` - **Funnel preventivo "result-first" (stile Apple)**. Decisione: niente
barriera contatti prima del valore. Flusso attuale:
- `/preventivo` (`web/src/components/site/preventivo-form.tsx`): **3 domande**, esito calcolato
  **lato client** con `web/src/lib/quote.ts` (`computeEsito`/`suggestedPackage`, funzioni PURE).
  Nessuna scrittura DB. Naviga a `/preventivo/grazie?esito=&pkg=&recount=&rel=&heirs=&hasre=&will=&other=`.
- `/preventivo/grazie` (`web/src/app/(site)/preventivo/grazie/page.tsx`): mostra SUBITO il
  risultato. Esito **B** = pacchetto + prezzo (`buildOrder`) + CTA "Procedi al pagamento" ->
  `/checkout?pkg=...`; sotto, opt-in email OPZIONALE (`components/site/soft-lead.tsx`).
  Esito **C** (su misura) ed **A** (esonero) = contatto/WhatsApp, niente prezzo.
- `/checkout` (`web/src/app/(site)/checkout/page.tsx`): accetta `pkg`+`recount`+risposte via URL.
  La **pratica nel CRM si crea SOLO al click di pagamento** (intento reale), via
  `web/src/app/(site)/checkout/actions.ts` (`createCheckoutPractice`, pratica "anonima" senza contatto).
  Il pannello e `web/src/components/site/checkout-panel.tsx`.
- Webhook Stripe (`web/src/app/api/stripe/webhook/route.ts`): su pagamento riuscito fa
  **backfill** di `client_email/name/phone` dai dati Stripe quando la pratica e nata anonima.
- I contatti si chiedono SOLO in 3 punti: pagamento (Stripe), opt-in email, preventivo su misura.
- Tutto degrada con grazia senza DB/Stripe configurati (il pagamento mostra "non ancora attivo").

Commit `caf2a89` (stesso) - **UI**: navbar con `whitespace-nowrap` + breakpoint `xl` (fix wrapping
su Safari), icona account (`UserRound`) al posto del lucchetto per "Area personale",
"Parla con Lorenzo" come pulsante outline a destra accanto al CTA preventivo. Logo brand "A"
in **oro** (`bg-accent`) su navbar/footer/area personale/login (il CRM resta col suo tema gradiente).

## 8-bis. Pipeline dichiarazione: checklist auto + AI + XML .suc (11/07 pomeriggio)
Obiettivo (richiesta Mauro/Lorenzo): pagamento -> cliente carica documenti -> chiamata con
appunti -> AI estrae i dati -> Lorenzo revisiona -> **XML `.suc`** da controllare col modulo
AdE (Desktop Telematico) e inviare via **Entratel** (Lorenzo e intermediario abilitato).
Verificato su fonti AdE: la dichiarazione telematica E' un XML (fornitura **SUC13**, schema
`fornituraSUC13_v1.xsd`); file prodotti da software terzi sono ammessi purche' passino il
**modulo di controllo ufficiale** prima dell'invio.

Implementato (build ok, NON ancora committato ne' testato con documenti reali):
- **Checklist automatica al pagamento**: `web/src/lib/checklist.ts` (`generateChecklist`,
  funzione pura: base + immobili/testamento/minorenni). Agganciata a webhook Stripe e a
  `registerOfflinePayment`. Non sovrascrive mai una checklist esistente. Log `checklist_generata`.
- **Appunti chiamata editabili**: server action `updateCallNotes` + componente
  `CallNotesEditor` (in `components/crm/practice-workflow.tsx`), campo `call_notes` salvato
  per intero (documento vivo, sorgente dell'estrazione AI).
- **Estrazione AI**: `web/src/lib/extraction.ts` - OpenAI **Responses API** (default
  `gpt-5.6-terra`, override `OPENAI_MODEL`), Structured Outputs con schema strict
  (defunto/eredi/testamento/immobili/rapporti bancari/avvertenze). Input: PDF/immagini della
  checklist (fino a 20MB totali) + appunti chiamata + dati pratica. Risultato salvato NO-DDL in
  Storage `practice-docs/<id>/_extraction.json` (pattern `_extras.json`). `isAiConfigured` su
  `OPENAI_API_KEY` (senza chiave il pannello e disattivato, niente crash).
- **Revisione**: pannello "Dichiarazione: dati e XML" nella scheda pratica CRM
  (`components/crm/extraction-panel.tsx`): estrai/ripeti, **modifica campo per campo**
  (eredi/immobili/rapporti con aggiungi/rimuovi riga), salva revisione (`saveExtractionEdits`,
  `reviewedAt`), compilazione anche 100% manuale senza AI.
- **Export XML**: `web/src/lib/suc-xml.ts` (`buildSucXml`) genera la fornitura SUC13.
  **v2 (11/07 sera): struttura RICALCATA su due file `.suc` REALI di Lorenzo**
  (BLDFNC53B45G822G / BTTLMI26E61I232N, prodotti dal suo software AdE): busta
  `tm:Messaggio > tm:Intestazione(CF fornitore) > tm:Contenuto[CodiceFornitura=SUC13] >
  suc:Fornitura > suc:Dichiarazione[identificativo=00001]`; namespace multipli con prefissi
  (`tm`, `suc`, `reg` per le anagrafiche); date `GGMMAAAA`; Frontespizio con
  CodiceFiscaleDefunto/TipoDichiarazione(PrimaDichiarazione+Devoluzione)/Beneficiari/
  DatiDefunto/**Presentatore** (con Telefono/Email)/FirmaModello (caselle dei soli quadri
  presenti)/CasiParticolari/ImpegnoATrasmettere; QuadroEA (Soggetto: TipoSoggetto 1,
  GradoParentela codificato - **02 figlio, 10 fratello/sorella confermati dai file reali**);
  QuadroEB terreni (Superficie are/centiare, Natura, RedditoDominicale) e QuadroEC fabbricati
  (Luogo>Italia con ComuneAmministrativo+CodiceComune, DatiCatastali annidati,
  PossessoNumeratore "1,00"), **DevoluzioneEB/EC/ER per ogni erede** (Rigo/Modulo riferiti al
  QuadroEA, QuotaValore = valore x quota, formato "1234,56"); QuadroER (conti correnti,
  TipoCespite CR) e QuadroEE (riepilogo, solo parte liquida). Sesso ricavato dal CF se manca.
  Server action `exportSucXml` -> download `<CF_DEFUNTO>_SUC13.suc` dal pannello, con
  **warnings** espliciti (VALORI immobili non calcolati - servono coefficienti/agevolazioni -,
  quadri ED/EF/EG/EH non generati, CF mancanti, parentele non mappate).
  Prima dell'invio la bozza va SEMPRE passata dal modulo di controllo AdE.
  **VALIDAZIONE XSD UFFICIALE SUPERATA (11/07 sera)**: il file generato passa
  `xmllint --schema fornituraSUC13_v1.xsd` con il pacchetto specifiche AdE
  aggiornato al 02/07/2025 (scaricato da agenziaentrate.gov.it, copia in
  /tmp/suctest/xsd durante la sessione). Attenzione ai namespace: dentro
  Luogo/DatiCatastali/DatiTerreni-interno/DatiFabbricati-interno/ImpegnoATrasmettere
  gli elementi sono in namespace `reg:`, non `suc:` (fixato in b8530c9).
  Curiosita: il file reale di Lorenzo NON passa lo stesso XSD (Presentatore del
  QuadroEH senza CodiceCarica) - il modulo di controllo e piu permissivo dello schema.
- Estrazione AI estesa: campo `sesso` per persona; per i terreni categoria=natura,
  consistenza=superficie, rendita=reddito dominicale (istruzioni nel prompt).
- Fix bucket Storage: `ensureDocBucket` prima di salvare `_extraction.json` e bucket creato
  SENZA `allowedMimeTypes` (ospita anche i JSON interni, non solo PDF/JPG/PNG).
- Env nuove in `.env.example`: `OPENAI_API_KEY`, `OPENAI_MODEL`, `SUC_CF_FORNITORE`
  (CF Lorenzo `RMLLNZ90E27G843J`, e' anche il CF intermediario nei file reali).
  **DA IMPOSTARE su Vercel** quando si attiva l'AI.
- **v3 (11/07 sera, dopo ok di Mauro)**: aggiunti al generatore
  - **valori immobili calcolati**: fabbricati rendita x1,05 x coefficiente
    (110 prima casa, 120 gruppi A/C, 168 B, 60 A10/D, 40,8 C1/E - VERIFICATO sul
    file reale: A2 rendita 631,37 -> 79553 identico al software AdE); terreni
    RD x1,25 x90 (default non edificabile, TipologiaTerreno 3). Override con campo
    "valore" e spunta "prima casa (si/no)" nel pannello revisione. QuotaValore
    devoluzione = valore x quota (identico al reale).
  - **Quadro EE** completo (TotaleValoreImmobili + altri beni + attivo).
  - **Quadro EG (allegati)**: i documenti della checklist vengono incorporati in
    base64 nell'XML (solo PDF/TIFF, unico formato ammesso dal tracciato; JPG/PNG
    segnalati da convertire). Categorie: Testamento/AlberoGenealogico/
    DocumentiIdentita/Altro (mappate dall'etichetta checklist).
  - **Quadro EH (dich. sostitutive)**: presentatore, defunto con luogo decesso
    (nuovi campi estrazione comune_decesso/provincia_decesso, fallback ultima
    residenza), eredi (max 3 oltre il dichiarante, limite del tracciato), flag
    assenza testamento/interdetti/rinuncia di default (warning per verificare).
  Tutto VALIDA contro fornituraSUC13_v1.xsd ufficiale.
- Quadri non generati automaticamente: ED (passivita), EF (liquidazione imposte),
  EO (titoli/fondi), volture.

## 8-ter. Sessione 14/07 (pomeriggio+sera) — cosa e' stato fatto e FIX importanti

### Go-live tecnico completato
- **Stripe LIVE**: chiavi `sk_live`/`pk_live`/`rk_live` fornite da Lorenzo, impostate su
  Vercel + webhook LIVE creato. Primo pagamento reale 290 EUR riuscito (`SUC-2026-0022`).
- **Resend verificato** (dopo migrazione DNS a Cloudflare del 13/07): invii OK.
  `EMAIL_FROM` corretto su Vercel (era corrotto: "uccessioni" senza S).
  `NEXT_PUBLIC_SITE_URL` aggiunta (Production) per i link CTA nelle email.
- **Login cliente FIXATO** (errore "PKCE code verifier not found in storage"):
  configurate via Supabase Management API (token `sbp_` in ACCESSI_LOCALE) Site URL,
  Redirect URLs, SMTP custom = Resend, template email Magic Link/Confirmation con
  `{{ .TokenHash }}` nel link + codice OTP 6 cifre visibile come fallback.

### BUG FIX critici (da conoscere)
1. **Pratica pagata invisibile nell'area personale** (commit `dc9fe0b`): le pratiche nate
   dal checkout diretto non avevano `contact_id`, e la RLS mostra al cliente solo le
   pratiche col SUO `contact_id` (via `profiles.contact_id`, funzione SQL
   `current_contact_id()`). Ora il **webhook Stripe trova o crea il contatto per email**
   e lo aggancia alla pratica. Inoltre `findContactIdByEmail` (lib/profiles.ts) usava
   `maybeSingle()` che con email duplicate nei contatti restituiva null: ora prende il
   piu' recente per `last_activity`. La `SUC-2026-0022` e' stata riparata a mano
   (contatto `6d119ade-...` + profilo di mauro.toncelli@gmail.com collegati).
2. **Lentezza click area personale** (commit `2c65866`): creato `web/vercel.json` con
   `regions: ["fra1"]` + `loading.tsx` (skeleton) in `area-riservata/(app)/`.
   Verificato: `x-vercel-id` ora `fra1::fra1`, risposte ~200-350ms.

### Preventivo: logica 290/490 rifinita (commit precedenti al 14/07 sera)
- `coniuge` aggiunto ai parenti in linea retta; senza immobili l'esito B suggerisce
  SEMPLICE (290); nuova domanda condizionale `over100k` (attivo > 100k EUR) quando
  linea retta + niente immobili: se >100k -> SEMPLICE, altrimenti esito A (esonero).
- Link cliccabili su "Condizioni di vendita"/"informativa privacy" nei consensi
  (`components/site/legal-links-text.tsx`).

### Area personale: funzionalita' aggiunte
- **Multi-file per voce checklist** (fino a 10): fronte/retro, una foto per pagina.
  All'export SUC le immagini della stessa voce vengono UNITE in un unico PDF/A-1b
  (sRGB ICC + XMP). Compressione immagini server-side con `sharp` all'upload.
- **Telefono modificabile** nel profilo cliente (server action `updatePhone`,
  normalizzazione E.164 in `lib/phone.ts`).
- **Template scaricabili sotto le voci della checklist** (commit `41a8133`):
  `web/src/lib/doc-templates.ts` abbina per etichetta (regex) i PDF in
  `web/public/templates/` (generati da `web/scripts/generate-doc-templates.mjs` +
  modello ufficiale AdE scaricato). Testo invito: scarica, compila, firma, ricarica.
  **RICHIESTA UTENTE IN CORSO (non ancora fatta)**: rinominare i modelli — vedi TODO.

### Recesso self-service (gia' esistente, verificato oggi)
- Cliente: `/area-riservata/recesso` -> `submitWithdrawal` salva in
  `practice-docs/<id>/_extras.json` (NO-DDL), aggiunge log `recesso_richiesto` +
  comunicazione, invia **email a Lorenzo** (`notifyAdminWithdrawalRequest`, primo
  indirizzo di `ADMIN_EMAILS`).
- CRM: pannello `WithdrawalPanel` in cima alla scheda pratica (bordo rosso) con
  Prendi in gestione / Accetta / Respingi + nota; esito notificato via email al cliente.
- **GAP UX noto**: la richiesta si vede SOLO aprendo la scheda pratica; nessun alert
  in dashboard CRM (`deriveAlerts` non guarda il recesso) — vedi TODO.

### Debug CRM (11/07 sera) - esito
- Tutte le pagine CRM rispondono 200 in locale (build di produzione) con gate emergenza:
  dashboard, pratiche, dettaglio (per fixtures E pratiche reali), contatti, calendario,
  statistiche, listino, cerca, nuova pratica, brogliaccio. Non esiste `/crm/impostazioni`.
- Supabase: lettura/scrittura `practices` OK (service role). Il bucket `practice-docs`
  NON esisteva ancora: si crea al primo upload (`ensureDocBucket`), fix sopra.
- Stripe TEST: `POST /api/checkout` con pratica esistente restituisce URL
  `checkout.stripe.com` valido. Webhook produzione risponde 400 senza firma (corretto).
- Produzione (www.successioniarmellin.it): tutte le pagine 200; `/crm` senza cookie
  redirige a `/crm-login` (gate attivo, nessun dato esposto).
- Pratica test `SUC-2026-0020` (pagata prima della feature checklist): checklist
  retro-compilata a mano via API (8 voci) per farla testare a Mauro/Lorenzo.

## 7. Decisioni e convenzioni da rispettare
- "Area Riservata" -> lato UTENTE si chiama sempre **"Area personale"** (vedi @DECISIONI).
- Etichetta data-driven: `settings.area_label`.
- Funnel result-first: confermato da Mauro; **da validare con Lorenzo** (scelta di marketing).
- Testi legali (privacy/termini/cookie/garanzia): pubblicati come versione interinale, **da far validare a un legale/DPO**; definire condizioni di garanzia e retention lead non convertiti.
- Pagamenti: **solo carte** (Stripe).
- Dati studio confermati (footer/legale): P.IVA `02432220503`, C.F. `RMLLNZ90E27G843J`,
  Albo Geometri Pisa n. 1969 (dal 21/01/2022), PEC `lorenzo.armellin@geopec.it`,
  tel/WhatsApp `+39 320 1570567`. REA non applicabile.

## 9. TODO APERTI (in ordine di urgenza, stato 14/07 sera)

### Richieste utente IN CORSO (interrotte dal cambio chat — FARE SUBITO)
1. **Rinominare i modelli/template della checklist** — FATTO 14/07 tarda sera
   (commit `281c634`): nuovo PDF unico "Dichiarazione sostitutiva di certificato
   di morte e stato di famiglia del defunto" (include lo stato di famiglia del
   defunto) e "Autocertificazione stato di famiglia di ciascun erede" (un modello
   per erede, con caselle accettazione/rinuncia). Aggiornati script, regex
   (compatibili con le etichette VECCHIE delle checklist esistenti), label/help
   in `checklist.ts`. Vecchi PDF eliminati da `public/templates/`.
   Nello stesso commit: **FIX telefoni** — tutte le CTA "Parla con Lorenzo"/
   "Chiama" del sito puntavano al placeholder `tel:+39` (non funzionante!),
   ora `tel:+393201570567` ovunque (content entries + seed + fallback);
   **lista documenti data-driven** (`documenti.lista`, usata da
   /preventivo/grazie "Intanto ecco cosa ti servira" e /documenti-successione)
   coi nomi allineati ai nuovi modelli.
2. **Recesso visibile a Lorenzo nel CRM** — FATTO 14/07 sera (commit `a682b83` +
   `bb8cad3`): (a) email di notifica a TUTTI i destinatari (nuova env
   `ADMIN_NOTIFY_EMAILS` su Vercel = solo `geom.armellin@gmail.com`; fallback
   `ADMIN_EMAILS`; Mauro NON riceve piu le notifiche sulla sua email di lavoro);
   (b) la richiesta porta `action_owner` ad ADMIN ("Tocca a te" invece di
   "In attesa del cliente"), l'esito lo ripristina da `ownerByStatus`;
   (c) alert ROSSO "RICHIESTA DI RECESSO da gestire" in dashboard CRM
   (`hasPendingWithdrawal` in `web/src/lib/crm.ts`, derivato dal log della riga:
   pendente se ultimo evento recesso e richiesta/presa in gestione).
   Fix bonus: mailto nel form recesso era `studio@armellin.it` ->
   `studio@successioniarmellin.it`. Sulla `SUC-2026-0022` c'e' una richiesta
   REQUESTED di test (l'alert deve comparire).
3. **Login CRM "account non autorizzato"** (screenshot 20:39): l'errore esce allo step
   2FA di `/crm-login`. `ADMIN_EMAILS` su Vercel (aggiornata 14/07 sera) =
   `geom.armellin@gmail.com,info@maurotoncelli.it,studio@successioniarmellin.it`.
   NOTA: `mauro.toncelli@gmail.com` NON e' in allowlist (e' l'account CLIENTE di
   test): se il login CRM era con quella email, l'errore e' CORRETTO. Altrimenti
   controllare tabella `profiles` e logica `ensureProfile`/`requireAdmin`.

### Fatti il 14/07 tarda sera (commit `b7193a1`)
- **Calcolatore valore catastale pubblico** `/strumenti/valore-catastale`
  (SEO, testi data-driven collection `strumenti`): logica estratta in
  `web/src/lib/catasto.ts` (condivisa col generatore SUC13, valori identici
  al software AdE). Link: banner in `/guide` (`guide.strumenti_banner`) +
  footer (`footer.strumenti_link`). sitemap.ts/robots.ts aggiunti nella
  sessione di debugging (vedi sotto).
- **Email lead REALI** (prima non partiva nulla, ne a Lorenzo ne al visitatore,
  ma la cronologia CRM le registrava come inviate!): `createLead` ora invia
  (a) riepilogo al visitatore — pacchetto+prezzo con link checkout per esito B,
  nota esonero per esito A, conferma presa in carico per su misura — e
  (b) `notifyAdminNewLead` agli admin (ADMIN_NOTIFY_EMAILS). Comunicazioni in
  cronologia SOLO se l'invio riesce.
- **Alert "nuovo lead"** in dashboard CRM (kind `lead` in deriveAlerts): tutte
  le pratiche in stato LEAD attive generano l'alert.
- **Footnote pre-invio** nel form preventivo su misura ("ti ricontattiamo noi
  entro un giorno lavorativo"), entry `grazie.soft_custom_footnote` +
  `soft_custom_desc` aggiornata.
- **Fix continuita sessione area personale**: la pagina `/area-riservata`
  mostrava SEMPRE il form di login anche con sessione valida (il link "Area
  personale" di navbar/footer sembrava sloggare l'utente). Ora se c'e sessione
  redirige a `/area-riservata/dashboard` (getSessionUser nella pagina login).

### Sessione di debugging 14/07 notte (caccia ai bug sistematica)
Giro completo di review (agente esploratore + fix). Corretti:
- **SEO**: `metadataBase` in `app/layout.tsx` puntava ancora a
  `successioni.example.it` (OG/canonical rotti da sempre!) -> ora
  `NEXT_PUBLIC_SITE_URL` con fallback al dominio reale. AGGIUNTI `app/robots.ts`
  (blocca /crm, /area-riservata, /api, /brogliaccio, /checkout) e `app/sitemap.ts`
  (pagine pubbliche + guide). Prima non esistevano.
- **Quiz preventivo**: allo step 3 si poteva vedere il risultato SENZA rispondere
  a testamento/altri beni/soglia 100k -> esonero (esito A) suggerito a torto.
  Ora `stepValid` richiede tutte le risposte; inoltre `computeEsito` e' prudente:
  esonero SOLO con "no" esplicito alla soglia 100k ("non lo so" -> Semplice).
- **Calcolatore catastale**: input "631.37" (punto decimale) veniva letto come
  63137 (x100!) -> parser ora gestisce entrambi i formati; evento analytics
  spostato dal corpo render a `useEffect` (doppio invio in strict mode).
- **Aggancio pratica pagata <-> profilo cliente** (`lib/profiles.ts`): se il
  profilo era nato dal login telefono e agganciato a un contatto con email
  diversa da quella del pagamento Stripe, la pratica pagata restava invisibile
  (RLS). Ora `ensureProfile` ri-aggancia il contatto per email verificata.
- **Webhook Stripe**: errore di creazione contatto ora loggato + evento
  `contatto_non_agganciato` nel log pratica (prima silenzioso: pratica PAGATA
  senza contact_id = area cliente vuota senza traccia).
- **Alert CRM piu' puliti** (`deriveAlerts`): le pratiche LEAD "anonime" dei
  checkout abbandonati (nessun nome/email/telefono) non generano piu' alert
  "nuovo lead" ne "pagamento non pagato".
- **Recesso**: guardie server-side in `submitWithdrawal` (niente richieste su
  pratiche CHIUSE/ANNULLATE, niente doppie richieste pendenti).
- **Email**: URL sempre assoluti (`siteBase()` con fallback dominio produzione,
  anche per il link checkout nel riepilogo lead); escape HTML dei testi liberi
  (motivo recesso, nomi, note) nei template.
- **SoftLead onesto**: se l'email di riepilogo NON parte, il messaggio di
  successo non dice piu' "controlla la casella email" (nuove entry
  `grazie.soft_email_ok_title_noemail` / `_body_noemail`; `createLead` ritorna
  `emailSent`).
- **CTA "Lascia una recensione"** (area conclusa) aveva `href="#"`: ora e' data
  driven (`settings.review_url`, entry NON pubblicata) e la CTA resta nascosta
  finche' Lorenzo non fornisce il link (es. profilo Google).
Non toccati (scelte deliberate): `action_owner: CLIENT` sulle pratiche checkout
(coerente con "in attesa del pagamento"); entry content con href `#` non
renderizzate in UI; blocco `#guida` su /tariffe non renderizzato.

### Con Lorenzo (prossimo incontro)
- Test XML reale col modulo di controllo AdE (Desktop Telematico) su una pratica vera.
- Garanzia "Soddisfatti o Rimborsati": condizioni ancora "da definire" su `/garanzia`.
- DPA OpenAI da accettare nel pannello OpenAI (GDPR art. 28).
- WhatsApp Cloud API (notifiche): serve Meta Business verificato di Lorenzo + costi.
- Twilio per OTP SMS (login cliente senza email): account con carta di Lorenzo.

### Pulizie tecniche (Mauro/agente)
- Bonificare i **3 contatti duplicati** mauro.toncelli@gmail.com (lead di test) e
  archiviare le pratiche di test (`SUC-2026-0016/18/19/20/22`); l'intestatario della
  0022 e' "lorenzo armellin" (nome digitato nel checkout di test).
- **Rigenerare le chiavi Supabase** (anon/service_role passate in chat) e **revocare
  i token** Cloudflare (`cfut_`) e Supabase Management (`sbp_`) in ACCESSI_LOCALE.
- **Rimuovere `ADMIN_PASSWORD`** da Vercel dopo il primo login admin riuscito con 2FA.
- Preferenze notifiche profilo: `notify_email` collegato (18/07) **solo** alla
  mail soft GMB; WhatsApp resta cosmetico finché non c’è canale ops.
- VirusTotal API sugli upload: miglioria post-lancio (runbook).

## 10. Note operative
- Se l'utente "non vede" le modifiche in produzione: e cache (DNS locale TTL ~1h o browser). Hard refresh / incognito / rete mobile. I resolver pubblici sono gia aggiornati.
- Non creare file/documentazione non richiesti. Non committare senza richiesta esplicita.
- Il transcript completo delle sessioni precedenti e nella cartella agent-transcripts (citare le chat passate con i link [titolo](uuid)).
