/*
  Skeleton istantaneo all'apertura di una scheda pratica: senza, il click
  sulla card kanban / link sembra non rispondere finché Supabase non risponde.
*/
export default function Loading() {
  return (
    <div aria-busy="true" className="animate-pulse space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-4 w-24 rounded bg-crm-border" />
        <div className="h-6 w-40 rounded-lg bg-crm-border" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-40 rounded-[14px] bg-crm-surface lg:col-span-2" />
        <div className="h-40 rounded-[14px] bg-crm-surface" />
      </div>
      <div className="h-56 rounded-[14px] bg-crm-surface" />
      <div className="h-40 rounded-[14px] bg-crm-surface" />
    </div>
  );
}
