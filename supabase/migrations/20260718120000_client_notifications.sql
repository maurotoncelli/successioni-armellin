-- Notifiche in-app lato cliente (@06): eventi azionabili con read_at.
-- Diverso dallo storico comunicazioni (jsonb practices.communications).
-- INSERT solo service_role; SELECT/UPDATE (read_at) per il contatto via RLS.

alter table public.profiles
  add column if not exists notify_email boolean not null default true,
  add column if not exists notify_whatsapp boolean not null default false,
  add column if not exists comms_seen_at timestamptz;

create table if not exists public.client_notifications (
  id            uuid primary key default gen_random_uuid(),
  practice_id   uuid references public.practices(id) on delete cascade,
  contact_id    uuid not null references public.contacts(id) on delete cascade,
  kind          text not null,
  title         text not null,
  body          text not null default '',
  href          text not null default '',
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists client_notifications_contact_created_idx
  on public.client_notifications (contact_id, created_at desc);

create index if not exists client_notifications_contact_unread_idx
  on public.client_notifications (contact_id)
  where read_at is null;

alter table public.client_notifications enable row level security;

drop policy if exists "client_notifications_select_own" on public.client_notifications;
create policy "client_notifications_select_own"
on public.client_notifications for select
to authenticated
using ( contact_id = public.current_contact_id() );

drop policy if exists "client_notifications_update_own" on public.client_notifications;
create policy "client_notifications_update_own"
on public.client_notifications for update
to authenticated
using ( contact_id = public.current_contact_id() )
with check ( contact_id = public.current_contact_id() );
