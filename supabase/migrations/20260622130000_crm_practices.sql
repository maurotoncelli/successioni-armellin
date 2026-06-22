-- CRM core: contatti e pratiche (@SPEC_Data_Model "Contatti" e "Pratiche").
-- Seconda fetta del motore: i lead del sito diventano record reali nel CRM.
-- Le collezioni ricche (checklist, comunicazioni, task, log, righe ordine) sono
-- conservate come jsonb: pragmatico per ora, normalizzabile in fasi successive.

-- Enum stabili allineati a src/content/crm-data.ts
create type practice_status as enum (
  'LEAD',
  'PREVENTIVO_INVIATO',
  'PAGATO',
  'ATTESA_DOC',
  'LAVORAZIONE',
  'INVIATA',
  'CHIUSA',
  'ANNULLATA'
);

create type action_owner as enum ('ADMIN', 'CLIENT', 'EXTERNAL', 'NONE');

create type payment_status as enum ('NONE', 'PENDING', 'PAID', 'REFUNDED');

-- contacts: rubrica clienti (una persona puo avere piu pratiche)
create table public.contacts (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  last_name         text not null,
  email             text,
  phone             text,
  source            text,
  marketing_consent boolean not null default false,
  last_activity     date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

-- Sequenza per i codici pratica leggibili (SUC-AAAA-NNNN)
create sequence if not exists public.practice_code_seq start with 13;

-- practices: la scheda pratica completa
create table public.practices (
  id                   uuid primary key default gen_random_uuid(),
  code                 text not null unique
                         default ('SUC-' || to_char(now(), 'YYYY') || '-' ||
                                  lpad(nextval('public.practice_code_seq')::text, 4, '0')),
  status               practice_status not null default 'LEAD',
  action_owner         action_owner not null default 'ADMIN',
  -- contatto / cliente (snapshot denormalizzato + fk)
  contact_id           uuid references public.contacts(id) on delete set null,
  client_name          text not null default '',
  client_email         text not null default '',
  client_phone         text not null default '',
  relation             text not null default '',
  -- defunto
  deceased_name        text not null default '',
  deceased_cf          text not null default '',
  date_of_death        date,
  residence            text not null default '',
  -- pratica
  has_will             boolean not null default false,
  heirs_count          integer not null default 0,
  has_minor_heirs      boolean not null default false,
  has_real_estate      boolean not null default false,
  real_estate_count    integer,
  requires_custom_quote boolean not null default false,
  urgent               boolean not null default false,
  -- commerciale
  suggested_package    package_type,
  selected_package     package_type,
  price                numeric(10,2) not null default 0,
  line_items           jsonb not null default '[]'::jsonb,
  payment_status       payment_status not null default 'NONE',
  payment_method       text,
  -- date
  opened_at            date,
  due_date             date,
  submitted_at         date,
  -- imposte
  state_taxes          numeric(10,2),
  -- appunti
  call_notes           text not null default '',
  payment_notes        text not null default '',
  notes                text not null default '',
  -- collezioni (jsonb, stesse forme dei tipi TS)
  checklist            jsonb not null default '[]'::jsonb,
  communications       jsonb not null default '[]'::jsonb,
  tasks                jsonb not null default '[]'::jsonb,
  log                  jsonb not null default '[]'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index practices_status_idx on public.practices (status);
create index practices_contact_idx on public.practices (contact_id);

create trigger practices_set_updated_at
before update on public.practices
for each row execute function public.set_updated_at();

-- RLS: dati privati. Nessuna policy per anon/authenticated => accesso negato.
-- Il CRM legge/scrive solo con service_role (che bypassa la RLS).
alter table public.contacts  enable row level security;
alter table public.practices enable row level security;
