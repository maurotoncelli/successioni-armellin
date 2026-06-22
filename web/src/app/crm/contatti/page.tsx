import Link from "next/link";
import { Mail, Phone, Check, Minus } from "lucide-react";
import { contacts, practicesByContact, statusLabels } from "@/content/crm-data";
import { CrmCard } from "@/components/crm/ui";

export default function ContattiPage() {
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
          const history = practicesByContact(c.id);
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
                  {history.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/crm/pratiche/${p.id}`}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-crm-hover"
                      >
                        <span className="font-mono text-xs text-crm-accent">
                          {p.code}
                        </span>
                        <span className="text-xs text-crm-text2">
                          {statusLabels[p.status]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </CrmCard>
          );
        })}
      </div>
    </div>
  );
}
