import { after } from "next/server";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { requireClientView } from "@/lib/area";
import {
  outboundClientComms,
  parseCommStamp,
  setCommsSeenAt,
} from "@/lib/client-comms";
import type { Communication } from "@/content/crm-data";

const channelMeta: Record<
  Communication["channel"],
  { label: string; icon: typeof Mail }
> = {
  EMAIL: { label: "Email", icon: Mail },
  WHATSAPP: { label: "WhatsApp", icon: MessageCircle },
  PHONE: { label: "Chiamata", icon: Phone },
  IN_PERSON: { label: "Di persona", icon: Phone },
};

function formatStamp(raw: string): string {
  const t = parseCommStamp(raw);
  if (!t) return raw;
  return new Date(t).toLocaleString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ComunicazioniPage() {
  const view = await requireClientView();
  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading
          title="Comunicazioni"
          subtitle="Messaggi sulla tua pratica."
        />
        <NoPracticeState defaultEmail={view.user.email ?? ""} />
      </div>
    );
  }

  const items = outboundClientComms(p.communications);
  // Dopo la response: evita revalidatePath in render e aggiorna il badge layout.
  const userId = view.user.id;
  after(() => {
    void setCommsSeenAt(userId);
  });

  return (
    <div>
      <PageHeading
        title="Comunicazioni"
        subtitle="Cosa ti abbiamo inviato o comunicato sulla pratica."
      />

      <Card>
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">
            Qui troverai le comunicazioni sulla tua pratica (email, WhatsApp,
            chiamate).
          </p>
        ) : (
          <ul className="divide-y divide-primary/10">
            {items.map((c, i) => {
              const meta = channelMeta[c.channel];
              const Icon = meta.icon;
              return (
                <li
                  key={`${c.occurredAt}-${i}`}
                  className="flex gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-text">{c.subject}</p>
                      <p className="text-xs text-text-muted">
                        {formatStamp(c.occurredAt)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-text-muted">{meta.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
