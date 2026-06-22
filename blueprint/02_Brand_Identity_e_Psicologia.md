# 02. Brand Identity e Psicologia dell'Utente

> Parte della Bibbia di progetto. Indice e convenzioni: [00_README_Master_Index.md](00_README_Master_Index.md).

## Metadati
- ID: CAP-02
- Stato: In revisione
- Ultimo aggiornamento: 2026-06-22
- Dipendenze: @01_Executive_Summary, @03_Architettura_Informazione, @09_Go_To_Market
- Owner:

## Sintesi
Identita di marca del Geom. Lorenzo Armellin: archetipo, tono di voce, palette colori, tipografia e direzione fotografica, bilanciando istituzionalita e calore umano per trasmettere fiducia immediata (settore YMYL) a un utente spesso in lutto e in ansia burocratica.

---

## Stato attuale del progetto

### Archetipo e posizionamento percepito
- Archetipo: "Il Professionista Risolutore" (mix Saggio + Angelo custode): competente e autorevole, ma accessibile e rassicurante.
- Personalita del brand: affidabile, chiaro, empatico, moderno (no "burocrate freddo", no portale anonimo).
- **Posizionamento "il meglio dei due mondi" (gestione barriera di percezione)**: parte del pubblico si aspetta un commercialista/CAF/notaio. Invece di difendere "anche il geometra puo farlo", si comunica un vantaggio combinato: **competenza catastale del geometra abilitato Entratel** (dove le pratiche saltano: particelle, annessi, atti) **+ supervisione fiscale di un commercialista** (garanzia sui numeri). Responsabilita chiara: a predisporre e trasmettere e Lorenzo (intermediario Entratel); il commercialista da **supervisione fiscale e interviene sui casi complessi**. Claim sempre veritieri e proporzionati (YMYL, @10).

### Tono di voce
- Empatico, rassicurante, risolutivo; prima persona ("Sono Lorenzo... gestisco...").
- Cosa fare: linguaggio diretto e delicato ("Semplifichiamo la burocrazia", "Ti guidiamo passo passo", "Pensiamo a tutto noi").
- Cosa evitare: burocratese e termini tecnici non spiegati (de cuius, asse ereditario, chiamati all'eredita) sparati senza contesto.
- Regola: ogni termine tecnico necessario va spiegato con parole semplici (tooltip/parentesi).
- Esempi:
  - Do: "Sappiamo che e un momento difficile: alla burocrazia pensiamo noi."
  - Don't: "Provvediamo all'espletamento degli adempimenti dichiarativi di cui al TUS."

### Palette colori (direzione: Trust & Premium) - HEX
- Primario (Blu Navy): #0E2A47
- Secondario (Slate): #20405E
- Accento (Oro/Rame opaco): #B5894E  (uso per CTA/dettagli/bordi, NON per testo lungo)
- Neutro caldo (Sabbia): #EFE9DD
- Sfondo: #FFFFFF; Grigio perla: #F5F7FA
- Testo: #16242F; Testo soft: #5A6B7B
- Semantici: successo #2E7D5B, errore #B4423A, attenzione #C08A2E
- Nota accessibilita: navy su bianco e ad alto contrasto (ok); l'accento oro va riservato ad accenti/icone/bordi o testo grande, non a paragrafi.

### Tipografia
- Titoli (Headings): Lora (serif) - autorevolezza e leggibilita. Playfair Display consentito solo per display molto grandi (hero).
- Testo (Body/UI): Inter (sans-serif) - leggibilita su schermo e nei form.
- Gerarchia e spaziature da definire nel design system (scala tipografica, line-height generosi per over-50).

### Direzione fotografica
- Ritratto di Lorenzo: mezzo busto, sguardo in camera, espressione serena (mezzo sorriso), outfit business-casual elegante (giacca moderna, camicia, no cravatta). No pose rigide, no foto stock.
- Foto studio: ambiente ordinato, moderno, luminoso; scrivania pulita, un tocco di verde; trasmette solidita ("mi trovi qui").
- Foto di Pontedera/citta: NO in homepage (servizio nazionale); l'indirizzo dello studio resta nel footer e in "Chi Sono" come ancora di fiducia.

### Applicazione E-E-A-T (fiducia/autorevolezza)
- Firma dei contenuti da parte di Lorenzo (pagina autore/bio).
- **Supervisione fiscale di un commercialista**: i contenuti fiscali riportano "**rivisto da un commercialista**" e il team include la doppia competenza (geometra + commercialista). Forte segnale E-E-A-T su materia YMYL. Wording veritiero: supervisione/revisione, non "ogni pratica revisionata" se non lo e (@10).
- Link istituzionali (iscrizione Albo) da footer e bio.
- Recensioni verificate (Google) in evidenza (@03/@09).

---

## Idee future
- Design system completo (componenti, token, dark mode eventuale).
- Illustrazioni/iconografia custom coerenti (no icone generiche).
- Brand guidelines PDF per uso coerente su sito, social, materiali.
- Eventuale brand video di presentazione.

---

## Nodi da sciogliere
- Approvazione estetica finale da parte di Lorenzo (palette, font, mood) (DOMANDE_PER_LORENZO).
- Logo: esiste gia o va creato? Stile (wordmark, monogramma LA, simbolo geometrico)?
- Conferma direzione "Trust & Premium" vs alternativa "Modern & Earthy" (antracite + salvia/terracotta) se preferita.
- Naming definitivo del brand/sito (proposta: "Successioni Armellin") e dominio da registrare - decisione dopo l'analisi competitor (vedi ANALISI_COMPETITORS.md).

## Passi successivi
- [ ] Validare con Lorenzo palette, font e direzione fotografica.
- [ ] Definire/realizzare il logo.
- [ ] Definire la scala tipografica e i token di design (per @03/@07).
- [ ] Preparare il brief operativo per lo shooting (@09).

---

## Decisioni congelate (lock-in)
- Archetipo: Professionista Risolutore; tono empatico/rassicurante/risolutivo in prima persona.
- Palette direzione "Trust & Premium" con gli HEX sopra (salvo diversa approvazione estetica di Lorenzo).
- Tipografia: Lora (titoli) + Inter (testo).
- Foto reali (Lorenzo + studio), niente foto stock; niente foto citta in home; indirizzo come ancora di fiducia.
- Regola anti-burocratese: termini tecnici sempre spiegati.
- Posizionamento "geometra (catasto) + supervisione commercialista (fisco)" come gestione della barriera di percezione; claim veritieri e proporzionati (@09/@10).

---

## Rischi / Compliance & Riferimenti
- Rischio fiducia: estetica amatoriale o foto stock abbattono la credibilita in un settore YMYL.
- Rischio accessibilita: contrasto insufficiente (es. testo oro su bianco) -> rispettare WCAG (@03).
- Rischio incoerenza: tono o stile non uniformi tra sito, email e WhatsApp; il tono di voce vale ovunque.
- Riferimenti di partenza: `reference_partenza/Ricerca & Analisi parte 1.txt` (sezione brand identity: tono, foto, palette, font).
