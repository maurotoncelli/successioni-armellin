# RUNBOOK Go-Live - Successioni Armellin

> Procedura operativa per rendere il sito tecnicamente operativo. Spunta le voci man mano.
> Stato: in corso · Avvio: 2026-06-29
> Riferimenti: @SPEC_Env_Vars, @PROSSIMO_INCONTRO_LORENZO, @07_Stack, @10_Legale.

## Decisioni (riunione 2026-06-29)
- Dominio: **successioniarmellin.it**
- Registrar + DNS: **Aruba** (gestione DNS direttamente nel pannello Aruba; Cloudflare accantonato perche non registra i `.it` e a noi serve comunque "DNS only" senza proxy). Nameserver: **default Aruba** (technorail/arubadns).
- Email: **Google Workspace** sul dominio, casella principale `studio@successioniarmellin.it` (+ `privacy@` per GDPR)
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

## STATO AVANZAMENTO (aggiornato 30/06 12:30)

### Fatto
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

## 3) Email reale sul dominio (Google Workspace)
- [ ] Attivare **Google Workspace** (Business Starter) sul dominio `successioniarmellin.it`. (Lorenzo+Mauro)
- [ ] Verificare il dominio (record TXT di verifica fornito da Google). (Mauro)
- [ ] Creare le caselle: `studio@` (pubblica) e `privacy@` (richieste GDPR). (Lorenzo+Mauro)
- [ ] Su **Aruba > Record MX > SOSTITUISCI RECORD**: sostituire l'MX Aruba con quello di Google (setup semplificato): `MX @ -> smtp.google.com` priorita `1`. (Mauro)
- [ ] (Consigliato) SPF di Google: `TXT @ -> v=spf1 include:_spf.google.com ~all` (coordinare con SPF Resend al punto 4: un solo record TXT SPF con piu `include`). (Mauro)
- Nota: separare la posta "umana" (caselle Google) dall'invio transazionale (Resend, punto 4).

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
