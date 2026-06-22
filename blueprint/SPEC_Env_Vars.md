# SPEC - Environment Variables (Single Source of Truth)

> Registro delle variabili d'ambiente per servizio. Chiavi distinte per ambiente (dev/staging/prod). Segreti solo server (@11).
> Stato: In revisione · Ultimo aggiornamento: 2026-06-18
> Riferimenti: @07_Stack, @11_Sicurezza, @12_Operations.

## Regole
- `NEXT_PUBLIC_` SOLO per valori esponibili al browser.
- Nessun segreto committato nel repo; gestione via env del provider (Vercel) e .env locale ignorato.

## Supabase
- NEXT_PUBLIC_SUPABASE_URL (public)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (public)
- SUPABASE_SERVICE_ROLE_KEY (server, segreto)

## Stripe
- STRIPE_SECRET_KEY (server)
- STRIPE_WEBHOOK_SECRET (server)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (public)

## Email / WhatsApp
- RESEND_API_KEY (server)
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
- NEXT_PUBLIC_GA4_MEASUREMENT_ID (public)
- NEXT_PUBLIC_GTM_ID (public)
- GA4_API_SECRET (server, Measurement Protocol)
- CMP keys (a seconda del provider)

## Fatturazione
- FATTURE_API_KEY (server) - provider da confermare (FattureInCloud/Aruba)

## Cifratura applicativa
- FIELD_ENCRYPTION_KEY (server) - per cifrare campi sensibili (es. IBAN, @11)
