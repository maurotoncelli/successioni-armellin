# 12. Operations e Manutenzione

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-12
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-20
- Dipendenze: @05_CRM, @07_Stack, @10_Legale_Compliance, @11_Sicurezza, @13_Stima_Costi
- Owner:

## Sintesi
Come si tiene in piedi il sistema nel tempo: ambienti, rilasci, monitoraggio, automazioni con retry, sincronizzazione notturna verso il NAS, backup, gestione incidenti e continuita operativa. Obiettivo: un servizio H24 affidabile senza dipendere dall'hardware dell'ufficio.

---

## Stato attuale del progetto

### Ambienti e rilasci
- Tre ambienti: sviluppo, staging, produzione (progetti Supabase distinti + ambienti Vercel) (@07).
- CI/CD via Git: preview deployment su staging, promozione a produzione.
- Gestione migrazioni database versionate e applicate in modo controllato.

### Workflow di sviluppo e aggiornamenti (GitHub + Cursor + Vercel)
Sito e CRM si gestiscono con lo STESSO flusso (coerenza/ottimizzazione, @05/@07):
- Codice: un repository GitHub (sorgente unica di verita). Sito pubblico e CRM nello stesso repo (app Next.js unica con `/admin`, o monorepo); commit piccoli e descrittivi.
- Editing: Cursor come editor + AI per le modifiche; nessuna modifica fatta "a mano" direttamente in produzione.
- Branch: `main` = produzione. Ogni modifica su un branch corto + Pull Request (anche da soli: serve come checkpoint e cronologia).
- Anteprime: Vercel collegato a GitHub crea un Preview Deployment (URL di test) per ogni branch/PR -> si verifica la modifica PRIMA di pubblicare. Merge su `main` = deploy automatico in produzione.
- Database: ogni cambio di schema e una MIGRAZIONE versionata nel repo (Supabase CLI), applicata prima su staging poi su produzione. Mai modifiche manuali allo schema di produzione.
- Segreti/variabili: gestiti in Vercel per ambiente (@SPEC_Env_Vars), mai nel repo.
- Qualita: lint + type-check (+ eventuali test) come gate sulla PR (GitHub Actions o check di Vercel); build che fallisce non va in produzione.
- Rollback: "Instant Rollback" di Vercel al deploy precedente in caso di problema; per il DB, migrazioni reversibili / restore PITR (@11).
- Dipendenze: aggiornamenti via PR periodiche (es. Dependabot/Renovate) con preview di test (@11/@13).

### Monitoraggio e osservabilita
- Error tracking: Sentry (frontend + backend) con alert.
- Uptime monitor esterno (ping endpoint critici) + status delle integrazioni.
- Performance: Core Web Vitals / Vercel Analytics.
- Log centralizzati (senza PII/segreti, @11) e dashboard salute sistema.

### Automazioni e job (con retry)
- Job queue: Inngest/Trigger.dev (@07) per email di stato (Resend), WhatsApp, offline conversions (@08), generazione PDF/ZIP.
- Retry automatici + dead-letter per i job falliti; visibilita degli errori.
- Cron per attivita pianificate (reminder scadenze pratiche, richiesta recensioni 48h, @05/@09).

### Sincronizzazione notturna Cloud -> NAS
- Modello "pull" dall'ufficio (nessuna porta aperta in ingresso, @11).
- Hardware confermato (Riunione 1): NAS **QNAP serie TS-x31K** (modello esatto e dischi da precisare, DOMANDE_PER_LORENZO).
- Strumento: **QNAP HBS 3 (Hybrid Backup Sync)** per il pull pianificato dal cloud verso il NAS, in alternativa Rclone (se serve maggiore controllo/compatibilita con lo storage). Chiavi/credenziali di sola lettura.
- Nota hardware: i TS-x31K sono NAS ARM entry-level; HBS 3 e supportato. Verificare spazio dischi sufficiente per l'archivio crescente.
- Pianificazione: ogni notte (es. 03:00) via Task Scheduler/cron; chiavi API di sola lettura.
- Flusso: quando una pratica passa a "Chiusa", il backend prepara il dossier in una cartella "Pronte_Per_Archivio"; il NAS la scarica con controllo di integrita.
- Retention coordinata (@10): in cloud restano i documenti FINALI per l'accesso del cliente; gli input sensibili sono cancellati dopo la lavorazione; l'archivio completo vive offline sul NAS.

### Backup e recovery
- Database: PITR (@11) con restore testato periodicamente.
- Storage: i documenti finali sono replicati offline sul NAS; verificare anche backup del bucket.
- Backup delle configurazioni (variabili, infrastruttura as-doc).

### Gestione incidenti
- Runbook: rilevazione (alert) -> triage -> mitigazione -> comunicazione -> post-mortem.
- Procedura data breach con notifica entro 72h (@10/@11).
- Contatti e responsabilita definiti (chi interviene).

### Manutenzione ricorrente
- Aggiornamenti dipendenze e patch di sicurezza (cadenza definita) (@11).
- Aggiornamento contenuti SEO datati (es. guide "2026" -> "2027") (@09).
- Revisione periodica costi e utilizzo SaaS (@13).

### Continuita operativa
- Documentazione operativa aggiornata (questa Bibbia + runbook).
- Dipendenza da una sola persona (Lorenzo) come rischio di business (@01): definire backup operativo per indisponibilita.
- Gestione outage fornitori (Supabase/Vercel/Stripe): comportamento e comunicazione agli utenti.

---

## Idee future
- Infrastructure as Code per ricreare gli ambienti in modo riproducibile.
- Dashboard unica di "salute" (uptime, errori, job falliti, costi).
- Ambiente di staging con dati sintetici per QA realistici.
- Automazione completa del ciclo archiviazione + cancellazione cloud post-conferma integrita.

---

## Nodi da sciogliere
- Chi mantiene il sistema nel tempo (Lorenzo + sviluppatore/retainer)? Modello di manutenzione.
- Modello esatto e dischi del NAS QNAP TS-x31K (131K/231K/431K, taglia/RAID) per dimensionare l'archivio (DOMANDE_PER_LORENZO).
- Durata di retention in cloud definitiva, coordinata col commercialista (@10).
- Target di uptime/SLA da comunicare (o meno) ai clienti.
- Backup operativo in caso di indisponibilita di Lorenzo.

## Passi successivi
- [ ] Configurare i tre ambienti e la pipeline CI/CD.
- [ ] Integrare Sentry + uptime monitor + alert.
- [ ] Impostare la job queue con retry e i cron (@05/@08/@09).
- [ ] Configurare la sync notturna pull verso il NAS (dopo info hardware).
- [ ] Scrivere il runbook di incident response e la procedura breach (@10).
- [ ] Definire il piano di manutenzione e revisione costi (@13).

---

## Decisioni congelate (lock-in)
- Tre ambienti (dev/staging/prod) con CI/CD e migrazioni versionate.
- Workflow: GitHub (repo unico sito+CRM) + Cursor + Vercel. Branch `main`=prod, modifiche via PR con Preview Deployment, deploy automatico al merge; schema DB solo via migrazioni versionate; rollback istantaneo su Vercel. Nessuna modifica diretta in produzione.
- Monitoring con Sentry + uptime monitor + alert.
- Automazioni su job queue con retry e dead-letter; cron per attivita pianificate.
- Sync NAS notturna in modello pull con controllo di integrita. Hardware: QNAP TS-x31K; strumento QNAP HBS 3 (alt. Rclone).
- Retention: cloud = documenti finali; NAS = archivio completo offline; input sensibili cancellati post-lavorazione.
- Runbook di incident response + procedura breach 72h.

---

## Interfacce / Contratti (consuma -> espone)
- Consuma: stack e ambienti (@07), nomi job (@SPEC_Naming_Conventions), trigger dal CRM (@05), eventi (@08).
- Espone: ambienti e pipeline CI/CD, esecuzione affidabile dei job (retry/dead-letter), monitoring/alert, sync NAS, runbook di incident.

## Criteri di accettazione
- Un job fallito viene ritentato e, se persiste, finisce in dead-letter con alert al responsabile.
- La sync notturna scarica i dossier delle pratiche CHIUSA con verifica di integrita, senza aprire porte in ingresso (pull).
- Un errore applicativo genera un evento in Sentry e, se critico, un alert.
- Esiste e funziona una procedura di restore del database (provata).
- I tre ambienti sono isolati (dati e segreti separati).

## Rischi / Compliance & Riferimenti
- Rischio automazioni silenti: job falliti senza alert -> email/WhatsApp/conversioni perse.
- Rischio continuita: dipendenza da una persona; senza backup operativo il servizio si ferma.
- Rischio backup non testati: un restore mai provato puo fallire quando serve.
- Rischio NAS: archivio offline non protetto/non verificato (@11).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezione cold storage, sync notturna, pull vs push, Task Scheduler).
