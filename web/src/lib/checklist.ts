import type { ChecklistItem } from "@/content/crm-data";
import {
  getDocumentTypesState,
  isTypeActive,
  type DocumentTypeState,
} from "@/lib/document-types";

/*
  Generazione automatica della checklist documenti alla transizione a PAGATO
  (@06 "Upload documenti", @SPEC_API_Contracts `generateChecklist`).
  Funzione PURA sui dati pratica + catalogo tipologie (override CRM opzionale).
  Lorenzo puo poi personalizzarla dal CRM. Il cliente vede la checklist
  nell'area personale e carica i file voce per voce.
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

/** Generazione sync con stato catalogo gia' caricato (test / batch). */
export function generateChecklistFromState(
  input: ChecklistInput,
  state: DocumentTypeState,
): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const on = (id: string) => isTypeActive(state, id);

  if (on("id_eredi")) {
    items.push(
      item(
        "Documento d'identita degli eredi",
        true,
        "Carta d'identita (fronte e retro) di tutti gli eredi, ben leggibile.",
      ),
    );
  }
  if (on("cf_eredi")) {
    items.push(
      item(
        "Codice fiscale / tessera sanitaria degli eredi",
        true,
        "Tessera sanitaria o codice fiscale di tutti gli eredi e del defunto.",
      ),
    );
  }
  if (on("morte")) {
    items.push(
      item(
        "Certificato di morte",
        true,
        "Rilasciato dal Comune. In alternativa compila la dichiarazione sostitutiva di certificato di morte e stato di famiglia del defunto: il modello e qui sotto.",
      ),
    );
  }
  if (on("stato_famiglia")) {
    items.push(
      item(
        "Autocertificazione stato di famiglia di ciascun erede",
        true,
        "Serve a ricostruire chi sono gli eredi: OGNI erede compila e firma il proprio modello (lo trovi qui sotto), poi caricali tutti in questa voce.",
      ),
    );
  }

  if (input.hasRealEstate) {
    if (on("visura")) {
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
    }
    if (on("provenienza")) {
      items.push(
        item(
          "Atto di provenienza degli immobili",
          true,
          "Rogito di acquisto, donazione o precedente successione.",
        ),
      );
    }
    if (on("planimetrie")) {
      items.push(
        item(
          "Planimetrie catastali",
          false,
          "Se le hai a disposizione: non bloccanti, aiutano a velocizzare.",
        ),
      );
    }
  }

  if (input.hasWill && on("testamento")) {
    items.push(
      item(
        "Testamento / verbale di pubblicazione",
        true,
        "Copia del testamento e, se gia pubblicato dal notaio, il verbale di pubblicazione.",
      ),
    );
  }

  if (input.hasMinorHeirs && on("giudice_tutelare")) {
    items.push(
      item(
        "Autorizzazione del Giudice Tutelare",
        true,
        "Necessaria quando tra gli eredi ci sono minorenni o persone incapaci.",
      ),
    );
  }

  // Tipi custom attivi (quando la regola matcha).
  for (const t of state.custom) {
    if (!isTypeActive(state, t.id)) continue;
    const match =
      t.when === "always" ||
      (t.when === "real_estate" && input.hasRealEstate) ||
      (t.when === "will" && input.hasWill) ||
      (t.when === "minors" && Boolean(input.hasMinorHeirs));
    if (match) items.push(item(t.label, t.required, t.help || undefined));
  }

  return items;
}

/** API storica: carica override CRM poi genera. */
export async function generateChecklist(
  input: ChecklistInput,
): Promise<ChecklistItem[]> {
  const state = await getDocumentTypesState();
  return generateChecklistFromState(input, state);
}

/** Sync fallback (fixture / se Storage non disponibile). */
export function generateChecklistSync(input: ChecklistInput): ChecklistItem[] {
  return generateChecklistFromState(input, {
    active: {},
    checked: {},
    custom: [],
    updatedAt: null,
  });
}
