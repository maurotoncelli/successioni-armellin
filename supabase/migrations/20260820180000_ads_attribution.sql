-- Attribution campagne (gclid / UTM) su contatti e pratiche.
-- Serve a Google Ads e al CRM per sapere da dove arriva il cliente.

alter table public.contacts
  add column if not exists attribution jsonb not null default '{}'::jsonb;

alter table public.practices
  add column if not exists attribution jsonb not null default '{}'::jsonb;
