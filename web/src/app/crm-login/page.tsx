import { AdminLogin } from "./admin-login";

export const metadata = {
  title: "Accesso CRM",
  robots: { index: false },
};

const NOTICES: Record<string, string> = {
  forbidden: "Questo account non e autorizzato ad accedere al CRM.",
  "2fa": "Completa la verifica in due passaggi per accedere.",
};

export default async function CrmLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const notice = error ? NOTICES[error] : undefined;

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
          Accedi con email, password e codice di verifica (2FA).
        </p>

        {notice && (
          <p className="mt-3 rounded-lg border border-crm-rose/30 bg-crm-rose/10 px-3 py-2 text-xs text-crm-rose">
            {notice}
          </p>
        )}

        <AdminLogin />
      </div>
    </div>
  );
}
