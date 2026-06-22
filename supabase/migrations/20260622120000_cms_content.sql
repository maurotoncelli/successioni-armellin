-- CMS content tables: packages, addons, faqs (@SPEC_Data_Model "Contenuti sito").
-- Prima fetta del CMS leggero gestito dal CRM e consumato dal sito pubblico.

-- Enum identita stabile dei pacchetti (non si rinomina: regge relazioni/snapshot).
create type package_type as enum ('SEMPLICE', 'COMPLETO', 'ZERO_STRESS');

-- Trigger generico updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- packages: unica fonte per pagina Tariffe e checkout
create table public.packages (
  key                package_type primary key,
  name               text not null,
  tagline            text,
  description        text not null,
  features           jsonb not null default '[]'::jsonb,
  price              numeric(10,2) not null,
  extra_property_fee numeric(10,2),
  sla_days           integer,
  badge              text,
  sort_order         integer not null default 0,
  is_active          boolean not null default true,
  updated_at         timestamptz not null default now()
);

create trigger packages_set_updated_at
before update on public.packages
for each row execute function public.set_updated_at();

-- addons: servizi aggiuntivi/upsell (opzioni del singolo ordine, non carrello)
create table public.addons (
  key         text primary key,
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

create trigger addons_set_updated_at
before update on public.addons
for each row execute function public.set_updated_at();

-- faqs: domande frequenti (schema FAQPage)
create table public.faqs (
  id           uuid primary key default gen_random_uuid(),
  locale       text not null default 'it',
  question     text not null,
  answer       text not null,
  category     text,
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  updated_at   timestamptz not null default now()
);

create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

-- RLS: lettura pubblica solo dei record attivi/pubblicati; scrittura solo service_role
-- (service_role bypassa la RLS, quindi non servono policy di scrittura).
alter table public.packages enable row level security;
alter table public.addons   enable row level security;
alter table public.faqs     enable row level security;

create policy "public_read_active_packages"
on public.packages for select
to anon, authenticated
using (is_active = true);

create policy "public_read_active_addons"
on public.addons for select
to anon, authenticated
using (is_active = true);

create policy "public_read_published_faqs"
on public.faqs for select
to anon, authenticated
using (is_published = true);
