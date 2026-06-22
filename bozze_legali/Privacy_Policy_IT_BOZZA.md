# Informativa sul trattamento dei dati personali (Privacy Policy) - BOZZA

> STATO: BOZZA v0.1 - testo di lavoro generato dal blueprint (@10_Legale_Compliance, @07_Stack).
> ATTENZIONE: questa NON e consulenza legale. Prima della pubblicazione deve essere VALIDATA da un avvocato/DPO. I dati contrassegnati "[DA CONFERMARE]" provengono da fonti pubbliche e vanno verificati con Lorenzo. La cookie policy e gestita separatamente dalla CMP (iubenda) - vedi sezione 11.
> Lingua prevalente: ITALIANO. Le traduzioni in altre lingue hanno valore di mera cortesia; in caso di discrepanza prevale la versione italiana.
> Ultimo aggiornamento: [data di pubblicazione]

---

Ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 ("GDPR") e del D.Lgs. 196/2003 ("Codice Privacy") come modificato dal D.Lgs. 101/2018, lo Studio fornisce le seguenti informazioni sul trattamento dei dati personali degli utenti che consultano il sito, richiedono un preventivo, acquistano un servizio o utilizzano l'area riservata.

## 1. Titolare del trattamento
- Titolare: **Studio Geom. Lorenzo Armellin** [DA CONFERMARE: ragione sociale esatta / ditta individuale]
- Sede operativa: Via Vittorio Veneto 31, 56025 Pontedera (PI)
- P.IVA: 02432220503 [DA CONFERMARE] · C.F.: RMLLNZ90E27G843J [DA CONFERMARE]
- Email: [email dedicata sul dominio, es. privacy@dominio.it - DA DEFINIRE]
- PEC: lorenzo.armellin@geopec.it [DA CONFERMARE]
- Telefono: 320 1570567 [DA CONFERMARE]

## 2. Responsabile della protezione dei dati (DPO)
La nomina di un DPO non risulta obbligatoria per l'attivita svolta; la valutazione e documentata dal Titolare e sara aggiornata in base a volumi e natura dei trattamenti. [DA CONFERMARE in sede di valutazione - vedi @10]
Per ogni richiesta in materia di dati personali e possibile contattare il Titolare ai recapiti della sezione 1.

## 3. Categorie di dati trattati
A seconda dell'interazione, il Titolare puo trattare:
- **Dati identificativi e di contatto**: nome, cognome, email, numero di telefono.
- **Dati relativi al servizio (pratica di successione)**: codice fiscale, dati anagrafici e patrimoniali dell'erede e del defunto, dati su immobili, conti correnti e rapporti finanziari, gradi di parentela.
- **Documenti**: documento d'identita, certificato/atto di morte, visure, certificazioni e ulteriori documenti necessari alla pratica.
- **Dati di pagamento**: gestiti direttamente dal fornitore di pagamento (Stripe); il Titolare non memorizza i dati completi della carta.
- **Dati tecnici e di navigazione**: indirizzo IP, identificativi dei dispositivi, log, cookie e tecnologie simili (vedi sezione 11 e Cookie Policy).

Alcuni dati possono riguardare soggetti diversi dall'utente che li conferisce (es. altri eredi o il defunto): chi li fornisce garantisce di essere legittimato a comunicarli e si impegna a informare gli interessati della presente informativa (art. 14 GDPR).

## 4. Finalita del trattamento e basi giuridiche
| Finalita | Base giuridica (GDPR) |
|---|---|
| Riscontro alle richieste di preventivo/contatto e attivita precontrattuali | Art. 6.1.b (misure precontrattuali) |
| Esecuzione del servizio professionale (predisposizione e invio telematico della dichiarazione di successione, volture) | Art. 6.1.b (contratto) |
| Adempimenti fiscali, contabili e di conservazione (fatturazione, mandato professionale) | Art. 6.1.c (obbligo legale) |
| Gestione dei pagamenti | Art. 6.1.b e 6.1.c |
| Sicurezza del sito, prevenzione di abusi/frodi, integrita dei sistemi | Art. 6.1.f (legittimo interesse) |
| Marketing diretto / newsletter (se attivato) | Art. 6.1.a (consenso) |
| Cookie e tecnologie non tecniche/di profilazione | Art. 6.1.a (consenso) |

Il trattamento dei documenti puo includere dati di natura particolarmente delicata sul piano patrimoniale; non e prevista, di norma, la raccolta di categorie particolari di dati ex art. 9 GDPR. Qualora il cliente trasmetta spontaneamente dati eccedenti (es. informazioni sanitarie in un documento), il Titolare li tratta nei limiti dell'art. 9.2 e ne raccomanda la minimizzazione.

## 5. Natura del conferimento
Il conferimento dei dati per le finalita contrattuali, fiscali e legali e necessario: il mancato conferimento impedisce l'erogazione del servizio. Il conferimento per finalita di marketing e facoltativo e l'eventuale rifiuto non pregiudica l'accesso al servizio.

## 6. Modalita del trattamento e sicurezza
I dati sono trattati con strumenti informatici e misure tecniche e organizzative adeguate (art. 32 GDPR): cifratura in transito e a riposo, controllo degli accessi, segmentazione tramite Row Level Security, principio di minimizzazione, registrazione degli accessi (audit log). L'accesso e riservato al Titolare e ai responsabili autorizzati.

## 7. Destinatari e responsabili del trattamento
Per erogare il servizio, il Titolare si avvale di fornitori che trattano i dati come **responsabili del trattamento** (art. 28 GDPR), vincolati da apposito accordo (DPA). Le principali categorie e fornitori sono:

| Fornitore | Ruolo / servizio | Ubicazione dati |
|---|---|---|
| Supabase | Database, autenticazione, storage documenti | UE [DA CONFERMARE regione] |
| Vercel | Hosting e distribuzione dell'applicazione | UE (funzioni) / possibile extra-UE |
| Stripe | Elaborazione dei pagamenti | UE/USA (SCC) |
| Resend | Invio email transazionali | UE/USA (SCC) [DA CONFERMARE] |
| Meta Platforms (WhatsApp Cloud API) | Messaggistica (se attivata) | UE/USA (SCC) |
| Google (Analytics/Ads) | Statistiche e advertising (solo previo consenso) | UE/USA (SCC) |
| Inngest / Trigger.dev | Esecuzione di processi automatici (code/job) | [DA CONFERMARE] |
| Sentry | Monitoraggio errori | [DA CONFERMARE] |
| Cloudflare (Turnstile) | Protezione anti-abuso dei moduli | UE/USA (SCC) |
| Upstash | Rate limiting / sicurezza | [DA CONFERMARE] |
| iubenda | Gestione del consenso (CMP) | UE |

I dati possono inoltre essere comunicati a soggetti pubblici (es. Agenzia delle Entrate, Catasto) per l'adempimento del servizio, a professionisti di fiducia (es. commercialista/notaio) ove necessario, e all'autorita giudiziaria/forze dell'ordine se richiesto per legge. I dati NON sono diffusi ne ceduti a terzi per loro autonome finalita.

## 8. Trasferimento dei dati extra-UE
Il Titolare privilegia fornitori con dati in Unione Europea. Quando alcuni fornitori trattano dati al di fuori dell'UE (es. negli USA), il trasferimento avviene sulla base di garanzie adeguate ai sensi degli artt. 44 e ss. GDPR, in particolare le **Clausole Contrattuali Standard (SCC)** della Commissione Europea e/o decisioni di adeguatezza (es. EU-US Data Privacy Framework, ove applicabile).

## 9. Periodo di conservazione
- **Documenti fiscali e contabili** (fatture, ricevute, mandato, dichiarazione): conservati per il termine di legge, almeno **10 anni** (art. 2220 c.c. e obblighi fiscali).
- **Documenti di input sensibili** caricati dal cliente (es. carta d'identita): conservati per il **tempo necessario alla lavorazione** della pratica e poi cancellati dal cloud (minimizzazione).
- **Documenti finali** (ricevute AdE, visure aggiornate, fattura): resi disponibili nell'area riservata del cliente per la consultazione; l'archivio completo e conservato offline.
- **Dati di contatto per preventivi non convertiti**: [DA DEFINIRE, es. 12-24 mesi] e poi cancellati/anonimizzati.
- **Dati per marketing**: fino a revoca del consenso.
- **Dati tecnici/log e cookie**: secondo le durate indicate nella Cookie Policy.

## 10. Diritti dell'interessato
L'interessato puo esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR:
- accesso ai propri dati;
- rettifica;
- cancellazione ("diritto all'oblio"), nei limiti degli obblighi di conservazione legale;
- limitazione del trattamento;
- portabilita;
- opposizione al trattamento basato sul legittimo interesse;
- revoca del consenso in ogni momento (senza pregiudicare la liceita del trattamento precedente).

Le richieste vanno inviate ai recapiti della sezione 1. Il Titolare risponde senza ingiustificato ritardo e comunque entro un mese.
L'interessato ha inoltre diritto di proporre **reclamo al Garante per la protezione dei dati personali** (www.garanteprivacy.it).

## 11. Cookie e tecnologie di tracciamento
Il sito utilizza cookie tecnici e, previo consenso, cookie analitici e di marketing. La gestione del consenso avviene tramite una piattaforma certificata (CMP). Il dettaglio delle categorie, delle finalita e delle durate e riportato nella **Cookie Policy** dedicata, accessibile dal banner e dal footer. Il consenso e revocabile in qualsiasi momento.

## 12. Processo decisionale automatizzato e intelligenza artificiale
Non e effettuato alcun processo decisionale automatizzato che produca effetti giuridici sull'interessato ai sensi dell'art. 22 GDPR. Eventuali strumenti di intelligenza artificiale sono usati esclusivamente come supporto interno all'attivita del professionista (es. organizzazione documentale, bozze), con decisione finale sempre rimessa a una persona.

## 13. Minori
I servizi si rivolgono a persone maggiorenni. Il Titolare non raccoglie consapevolmente dati di minori senza il consenso di chi esercita la responsabilita genitoriale.

## 14. Modifiche all'informativa
Il Titolare puo aggiornare la presente informativa. La versione vigente e sempre pubblicata su questa pagina con la data di ultimo aggiornamento; in caso di modifiche sostanziali ne sara data adeguata evidenza.

---

### Note interne (NON pubblicare) - punti da chiudere con il legale
- Confermare dati anagrafici/P.IVA/PEC e indirizzo email privacy dedicato.
- Valutazione formale DPO (probabile non obbligatorio, da motivare).
- Definire retention precisa per lead non convertiti e per log/cookie (allineare con Cookie Policy iubenda).
- Confermare ubicazione dati e basi del trasferimento per ciascun fornitore (DPA firmati - @07).
- Verificare necessita DPIA (art. 35) data la natura finanziaria e la vulnerabilita degli interessati (@10).
- Coordinare con Cookie Policy, Condizioni di Vendita/T&C e testo recesso (@10).
