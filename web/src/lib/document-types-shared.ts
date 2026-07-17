export type DocWhen = "always" | "real_estate" | "will" | "minors";

export type DocumentTypeDef = {
  id: string;
  label: string;
  required: boolean;
  help: string;
  when: DocWhen;
  /** Built-in vs aggiunto da Lorenzo. */
  builtin: boolean;
};

export type DocumentTypeState = {
  /** id -> attivo in generazione checklist (default true se assente). */
  active: Record<string, boolean>;
  /** id -> Lorenzo ha spuntato “verificato / mi serve”. */
  checked: Record<string, boolean>;
  custom: DocumentTypeDef[];
  updatedAt: string | null;
};

export const WHEN_LABELS: Record<DocWhen, string> = {
  always: "Sempre",
  real_estate: "Se ci sono immobili",
  will: "Se c'è testamento",
  minors: "Se ci sono eredi minorenni",
};

export const BUILTIN_DOCUMENT_TYPES: DocumentTypeDef[] = [
  {
    id: "id_eredi",
    label: "Documento d'identita degli eredi",
    required: true,
    help: "Carta d'identita (fronte e retro) di tutti gli eredi, ben leggibile.",
    when: "always",
    builtin: true,
  },
  {
    id: "cf_eredi",
    label: "Codice fiscale / tessera sanitaria degli eredi",
    required: true,
    help: "Tessera sanitaria o codice fiscale di tutti gli eredi e del defunto.",
    when: "always",
    builtin: true,
  },
  {
    id: "morte",
    label: "Certificato di morte",
    required: true,
    help: "Rilasciato dal Comune. In alternativa compila la dichiarazione sostitutiva di certificato di morte e stato di famiglia del defunto: il modello e qui sotto.",
    when: "always",
    builtin: true,
  },
  {
    id: "stato_famiglia",
    label: "Autocertificazione stato di famiglia di ciascun erede",
    required: true,
    help: "Serve a ricostruire chi sono gli eredi: OGNI erede compila e firma il proprio modello (lo trovi qui sotto), poi caricali tutti in questa voce.",
    when: "always",
    builtin: true,
  },
  {
    id: "visura",
    label: "Visura catastale (per ogni immobile)",
    required: true,
    help: "La trovi tra i documenti del catasto, oppure te la procuriamo noi. In checklist viene ripetuta per ogni immobile.",
    when: "real_estate",
    builtin: true,
  },
  {
    id: "provenienza",
    label: "Atto di provenienza degli immobili",
    required: true,
    help: "Rogito di acquisto, donazione o precedente successione.",
    when: "real_estate",
    builtin: true,
  },
  {
    id: "planimetrie",
    label: "Planimetrie catastali",
    required: false,
    help: "Se le hai a disposizione: non bloccanti, aiutano a velocizzare.",
    when: "real_estate",
    builtin: true,
  },
  {
    id: "testamento",
    label: "Testamento / verbale di pubblicazione",
    required: true,
    help: "Copia del testamento e, se gia pubblicato dal notaio, il verbale di pubblicazione.",
    when: "will",
    builtin: true,
  },
  {
    id: "giudice_tutelare",
    label: "Autorizzazione del Giudice Tutelare",
    required: true,
    help: "Necessaria quando tra gli eredi ci sono minorenni o persone incapaci.",
    when: "minors",
    builtin: true,
  },
];
