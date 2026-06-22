-- Autenticazione reale (Supabase Auth) - prima fetta: identita CLIENTE + RLS per-cliente.
-- @SPEC_Data_Model (profiles), @11 (RLS), @06 (area riservata).
-- NB: il gate admin del CRM resta quello provvisorio (ADMIN_PASSWORD): l'auth admin
-- con 2FA e una fetta successiva. Qui aggiungiamo SOLO policy additive (anon resta negato).

-- Ruolo applicativo
do $$ begin
  create type role as enum ('ADMIN', 'CLIENT');
exception when duplicate_object then null; end $$;

-- profiles: estende auth.users con ruolo e collegamento all'anagrafica (contacts)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  contact_id  uuid references public.contacts(id) on delete set null,
  role        role not null default 'CLIENT',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- L'utente puo leggere SOLO il proprio profilo. La scrittura/provisioning avviene
-- via service_role (server), quindi niente policy di insert/update per gli utenti.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ( id = auth.uid() );

-- Helper SECURITY DEFINER: restituisce il contact_id del profilo loggato senza
-- innescare la RLS di profiles nelle policy (evita ricorsione).
create or replace function public.current_contact_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select contact_id from public.profiles where id = auth.uid()
$$;

-- Un CLIENTE puo leggere SOLO le pratiche collegate alla propria anagrafica.
drop policy if exists "client_select_own_practices" on public.practices;
create policy "client_select_own_practices"
on public.practices for select
to authenticated
using ( contact_id is not null and contact_id = public.current_contact_id() );

-- Un CLIENTE puo leggere SOLO la propria scheda anagrafica.
drop policy if exists "client_select_own_contact" on public.contacts;
create policy "client_select_own_contact"
on public.contacts for select
to authenticated
using ( id = public.current_contact_id() );
