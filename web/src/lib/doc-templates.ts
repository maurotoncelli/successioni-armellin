/*
  Modelli (template) scaricabili abbinati alle voci della checklist documenti.
  Il cliente li scarica dall'area personale, li compila, li firma e li ricarica
  nella stessa voce. I PDF stanno in public/templates/:
  - quelli "dello studio" sono generati da scripts/generate-doc-templates.mjs;
  - dichiarazione-sostitutiva-eredi-ade.pdf e' il modello ufficiale
    dell'Agenzia delle Entrate (artt. 46-47 DPR 445/2000), scaricato dal sito.
  L'abbinamento avviene per etichetta (regex) cosi funziona anche sulle
  checklist gia generate e su quelle personalizzate da Lorenzo nel CRM.
*/

export type DocTemplate = {
  href: string;
  name: string;
};

const RULES: { pattern: RegExp; templates: DocTemplate[] }[] = [
  {
    pattern: /certificato di morte/i,
    templates: [
      {
        href: "/templates/dichiarazione-sostitutiva-certificato-morte.pdf",
        name: "Dichiarazione sostitutiva del certificato di morte (art. 46 DPR 445/2000)",
      },
    ],
  },
  {
    pattern: /stato di famiglia|albero genealogico/i,
    templates: [
      {
        href: "/templates/dichiarazione-sostitutiva-stato-famiglia-albero.pdf",
        name: "Dichiarazione sostitutiva di stato di famiglia e albero genealogico (artt. 46-47 DPR 445/2000)",
      },
      {
        href: "/templates/dichiarazione-sostitutiva-eredi-ade.pdf",
        name: "In alternativa: modello ufficiale dell'Agenzia delle Entrate",
      },
    ],
  },
];

export function templatesForLabel(label: string): DocTemplate[] {
  for (const rule of RULES) {
    if (rule.pattern.test(label)) return rule.templates;
  }
  return [];
}
