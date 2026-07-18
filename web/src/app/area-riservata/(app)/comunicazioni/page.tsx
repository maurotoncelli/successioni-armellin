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
import { getRequestLocale, t, tObj } from "@/lib/locale";
import { CLAIM_UI_IT, type ClaimUiLabels } from "@/lib/area-ui-labels";
import { presentCommSubject } from "@/lib/comms-copy";

function formatStamp(raw: string, locale: string): string {
  const stamp = parseCommStamp(raw);
  if (!stamp) return raw;
  const tag = locale === "ar" ? "ar" : "it-IT";
  return new Date(stamp).toLocaleString(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ComunicazioniPage() {
  const view = await requireClientView();
  const locale = await getRequestLocale();
  const [
    title,
    subtitle,
    emptyMsg,
    channelEmail,
    channelPhone,
    channelWa,
    channelInPerson,
    emptyTitle,
    emptyBody,
    claimUi,
  ] = await Promise.all([
    t("area", "comunicazioni_title", "Comunicazioni"),
    t(
      "area",
      "comunicazioni_subtitle",
      "Messaggi e aggiornamenti sulla tua pratica.",
    ),
    t("area", "comunicazioni_empty", "Nessuna comunicazione per ora."),
    t("area", "comunicazioni_channel_email", "Email"),
    t("area", "comunicazioni_channel_phone", "Chiamata"),
    t("area", "comunicazioni_channel_wa", "WhatsApp"),
    t("area", "comunicazioni_channel_inperson", "Di persona"),
    t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
    t(
      "area",
      "empty_body",
      "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
    ),
    tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
  ]);

  const channelMeta: Record<
    Communication["channel"],
    { label: string; icon: typeof Mail }
  > = {
    EMAIL: { label: channelEmail, icon: Mail },
    WHATSAPP: { label: channelWa, icon: MessageCircle },
    PHONE: { label: channelPhone, icon: Phone },
    IN_PERSON: { label: channelInPerson, icon: Phone },
  };

  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading title={title} subtitle={subtitle} />
        <NoPracticeState
          defaultEmail={view.user.email ?? ""}
          title={emptyTitle}
          body={emptyBody}
          claimLabels={claimUi}
        />
      </div>
    );
  }

  const items = outboundClientComms(p.communications);
  const commsLocale = view.account.commsLocale;
  // Dopo la response: evita revalidatePath in render e aggiorna il badge layout.
  const userId = view.user.id;
  after(() => {
    void setCommsSeenAt(userId);
  });

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />

      <Card>
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">{emptyMsg}</p>
        ) : (
          <ul className="divide-y divide-primary/10">
            {items.map((c, i) => {
              const meta = channelMeta[c.channel];
              const Icon = meta.icon;
              const subject = presentCommSubject(c.subject, commsLocale);
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
                      <p className="text-sm font-medium text-text">{subject}</p>
                      <p className="text-xs text-text-muted">
                        {formatStamp(c.occurredAt, locale)}
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
