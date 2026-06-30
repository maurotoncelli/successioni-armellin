# HANDOFF per il prossimo agente

> Documento di passaggio di consegne. Aggiornato: 2026-06-30.
> Scopo: permettere a un nuovo agente (senza contesto) di riprendere il lavoro.
> Riferimenti chiave: @RUNBOOK_GoLive (procedura go-live, stato dettagliato),
> @SPEC_Env_Vars, @DOMANDE_PER_LORENZO, @PROSSIMO_INCONTRO_LORENZO, @07_Stack.

## 0. TL;DR
Il sito e **online in produzione** su `https://www.successioniarmellin.it` (Vercel + HTTPS).
Mancano per la piena operativita: **email Google**, **Resend** (email transazionali) e
**Stripe** (pagamenti). Queste 3 richiedono il Geom. Lorenzo Armellin presente.
Lingua del progetto: **italiano**. Scrivere sempre in italiano con l'utente.

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

## 2. Dominio e DNS (gestiti su ARUBA)
- Dominio `successioniarmellin.it` registrato su **Aruba** (account Lorenzo `15411133@aruba.it`).
- **Nameserver = default Aruba** (technorail/arubadns). **Cloudflare e stato accantonato**
  (non registra i `.it` e non serve, vogliamo "DNS only"). Gestire i record nel pannello Aruba.
- Record gia impostati (FATTI, propagati):
  - `A` `@` -> `216.198.79.1` (apex Vercel)
  - `CNAME` `www` -> `d35c84c1af317e07.vercel-dns-017.com`
- Record di default Aruba ancora presenti (innocui): `A localhost`, vari `A mx`, `CNAME _domainconnect`, `CNAME admin`, `CNAME ftp`.
- **DA FARE** (email): sostituire l'MX Aruba (tab "Record MX" > SOSTITUISCI RECORD) con quello Google.

## 3. Hosting Vercel (FATTO)
- Progetto collegato al repo, Root Directory `web`, dominio `www` primario + apex con 308 redirect, SSL attivo.
- Canonical: **www.successioniarmellin.it**.
- Environment Variables GIA impostate (Production; i NEXT_PUBLIC anche Preview/Dev):
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `ADMIN_EMAILS` (=`geom.armellin@gmail.com,mauro.toncelli@gmail.com`), `FIELD_ENCRYPTION_KEY`,
  `EMAIL_FROM` (=`Successioni Armellin <studio@successioniarmellin.it>`),
  `NEXT_PUBLIC_SITE_URL` (=`https://www.successioniarmellin.it`, SOLO Production).
- **DA IMPOSTARE**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
- I valori segreti reali NON sono in questo file: stanno su Vercel e in `web/.env.local` (git-ignored). Template: `web/.env.example`.

## 4. Cosa manca per l'operativita (richiede Lorenzo)
Procedura dettagliata passo-passo in **@RUNBOOK_GoLive** (punti 3-7). In sintesi:
1. **Email Google Workspace** (`studio@successioniarmellin.it`, trial 14gg, recovery `viavittorioveneto1@gmail.com`):
   verificare il dominio (TXT su Aruba) -> aggiungere MX `smtp.google.com` prio 1 su Aruba -> creare alias `privacy@`.
2. **Resend**: creare account, verificare dominio (record DNS su Aruba: SPF/DKIM/return-path), impostare `RESEND_API_KEY` su Vercel.
3. **Stripe**: account intestato allo studio, chiavi TEST -> poi LIVE, webhook su `https://www.successioniarmellin.it/api/stripe/webhook` (evento `checkout.session.completed`, opz. `charge.refunded`), `STRIPE_WEBHOOK_SECRET`.
4. **Supabase**: Authentication > Redirect URLs aggiungere `https://successioniarmellin.it/**` e `https://www.successioniarmellin.it/**` (+ `http://localhost:3000/**`).
5. **Primo login ADMIN** reale su `/crm-login` (email in `ADMIN_EMAILS` + password -> setup 2FA TOTP), poi test login CLIENTE (area personale).

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

## 7. Decisioni e convenzioni da rispettare
- "Area Riservata" -> lato UTENTE si chiama sempre **"Area personale"** (vedi @DECISIONI).
- Etichetta data-driven: `settings.area_label`.
- Funnel result-first: confermato da Mauro; **da validare con Lorenzo** (scelta di marketing).
- Testi legali (privacy/termini/cookie/garanzia): pubblicati come versione interinale, **da far validare a un legale/DPO**; definire condizioni di garanzia e retention lead non convertiti.
- Pagamenti: **solo carte** (Stripe).
- Dati studio confermati (footer/legale): P.IVA `02432220503`, C.F. `RMLLNZ90E27G843J`,
  Albo Geometri Pisa n. 1969 (dal 21/01/2022), PEC `lorenzo.armellin@geopec.it`,
  tel/WhatsApp `+39 320 1570567`. REA non applicabile.

## 8. Note operative
- Se l'utente "non vede" le modifiche in produzione: e cache (DNS locale TTL ~1h o browser). Hard refresh / incognito / rete mobile. I resolver pubblici sono gia aggiornati.
- Non creare file/documentazione non richiesti. Non committare senza richiesta esplicita.
- Il transcript completo della sessione precedente e disponibile nella cartella agent-transcripts (citare le chat passate con i link [titolo](uuid)).
