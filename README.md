# Successioni Online — Geom. Lorenzo Armellin

Progetto del sito pubblico + (in futuro) area riservata e CRM per le pratiche di
successione dello Studio Geom. Lorenzo Armellin (Pontedera, PI).

## Struttura del repository

- `web/` — applicazione **Next.js** (App Router, TypeScript, Tailwind). È qui che vive il codice.
- `blueprint/` — "Bibbia" di progetto: specifiche, architettura, contenuti, decisioni.
- `seed/` — dati iniziali dei contenuti (es. `content_entries.it.json`).
- `bozze_legali/` — bozze dei testi legali (privacy, T&C, recesso).

## Deploy (Vercel)

Hosting su **Vercel**. Importante: nelle impostazioni del progetto la
**Root Directory** deve essere impostata su `web` (il codice non è nella radice del repo).

Ogni `git push` sul branch `main` attiva un deploy automatico.

## Sviluppo locale

```bash
cd web
npm install
npm run dev
```
