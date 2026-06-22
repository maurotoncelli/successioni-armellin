import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import {
  practices as fixturePractices,
  contacts as fixtureContacts,
  pipelineOrder,
  type Practice,
  type Contact,
  type Alert,
  type CalEvent,
  type ChecklistItem,
  type Communication,
  type TaskItem,
  type LogEvent,
  type LineItem,
} from "@/content/crm-data";
import type { ContactRow, PracticeRow } from "@/lib/supabase/types";

/*
  Layer di accesso ai dati operativi del CRM (contatti e pratiche).
  - Con Supabase configurato legge dal database via service_role (la RLS nega anon).
  - Senza configurazione (o in errore) ripiega sulle fixture, cosi il CRM resta
    navigabile anche prima dell'attivazione del database.
  KPI, alert e calendario sono DERIVATI dalle pratiche: un'unica fonte di verita.
*/

export type { Practice, Contact, Alert, CalEvent };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function mapContact(row: ContactRow): Contact {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    source: row.source ?? "",
    marketingConsent: row.marketing_consent,
    lastActivity: row.last_activity ?? "",
  };
}

export function mapPractice(row: PracticeRow): Practice {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    actionOwner: row.action_owner,
    contactId: row.contact_id ?? "",
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    relation: row.relation,
    deceasedName: row.deceased_name,
    deceasedCf: row.deceased_cf,
    dateOfDeath: row.date_of_death ?? "",
    residence: row.residence,
    hasWill: row.has_will,
    heirsCount: row.heirs_count,
    hasMinorHeirs: row.has_minor_heirs,
    hasRealEstate: row.has_real_estate,
    realEstateCount: row.real_estate_count,
    requiresCustomQuote: row.requires_custom_quote,
    urgent: row.urgent,
    suggestedPackage: row.suggested_package,
    selectedPackage: row.selected_package,
    price: Number(row.price),
    lineItems: asArray<LineItem>(row.line_items),
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method as Practice["paymentMethod"],
    openedAt: row.opened_at,
    dueDate: row.due_date,
    submittedAt: row.submitted_at,
    createdAt: (row.created_at ?? "").slice(0, 10),
    stateTaxes: row.state_taxes === null ? null : Number(row.state_taxes),
    callNotes: row.call_notes,
    paymentNotes: row.payment_notes,
    notes: row.notes,
    checklist: asArray<ChecklistItem>(row.checklist),
    communications: asArray<Communication>(row.communications),
    tasks: asArray<TaskItem>(row.tasks),
    log: asArray<LogEvent>(row.log),
  };
}

export async function getPractices(): Promise<Practice[]> {
  if (!isAdminConfigured) return fixturePractices;
  try {
    const { data, error } = await getAdminClient()
      .from("practices")
      .select("*")
      .order("code", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return fixturePractices;
    return data.map(mapPractice);
  } catch (err) {
    console.error("[crm] getPractices fallback su fixture:", err);
    return fixturePractices;
  }
}

export async function getPractice(id: string): Promise<Practice | undefined> {
  if (!isAdminConfigured) return fixturePractices.find((p) => p.id === id);
  try {
    const { data, error } = await getAdminClient()
      .from("practices")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapPractice(data) : undefined;
  } catch (err) {
    console.error("[crm] getPractice fallback su fixture:", err);
    return fixturePractices.find((p) => p.id === id);
  }
}

/*
  Ricerca globale del CRM: per codice pratica, CF/nome del defunto, nome/email/
  telefono del cliente. Con DB usa una OR ilike server-side; senza DB filtra le
  fixture in memoria. Soglia minima 2 caratteri per evitare risultati inutili.
*/
export async function searchPractices(query: string): Promise<Practice[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  if (!isAdminConfigured) {
    const needle = q.toLowerCase();
    return fixturePractices.filter((p) =>
      [p.code, p.clientName, p.clientEmail, p.clientPhone, p.deceasedName, p.deceasedCf]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(needle)),
    );
  }

  try {
    const like = `%${q.replace(/[%,()]/g, " ")}%`;
    const { data, error } = await getAdminClient()
      .from("practices")
      .select("*")
      .or(
        [
          `code.ilike.${like}`,
          `client_name.ilike.${like}`,
          `client_email.ilike.${like}`,
          `client_phone.ilike.${like}`,
          `deceased_name.ilike.${like}`,
          `deceased_cf.ilike.${like}`,
        ].join(","),
      )
      .order("code", { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []).map(mapPractice);
  } catch (err) {
    console.error("[crm] searchPractices:", err);
    return [];
  }
}

export async function getContacts(): Promise<Contact[]> {
  if (!isAdminConfigured) return fixtureContacts;
  try {
    const { data, error } = await getAdminClient()
      .from("contacts")
      .select("*")
      .order("last_activity", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return fixtureContacts;
    return data.map(mapContact);
  } catch (err) {
    console.error("[crm] getContacts fallback su fixture:", err);
    return fixtureContacts;
  }
}

/* --- Derivazioni (KPI, alert, calendario) calcolate dalle pratiche --- */

export function deriveKpi(practices: Practice[]) {
  const paid = practices.filter((p) => p.paymentStatus === "PAID");
  const revenueYtd = paid.reduce((sum, p) => sum + p.price, 0);
  return {
    activePractices: practices.filter(
      (p) => !["CHIUSA", "ANNULLATA"].includes(p.status),
    ).length,
    closedThisYear: practices.filter((p) => p.status === "CHIUSA").length,
    toDoNow: practices.filter((p) => p.actionOwner === "ADMIN").length,
    waitingClient: practices.filter((p) => p.actionOwner === "CLIENT").length,
    revenueYtd,
    avgTicket: Math.round(revenueYtd / Math.max(paid.length, 1)),
    conversionRate: 62,
  };
}

export function deriveAlerts(practices: Practice[]): Alert[] {
  const alerts: Alert[] = [];
  for (const p of practices) {
    if (["CHIUSA", "ANNULLATA"].includes(p.status)) continue;
    if (p.urgent) {
      alerts.push({
        kind: "scadenza",
        text: `${p.code} - pratica urgente, scadenza vicina`,
        practiceId: p.id,
      });
    }
    if (p.checklist.some((c) => c.status === "CARICATO")) {
      alerts.push({
        kind: "documenti",
        text: `${p.code} - documenti caricati da validare`,
        practiceId: p.id,
      });
    }
    if (p.paymentStatus === "PENDING") {
      alerts.push({
        kind: "pagamento",
        text: `${p.code} - link di pagamento non ancora pagato`,
        practiceId: p.id,
      });
    }
    if (p.dueDate && p.status === "LAVORAZIONE") {
      alerts.push({
        kind: "consegna",
        text: `${p.code} - consegna prevista il ${p.dueDate}`,
        practiceId: p.id,
      });
    }
  }
  return alerts;
}

function addOneYear(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y + 1}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function calendarEvents(practices: Practice[]): CalEvent[] {
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

// Giorni tra due date "YYYY-MM-DD" (b - a). Negativo = b nel passato rispetto ad a.
export function daysBetween(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00Z`);
  const db = Date.parse(`${b}T00:00:00Z`);
  if (Number.isNaN(da) || Number.isNaN(db)) return 0;
  return Math.round((db - da) / 86_400_000);
}

export type DeadlineItem = {
  practiceId: string;
  code: string;
  clientName: string;
  type: "scadenza" | "consegna";
  label: string;
  dateStr: string;
  daysLeft: number; // <0 = scaduta
};

/*
  Scadenze rilevanti (consegna prevista + scadenza 12 mesi) entro `withinDays`
  giorni, ordinate per data. Derivate dalle pratiche (no cron): servono al
  pannello Home e all'evidenza nel calendario. Le scadute restano in lista.
*/
export function upcomingDeadlines(
  practices: Practice[],
  today: string,
  withinDays = 30,
): DeadlineItem[] {
  const items: DeadlineItem[] = [];
  for (const p of practices) {
    if (["CHIUSA", "ANNULLATA"].includes(p.status)) continue;
    const candidates: {
      type: "scadenza" | "consegna";
      label: string;
      dateStr: string | null;
    }[] = [
      { type: "consegna", label: "Consegna prevista", dateStr: p.dueDate },
      {
        type: "scadenza",
        label: "Scadenza 12 mesi",
        dateStr: p.dateOfDeath ? addOneYear(p.dateOfDeath) : null,
      },
    ];
    for (const c of candidates) {
      if (!c.dateStr) continue;
      const daysLeft = daysBetween(today, c.dateStr);
      if (daysLeft <= withinDays) {
        items.push({
          practiceId: p.id,
          code: p.code,
          clientName: p.clientName,
          type: c.type,
          label: c.label,
          dateStr: c.dateStr,
          daysLeft,
        });
      }
    }
  }
  return items.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
}

export function practicesByContact(
  practices: Practice[],
  contactId: string,
): Practice[] {
  return practices.filter((p) => p.contactId === contactId);
}

export function statusCounts(practices: Practice[]) {
  return pipelineOrder.map((status) => ({
    status,
    count: practices.filter((p) => p.status === status).length,
  }));
}
