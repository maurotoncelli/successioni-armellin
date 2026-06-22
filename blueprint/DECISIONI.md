# DECISIONI - Vincoli congelati del progetto (aggregato)

> Raccolta di tutte le "Decisioni congelate" sparse nei capitoli. E il PRIMO file da dare in pasto all'AI: definisce i vincoli non negoziabili. In caso di dubbio, queste decisioni prevalgono.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-22 (integrati esiti Riunione 1 + Riunione 2: anagrafica, pricing/capienza, su misura, fiscale forfettario, firma, auth, brand)
> Ogni voce rimanda al capitolo di origine come fonte di dettaglio.

## Business e modello (@01)
- Geometra iscritto all'albo e ABILITATO ENTRATEL (confermato Riunione 2). **Ditta individuale**, **regime forfettario (NO IVA)**; fatturazione con **Aruba**; firma digitale **CNS Aruba**; **no mediazione immobiliare** (antiriciclaggio non applicabile). Diplomato geometra, in proprio e su successioni **dal 2012**, **~100 successioni** gia gestite.
- Attivita full-time; capacita target a regime ~25 pratiche/mese (tetto sostenibile ~30 da solo). **Obiettivo fatturato: minimo 10.000 EUR/mese, ideale 15.000 EUR/mese** (Riunione 2); crescita per fasi insieme al budget ADV. Soft launch: obiettivo gestire ~15 successioni.
- Pacchetti a prezzo fisso (Riunione 2), prezzi = onorario finale senza IVA (forfettario):
  - **Semplice 290** (soli conti/liquidita, nessun immobile).
  - **Completo 490**: fino a **5 eredi**, **1-3 immobili**, fino a **5 conti bancari**.
  - **Zero Stress** (790, da confermare): **3-8 immobili**, non oltre **5 conti**, **recupero documenti** incluso, fino a **5 eredi**. Aperto: sovrapposizione a 3 immobili con Completo -> regola operativa proposta: Completo 1-3, Zero Stress >3 immobili o quando serve recupero documenti.
  - **Add-on / servizi correlati**: **Riunione di usufrutto 150** + **Adeguamento/ricalcolo IMU** (prezzo PROPOSTO 90 EUR, da confermare Lorenzo) + voltura aggiuntiva.
- Pagamento anticipato dell'onorario; imposte di Stato separate e a carico dell'erede.
- Casi complessi -> **preventivo personalizzato** dal CRM dopo consulenza, NO 4o pacchetto pubblico. **Trigger "su misura" (Riunione 2): SI** = tanti immobili (oltre Zero Stress), particelle agricole, terreni; **NO** (restano nei pacchetti) = annessi, testamento, eredi all'estero; **recupero documenti** = su misura solo se in conflitto col pacchetto 490.
- Cambio pacchetto con conguaglio: CONFERMATO (Riunione 2). SLA di consegna: CONFERMATI (lavorazione effettiva ~3-4 gg con documenti completi; SLA pubblici prudenziali).
- Onesta sul non-obbligo: se la dichiarazione non e dovuta, si avvisa il cliente prima dell'acquisto (Esito A del form, @04). Criterio legale (esonero, art. 28 c.7 TUS): NON dovuta solo se TUTTE e tre: (1) eredi = coniuge/parenti in linea retta; (2) attivo lordo <= 100.000 EUR; (3) nessun immobile/diritto reale immobiliare.
- Servizio nazionale con ancoraggio locale (studio Pontedera, **orario 9-13 / 15-19**).
- Sviluppo in-house di sito + CRM.
- Gestionale in uso: Sogei - Successioni Online (AdE) - confermato Riunione 1.

## Legale e compliance (@10)
- Titolare del trattamento: Studio Geom. Lorenzo Armellin.
- Antiriciclaggio NON applicabile (confermato Riunione 2: Lorenzo non svolge mediazione immobiliare).
- Fiscale: regime forfettario, **nessuna IVA** in fattura; prezzi a display = onorario finale "tutto incluso". Da verificare col commercialista l'eventuale contributo integrativo Cassa Geometri (CIPAG). Fatturazione elettronica via Aruba.
- Recesso: avvio immediato lavorazione subordinato a consenso espresso + accettazione perdita recesso, conferma su supporto durevole.
- Firma (aggiornato Riunione 2): Lorenzo oggi raccoglie il mandato in **CARTACEO** ed e disposto ad aggiornarsi. v1 = **fallback cartaceo (scarica -> firma -> ricarica) come baseline** + **FES ad accettazione tracciata** (timestamp, IP, versione+hash, log) consigliata per consensi (checkout) e mandato (area riservata, prima dell'avvio); Lorenzo dispone di **CNS Aruba**; FEA/FEQ non in v1 (@10 par. 5.1).
- Retention: in cloud restano i documenti FINALI; input sensibili minimizzati/cancellati post-lavorazione. Matrice per tipo (@10 par. 4.1): input grezzi ~30 gg dalla chiusura, finali/fiscali 10 anni, IBAN cancellato dopo l'addebito; purge automatico con log.
- Residenza dati: preferenza UE.
- Contenuti fiscali allineati all'autoliquidazione 2025.

## Stack tecnologico (@07)
- Frontend: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Motion.
- Backend/dati: Supabase (Postgres/Auth/Storage/Realtime) in UE; RLS come backbone.
- Accesso dati: supabase-js (RLS); Drizzle opzionale lato server. Prisma abbandonato come layer principale.
- Auth: Supabase Auth passwordless. Cliente (Riunione 2): **Magic Link via email (primario) + OTP via email; in alternativa OTP via telefono/SMS** se il cliente preferisce (caveat: costo/deliverability SMS, provider UE). Niente social login (Google/Apple) in v1; eventuale Google in fase 2 con match sull'email della pratica.
- Storage: Supabase Storage (no S3 in v1); bucket pubblico `site-assets` per le immagini del sito.
- Sito data-driven via CMS leggero interno (Supabase + editor CRM) per pacchetti/prezzi, FAQ, testi, immagini. Sito statico SSG/ISR su CDN con revalidation on-demand alla pubblicazione (nessuna query DB per-visita); flusso Bozza/Anteprima/Pubblica + versioning; Zod con fallback; MDX solo per i long-form. Niente headless CMS esterno.
- Pagamenti: Stripe. Email: Resend. WhatsApp: Cloud API (se attivato).
- Job: Inngest/Trigger.dev (con retry). Monitoring: Sentry. Anti-abuso: Upstash + Turnstile.
- Hosting: Vercel con funzioni in regione UE.
- Domini: sito pubblico su dominio principale, area cliente su `/area-riservata`, CRM admin su sottodominio dedicato (`app.`).
- Email transazionali via Resend con `reply-to` verso la casella reale di Lorenzo; deliverability con SPF/DKIM/DMARC.
- Deliverability anti-spam (Riunione 1): sottodominio di invio dedicato (`send.`), DMARC progressivo none->quarantine->reject, From autenticato (no Gmail), warm-up, igiene contenuti. Il preventivo NON dipende solo dall'email: sempre visibile a schermo (thank-you/@04) e in area riservata (@06).
- Multilingua (REQUISITO): Next.js i18n (next-intl), rotte `/[locale]` su dominio unico, hreflang+x-default, supporto RTL (arabo) e font per script non-latini. Lingue al lancio: IT (default), EN, AR, DE, ES, RU, TR, zh-Hans (cinese semplificato), HI (hindi), SQ (albanese), FR (francese, anche per l'Africa francofona). Gruppo africano (somalo/amarico/tigrino/wolof) DA CONFERMARE per fattibilita traduttori/ROI. I marocchini sono coperti dall'arabo standard. Traduzioni interamente in AI con modelli avanzati (budget limitato, niente revisione umana sistematica); mitigazione: testi legali validi in ITALIANO (lingua prevalente) + glossario termini fiscali per coerenza. Latino e greco antico ESCLUSI come locale (solo motto latino editoriale in Chi Sono/footer). Articoli dedicati agli stranieri in Italia. CRM admin solo in italiano. Lingua prevalente per i testi legali: italiano.

## Sito pubblico (@03)
- Imbuto: Hero -> Trust -> Problema/Soluzione -> Come Funziona -> Tariffe -> Recensioni -> Chi Sono -> FAQ -> CTA -> Footer.
- Pagine autonome: Tariffe, Chi Sono, Guide, Contatti, hub legale.
- CTA primaria unica: "Calcola Preventivo" -> /preventivo.
- Tariffe: riga "Caso particolare? -> preventivo su misura" (no 4o pacchetto) + box "Ti serve davvero la successione?" + guida alla scelta del pacchetto con invito alla chiamata di riallineamento.
- Mobile-first; accessibilita WCAG 2.2 AA; foto reali (no stock).
- Guida ai documenti pre-acquisto (`/documenti-successione`): interattiva (lista personalizzata) + versione evergreen SEO; stesso motore della checklist post-vendita (`document_catalog` + relevance_rule) per coerenza; lista indicativa confermata da Lorenzo; hook "non ce l'hai? lo recuperiamo noi". Riproposta nella thank-you (Esiti B/C, @04).

## Form di conversione (@04)
- 4 step con barra di progresso e logica condizionale.
- Campi minimi lead: Nome, Cognome, Email (obbligatori) + Telefono (opzionale).
- Consenso privacy obbligatorio; marketing separato/facoltativo. Turnstile + Zod.
- Mappatura automatica al pacchetto suggerito.
- Thank-you a 3 esiti: A non-obbligo (verifica onesta) / B prezzo immediato (casi lineari) / C preventivo personalizzato (casi complessi). Step 3 raccoglie anche terreni/particelle agricole, annessi e altri beni per il routing.
- Checkout a ORDINE SINGOLO, niente carrello multi-prodotto: 1 pratica = 1 ordine; `/checkout` = riepilogo ordine (pacchetto + add-on/upsell + sovrapprezzo immobili + IVA/cassa, imposte di Stato a parte). Add-on come opzioni (catalogo `addons` CMS); snapshot `line_items` sulla pratica; modifiche post-acquisto via conguaglio (@05); piu successioni = ordini separati. Pagamento prima dell'accesso, area sbloccata dopo.
- Pagamento a rate / BNPL via Stripe (PayPal Pay in 3, Klarna, Scalapay) oltre a carta/bonifico, mostrato al checkout (e accennato su Tariffe): si rateizza l'onorario, non le imposte di Stato; incasso immediato per noi (rischio credito al provider). Disponibilita per importo/paese gestita da Stripe; si lega al 50/50 di fase 2 (@05/@07).
- Eventi: form_start, form_step, generate_lead.

## CRM (@05)
- Pipeline: LEAD -> PREVENTIVO_INVIATO -> PAGATO -> ATTESA_DOC -> LAVORAZIONE -> (INVIATA) -> CHIUSA, + ANNULLATA.
- Accesso solo ADMIN; pratiche isolate via RLS; audit log.
- Anagrafica clienti separata (contacts) con storico pratiche; rubrica contatti acquisiti.
- Validazione documenti Approva/Rifiuta; rifiuto innesca comunicazione automatica.
- Checklist documenti UNICA e condivisa CRM<->cliente (Riunione 1): generata dal catalogo per pertinenza, poi gestita da Lorenzo per pratica (aggiungi/rimuovi voci, obbligatoria/facoltativa, "Non applicabile" tracciata invece di cancellata, anteprima+stato per voce). Tipi documento custom creabili dal gestionale, ad hoc sulla pratica o salvati nel catalogo per riuso. Modello: document_catalog + document_requirements + documents (@SPEC_Data_Model).
- Sicurezza automazioni (Riunione 1): conferma sulle transizioni a effetto esterno + email automatiche con finestra di annullamento (invio ritardato) + "Annulla ultima azione" + template di rettifica. Refund/offline conversion solo con pulsante dedicato, mai su drag.
- Cambio pacchetto con conguaglio: upgrade via link di pagamento Stripe sulla differenza, downgrade via refund parziale; tutto tracciato.
- Pagamenti gestiti dal CRM (Stripe invisibile): flusso primario assistito (chiamata -> link -> pagamento al telefono). Pagamento offline (bonifico/contanti) come eccezione registrabile a mano.
- Identificativo pratica: codice umano `SUC-AAAA-NNNN`; defunto identificato dal codice fiscale (ricerca/dedup, non unique rigido); uuid solo tecnico.
- Scheda pratica con aree appunti distinte: appunti chiamata, note pagamenti, note generali.
- Indicatore di azione per pratica (`action_owner`): "Tocca a te" / "In attesa del cliente" / "In attesa AdE".
- Viste multiple (Kanban / Lista / Calendario); ricerca globale (codice pratica, CF defunto, nome/email/telefono) + filtri combinabili (stato, in corso vs completate, azione, pagamento, date) + viste salvate.
- Calendario lavori con date chiave: apertura scheda, consegna prevista (`due_date`), scadenza 12 mesi (derivata dal decesso), invio AdE; scadenze/ritardi evidenziati.
- SLA di consegna decorre dall'approvazione di TUTTI i documenti (`docs_approved_at`), non dal pagamento; si sospende se mancano documenti (Condizioni di Vendita art. 7, @10). Valori per pacchetto (`packages.sla_days`, giorni lavorativi, da confermare con Lorenzo): Semplice 5 / Completo 10 / Zero Stress 3 (corsia prioritaria); Su misura concordato. Riferiti al nostro invio, esclusi i tempi di enti terzi.
- Cronologia comunicazioni per pratica (`communications`): automatiche (email/WhatsApp) + registrazione manuale di contatti (chiamata/email/PEC) con canale, direzione, data/ora e note.
- Home operativa (orientata all'azione): schede attive (con breakdown azione), completate nell'anno, "da fare velocemente", in scadenza, + pannello alert automatici e widget To-Do; distinta dalla Dashboard statistiche.
- Promemoria/To-Do (`tasks`): annotabili a mano su scheda o generali, con scadenza opzionale e stato Fatto/Da fare, aggregati in home (Oggi/In arrivo/Arretrati). Interni, non inviano nulla al cliente.
- Export gestionale: in v1 Brogliaccio PDF (Sogei Successioni Online non e un gestionale terzo da popolare via CSV; import esterno da verificare).
- Statistiche: KPI operativi/finanziari nativi dal DB; analytics marketing via Looker Studio embeddato (ibrido).
- Fonti di verita metriche: DB/Stripe (ricavi/lavori), GA4 (traffico/funnel), Google Ads (spesa); ROI/CAC = combinazione.
- v1: Kanban, scheda lavoro, contacts+storico, rubrica, Brogliaccio PDF, Dossier ZIP, magic link, automazioni email, log, dashboard KPI base.
- Estrazione documenti OCR/AI: ausilio ASSISTITO che legge gli upload e propone una bozza di dati ("Riepilogo dati consigliati") correggibile a mano nella scheda pratica, con affidabilita per campo e link al documento sorgente; decide sempre Lorenzo. Fornitori in UE con DPA + no-training (Document AI/Azure + LLM UE). Tabella `document_extractions`. Pianificato come **fast-follow V1.1** (dietro feature flag), NON nell'MVP di lancio. Limite: nessun import automatico affidabile in Sogei (output = report che velocizza l'inserimento manuale).
- Rimandati (fase 2+): export gestionale (dipende da Lorenzo), pagamento 50/50, statistiche marketing/ROI avanzate.
- AI: assistente solo INTERNO al CRM (alert intelligenti, OCR/estrazione dati, bozze testi, riassunti) sempre con validazione umana; ESCLUSA chat AI pubblica lato cliente.
- UI/stack CRM: stesso stack del progetto (Next.js + Tailwind + shadcn/ui), tema dark "Flowdesk - Armellin" applicato via design token (vedi @SPEC_Design_Tokens). NON si replica il React+CSS vanilla del Flowdesk personale: si riprende solo il linguaggio grafico. Scelta a favore di coerenza e ottimizzazione (un solo repo/toolchain, componenti/auth condivisi).

## Area riservata (@06)
- Accesso passwordless: Magic Link via email (primario) + OTP via email; **opzione OTP via telefono/SMS** per chi preferisce (Riunione 2).
- Mandato: baseline **cartaceo** (scarica/firma/ricarica) + FES ad accettazione tracciata consigliata (Lorenzo oggi cartaceo, disposto ad adottare la firma online; ha CNS Aruba).
- Area sbloccata dopo il pagamento; nessun "paga per sbloccare" sui documenti finali.
- Upload con checklist dinamica = la checklist gestita da Lorenzo (`document_requirements`); il cliente vede solo le voci applicabili; stato documenti visibile e ricaricabile.
- Vista "Il tuo acquisto" (`/ordine`): riepilogo di cosa ha acquistato e cosa include (da snapshot `line_items`), importo, stato pagamento, fattura. Sempre consultabile.
- Imposte di Stato comunicate al cliente prima dell'invio (riquadro in `/ordine` + card dashboard), separate dall'onorario, F24/autoliquidazione, nessun ricarico (`state_taxes_*`); prova di presentazione registrata da Lorenzo (`submission_info`) e mostrata al cliente (@05/@06).
- Recesso self-service in v1 (`/recesso`): spiegazione chiara delle conseguenze + creazione richiesta (`withdrawal_requests`) verso il pannello recesso del CRM (@05); resta possibile anche via email/PEC + modulo tipo.
- Download finali solo via signed URL a scadenza; isolamento per cliente via RLS.

## Brand (@02)
- Archetipo Professionista Risolutore; tono empatico/rassicurante in prima persona.
- Palette "Trust & Premium" (HEX in @SPEC_Design_Tokens).
- Tipografia: Lora (titoli) + Inter (testo).
- Regola anti-burocratese: termini tecnici sempre spiegati.
- Logo (Riunione 2): **provvisorio** = monogramma "A" su sfondo dorato (gia nel prototipo); logo definitivo da ricalibrare in seguito.
- Valori del brand (Riunione 2, da copy in @02): onesto, pratico, realista, reperibile, dedicato, lavoratore.
- Asset marketing (Riunione 2): Google Business Profile SI, ~20 recensioni iniziali SI, foto/video forniti da Lorenzo, dominio ancora DA REGISTRARE; partner citato = commercialista dedicato.

## Analytics (@08)
- GA4 + GTM + Data Layer; Consent Mode v2 default "denied".
- purchase tracciato anche server-side; offline conversions al passaggio in CHIUSA.
- Nessuna PII grezza; enhanced conversions solo con identificatori hashati.
- Cookie/consenso: CMP certificata da Google (iubenda), banner Accetta/Rifiuta a pari evidenza + Personalizza, no dark pattern, no CMP fai-da-te. KPI di business (lead/purchase/fatturato) da DB+Stripe indipendenti dal consenso.

## Go-to-market (@09)
- Canale primario: Google Search Ads (no Meta all'avvio).
- Split 70% nazionale / 30% locale a budget pieno; nel soft launch tilt sul locale.
- Soft launch ~400 EUR/mese per 3 mesi (avvio prudente), poi avvio pieno 600-800 EUR/mese; scaling sui dati, ricalibrazione dopo 4-6 settimane.
- Attese: ~5-7 pratiche/mese da solo ADV nei primi mesi; ~15/mese obiettivo combinato a fine prova.
- Posizionamento "geometra (catasto) + supervisione commercialista (fisco)": gestisce la barriera di percezione e rafforza E-E-A-T (riga "rivisto da un commercialista"); claim veritieri, trasmissione in capo a Lorenzo (@01/@02/@10). Segnale "supervisione commercialista" inserito nella **Trust Bar** (home) e dove utile: **checkout** (@04), **Tariffe** vicino alla CTA, blocco **team in "Chi Sono"**, **FAQ** dedicata, **footer** del sito e **firma delle email transazionali** (@03/@05).
- Segmenti web prioritari: eredi lontani dal luogo del defunto/immobile, eredi all'estero/stranieri, ricerca prezzo trasparente, chi non ha un professionista; messaggi/landing dedicati.
- Canale referral professionale (commercialisti/notai/agenzie/onoranze) attivato in parallelo alle ads, tracciato come source dedicata.
- Lancio con 5 pillar article; ritmo 2-3/mese. E-E-A-T di base.
- Dati strutturati: LocalBusiness, Product/Offer, FAQPage, Article.
- Clienti stranieri: assistenza "nella tua lingua" come leva; canale scritto tradotto (WhatsApp/email + DeepL) primario, chiamata/video con traduzione quando serve, punti chiave per iscritto, documenti vincolanti in italiano; targeting Ads per lingua in fase 2 (@05/@09).

## Sicurezza (@11)
- RLS backbone; service_role solo server; test cross-tenant obbligatori.
- Storage privato + signed URL a scadenza.
- OTP/login con rate limit + Turnstile; 2FA admin via TOTP + recovery codes (no SMS); alert nuovo dispositivo invece di IP allowlist rigida in v1.
- Verifica firma + idempotenza webhook Stripe.
- Cifratura at-rest/in-transit; backup PITR con restore testato.
- Scansione malware (ClamAV in UE) sugli upload con quarantena finche non "pulito".
- IBAN con cifratura applicativa (envelope encryption) oltre at-rest + cancellazione dopo l'uso.
- Pentest mirato pre-lancio (auth/RLS/upload/pagamenti) + OWASP ZAP in CI.
- Sync NAS pull-only con chiavi read-only.

## Operations (@12)
- Tre ambienti (dev/staging/prod) + CI/CD + migrazioni versionate.
- Workflow: GitHub (repo unico sito+CRM) + Cursor + Vercel; branch main=prod, PR con Preview Deployment, deploy automatico al merge, rollback istantaneo; schema DB solo via migrazioni. Niente modifiche dirette in produzione.
- Monitoring Sentry + uptime + alert.
- Automazioni su job queue con retry; cron per attivita pianificate.
- Sync NAS notturna pull con controllo integrita.
- Runbook incident response + procedura breach 72h.

## Costi e roadmap (@13)
- Tre categorie di costo: SaaS ricorrenti, una tantum, marketing.
- Budget marketing: soft launch ~400 EUR/mese (3 mesi), poi 600-800 EUR/mese.
- Go-live target: fine agosto 2026 con scope MVP; non-essenziale dopo il lancio.
- Roadmap Blueprint -> Code nell'ordine definito; checklist QA pre-lancio obbligatoria.
