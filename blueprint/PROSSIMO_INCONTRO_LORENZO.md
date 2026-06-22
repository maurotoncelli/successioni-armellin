# Prossimo incontro con Lorenzo - cose da finalizzare

> Checklist operativa delle cose che richiedono Lorenzo (o vanno fatte insieme di persona / con i suoi account).
> Stato: aperto · Ultimo aggiornamento: 2026-06-22
> Riferimenti: @GESTIONE_PROGETTO (diario/roadmap), @SPEC_Env_Vars, @13_Stima_Costi, @DOMANDE_PER_LORENZO.

Legenda: [ ] da fare · [x] fatto · (chi) responsabile.

---

## 1) Dominio
- [ ] Decidere e **registrare il dominio**. Candidato: `successioniarmellin.it` (verificare disponibilita; valutare anche `.com` e l'eventuale variante senza "successioni"). (Lorenzo + Mauro)
- [ ] Scegliere il registrar (es. Aruba/Namecheap/Cloudflare) e chi intesta/paga. (Lorenzo)
- [ ] Decidere le **email** sul dominio (es. `info@successioniarmellin.it`, `studio@...`): casella reale o solo alias/inoltro? (Lorenzo)
- Note: il dominio sblocca le email "brandizzate" e l'invio affidabile dei magic link/notifiche (vedi punto 4). Finche non c'e, si usano le gmail (punto 3).

## 2) Stripe (pagamenti) - codice GIA pronto, manca l'account
- [ ] **Creare l'account Stripe** (intestato allo studio/Lorenzo): dati anagrafici/fiscali, IBAN per i payout, attivazione account. (Lorenzo)
- [ ] Recuperare le chiavi **test** e poi **live**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. (Lorenzo -> Mauro)
- [ ] Configurare il **webhook** verso `/api/stripe/webhook` (eventi `checkout.session.completed`, opz. `charge.refunded`) e copiare `STRIPE_WEBHOOK_SECRET`. (Mauro)
- [ ] **Smoke test** end-to-end con carta di test `4242 4242 4242 4242` -> pratica a PAGATO nel CRM. (Mauro)
- [ ] Decidere metodi di pagamento da attivare (carte; BNPL/Klarna; eventuale bonifico). (Lorenzo)
- Riferimento tecnico: chiavi in `web/.env.local` / Vercel (@SPEC_Env_Vars, sezione Stripe).

## 3) Accesso ADMIN al CRM + 2FA (codice GIA pronto)
- Piano email admin (`ADMIN_EMAILS`):
  - oggi: `geom.armellin@gmail.com` (Lorenzo, **da confermare**) e `mauro.toncelli@gmail.com` (Mauro).
  - domani: `info@successioniarmellin.it` quando il dominio e attivo (punto 1).
- [ ] Confermare l'email gmail di Lorenzo (sul web risulta `geom.armellin@gmail.com`). (Lorenzo)
- [ ] Impostare `ADMIN_EMAILS` con le due gmail in `.env.local` / Vercel. (Mauro)
- [ ] Primo accesso reale: `/crm-login` -> "Primo accesso admin" -> email + password -> **scansionare il QR del 2FA** con Google/Microsoft Authenticator -> inserire il codice. (Lorenzo e Mauro, ciascuno per il proprio account)
- [ ] Verificato l'accesso reale, **svuotare `ADMIN_PASSWORD`** (resta solo come emergenza). (Mauro)
- Nota: il passaggio del QR/2FA va fatto fisicamente sul telefono di chi accede: non e automatizzabile (e il senso del secondo fattore).

## 4) Accesso CLIENTE (area riservata) - codice GIA pronto
- [ ] Su **Supabase Dashboard > Authentication > URL Configuration** aggiungere i **Redirect URLs** (es. `http://localhost:3000/**` e, a dominio pronto, `https://<dominio>/**`). (Mauro)
- [ ] (Opzionale) Personalizzare il **template email** del magic link e, per l'OTP a 6 cifre, includere `{{ .Token }}`. (Mauro)
- [ ] Test login cliente: accedere con un'email presente tra i `contacts` e verificare che si vedano SOLO le proprie pratiche. (Mauro)

## 4-bis) Email transazionali (Resend) - codice GIA pronto
- [ ] Creare account **Resend** e **verificare il dominio** (record SPF/DKIM nel DNS): serve il dominio (punto 1). (Lorenzo + Mauro)
- [ ] Impostare in `.env.local` / Vercel: `RESEND_API_KEY` e `EMAIL_FROM` (es. `Successioni Armellin <info@successioniarmellin.it>`). (Mauro)
- [ ] Test: cambiare stato a una pratica dal CRM e verificare che il cliente riceva l'email (e che compaia in cronologia come comunicazione AUTO). (Mauro)
- Note: finche `RESEND_API_KEY` e vuota, gli invii sono **saltati** senza errori (l'app funziona lo stesso). Le notifiche oggi coperte: pagato/attesa documenti/in lavorazione/inviata/conclusa e documento rifiutato.

## 5) Sicurezza / pre-go-live
- [ ] **Rigenerare le chiavi Supabase** (anon + service_role + password DB) prima del go-live: le attuali sono state condivise in chat durante lo sviluppo. (Mauro)
- [ ] Confermare la **region UE** e i backup (gia UE; verificare retention). (Mauro)

## 6) Contenuti e decisioni di prodotto (da chiudere con Lorenzo)
- [ ] Rispondere alle **domande aperte** in `@DOMANDE_PER_LORENZO` (prezzi/SLA pacchetti definitivi, testi, FAQ, foto). (Lorenzo)
- [ ] Prezzi ancora da confermare: Adeguamento/ricalcolo IMU (proposto 90 EUR), Zero Stress (790?) e confine immobili Completo/Zero Stress; Cassa Geometri (CIPAG) nel forfettario. (Lorenzo + commercialista)
- [ ] Dati anagrafici/professionali: data iscrizione Albo, recapiti ufficiali, PEC. (Lorenzo)

## 7) Validazione prototipo (gate Fasi 1-2)
- [ ] Rivedere insieme **sito** e **CRM** (layout, flusso, copy, colonne/azioni/viste) e raccogliere le correzioni. (Lorenzo)
- [ ] Provare l'**area riservata cliente** e l'esperienza di pagamento (quando Stripe e attivo). (Lorenzo)

---

## Ordine consigliato (dipendenze)
1. Dominio (sblocca email brandizzate e magic link affidabili).
2. Stripe (account -> chiavi -> webhook -> test).
3. Attivazione accessi: ADMIN (2FA) e CLIENTE (redirect URL + email).
4. Rigenerazione chiavi + go-live.

> Cosa e gia pronto lato codice e NON richiede l'incontro: checkout Stripe + webhook, auth cliente (passwordless) + RLS per-cliente, auth admin (email+password + 2FA), upload/validazione documenti, workflow pratica (cambio stato/note/comunicazioni), mandato + IBAN cifrato, automazioni email (Resend). Mancano solo gli account/chiavi/dominio e i passaggi fisici (2FA, console Supabase, DNS Resend).
