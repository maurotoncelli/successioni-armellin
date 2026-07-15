import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  User,
  Check,
  Clock,
  CalendarDays,
  StickyNote,
} from "lucide-react";
import { type Communication } from "@/content/crm-data";
import { getPractice } from "@/lib/crm";
import { CrmCard, ActionBadge, StatusPill, SectionTitle } from "@/components/crm/ui";
import { PaymentLinkButton } from "@/components/crm/payment-link";
import {
  CrmChecklist,
  GenerateChecklistButton,
  type CrmDocItem,
} from "@/components/crm/checklist";
import {
  StatusChanger,
  AddCommunication,
  AddNote,
  CallNotesEditor,
} from "@/components/crm/practice-workflow";
import { PracticeExtrasCard } from "@/components/crm/practice-extras-card";
import { FinalDocsCard } from "@/components/crm/final-docs-card";
import { InvoiceCard } from "@/components/crm/invoice-card";
import { StateTaxesForm } from "@/components/crm/state-taxes-form";
import { DueDateForm } from "@/components/crm/due-date-form";
import { OfflinePayment } from "@/components/crm/offline-payment";
import { WithdrawalPanel } from "@/components/crm/withdrawal-panel";
import { PracticeTasks } from "@/components/crm/practice-tasks";
import { ExtractionPanel } from "@/components/crm/extraction-panel";
import { getSafeExtras } from "@/lib/practice-extras";
import { getExtraction, isAiConfigured } from "@/lib/extraction";
import { isInvoicingConfigured } from "@/lib/invoice";
import { listItemFiles } from "@/lib/documents";

const channelIcon = {
  EMAIL: Mail,
  WHATSAPP: MessageCircle,
  PHONE: Phone,
  IN_PERSON: User,
} as const;

export default async function SchedaPraticaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPractice(id);
  if (!p) notFound();

  const extras = await getSafeExtras(p.id);
  const extraction = await getExtraction(p.id);
  const docsWithFile = p.checklist.filter((c) => listItemFiles(c).length > 0).length;

  const approved = p.checklist.filter((c) => c.status === "APPROVATO").length;
  const requiredCount = p.checklist.filter((c) => c.required).length;
  const checklistItems: CrmDocItem[] = p.checklist.map((c, index) => ({
    index,
    label: c.label,
    required: c.required,
    status: c.status,
    files: listItemFiles(c).map((f) => f.name),
    reason: c.reason,
  }));

  return (
    <div className="space-y-6">
      <Link
        href="/crm/pratiche"
        className="inline-flex items-center gap-1.5 text-sm text-crm-text2 hover:text-crm-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Pratiche
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-lg font-semibold text-crm-text">
              {p.code}
            </h1>
            <StatusPill status={p.status} />
            <ActionBadge owner={p.actionOwner} />
          </div>
          <p className="mt-1 text-sm text-crm-text2">
            Defunto: {p.deceasedName} · CF {p.deceasedCf}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/brogliaccio/${p.id}`}
            target="_blank"
            className="rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text2 hover:text-crm-text"
          >
            Brogliaccio PDF
          </Link>
          <StatusChanger practiceId={p.id} status={p.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonna principale */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recesso (se richiesto) */}
          {extras.withdrawal && (
            <WithdrawalPanel
              practiceId={p.id}
              withdrawal={extras.withdrawal}
              paid={p.paymentStatus === "PAID"}
            />
          )}

          {/* Riepilogo pratica */}
          <CrmCard>
            <SectionTitle>Riepilogo pratica</SectionTitle>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Field label="Data decesso" value={p.dateOfDeath} />
              <Field label="Residenza" value={p.residence} />
              <Field label="Eredi (composizione)" value={p.relation} />
              <Field label="N. eredi" value={String(p.heirsCount)} />
              <Field label="Eredi minorenni" value={p.hasMinorHeirs ? "Si" : "No"} />
              <Field label="Testamento" value={p.hasWill ? "Si" : "No"} />
              <Field
                label="Immobili"
                value={
                  p.hasRealEstate ? `Si (${p.realEstateCount ?? "?"})` : "No"
                }
              />
              <Field
                label="Su misura"
                value={p.requiresCustomQuote ? "Si" : "No"}
              />
              <Field label="Urgente" value={p.urgent ? "Si" : "No"} />
            </dl>
          </CrmCard>

          {/* Riepilogo ordine */}
          <CrmCard>
            <SectionTitle>Riepilogo ordine</SectionTitle>
            <div className="mt-4 space-y-2 text-sm">
              {p.lineItems.length > 0 ? (
                p.lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-crm-text2">
                    <span>{item.label}</span>
                    <span className="text-crm-text">{item.amount} €</span>
                  </div>
                ))
              ) : (
                <p className="text-crm-muted">
                  Nessun pacchetto selezionato (lead da lavorare).
                </p>
              )}
              {p.price > 0 && (
                <div className="flex justify-between border-t border-crm-border pt-2 font-semibold text-crm-text">
                  <span>Totale onorario</span>
                  <span>{p.price} €</span>
                </div>
              )}
            </div>
            <p className="mt-3 rounded-lg bg-crm-bg2/60 p-3 text-xs text-crm-muted">
              Le imposte di Stato sono separate e a carico dell&apos;erede.
              {p.stateTaxes
                ? ` Comunicate al cliente: ${p.stateTaxes} €.`
                : " Da calcolare e comunicare prima dell'invio."}
            </p>
            <StateTaxesForm practiceId={p.id} current={p.stateTaxes} />
          </CrmCard>

          {/* Checklist documenti */}
          <CrmCard>
            <div className="flex items-center justify-between">
              <SectionTitle>Documenti</SectionTitle>
              {p.checklist.length > 0 && (
                <span className="text-xs text-crm-muted">
                  Approvati {approved} di {requiredCount} obbligatori
                </span>
              )}
            </div>
            {p.checklist.length > 0 ? (
              <CrmChecklist practiceId={p.id} items={checklistItems} />
            ) : (
              <div className="mt-4">
                <p className="text-sm text-crm-muted">
                  Checklist non ancora generata (si crea al pagamento). Se il
                  cliente è seguito in studio puoi generarla subito e caricare
                  tu i documenti.
                </p>
                <GenerateChecklistButton practiceId={p.id} />
              </div>
            )}
          </CrmCard>

          {/* Dati estratti (AI) */}
          <CrmCard>
            <ExtractionPanel
              practiceId={p.id}
              initial={extraction}
              aiConfigured={isAiConfigured}
              docsReady={docsWithFile}
            />
          </CrmCard>

          {/* Documenti finali (consegna) */}
          <FinalDocsCard practiceId={p.id} docs={extras.finalDocuments ?? []} />

          {/* Comunicazioni */}
          <CrmCard>
            <SectionTitle>Cronologia comunicazioni</SectionTitle>
            <ul className="mt-4 space-y-3">
              {p.communications.map((c, i) => (
                <CommunicationRow key={i} comm={c} />
              ))}
              {p.communications.length === 0 && (
                <li className="text-sm text-crm-muted">
                  Nessuna comunicazione registrata.
                </li>
              )}
            </ul>
            <AddCommunication practiceId={p.id} />
          </CrmCard>
        </div>

        {/* Colonna laterale */}
        <div className="space-y-6">
          {/* Contatto */}
          <CrmCard>
            <SectionTitle>Cliente</SectionTitle>
            <p className="mt-3 font-medium text-crm-text">{p.clientName}</p>
            <div className="mt-2 space-y-1.5 text-sm text-crm-text2">
              <a href={`mailto:${p.clientEmail}`} className="flex items-center gap-2 hover:text-crm-accent">
                <Mail className="h-4 w-4" />
                {p.clientEmail}
              </a>
              <a href={`tel:${p.clientPhone}`} className="flex items-center gap-2 hover:text-crm-accent">
                <Phone className="h-4 w-4" />
                {p.clientPhone}
              </a>
            </div>
          </CrmCard>

          {/* Pagamento */}
          <CrmCard>
            <SectionTitle>Pagamento</SectionTitle>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-crm-text2">Stato</span>
                <span className="text-crm-text">{p.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crm-text2">Metodo</span>
                <span className="text-crm-text">{p.paymentMethod ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crm-text2">Pacchetto</span>
                <span className="text-crm-text">{p.selectedPackage ?? "—"}</span>
              </div>
            </div>
            {p.paymentStatus !== "PAID" && (
              <>
                {(p.selectedPackage || p.suggestedPackage) && (
                  <PaymentLinkButton practiceId={p.id} />
                )}
                <OfflinePayment practiceId={p.id} suggestedAmount={p.price} />
              </>
            )}
          </CrmCard>

          {/* Fattura onorario */}
          <InvoiceCard
            practiceId={p.id}
            invoice={extras.invoice}
            invoicingConfigured={isInvoicingConfigured}
            paid={p.paymentStatus === "PAID"}
          />

          {/* Mandato & IBAN */}
          <PracticeExtrasCard practiceId={p.id} extras={extras} />

          {/* Date */}
          <CrmCard>
            <SectionTitle>Date chiave</SectionTitle>
            <ul className="mt-3 space-y-2 text-sm">
              <DateRow icon={<CalendarDays className="h-4 w-4" />} label="Creazione" value={p.createdAt} />
              <DateRow icon={<CalendarDays className="h-4 w-4" />} label="Apertura scheda" value={p.openedAt} />
              <DateRow icon={<Clock className="h-4 w-4" />} label="Consegna prevista" value={p.dueDate} />
              <DateRow icon={<Check className="h-4 w-4" />} label="Invio AdE" value={p.submittedAt} />
            </ul>
            <DueDateForm practiceId={p.id} current={p.dueDate} />
          </CrmCard>

          {/* Appunti */}
          <CrmCard>
            <SectionTitle>Appunti</SectionTitle>
            <div className="mt-3 space-y-3 text-sm">
              <CallNotesEditor practiceId={p.id} value={p.callNotes} />
              <Note label="Note pagamenti" value={p.paymentNotes} />
              <Note label="Note generali" value={p.notes} />
            </div>
            <div className="mt-4 border-t border-crm-border pt-4">
              <AddNote practiceId={p.id} />
            </div>
          </CrmCard>

          {/* To-Do */}
          <CrmCard>
            <SectionTitle>Cose da fare</SectionTitle>
            <PracticeTasks practiceId={p.id} tasks={p.tasks} />
          </CrmCard>

          {/* Timeline */}
          <CrmCard>
            <SectionTitle>Timeline eventi</SectionTitle>
            <ul className="mt-3 space-y-3">
              {p.log.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-crm-accent" />
                  <div>
                    <p className="text-crm-text">{e.action.replace(/_/g, " ")}</p>
                    <p className="text-xs text-crm-muted">{e.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CrmCard>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-crm-muted">{label}</dt>
      <dd className="text-crm-text">{value}</dd>
    </div>
  );
}

function DateRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-crm-text2">
        {icon}
        {label}
      </span>
      <span className="text-crm-text">{value ?? "—"}</span>
    </li>
  );
}

function Note({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-crm-border bg-crm-bg2/40 p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-crm-muted">
        <StickyNote className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-crm-text2">
        {value || <span className="text-crm-muted">—</span>}
      </p>
    </div>
  );
}

function CommunicationRow({ comm }: { comm: Communication }) {
  const Icon = channelIcon[comm.channel];
  return (
    <li className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-crm-bg2 text-crm-text2">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm text-crm-text">{comm.subject}</p>
          <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-crm-muted">
            {comm.source === "AUTO" ? "Auto" : "Manuale"}
          </span>
        </div>
        <p className="text-xs text-crm-muted">
          {comm.direction === "OUTBOUND" ? "In uscita" : "In entrata"} ·{" "}
          {comm.occurredAt}
        </p>
      </div>
    </li>
  );
}
