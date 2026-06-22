import { AlertTriangle, Database } from "lucide-react";
import { getPackagesAdmin, getAddonsAdmin } from "@/lib/cms";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { ListinoEditor } from "@/components/crm/listino-editor";

export const dynamic = "force-dynamic";

export default async function ListinoPage() {
  const [packages, addons] = await Promise.all([
    getPackagesAdmin(),
    getAddonsAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-crm-text">
          Listino e contenuti
        </h1>
        <p className="mt-1 text-sm text-crm-muted">
          Modifica prezzi, testi e disponibilita di pacchetti e add-on. Premendo
          &quot;Salva e pubblica&quot; le pagine del sito si aggiornano subito.
        </p>
      </div>

      {!isAdminConfigured ? (
        <div className="flex items-start gap-3 rounded-[14px] border border-crm-amber/30 bg-crm-amber/10 p-4 text-sm text-crm-text2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-crm-amber" />
          <div>
            <p className="font-medium text-crm-text">
              Database non ancora collegato
            </p>
            <p className="mt-1">
              Stai vedendo i contenuti di esempio. Per rendere le modifiche
              reali, collega Supabase compilando{" "}
              <code className="rounded bg-black/30 px-1 py-0.5 text-xs">
                web/.env.local
              </code>{" "}
              con le chiavi del progetto. Fino ad allora i salvataggi sono
              disabilitati.
            </p>
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full bg-crm-green/15 px-3 py-1 text-xs font-medium text-crm-green">
          <Database className="h-3.5 w-3.5" />
          Database collegato
        </div>
      )}

      <ListinoEditor packages={packages} addons={addons} />
    </div>
  );
}
