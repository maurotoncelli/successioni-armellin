import { AlertTriangle, Database, Tag } from "lucide-react";
import { getPackagesAdmin, getAddonsAdmin, getFaqsAdmin } from "@/lib/cms";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { isAiConfigured } from "@/lib/extraction";
import { getPackagesI18nStateFresh } from "@/lib/packages-i18n";
import { flatOfferHonorUntil, getFlatOffer } from "@/lib/flat-offer";
import { ListinoEditor } from "@/components/crm/listino-editor";
import { RefreshTranslationsButton } from "@/components/crm/refresh-translations-button";

export const dynamic = "force-dynamic";

function formatDay(day: string): string {
  return new Date(`${day}T12:00:00+02:00`).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Rome",
  });
}

export default async function ListinoPage() {
  const flat = getFlatOffer();
  const [packages, addons, faqs, i18n] = await Promise.all([
    getPackagesAdmin(),
    getAddonsAdmin(),
    getFaqsAdmin(),
    getPackagesI18nStateFresh(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-crm-text">
          Listino e contenuti
        </h1>
        <p className="mt-1 text-sm text-crm-muted">
          Modifica prezzi, testi e disponibilita di pacchetti, add-on e FAQ. Premendo
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

      {flat && (
        <div className="flex items-start gap-3 rounded-[14px] border border-crm-accent/30 bg-crm-accent/10 p-4 text-sm text-crm-text2">
          <Tag className="mt-0.5 h-5 w-5 shrink-0 text-crm-accent" />
          <div>
            <p className="font-medium text-crm-text">
              Test prezzo unico attivo: il sito incassa {flat.price} € tutto incluso
            </p>
            <p className="mt-1">
              Dal {formatDay(flat.startsAt)} (fine prevista {formatDay(flat.endsAt)}): home,
              tariffe, preventivo, checkout e link di pagamento applicano {flat.price} € a ogni
              pratica, senza supplementi per immobili o eredi. Restano su misura solo aziende,
              quote societarie, azioni e barche. I prezzi dei pacchetti qui sotto non si vedono sul
              sito ma restano validi: tornano in vigore quando il test viene chiuso. Le FAQ su
              prezzo e imposte mostrano sul sito il testo del test (le trovi nel file del test,
              non qui). Chi ha avuto il prezzo unico lo conserva fino al{" "}
              {flatOfferHonorUntil(flat).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                timeZone: "Europe/Rome",
              })}
              .
            </p>
          </div>
        </div>
      )}

      <RefreshTranslationsButton
        lastUpdatedAt={i18n.updatedAt}
        aiConfigured={isAiConfigured}
      />

      <ListinoEditor packages={packages} addons={addons} faqs={faqs} />
    </div>
  );
}
