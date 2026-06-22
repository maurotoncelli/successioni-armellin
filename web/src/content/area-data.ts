/*
  Dati FINTI dell'Area Riservata cliente (prototipo Fase 5 anticipato).
  Data-driven: derivano dalla stessa pratica gestita nel CRM (fonte unica,
  vedi crm-data.ts). In produzione arriveranno da Supabase con RLS (@06/@11).
  Per il prototipo "il cliente loggato" e Lucia Ferri (pratica p3, in attesa documenti).
*/

import {
  practices,
  type Practice,
  type RequirementStatus,
} from "@/content/crm-data";

export const currentPractice: Practice =
  practices.find((p) => p.id === "p3") ?? practices[0];

export const account = {
  name: currentPractice.clientName,
  email: currentPractice.clientEmail,
  phone: currentPractice.clientPhone,
  practiceCode: currentPractice.code,
};

// Etichette di stato "client-friendly" (non i nomi interni Kanban)
export const clientSteps = [
  "Documenti da caricare",
  "In lavorazione",
  "Inviata all'Agenzia",
  "Conclusa",
] as const;

export function currentStepIndex(status: Practice["status"]): number {
  switch (status) {
    case "LEAD":
    case "PREVENTIVO_INVIATO":
    case "PAGATO":
    case "ATTESA_DOC":
      return 0;
    case "LAVORAZIONE":
      return 1;
    case "INVIATA":
      return 2;
    case "CHIUSA":
      return 3;
    default:
      return 0;
  }
}

export type ClientDocState = "DA_CARICARE" | "CARICATO" | "DA_RIFARE";

export const clientDocMeta: Record<
  ClientDocState,
  { label: string; tone: "warning" | "success" | "error" }
> = {
  DA_CARICARE: { label: "Da caricare", tone: "warning" },
  CARICATO: { label: "Caricato", tone: "success" },
  DA_RIFARE: { label: "Da rifare", tone: "error" },
};

// Mappa lo stato interno (CRM) nei 3 stati semplici lato cliente.
// "Approvato" e interno: per il cliente conta come "Caricato".
// "Non applicabile" non viene mostrato (return null).
export function toClientDocState(
  status: RequirementStatus,
): ClientDocState | null {
  switch (status) {
    case "ATTESO":
      return "DA_CARICARE";
    case "CARICATO":
    case "APPROVATO":
      return "CARICATO";
    case "RIFIUTATO":
      return "DA_RIFARE";
    case "NON_APPLICABILE":
      return null;
  }
}

// Documenti finali (mostrati a pratica conclusa). Mock per il prototipo.
export const finalDocuments = [
  {
    label: "Ricevuta di presentazione - Agenzia delle Entrate",
    description: "Attestazione telematica con protocollo di registrazione.",
  },
  {
    label: "Dichiarazione di successione (copia)",
    description: "Il modello presentato all'Agenzia.",
  },
  {
    label: "Visure catastali aggiornate (volture)",
    description: "Gli immobili intestati agli eredi.",
  },
  {
    label: "Fattura dell'onorario",
    description: "Documento fiscale del nostro compenso.",
  },
];

// Riepilogo "prossima azione" per la dashboard, derivato dallo stato.
export function nextAction(p: Practice): {
  title: string;
  cta: string;
  href: string;
} {
  const hasMissingDocs = p.checklist.some(
    (d) => d.required && (d.status === "ATTESO" || d.status === "RIFIUTATO"),
  );
  if (p.status === "CHIUSA")
    return {
      title: "La tua pratica e conclusa.",
      cta: "Scarica i documenti finali",
      href: "/area-riservata/conclusa",
    };
  if (hasMissingDocs)
    return {
      title: "Mancano alcuni documenti per procedere.",
      cta: "Carica i documenti",
      href: "/area-riservata/documenti",
    };
  if (p.status === "LAVORAZIONE")
    return {
      title: "Stiamo lavorando alla tua pratica.",
      cta: "Vedi lo stato",
      href: "/area-riservata/dashboard",
    };
  return {
    title: "Tutto in ordine, non serve nessuna azione adesso.",
    cta: "Vedi il tuo acquisto",
    href: "/area-riservata/ordine",
  };
}
