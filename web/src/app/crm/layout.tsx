import type { Metadata } from "next";
import { Sidebar } from "@/components/crm/sidebar";
import { Topbar } from "@/components/crm/topbar";
import { requireAdmin } from "@/lib/admin";
import {
  countCrmNotifications,
  CRM_NOTIF_BADGE_EXCLUDE,
} from "@/lib/crm-notifications";

export const metadata: Metadata = {
  title: "CRM Flowdesk - Armellin",
  robots: { index: false },
};

export default async function CrmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Gate del CRM: emergenza / aperto (transizione) / auth reale ADMIN + 2FA.
  await requireAdmin();

  // Badge: esclude i questionari (rumore); restano nella lista con filtro Tutte.
  const notificationCount = await countCrmNotifications({
    excludeKinds: CRM_NOTIF_BADGE_EXCLUDE,
  });

  return (
    <div className="theme-crm flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar notificationCount={notificationCount} />
        {/* overflow-x-clip (non hidden): stesso clipping ma NON crea uno scroll
            container, cosi la barra sticky del kanban resta agganciata al
            fondo della finestra. */}
        <main className="flex-1 overflow-x-clip p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
