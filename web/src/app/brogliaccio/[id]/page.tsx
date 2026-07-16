import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { getPractice } from "@/lib/crm";
import { getSafeExtras } from "@/lib/practice-extras";
import { statusLabels, type PackageType } from "@/content/crm-data";
import { PrintButton } from "@/components/crm/print-button";

export const dynamic = "force-dynamic";

const packageLabel: Record<Exclude<PackageType, null>, string> = {
  SEMPLICE: "Semplice",
  COMPLETO: "Con Immobili",
  ZERO_STRESS: "Estesa",
};

/*
  Brogliaccio PDF (@05): documento tecnico riassuntivo della pratica, pensato per
  la stampa / "salva come PDF" del browser. Sta fuori dal layout CRM (niente
  sidebar/topbar) per una stampa pulita; protetto comunque da requireAdmin.
*/
export default async function BrogliaccioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const p = await getPractice(id);
  if (!p) notFound();
  const extras = await getSafeExtras(p.id);

  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* Barra strumenti: non viene stampata */}
      <div className="sticky top-0 flex items-center justify-between border-b border-neutral-300 bg-white px-4 py-3 print:hidden">
        <Link
          href={`/crm/pratiche/${p.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alla scheda
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto my-6 max-w-[820px] bg-white p-10 shadow-sm print:my-0 print:shadow-none">
        {/* Intestazione */}
        <header className="flex items-start justify-between border-b-2 border-neutral-900 pb-4">
          <div>
            <p className="text-lg font-bold">Studio Geom. Lorenzo Armellin</p>
            <p className="text-sm text-neutral-600">
              Dichiarazioni di successione · Pontedera (PI)
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Brogliaccio pratica
            </p>
            <p className="font-mono text-lg font-bold">{p.code}</p>
            <p className="text-xs text-neutral-500">Generato il {today}</p>
          </div>
        </header>

        {/* Stato */}
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <Info label="Stato" value={statusLabels[p.status]} />
          <Info
            label="Pacchetto"
            value={p.selectedPackage ? packageLabel[p.selectedPackage] : "—"}
          />
          <Info label="Urgente" value={p.urgent ? "Sì" : "No"} />
          <Info
            label="Preventivo su misura"
            value={p.requiresCustomQuote ? "Sì" : "No"}
          />
        </div>

        <Section title="Defunto">
          <Grid>
            <Field label="Nome e cognome" value={p.deceasedName} />
            <Field label="Codice fiscale" value={p.deceasedCf} mono />
            <Field label="Data del decesso" value={p.dateOfDeath} />
            <Field label="Residenza" value={p.residence} />
          </Grid>
        </Section>

        <Section title="Cliente / erede dichiarante">
          <Grid>
            <Field label="Nome e cognome" value={p.clientName} />
            <Field label="Relazione col defunto" value={p.relation} />
            <Field label="Email" value={p.clientEmail} />
            <Field label="Telefono" value={p.clientPhone} />
          </Grid>
        </Section>

        <Section title="Successione">
          <Grid>
            <Field label="N. eredi" value={String(p.heirsCount)} />
            <Field label="Eredi minorenni" value={p.hasMinorHeirs ? "Sì" : "No"} />
            <Field label="Testamento" value={p.hasWill ? "Sì" : "No"} />
            <Field
              label="Immobili"
              value={
                p.hasRealEstate
                  ? `Sì${p.realEstateCount ? ` · ${p.realEstateCount}` : ""}`
                  : "No"
              }
            />
          </Grid>
        </Section>

        {(extras.mandate || extras.iban) && (
          <Section title="Mandato e IBAN">
            <Grid>
              <Field
                label="Mandato"
                value={
                  extras.mandate?.signedAt
                    ? `Firmato il ${extras.mandate.signedAt}`
                    : extras.mandate
                      ? "In attesa"
                      : "—"
                }
              />
              <Field
                label="IBAN"
                value={
                  extras.iban?.last4
                    ? `•••• ${extras.iban.last4}`
                    : extras.ibanClearedAt
                      ? `Cancellato il ${extras.ibanClearedAt}`
                      : "—"
                }
              />
            </Grid>
          </Section>
        )}

        <Section title="Date chiave">
          <Grid>
            <Field label="Creazione" value={p.createdAt} />
            <Field label="Apertura scheda" value={p.openedAt} />
            <Field label="Consegna prevista" value={p.dueDate} />
            <Field label="Invio AdE" value={p.submittedAt} />
          </Grid>
        </Section>

        <Section title={`Documenti (${p.checklist.length})`}>
          {p.checklist.length === 0 ? (
            <p className="text-sm text-neutral-500">Nessun documento in checklist.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-300 text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="py-1.5 pr-2 font-medium">Documento</th>
                  <th className="py-1.5 pr-2 font-medium">Obbl.</th>
                  <th className="py-1.5 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody>
                {p.checklist.map((c, i) => (
                  <tr key={i} className="border-b border-neutral-200">
                    <td className="py-1.5 pr-2">{c.label}</td>
                    <td className="py-1.5 pr-2">{c.required ? "Sì" : "No"}</td>
                    <td className="py-1.5">{checklistStatusLabel(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="Imposte di Stato">
          <p className="text-sm">
            {p.stateTaxes != null
              ? `${p.stateTaxes.toLocaleString("it-IT")} € (comunicate)`
              : "Non ancora comunicate"}
          </p>
        </Section>

        {(p.callNotes || p.notes || p.paymentNotes) && (
          <Section title="Appunti">
            <NoteBlock label="Appunti chiamata" value={p.callNotes} />
            <NoteBlock label="Note pagamenti" value={p.paymentNotes} />
            <NoteBlock label="Note generali" value={p.notes} />
          </Section>
        )}

        <footer className="mt-8 border-t border-neutral-300 pt-3 text-[11px] text-neutral-400">
          Documento interno di lavorazione · {p.code} · Studio Geom. Lorenzo
          Armellin. Dati riservati (GDPR).
        </footer>
      </div>
    </div>
  );
}

function checklistStatusLabel(status: string): string {
  const map: Record<string, string> = {
    MANCANTE: "Mancante",
    CARICATO: "Caricato (da validare)",
    APPROVATO: "Approvato",
    RIFIUTATO: "Da rifare",
    NON_APPLICABILE: "Non applicabile",
  };
  return map[status] ?? status;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-neutral-500">{label}: </span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-8 gap-y-2">{children}</div>;
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="text-sm">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className={mono ? "font-mono" : ""}>{value || "—"}</p>
    </div>
  );
}

function NoteBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="mb-2 text-sm">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="whitespace-pre-wrap">{value}</p>
    </div>
  );
}
