import Link from "next/link";
import { ArrowLeft, LifeBuoy, LogOut } from "lucide-react";
import { AreaSidebar, AreaBottomBar } from "@/components/area/nav";
import { AreaDataProvider } from "@/components/area/area-context";
import { NotificationsBell } from "@/components/area/notifications-bell";
import { requireClientView } from "@/lib/area";
import {
  countUnreadClientNotifications,
  listClientNotifications,
} from "@/lib/client-notifications";
import { countNewComms, getCommsSeenAt } from "@/lib/client-comms";
import { signOut } from "../actions";

export default async function AreaAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const view = await requireClientView();
  const { account, practice, user, contactId } = view;

  const [notifications, unreadCount, seenAt] = await Promise.all([
    contactId ? listClientNotifications(contactId, 20) : Promise.resolve([]),
    contactId ? countUnreadClientNotifications(contactId) : Promise.resolve(0),
    getCommsSeenAt(user.id),
  ]);
  const commsNewCount = countNewComms(practice?.communications, seenAt);

  return (
    <AreaDataProvider account={account}>
      <div className="flex min-h-screen flex-col">
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
                Studio Armellin
              </span>
            </Link>

            <div className="ml-2 hidden text-sm leading-tight sm:block">
              <p className="font-medium text-text">{account.name}</p>
              <p className="text-xs text-text-muted">
                Pratica {account.practiceCode}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <NotificationsBell
                initialItems={notifications}
                unreadCount={unreadCount}
                commsNewCount={commsNewCount}
              />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted hover:text-text"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Torna al sito</span>
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted hover:text-text"
              >
                <LifeBuoy className="h-4 w-4" />
                <span className="hidden sm:inline">Assistenza</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted hover:text-text"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Esci</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1">
          <AreaSidebar />
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
            {children}
          </main>
        </div>

        <AreaBottomBar />
      </div>
    </AreaDataProvider>
  );
}
