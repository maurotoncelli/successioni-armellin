-- Preferenza lingua comunicazioni scritte (email + notifiche in-app).
-- Separata dalla lingua UI (cookie lang). Default italiano.

alter table public.profiles
  add column if not exists comms_locale text not null default 'it';

comment on column public.profiles.comms_locale is
  'Lingua preferita per email e notifiche scritte (it|ar). UI usa cookie lang.';
