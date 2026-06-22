import Link from "next/link";
import { Search } from "lucide-react";
import { searchPractices } from "@/lib/crm";
import { StatusPill, ActionBadge } from "@/components/crm/ui";

export const dynamic = "force-dynamic";

export default async function CercaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = await searchPractices(query);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-crm-muted" />
        <h1 className="text-xl font-semibold text-crm-text">
          Risultati per “{query}”
        </h1>
      </div>

      {query.length < 2 ? (
        <p className="text-sm text-crm-muted">
          Digita almeno 2 caratteri (codice pratica, CF/nome defunto, nome/email
          cliente).
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-crm-muted">
          Nessuna pratica trovata per “{query}”.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-crm-border bg-crm-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-crm-border text-left text-xs uppercase tracking-wide text-crm-muted">
                <th className="px-4 py-3 font-medium">Pratica</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Defunto</th>
                <th className="px-4 py-3 font-medium">Stato</th>
                <th className="px-4 py-3 font-medium">Azione</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-crm-border last:border-0 hover:bg-crm-hover/40"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/crm/pratiche/${p.id}`}
                      className="font-mono text-xs text-crm-accent hover:underline"
                    >
                      {p.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-crm-text">
                    {p.clientName}
                    <span className="block text-xs text-crm-muted">
                      {p.clientEmail}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-crm-text2">
                    {p.deceasedName}
                    <span className="block font-mono text-xs text-crm-muted">
                      {p.deceasedCf}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ActionBadge owner={p.actionOwner} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
