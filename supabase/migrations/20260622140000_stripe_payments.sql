-- Pagamenti Stripe (Fase 4): aggancia il checkout reale alle pratiche.
-- - estende `practices` con i riferimenti Stripe e i metadati di pagamento;
-- - aggiunge lo stato PARTIALLY_REFUNDED (allineamento a @SPEC_Data_Model);
-- - crea `stripe_events` come registro di idempotenza dei webhook (@11).

-- payment_status: aggiunge PARTIALLY_REFUNDED (rimborsi parziali / conguagli downgrade)
alter type payment_status add value if not exists 'PARTIALLY_REFUNDED';

-- Riferimenti e metadati di pagamento sulla pratica
alter table public.practices
  add column if not exists stripe_session_id        text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at                  timestamptz,
  add column if not exists payment_recorded_by      text; -- SYSTEM (webhook) | ADMIN (offline)

-- Registro idempotenza dei webhook Stripe: ogni event id processato una sola volta.
-- La verifica firma avviene a monte; qui si previene la doppia elaborazione (@11).
create table if not exists public.stripe_events (
  id           text primary key,        -- Stripe event id (evt_...)
  type         text not null,           -- es. checkout.session.completed
  practice_id  uuid references public.practices(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- RLS: dato privato/di sistema. Nessuna policy => accesso solo via service_role.
alter table public.stripe_events enable row level security;
