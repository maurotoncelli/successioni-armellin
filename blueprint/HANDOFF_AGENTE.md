# HANDOFF per il prossimo agente

> Documento di passaggio di consegne. Aggiornato: 2026-07-11.
> Scopo: permettere a un nuovo agente (senza contesto) di riprendere il lavoro.
> Riferimenti chiave: @RUNBOOK_GoLive (procedura go-live, STATO DETTAGLIATO 11/07),
> @SPEC_Env_Vars, @DOMANDE_PER_LORENZO, @PROSSIMO_INCONTRO_LORENZO, @07_Stack.
> Credenziali/dati sensibili (Google/Stripe/Resend/Supabase + dati fiscali Lorenzo):
> nel file **`ACCESSI_LOCALE.md`** in root (git-ignored, NON committato). Non è nel repo.

## 0. TL;DR (stato 11/07)
Il sito e **online in produzione** su `https://www.successioniarmellin.it` (Vercel + HTTPS).
Sessione 11/07 con Geom. Armellin — progressi:
- **Stripe**: collegato e **smoke test SUPERATO** (pratica `SUC-2026-0020` -> PAGATO 490€ end-to-end, in modalità TEST). Account LIVE già attivato; resta lo **switch alle chiavi LIVE + webhook Live** su Vercel prima del lancio.
- **Supabase**: era **in pausa** (causa "fetch failed" al checkout) -> **ripristinato** (account Mauro via GitHub `info@maurotoncelli.it`).
- **Email Google Workspace Business Starter**: attivato, dominio verificato, **MX Google impostati su Aruba** (in propagazione); resta il "Conferma" su Google + alias `privacy@`.
- **Resend**: dominio aggiunto, **3 TXT (DKIM/SPF/DMARC) propagati** su Aruba; **MX `send` NON inseribile su Aruba** -> se Resend non verifica, spostare DNS su **Cloudflare** (gratis). Verifica "in checking".
- **Pipeline dichiarazione (nuova, 11/07 pomeriggio)**: costruita la filiera CRM
  "pagamento -> checklist auto -> documenti -> appunti chiamata -> estrazione AI -> revisione -> XML `.suc`".
  Vedi sezione 8-bis qui sotto. NON ancora committata al momento della scrittura.
- **Check legale/GDPR (11/07 tardo pomeriggio, deploy `3d95b5f`)**: impianto conforme;
  corretti e deployati: privacy aggiornata al trattamento AI (OpenAI/Google Workspace
  tra i responsabili, sez. 12 riscritta), cookie policy allineata al banner reale
  (niente iubenda), link "Preferenze cookie" nel footer per revocare il consenso.
  APERTO: condizioni garanzia "da definire", retention lead (proposta 12 mesi),
  validazione da un legale, DPA OpenAI. Dettagli in @RUNBOOK_GoLive.
Dettaglio completo e TODO in **@RUNBOOK_GoLive** (sezione "STATO AVANZAMENTO 11/07").
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
- **Stripe (11/07)**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` IMPOSTATE su Vercel (Production+Preview) con chiavi **TEST/sandbox** + redeploy fatto. DA FARE prima del lancio: **sostituire con le chiavi LIVE** (+ webhook nell'account Live).
- **DA IMPOSTARE ancora**: `RESEND_API_KEY` (dopo verifica dominio Resend) + `EMAIL_FROM` è già presente.
- I valori segreti reali NON sono in questo file: stanno su Vercel e in `web/.env.local` (git-ignored). Template: `web/.env.example`.

## 4. Cosa manca per l'operativita (richiede Lorenzo)
Procedura dettagliata passo-passo in **@RUNBOOK_GoLive** (punti 3-7). In sintesi:
1. **Email Google Workspace Business Starter** (scelta 11/07, ~6 EUR/mese; su Aruba la casella base
   non e inclusa): account `studio@successioniarmellin.it` (recovery `viavittorioveneto1@gmail.com`).
   Attivare scegliendo il piano **Starter** (non Standard) -> verificare dominio (TXT su Aruba) ->
   MX `smtp.google.com` prio 1 su Aruba -> creare alias `privacy@`.
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

## 8. Note operative
- Se l'utente "non vede" le modifiche in produzione: e cache (DNS locale TTL ~1h o browser). Hard refresh / incognito / rete mobile. I resolver pubblici sono gia aggiornati.
- Non creare file/documentazione non richiesti. Non committare senza richiesta esplicita.
- Il transcript completo della sessione precedente e disponibile nella cartella agent-transcripts (citare le chat passate con i link [titolo](uuid)).
