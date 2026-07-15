-- Appunti "Migliorie sito" (@05): note libere di Lorenzo sulle modifiche da
-- fare al sito, da segnare al volo e lavorare in blocco. CRUD completo dal CRM.
-- Accesso SOLO server-side via service_role: RLS attiva senza policy
-- (anon e authenticated restano negati).

create table if not exists public.site_notes (
  id         uuid primary key default gen_random_uuid(),
  title      text not null default '',
  body       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_notes_updated_at_idx
  on public.site_notes (updated_at desc);

alter table public.site_notes enable row level security;
