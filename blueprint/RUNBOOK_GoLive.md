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

## 1) Dominio (registrazione + DNS su Aruba)
> Scelta finale: DNS gestito direttamente su Aruba (Cloudflare accantonato). NS = default Aruba.
- [x] Registrare **successioniarmellin.it** su **Aruba** (account Lorenzo `15411133@aruba.it`). FATTO 30/06.
- [x] Dominio attivo su nameserver Aruba (verificato via dig: technorail/arubadns). FATTO 30/06.
- [ ] Gestione record nel pannello **Aruba > Gestione DNS** (vedi step 2-4). (Mauro)

## 2) Hosting Vercel + dominio
- [ ] Vercel > Project > Settings: **Root Directory = `web`** (gia previsto). (Mauro)
- [ ] Vercel > Settings > Domains: aggiungere `successioniarmellin.it` e `www` (con redirect a apex). (Mauro)
- [x] Nel pannello **Aruba** modificati i record (verificato via dig 30/06, gia propagato):
  - **Modifica** `A` `@`: da `62.149.128.40` a `216.198.79.1` FATTO
  - **Modifica** `CNAME` `www`: da `successioniarmellin.it` a `d35c84c1af317e07.vercel-dns-017.com` FATTO
- [ ] Impostare su Vercel le **Environment Variables** (vedi `web/.env.example`), in particolare `NEXT_PUBLIC_SITE_URL=https://www.successioniarmellin.it`. (Mauro)
- [ ] Attendere certificato SSL e verificare che `https://successioniarmellin.it` apra il sito. (Mauro)

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
