# 03. Architettura dell'Informazione (Sito Web Pubblico)

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-03
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @01_Executive_Summary, @02_Brand_Identity, @04_Form_Multistep, @09_Go_To_Market, @10_Legale_Compliance
- Owner:

## Sintesi
Struttura del sito pubblico: sitemap e gerarchia di navigazione, wireframe testuale della Homepage sezione per sezione, pagine autonome (Tariffe, Chi Sono, Guide, Contatti), hub legale e requisiti di accessibilita. Obiettivo: un imbuto che attira, crea empatia, spiega il metodo, mostra il prezzo, rassicura e converte verso la pre-valutazione.

---

## Stato attuale del progetto

### Sitemap (rotte principali)
- `/` Homepage
- `/tariffe` Pagina pacchetti e prezzi (pagina autonoma + sezione in home)
- `/chi-sono` Bio del professionista e studio (ancoraggio locale + E-E-A-T)
- `/come-funziona` Processo in 3 step (anche sezione in home)
- `/faq` Domande frequenti (anche sezione in home)
- `/documenti-successione` Guida ai documenti necessari (pre-acquisto, interattiva + versione evergreen SEO)
- `/guide` Indice blog/articoli SEO + `/guide/[slug]` (vedi @09)
- `/contatti` Indirizzo studio, mappa, orari, form contatto standard
- `/preventivo` Form multi-step di pre-valutazione (vedi @04) -> `/preventivo/grazie` thank-you
- `/checkout` Riepilogo ordine e pagamento (ordine singolo, no carrello multi-prodotto; vedi @04/@06)
- `/area-riservata` Accesso cliente (vedi @06)
- Hub legale: `/privacy`, `/cookie-policy`, `/termini-condizioni` (condizioni di vendita), `/garanzia`, `/recesso` (diritto di recesso, in linguaggio chiaro)
- Pagine di servizio: `/404`

### Schema ad albero del sito (completo)
> Vista d'insieme: ogni pagina con i suoi elementi/sezioni principali. Le rotte sono localizzate sotto `/[locale]` (@07). Il CRM (`/admin`) e l'area riservata (@06) sono app a parte, qui indicate come nodi.

```
SITO PUBBLICO (www)
├── [GLOBALE]
│   ├── Header (sticky): logo · nav (Come Funziona, Tariffe, Chi Sono, Guide, FAQ, Contatti) · CTA "Calcola Preventivo" · Selettore lingua
│   ├── Footer (globale): recapiti · P.IVA · n. Albo · indirizzo studio · menu legale (Privacy · Cookie · T&C · Garanzia · Recesso) · link rapidi · social · credit "AT STUDIO"
│   ├── Banner consensi (CMP, Consent Mode v2)
│   └── CTA mobile persistente (barra azione in basso)
│
├── / (Homepage)
│   ├── 1. Hero (headline-promessa, sub-beneficio, CTA primaria+secondaria, msg specializzazione)
│   ├── 2. Trust Bar (Albo, Entratel/telematico, supervisione commercialista, Stripe, GDPR, SSL)
│   ├── 3. Problema/Soluzione (empatia + 3 vantaggi)
│   ├── 4. Come Funziona (3 step + tempi/SLA)
│   ├── 5. Tariffe (3 card + box trasparenza onorario/imposte)
│   ├── 6. Anti-obiezione "Perche non farlo da soli?" (tabella fai-da-te vs noi)
│   ├── 7. Recensioni (widget Google + estratti)
│   ├── 8. Chi Sono (estratto + link)
│   ├── 9. FAQ (accordion)
│   ├── 10. CTA finale
│   └── 11. Footer
│
├── /tariffe
│   ├── 3 card pacchetto (Semplice/Completo/Zero Stress) + upsell
│   ├── Box Prezzo Trasparente (onorario+IVA, imposte a parte)
│   ├── Regole di sovrapprezzo esplicite
│   ├── Riga "Caso particolare?" -> preventivo su misura (no prezzo, no 4o pacchetto)
│   ├── Box "Ti serve davvero la successione?" (onesta/verifica gratuita)
│   ├── Guida alla scelta del pacchetto + invito a chiamata di riallineamento
│   ├── "Cosa ricevi a fine pratica" (deliverable)
│   └── "Vedi esempio" documenti finali
│
├── /come-funziona (processo 3 step, tempi/SLA)
│
├── /chi-sono
│   ├── Ritratto + foto studio
│   ├── Bio 1a persona, Albo, link istituzionali (E-E-A-T)
│   ├── Indirizzo studio + mappa (Via Vittorio Veneto 31, Pontedera)
│   └── Motto latino (tocco "colto")
│
├── /guide (indice blog SEO)
│   └── /guide/[slug] (articolo: nazionali, locali Toscana, stranieri in Italia @09)
│
├── /faq (set completo domande: "Set FAQ definitivo", schema FAQPage)
│
├── /contatti (indirizzo, mappa, orari, form contatto standard)
│
├── /preventivo (form multi-step @04)
│   └── /preventivo/grazie (thank-you, evento generate_lead)
│
├── /checkout (pagamento pacchetto Stripe @04/@06)
│
├── /area-riservata  ──► APP CLIENTE (@06): login passwordless, dashboard, documenti, dati, mandato, profilo
│
├── HUB LEGALE
│   ├── /privacy
│   ├── /cookie-policy
│   ├── /termini-condizioni (condizioni di vendita)
│   ├── /garanzia (rimborso)
│   └── /recesso (diritto di recesso spiegato in modo chiaro)
│
├── SERVIZIO
│   └── /404
│
└── /admin  ──► CRM "Flowdesk - Armellin" (@05): app interna, tema dark, accesso solo ADMIN
```

### Header (navigazione globale)
- Sticky, pulito. Logo a sinistra.
- Voci: Come Funziona, Tariffe, Chi Sono, Guide, FAQ, Contatti.
- CTA primaria sempre visibile: "Calcola Preventivo" -> `/preventivo`.
- Mobile: menu hamburger + CTA persistente (barra/azione fissa in basso).
- **Selettore lingua** (multilingua, requisito @07): IT default + EN, AR, DE, ES, RU, TR, ZH (semplificato), HI, SQ, FR + eventuale gruppo africano (somalo/amarico/tigrino/wolof, da confermare). Mostrare le lingue con nome nativo; persistere la scelta.

### Multilingua e indicizzazione (requisito)
- Rotte localizzate per sotto-percorso `/[locale]` (es. `/en/tariffe`); contenuti tradotti professionalmente per le pagine core.
- SEO: `hreflang` per ogni lingua + `x-default`, sitemap per locale, title/meta e slug tradotti, dati strutturati localizzati (@09).
- Arabo in **RTL** (`dir="rtl"`): layout con proprieta logiche; font per script non-latini (@02/@SPEC_Design_Tokens).
- Obiettivo: intercettare gli stranieri residenti in Italia (nicchia poco presidiata).

### Wireframe Homepage (sezioni, in ordine)
1. Hero: headline-promessa, sub-headline-beneficio, CTA primaria ("Inizia la Pre-Valutazione Gratuita") + secondaria ("Scopri come funziona"). Design pulito, no foto stock tristi. Messaggio di SPECIALIZZAZIONE in evidenza (es. "Il geometra specializzato nelle successioni") come differenziatore (spunto Successione24).
2. Trust Bar: iscrizione Albo Geometri, **abilitazione Entratel (invio telematico AdE)**, **supervisione fiscale di un commercialista**, pagamenti sicuri (Stripe), conformita GDPR, SSL. (Il segnale "commercialista" gestisce la barriera di percezione geometra vs commercialista, @02; claim veritiero, @10.)
3. Problema/Soluzione (empatia): riconosce lo stress della burocrazia + 3 vantaggi (zero code, zero errori/sanzioni, assistenza umana).
4. Come Funziona (3 step): Questionario -> Upload documenti -> Pratica completata. Visivo, scroll-triggered sobrio. Includere tempi/SLA dichiarati e realistici (spunto "24h" dei competitor, ma onesti: es. "invio entro X giorni dalla documentazione completa").
5. Tariffe (3 card): Semplice 290, Completo 490 (evidenziato "il piu scelto"), Zero Stress 790. Box trasparenza onorario vs imposte di Stato.
6. Anti-obiezione "Perche non farlo da soli?" (vedi sotto): confronto onesto fai-da-te (Agenzia) vs servizio assistito. Disinnesca il competitor a costo zero.
7. Recensioni (riprova sociale): widget recensioni Google + estratti reali (E-E-A-T).
8. Chi Sono (estratto): foto professionale + bio breve, link a `/chi-sono`. Include un breve **video di benvenuto di Lorenzo** (60-90s, prima persona) come blocco "umano" - decisione presa (spunto Successione24). Tecnica: no autoplay con audio, lazy-load con poster (facade) per le Core Web Vitals, sottotitoli multilingua (@07). Concept di produzione: `shooting/Concept_Shooting_Lorenzo.md`.
9. FAQ (accordion): il sottoinsieme [HOME] (~10 voci) del "Set FAQ definitivo" qui sotto, con link "Tutte le domande" a `/faq`. Tono empatico, risposte brevi; "Posso disdire/essere rimborsato?" linka a `/recesso`.
10. CTA finale: ripresa della pre-valutazione.
11. Footer.

### Blocco anti-obiezione "Perche non farlo da soli?" (sezione 6)
- Scopo: neutralizzare il competitor piu insidioso, ossia la Successione precompilata web dell'Agenzia delle Entrate (gratuita e ufficiale). Non si compete sul prezzo (loro sono a 0), ma sul valore: tempo, certezza, assenza di rischio.
- Tono: onesto e rispettoso (mai sminuire l'opzione gratuita: ammettere che esiste aumenta la fiducia), poi mostrare perche conviene delegare.
- Formato consigliato: mini-tabella comparativa a 2 colonne "Da solo (Agenzia)" vs "Con il Geom. Armellin".
  - Da solo: serve SPID/CIE e competenza; la precompilata propone i dati ma non li valida; nessuna assistenza; errori e sanzioni a carico tuo; copre solo il deposito fiscale (non banche/volture complesse/casi non lineari); costo in ore e ansia.
  - Con noi: ci pensiamo noi; controllo di un geometra abilitato; assistenza umana dedicata; gestione completa (Agenzia, Catasto, banche); garanzia/rimborso; tu non perdi tempo.
- Chiusura: CTA verso la pre-valutazione ("Scopri quanto costa togliersi il pensiero").
- Nota copy: messaggio chiave = "Si puo fare gratis da soli. Ma il tempo, e gli errori, li paghi tu."

### Set FAQ definitivo (homepage + `/faq`, schema FAQPage)
> Questo e il testo sorgente delle FAQ (seed della tabella `faqs`, gestibili poi dal CMS @05/@07). Tono empatico e chiaro, niente burocratese (@02). I valori fiscali derivano da `RIFERIMENTO_Successioni_Modello_e_Normativa.md` e sono presentati come indicativi (la valutazione del caso concreto e sempre confermata da Lorenzo - YMYL). [HOME] = mostrata anche nel sottoinsieme in homepage (~10); tutte vanno su `/faq` con markup FAQPage (@09). Lingua sorgente IT (fa fede), traduzioni AI (@07).

**Capire se/quando serve**
1. **Cos'e la dichiarazione di successione e a cosa serve?** E l'adempimento con cui si comunica all'Agenzia delle Entrate il patrimonio (immobili, conti, beni) lasciato da chi e venuto a mancare e come passa agli eredi. Serve a calcolare e versare le imposte dovute e, se ci sono immobili, ad aggiornarne l'intestazione al Catasto (voltura). Non e un'accettazione di eredita e va presentata entro 12 mesi dal decesso.
2. **Sono sempre obbligato a farla? E se l'eredita e piccola e senza immobili?** [HOME] Non sempre. La legge (art. 28, c.7 TUS) prevede l'esonero quando ricorrono insieme: eredita al coniuge e/o parenti in linea retta (figli, genitori), attivo non oltre 100.000 EUR e nessun immobile o diritto reale immobiliare. In quel caso puo non essere dovuta. Noi te lo diciamo prima, gratis: se non ti serve, te lo diciamo (la verifica definitiva e sul caso concreto).
3. **Entro quanto va presentata e cosa rischio se sono in ritardo?** Entro 12 mesi dalla data del decesso. Oltre il termine ci sono sanzioni e interessi (riducibili con il ravvedimento). Conviene non aspettare: finche non e presentata, conti e immobili restano di fatto bloccati.
4. **Serve il notaio?** [HOME] No. La dichiarazione la predispone e la trasmette in via telematica un intermediario abilitato - nel nostro caso il Geom. Armellin. Il notaio serve solo per atti successivi (es. vendere un immobile ereditato), non per la dichiarazione.

**Costi e trasparenza**
5. **Quanto costa il servizio e cosa e incluso?** [HOME] I prezzi dei pacchetti sono chiari nella pagina Tariffe; il prezzo e l'onorario professionale (IVA e Cassa indicate a parte). In base al pacchetto include predisposizione, controllo dei dati catastali, invio telematico e, dove previsto, la voltura. Le imposte di Stato sono separate (vedi sotto). Per i casi complessi facciamo un preventivo su misura.
6. **Le imposte di successione le pagate voi? Quanto sono?** [HOME] No: le imposte dovute allo Stato non sono nell'onorario e non applichiamo alcun ricarico. Le calcoliamo e te le comunichiamo PRIMA dell'invio. In sintesi (con immobili): imposta di successione solo sulla parte oltre la franchigia (coniuge/figli/genitori 4% oltre 1.000.000 EUR per erede; fratelli/sorelle 6% oltre 100.000 EUR; altri parenti 6%; estranei 8%, senza franchigia); se ci sono immobili, ipotecaria 2% e catastale 1% del valore catastale (minimo 200 EUR ciascuna), oppure 200 EUR fisse ciascuna con agevolazione prima casa; piu bollo e tributi fissi. Dal 2025 l'imposta e in autoliquidazione (la versi tu con F24). Molte successioni tra familiari diretti non pagano l'imposta di successione perche sotto la franchigia.
7. **E se scelgo il pacchetto sbagliato?** Nessun problema: si cambia in qualsiasi momento e si regola solo la differenza - se passi a uno superiore paghi la differenza con un link sicuro, se a uno inferiore te la rimborsiamo. Spesso lo capiamo gia durante la chiamata, in cui Lorenzo ti aiuta a scegliere quello giusto.
8. **Posso pagare a rate?** L'onorario si puo pagare a rate/BNPL (es. PayPal, Klarna/Scalapay) al checkout, dove disponibile. Le imposte di Stato restano sempre a parte e si versano secondo le scadenze di legge.

**Perche affidarsi (anti-obiezione)**
9. **Posso farla gratis da solo sul sito dell'Agenzia? Perche affidarmi a voi?** [HOME] Si, esiste la "successione precompilata" gratuita: e un'opzione vera e onesta. Pero richiede SPID/CIE e competenza, propone i dati ma non li valida, non offre assistenza e gli eventuali errori (e sanzioni) restano a tuo carico. Con noi se ne occupa un geometra abilitato che controlla i dati catastali e ti segue passo passo. Si puo fare gratis da soli: ma il tempo, e gli errori, li paghi tu.
10. **Cosa rischio se sbaglio la dichiarazione?** Una dichiarazione errata o incompleta puo portare sanzioni, richieste di integrazione e ritardi nello sblocco di conti e immobili; correggere dopo e piu complicato. Il nostro lavoro serve proprio a evitarti questi rischi.
11. **Cosa vi rende diversi da una piattaforma automatica?** [HOME] Dietro non c'e un software che compila da solo: c'e un geometra reale (Lorenzo Armellin) che verifica di persona i dati catastali, gli atti di provenienza e la coerenza dei riferimenti che spesso fanno saltare le pratiche. E la differenza tra un modulo riempito e una pratica fatta bene.

**Come funziona (operativo)**
12. **Come funziona, in pratica?** In 3 passi: 1) compili un breve questionario e ricevi prezzo/preventivo; 2) carichi i documenti nella tua area riservata (ti diciamo noi quali); 3) Lorenzo predispone e invia la dichiarazione e ti consegna ricevute e documenti finali. Tutto online, senza andare in ufficio.
13. **Quali documenti servono e come ve li mando? E se mi manca qualcosa?** [HOME] Ti diamo subito una checklist personalizzata sul tuo caso; carichi i file comodamente dall'area riservata (anche da foto col telefono). Se ti manca qualcosa, spesso possiamo recuperarlo noi (visure, atti, dati catastali). Non devi sapere tutto in anticipo: ti guidiamo noi.
14. **In quanto tempo e pronta?** [HOME] In tempi rapidi, in base alla complessita. Importante: i tempi indicati partono da quando abbiamo TUTTI i documenti completi e corretti - cosi possiamo davvero rispettarli.
15. **Devo recarmi in qualche ufficio o in banca?** No. Si fa tutto a distanza: questionario, documenti e comunicazioni online, invio telematico all'Agenzia. Non devi andare allo sportello.
16. **Posso fare la pratica per un familiare o per conto di un'altra persona?** Si: spesso se ne occupa un figlio o un parente per gli altri eredi. Servono i documenti necessari; gestiamo insieme firme e mandati richiesti.

**Dopo, fiducia e sicurezza**
17. **Cosa ricevo a fine pratica?** I documenti ufficiali: ricevuta di presentazione/registrazione dell'Agenzia, copia della dichiarazione, esito dell'eventuale voltura catastale e la nostra fattura. Tutto nella tua area riservata, scaricabile.
18. **I miei documenti e dati sono al sicuro?** [HOME] Si. Dati e file sono cifrati e conservati su server nell'Unione Europea, con accessi protetti e nel rispetto del GDPR; i documenti sensibili sono minimizzati e conservati solo per il tempo necessario.
19. **Posso disdire o essere rimborsato?** [HOME] Si: hai il diritto di recesso entro 14 giorni e puoi richiederlo direttamente dalla tua area riservata. Se la lavorazione non e ancora iniziata il rimborso e integrale; se e iniziata paghi solo la parte gia svolta. Dettagli nella pagina /recesso.
20. **Parlo con una persona reale?** [HOME] Si, sempre. Niente chatbot: parli direttamente con il Geom. Lorenzo Armellin, che ti spiega tutto e segue la tua pratica.
21. **Gestite anche lo sblocco dei conti in banca e le volture degli immobili?** La dichiarazione e il presupposto per sbloccare i conti e per la voltura catastale degli immobili (inclusa nei pacchetti con immobili). Ti diamo documenti e indicazioni per la banca; lo svincolo materiale lo dispone l'istituto.
22. **Agevolazione "prima casa" in successione: come funziona?** Se almeno un erede ha i requisiti "prima casa", sull'immobile le imposte ipotecaria e catastale si pagano in misura fissa (200 EUR ciascuna) invece che in percentuale. Verifichiamo noi se ne hai diritto.
23. **Offrite assistenza in altre lingue per eredi stranieri?** [HOME] Si: il sito e disponibile in piu lingue e ti seguiamo nella tua. Per scriverci usa pure WhatsApp o email nella tua lingua: ci capiamo senza problemi. Se preferisci parlare, possiamo fare una chiamata con traduzione in tempo reale; i punti importanti (importi, scadenze, documenti) te li confermiamo sempre anche per iscritto. I documenti ufficiali restano in italiano (fa fede l'italiano), ma non resti mai solo a capirli.
24. **Perche un geometra e non un commercialista o un CAF?** [HOME] Perche per la dichiarazione di successione la parte piu delicata sono i **dati catastali** (particelle, subalterni, annessi, atti di provenienza): e li che le pratiche saltano, ed e esattamente il mestiere del geometra. Il Geom. Armellin e **abilitato a trasmettere le successioni all'Agenzia delle Entrate** (intermediario Entratel), quindi e pienamente titolato a farle. In piu ci avvaliamo della **supervisione di un commercialista** sulla parte fiscale: cosi hai competenza catastale e garanzia sui numeri nello stesso servizio.

> Note di implementazione: homepage = le voci [HOME] (~10) in accordion; `/faq` = set completo raggruppato per categoria con markup `FAQPage` (una sola pagina con FAQPage per evitare duplicazioni, @09). Le risposte con valori fiscali linkano alle pagine ufficiali AdE (vedi RIFERIMENTO). I temi piu "informazionali" (cos'e, esonero, prima casa, imposte) diventano anche articoli pillar (@09) con link reciproci.

### Pagina Tariffe (`/tariffe`)
> Contenuti DATA-DRIVEN: prezzi, descrizioni e voci dei pacchetti provengono dalla tabella `packages` gestita da Lorenzo nel CRM (@05/@07); la pagina resta statica/cache e si aggiorna alla pubblicazione (revalidation). Idem FAQ (tabella `faqs`) e testi (`content_entries`).
- 3 card secondo la "Regola del 3", pacchetto centrale evidenziato.
- Per ogni pacchetto: target, prezzo, cosa include, cosa NON include, CTA.
- **Box Prezzo Trasparente** (spunto VisureItalia, vedi ANALISI_COMPETITORS): split esplicito Onorario + IVA + (imposte di Stato a parte) = Totale onorario. Ribadisce che le imposte sono separate e a carico dell'erede (@10).
- **Rassicurazione vicino alle card/CTA**: micro-trust "geometra abilitato Entratel + supervisione fiscale di un commercialista" accanto al prezzo/checkout, per togliere il dubbio "ma e la persona giusta?" nel momento della decisione (@02).
- **Regole di sovrapprezzo esplicite e visibili** (no sorprese): es. +60 EUR per immobile aggiuntivo; eventuali soglie standard (n. eredi/immobili) dichiarate.
- **Tempi di consegna per pacchetto (SLA)**, dichiarati con onesta: "invio della dichiarazione entro **X giorni lavorativi dalla documentazione completa**" (NON dal pagamento). Proposta (da confermare con Lorenzo, `packages.sla_days`): Semplice 5 gg lav., Completo 10 gg lav., Zero Stress 3 gg lav. (corsia prioritaria), Su misura concordato nel preventivo. Esclusi i tempi degli enti terzi (AdE/Catasto/banche).
- **"Cosa ricevi a fine pratica" (deliverable)**: lista concreta dei documenti finali (ricevuta di presentazione/registrazione AdE, copia conforme/attestazione, esito F24, voltura catastale, fattura). Rende tangibile il valore.
- **"Vedi esempio"**: anteprima/fac-simile dei documenti finali per ridurre l'incertezza.
- Upsell visibili (es. Riunione di Usufrutto 150).
- **Nota "paghi a rate"**: accenno alle rate/BNPL (PayPal Pay in 3, Klarna, Scalapay) vicino ai prezzi, con dettaglio completo al checkout; si rateizza l'onorario, non le imposte (@04/@07).
- **Riga "Caso particolare?" (preventivo su misura)** sotto le 3 card, con peso visivo minore (non e un 4o pacchetto): "Piu immobili, terreni agricoli, annessi, testamento o eredi all'estero? Richiedi un preventivo su misura" -> CTA verso preventivo/chiamata, SENZA prezzo. Gestisce i casi oltre Zero Stress (>~800 EUR) senza rompere la "Regola del 3" (vedi Esito C in @04/@05).
- **Box "Ti serve davvero la successione?"**: nota onesta e di fiducia (spunto Riunione 1): in alcuni casi (solo liquidita modesta, eredi diretti, nessun immobile) la dichiarazione potrebbe non essere dovuta. "Te lo diciamo noi, gratis, prima di farti pagare" -> CTA verso il form/verifica (Esito A in @04). Differenziatore: nessun competitor scoraggia un acquisto non necessario.
- **Guida alla scelta del pacchetto** (appendice chiara e strutturata): link visibile vicino alle card e richiamato al checkout, con invito a una chiamata di riallineamento col geometra. Aiuta a scegliere giusto; il cambio pacchetto con conguaglio resta la rete di sicurezza (@05).

### Guida ai documenti necessari (`/documenti-successione`)
> Strumento pre-acquisto (spunto competitor + Riunione 1): far capire SUBITO, prima di pagare, quali documenti servono. Riduce l'ansia ("e complicato?"), aumenta la fiducia e la conversione, e prepara il cliente cosi a valle ci sono meno rimbalzi. Stesso motore della checklist post-vendita -> coerenza totale.
- **Motore unico**: la lista deriva dal `document_catalog` filtrato per pertinenza (`relevance_rule`) sulle risposte dell'utente - la STESSA funzione che genera la checklist dopo il pagamento (@05/@06). Cosi "quello che ti diciamo prima" = "quello che caricherai dopo".
- **Due modalita sulla stessa pagina**:
  1. **Interattiva** (mini-domande non vincolanti: ci sono immobili? testamento? eredi minorenni? terreni/altri beni?) -> mostra la **lista personalizzata** "Ecco cosa ti servira", raggruppata (documenti base / se immobili / se testamento / se minori...). Ogni voce con **"cos'e e come si ottiene"** (help_text dal catalogo).
  2. **Evergreen/SEO**: sotto, la guida completa dei documenti tipici sempre visibile (indicizzabile per query tipo "documenti per la dichiarazione di successione"), data-driven dallo stesso catalogo.
- **Azioni**: CTA "Calcola il preventivo" (porta al form @04, riusando le risposte gia date), "Scarica la lista (PDF)" e "Ricevila via email" (lead soft). Hook sul valore di Lorenzo: "Non trovi un documento? **Lo recuperiamo noi**" (visure/atti/recupero documentale - USP geometra).
- **Framing YMYL (importante)**: la lista e **indicativa** e si adatta ai dati inseriti; la **lista definitiva e confermata da Lorenzo** dopo la verifica del caso. Nessuna promessa di completezza (coerente con @10).
- **Contenuti data-driven/CMS**: etichette e istruzioni dei documenti sono gestite da Lorenzo dal CRM (catalogo documenti + CMS @05/@07); pagina statica/cache con revalidation alla pubblicazione (@07).
- **Collegamenti**: linkata da Come Funziona, Tariffe, FAQ ("Quali documenti servono?") e richiamata nella thank-you (@04).

### Pagina Chi Sono (`/chi-sono`)
- Ritratto professionale + foto studio (no foto citta in home, indirizzo come ancora di fiducia).
- Bio in prima persona, iscrizione albo, link istituzionali (E-E-A-T).
- **Blocco "Il team / la nostra garanzia"**: Lorenzo (geometra abilitato Entratel, volto e nome) + **supervisione fiscale di un commercialista**. Spiega la doppia competenza (catasto + fisco) e la responsabilita chiara (predispone e trasmette Lorenzo). Claim veritieri e proporzionati al reale coinvolgimento (@02/@10).
- Indirizzo studio (confermato): Via Vittorio Veneto 31, 56025 Pontedera (PI), eventuale mappa.
- Tocco "colto" (al posto di latino/greco come lingue del sito): un breve **motto latino** elegante con traduzione italiana (es. su eredita/famiglia/affidabilita), come elemento di autorevolezza sobria. NON e una lingua del sito, solo un dettaglio editoriale.

### Hub legale
- Privacy Policy, Cookie Policy, Termini/Condizioni di vendita, pagina Garanzia rimborso (vedi @10).
- Banner consensi (CMP) con Consent Mode v2 (vedi @08/@10).

### Pagina "Diritto di recesso" (`/recesso`)
- Spazio dedicato che spiega al cliente, in linguaggio chiaro e trasparente (no legalese), come funziona il recesso. Complementare alle T&C (che restano il testo formale).
- Contenuti: cos'e il recesso e i 14 giorni; cosa cambia se si chiede l'avvio immediato della lavorazione (consenso + perdita del recesso a servizio completato); cosa succede se si recede a lavoro iniziato ma non finito (pagamento proporzionale); come si esercita (email/PEC + modulo tipo scaricabile); tempi di rimborso; differenza tra recesso di legge e garanzia "Soddisfatti o Rimborsati".
- Tono: rassicurante e onesto (coerente con il brand YMYL). Eventuale mini-FAQ.
- Collegamenti: linkata dal checkout (accanto alle checkbox di consenso), dal footer, dalle T&C e richiamata nell'area riservata. Testo bozza: `bozze_legali/Recesso_e_Checkout_IT_BOZZA.md` (sezione "Testo pagina pubblica /recesso").

### Footer (globale)
- Recapiti completi, P.IVA, n. iscrizione Albo, indirizzo studio.
- **Micro-segnale di fiducia**: riga sobria "Geom. abilitato Entratel · supervisione fiscale di un commercialista" (coerente con la Trust Bar; claim veritiero, @02/@10).
- Menu secondario: pagine legali (Privacy, Cookie Policy, Termini/Condizioni, Garanzia, **Recesso**), contatti, link rapidi.
- Credit di realizzazione: "AT STUDIO" (es. "Realizzato da AT STUDIO" o "© [anno] · AT STUDIO"), in piccolo, tono sobrio; opzionale link al sito dello studio. Da confermare wording/URL esatti (DOMANDE_PER_LORENZO).

### Accessibilita (requisito)
- Target WCAG 2.2 livello AA: contrasto adeguato, testo ridimensionabile, navigazione da tastiera, focus visibili, HTML semantico, alt text, label dei form.
- Motivazione: utenza over-50 e possibile applicabilita dell'European Accessibility Act.

### SEO on-page (cenni, dettaglio in @09)
- Una pagina = un intento di ricerca; title/meta/heading coerenti.
- Dati strutturati schema.org: LocalBusiness (studio), Product/Offer (pacchetti), FAQPage (FAQ).

---

## Idee future
- Calcolatore informativo "stima imposte" guidato (solo se reso robusto e con forti disclaimer) - vedi nodo.
- Pagina "Recensioni" dedicata con storie/casi (anonimizzati).
- Landing page dedicate per campagne Ads (locale vs nazionale) coerenti con i Sitelink (@09).
- (Multilingua: ora e un REQUISITO, vedi sezione dedicata e @07; non piu solo idea futura.)

---

## Nodi da sciogliere
- Lead magnet: confermare che in v1 sia SOLO la pre-valutazione (preventivo onorario) e che il "calcolo imposte" resti guida informativa, non calcolatore automatico (raccomandato per rischio YMYL). Decisione di prodotto.
- Come funziona/FAQ: pagina autonoma + sezione home, oppure solo ancore in home? (proposta: entrambe per SEO).
- Presenza e posizione del widget recensioni (Google vs Trustpilot) - dipende da @09 e dalle 20 recensioni iniziali.

## Passi successivi
- [ ] Validare la sitemap e le voci di menu definitive.
- [ ] Definire i testi (copy) della Hero e delle sezioni home (coordinare con @02 tono di voce).
- [ ] Definire contenuti pagina Tariffe con i prezzi gia decisi (@01).
- [ ] Stendere l'elenco FAQ iniziale (abbatte le obiezioni d'acquisto).
- [ ] Definire i requisiti dati strutturati schema.org (@09).

---

## Decisioni congelate (lock-in)
- Imbuto a sezioni: Hero -> Trust -> Problema/Soluzione -> Come Funziona -> Tariffe -> Anti-obiezione (fai-da-te vs noi) -> Recensioni -> Chi Sono -> FAQ -> CTA -> Footer.
- Pagine autonome: Tariffe, Chi Sono, Guide, Contatti, hub legale.
- CTA primaria unica e coerente: "Calcola Preventivo" / "Inizia la Pre-Valutazione" -> `/preventivo`.
- Mobile-first con header sticky e CTA persistente.
- Accessibilita target WCAG 2.2 AA.
- Niente foto stock tristi; foto reali di Lorenzo e studio.

---

## Rischi / Compliance & Riferimenti
- Rischio YMYL: un calcolatore imposte impreciso danneggia fiducia e ranking; in v1 si evita il calcolo automatico (vedi nodo).
- Rischio performance: troppe animazioni in home penalizzano i Core Web Vitals (@07).
- Rischio legale: assenza o link mancanti alle pagine legali/CMP (@10).
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezioni struttura sito, struttura ad albero, brand identity).
