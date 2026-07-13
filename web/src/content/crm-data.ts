/*
  Dati FINTI del prototipo CRM (Fase 2). Nessun backend: servono solo a validare
  layout e flusso con Lorenzo. Allineati agli enum di blueprint/SPEC_Data_Model.md.
  In Fase 5 verranno sostituiti da letture Supabase (stesse forme).
*/

export type PracticeStatus =
  | "LEAD"
  | "PREVENTIVO_INVIATO"
  | "PAGATO"
  | "ATTESA_DOC"
  | "LAVORAZIONE"
  | "INVIATA"
  | "CHIUSA"
  | "ANNULLATA";

export type ActionOwner = "ADMIN" | "CLIENT" | "EXTERNAL" | "NONE";
export type PackageType = "SEMPLICE" | "COMPLETO" | "ZERO_STRESS" | null;
export type PaymentStatus =
  | "NONE"
  | "PENDING"
  | "PAID"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";
export type RequirementStatus =
  | "ATTESO"
  | "CARICATO"
  | "APPROVATO"
  | "RIFIUTATO"
  | "NON_APPLICABILE";

export const statusLabels: Record<PracticeStatus, string> = {
  LEAD: "Nuovo Lead",
  PREVENTIVO_INVIATO: "Preventivo Inviato",
  PAGATO: "Pagato / Incaricato",
  ATTESA_DOC: "In Attesa Documenti",
  LAVORAZIONE: "In Lavorazione",
  INVIATA: "Inviata / Attesa AdE",
  CHIUSA: "Chiusa",
  ANNULLATA: "Persa / Annullata",
};

export const pipelineOrder: PracticeStatus[] = [
  "LEAD",
  "PREVENTIVO_INVIATO",
  "PAGATO",
  "ATTESA_DOC",
  "LAVORAZIONE",
  "INVIATA",
  "CHIUSA",
];

export const actionOwnerMeta: Record<
  ActionOwner,
  { label: string; tone: string }
> = {
  ADMIN: { label: "Tocca a te", tone: "accent" },
  CLIENT: { label: "In attesa del cliente", tone: "amber" },
  EXTERNAL: { label: "In attesa AdE", tone: "muted" },
  NONE: { label: "Nessuna azione", tone: "muted" },
};

export type ChecklistFile = {
  path: string; // percorso in Storage (privato)
  name: string; // nome originale del file
  uploadedAt?: string; // ISO timestamp del caricamento
};

export type ChecklistItem = {
  label: string;
  required: boolean;
  status: RequirementStatus;
  reason?: string; // motivo del rifiuto (stato RIFIUTATO)
  help?: string; // istruzioni mostrate al cliente
  /**
   * File caricati per la voce (max 3: es. fronte/retro documento).
   * filePath/fileName restano per retro-compatibilita con le pratiche esistenti
   * e rispecchiano il PRIMO file; usare lib/documents.listItemFiles per leggerli.
   */
  files?: ChecklistFile[];
  filePath?: string; // percorso del primo file in Storage (privato)
  fileName?: string; // nome originale del primo file caricato dal cliente
  uploadedAt?: string; // ISO timestamp dell'ultimo caricamento
};

export type Communication = {
  channel: "EMAIL" | "WHATSAPP" | "PHONE" | "IN_PERSON";
  direction: "INBOUND" | "OUTBOUND";
  source: "AUTO" | "MANUAL";
  subject: string;
  occurredAt: string;
};

export type LogEvent = { action: string; at: string };
export type TaskItem = { title: string; dueDate: string | null; done: boolean };
export type LineItem = { label: string; amount: number };

export type Practice = {
  id: string;
  code: string;
  status: PracticeStatus;
  actionOwner: ActionOwner;
  // contatto / cliente
  contactId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  relation: string;
  // defunto
  deceasedName: string;
  deceasedCf: string;
  dateOfDeath: string;
  residence: string;
  // pratica
  hasWill: boolean;
  heirsCount: number;
  hasMinorHeirs: boolean;
  hasRealEstate: boolean;
  realEstateCount: number | null;
  requiresCustomQuote: boolean;
  urgent: boolean;
  // commerciale
  suggestedPackage: PackageType;
  selectedPackage: PackageType;
  price: number;
  lineItems: LineItem[];
  paymentStatus: PaymentStatus;
  paymentMethod: "STRIPE" | "BANK_TRANSFER" | null;
  // date
  openedAt: string | null;
  dueDate: string | null;
  submittedAt: string | null;
  createdAt: string;
  // imposte
  stateTaxes: number | null;
  // appunti
  callNotes: string;
  paymentNotes: string;
  notes: string;
  // collezioni
  checklist: ChecklistItem[];
  communications: Communication[];
  tasks: TaskItem[];
  log: LogEvent[];
};

export const practices: Practice[] = [
  {
    id: "p1",
    code: "SUC-2026-0012",
    status: "LEAD",
    actionOwner: "ADMIN",
    contactId: "c1",
    clientName: "Maria Rossi",
    clientEmail: "maria.rossi@email.it",
    clientPhone: "+39 333 1234567",
    relation: "Figlia",
    deceasedName: "Giuseppe Rossi",
    deceasedCf: "RSSGPP40A01G702X",
    dateOfDeath: "2026-03-14",
    residence: "Pontedera (PI)",
    hasWill: false,
    heirsCount: 3,
    hasMinorHeirs: false,
    hasRealEstate: true,
    realEstateCount: 2,
    requiresCustomQuote: false,
    urgent: false,
    suggestedPackage: "COMPLETO",
    selectedPackage: null,
    price: 0,
    lineItems: [],
    paymentStatus: "NONE",
    paymentMethod: null,
    openedAt: null,
    dueDate: null,
    submittedAt: null,
    createdAt: "2026-06-20",
    stateTaxes: null,
    callNotes: "",
    paymentNotes: "",
    notes: "Lead dal form. Da richiamare per consulenza.",
    checklist: [],
    communications: [
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Abbiamo ricevuto la tua richiesta",
        occurredAt: "2026-06-20 09:12",
      },
    ],
    tasks: [
      { title: "Chiamare Maria per consulenza", dueDate: "2026-06-23", done: false },
    ],
    log: [{ action: "lead_creato", at: "2026-06-20 09:12" }],
  },
  {
    id: "p2",
    code: "SUC-2026-0011",
    status: "PREVENTIVO_INVIATO",
    actionOwner: "CLIENT",
    contactId: "c2",
    clientName: "Ahmed Benali",
    clientEmail: "a.benali@email.it",
    clientPhone: "+39 340 9988776",
    relation: "Figlio",
    deceasedName: "Fatima Benali",
    deceasedCf: "BNLFTM55E41Z330K",
    dateOfDeath: "2026-02-02",
    residence: "Cascina (PI)",
    hasWill: false,
    heirsCount: 4,
    hasMinorHeirs: true,
    hasRealEstate: true,
    realEstateCount: 1,
    requiresCustomQuote: false,
    urgent: false,
    suggestedPackage: "COMPLETO",
    selectedPackage: "COMPLETO",
    price: 490,
    lineItems: [{ label: "Successione Completa", amount: 490 }],
    paymentStatus: "PENDING",
    paymentMethod: null,
    openedAt: null,
    dueDate: null,
    submittedAt: null,
    createdAt: "2026-06-15",
    stateTaxes: null,
    callNotes: "Eredi minorenni: serve autorizzazione GT. Spiegato al cliente.",
    paymentNotes: "Link di pagamento inviato il 18/06.",
    notes: "",
    checklist: [],
    communications: [
      {
        channel: "PHONE",
        direction: "OUTBOUND",
        source: "MANUAL",
        subject: "Consulenza telefonica (15 min)",
        occurredAt: "2026-06-18 11:00",
      },
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Il tuo preventivo + link di pagamento",
        occurredAt: "2026-06-18 11:20",
      },
    ],
    tasks: [],
    log: [
      { action: "lead_creato", at: "2026-06-15 16:02" },
      { action: "preventivo_inviato", at: "2026-06-18 11:20" },
    ],
  },
  {
    id: "p3",
    code: "SUC-2026-0010",
    status: "ATTESA_DOC",
    actionOwner: "CLIENT",
    contactId: "c3",
    clientName: "Lucia Ferri",
    clientEmail: "lucia.ferri@email.it",
    clientPhone: "+39 348 1122334",
    relation: "Coniuge",
    deceasedName: "Marco Ferri",
    deceasedCf: "FRRMRC58H12G843T",
    dateOfDeath: "2026-01-20",
    residence: "Pisa",
    hasWill: false,
    heirsCount: 2,
    hasMinorHeirs: false,
    hasRealEstate: true,
    realEstateCount: 3,
    requiresCustomQuote: false,
    urgent: false,
    suggestedPackage: "COMPLETO",
    selectedPackage: "COMPLETO",
    price: 490,
    lineItems: [{ label: "Successione Completa", amount: 490 }],
    paymentStatus: "PAID",
    paymentMethod: "STRIPE",
    openedAt: "2026-06-10",
    dueDate: null,
    submittedAt: null,
    createdAt: "2026-06-05",
    stateTaxes: null,
    callNotes: "",
    paymentNotes: "Pagato online il 10/06.",
    notes: "Mancano ancora 2 visure.",
    checklist: [
      { label: "Carta d'identita di Lucia Ferri", required: true, status: "APPROVATO", help: "Fronte e retro, ben leggibili." },
      { label: "Certificato di morte", required: true, status: "APPROVATO" },
      { label: "Visura catastale - immobile 1", required: true, status: "CARICATO", help: "La trovi tra i documenti del catasto o te la procuriamo noi." },
      { label: "Visura catastale - immobile 2", required: true, status: "ATTESO", help: "La trovi tra i documenti del catasto o te la procuriamo noi." },
      {
        label: "Atto di provenienza",
        required: true,
        status: "RIFIUTATO",
        reason: "Il file caricato e illeggibile: ricarica una scansione piu nitida o una foto a fuoco.",
        help: "E' il rogito/atto con cui il defunto aveva acquisito l'immobile.",
      },
      { label: "IBAN dell'erede", required: false, status: "ATTESO", help: "Serve solo per l'eventuale addebito delle imposte (F24)." },
    ],
    communications: [
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Pagamento confermato + invito caricamento documenti",
        occurredAt: "2026-06-10 14:32",
      },
      {
        channel: "WHATSAPP",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Promemoria: mancano 2 documenti",
        occurredAt: "2026-06-19 09:00",
      },
    ],
    tasks: [{ title: "Sollecitare visure mancanti", dueDate: "2026-06-24", done: false }],
    log: [
      { action: "preventivo_inviato", at: "2026-06-08 10:00" },
      { action: "pagamento_ricevuto", at: "2026-06-10 14:32" },
      { action: "documento_approvato", at: "2026-06-12 08:40" },
    ],
  },
  {
    id: "p4",
    code: "SUC-2026-0009",
    status: "LAVORAZIONE",
    actionOwner: "ADMIN",
    contactId: "c4",
    clientName: "Giovanni Bruno",
    clientEmail: "g.bruno@email.it",
    clientPhone: "+39 339 5566778",
    relation: "Figlio",
    deceasedName: "Anna Bruno",
    deceasedCf: "BRNNNA42D55G702Y",
    dateOfDeath: "2025-12-10",
    residence: "Pontedera (PI)",
    hasWill: true,
    heirsCount: 2,
    hasMinorHeirs: false,
    hasRealEstate: true,
    realEstateCount: 1,
    requiresCustomQuote: false,
    urgent: true,
    suggestedPackage: "COMPLETO",
    selectedPackage: "ZERO_STRESS",
    price: 790,
    lineItems: [
      { label: "Zero Stress", amount: 790 },
    ],
    paymentStatus: "PAID",
    paymentMethod: "STRIPE",
    openedAt: "2026-05-28",
    dueDate: "2026-07-03",
    submittedAt: null,
    createdAt: "2026-05-20",
    stateTaxes: 1240,
    callNotes: "Testamento pubblicato. Cliente molto ansioso, tenere aggiornato.",
    paymentNotes: "",
    notes: "Tutti i documenti approvati il 20/06. In lavorazione.",
    checklist: [
      { label: "Carta d'identita di Giovanni Bruno", required: true, status: "APPROVATO" },
      { label: "Certificato di morte", required: true, status: "APPROVATO" },
      { label: "Testamento pubblicato", required: true, status: "APPROVATO" },
      { label: "Visura catastale", required: true, status: "APPROVATO" },
      { label: "Atto di provenienza", required: true, status: "APPROVATO" },
    ],
    communications: [
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Documenti completi: iniziamo la lavorazione",
        occurredAt: "2026-06-20 16:00",
      },
    ],
    tasks: [
      { title: "Compilare quadri su Sogei", dueDate: "2026-06-30", done: false },
      { title: "Comunicare imposte al cliente", dueDate: "2026-06-26", done: false },
    ],
    log: [
      { action: "pagamento_ricevuto", at: "2026-05-28 10:00" },
      { action: "documenti_approvati", at: "2026-06-20 15:50" },
      { action: "imposte_comunicate", at: "2026-06-21 09:00" },
    ],
  },
  {
    id: "p5",
    code: "SUC-2026-0008",
    status: "INVIATA",
    actionOwner: "EXTERNAL",
    contactId: "c5",
    clientName: "Sofia Greco",
    clientEmail: "sofia.greco@email.it",
    clientPhone: "+39 347 2233445",
    relation: "Figlia",
    deceasedName: "Paolo Greco",
    deceasedCf: "GRCPLA39A01H501Z",
    dateOfDeath: "2025-11-05",
    residence: "Livorno",
    hasWill: false,
    heirsCount: 1,
    hasMinorHeirs: false,
    hasRealEstate: false,
    realEstateCount: null,
    requiresCustomQuote: false,
    urgent: false,
    suggestedPackage: "SEMPLICE",
    selectedPackage: "SEMPLICE",
    price: 290,
    lineItems: [{ label: "Successione Semplice", amount: 290 }],
    paymentStatus: "PAID",
    paymentMethod: "STRIPE",
    openedAt: "2026-05-12",
    dueDate: "2026-06-18",
    submittedAt: "2026-06-17",
    createdAt: "2026-05-05",
    stateTaxes: 320,
    callNotes: "",
    paymentNotes: "",
    notes: "Inviata all'AdE il 17/06, in attesa ricevute.",
    checklist: [
      { label: "Carta d'identita di Sofia Greco", required: true, status: "APPROVATO" },
      { label: "Certificato di morte", required: true, status: "APPROVATO" },
      { label: "Certificazione saldo conti", required: true, status: "APPROVATO" },
    ],
    communications: [
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "MANUAL",
        subject: "Dichiarazione inviata all'Agenzia",
        occurredAt: "2026-06-17 12:00",
      },
    ],
    tasks: [],
    log: [
      { action: "documenti_approvati", at: "2026-06-01 10:00" },
      { action: "dichiarazione_presentata", at: "2026-06-17 12:00" },
    ],
  },
  {
    id: "p6",
    code: "SUC-2026-0007",
    status: "CHIUSA",
    actionOwner: "NONE",
    contactId: "c6",
    clientName: "Roberto Conti",
    clientEmail: "r.conti@email.it",
    clientPhone: "+39 333 9090909",
    relation: "Coniuge",
    deceasedName: "Elena Conti",
    deceasedCf: "CNTLNE60M41G702W",
    dateOfDeath: "2025-09-01",
    residence: "Pontedera (PI)",
    hasWill: false,
    heirsCount: 2,
    hasMinorHeirs: false,
    hasRealEstate: true,
    realEstateCount: 1,
    requiresCustomQuote: false,
    urgent: false,
    suggestedPackage: "COMPLETO",
    selectedPackage: "COMPLETO",
    price: 490,
    lineItems: [{ label: "Successione Completa", amount: 490 }],
    paymentStatus: "PAID",
    paymentMethod: "STRIPE",
    openedAt: "2026-03-10",
    dueDate: "2026-04-15",
    submittedAt: "2026-04-10",
    createdAt: "2026-03-01",
    stateTaxes: 980,
    callNotes: "",
    paymentNotes: "",
    notes: "Pratica conclusa, documenti finali consegnati.",
    checklist: [
      { label: "Documenti", required: true, status: "APPROVATO" },
    ],
    communications: [
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Pratica conclusa: documenti disponibili",
        occurredAt: "2026-04-12 10:00",
      },
    ],
    tasks: [],
    log: [
      { action: "dichiarazione_presentata", at: "2026-04-10 11:00" },
      { action: "pratica_chiusa", at: "2026-04-12 10:00" },
    ],
  },
  {
    id: "p7",
    code: "SUC-2026-0006",
    status: "PAGATO",
    actionOwner: "ADMIN",
    contactId: "c7",
    clientName: "Wei Chen",
    clientEmail: "wei.chen@email.it",
    clientPhone: "+39 351 4455667",
    relation: "Figlio",
    deceasedName: "Li Chen",
    deceasedCf: "CHNLIA52T70Z210B",
    dateOfDeath: "2026-04-01",
    residence: "Empoli (FI)",
    hasWill: false,
    heirsCount: 2,
    hasMinorHeirs: false,
    hasRealEstate: true,
    realEstateCount: 1,
    requiresCustomQuote: false,
    urgent: false,
    suggestedPackage: "COMPLETO",
    selectedPackage: "COMPLETO",
    price: 490,
    lineItems: [{ label: "Successione Completa", amount: 490 }],
    paymentStatus: "PAID",
    paymentMethod: "STRIPE",
    openedAt: "2026-06-21",
    dueDate: null,
    submittedAt: null,
    createdAt: "2026-06-16",
    stateTaxes: null,
    callNotes: "Cliente straniero: comunicare per iscritto i punti chiave.",
    paymentNotes: "Pagato online il 21/06.",
    notes: "Da generare la checklist documenti.",
    checklist: [],
    communications: [
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Pagamento confermato",
        occurredAt: "2026-06-21 18:05",
      },
    ],
    tasks: [{ title: "Generare e inviare checklist documenti", dueDate: "2026-06-23", done: false }],
    log: [
      { action: "preventivo_inviato", at: "2026-06-19 10:00" },
      { action: "pagamento_ricevuto", at: "2026-06-21 18:05" },
    ],
  },
  {
    id: "p8",
    code: "SUC-2026-0005",
    status: "PREVENTIVO_INVIATO",
    actionOwner: "CLIENT",
    contactId: "c8",
    clientName: "Elisa Marchetti",
    clientEmail: "e.marchetti@email.it",
    clientPhone: "+39 333 7766554",
    relation: "Altro (nipote)",
    deceasedName: "Carla Marchetti",
    deceasedCf: "MRCCRL35P61G702Q",
    dateOfDeath: "2025-08-15",
    residence: "Pontedera (PI)",
    hasWill: true,
    heirsCount: 5,
    hasMinorHeirs: false,
    hasRealEstate: true,
    realEstateCount: 4,
    requiresCustomQuote: true,
    urgent: true,
    suggestedPackage: null,
    selectedPackage: null,
    price: 1150,
    lineItems: [
      { label: "Preventivo su misura (caso complesso)", amount: 1150 },
    ],
    paymentStatus: "PENDING",
    paymentMethod: null,
    openedAt: null,
    dueDate: null,
    submittedAt: null,
    createdAt: "2026-06-12",
    stateTaxes: null,
    callNotes: "4 immobili + terreni agricoli + testamento. Preventivo su misura 1.150.",
    paymentNotes: "Link su misura inviato il 17/06.",
    notes: "Scadenza 12 mesi vicina (15/08): URGENTE.",
    checklist: [],
    communications: [
      {
        channel: "PHONE",
        direction: "INBOUND",
        source: "MANUAL",
        subject: "Il cliente ha chiamato per chiarimenti",
        occurredAt: "2026-06-17 15:30",
      },
      {
        channel: "EMAIL",
        direction: "OUTBOUND",
        source: "AUTO",
        subject: "Preventivo su misura + link di pagamento",
        occurredAt: "2026-06-17 16:00",
      },
    ],
    tasks: [{ title: "Ricontattare per sollecito (scadenza vicina)", dueDate: "2026-06-23", done: false }],
    log: [
      { action: "lead_creato", at: "2026-06-12 09:00" },
      { action: "preventivo_inviato", at: "2026-06-17 16:00" },
    ],
  },
];

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  marketingConsent: boolean;
  lastActivity: string;
};

export const contacts: Contact[] = [
  { id: "c1", firstName: "Maria", lastName: "Rossi", email: "maria.rossi@email.it", phone: "+39 333 1234567", source: "Form sito", marketingConsent: true, lastActivity: "2026-06-20" },
  { id: "c2", firstName: "Ahmed", lastName: "Benali", email: "a.benali@email.it", phone: "+39 340 9988776", source: "Google Ads", marketingConsent: false, lastActivity: "2026-06-18" },
  { id: "c3", firstName: "Lucia", lastName: "Ferri", email: "lucia.ferri@email.it", phone: "+39 348 1122334", source: "Passaparola", marketingConsent: true, lastActivity: "2026-06-19" },
  { id: "c4", firstName: "Giovanni", lastName: "Bruno", email: "g.bruno@email.it", phone: "+39 339 5566778", source: "Form sito", marketingConsent: true, lastActivity: "2026-06-20" },
  { id: "c5", firstName: "Sofia", lastName: "Greco", email: "sofia.greco@email.it", phone: "+39 347 2233445", source: "Referral", marketingConsent: false, lastActivity: "2026-06-17" },
  { id: "c6", firstName: "Roberto", lastName: "Conti", email: "r.conti@email.it", phone: "+39 333 9090909", source: "Form sito", marketingConsent: true, lastActivity: "2026-04-12" },
  { id: "c7", firstName: "Wei", lastName: "Chen", email: "wei.chen@email.it", phone: "+39 351 4455667", source: "Google Ads", marketingConsent: true, lastActivity: "2026-06-21" },
  { id: "c8", firstName: "Elisa", lastName: "Marchetti", email: "e.marchetti@email.it", phone: "+39 333 7766554", source: "Passaparola", marketingConsent: false, lastActivity: "2026-06-17" },
];

export type Alert = {
  kind: "scadenza" | "documenti" | "pagamento" | "ferma" | "consegna";
  text: string;
  practiceId: string;
};

export const alerts: Alert[] = [
  { kind: "scadenza", text: "SUC-2026-0005 - scadenza 12 mesi vicina (15/08)", practiceId: "p8" },
  { kind: "documenti", text: "SUC-2026-0010 - 1 documento caricato da validare", practiceId: "p3" },
  { kind: "pagamento", text: "SUC-2026-0011 - link di pagamento non ancora pagato", practiceId: "p2" },
  { kind: "consegna", text: "SUC-2026-0009 - consegna prevista il 03/07", practiceId: "p4" },
  { kind: "ferma", text: "SUC-2026-0005 - ferma da 5 giorni", practiceId: "p8" },
];

export type CalEventType = "apertura" | "consegna" | "scadenza" | "invio";

export type CalEvent = {
  dateStr: string; // YYYY-MM-DD
  type: CalEventType;
  label: string;
  practiceId: string;
  code: string;
};

export const calEventMeta: Record<
  CalEventType,
  { label: string; chip: string; dot: string }
> = {
  apertura: { label: "Apertura scheda", chip: "bg-crm-teal/15 text-crm-teal", dot: "bg-crm-teal" },
  consegna: { label: "Consegna prevista", chip: "bg-crm-accent/15 text-crm-accent", dot: "bg-crm-accent" },
  scadenza: { label: "Scadenza 12 mesi", chip: "bg-crm-rose/15 text-crm-rose", dot: "bg-crm-rose" },
  invio: { label: "Invio AdE", chip: "bg-crm-green/15 text-crm-green", dot: "bg-crm-green" },
};

function addOneYear(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y + 1}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function calendarEvents(): CalEvent[] {
  const events: CalEvent[] = [];
  for (const p of practices) {
    if (p.status === "ANNULLATA") continue;
    if (p.openedAt)
      events.push({ dateStr: p.openedAt, type: "apertura", label: "Apertura", practiceId: p.id, code: p.code });
    if (p.dueDate)
      events.push({ dateStr: p.dueDate, type: "consegna", label: "Consegna", practiceId: p.id, code: p.code });
    if (p.submittedAt)
      events.push({ dateStr: p.submittedAt, type: "invio", label: "Invio AdE", practiceId: p.id, code: p.code });
    if (p.dateOfDeath && p.status !== "CHIUSA")
      events.push({
        dateStr: addOneYear(p.dateOfDeath),
        type: "scadenza",
        label: "Scadenza 12 mesi",
        practiceId: p.id,
        code: p.code,
      });
  }
  return events;
}

export function getPractice(id: string): Practice | undefined {
  return practices.find((p) => p.id === id);
}

export function practicesByContact(contactId: string): Practice[] {
  return practices.filter((p) => p.contactId === contactId);
}

// KPI derivati dai dati finti
export const kpi = {
  activePractices: practices.filter(
    (p) => !["CHIUSA", "ANNULLATA"].includes(p.status),
  ).length,
  closedThisYear: practices.filter((p) => p.status === "CHIUSA").length,
  toDoNow: practices.filter((p) => p.actionOwner === "ADMIN").length,
  waitingClient: practices.filter((p) => p.actionOwner === "CLIENT").length,
  revenueYtd: practices
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + p.price, 0),
  avgTicket: Math.round(
    practices
      .filter((p) => p.paymentStatus === "PAID")
      .reduce((sum, p) => sum + p.price, 0) /
      Math.max(practices.filter((p) => p.paymentStatus === "PAID").length, 1),
  ),
  conversionRate: 62,
};
