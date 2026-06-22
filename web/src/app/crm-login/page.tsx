import { LoginForm } from "./login-form";

export const metadata = {
  title: "Accesso CRM",
  robots: { index: false },
};

export default async function CrmLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="theme-crm flex min-h-screen items-center justify-center bg-crm-bg px-4">
      <div className="w-full max-w-sm rounded-[16px] border border-crm-border bg-crm-surface p-7">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg crm-gradient text-sm font-bold text-white">
            A
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-crm-text">Flowdesk</p>
            <p className="text-[11px] text-crm-muted">Armellin - area gestione</p>
          </div>
        </div>

        <h1 className="mt-6 text-lg font-semibold text-crm-text">
          Accesso riservato
        </h1>
        <p className="mt-1 text-sm text-crm-muted">
          Inserisci la password per accedere al pannello di gestione.
        </p>

        <LoginForm next={next ?? "/crm"} />

        <p className="mt-4 text-[11px] leading-relaxed text-crm-muted">
          Accesso provvisorio con password. Verra sostituito
          dall&apos;autenticazione sicura a due fattori.
        </p>
      </div>
    </div>
  );
}
