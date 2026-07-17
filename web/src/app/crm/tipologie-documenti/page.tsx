import { AlertTriangle, Database, FolderCheck } from "lucide-react";
import { isAdminConfigured } from "@/lib/supabase/admin";
import {
  getDocumentTypesState,
  resolveDocumentCatalog,
} from "@/lib/document-types";
import { DocumentTypesEditor } from "@/components/crm/document-types-editor";

export const dynamic = "force-dynamic";

export default async function TipologieDocumentiPage() {
  const state = await getDocumentTypesState();
  const catalog = resolveDocumentCatalog(state);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FolderCheck className="h-5 w-5 text-crm-accent" />
          <h1 className="text-xl font-semibold text-crm-text">
            Tipologie di documenti
          </h1>
        </div>
        <p className="mt-1 text-sm text-crm-muted">
          Elenco di tutto ciò che può finire in checklist. Disattiva{" "}
          <strong className="font-medium text-crm-text2">In checklist auto</strong>{" "}
          se una voce non deve generarsi; gestisci i{" "}
          <strong className="font-medium text-crm-text2">modelli PDF</strong>{" "}
          (autocertificazioni ecc.) che il cliente scarica dall&apos;area
          personale. Puoi anche aggiungere tipologie custom.
        </p>
      </div>

      {!isAdminConfigured ? (
        <div className="flex items-start gap-3 rounded-[14px] border border-crm-amber/30 bg-crm-amber/10 p-4 text-sm text-crm-text2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-crm-amber" />
          <div>
            <p className="font-medium text-crm-text">Database non collegato</p>
            <p className="mt-1">
              Serve Supabase per salvare le tue spunte e i tipi custom.
            </p>
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full bg-crm-green/15 px-3 py-1 text-xs font-medium text-crm-green">
          <Database className="h-3.5 w-3.5" />
          Pronto al salvataggio
        </div>
      )}

      <DocumentTypesEditor initial={catalog} />
    </div>
  );
}
