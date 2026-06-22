import type { Metadata } from "next";
import { Sidebar } from "@/components/crm/sidebar";
import { Topbar } from "@/components/crm/topbar";

export const metadata: Metadata = {
  title: "CRM Flowdesk - Armellin",
  robots: { index: false },
};

export default function CrmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="theme-crm flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
