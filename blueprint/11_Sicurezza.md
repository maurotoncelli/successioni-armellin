# 11. Sicurezza

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-11
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @06_Area_Riservata, @07_Stack, @10_Legale_Compliance, @12_Operations
- Owner:

## Sintesi
Misure di sicurezza per proteggere dati ad alta sensibilita (identita, IBAN, dati patrimoniali) e garantire l'isolamento tra clienti. Pilastri: RLS come backbone, storage privato con signed URL, hardening di accesso, verifica dei pagamenti, gestione segreti, backup testati e sincronizzazione sicura verso il NAS.

---

## Stato attuale del progetto

### Threat model (minacce principali)
- Fuga di dati tra clienti (IDOR / RLS errata).
- Account takeover (OTP/Magic Link deboli o brute force).
- Abuso upload (file malevoli, oversize, spam).
- Frode sui pagamenti / webhook falsificati.
- Furto segreti / chiavi esposte lato client.
- Ransomware o accesso non autorizzato al NAS (cold storage).
- Manomissione del prezzo al checkout (client che invia un importo arbitrario).
- Abuso degli endpoint di sistema (es. revalidation) o defacing dei contenuti via CMS.
- Stored XSS tramite contenuti editabili (FAQ/testi) o nomi file.

### Autenticazione e autorizzazione
- Supabase Auth passwordless: OTP/Magic Link con scadenza breve, limite tentativi e rate limit (anti brute force).
- Ruoli: ADMIN (Lorenzo) e CLIENT; principio del minimo privilegio.
- 2FA obbligatoria sull'account ADMIN via **TOTP (app authenticator) + recovery codes** (no SMS); **alert su nuovo dispositivo/accesso anomalo** al posto dell'IP allowlist rigida (evita lockout per accesso mobile/fuori studio).
- Sessioni JWT con scadenza; logout/revoca.

### RLS (backbone di sicurezza dati)
- Policy RLS su tutte le tabelle: il CLIENT vede solo le proprie pratiche/documenti; l'ADMIN ha accesso completo.
- Copertura delle tabelle aggiunte: `document_requirements` (CLIENT solo voci applicabili della propria pratica, niente approva/rifiuta), `communications`/`tasks` (ADMIN only), `withdrawal_requests` (CLIENT crea/legge solo le proprie, esito ADMIN), contenuti CMS (lettura pubblica solo del pubblicato).
- service_role usata SOLO lato server (mai esposta al client); le query lato browser passano dalla RLS.
- Test automatici delle policy (un cliente non deve mai leggere dati di un altro).

### Sicurezza storage documenti
- Bucket privati; nessun link pubblico permanente.
- Accesso ai file solo via signed URL a scadenza breve.
- Validazione tipo/peso file lato client e server.
- **Scansione malware (ClamAV in UE)** avviata dal job di upload: il file caricato resta in stato "in scansione/quarantena" e diventa scaricabile/lavorabile solo dopo esito pulito; un file infetto viene bloccato e segnalato. Nessun file inviato a terzi che condividono i campioni (GDPR).

### Estrazione documenti OCR/AI (fast-follow V1.1)
- Il documento viene inviato ai servizi OCR/AI **solo dopo** esito "pulito" dello scan malware (mai un file in quarantena).
- Fornitori **in regione UE** con **DPA** e **no-training/no-retention** dei dati lato provider (Document AI/Azure + LLM UE, @07); minimizzazione dei dati inviati al necessario.
- Output (`document_extractions`) accessibile solo ad ADMIN/SYSTEM (RLS); valori sensibili (IBAN) con cifratura applicativa e cancellazione dopo l'uso.
- E un **ausilio assistito**: nessuna decisione automatizzata con effetti legali (decide Lorenzo). Retention dell'estratto allineata al documento sorgente (@SPEC_Data_Model/@10).
- Trattamento incluso nella **DPIA** (@10).

### Validazione input e anti-abuso
- Validazione Zod anche lato server (non fidarsi del client).
- Rate limiting (Upstash) su form, OTP/login, endpoint sensibili.
- Anti-bot Cloudflare Turnstile su form pubblico e login.

### Pagamenti
- Dati carta gestiti da Stripe (PCI-DSS); il sito non li tratta mai.
- Verifica della firma dei webhook Stripe + idempotenza per evitare doppie elaborazioni/frodi.
- **Prezzo ricalcolato lato server**: `/api/checkout` compone importo e `line_items` SOLO dai listini pubblicati (`packages`/`addons`), MAI dall'importo inviato dal client; cosi un utente non puo "scegliersi" il prezzo (@04/@SPEC_API_Contracts).

### CMS contenuti e endpoint di sistema
- Scritture CMS (pacchetti, add-on, FAQ, testi, media) e azioni CRM: solo ruolo ADMIN (RLS + check server); il pubblico legge solo record pubblicati/attivi.
- Endpoint `/api/revalidate`: protetto da secret/Bearer, invocabile solo dal CRM; nessun effetto dato sui contenuti, solo invalidazione cache.
- Bucket pubblico `site-assets`: lettura pubblica ma **upload solo ADMIN**; validazione tipo/peso e sanitizzazione del nome file; separato dal bucket privato dei documenti.
- **Sanitizzazione dei contenuti editabili**: FAQ/testi (markdown) sono sanitizzati in output per prevenire stored XSS; nessun HTML arbitrario eseguibile.

### Trasporto e hardening web
- HTTPS/TLS ovunque, HSTS; cookie sicuri (HttpOnly, Secure, SameSite).
- Security headers: CSP, X-Content-Type-Options, Referrer-Policy; protezione CSRF sulle mutation.

### Protezione dati
- Cifratura in transito e at-rest (Postgres/Supabase, storage).
- **IBAN: cifratura applicativa dedicata (envelope encryption)** con chiave gestita separata dal DB (KMS/secret), decrittazione solo server-side quando serve; oltre alla cifratura at-rest. Minimizzazione e cancellazione dopo l'uso (F24, @10).
- Minimizzazione e retention conformi (@10): input sensibili cancellati dopo la lavorazione.

### Backup e recovery
- Backup database con Point-in-Time Recovery (PITR); restore testato periodicamente.
- Cold storage NAS: copia di archivio cifrata e ad accesso controllato (@12).

### Sincronizzazione Cloud -> NAS (sicura)
- Modello "pull" dall'ufficio: nessuna porta aperta in ingresso sul router dello studio.
- Chiavi API di sola lettura per il client locale; controllo di integrita dei file scaricati.

### Logging e audit
- Audit log delle azioni ADMIN e degli accessi; nessun segreto/PII nei log.
- Monitoraggio e alert tramite Sentry (@12).

### Gestione segreti e dipendenze
- Segreti solo in variabili d'ambiente server; chiavi distinte per dev/staging/prod; rotazione periodica.
- Aggiornamenti dipendenze (Dependabot) e scansione chiavi nel repo.

---

## Idee future
- Pentest periodico (oltre a quello mirato pre-lancio gia previsto) e bug bounty leggero.
- WAF/Cloudflare davanti all'app; bot management avanzato.
- Estendere la cifratura applicativa ad altri campi ultra-sensibili oltre all'IBAN, se necessario.
- Security training/checklist per Lorenzo (phishing, gestione credenziali).

---

## Nodi da sciogliere
- [RISOLTO] Scansione antivirus/malware sugli upload in v1: SI, con **ClamAV** ospitato in UE (no servizi che condividono i campioni, per GDPR). Avviata dal job di upload; il file resta in stato "in scansione/quarantena" e diventa accessibile solo se pulito (vedi "Sicurezza storage").
- [RISOLTO] 2FA admin: **TOTP (app authenticator) + recovery codes**; niente SMS. **IP allowlist NON in v1** (rischio lockout per accesso mobile/fuori studio): sostituita da alert su nuovo dispositivo/accesso anomalo. Rivalutare se l'accesso diventera solo da studio.
- [RISOLTO] Pentest pre-lancio: SI, **mirato** ai flussi critici (auth, RLS cross-tenant, upload, checkout/webhook) + scansioni automatiche (OWASP ZAP) in CI; budget contenuto, fornitore da selezionare.
- [RISOLTO] IBAN: SI, **cifratura applicativa (envelope encryption)** con chiave gestita separata dal DB (KMS/secret), decrittazione solo server-side quando serve, oltre all'at-rest; minimizzazione e cancellazione dopo l'uso (F24, @10).

## Passi successivi
- [ ] Scrivere e testare tutte le policy RLS (test cross-tenant).
- [ ] Configurare rate limiting (Upstash) e Turnstile sugli endpoint sensibili.
- [ ] Implementare la verifica firma + idempotenza dei webhook Stripe (@07).
- [ ] Configurare security headers, CSP e cookie sicuri.
- [ ] Attivare 2FA admin e definire policy segreti/rotazione.
- [ ] Configurare PITR e provare un restore.
- [ ] Integrare ClamAV (UE) nel job di upload con stato quarantena -> pulito/bloccato.
- [ ] Implementare envelope encryption dell'IBAN (chiave in KMS/secret) + retention/cancellazione.
- [ ] Configurare 2FA TOTP + recovery codes e alert nuovo dispositivo per l'admin.
- [ ] Pianificare il pentest mirato pre-lancio e aggiungere OWASP ZAP in CI.

---

## Decisioni congelate (lock-in)
- RLS come backbone; service_role solo server-side; test cross-tenant obbligatori.
- Storage privato con accesso solo via signed URL a scadenza.
- OTP/login con rate limit + Turnstile; 2FA admin via TOTP + recovery codes (no SMS); alert su nuovo dispositivo invece di IP allowlist rigida in v1.
- Scansione malware (ClamAV in UE) sugli upload, con quarantena finche non "pulito".
- IBAN con cifratura applicativa (envelope encryption) oltre at-rest + cancellazione dopo l'uso.
- Estrazione documenti OCR/AI (fast-follow V1.1): solo dopo scan pulito, fornitori UE con DPA + no-training, ausilio assistito (decide Lorenzo), incluso in DPIA.
- Pentest mirato pre-lancio (auth/RLS/upload/pagamenti) + scansioni automatiche in CI.
- Verifica firma e idempotenza dei webhook Stripe; prezzo al checkout sempre ricalcolato server-side dai listini.
- Scritture CMS/CRM solo ADMIN; `/api/revalidate` protetto da secret; bucket `site-assets` upload solo ADMIN; contenuti editabili sanitizzati (no stored XSS).
- Segreti solo in env server, chiavi per ambiente, rotazione.
- Cifratura at-rest e in transito; backup con PITR e restore testato.
- Sync NAS in modello pull con chiavi di sola lettura.

---

## Interfacce / Contratti (consuma -> espone)
- Consuma: schema e RLS (@SPEC_Data_Model), variabili/segreti (@SPEC_Env_Vars), standard di codice (@SPEC_Coding_Standards).
- Espone (regole vincolanti per gli altri capitoli): policy RLS, regole di rate limiting, verifica firma/idempotenza webhook, signed URL, 2FA admin, gestione segreti. 04/05/06/07/12 devono conformarsi.

## Criteri di accettazione
- Test cross-tenant verde: un cliente non puo in alcun modo leggere dati di un altro.
- Un webhook Stripe con firma non valida viene rifiutato; uno duplicato non produce doppia elaborazione.
- Dopo N tentativi OTP/login falliti scatta un blocco temporaneo (rate limit).
- Nessun segreto/PII e presente nel bundle client o nei log.
- I file dei clienti sono accessibili solo via signed URL a scadenza; il bucket documenti non e pubblico (il solo bucket pubblico e `site-assets`, in sola lettura).
- Un checkout con importo manipolato dal client viene ignorato: il totale e quello ricalcolato dai listini pubblicati.
- `/api/revalidate` rifiuta richieste prive del secret valido.
- Esiste un restore di prova del database andato a buon fine (PITR).

## Rischi / Compliance & Riferimenti
- Rischio IDOR: RLS mal scritta espone dati di altri clienti -> test obbligatori.
- Rischio data breach: dati sensibili; obbligo notifica entro 72h (@10).
- Rischio supply chain: dipendenze vulnerabili o chiavi committate.
- Rischio NAS: cold storage non protetto vanifica la sicurezza cloud (@12).
- Riferimenti: GDPR artt. 25 (privacy by design), 32 (misure di sicurezza); @10 per gli obblighi correlati.
