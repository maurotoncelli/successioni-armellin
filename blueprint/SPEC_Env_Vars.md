# SPEC - Environment Variables (Single Source of Truth)

> Registro delle variabili d'ambiente per servizio. Chiavi distinte per ambiente (dev/staging/prod). Segreti solo server (@11).
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22
> Riferimenti: @07_Stack, @11_Sicurezza, @12_Operations.

## Regole
- `NEXT_PUBLIC_` SOLO per valori esponibili al browser.
- Nessun segreto committato nel repo; gestione via env del provider (Vercel) e .env locale ignorato.

## In uso oggi (2026-06-22)
Variabili effettivamente lette dal codice in questa fase (template in `web/.env.example`, valori reali in `web/.env.local` git-ignored):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (lettura pubblica CMS + sessione Auth area riservata), `SUPABASE_SERVICE_ROLE_KEY` (CRM read/write + provisioning profili lato server).
- `ADMIN_PASSWORD` (gate provvisorio del CRM; se vuoto il gate e disattivato in demo).
- `ADMIN_EMAILS` (email, separate da virgola, che al primo login ottengono ruolo ADMIN nel profilo) — IN USO.
- `NEXT_PUBLIC_SITE_URL` (fallback per il redirect del Magic Link se manca l'header origin) — IN USO.
> SICUREZZA: le chiavi Supabase attuali sono state condivise in chat in fase di sviluppo. **Vanno rigenerate** (anon + service_role + password DB) prima del go-live e impostate solo su Vercel/`.env.local`. L'auth **admin reale** (email+password + 2FA TOTP) e ora attiva: `ADMIN_PASSWORD` resta solo come **accesso d'emergenza** (anti-lockout) e va svuotato dopo aver confermato l'accesso reale, @11.

## Supabase
- NEXT_PUBLIC_SUPABASE_URL (public) — IN USO
- NEXT_PUBLIC_SUPABASE_ANON_KEY (public) — IN USO (anche per i cookie di sessione Auth via @supabase/ssr)
- SUPABASE_SERVICE_ROLE_KEY (server, segreto) — IN USO

## Auth (Supabase Auth) - area cliente + admin CRM
- ADMIN_EMAILS (server) — IN USO; allowlist email autorizzate come **ADMIN** del CRM (ruolo ADMIN nel profilo + bootstrap del primo account). Se vuota e ADMIN_PASSWORD vuota, il CRM resta APERTO (demo).
- NEXT_PUBLIC_SITE_URL (public) — IN USO; base URL per il redirect del Magic Link cliente.
- Admin login: **email + password** (1o fattore) + **TOTP** (2o fattore, obbligatorio). Il client usa **Magic Link/OTP** passwordless.
- Config Dashboard (NON sono env): Authentication > URL Configuration: aggiungere i Redirect URLs (es. `http://localhost:3000/**` e il dominio prod). Per l'OTP a 6 cifre cliente, il template email deve includere `{{ .Token }}`.

## Accesso d'emergenza CRM (stopgap anti-lockout)
- ADMIN_PASSWORD (server, segreto) — IN USO come **emergenza**: con essa si entra al CRM via /crm-login se l'account admin reale non e ancora pronto. Da svuotare una volta confermato l'accesso reale + 2FA (@07/@11).

## Stripe
- STRIPE_SECRET_KEY (server) — LETTA DAL CODICE (checkout/webhook). Se assente, i pagamenti sono disattivati con fallback (nessun crash).
- STRIPE_WEBHOOK_SECRET (server) — LETTA DAL CODICE (verifica firma webhook). In locale via `stripe listen`; in prod dal webhook del Dashboard.
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (public) — prevista; con Stripe Checkout hosted non e strettamente necessaria lato client (lo sarebbe col Payment Element).

## Email / WhatsApp
- RESEND_API_KEY (server) — LETTA DAL CODICE (notifiche transazionali via API Resend). Se assente, gli invii sono saltati con fallback (nessun crash); l'app continua a registrare la comunicazione solo se l'email parte davvero.
- EMAIL_FROM (server) — LETTA DAL CODICE; mittente delle email (richiede dominio verificato su Resend, es. `Successioni Armellin <info@successioniarmellin.it>`). Default provvisorio se assente.
- WHATSAPP_TOKEN (server)
- WHATSAPP_PHONE_NUMBER_ID (server)

## Job queue
- INNGEST_EVENT_KEY (server)
- INNGEST_SIGNING_KEY (server)

## Monitoring / sicurezza
- SENTRY_DSN (server/public a seconda)
- UPSTASH_REDIS_REST_URL (server)
- UPSTASH_REDIS_REST_TOKEN (server)
- TURNSTILE_SECRET_KEY (server)
- NEXT_PUBLIC_TURNSTILE_SITE_KEY (public)

## Analytics / consensi
- NEXT_PUBLIC_GA4_MEASUREMENT_ID (public) — LETTA DAL CODICE; se assente GA4 e disattivato (no-op). Con Consent Mode v2 (default negato) + banner consensi. Eventi: generate_lead, begin_checkout, purchase.
- NEXT_PUBLIC_GTM_ID (public) — opzionale (alternativa/aggiunta a GA4 diretto).
- GA4_API_SECRET (server, Measurement Protocol) — futuro: invio `purchase` server-side dal webhook Stripe (piu affidabile).
- CMP: banner consensi minimale gia implementato (localStorage + Consent Mode). Per un CMP certificato (IAB TCF) valutare provider esterno se richiesto.

## Fatturazione (Opzione L)
- FATTUREINCLOUD_ACCESS_TOKEN (server) — LETTA DAL CODICE; token OAuth/API del provider FattureInCloud (API v2). Se assente, la fatturazione automatica e disattivata (fallback graceful): nel CRM resta la **registrazione manuale** (numero + PDF dal gestionale).
- FATTUREINCLOUD_COMPANY_ID (server) — LETTA DAL CODICE; id azienda su FattureInCloud.
- FATTUREINCLOUD_VAT_ID (server) — LETTA DAL CODICE (opzionale); id del tipo IVA "regime forfettario" del proprio account (si legge dai tipi IVA del gestionale). Se vuoto si usa IVA 0% generica.
- INVOICE_FORFETTARIO_NOTE (server) — LETTA DAL CODICE (opzionale); dicitura di legge del forfettario stampata in fattura (default sensato incluso).
- INVOICE_AUTO_ON_PAYMENT (server) — LETTA DAL CODICE; se "1" emette la fattura **automaticamente** al pagamento (webhook Stripe). Lasciare vuoto per emissione manuale dal CRM (consigliato finche non testata dal vivo con le credenziali reali).
- NB: provider scelto = **FattureInCloud** (miglior API REST pubblica, supporta forfettario). Aruba resta possibile come adapter futuro: la logica e isolata in `lib/invoice.ts`. La verita fiscale resta nel gestionale; il CRM/area cliente ne tengono una copia consultabile/scaricabile.

## Cifratura applicativa
- FIELD_ENCRYPTION_KEY (server) - per cifrare campi sensibili (es. IBAN, @11)
