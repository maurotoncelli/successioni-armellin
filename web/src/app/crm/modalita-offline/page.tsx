import { AlertTriangle, Database } from "lucide-react";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { getSiteOfflineStateFresh } from "@/lib/site-offline";
import { OfflineModeEditor } from "@/components/crm/offline-mode-editor";

export const dynamic = "force-dynamic";

export default async function ModalitaOfflinePage() {
  const state = await getSiteOfflineStateFresh();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-crm-text">Modalità offline</h1>
        <p className="mt-1 text-sm text-crm-muted">
          Metti in pausa il sito pubblico per vacanze o manutenzioni, con un
          messaggio personalizzato e i pulsanti per contattarti. Non blocca area
          personale né CRM.
        </p>
      </div>

      {!isAdminConfigured ? (
        <div className="flex items-start gap-3 rounded-[14px] border border-crm-amber/30 bg-crm-amber/10 p-4 text-sm text-crm-text2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-crm-amber" />
          <div>
            <p className="font-medium text-crm-text">Database non collegato</p>
            <p className="mt-1">
              Serve Supabase per salvare lo stato della modalità offline.
            </p>
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full bg-crm-green/15 px-3 py-1 text-xs font-medium text-crm-green">
          <Database className="h-3.5 w-3.5" />
          Pronto al salvataggio
        </div>
      )}

      <OfflineModeEditor initial={state} />
    </div>
  );
}
