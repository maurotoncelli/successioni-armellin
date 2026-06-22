import type { PracticeStatus } from "@/content/crm-data";

/*
  Mappa client-safe delle transizioni a EFFETTO ESTERNO (@05 "Sicurezza delle
  automazioni"): spostare una pratica verso questi stati invia un'email al
  cliente, quindi richiede una conferma esplicita (niente automazione silenziosa
  sul drag). Le transizioni neutre (es. tornare a Lead) non chiedono conferma.
  NB: i template email completi vivono in lib/notifications.ts (server). Qui
  teniamo solo una descrizione breve per la modale di conferma.
*/

export const EXTERNAL_EFFECT_STATUSES: PracticeStatus[] = [
  "PAGATO",
  "ATTESA_DOC",
  "LAVORAZIONE",
  "INVIATA",
  "CHIUSA",
];

export function hasExternalEffect(status: PracticeStatus): boolean {
  return EXTERNAL_EFFECT_STATUSES.includes(status);
}

export const transitionEmailLabel: Partial<Record<PracticeStatus, string>> = {
  PAGATO: "conferma del pagamento e invito a caricare i documenti",
  ATTESA_DOC: "richiesta dei documenti mancanti",
  LAVORAZIONE: "messaggio di rassicurazione: stiamo lavorando alla pratica",
  INVIATA: "aggiornamento: pratica inviata all'Agenzia delle Entrate",
  CHIUSA: "pratica conclusa, documenti finali disponibili",
};
