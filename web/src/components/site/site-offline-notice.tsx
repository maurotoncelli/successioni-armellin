import { Mail, MessageCircle, Phone, Plane, Wrench } from "lucide-react";
import { text } from "@/lib/content";
import { buttonClasses } from "@/components/ui/button";
import type { SiteOfflineState } from "@/lib/site-offline-shared";

export function SiteOfflineNotice({ state }: { state: SiteOfflineState }) {
  const phone = text("settings", "phone", "320 1570567");
  const email = text("settings", "email", "studio@successioniarmellin.it");
  const whatsapp = text(
    "settings",
    "whatsapp",
    "https://wa.me/393201570567",
  );
  const phoneHref = `tel:+39${phone.replace(/\D/g, "")}`;
  const Icon = state.preset === "maintenance" ? Wrench : Plane;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-3xl text-primary sm:text-4xl">
        {state.title}
      </h1>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
        {state.body}
      </p>

      {state.showContactButtons && (
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href={`mailto:${email}`}
            className={buttonClasses({
              variant: "primary",
              className: "w-full sm:w-auto",
            })}
          >
            <Mail className="h-4 w-4" />
            Scrivici via email
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({
              variant: "outline",
              className: "w-full sm:w-auto",
            })}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={phoneHref}
            className={buttonClasses({
              variant: "ghost",
              className: "w-full sm:w-auto",
            })}
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
        </div>
      )}

      <p className="mt-10 text-sm text-text-muted">
        Hai già una pratica?{" "}
        <a
          href="/area-riservata"
          className="font-medium text-accent underline-offset-2 hover:underline"
        >
          Accedi all&apos;area personale
        </a>
      </p>
    </div>
  );
}
