-- Centro notifiche del CRM (@05): eventi persistenti ed ELIMINABILI da Lorenzo.
-- A differenza degli "Alert automatici" (derivati dallo stato delle pratiche,
-- ricompaiono finche la condizione persiste), queste sono notifiche puntuali
-- scritte quando l'evento accade e cancellabili una volta lette.
-- Accesso SOLO server-side via service_role: RLS attiva senza policy
-- (anon e authenticated restano negati).

create table if not exists public.crm_notifications (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null,
  title         text not null,
  body          text not null default '',
  practice_id   uuid references public.practices(id) on delete cascade,
  practice_code text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists crm_notifications_created_at_idx
  on public.crm_notifications (created_at desc);

alter table public.crm_notifications enable row level security;
