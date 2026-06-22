# SPEC - Coding Standards (Single Source of Truth)

> Regole per ottenere codice pulito, uniforme e manutenibile. L'AI deve seguirle in ogni generazione.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-18
> Riferimenti: @07_Stack, @11_Sicurezza, tutte le SPEC.

## Linguaggio e qualita
- TypeScript strict (no any impliciti). ESLint + Prettier.
- Tipi derivati dagli schemi Zod (z.infer) per coerenza runtime/compile-time.
- Niente commenti che narrano l'ovvio; commentare solo intenti/vincoli non evidenti.

## Struttura cartelle (proposta)
```
/app            # rotte Next.js (App Router)
/components      # UI riutilizzabile (PascalCase)
/lib            # util, client supabase, helpers
/db             # schema, migrazioni, policy RLS
/server         # server actions, accesso dati, integrazioni
/jobs           # definizioni Inngest/Trigger.dev
/emails         # template React Email
/schemas        # schemi Zod condivisi
/types          # tipi condivisi
```

## Accesso dati (RLS-first)
- Lettura/scrittura via supabase-js rispettando la RLS (@11).
- service_role SOLO in /server per webhook/job; mai nel client.
- Nessuna query che aggira la RLS senza motivazione documentata.

## Validazione e contratti
- Ogni input validato con Zod lato server (@SPEC_API_Contracts).
- Schemi Zod condivisi tra form (client) e API (server).

## Pattern applicativi
- Mutazioni: server actions; lettura dati: server components dove possibile.
- Stato pratica: usare l'enum di @SPEC_Data_Model; transizioni solo quelle consentite (@05).
- Nomi (tabelle, rotte, eventi, job): usare ESCLUSIVAMENTE @SPEC_Naming_Conventions.
- UI: token da @SPEC_Design_Tokens; componenti shadcn/ui.

## Sicurezza (sempre)
- Verifica firma + idempotenza webhook (@11).
- Rate limit + Turnstile sugli endpoint sensibili.
- Signed URL a scadenza per i file; bucket privati.
- Nessun segreto/PII nei log; segreti solo da env (@SPEC_Env_Vars).

## Accessibilita
- HTML semantico, label dei form, focus visibili, contrasto WCAG 2.2 AA (@03).

## Errori
- Formato uniforme { error: { code, message } }; logging strutturato verso Sentry (@12).

## Testing
- Vitest (unit) + Playwright (E2E flussi critici).
- Test RLS cross-tenant obbligatori (@11).

## Git
- Commit piccoli e descrittivi; branch per feature; PR con checklist QA (@13).
