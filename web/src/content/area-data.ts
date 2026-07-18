/*
  Helper/etichette dell'Area personale cliente (logica di presentazione).
  I DATI veri della pratica del cliente loggato arrivano da Supabase con RLS
  (vedi lib/area.ts, @06/@11). Qui restano solo: mappatura stati client-friendly,
  step della pratica, "prossima azione" e l'elenco fac-simile dei documenti finali.
  Le stringhe utente passano da content_entries (`area.*`) via i caller.
*/

import { type Practice, type RequirementStatus } from "@/content/crm-data";

export const clientStepsFallback = [
  "Documenti da caricare",
  "In lavorazione",
  "Inviata all'Agenzia",
  "Conclusa",
] as const;

/** @deprecated usa steps passati dal content; tenuto per compat. */
export const clientSteps = clientStepsFallback;

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

export function isPracticeCancelled(p: Practice): boolean {
  return p.status === "ANNULLATA" || p.paymentStatus === "REFUNDED";
}

export type ClientDocState = "DA_CARICARE" | "CARICATO" | "DA_RIFARE";

export type ClientDocLabels = Record<
  ClientDocState,
  { label: string; tone: "warning" | "success" | "error" }
>;

export const clientDocMetaFallback: ClientDocLabels = {
  DA_CARICARE: { label: "Da caricare", tone: "warning" },
  CARICATO: { label: "Caricato", tone: "success" },
  DA_RIFARE: { label: "Da rifare", tone: "error" },
};

/** @deprecated */
export const clientDocMeta = clientDocMetaFallback;

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

export type NextActionLabels = {
  closed_title: string;
  closed_cta: string;
  docs_title: string;
  docs_cta: string;
  working_title: string;
  working_cta: string;
  idle_title: string;
  idle_cta: string;
};

export function nextAction(
  p: Practice,
  labels?: Partial<NextActionLabels>,
): {
  title: string;
  cta: string;
  href: string;
} {
  const L: NextActionLabels = {
    closed_title: labels?.closed_title ?? "La tua pratica è conclusa.",
    closed_cta: labels?.closed_cta ?? "Scarica i documenti finali",
    docs_title: labels?.docs_title ?? "Mancano alcuni documenti per procedere.",
    docs_cta: labels?.docs_cta ?? "Carica i documenti",
    working_title: labels?.working_title ?? "Stiamo lavorando alla tua pratica.",
    working_cta: labels?.working_cta ?? "Vedi lo stato",
    idle_title:
      labels?.idle_title ?? "Tutto in ordine, non serve nessuna azione adesso.",
    idle_cta: labels?.idle_cta ?? "Vedi il tuo acquisto",
  };
  const hasMissingDocs = p.checklist.some(
    (d) => d.required && (d.status === "ATTESO" || d.status === "RIFIUTATO"),
  );
  if (p.status === "CHIUSA")
    return {
      title: L.closed_title,
      cta: L.closed_cta,
      href: "/area-riservata/conclusa",
    };
  if (hasMissingDocs)
    return {
      title: L.docs_title,
      cta: L.docs_cta,
      href: "/area-riservata/documenti",
    };
  if (p.status === "LAVORAZIONE")
    return {
      title: L.working_title,
      cta: L.working_cta,
      href: "/area-riservata/dashboard",
    };
  return {
    title: L.idle_title,
    cta: L.idle_cta,
    href: "/area-riservata/ordine",
  };
}
