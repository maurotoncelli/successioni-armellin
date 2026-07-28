import Link from "next/link";
import { Mail, Phone, Check, Minus, UserCheck } from "lucide-react";
import { statusLabels } from "@/content/crm-data";
import {
  getContacts,
  getPractices,
  getRegisteredContactIds,
  practicesByContact,
} from "@/lib/crm";
import { CrmCard } from "@/components/crm/ui";

export const dynamic = "force-dynamic";

// Stato pagamento compatto per lo storico del contatto.
const paymentBadge: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Pagata", cls: "bg-crm-green/15 text-crm-green" },
  PENDING: { label: "Da pagare", cls: "bg-amber-500/15 text-amber-400" },
  PARTIALLY_REFUNDED: { label: "Rimb. parziale", cls: "bg-white/5 text-crm-muted" },
  REFUNDED: { label: "Rimborsata", cls: "bg-white/5 text-crm-muted" },
};

export default async function ContattiPage() {
  const [contacts, practices, registeredIds] = await Promise.all([
    getContacts(),
    getPractices(),
    getRegisteredContactIds(),
  ]);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-crm-text">Contatti</h1>
        <p className="text-sm text-crm-text2">
          {contacts.length} contatti · rubrica con storico pratiche
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((c) => {
          const history = practicesByContact(practices, c.id);
          return (
            <CrmCard key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full crm-gradient text-sm font-semibold text-white">
                    {c.firstName[0]}
                    {c.lastName[0]}
                  </span>
                  <div>
                    <p className="font-medium text-crm-text">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-crm-muted">{c.source}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {registeredIds.has(c.id) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-crm-accent/15 px-2 py-0.5 text-[11px] text-crm-accent">
                      <UserCheck className="h-3 w-3" />
                      Account
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                      c.marketingConsent
                        ? "bg-crm-green/15 text-crm-green"
                        : "bg-white/5 text-crm-muted"
                    }`}
                  >
                    {c.marketingConsent ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    Marketing
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-crm-text2">
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-crm-accent">
                  <Mail className="h-4 w-4" />
                  {c.email}
                </a>
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 hover:text-crm-accent">
                  <Phone className="h-4 w-4" />
                  {c.phone}
                </a>
              </div>

              <div className="mt-4 border-t border-crm-border pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-crm-muted">
                  Storico pratiche ({history.length})
                </p>
                <ul className="mt-2 space-y-1.5">
                  {history.length === 0 && (
                    <li className="px-2 py-1.5 text-xs text-crm-muted">
                      Nessuna pratica: solo account registrato.
                    </li>
                  )}
                  {history.map((p) => {
                    const pay = paymentBadge[p.paymentStatus];
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/crm/pratiche/${p.id}`}
                          className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-crm-hover"
                        >
                          <span className="flex min-w-0 items-baseline gap-2">
                            <span className="font-mono text-xs text-crm-accent">
                              {p.code}
                            </span>
                            <span className="truncate text-xs text-crm-text2">
                              {statusLabels[p.status]}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            {p.price > 0 && (
                              <span className="text-xs font-medium text-crm-text">
                                {p.price} €
                              </span>
                            )}
                            {pay && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] ${pay.cls}`}
                              >
                                {pay.label}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CrmCard>
          );
        })}
      </div>
    </div>
  );
}
