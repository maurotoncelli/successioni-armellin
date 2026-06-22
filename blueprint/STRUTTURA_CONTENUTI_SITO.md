# STRUTTURA CONTENUTI SITO (scheletro + testi segnaposto)

> Documento di SUPPORTO della Bibbia. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).
> Scopo: avere CHIARISSIMO ogni singolo blocco di ogni pagina, con testo SEGNAPOSTO [BOZZA], prima di costruire. E lo scheletro da cui deriva il registro tecnico `SPEC_Content_Blocks` (naming `collection.key`) e che guida design e sviluppo.
> Stato: Bozza completa (tutte le pagine pubbliche mappate) · Ultimo aggiornamento: 2026-06-22
> Dipendenze: @02 (tono/brand), @03 (IA/rotte), @09 (SEO/E-E-A-T), @10 (claim YMYL), SPEC_Data_Model (content_entries), RIFERIMENTO_Successioni (fatti fiscali).

## Come leggere questo documento
- Ogni pagina = sequenza di **blocchi numerati**. Ogni blocco ha: **nome umano**, chiave tecnica **`collection.key`**, **tipo** del contenuto e **testo segnaposto [BOZZA]**.
- Tipi: `string` (riga breve) · `richtext` (paragrafo) · `list` (elenco di item strutturati) · `cta` ({label, href}) · `image_ref` (immagine dal CMS) · `object` (campi multipli) · `bool`.
- I testi [BOZZA] sono provvisori e da rifinire/validare (copy YMYL: i fatti fiscali rimandano a RIFERIMENTO_Successioni; claim "geometra + commercialista" veritieri, @10).
- Contenuti STRUTTURATI (pacchetti, add-on, FAQ, immagini) vivono nelle loro tabelle/manager (`packages`, `addons`, `faqs`, `media_assets`): qui si citano, non si duplicano.
- Lingua sorgente: IT (fa fede); le altre via AI (@07).

---

## Elementi globali (presenti su tutte le pagine pubbliche)

### G1. Navbar `navbar.*`
- `navbar.logo` (image_ref) - logo studio, link a Home.
- `navbar.menu` (list) - voci (allineate a @03): [BOZZA] "Come funziona", "Tariffe", "Chi sono", "Guide", "FAQ", "Contatti".
- `navbar.cta` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.
- `navbar.cta_phone` (cta) - [BOZZA] { label: "Parla con Lorenzo", href: "tel:+39..." } - dato il modello "c'e sempre una chiamata" (@05), un contatto telefonico ben visibile.
- `navbar.lang_switcher` (object) - selettore lingua (requisito @03/@07): mostra le lingue col nome nativo, persiste la scelta; IT default + EN, AR (RTL), DE, ES, RU, TR, ZH, HI, SQ, FR (+ gruppo africano da confermare).

### G1-bis. CTA mobile persistente `globals.mobile_cta`
- (cta) - barra azione fissa in basso su mobile (@03): [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" } + icona telefono.

### G2. Trust Bar `home.trustbar_items` (riusata anche altrove)
- (list) - badge di fiducia: [BOZZA] ["Geometra iscritto all'Albo", "Abilitato Entratel (invio telematico AdE)", "Supervisione fiscale di un commercialista", "Pagamenti sicuri Stripe", "Conforme GDPR", "SSL"].

### G3. Footer `footer.*`
- `footer.studio` (object) - [BOZZA] { ragione_sociale: "Geom. Lorenzo Armellin", piva: "—", albo: "Collegio di Pisa n. 1969", indirizzo: "Via Vittorio Veneto 31, 56025 Pontedera (PI)" }.
- `footer.trust_line` (string) - [BOZZA] "Geom. abilitato Entratel - con supervisione fiscale di un commercialista".
- `footer.legal_menu` (list) - [BOZZA] ["Privacy", "Cookie Policy", "Termini e Condizioni", "Garanzia", "Recesso"].
- `footer.credit` (string) - [BOZZA] "Realizzato da AT STUDIO".

### G4. Banner consensi (CMP) - gestito da iubenda (non editabile come blocco, @10).

---

## PAGINA: Home `/` (collection `home`)

### 1. Hero `home.hero_*`
- `home.hero_title` (string) - [BOZZA] "La tua pratica di successione, senza muoverti da casa."
- `home.hero_subtitle` (richtext) - [BOZZA] "Ci pensa il Geom. Lorenzo Armellin, specializzato in successioni: prezzo chiaro, tutto online, una persona reale che ti segue. Le imposte le calcoliamo noi, prima di farti pagare."
- `home.hero_cta_primary` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.
- `home.hero_cta_secondary` (cta) - [BOZZA] { label: "Scopri come funziona", href: "#come-funziona" }.
- `home.hero_image` (image_ref) - ritratto/visual (no foto stock).
- `home.hero_specialization_badge` (string) - [BOZZA] "Il geometra specializzato nelle successioni".

### 2. Trust Bar
- usa `home.trustbar_items` (vedi G2).

### 2-bis. Riprova sociale a numeri `home.social_proof_*` (E-E-A-T, @01/@09)
- `home.social_proof_stats` (list) - [BOZZA] [{valore: "oltre X", label: "successioni seguite"}, {valore: "X anni", label: "di esperienza"}, {valore: "4,X/5", label: "valutazione media Google"}]. Valori da confermare con Lorenzo (DOMANDE).

### 3. Problema / Soluzione (empatia) `home.problema_*`
- `home.problema_title` (string) - [BOZZA] "Una successione, mille dubbi. Te la togliamo dalle spalle."
- `home.problema_intro` (richtext) - [BOZZA] "Sappiamo che arriva in un momento difficile. Alla burocrazia pensiamo noi."
- `home.problema_vantaggi` (list) - [BOZZA] 3 voci: [{titolo: "Zero code", testo: "Fai tutto da casa, anche da telefono."}, {titolo: "Zero errori e sanzioni", testo: "Controllo tecnico dei dati catastali da un geometra abilitato."}, {titolo: "Assistenza umana", testo: "Parli sempre con una persona reale, non con un bot."}].

### 4. Come Funziona `home.come_funziona_*` (ancora #come-funziona)
- `home.come_funziona_title` (string) - [BOZZA] "Come funziona, in 3 passi".
- `home.come_funziona_steps` (list) - [BOZZA] [{icona, titolo: "1. Rispondi a poche domande", testo: "Ti diciamo subito di cosa hai bisogno e quanto costa."}, {icona, titolo: "2. Carichi i documenti", testo: "Dalla tua area riservata, anche da foto. Ti diamo la lista esatta."}, {icona, titolo: "3. Pensiamo a tutto noi", testo: "Predisponiamo e inviamo la dichiarazione; tu ricevi le ricevute."}].
- `home.come_funziona_sla_note` (string) - [BOZZA] "Invio entro X giorni lavorativi da quando abbiamo tutti i documenti completi."

### 5. Tariffe (estratto) `home.tariffe_*`
- `home.tariffe_title` (string) - [BOZZA] "Prezzi chiari, senza sorprese".
- `home.tariffe_intro` (richtext) - [BOZZA] "Paghi un onorario fisso. Le imposte di Stato sono separate, a carico dell'erede, e te le calcoliamo noi."
- (le 3 card vengono da `packages`; qui solo titolo/intro + CTA)
- `home.tariffe_cta` (cta) - [BOZZA] { label: "Vedi i pacchetti", href: "/tariffe" }.

### 6. Anti-obiezione "Perche non farlo da soli?" `home.faidate_*`
- `home.faidate_title` (string) - [BOZZA] "Si puo fare gratis da soli sul sito dell'Agenzia. Allora perche noi?"
- `home.faidate_intro` (richtext) - [BOZZA] "E vero, esiste la successione precompilata gratuita: e un'opzione onesta. Ma richiede SPID e competenza, non valida i dati e gli errori (e le sanzioni) restano a carico tuo."
- `home.faidate_confronto` (list) - [BOZZA] confronto a 2 colonne (Fai-da-te vs Con noi): [{voce: "Controllo dati catastali", faidate: "A carico tuo", noi: "Lo fa un geometra"}, {voce: "Calcolo imposte", faidate: "Da solo", noi: "Lo facciamo noi, prima"}, {voce: "Assistenza", faidate: "Nessuna", noi: "Una persona reale"}, {voce: "Rischio sanzioni", faidate: "Tuo", noi: "Gestito"}].

### 7. Recensioni `home.recensioni_*`
- `home.recensioni_title` (string) - [BOZZA] "Cosa dicono i clienti".
- `home.recensioni_intro` (string) - [BOZZA] "Persone vere, pratiche reali."
- (gli item arrivano dal widget recensioni Google, @09).

### 8. Chi Sono (estratto) `home.chisono_*`
- `home.chisono_title` (string) - [BOZZA] "Chi si occupa della tua pratica".
- `home.chisono_estratto` (richtext) - [BOZZA] "Sono Lorenzo Armellin, geometra abilitato a trasmettere le successioni all'Agenzia delle Entrate. Con la supervisione fiscale di un commercialista, unisco la precisione sui dati catastali alla sicurezza sui numeri."
- `home.chisono_video` (image_ref/video) - video di benvenuto 60-90s (no autoplay audio, @03).
- `home.chisono_cta` (cta) - [BOZZA] { label: "Conosci Lorenzo", href: "/chi-sono" }.

### 9. FAQ (estratto) `home.faq_*`
- `home.faq_title` (string) - [BOZZA] "Domande frequenti".
- (le voci [HOME] vengono da `faqs`; @03/@09).
- `home.faq_cta` (cta) - [BOZZA] { label: "Tutte le domande", href: "/faq" }.

### 10. CTA finale `home.cta_finale_*`
- `home.cta_finale_title` (string) - [BOZZA] "Pronto a toglierti il pensiero?"
- `home.cta_finale_subtitle` (string) - [BOZZA] "Preventivo gratuito in pochi minuti. Soddisfatti o rimborsati." (richiama la garanzia, @10/garanzia)
- `home.cta_finale_button` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.
- `home.cta_finale_phone` (cta) - [BOZZA] { label: "Oppure chiama Lorenzo", href: "tel:+39..." }.

---

## PAGINA: Tariffe `/tariffe` (collection `tariffe`)
> Contenuti DATA-DRIVEN: prezzi, voci e descrizioni dei pacchetti/add-on vengono da `packages`/`addons` (CMS @05/@07). Qui i testi di contorno (`content_entries`). Pagina statica/cache con revalidation alla pubblicazione (@07).

### 1. Hero pagina `tariffe.hero_*`
- `tariffe.hero_title` (string) - [BOZZA] "Prezzi chiari. Quello che vedi e quello che paghi."
- `tariffe.hero_subtitle` (richtext) - [BOZZA] "Un onorario fisso per pacchetto, deciso prima. Le imposte di Stato sono separate e te le calcoliamo noi, senza ricarichi. Per i casi particolari, un preventivo su misura."

### 2. Card pacchetti (da `packages`)
- (list, fonte `packages`) - 3 card "Regola del 3", centrale evidenziato "il piu scelto". Per ogni card: nome, target, prezzo (onorario), "cosa include", "cosa NON include", `sla_days`, CTA. NON si scrive qui: gestito nel CRM.
- `tariffe.card_badge_popolare` (string) - [BOZZA] "Il piu scelto".

### 3. Box Prezzo Trasparente `tariffe.box_trasparenza_*` (spunto VisureItalia)
- `tariffe.box_trasparenza_title` (string) - [BOZZA] "Come si compone il prezzo".
- `tariffe.box_trasparenza_body` (richtext) - [BOZZA] "Il prezzo del pacchetto e l'onorario professionale (IVA e Cassa indicate a parte). Le imposte di Stato (successione, ipotecaria, catastale, bolli) sono separate, a carico dell'erede, e si versano con F24: te le calcoliamo e comunichiamo PRIMA dell'invio. Non applichiamo alcun ricarico sulle imposte."
- `tariffe.box_trasparenza_split` (object) - [BOZZA] schema visivo: Onorario + IVA/Cassa = Totale onorario · ( + Imposte di Stato a parte ).

### 4. Regole di sovrapprezzo `tariffe.sovrapprezzo_*`
- `tariffe.sovrapprezzo_title` (string) - [BOZZA] "Quando il prezzo puo variare (lo diciamo prima)".
- `tariffe.sovrapprezzo_list` (list) - [BOZZA] [{voce: "Immobile aggiuntivo", importo: "+60 EUR cad. (da confermare)"}, {voce: "Terreni/annessi agricoli", importo: "secondo complessita"}, {voce: "Eredi oltre soglia standard", importo: "secondo complessita"}]. Valori da confermare con Lorenzo (DOMANDE).

### 5. Tempi di consegna per pacchetto (SLA) `tariffe.sla_*`
- `tariffe.sla_title` (string) - [BOZZA] "Tempi di consegna".
- `tariffe.sla_note` (richtext) - [BOZZA] "Indichiamo l'invio della dichiarazione entro X giorni lavorativi dalla documentazione COMPLETA (non dal pagamento): cosi e una promessa che possiamo davvero mantenere. Sono esclusi i tempi di enti terzi (Agenzia, Catasto, banche)." I valori `sla_days` per pacchetto vengono da `packages` (proposta: Semplice 5 / Completo 10 / Zero Stress 3 gg lav.).

### 6. Cosa ricevi a fine pratica `tariffe.deliverable_*`
- `tariffe.deliverable_title` (string) - [BOZZA] "Cosa ricevi a fine pratica".
- `tariffe.deliverable_list` (list) - [BOZZA] ["Ricevuta di presentazione/registrazione dell'Agenzia", "Copia della dichiarazione di successione", "Attestazione / esito F24", "Esito della voltura catastale (dove prevista)", "La nostra fattura"]. Tutto scaricabile dall'area riservata.

### 7. "Vedi esempio" documenti finali `tariffe.esempio_*`
- `tariffe.esempio_title` (string) - [BOZZA] "Guarda un esempio dei documenti finali".
- `tariffe.esempio_files` (list, fonte `media_assets`) - fac-simile/anteprime anonimizzate (riduce l'incertezza).

### 8. Upsell / Add-on (da `addons`)
- (list, fonte `addons`) - es. "Riunione di Usufrutto" 150 EUR. Gestiti nel CRM, non scritti qui.
- `tariffe.addon_intro` (string) - [BOZZA] "Servizi aggiuntivi, se ti servono".

### 9. Nota "paghi a rate" (BNPL) `tariffe.rate_*`
- `tariffe.rate_text` (richtext) - [BOZZA] "L'onorario si puo pagare a rate al checkout (PayPal Pay in 3, Klarna, Scalapay, dove disponibili). Si rateizza l'onorario, non le imposte di Stato, che seguono le scadenze di legge."

### 10. Riga "Caso particolare?" -> preventivo su misura `tariffe.su_misura_*`
- (peso visivo minore: NON e un 4o pacchetto)
- `tariffe.su_misura_text` (richtext) - [BOZZA] "Piu immobili, terreni agricoli, annessi, testamento o eredi all'estero? Ogni caso e diverso: ti facciamo un preventivo su misura, senza sorprese."
- `tariffe.su_misura_cta` (cta) - [BOZZA] { label: "Richiedi un preventivo su misura", href: "/preventivo" } (nessun prezzo mostrato; gestisce l'Esito C @04/@05).

### 11. Box "Ti serve davvero la successione?" `tariffe.ti_serve_*` (differenziatore di fiducia)
- `tariffe.ti_serve_title` (string) - [BOZZA] "Forse non ti serve nemmeno. Te lo diciamo gratis."
- `tariffe.ti_serve_body` (richtext) - [BOZZA] "In alcuni casi (eredi diretti, solo liquidita modesta entro le soglie di legge, nessun immobile) la dichiarazione potrebbe non essere dovuta. Verifichiamo il tuo caso prima di farti pagare: se non ti serve, te lo diciamo. La verifica definitiva e sempre sul caso concreto."
- `tariffe.ti_serve_cta` (cta) - [BOZZA] { label: "Verifica gratis il tuo caso", href: "/preventivo" } (Esito A @04).

### 12. Guida alla scelta + chiamata di riallineamento `tariffe.guida_scelta_*`
- `tariffe.guida_scelta_title` (string) - [BOZZA] "Non sai quale scegliere?"
- `tariffe.guida_scelta_body` (richtext) - [BOZZA] "Leggi la guida rapida alla scelta del pacchetto, oppure fai due chiacchiere con Lorenzo: in pochi minuti capisci quello giusto. E se cambi idea, cambiare pacchetto e semplice e regoli solo la differenza."
- `tariffe.guida_scelta_cta_guida` (cta) - [BOZZA] { label: "Guida alla scelta", href: "#guida" }.
- `tariffe.guida_scelta_cta_call` (cta) - [BOZZA] { label: "Parla con Lorenzo", href: "tel:+39..." }.

### 13. Micro-trust vicino a card/CTA `tariffe.microtrust`
- (string) - [BOZZA] "Geometra abilitato Entratel, con supervisione fiscale di un commercialista." (toglie il dubbio "e la persona giusta?" nel momento decisivo, @02).

### 14. CTA finale pagina `tariffe.cta_finale_*`
- `tariffe.cta_finale_title` (string) - [BOZZA] "Pochi minuti per sapere quanto costa, senza impegno."
- `tariffe.cta_finale_button` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.

---

## PAGINA: Chi Sono `/chi-sono` (collection `chi_siamo`)
> Pagina di FIDUCIA / E-E-A-T (@09): volto, nome, credenziali verificabili. Gestisce la barriera "geometra vs commercialista" (@02) con il blocco team. Claim veritieri e proporzionati al reale coinvolgimento (@10).

### 1. Hero / ritratto `chi_siamo.hero_*`
- `chi_siamo.hero_title` (string) - [BOZZA] "Ciao, sono Lorenzo Armellin."
- `chi_siamo.hero_subtitle` (richtext) - [BOZZA] "Geometra abilitato a trasmettere le dichiarazioni di successione all'Agenzia delle Entrate. Dietro questo sito non c'e un software: c'e una persona che segue la tua pratica."
- `chi_siamo.hero_ritratto` (image_ref) - foto professionale (volto), no stock.

### 2. Bio in prima persona `chi_siamo.bio_*`
- `chi_siamo.bio_body` (richtext) - [BOZZA] "Mi occupo di successioni ogni giorno. Da geometra, la mia forza e il controllo dei dati catastali - particelle, subalterni, annessi, atti di provenienza - che e poi il punto dove la maggior parte delle pratiche si blocca. Il mio obiettivo e semplice: toglierti un peso in un momento gia difficile, con prezzi chiari e senza farti girare tra uffici e banche." (testo definitivo da Lorenzo, DOMANDE)

### 3. Credenziali e link istituzionali (E-E-A-T) `chi_siamo.credenziali_*`
- `chi_siamo.credenziali_title` (string) - [BOZZA] "Le mie credenziali".
- `chi_siamo.credenziali_list` (list) - [BOZZA] [{voce: "Iscrizione Albo dei Geometri", dettaglio: "Collegio di Pisa n. 1969 (da confermare)"}, {voce: "Abilitazione Entratel", dettaglio: "Intermediario per l'invio telematico all'Agenzia delle Entrate"}, {voce: "Partita IVA", dettaglio: "—"}]. Dove possibile, link alla verifica pubblica (Albo) per autorevolezza.

### 4. Blocco "Il team / la nostra garanzia" `chi_siamo.team_*` (gestisce barriera percezione, @02)
- `chi_siamo.team_title` (string) - [BOZZA] "Il meglio dei due mondi: geometra + commercialista".
- `chi_siamo.team_body` (richtext) - [BOZZA] "La dichiarazione la predispongo e la trasmetto io, che sono pienamente titolato a farlo. Per la parte fiscale mi avvalgo della supervisione di un commercialista: cosi unisci la precisione catastale di un geometra alla sicurezza sui numeri. Una sola pratica, due competenze."
- `chi_siamo.team_membri` (list) - [BOZZA] [{ruolo: "Geometra abilitato Entratel", nome: "Lorenzo Armellin", focus: "Predispone e invia la pratica, controllo catastale", foto: image_ref}, {ruolo: "Supervisione fiscale", nome: "Commercialista", focus: "Verifica della parte fiscale/imposte", foto: image_ref opzionale}]. Nomi/foto da confermare (DOMANDE).

### 5. Perche un geometra (rassicurazione mirata) `chi_siamo.perche_geometra_*`
- `chi_siamo.perche_geometra_body` (richtext) - [BOZZA] "Molti si aspettano un commercialista, un CAF o un notaio. Per la successione, pero, la parte piu delicata sono i dati catastali: ed e esattamente il mestiere del geometra. Per il deposito serve un intermediario abilitato (Entratel) - lo sono. Il notaio serve solo per atti successivi, non per la dichiarazione." (rimanda alla FAQ 24)

### 6. Studio e contatti `chi_siamo.studio_*`
- `chi_siamo.studio_title` (string) - [BOZZA] "Dove mi trovi".
- `chi_siamo.studio_indirizzo` (object) - [BOZZA] { via: "Via Vittorio Veneto 31", cap: "56025", citta: "Pontedera (PI)" }.
- `chi_siamo.studio_mappa` (object) - embed mappa (lazy-load) dell'indirizzo studio (ancora di fiducia, @03).
- `chi_siamo.studio_nota` (string) - [BOZZA] "Tutto si fa a distanza, ma lo studio esiste davvero: e qui."

### 7. Video di benvenuto `chi_siamo.video_*` (decisione presa, spunto Successione24)
- `chi_siamo.video_ref` (image_ref/video) - video 60-90s in prima persona; no autoplay audio, lazy-load con poster (facade) per le Core Web Vitals, sottotitoli multilingua (@03/@07).
- `chi_siamo.video_caption` (string) - [BOZZA] "Un saluto e due parole su come lavoro (60 secondi)."

### 8. Tocco "colto": motto latino `chi_siamo.motto_*`
- `chi_siamo.motto_latino` (string) - [BOZZA] "(motto latino elegante su eredita/famiglia/affidabilita)".
- `chi_siamo.motto_traduzione` (string) - [BOZZA] "(traduzione italiana)". Elemento editoriale di autorevolezza sobria, NON una lingua del sito (@03).

### 9. Riprova sociale (riuso) `chi_siamo.recensioni_*`
- `chi_siamo.recensioni_title` (string) - [BOZZA] "Cosa dicono di me".
- (item dal widget recensioni Google, @09; riuso del blocco home).

### 10. CTA finale `chi_siamo.cta_finale_*`
- `chi_siamo.cta_finale_title` (string) - [BOZZA] "Vuoi che me ne occupi io?"
- `chi_siamo.cta_finale_button` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.
- `chi_siamo.cta_finale_phone` (cta) - [BOZZA] { label: "Chiamami", href: "tel:+39..." }.

---

## PAGINA: Guida ai documenti `/documenti-successione` (collection `documenti`)
> Strumento PRE-ACQUISTO (spunto competitor + Riunione 1): far capire SUBITO quali documenti servono, prima di pagare. Stesso motore della checklist post-vendita (`document_catalog` + `relevance_rule`, @05/@06) -> coerenza totale "quello che ti diciamo prima = quello che caricherai dopo". Pagina statica/cache con revalidation (@07).

### 1. Hero / intro `documenti.hero_*`
- `documenti.hero_title` (string) - [BOZZA] "Quali documenti servono per la successione?"
- `documenti.hero_subtitle` (richtext) - [BOZZA] "Rispondi a poche domande e ti diciamo subito, gratis, cosa ti servira nel tuo caso. Senza impegno. E se qualcosa non ce l'hai, spesso lo recuperiamo noi."

### 2. Modalita INTERATTIVA `documenti.interattiva_*` (motore unico con la checklist)
- `documenti.interattiva_title` (string) - [BOZZA] "Costruisci la tua lista personalizzata".
- `documenti.interattiva_domande` (list) - mini-domande NON vincolanti (driver del filtro `relevance_rule`): [BOZZA] ["Ci sono immobili (case, terreni, box)?", "C'e un testamento?", "Ci sono eredi minorenni?", "Ci sono conti/investimenti?", "Ci sono terreni agricoli/particelle/annessi?", "Ci sono altri beni (quote, aziende, veicoli)?"].
- `documenti.interattiva_risultato_intro` (string) - [BOZZA] "Ecco cosa ti servira:" (la lista risultante e generata dal `document_catalog`, raggruppata: documenti base / se immobili / se testamento / se minori...). Ogni voce mostra `help_text` "cos'e e come si ottiene" dal catalogo.

### 3. Guida EVERGREEN / SEO `documenti.evergreen_*` (indicizzabile)
- `documenti.evergreen_title` (string) - [BOZZA] "I documenti tipici per la dichiarazione di successione".
- `documenti.evergreen_intro` (richtext) - [BOZZA] "Di seguito i documenti piu comuni. Non tutti servono sempre: dipende dal tuo caso (per quello c'e lo strumento qui sopra)."
- `documenti.evergreen_gruppi` (list, data-driven dal `document_catalog`) - sempre visibile per query tipo "documenti per la dichiarazione di successione"; raggruppata per categoria, etichette/istruzioni gestite dal CRM.

### 4. Hook valore di Lorenzo `documenti.hook_recupero`
- (richtext) - [BOZZA] "Non trovi un documento? Lo recuperiamo noi: visure catastali, atti di provenienza, dati mancanti. E parte del nostro lavoro." (USP geometra, recupero documentale)

### 5. Framing YMYL (obbligatorio) `documenti.disclaimer_ymyl`
- (richtext) - [BOZZA] "Questa lista e indicativa e si adatta ai dati che inserisci. La lista definitiva la conferma Lorenzo dopo aver verificato il tuo caso concreto." (coerente con @10, nessuna promessa di completezza)

### 6. Azioni / CTA `documenti.cta_*`
- `documenti.cta_preventivo` (cta) - [BOZZA] { label: "Calcola il preventivo", href: "/preventivo" } (riusa le risposte gia date, @04).
- `documenti.cta_pdf` (cta) - [BOZZA] { label: "Scarica la lista (PDF)" }.
- `documenti.cta_email` (cta) - [BOZZA] { label: "Ricevila via email" } (lead soft: nome + email + consenso, @10).

### 7. Collegamenti interni `documenti.link_correlati`
- (list) - [BOZZA] linka/da: Come Funziona, Tariffe, FAQ ("Quali documenti servono?"), thank-you del form (@04). (gestione SEO interna, @09)

---

## PAGINA: FAQ `/faq` (testi pagina `faq` · contenuti da `faqs`)
> Le DOMANDE/RISPOSTE sono contenuto DATA-DRIVEN nella tabella `faqs` (gestibili dal CMS @05/@07). La fonte/testo definitivo delle risposte e il "Set FAQ definitivo" in @03 (seed di `faqs`): qui NON si riscrivono, si mappano struttura, categorie, ordine, flag [HOME] e schema. Markup `FAQPage` su una sola pagina per evitare duplicazioni (@09). Valori fiscali = indicativi, da RIFERIMENTO_Successioni (YMYL @10).

### 1. Hero / intro pagina `faq.hero_*`
- `faq.hero_title` (string) - [BOZZA] "Domande frequenti sulle successioni".
- `faq.hero_subtitle` (richtext) - [BOZZA] "Le risposte chiare alle domande che ci fanno piu spesso. Se non trovi la tua, scrivici o chiama Lorenzo: rispondiamo a tutti."
- `faq.hero_search` (bool) - [BOZZA] true (campo di ricerca/filtro tra le FAQ, opzionale).

### 2. Categorie e domande (da `faqs.category` + `faqs.is_home`)
> Ogni voce = record in `faqs` { question, answer (da @03), category, is_home, order, locale }. [HOME] = mostrata anche nel sottoinsieme homepage (~10).

**A. Capire se/quando serve** `faq.cat_capire_intro` (string) - [BOZZA] "Cos'e, quando serve e cosa si rischia."
- 1. Cos'e la dichiarazione di successione e a cosa serve?
- 2. Sono sempre obbligato a farla? E se l'eredita e piccola e senza immobili? **[HOME]**
- 3. Entro quanto va presentata e cosa rischio se sono in ritardo?
- 4. Serve il notaio? **[HOME]**

**B. Costi e trasparenza** `faq.cat_costi_intro` (string) - [BOZZA] "Quanto costa, cosa e incluso e come funzionano le imposte."
- 5. Quanto costa il servizio e cosa e incluso? **[HOME]**
- 6. Le imposte di successione le pagate voi? Quanto sono? **[HOME]**
- 7. E se scelgo il pacchetto sbagliato?
- 8. Posso pagare a rate?

**C. Perche affidarsi (anti-obiezione)** `faq.cat_perche_intro` (string) - [BOZZA] "Si puo fare gratis da soli: ecco perche conviene comunque delegare."
- 9. Posso farla gratis da solo sul sito dell'Agenzia? Perche affidarmi a voi? **[HOME]**
- 10. Cosa rischio se sbaglio la dichiarazione?
- 11. Cosa vi rende diversi da una piattaforma automatica? **[HOME]**
- 24. Perche un geometra e non un commercialista o un CAF? **[HOME]**

**D. Come funziona (operativo)** `faq.cat_come_intro` (string) - [BOZZA] "Il processo, i documenti e i tempi, passo per passo."
- 12. Come funziona, in pratica?
- 13. Quali documenti servono e come ve li mando? E se mi manca qualcosa? **[HOME]**
- 14. In quanto tempo e pronta? **[HOME]**
- 15. Devo recarmi in qualche ufficio o in banca?
- 16. Posso fare la pratica per un familiare o per conto di un'altra persona?

**E. Dopo, fiducia e sicurezza** `faq.cat_dopo_intro` (string) - [BOZZA] "Cosa ricevi, come trattiamo i tuoi dati e le tue tutele."
- 17. Cosa ricevo a fine pratica?
- 18. I miei documenti e dati sono al sicuro? **[HOME]**
- 19. Posso disdire o essere rimborsato? **[HOME]** (linka a `/recesso`)
- 20. Parlo con una persona reale? **[HOME]**
- 21. Gestite anche lo sblocco dei conti in banca e le volture degli immobili?
- 22. Agevolazione "prima casa" in successione: come funziona?
- 23. Offrite assistenza in altre lingue per eredi stranieri? **[HOME]**

### 3. CTA / contatto `faq.cta_*`
- `faq.cta_title` (string) - [BOZZA] "Non hai trovato la risposta?"
- `faq.cta_button` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.
- `faq.cta_phone` (cta) - [BOZZA] { label: "Chiedi a Lorenzo", href: "tel:+39..." }.

### 4. Nota tecnica (non visibile)
- Schema `FAQPage` (JSON-LD) generato dalle voci `faqs` (@09). Risposte con valori fiscali linkano alle pagine ufficiali AdE (RIFERIMENTO_Successioni). I temi informazionali (cos'e, esonero, prima casa, imposte) diventano anche articoli pillar in `/guide` con link reciproci.

---

## PAGINA: Diritto di recesso `/recesso` (collection `recesso`)
> Spiegazione in linguaggio CHIARO (no legalese), complementare alle T&C (che restano il testo formale). Tono rassicurante e onesto (YMYL). Testo bozza di riferimento: `bozze_legali/Recesso_e_Checkout_IT_BOZZA.md`. Linkata da checkout (accanto alle checkbox), footer, T&C e area riservata.

### 1. Hero / intro `recesso.hero_*`
- `recesso.hero_title` (string) - [BOZZA] "Il tuo diritto di recesso, spiegato semplice".
- `recesso.hero_subtitle` (richtext) - [BOZZA] "Vogliamo che tu sia tranquillo. Qui ti spieghiamo in parole chiare come funziona disdire e farti rimborsare. Il testo formale e nelle Condizioni di vendita."

### 2. Cos'e il recesso e i 14 giorni `recesso.cosa_*`
- `recesso.cosa_title` (string) - [BOZZA] "Hai 14 giorni per ripensarci".
- `recesso.cosa_body` (richtext) - [BOZZA] "Come consumatore hai diritto di recedere entro 14 giorni dall'acquisto, senza dover dare spiegazioni. E un tuo diritto di legge."

### 3. Avvio immediato della lavorazione `recesso.avvio_*` (snodo chiave)
- `recesso.avvio_title` (string) - [BOZZA] "Se ci chiedi di iniziare subito".
- `recesso.avvio_body` (richtext) - [BOZZA] "Spesso la successione e urgente (c'e una scadenza di 12 mesi). Se ci chiedi di iniziare prima dei 14 giorni, ti chiediamo un consenso esplicito: significa che, una volta completato il servizio, il diritto di recesso non si applica piu. Se invece la lavorazione e solo iniziata ma non finita, vedi il punto sotto."

### 4. Recesso a lavoro iniziato (non finito) `recesso.iniziato_*`
- `recesso.iniziato_title` (string) - [BOZZA] "E se cambio idea mentre state lavorando?"
- `recesso.iniziato_body` (richtext) - [BOZZA] "Puoi recedere lo stesso: paghi solo la parte di lavoro gia svolta fino a quel momento, in proporzione, e ti rimborsiamo il resto. Niente penali nascoste."

### 5. Come si esercita `recesso.come_*`
- `recesso.come_title` (string) - [BOZZA] "Come si chiede il recesso".
- `recesso.come_body` (richtext) - [BOZZA] "Nel modo piu semplice: dalla tua area riservata trovi il pulsante 'Richiedi recesso'. In alternativa puoi scriverci via email/PEC. Puoi usare il modulo tipo qui sotto, ma non e obbligatorio."
- `recesso.come_cta_area` (cta) - [BOZZA] { label: "Richiedi il recesso dall'area riservata", href: "/area-riservata/recesso" }.
- `recesso.come_modulo` (image_ref/file) - modulo tipo di recesso scaricabile (PDF).

### 6. Tempi di rimborso `recesso.rimborso_*`
- `recesso.rimborso_title` (string) - [BOZZA] "Quando ricevo il rimborso".
- `recesso.rimborso_body` (richtext) - [BOZZA] "Entro i termini di legge (di norma 14 giorni dalla richiesta), con lo stesso metodo di pagamento che hai usato. Le imposte di Stato eventualmente gia versate all'Erario seguono le regole dell'Agenzia, non dipendono da noi."

### 7. Recesso di legge vs Garanzia "Soddisfatti o Rimborsati" `recesso.garanzia_*`
- `recesso.garanzia_title` (string) - [BOZZA] "Recesso e garanzia: due cose diverse".
- `recesso.garanzia_body` (richtext) - [BOZZA] "Il recesso e un tuo diritto di legge nei primi 14 giorni. La nostra garanzia 'Soddisfatti o Rimborsati' e una promessa in piu che facciamo noi: se non sei soddisfatto del nostro lavoro, ne parliamo e troviamo una soluzione. Dettagli nella pagina Garanzia."
- `recesso.garanzia_link` (cta) - [BOZZA] { label: "Leggi la Garanzia", href: "/garanzia" }.

### 8. Mini-FAQ recesso `recesso.faq_*` (opzionale)
- (list) - [BOZZA] 2-3 voci brevi: ["Posso recedere se ho gia caricato i documenti?", "Cosa succede alle imposte gia pagate?", "Quanto ci mette il rimborso?"].

### 9. Rimando formale `recesso.tc_link`
- (richtext) - [BOZZA] "Questa pagina spiega il recesso in modo semplice. Il testo che fa fede e nelle Condizioni di vendita." + link a `/termini-condizioni`.

---

## PAGINA: Come Funziona `/come-funziona` (collection `come_funziona`)
> Versione estesa del processo a 3 step gia accennato in home. Spiega il "come" in modo visivo e onesto, con tempi/SLA realistici (dalla documentazione completa). Riduce l'ansia ("e complicato?") e prepara alla conversione.

### 1. Hero / intro `come_funziona.hero_*`
- `come_funziona.hero_title` (string) - [BOZZA] "Come funziona: semplice, da casa, in 3 passi".
- `come_funziona.hero_subtitle` (richtext) - [BOZZA] "Niente code, niente uffici. Ti guidiamo noi passo passo: tu pensi alla tua famiglia, alla burocrazia pensiamo noi."

### 2. Gli step in dettaglio `come_funziona.steps_*`
- `come_funziona.steps` (list) - [BOZZA] 3 step ampliati:
  - {numero: 1, titolo: "Rispondi a poche domande", testo: "Compili un breve questionario online (5 minuti). Ti diciamo subito di cosa hai bisogno e quanto costa - e se per il tuo caso la successione non e nemmeno dovuta, te lo diciamo gratis.", icona, dettaglio: "Esito immediato: prezzo, oppure preventivo su misura per i casi complessi."}
  - {numero: 2, titolo: "Carichi i documenti", testo: "Dalla tua area riservata carichi i documenti, anche da foto col telefono. Ti diamo la lista esatta, personalizzata sul tuo caso. Se ti manca qualcosa, spesso lo recuperiamo noi.", icona, dettaglio: "Una persona reale controlla tutto: niente moduli lasciati a meta."}
  - {numero: 3, titolo: "Pensiamo a tutto noi", testo: "Lorenzo predispone e invia la dichiarazione all'Agenzia delle Entrate. Ti comunichiamo prima le imposte da versare. A fine pratica ricevi ricevute e documenti finali nella tua area.", icona, dettaglio: "Dove previsto, ci occupiamo anche della voltura catastale."}

### 3. Tempi / SLA `come_funziona.sla_*`
- `come_funziona.sla_title` (string) - [BOZZA] "Quanto tempo ci vuole".
- `come_funziona.sla_body` (richtext) - [BOZZA] "I tempi dipendono dal pacchetto e partono da quando abbiamo TUTTI i documenti completi e corretti (non dal pagamento): cosi e una promessa che possiamo mantenere davvero. Sono esclusi i tempi di enti terzi (Agenzia, Catasto, banche)." (valori `sla_days` da `packages`, vedi /tariffe)

### 4. Cosa controlla il geometra (valore) `come_funziona.valore_*`
- `come_funziona.valore_title` (string) - [BOZZA] "Cosa facciamo che un software non fa".
- `come_funziona.valore_body` (richtext) - [BOZZA] "Verifichiamo a mano i dati catastali - particelle, subalterni, annessi, atti di provenienza - che sono il punto dove le pratiche si bloccano. Con la supervisione fiscale di un commercialista sui numeri. E la differenza tra un modulo riempito e una pratica fatta bene."

### 5. Tutto a distanza `come_funziona.distanza_*`
- `come_funziona.distanza_body` (richtext) - [BOZZA] "Non devi andare in nessun ufficio ne in banca: questionario, documenti, comunicazioni e invio all'Agenzia avvengono online. C'e sempre una chiamata con Lorenzo per spiegarti tutto."

### 6. Cosa ricevi a fine pratica `come_funziona.deliverable_*`
- `come_funziona.deliverable_title` (string) - [BOZZA] "Cosa hai in mano alla fine".
- `come_funziona.deliverable_list` (list) - [BOZZA] ["Ricevuta di presentazione/registrazione AdE", "Copia della dichiarazione", "Esito F24 / attestazione", "Esito voltura catastale (dove prevista)", "Fattura"]. (coerente con /tariffe)

### 7. CTA finale `come_funziona.cta_*`
- `come_funziona.cta_title` (string) - [BOZZA] "Iniziamo? Bastano cinque minuti."
- `come_funziona.cta_button` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.
- `come_funziona.cta_phone` (cta) - [BOZZA] { label: "Parla con Lorenzo", href: "tel:+39..." }.

> Nota: se in fase di design si decide di NON avere una pagina dedicata e tenere solo la sezione in home, questi blocchi confluiscono nella sezione `home.come_funziona_*` (segnalarlo in `SPEC_Content_Blocks`).

---

## PAGINA: Contatti `/contatti` (collection `contatti`)
> Recapiti completi, contatto telefonico in evidenza (modello "c'e sempre una chiamata", @05), canali multilingua, mappa studio. Form contatto standard con anti-bot e consenso (@04/@10).

### 1. Hero / intro `contatti.hero_*`
- `contatti.hero_title` (string) - [BOZZA] "Parla con noi".
- `contatti.hero_subtitle` (richtext) - [BOZZA] "Hai una domanda o vuoi capire se ti serve la successione? Scrivici o chiamaci: ti risponde una persona reale, non un bot."

### 2. Recapiti `contatti.recapiti_*`
- `contatti.telefono` (object) - [BOZZA] { label: "Telefono / WhatsApp", numero: "+39 ...", cta_chiama: "tel:+39...", cta_whatsapp: "https://wa.me/39..." } (in evidenza).
- `contatti.email` (object) - [BOZZA] { generale: "info@...", pec: "...@pec...." }.
- `contatti.studio` (object) - [BOZZA] { via: "Via Vittorio Veneto 31", cap: "56025", citta: "Pontedera (PI)" }.
- `contatti.orari` (list) - [BOZZA] [{giorni: "Lun-Ven", orario: "9:00-13:00 / 14:30-18:30"}, {giorni: "Sab-Dom", orario: "Chiuso"}]. (da confermare, DOMANDE)

### 3. Canali e assistenza nella tua lingua `contatti.canali_*` (eredi stranieri, @03/@09)
- `contatti.canali_title` (string) - [BOZZA] "Ti seguiamo anche nella tua lingua".
- `contatti.canali_body` (richtext) - [BOZZA] "Scrivici pure su WhatsApp o via email nella tua lingua: ci capiamo senza problemi. Se preferisci parlare, possiamo fare una chiamata con traduzione in tempo reale; i punti importanti (importi, scadenze, documenti) te li confermiamo sempre per iscritto. I documenti ufficiali restano in italiano."

### 4. Form di contatto `contatti.form_*`
- `contatti.form_title` (string) - [BOZZA] "Scrivici".
- `contatti.form_campi` (list) - [BOZZA] [Nome, Email (obblig.), Telefono (opz.), Messaggio, Consenso privacy (obblig., link informativa @10)]. Protezione anti-bot Cloudflare Turnstile (@04/@11).
- `contatti.form_nota` (string) - [BOZZA] "Ti rispondiamo entro 1 giorno lavorativo." (da confermare)
- `contatti.form_success` (string) - [BOZZA] "Grazie! Ti ricontattiamo a breve."

### 5. Mappa studio `contatti.mappa_*`
- `contatti.mappa_embed` (object) - embed mappa (lazy-load) dell'indirizzo studio.
- `contatti.mappa_nota` (string) - [BOZZA] "Si lavora tutto a distanza, ma lo studio esiste: passa pure a trovarci su appuntamento."

### 6. Rimando al preventivo `contatti.cta_*`
- `contatti.cta_body` (string) - [BOZZA] "Preferisci partire subito? Calcola il preventivo gratis, ci vogliono 5 minuti."
- `contatti.cta_button` (cta) - [BOZZA] { label: "Calcola il preventivo", href: "/preventivo" }.

---

## PAGINA: Guide / Blog `/guide` (testi `guide` · articoli da `articles`)
> Hub SEO (Pilastro C @09). Gli ARTICOLI sono contenuto data-driven (tabella `articles`: title, slug, excerpt, body, category, author, reviewed_by, cover, locale, published_at). Qui i testi dell'indice + il template articolo. Pagina statica/cache con revalidation (@07). Markup `Article`/`BlogPosting` + breadcrumb (@09).

### 1. Hero indice `guide.hero_*`
- `guide.hero_title` (string) - [BOZZA] "Guide alle successioni: chiare, aggiornate, senza burocratese".
- `guide.hero_subtitle` (richtext) - [BOZZA] "Tutto quello che serve sapere su successione, imposte e documenti, spiegato in modo semplice da chi le pratiche le fa davvero."
- `guide.hero_search` (bool) - [BOZZA] true (ricerca/filtro articoli).

### 2. Categorie `guide.categorie_*`
- `guide.categorie` (list) - [BOZZA] [{nome: "Capire la successione", slug: "basi"}, {nome: "Imposte e costi", slug: "imposte"}, {nome: "Documenti", slug: "documenti"}, {nome: "Casi particolari", slug: "casi"}, {nome: "Guide locali (Toscana)", slug: "locali"}, {nome: "Eredi stranieri / dall'estero", slug: "stranieri"}].

### 3. Lista articoli `guide.lista_*` (da `articles`)
- (list, fonte `articles`) - card articolo: cover, categoria, titolo, excerpt, autore, data, tempo di lettura. Ordinamento per `published_at`/in evidenza.
- `guide.in_evidenza_title` (string) - [BOZZA] "In evidenza".

### 4. CTA hub `guide.cta_*`
- `guide.cta_title` (string) - [BOZZA] "Hai bisogno di aiuto col tuo caso?"
- `guide.cta_button` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.

### 5. Piano editoriale (riferimento, NON contenuto di pagina) `guide.piano_note`
- (note) - tipologie di articolo previste (@09):
  - **Pillar nazionali**: "Cos'e la dichiarazione di successione", "Quando NON sei obbligato (esonero)", "Imposte di successione: chi paga e quanto", "Agevolazione prima casa", "Documenti per la successione", "Successione precompilata: conviene il fai-da-te?".
  - **Landing per SEGMENTO**: "Eredi che vivono lontano/all'estero", "Stranieri residenti in Italia: la successione spiegata semplice" (assistenza nella tua lingua).
  - **Landing LOCALI (Toscana)**: "Dichiarazione di successione a Pontedera / Pisa / Valdera" (SEO locale, LocalBusiness).

---

## TEMPLATE: Articolo guida `/guide/[slug]` (record `articles` + testi `article` ricorrenti)
> Struttura ripetibile di ogni articolo. I campi del singolo articolo vivono in `articles`; i blocchi ricorrenti (disclaimer, box autore, CTA) sono testi `content_entries` riusati ovunque.

### 1. Intestazione articolo `article.header_*` (da `articles`)
- campi: `title`, `excerpt`, `cover` (image_ref), `category`, `published_at`/`updated_at`, `reading_time`, breadcrumb.

### 2. Box autore + revisione (E-E-A-T) `article.autore_*`
- `article.autore_box` (object) - [BOZZA] { autore: "Geom. Lorenzo Armellin", ruolo: "Geometra abilitato Entratel", reviewed_by: "Rivisto sulla parte fiscale da un commercialista", foto: image_ref, link: "/chi-sono" } (segnale E-E-A-T forte, @09).
- `article.data_aggiornamento` (string) - [BOZZA] "Aggiornato il {updated_at}" (freschezza contenuto YMYL).

### 3. Corpo articolo `article.body` (da `articles.body`, richtext)
- contenuto strutturato (H2/H3, liste, tabelle). Valori fiscali indicativi, con link alle pagine ufficiali AdE (RIFERIMENTO_Successioni).

### 4. Box "stima non vincolante" / disclaimer YMYL `article.disclaimer`
- (richtext) - [BOZZA] "Le informazioni di questa guida sono indicative e a scopo informativo. Ogni successione e un caso a se: la valutazione definitiva e sempre sul caso concreto. Verifichiamo gratis la tua situazione." (coerente @10)

### 5. CTA contestuale `article.cta_*`
- `article.cta_box` (object) - [BOZZA] { titolo: "Vuoi che ce ne occupiamo noi?", button: { label: "Calcola il preventivo gratis", href: "/preventivo" }, phone: "tel:+39..." }.
- Per le landing locali/segmento: CTA adattata (es. "Assistenza nella tua lingua", "Anche se vivi all'estero").

### 6. Articoli correlati + interlink `article.correlati`
- (list, da `articles`) - 3 articoli correlati per categoria/tag; link reciproci con pillar e con `/faq`, `/documenti-successione`, `/tariffe` (SEO interna @09).

### 7. Condivisione / nota fonti `article.fonti`
- (richtext) - [BOZZA] fonti ufficiali citate (Agenzia delle Entrate, Normattiva) con link, a rafforzare autorevolezza (E-E-A-T).

---

## PAGINA: Preventivo (form multi-step) `/preventivo` (collection `preventivo`)
> La LOGICA del form (4 step, regole condizionali, gate di non-obbligo, mappatura CRM) e definita in @04: NON si riscrive qui. Qui solo copy di pagina, titoli/help dei passi e microcopy. Anti-bot Turnstile + consenso privacy (@04/@10/@11).

### 1. Intro pagina `preventivo.intro_*`
- `preventivo.intro_title` (string) - [BOZZA] "Calcola il tuo preventivo gratis, in 5 minuti".
- `preventivo.intro_subtitle` (richtext) - [BOZZA] "Rispondi a poche domande: ti diciamo subito quanto costa o, se il tuo caso e particolare, ti facciamo un preventivo su misura. Nessun impegno."
- `preventivo.progress_label` (string) - [BOZZA] "Passo {n} di 4".

### 2. Microcopy degli step `preventivo.step_*` (titoli/help; campi e regole in @04)
- `preventivo.step1_title` (string) - [BOZZA] "Partiamo dalle basi" (data decesso, testamento, residenza defunto).
- `preventivo.step2_title` (string) - [BOZZA] "Chi sono gli eredi" (chi compila, n. eredi, minorenni).
- `preventivo.step3_title` (string) - [BOZZA] "Cosa fa parte dell'eredita" (immobili, terreni/annessi, conti, altri beni, valore).
- `preventivo.step4_title` (string) - [BOZZA] "Dove ti mandiamo il preventivo" (nome, email, telefono, consensi).
- `preventivo.help_text` (list) - microcopy rassicurante per i campi sensibili: [BOZZA] ["I dati servono solo a stimare il tuo caso.", "Non sai una risposta? Scegli 'Non lo so', ci pensiamo noi."].

### 3. Privacy / consensi `preventivo.consensi_*`
- `preventivo.consenso_privacy` (string) - [BOZZA] "Ho letto l'informativa privacy e acconsento al trattamento dei dati." (link informativa @10, obbligatorio).
- `preventivo.consenso_marketing` (string) - [BOZZA] "Voglio ricevere consigli utili e aggiornamenti (facoltativo)."
- `preventivo.cta_submit` (cta) - [BOZZA] { label: "Invia e ricevi il preventivo gratuito" }.

### 4. Rassicurazioni laterali `preventivo.trust_*`
- `preventivo.trust_items` (list) - [BOZZA] ["Gratis e senza impegno", "Ti risponde Lorenzo, una persona reale", "Dati al sicuro, server in UE (GDPR)"].

---

## PAGINA: Thank-you preventivo `/preventivo/grazie` (collection `grazie`)
> Instrada verso 3 ESITI in base alle risposte (logica in @04). Risolve i 3 dubbi di Riunione 1 (non-obbligo, pacchetto sbagliato, casi complessi). Il blocco documenti riusa il motore della checklist (@05/@06).

### 1. Intestazione `grazie.header_*`
- `grazie.header_title` (string) - [BOZZA] "Grazie! Ecco l'esito della tua pre-valutazione".
- (evento `generate_lead`, @08; il contenuto sotto cambia per esito)

### 2. ESITO A - "Potrebbe non servirti la successione" `grazie.esito_a_*`
- `grazie.esito_a_title` (string) - [BOZZA] "Forse non devi fare la dichiarazione".
- `grazie.esito_a_body` (richtext) - [BOZZA] "In base a quello che ci hai detto, il tuo caso potrebbe rientrare nell'esonero di legge. Non vogliamo venderti un servizio che non ti serve: verifichiamolo insieme, gratis. La conferma definitiva e sul caso concreto."
- `grazie.esito_a_cta` (cta) - [BOZZA] { label: "Prenota la verifica gratuita", href: "tel:+39..." / form }. (NON si mostra il blocco documenti, @04)

### 3. ESITO B - Caso lineare -> prezzo immediato `grazie.esito_b_*`
- `grazie.esito_b_title` (string) - [BOZZA] "Ecco il pacchetto giusto per te".
- `grazie.esito_b_pacchetto` (object) - pacchetto suggerito + onorario fisso (da `packages`), cosa include.
- `grazie.esito_b_cta` (cta) - [BOZZA] { label: "Procedi al pagamento", href: "/checkout" }.
- `grazie.esito_b_riallineamento` (richtext) - [BOZZA] "Prima di pagare, dai un'occhiata alla guida alla scelta del pacchetto o fai due parole con Lorenzo: se hai scelto quello sbagliato, cambiarlo e semplice e si regola solo la differenza." (link guida + tel).

### 4. ESITO C - Caso complesso -> preventivo su misura `grazie.esito_c_*`
- `grazie.esito_c_title` (string) - [BOZZA] "Il tuo caso merita un preventivo su misura".
- `grazie.esito_c_body` (richtext) - [BOZZA] "Hai elementi particolari (piu immobili, terreni/annessi, altri beni, testamento o eredi all'estero). Per non farti pagare ne piu ne meno del giusto, Lorenzo ti prepara un preventivo dedicato."
- `grazie.esito_c_cta` (cta) - [BOZZA] { label: "Richiedi il preventivo / prenota la chiamata", href: "tel:+39..." / form }.

### 5. Blocco "Ecco i documenti che ti serviranno" `grazie.documenti_*` (Esiti B e C)
- `grazie.documenti_title` (string) - [BOZZA] "Intanto, ecco cosa ti servira".
- `grazie.documenti_lista` (list) - generata dal `document_catalog` sulle risposte (stesso motore di /documenti-successione e della checklist @06); raggruppata, con "cos'e/come si ottiene".
- `grazie.documenti_disclaimer` (string) - [BOZZA] "Lista indicativa: quella definitiva la conferma Lorenzo dopo aver visto il tuo caso."
- `grazie.documenti_hook` (string) - [BOZZA] "Non ce l'hai? Lo recuperiamo noi."
- `grazie.documenti_cta_pdf` (cta) - [BOZZA] { label: "Scarica la lista (PDF)" }.
- `grazie.documenti_cta_email` (cta) - [BOZZA] { label: "Ricevila via email" }.
- (in Esito A NON si mostra, @04)

### 6. Prossimi passi / rassicurazione `grazie.next_*`
- `grazie.next_body` (richtext) - [BOZZA] "Ti abbiamo inviato un riepilogo via email. Da qui in poi ti seguiamo noi: una persona reale, non un bot."

---

## PAGINA: Checkout `/checkout` (collection `checkout`)
> Riepilogo ordine + pagamento Stripe (@04/@06). Prezzo SEMPRE ricalcolato lato server (@11). Modello a ORDINE SINGOLO (no carrello multi-item): pacchetto + eventuali add-on. Imposte di Stato MAI nel totale dell'onorario (@10). BNPL sull'onorario. Consensi + link recesso accanto al pulsante.

### 1. Intestazione `checkout.header_*`
- `checkout.header_title` (string) - [BOZZA] "Completa l'ordine".
- `checkout.header_subtitle` (string) - [BOZZA] "Ancora un passo e ce ne occupiamo noi."

### 2. Riepilogo ordine `checkout.riepilogo_*` (da `packages`/`addons`/`orders`)
- `checkout.riepilogo_title` (string) - [BOZZA] "Il tuo ordine".
- (object/list, server-side) - pacchetto scelto + descrizione breve + add-on selezionati; ogni riga con prezzo. Possibilita di cambiare pacchetto/add-on prima di pagare.
- `checkout.modifica_link` (cta) - [BOZZA] { label: "Modifica", href: "/tariffe" }.

### 3. Box prezzo trasparente `checkout.prezzo_*` (anti-confusione)
- `checkout.prezzo_split` (object) - [BOZZA] Onorario + IVA/Cassa = Totale da pagare ora.
- `checkout.prezzo_imposte_nota` (richtext) - [BOZZA] "IMPORTANTE: questo e l'onorario professionale. Le imposte di Stato (successione, ipotecaria, catastale, bolli) sono SEPARATE, a carico dell'erede, e te le calcoliamo e comunichiamo PRIMA dell'invio. Non applichiamo ricarichi." (riquadro distinto, @06/@10)

### 4. Micro-trust `checkout.microtrust`
- (string) - [BOZZA] "Paghi un geometra abilitato Entratel, con supervisione fiscale di un commercialista. Pagamenti sicuri con Stripe." (@02/@04)

### 5. Metodi di pagamento + BNPL `checkout.pagamento_*`
- `checkout.pagamento_title` (string) - [BOZZA] "Come vuoi pagare".
- `checkout.pagamento_metodi` (list) - [BOZZA] ["Carta", "PayPal", "Bonifico (assistito)"]. (gestiti da Stripe @07)
- `checkout.rate_nota` (richtext) - [BOZZA] "Puoi pagare a rate (PayPal Pay in 3, Klarna, Scalapay, dove disponibili). Si rateizza l'onorario, non le imposte di Stato."

### 6. Consensi e recesso `checkout.consensi_*` (snodo legale, @10)
- `checkout.consenso_tc` (string) - [BOZZA] "Accetto le Condizioni di vendita e l'informativa privacy." (link, obbligatorio)
- `checkout.consenso_avvio` (string) - [BOZZA] "Chiedo l'avvio immediato della lavorazione e prendo atto che, a servizio completato entro i 14 giorni, perdo il diritto di recesso." (consenso esplicito, @10)
- `checkout.recesso_link` (cta) - [BOZZA] { label: "Come funziona il recesso", href: "/recesso" } (accanto alle checkbox).

### 7. Pulsante di pagamento `checkout.cta_*`
- `checkout.cta_pay` (cta) - [BOZZA] { label: "Paga in modo sicuro" }.
- `checkout.cta_nota` (string) - [BOZZA] "Transazione cifrata. Non conserviamo i dati della carta." 

### 8. Rassicurazioni `checkout.trust_items`
- (list) - [BOZZA] ["Soddisfatti o rimborsati", "Server in UE, conforme GDPR", "Assistenza di una persona reale"].

### 9. Esiti pagamento `checkout.esito_*`
- `checkout.success_title` (string) - [BOZZA] "Pagamento riuscito! Benvenuto/a." + prossimi passi (accesso area riservata, @06).
- `checkout.error_title` (string) - [BOZZA] "Pagamento non riuscito" + come riprovare / contatto.

---

## HUB LEGALE (collection `legale`)
> Testi FORMALI: in gran parte generati/gestiti da iubenda (Privacy, Cookie) e dalle bozze in `bozze_legali/` (T&C, Garanzia), da validare con un legale (@10). Qui NON si riscrivono i testi legali: si fissano struttura, titoli e i punti chiave che devono esserci. La pagina /recesso (spiegazione semplice) e gia mappata sopra.

### Privacy Policy `/privacy` `legale.privacy_*`
- `legale.privacy_title` (string) - [BOZZA] "Informativa sulla privacy".
- `legale.privacy_body` (richtext/embed) - generata da iubenda (titolare, dati trattati, basi giuridiche, conservazione/retention @10, diritti dell'interessato, trasferimenti UE, contatti DPO se presente).

### Cookie Policy `/cookie-policy` `legale.cookie_*`
- `legale.cookie_title` (string) - [BOZZA] "Cookie Policy".
- `legale.cookie_body` (richtext/embed) - iubenda + Consent Mode v2 (@08). Link "Gestisci preferenze" che riapre la CMP.

### Termini e Condizioni di vendita `/termini-condizioni` `legale.tc_*`
- `legale.tc_title` (string) - [BOZZA] "Condizioni di vendita".
- `legale.tc_body` (richtext) - testo formale (bozza `bozze_legali/`): oggetto del servizio, prezzi/onorario e cosa NON include (imposte di Stato @10), tempi/SLA, obblighi del cliente (documenti veritieri), recesso (rimanda a /recesso), avvio immediato, limitazioni di responsabilita YMYL, foro/legge applicabile, dati professionista.

### Garanzia "Soddisfatti o Rimborsati" `/garanzia` `legale.garanzia_*`
- `legale.garanzia_title` (string) - [BOZZA] "La nostra garanzia".
- `legale.garanzia_body` (richtext) - [BOZZA] cosa copre, come si attiva, differenza dal recesso di legge (rimanda a /recesso), tempi.
- `legale.garanzia_cta` (cta) - [BOZZA] { label: "Calcola il preventivo gratis", href: "/preventivo" }.

### Banner consensi (CMP)
- gestito da iubenda con Consent Mode v2 (@08/@10): elemento globale, non editabile come blocco.

---

## PAGINE DI SISTEMA (collection `sistema`)
> Pagine di servizio, tono coerente col brand (empatico, rassicurante). Niente dati sensibili nei messaggi d'errore (@11).

### 404 - Pagina non trovata `sistema.e404_*`
- `sistema.e404_title` (string) - [BOZZA] "Questa pagina non c'e (o non c'e piu)".
- `sistema.e404_body` (string) - [BOZZA] "Ma possiamo aiutarti lo stesso."
- `sistema.e404_cta` (list) - [BOZZA] [{label: "Vai alla home", href: "/"}, {label: "Calcola il preventivo", href: "/preventivo"}].

### Errore generico (500) `sistema.e500_*`
- `sistema.e500_title` (string) - [BOZZA] "Qualcosa e andato storto".
- `sistema.e500_body` (string) - [BOZZA] "Riprova tra poco. Se il problema resta, scrivici o chiamaci." (+ contatto)

### Manutenzione `sistema.manutenzione_*`
- `sistema.manutenzione_title` (string) - [BOZZA] "Stiamo facendo manutenzione".
- `sistema.manutenzione_body` (string) - [BOZZA] "Torniamo online a breve. Per urgenze, contattaci."

### Sessione scaduta (area riservata) `sistema.sessione_*`
- `sistema.sessione_title` (string) - [BOZZA] "Sessione scaduta".
- `sistema.sessione_body` (string) - [BOZZA] "Per la tua sicurezza ti abbiamo disconnesso. Accedi di nuovo per continuare." (link login @06)

---

## NOTE DI PERIMETRO (cosa NON sta in questo file)
- **Area personale del cliente** (`/area-riservata/*`): dashboard, documenti, dati, mandato, ordine, recesso, profilo -> schermate e copy in @06 (app, non CMS marketing). Nota naming: l'etichetta user-facing e **"Area personale"** (vedi DECISIONI); la rotta tecnica resta `/area-riservata`. Label data-driven: `settings.area_label`.
- **CRM `/admin`**: tutto in @05 (app interna).
- **Contenuti data-driven**: pacchetti/add-on (`packages`/`addons`), FAQ (`faqs`), articoli (`articles`), immagini/fac-simile (`media_assets`) -> gestiti dal CRM, qui solo citati.

## Passi successivi
- [x] Validare formato/tono sulla Home (questo file).
- [x] Completare i blocchi di tutte le pagine pubbliche con testi [BOZZA].
- [x] Derivare `SPEC_Content_Blocks` (registro tecnico `collection.key` + tipo + default) da questa struttura -> creato `SPEC_Content_Blocks.md`.
- [ ] Allineare i `key` usati qui con `content_entries` (@SPEC_Data_Model) e con i manager CMS (@05).
- [ ] Far validare i testi legali (Privacy/Cookie/T&C/Garanzia) a un legale (@10).
- [ ] Raccogliere da Lorenzo i dati [da confermare] (recapiti, P.IVA, n. Albo, numeri social proof, orari, nomi/foto team).
