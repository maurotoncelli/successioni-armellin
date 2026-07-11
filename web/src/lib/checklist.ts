import type { ChecklistItem } from "@/content/crm-data";

/*
  Generazione automatica della checklist documenti alla transizione a PAGATO
  (@06 "Upload documenti", @SPEC_API_Contracts `generateChecklist`).
  Funzione PURA: deriva le voci dai dati della pratica (immobili/testamento/
  minorenni); Lorenzo puo poi personalizzarla dal CRM. Il cliente vede la
  checklist nell'area personale e carica i file voce per voce.
*/

export type ChecklistInput = {
  hasRealEstate: boolean;
  realEstateCount?: number | null;
  hasWill: boolean;
  hasMinorHeirs?: boolean;
};

function item(
  label: string,
  required: boolean,
  help?: string,
): ChecklistItem {
  return { label, required, status: "ATTESO", help };
}

export function generateChecklist(input: ChecklistInput): ChecklistItem[] {
  const items: ChecklistItem[] = [
    item(
      "Documento d'identita degli eredi",
      true,
      "Carta d'identita (fronte e retro) di tutti gli eredi, ben leggibile.",
    ),
    item(
      "Codice fiscale / tessera sanitaria degli eredi",
      true,
      "Tessera sanitaria o codice fiscale di tutti gli eredi e del defunto.",
    ),
    item(
      "Certificato di morte",
      true,
      "Rilasciato dal Comune. In alternativa va bene l'autocertificazione.",
    ),
    item(
      "Autocertificazione stato di famiglia / albero genealogico",
      true,
      "Serve a ricostruire chi sono gli eredi. Ti forniamo noi il modello se serve.",
    ),
  ];

  if (input.hasRealEstate) {
    const count = Math.max(1, input.realEstateCount ?? 1);
    for (let i = 1; i <= count; i += 1) {
      const suffix = count > 1 ? ` - immobile ${i}` : "";
      items.push(
        item(
          `Visura catastale${suffix}`,
          true,
          "La trovi tra i documenti del catasto, oppure te la procuriamo noi.",
        ),
      );
    }
    items.push(
      item(
        "Atto di provenienza degli immobili",
        true,
        "Rogito di acquisto, donazione o precedente successione.",
      ),
      item(
        "Planimetrie catastali",
        false,
        "Se le hai a disposizione: non bloccanti, aiutano a velocizzare.",
      ),
    );
  }

  if (input.hasWill) {
    items.push(
      item(
        "Testamento / verbale di pubblicazione",
        true,
        "Copia del testamento e, se gia pubblicato dal notaio, il verbale di pubblicazione.",
      ),
    );
  }

  if (input.hasMinorHeirs) {
    items.push(
      item(
        "Autorizzazione del Giudice Tutelare",
        true,
        "Necessaria quando tra gli eredi ci sono minorenni o persone incapaci.",
      ),
    );
  }

  return items;
}
