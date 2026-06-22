# SPEC - Design Tokens (Single Source of Truth)

> Token visivi canonici (dal @02_Brand_Identity). UI e Tailwind config devono usare questi valori esatti.
> Stato: In revisione · Ultimo aggiornamento: 2026-06-18
> Riferimenti: @02_Brand_Identity, @03_Architettura_Informazione, @07_Stack.

## Colori (palette Trust & Premium)
| Token | HEX | Uso |
|-------|-----|-----|
| color-primary | #0E2A47 | navy, header, titoli forti |
| color-secondary | #20405E | slate, superfici scure |
| color-accent | #B5894E | oro/rame: CTA, dettagli, bordi (NON testo lungo) |
| color-sand | #EFE9DD | neutro caldo, sezioni |
| color-bg | #FFFFFF | sfondo |
| color-bg-muted | #F5F7FA | grigio perla |
| color-text | #16242F | testo principale |
| color-text-muted | #5A6B7B | testo secondario |
| color-success | #2E7D5B | conferme |
| color-error | #B4423A | errori |
| color-warning | #C08A2E | attenzione |

Nota accessibilita (@03): garantire contrasto WCAG AA; l'oro su bianco solo per accenti/testo grande.

## Tipografia
- Font titoli: Lora (serif). Display molto grandi: Playfair Display (solo hero).
- Font testo/UI: Inter (sans-serif).
- Scala (suggerita): xs 12 / sm 14 / base 16 / lg 18 / xl 20 / 2xl 24 / 3xl 30 / 4xl 36 / 5xl 48.
- Line-height generosi (1.5-1.7 body) per leggibilita over-50.
- Multilingua (requisito @07): font con copertura per script non-latini come fallback. Inter/Lora coprono latino e cirillico (russo ok) e latino esteso (albanese/francese ok) ma NON arabo, CJK (cinese), devanagari (hindi), etiope ge'ez (amarico/tigrino). Aggiungere fallback dedicati: Noto Sans Arabic (arabo), Noto Sans SC (cinese), Noto Sans Devanagari (hindi), Noto Sans Ethiopic (amarico/tigrino, se inclusi). Somalo e wolof usano alfabeto latino (coperti). Definire font-stack per locale.

## Internazionalizzazione / RTL (requisito @07)
- Supporto RTL per l'arabo: impostare `dir="rtl"` a livello di documento per il locale.
- Usare proprieta logiche CSS (margin/padding/inset start-end, text-align start) invece di left/right per funzionare in LTR e RTL.
- Icone/elementi direzionali (frecce "avanti") vanno specchiati in RTL.

## Spaziatura (scala 4px)
- 1=4, 2=8, 3=12, 4=16, 6=24, 8=32, 12=48, 16=64.

## Raggi e ombre
- radius: sm 6px / md 10px / lg 16px / full 9999px.
- shadow: sobrie (card elevation leggera). Evitare ombre marcate.

## Implementazione
- Mappare i token in tailwind.config (theme.extend.colors/fontFamily/spacing) e/o CSS variables.
- Componenti via shadcn/ui (Radix) per accessibilita.

---

## Design system del CRM interno - "Flowdesk - Armellin"

> IMPORTANTE: il CRM ha un linguaggio visivo DIVERSO dal sito pubblico. Il sito pubblico e client-facing (navy/oro, serif Lora, trust & premium, light). Il CRM e uno strumento di lavoro interno (uso solo di Lorenzo): dark mode "developer tool", denso, efficiente. Si ISPIRA visivamente al CRM personale "Flowdesk - Maurotoncelli" (variante per Armellin). Codice e funzionalita saranno riscritti/diversi: qui si replica SOLO il linguaggio grafico.
> Fonte di riferimento (sola lettura, NON modificare): `/Volumes/Programs/Temporary files/sviluppo CRM personale/client/src/index.css` e i CSS dei componenti.

### Mood
- Dark mode, glassmorphism leggero (superfici semitrasparenti + blur), accenti gradiente indigo->viola, micro-ombre con leggero glow. Sobrio, denso, ad alta leggibilita su sfondo scuro.

### Colori (token CRM, dark)
| Token | HEX/valore | Uso |
|-------|-----------|-----|
| bg-primary | #0f0f14 | sfondo app |
| bg-secondary | #16161e | sidebar, topbar, header |
| bg-tertiary | #1e1e2a | input, superfici |
| bg-elevated | #252536 | menu, dropdown, popover, toast |
| bg-hover | #2a2a3d | hover |
| bg-active | #33334d | stato attivo / scrollbar |
| surface-glass | rgba(255,255,255,0.04) | superfici vetro |
| surface-glass-hover | rgba(255,255,255,0.07) | hover vetro |
| border-default | rgba(255,255,255,0.06) | bordi |
| border-light | rgba(255,255,255,0.10) | bordi marcati |
| text-primary | #e8e8f0 | testo principale |
| text-secondary | #9494b0 | testo secondario |
| text-muted | #5e5e7a | testo attenuato |
| accent-indigo | #818cf8 | accento primario (alias `--accent`) |
| accent-indigo-hover | #6366f1 | hover accento |
| accent-purple | #a78bfa | gradiente con indigo |
| accent-teal | #2dd4bf | stato/varieta |
| accent-amber | #fbbf24 | warning/varieta |
| accent-rose | #fb7185 | varieta |
| accent-green | #34d399 (#22c55e) | successo |
| danger | #ef4444 | errori/azioni distruttive |

- Gradiente firma: `linear-gradient(135deg, #818cf8, #a78bfa)` per CTA primarie, logo, avatar, FAB.
- Titoli con testo in gradiente: `linear-gradient(135deg, text-primary, accent-indigo)` clippato sul testo.

### Tipografia (CRM)
- Font unico: Inter (300-800). Base 14px, line-height 1.6, font-smoothing antialiased.
- Etichette/sezioni: 11-12px, uppercase, letter-spacing 0.5-1px, peso 600-700, colore muted.

### Raggi, spaziatura, ombre (CRM)
- radius: sm 6 / md 10 / lg 14 / xl 20 / full 9999.
- spacing: xs 4 / sm 8 / md 16 / lg 24 / xl 32 / 2xl 48.
- shadow: sm/md/lg/xl crescenti su nero + `shadow-glow` (alone indigo) per elementi attivi/AI.
- transition: fast 150ms / base 250ms / slow 400ms, easing `cubic-bezier(0.4,0,0.2,1)`.

### Layout e componenti chiave (da replicare visivamente)
- Layout a due colonne: sidebar fissa (260px, collassabile a 68px) + area principale con topbar (52px) e contenuto scrollabile.
- Sidebar: logo con icona gradiente, "profile pill" (avatar gradiente + nome), nav a sezioni con titoli uppercase, `nav-item` con icona + label + badge contatore; stato attivo = sfondo `accent-indigo-bg` + testo indigo. Pulsante "Quick Create" gradiente a tutta larghezza + menu a comparsa. Footer con trigger AI (riquadro gradiente tenue + glow su hover) e stato backup.
- Bottoni: `.btn` (radius md, 8x16, peso 500); primary = gradiente indigo/viola con glow e lift su hover; secondary = vetro + bordo; ghost = trasparente; danger = rosso tenue; icon = solo icona; FAB circolare 56px in basso a destra.
- Input/textarea/select: sfondo `bg-tertiary`, bordo default, focus con bordo indigo + alone `0 0 0 3px rgba(129,140,248,0.1)`.
- Card/KPI: superficie `--surface`, radius 14, hover con lift (-2px) + bordo accento; variante "accent" con gradiente indigo tenue.
- Modali: overlay scuro + blur, contenuto `bg-secondary`, radius xl, animazione `modalSlideIn` (fade + slide-up + scale).
- Tag/label: pill uppercase 11px; checkbox custom con check su sfondo indigo; toast in basso al centro; badge autosave (puntino pulsante "saving" -> verde "saved").
- Scrollbar sottile (6px), thumb `bg-active`.

### Nota di coerenza
- I token del CRM NON sostituiscono quelli del sito pubblico (sezioni sopra): convivono come due temi distinti. Se si usa un monorepo, tenerli in due set di variabili/temi separati (es. tema "site" e tema "crm").

### Implementazione (stack del progetto: Next.js + Tailwind + shadcn/ui)
Scelta congelata: il CRM usa lo STESSO stack del resto del progetto (no React+CSS vanilla). Il tema dark si applica scopandolo all'area CRM (es. la classe `.theme-crm` sul layout `/admin`, oppure un route group dedicato), lasciando il sito pubblico sul tema chiaro.

CSS variables (scope CRM) - pronte all'uso:

```css
.theme-crm {
  --bg-primary: #0f0f14;
  --bg-secondary: #16161e;
  --bg-tertiary: #1e1e2a;
  --bg-elevated: #252536;
  --bg-hover: #2a2a3d;
  --bg-active: #33334d;
  --surface-glass: rgba(255, 255, 255, 0.04);
  --surface-glass-hover: rgba(255, 255, 255, 0.07);
  --border-default: rgba(255, 255, 255, 0.06);
  --border-light: rgba(255, 255, 255, 0.1);
  --border-focus: rgba(129, 140, 248, 0.5);
  --text-primary: #e8e8f0;
  --text-secondary: #9494b0;
  --text-muted: #5e5e7a;
  --accent: #818cf8;
  --accent-hover: #6366f1;
  --accent-purple: #a78bfa;
  --accent-teal: #2dd4bf;
  --accent-amber: #fbbf24;
  --accent-rose: #fb7185;
  --accent-green: #34d399;
  --danger: #ef4444;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-xl: 20px;
  --gradient-brand: linear-gradient(135deg, #818cf8, #a78bfa);
}
```

Tailwind (theme.extend) - mappa i colori sulle variabili, cosi i due temi convivono:

```js
// tailwind.config.js (estratto per il tema CRM)
export default {
  theme: {
    extend: {
      colors: {
        crm: {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-elevated)',
          glass: 'var(--surface-glass)',
          border: 'var(--border-default)',
          text: 'var(--text-primary)',
          'text-muted': 'var(--text-muted)',
          accent: 'var(--accent)',
          purple: 'var(--accent-purple)',
          danger: 'var(--danger)',
        },
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)' },
      backgroundImage: { 'brand-gradient': 'var(--gradient-brand)' },
    },
  },
};
```

Linee guida d'uso:
- CTA primarie/logo/avatar/FAB: `bg-brand-gradient` (gradiente indigo->viola) + glow tramite shadow.
- Stato attivo nav: sfondo `accent` al 12% + testo `accent`.
- Focus input: bordo `--border-focus` + ring `0 0 0 3px rgba(129,140,248,0.1)`.
- Animazioni: usare solo `transform`/`opacity` (coerente con @SPEC_UX); easing `cubic-bezier(0.4,0,0.2,1)`.
