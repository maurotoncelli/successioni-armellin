# RUNBOOK Go-Live - Successioni Armellin

> Procedura operativa per rendere il sito tecnicamente operativo. Spunta le voci man mano.
> Stato: in corso · Avvio: 2026-06-29
> Riferimenti: @SPEC_Env_Vars, @PROSSIMO_INCONTRO_LORENZO, @07_Stack, @10_Legale.

## Decisioni (riunione 2026-06-29)
- Dominio: **successioniarmellin.it**
- Registrar + DNS: **Aruba** (gestione DNS direttamente nel pannello Aruba; Cloudflare accantonato perche non registra i `.it` e a noi serve comunque "DNS only" senza proxy). Nameserver: **default Aruba** (technorail/arubadns).
- Email: **Google Workspace Business Starter** (~6 EUR/mese) sul dominio (scelta 11/07: su Aruba la casella base non e inclusa e M365/PEC non convengono), casella principale `studio@successioniarmellin.it` (+ alias `privacy@` per GDPR). La posta transazionale resta separata su Resend.
- Pagamenti: **solo carte** (Stripe)
- Dominio principale (canonical): **www.successioniarmellin.it** (apex `successioniarmellin.it` -> 308 redirect a www). `NEXT_PUBLIC_SITE_URL=https://www.successioniarmellin.it`.
- Account: Aruba dominio = account Lorenzo `15411133@aruba.it` · Cloudflare = account Gmail Lorenzo · Google Workspace: contatto/recupero `viavittorioveneto1@gmail.com`, admin `studio@successioniarmellin.it`.

### Valori DNS reali da inserire nel pannello Aruba (da Vercel, 2026-06-29)
- `A` `@` -> **216.198.79.1**  [Vercel nuovo IP apex; sostituisce il 62.149.128.40 di Aruba]
- `CNAME` `www` -> **d35c84c1af317e07.vercel-dns-017.com**  [sostituisce il CNAME www->apex di Aruba]
- Nota Vercel: i vecchi valori (`76.76.21.21` / `cname.vercel-dns.com`) funzionano ancora, ma usare i NUOVI qui sopra.
- Email: sostituire l'MX Aruba con **MX `@` -> smtp.google.com priorita 1** (Google Workspace). Aggiungere il TXT di verifica Google + (dopo) SPF/DKIM/DMARC e i record Resend.
- Ordine: dominio -> email/Resend -> Stripe -> accessi -> sicurezza/deploy

Legenda: [ ] da fare · (chi). Valori segreti -> solo in Vercel / `.env.local`.

---

## STATO AVANZAMENTO (aggiornato 11/07 15:30)

### Fatto l'11/07 tardo pomeriggio - CHECK LEGALE/GDPR (deploy `3d95b5f`)
Verifica completa di privacy, cookie, condizioni di vendita, recesso e consensi.
**Risultato: impianto conforme**, 3 lacune trovate e CORRETTE (gia online):
1. **Privacy aggiornata al trattamento AI**: aggiunti OpenAI e Google Workspace alla
   tabella responsabili (sez. 7) e riscritta la sez. 12 (estrazione dati dai documenti
   via API OpenAI, no training sui dati, validazione umana finale).
2. **Cookie policy allineata alla realta**: rimossi i riferimenti a iubenda (non usata);
   ora descrive il banner proprio del sito + GA4 Consent Mode v2 (default negato).
3. **Link "Preferenze cookie" nel footer** (sezione Legale): riapre il banner per
   modificare/revocare il consenso (prima mancava: GDPR art. 7.3).
Verificato OK: recesso conforme artt. 52-59 Cod. Consumo (doppia checkbox al checkout,
art. 59 avvio immediato), consensi privacy/marketing separati nei form (marketing
salvato su DB), footer con P.IVA/C.F./Albo/PEC/ODR, foro consumatore.

**APERTO lato legale (prossima sessione / con Lorenzo):**
- [ ] **Garanzia Soddisfatti o Rimborsati**: casi coperti, importi e tempi ancora
      "da definire" nella pagina /garanzia -> decisione di Lorenzo, poi aggiornare testo.
- [ ] **Retention lead non convertiti**: privacy dice "in fase di definizione".
      Proposta: 12 mesi poi cancellazione/anonimizzazione -> conferma di Lorenzo.
- [ ] **Validazione legale**: tutti i documenti hanno l'avviso "testo preliminare in
      validazione" -> serve passaggio da avvocato/consulente privacy per toglierlo.
- [ ] **DPA OpenAI**: quando si crea l'account OpenAI con Lorenzo, accettare il Data
      Processing Addendum dal pannello (formalizza il ruolo ex art. 28 GDPR).

### Fatto l'11/07 pomeriggio (sessione Mauro + agente)
- **Gmail ATTIVO**: MX propagati e confermati su Google admin. **SPF Google** aggiunto su
  Aruba (TXT `@`: `v=spf1 include:_spf.google.com ~all` - correzione: prima versione aveva
  un tab iniziale che lo invalidava). **DKIM Google** (`google._domainkey`) aggiunto su Aruba
  e propagato: su Google admin resta da premere "Avvia autenticazione" se non gia fatto.
- **CRM accessibile**: su Vercel impostate `ADMIN_PASSWORD` (accesso emergenza
  `/crm-login`, valore in ACCESSI_LOCALE.md) e `ADMIN_EMAILS`
  (info@maurotoncelli.it, studio@, geom.armellin@gmail.com) + `SUC_CF_FORNITORE`.
  Vercel CLI autenticata sul Mac di Mauro: l'agente puo gestire le env da terminale.
- **Generatore XML SUC13 completato e validato** contro XSD ufficiale AdE (vedi
  HANDOFF_AGENTE 8-bis): valori immobili calcolati (identici al software AdE sul caso
  reale), allegati EG in base64, quadro EH, riepilogo EE. Deploy in produzione.
- **Debug CRM completo**: tutte le pagine OK, Supabase read/write OK, checkout Stripe
  test OK, gate produzione OK. Checklist retro-compilata su `SUC-2026-0020`.
- **Decisione**: OTP SMS a consumo (Twilio) approvato da Mauro -> da attivare con la
  carta di Lorenzo al prossimo incontro.

### DA FARE - checklist aggiornata (11/07 sera)
**Con Lorenzo (prossimo incontro):**
- [ ] **OpenAI**: creare account/API key (carta Lorenzo) -> darla all'agente che imposta
      `OPENAI_API_KEY` su Vercel (attiva l'estrazione AI nel CRM).
- [ ] **Twilio** (OTP SMS area clienti): account con carta Lorenzo -> configurare in
      Supabase (Auth > Providers > Phone). Nel frattempo il login email basta.
- [ ] **Stripe LIVE**: webhook nell'account live + sostituire chiavi TEST con LIVE su
      Vercel + redeploy + pagamento di prova vero (rimborsabile).
- [ ] **Test XML reale**: Lorenzo scarica l'XML di una pratica dal CRM e lo passa nel
      modulo di controllo del Desktop Telematico -> feedback per rifiniture.
      In particolare verificare gli ALLEGATI (Quadro EG): oggi i PDF caricati dai
      clienti sono inclusi cosi come sono -> capire se il controllo AdE pretende
      **PDF/A** (in tal caso serve conversione automatica in export).
- [x] **Conversione JPG/PNG -> PDF all'export XML**: FATTO 13/07 (deploy). Le foto
      dei clienti vengono convertite AL VOLO in **PDF/A-1b** (`lib/image-to-pdf.ts`,
      pdf-lib + OutputIntent sRGB + XMP pdfaid, richiesto dalle specifiche AdE:
      "PDF/A-1a o PDF/A-1b oppure TIF/TIFF, max 5 MB per allegato") durante
      `exportSucXml`, incluse nel Quadro EG; limite 5 MB verificato all'export.
      Gli originali in storage restano intatti. Controprova consigliata: servizio
      "Validare e convertire file" nell'area riservata Entratel.
- [x] **Area cliente - multi-file per voce checklist**: FATTO 13/07. Fino a 3 file
      per documento (es. fronte/retro CI); CRM scarica i singoli file; estrazione
      AI ed export XML iterano su tutti. Retro-compatibile (filePath legacy).
- [x] **Compressione foto lato server**: FATTO 13/07. JPG/PNG ricompressi al
      caricamento (max 2000px, JPEG q82, EXIF applicato): foto 8-12 MB -> ~1 MB,
      cosi i PDF/A restano sotto i 5 MB AdE.
- [x] **Mandato professionale riscritto** (13/07): testo unico in
      `content/mandato.ts` (prima duplicato pagina+download con refusi), 7 clausole
      coerenti con le Condizioni di vendita (oggetto, corrispettivo/imposte,
      obblighi cliente, diligenza, recesso, privacy, firma a distanza), dati studio
      dalla fonte unica. DA VALIDARE con l'avvocato insieme agli altri testi legali.
- [ ] Password diverse per Google/Stripe/Resend (ora condividono FORZApisa90!).
**Mauro da solo:**
- [ ] **Resend**: attendere "Verified" (in pending: manca l'MX su `send`, Aruba non lo
      supporta; se non verifica entro 72h -> migrare DNS a Cloudflare). Poi API key ->
      all'agente per `RESEND_API_KEY` su Vercel + SMTP custom in Supabase
      (smtp.resend.com:465, user `resend`, pass = API key).
- [ ] **Supabase Redirect URLs**: Auth > URL Configuration -> aggiungere
      `https://www.successioniarmellin.it/**`, `https://successioniarmellin.it/**`,
      `http://localhost:3000/**` (serve al magic link dell'area clienti).
- [ ] **Google**: test invio/ricezione da studio@, alias `privacy@`, decidere se
      `lorenzo@` resta casella (2ª licenza a pagamento) o diventa alias gratuito.
- [ ] **CRM**: primo accesso definitivo (email+password+2FA) -> poi svuotare
      `ADMIN_PASSWORD` su Vercel.
- [ ] **Pulizia**: archiviare pratica test `SUC-2026-0020`; rigenerare chiavi Supabase.

---

## STATO AVANZAMENTO (aggiornato 11/07 12:10)

### Fatto l'11/07 (sessione con Geom. Armellin)
- **Email — Google Workspace Business Starter**: account `studio@successioniarmellin.it` creato/attivato (prova 14gg, carta inserita). Creato anche l'utente `lorenzo@successioniarmellin.it` (2ª licenza → DA DECIDERE: tenerla come casella vera o trasformarla in alias gratuito). **Dominio verificato** su Google (TXT `google-site-verification` su Aruba). **MX** su Aruba sostituiti: `@ -> smtp.google.com` prio 1 (verificato alla fonte). MANCANO: attendere propagazione MX sui resolver pubblici + premere **"Conferma"** su Google per attivare Gmail; poi test invio/ricezione + alias `privacy@`.
- **Stripe**: account creato (sandbox/test, login `geom.armellin@gmail.com`). Webhook creato in sandbox (`checkout.session.completed` + `charge.refunded` -> `https://www.successioniarmellin.it/api/stripe/webhook`). 3 variabili su Vercel (Production+Preview) + redeploy. **Account LIVE attivato** con dati fiscali di Lorenzo. **SMOKE TEST SUPERATO** end-to-end: pratica `SUC-2026-0020` -> **PAGATO/PAID 490€** (webhook OK). DA FARE prima del lancio: creare webhook anche nell'account **Live** e sostituire su Vercel le chiavi TEST con le **LIVE** (pk_live/sk_live/whsec live) + redeploy.
- **Supabase**: il progetto era **in PAUSA** (piano free, ~11gg inattività) -> **ripristinato** (account **Mauro via GitHub `info@maurotoncelli.it`**). Ora raggiungibile (verificato). È stata la causa del "fetch failed" iniziale al checkout.
- **Resend**: account creato (`geom.armellin@gmail.com`), dominio `successioniarmellin.it` (regione **UE/eu-west-1**). Su Aruba inseriti e propagati i **3 TXT**: DKIM (`resend._domainkey`), SPF (`send`), DMARC (`_dmarc`). **MX su `send` NON inseribile su Aruba** (Aruba non supporta MX sui sotto-nomi). Verifica Resend **"in checking"**. Se Resend NON verifica senza l'MX -> spostare la gestione DNS su **Cloudflare** (gratis) e aggiungere lì l'MX `send -> feedback-smtp.eu-west-1.amazonses.com` prio 10.

### Da fare (prossima sessione)
- **Resend**: attendere "Verified"; se serve l'MX -> Cloudflare DNS. Poi `RESEND_API_KEY` + `EMAIL_FROM="Successioni Armellin <studio@successioniarmellin.it>"` su Vercel + test (cambio stato pratica -> email al cliente).
- **Google**: confermare MX su Google (attiva Gmail), test posta, alias `privacy@`, decidere utente `lorenzo@`.
- **Stripe LIVE**: webhook nell'account Live + chiavi LIVE su Vercel (sostituiscono le TEST) + redeploy + test.
- **CRM**: primo login ADMIN reale + 2FA (verificare che il pannello pratiche di Lorenzo veda `SUC-2026-0020`), test login cliente.
- **Pulizia**: rimuovere/archiviare la pratica di test `SUC-2026-0020`.
- **Sicurezza**: rigenerare chiavi Supabase; svuotare `ADMIN_PASSWORD` dopo l'accesso reale; usare password DIVERSE per ogni servizio (ora Google/Stripe/Resend condividono `FORZApisa90!`).

### Fatto (30/06)
- **Dominio + DNS su Aruba**: NS default Aruba; `A @ -> 216.198.79.1`, `CNAME www -> d35c84c1af317e07.vercel-dns-017.com`. Propagati sui resolver pubblici (verificato via dig).
- **Vercel**: Root Directory `web`, domini `www` (primario) + apex (308 a www) "Valid", certificato SSL attivo. Sito reale online su `https://www.successioniarmellin.it`.
- **Environment Variables su Vercel**: Supabase (URL/anon/service), `NEXT_PUBLIC_SITE_URL` (Production), `ADMIN_EMAILS`, `FIELD_ENCRYPTION_KEY`, `EMAIL_FROM`.
- **Deploy versione aggiornata** (push `main` commit `43add67`): Area personale, pagine legali, footer con dati legali (P.IVA/C.F./Albo/PEC), contatti reali, login CRM `/crm-login`. Tutte le rotte chiave -> 200.

### Da fare (in attesa, alcune richiedono Lorenzo)
- **Email Google Workspace** (Lorenzo+Mauro): verifica dominio (TXT su Aruba) -> caselle `studio@`/`privacy@` -> MX `smtp.google.com` prio 1 su Aruba.
- **Resend** (dopo email): account + record DNS su Aruba -> `RESEND_API_KEY` su Vercel.
- **Stripe** (Lorenzo): account + chiavi + webhook su Vercel.
- **Supabase**: Redirect URL `https://successioniarmellin.it/**` (+ www). Poi rigenerare chiavi (sicurezza, sono passate in chat) e svuotare `ADMIN_PASSWORD` dopo 1o accesso.
- **Test**: primo login ADMIN reale + 2FA; login CLIENTE.

### Decisioni aperte
- **Logica funnel preventivo** (vedi discussione 30/06): valutare se mostrare il pacchetto PRIMA di chiedere i dati (lead capture "soft" sulla schermata risultato) invece di chiedere i dati nello step 4 prima del risultato. Trade-off lead vs frizione: da confermare con Lorenzo (scelta di marketing).

---

## 1) Dominio (registrazione + DNS su Aruba)
> Scelta finale: DNS gestito direttamente su Aruba (Cloudflare accantonato). NS = default Aruba.
- [x] Registrare **successioniarmellin.it** su **Aruba** (account Lorenzo `15411133@aruba.it`). FATTO 30/06.
- [x] Dominio attivo su nameserver Aruba (verificato via dig: technorail/arubadns). FATTO 30/06.
- [ ] Gestione record nel pannello **Aruba > Gestione DNS** (vedi step 2-4). (Mauro)

## 2) Hosting Vercel + dominio
- [x] Vercel > Project > Settings: **Root Directory = `web`**. FATTO 30/06.
- [x] Vercel > Settings > Domains: `www.successioniarmellin.it` (primario) + apex con 308 redirect. "Valid Configuration". FATTO 30/06.
- [x] Nel pannello **Aruba** modificati i record (verificato via dig 30/06, gia propagato):
  - **Modifica** `A` `@`: da `62.149.128.40` a `216.198.79.1` FATTO
  - **Modifica** `CNAME` `www`: da `successioniarmellin.it` a `d35c84c1af317e07.vercel-dns-017.com` FATTO
- [x] Impostate su Vercel le **Environment Variables** [GO-LIVE] disponibili: Supabase (URL/anon/service), `NEXT_PUBLIC_SITE_URL` (solo Production), `ADMIN_EMAILS`, `FIELD_ENCRYPTION_KEY`, `EMAIL_FROM`. FATTO 30/06. (Mancano: Stripe, Resend.)
- [x] Certificato SSL attivo; `https://www.successioniarmellin.it` serve il sito reale (apex -> 308 a www). Verificato 30/06. (Nota: la cache DNS locale di vecchi resolver puo mostrare la vecchia pagina Aruba fino a ~1h.)
- [x] Deploy della versione aggiornata (push `main` -> commit `43add67`): Area personale, pagine legali, footer legale, /crm-login. FATTO 30/06.

## 3) Email reale sul dominio (Google Workspace Business Starter)
> Scelta 11/07: Google Workspace Business Starter (~6 EUR/mese). Account admin gia creato: `studio@successioniarmellin.it` (recovery `viavittorioveneto1@gmail.com`). In fase di attivazione scegliere il piano **Business Starter**, NON Standard.
- [ ] Completare l'attivazione (prova 14gg, richiede carta ma nessun addebito per 14gg). (Lorenzo+Mauro)
- [ ] Verificare il dominio: Google fornisce un record **TXT** `google-site-verification=...` -> inserirlo su **Aruba > DNS > record TXT @**. (Mauro)
- [ ] Su **Aruba > record MX**: sostituire gli MX Aruba con quello di Google -> `MX @ -> smtp.google.com` priorita `1`. (Mauro)
- [ ] Creare alias `privacy@successioniarmellin.it` (per richieste GDPR). (Lorenzo+Mauro)
- [ ] Verificare invio/ricezione di prova. (Mauro)
- [ ] SPF: al punto 4 (Resend) fare UN solo record `TXT @` con entrambi gli include, es. `v=spf1 include:_spf.google.com include:(Resend) ~all`. (Mauro)
- Nota: separare la posta "umana" (Google Workspace) dall'invio transazionale (Resend, punto 4).

## 4) Email transazionali (Resend)
- [ ] Creare account **Resend** e aggiungere il dominio (consigliato sottodominio invio `send.successioniarmellin.it`). (Lorenzo+Mauro)
- [ ] Inserire su **Aruba** i record forniti da Resend: **TXT SPF**, **CNAME/TXT DKIM**, return-path. (Mauro)
- [ ] Attendere "Verified" su Resend. (Mauro)
- [ ] Impostare `RESEND_API_KEY` e `EMAIL_FROM="Successioni Armellin <studio@successioniarmellin.it>"` su Vercel/.env. (Mauro)
- [ ] Configurare DMARC progressivo: `TXT _dmarc` `v=DMARC1; p=none; rua=mailto:studio@successioniarmellin.it` (poi quarantine/reject). (Mauro)
- [ ] Test: cambio stato pratica nel CRM -> il cliente riceve l'email. (Mauro)

## 5) Stripe (solo carte)
- [ ] Creare account **Stripe** intestato allo studio (dati fiscali + IBAN payout). (Lorenzo)
- [ ] Copiare chiavi TEST: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. (Lorenzo->Mauro)
- [ ] Creare webhook -> `https://successioniarmellin.it/api/stripe/webhook` (evento `checkout.session.completed`, opz. `charge.refunded`); copiare `STRIPE_WEBHOOK_SECRET`. (Mauro)
- [ ] Smoke test con carta `4242 4242 4242 4242` -> pratica a PAGATO nel CRM. (Mauro)
- [ ] Passare alle chiavi **LIVE** dopo il test. (Lorenzo+Mauro)

## 6) Accessi
- [ ] Supabase > Authentication > URL Configuration > Redirect URLs: `http://localhost:3000/**` e `https://successioniarmellin.it/**`. (Mauro)
- [ ] (Opz.) Template email magic link / OTP con `{{ .Token }}`. (Mauro)
- [ ] Primo login ADMIN reale su `/crm-login` (email+password -> QR 2FA su Authenticator). (Lorenzo e Mauro)
- [ ] Test login CLIENTE con un'email presente nei contatti. (Mauro)

## 7) Sicurezza pre-go-live
- [ ] **Rigenerare** chiavi Supabase (anon + service_role + password DB) - le attuali sono passate in chat. (Mauro)
- [ ] Generare `FIELD_ENCRYPTION_KEY` (`openssl rand -base64 32`). (Mauro)
- [ ] **Svuotare `ADMIN_PASSWORD`** dopo aver verificato l'accesso reale + 2FA. (Mauro)
- [ ] Verificare region UE + retention backup Supabase. (Mauro)

---

## Riepilogo record DNS (Aruba) - da compilare con i valori reali
| Tipo | Nome | Valore | Scopo | Proxy |
|---|---|---|---|---|
| A | @ | 216.198.79.1 | sito (apex -> 308 a www) | DNS only |
| CNAME | www | d35c84c1af317e07.vercel-dns-017.com | sito (canonical) | DNS only |
| MX | @ | smtp.google.com (priorita 1) | posta in arrivo (Google Workspace) | DNS only |
| TXT | @ | v=spf1 include:_spf.google.com include:(SPF Resend) ~all | SPF unico Google+Resend | - |
| TXT/CNAME | (DKIM Resend) | (da Resend) | firma email | DNS only |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:studio@successioniarmellin.it | policy anti-spoof | - |
