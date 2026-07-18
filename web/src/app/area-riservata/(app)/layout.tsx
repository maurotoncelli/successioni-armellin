import Link from "next/link";
import { ArrowLeft, LifeBuoy, LogOut } from "lucide-react";
import { AreaSidebar, AreaBottomBar } from "@/components/area/nav";
import { buildAreaNavItems } from "@/components/area/nav-shared";
import { AreaDataProvider } from "@/components/area/area-context";
import { NotificationsBell } from "@/components/area/notifications-bell";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { requireClientView } from "@/lib/area";
import {
  countUnreadClientNotifications,
  listClientNotifications,
} from "@/lib/client-notifications";
import { countNewComms, getCommsSeenAt } from "@/lib/client-comms";
import { presentNotificationCopy } from "@/lib/comms-copy";
import { getRequestLocale, isRtl, t } from "@/lib/locale";
import { signOut } from "../actions";

export default async function AreaAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const view = await requireClientView();
  const { account, practice, user, contactId } = view;
  const locale = await getRequestLocale();
  const rtl = isRtl(locale);

  const [
    notifications,
    unreadCount,
    seenAt,
    brand,
    practiceLabel,
    backLabel,
    helpLabel,
    logoutLabel,
    navHome,
    navDocumenti,
    navOrdine,
    navComunicazioni,
    navDati,
    navMandato,
    navConclusa,
    navProfilo,
    notifTitle,
    notifEmpty,
    notifMarkAll,
    notifComms,
    notifCommsAll,
    notifCommsCount,
  ] = await Promise.all([
    contactId ? listClientNotifications(contactId, 20) : Promise.resolve([]),
    contactId ? countUnreadClientNotifications(contactId) : Promise.resolve(0),
    getCommsSeenAt(user.id),
    t("area", "chrome_brand", "Studio Armellin"),
    t("area", "chrome_practice", "Pratica {code}"),
    t("area", "chrome_back", "Torna al sito"),
    t("area", "chrome_help", "Assistenza"),
    t("area", "chrome_logout", "Esci"),
    t("area", "nav_home", "Home"),
    t("area", "nav_documenti", "Documenti"),
    t("area", "nav_ordine", "Acquisto"),
    t("area", "nav_comunicazioni", "Comunicazioni"),
    t("area", "nav_dati", "I tuoi dati"),
    t("area", "nav_mandato", "Mandato"),
    t("area", "nav_conclusa", "Documenti finali"),
    t("area", "nav_profilo", "Profilo"),
    t("area", "chrome_notifications", "Notifiche"),
    t("area", "chrome_notifications_empty", "Nessuna notifica"),
    t("area", "chrome_notifications_mark_all", "Segna tutte lette"),
    t("area", "chrome_comms_new", "Novità"),
    t("area", "chrome_comms_all", "Vedi tutte le comunicazioni"),
    t("area", "chrome_comms_new_count", "({n} nuove)"),
  ]);
  const commsNewCount = countNewComms(practice?.communications, seenAt);
  const presentedNotifications = notifications.map((n) => {
    const copy = presentNotificationCopy(
      n.title,
      n.body,
      account.commsLocale,
    );
    return { ...n, title: copy.title, body: copy.body };
  });

  const navItems = buildAreaNavItems({
    home: navHome,
    documenti: navDocumenti,
    ordine: navOrdine,
    comunicazioni: navComunicazioni,
    dati: navDati,
    mandato: navMandato,
    conclusa: navConclusa,
    profilo: navProfilo,
  });

  return (
    <AreaDataProvider account={account}>
      <div
        className="flex min-h-screen flex-col"
        dir={rtl ? "rtl" : "ltr"}
        lang={locale}
      >
        <header className="sticky top-0 z-30 border-b border-primary/10 bg-bg/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">
            <Link
              href="/area-riservata/dashboard"
              className="flex items-center gap-2"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white">
                A
              </span>
              <span className="hidden font-display text-sm font-semibold text-primary sm:block">
                {brand}
              </span>
            </Link>

            <div className="ms-2 hidden text-sm leading-tight sm:block">
              <p className="font-medium text-text">{account.name}</p>
              <p className="text-xs text-text-muted">
                {practiceLabel.replace("{code}", account.practiceCode)}
              </p>
            </div>

            <div className="ms-auto flex items-center gap-1">
              <LanguageSwitcher locale={locale} align="right" />
              <NotificationsBell
                initialItems={presentedNotifications}
                unreadCount={unreadCount}
                commsNewCount={commsNewCount}
                labels={{
                  title: notifTitle,
                  empty: notifEmpty,
                  markAll: notifMarkAll,
                  commsNew: notifComms,
                  commsAll: notifCommsAll,
                  commsNewCount: notifCommsCount,
                }}
                dateLocale={rtl ? "ar" : "it-IT"}
              />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted hover:text-text"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted hover:text-text"
              >
                <LifeBuoy className="h-4 w-4" />
                <span className="hidden sm:inline">{helpLabel}</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted hover:text-text"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{logoutLabel}</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1">
          <AreaSidebar items={navItems} />
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
            {children}
          </main>
        </div>

        <AreaBottomBar items={navItems} />
      </div>
    </AreaDataProvider>
  );
}
