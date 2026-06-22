# SPEC - Principi Guida e UX/UI (Single Source of Truth)

> Documento manifesto: bozza iniziale del "blueprint tecnico" di Sito e CRM.
> Fissa le REGOLE AUREE (non negoziabili) e i principi estetici, di interazione e mobile-first che ogni scelta di design e di codice deve rispettare.
> Stato: Bozza · Ultimo aggiornamento: 2026-06-19
> Riferimenti: @02_Brand_Identity, @03_Architettura_Informazione, @06_Area_Riservata, @07_Stack, @SPEC_Design_Tokens, @SPEC_Coding_Standards.

---

## 0. Le Regole Auree (principi non negoziabili)
In caso di dubbio o conflitto tra esigenze, vince sempre la regola con priorita piu alta.

1. **Usabilita > design esagerato.** Prima la chiarezza e la facilita d'uso (utente over-50, spesso in lutto e poco tecnico), poi l'estetica. Mai sacrificare la comprensione per "fare scena". Una sola azione chiara per schermata.
2. **Codice pulito e architettura da studio senior.** Struttura modulare, separazione delle responsabilita, naming coerente, niente scorciatoie. Il codice deve essere leggibile da un altro sviluppatore senza spiegazioni. Vedi @SPEC_Coding_Standards.
3. **Accessibilita come requisito, non come opzione.** Target WCAG 2.2 AA (@03): contrasto, navigazione da tastiera, focus visibili, HTML semantico, `prefers-reduced-motion`.
4. **Performance e SEO (Core Web Vitals).** Mobile veloce prima di tutto; animazioni solo GPU-friendly; nessun effetto che peggiora i Web Vitals (@07/@09).
5. **Mobile-first reale.** Si progetta prima per lo smartphone (esperienza "da app nativa"), poi si adatta al desktop. Mai un desktop "rimpicciolito".
6. **Sicurezza e GDPR by design.** Minimizzazione dati, RLS, signed URL, niente PII nei log (@10/@11). La sicurezza non e una fase finale.
7. **Coerenza assoluta (un solo design system).** Stessi token, stessi componenti, stesso tono ovunque (sito, area riservata, CRM, email). Niente varianti "una tantum".
8. **Sobrieta nelle animazioni.** Morbide, brevi (0.2-0.5s), sempre disattivabili. Il movimento serve a guidare e rassicurare, non a stupire.

---

## 1. Linguaggio visivo (estetica)
Mood: "studio professionale premium incontra app moderna". Trasmettere autorevolezza, calma e facilita estrema.
- **Colori** (valori canonici in @SPEC_Design_Tokens): bianco/perla per ~80% delle superfici; blocchi navy come ancore istituzionali (hero, footer); sabbia per sezioni "calde" di stacco; oro/rame SOLO per accenti e CTA (mai testo lungo).
- **Spazi (whitespace generoso).** Stacchi ampi tra sezioni (respiro), perche la densita genera ansia nel target.
- **Allineamenti.** Testi lunghi sempre a sinistra (mai giustificati); titoli di sezione centrati per ritmo; larghezza di lettura limitata (~70-80 caratteri per riga).
- **Tipografia** (token in @SPEC_Design_Tokens): Lora (serif) per i titoli (richiamo "documento ufficiale" ma arioso); Inter (sans) per testo/UI con interlinea 1.6-1.7; corpo testo in ardesia (#5A6B7B), non nero puro.
- **Microcopy** discreto di rassicurazione vicino ad azioni sensibili (es. "I tuoi dati sono al sicuro").

---

## 2. Componenti UI omogenei
### Bottoni
- Angoli morbidi (raggio ~8-10px): ne spigolosi ne "a pillola".
- **Primario** (es. "Calcola Preventivo"): navy pieno, testo bianco, accento oro su hover; su sfondo scuro variante oro pieno con testo navy.
- **Secondario** (es. "Indietro", "Scarica"): trasparente/sabbia con bordo sottile e testo navy; non deve competere col primario.
- **Disabilitato**: grigio con testo sbiadito; si "accende" (grigio -> navy) solo quando l'azione e possibile (es. step del form completo).
### Card
- Bianche su sfondo perla; ombra quasi invisibile (alone bluastro leggero, es. rgba(14,42,71,.05)); bordo finissimo 1px.
### Input / Form
- Campi grandi (altezza >= 48-56px); sfondo leggermente perla per indicare "dove cliccare".
- Focus: bordo navy evidente.
- Label sempre sopra il campo (non placeholder a scomparsa), leggibili.

---

## 3. Mobile-first: pattern obbligatori
- **Thumb zone:** azioni principali raggiungibili col pollice.
- **Bottom navigation bar** nell'area riservata/CRM (Dashboard / Documenti / Profilo), non hamburger in alto.
- **Bottoni full-width** in form e upload.
- **CTA flottante** ancorata in basso durante lo scroll della homepage pubblica (si nasconde in prossimita del form).
- **BottomSheet** (pannello che sale dal basso, swipe-to-dismiss) al posto dei pop-up centrali per richieste rapide (es. inserimento IBAN).
- **Tastiera intelligente:** `type`/`inputmode` corretti (numerico per telefono, email per email).
- **Input a 16px** per impedire lo zoom automatico su iOS.

---

## 4. Transizioni e micro-interazioni
- **Form a step:** transizione slide-in laterale (avanti/indietro come "binario"); gestire bene il cambio di altezza per evitare salti.
- **FAQ accordion:** apertura "srotolata" (~0.3s) con icona +/x che ruota (componente Accordion shadcn/Radix).
- **Micro-feedback al tocco:** scale-down ~96% in active per confermare il tap.
- **Stato di caricamento:** la label del bottone sfuma e appare uno spinner; nessuno schermo bianco.
- **Skeleton loading** (shimmer) al posto di spinner a tutto schermo (nativo App Router: `loading.tsx` + Suspense + Skeleton shadcn).
- **Page transition** fluide (stile SPA) per non disorientare.

---

## 5. Avvertenze tecniche obbligatorie (decise)
1. **Niente vibrazione (haptic) su iOS:** la Vibration API non e supportata su Safari/iOS -> feedback solo VISIVO; la vibrazione Android e "nice to have", non requisito.
2. **`prefers-reduced-motion`:** tutte le animazioni si disattivano se l'utente ha attivato "riduci movimento" (accessibilita/EAA).
3. **Usare unita `dvh`** (non `vh`) per altezze a schermo intero (bug barra browser mobile).
4. **Animare solo `transform` e `opacity`** (accelerate da GPU); mai proprieta che ricalcolano il layout (Core Web Vitals).

---

## 6. Architettura del codice (standard "studio senior")
> Dettaglio operativo in @SPEC_Coding_Standards; qui i principi.
- **Separazione delle responsabilita:** UI (`/components`) separata da logica/dati (`/server`, `/lib`), schemi (`/schemas`), rotte (`/app`).
- **Design system unico:** componenti shadcn/ui + token @SPEC_Design_Tokens; nessun valore "hardcoded" duplicato.
- **Tipizzazione forte:** TypeScript strict, tipi da Zod (`z.infer`), contratti in @SPEC_API_Contracts.
- **Naming canonico:** tabelle/rotte/eventi/job da @SPEC_Naming_Conventions (regola anti-drift: non duplicare valori, linkare la SPEC).
- **Sicurezza-first:** RLS, validazione server, signed URL, segreti solo da env (@SPEC_Env_Vars).
- **Testabilita:** unit (Vitest) + E2E (Playwright) sui flussi critici; test RLS cross-tenant.
- **Manutenibilita:** commit piccoli, PR con checklist QA, componenti riusabili, niente "copia-incolla".

---

## Idee future
- Pagina/Storybook del design system (galleria componenti) come riferimento vivo.
- Linee guida per le email transazionali coerenti col design system.
- Test di usabilita reali con utenti over-50 prima del lancio.

## Nodi da sciogliere
- Libreria animazioni: Framer Motion (completo) vs animazioni CSS leggere dove bastano (decidere in setup).
- Libreria BottomSheet: confermare `vaul` come standard.
- Set finale di breakpoint e griglia (allineare a Tailwind in @07).

## Passi successivi
- [ ] Validare queste regole come base del futuro blueprint tecnico.
- [ ] Espandere @SPEC_Design_Tokens con eventuali token mancanti (motion durate, z-index, breakpoint).
- [ ] Derivare una checklist UX/QA mobile da usare in fase di sviluppo/collaudo (@13).
- [ ] Tradurre i pattern in componenti base nel prototipo (GESTIONE_PROGETTO).

## Decisioni congelate (lock-in)
- Le 8 Regole Auree (sez. 0) sono vincolanti per ogni scelta di design e codice.
- Mobile-first reale (no desktop rimpicciolito); esperienza "da app nativa".
- Avvertenze tecniche sez. 5 (no haptic iOS, reduced-motion, dvh, animare solo transform/opacity) sono obbligatorie.
- Un solo design system: token @SPEC_Design_Tokens + componenti shadcn/ui ovunque.

## Rischi / Compliance & Riferimenti
- Rischio "design sopra l'usabilita": qualsiasi effetto che riduce chiarezza va rimosso (regola aurea #1).
- Rischio accessibilita/performance: animazioni non controllate danneggiano WCAG e Web Vitals (@03/@07).
- Riferimenti: @02_Brand_Identity, @SPEC_Design_Tokens, @SPEC_Coding_Standards, @06_Area_Riservata (pattern area cliente).
