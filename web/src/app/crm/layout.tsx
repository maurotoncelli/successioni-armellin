import type { Metadata } from "next";
import { Sidebar } from "@/components/crm/sidebar";
import { Topbar } from "@/components/crm/topbar";
import { requireAdmin } from "@/lib/admin";
import { countCrmNotifications } from "@/lib/crm-notifications";

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

  const notificationCount = await countCrmNotifications();

  return (
    <div className="theme-crm flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar notificationCount={notificationCount} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
