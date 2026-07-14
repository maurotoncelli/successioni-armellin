/*
  Skeleton mostrato ISTANTANEAMENTE durante la navigazione tra le pagine
  dell'area personale (tutte server-rendered con query a Supabase): senza,
  il click sembra "non rispondere" finche il server non ha finito.
*/
export default function Loading() {
  return (
    <div aria-busy="true" className="animate-pulse space-y-5">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-bg-muted" />
        <div className="h-4 w-72 max-w-full rounded bg-bg-muted" />
      </div>
      <div className="h-36 rounded-2xl bg-bg-muted" />
      <div className="h-36 rounded-2xl bg-bg-muted" />
      <div className="h-24 rounded-2xl bg-bg-muted" />
    </div>
  );
}
