-- Revisione copy Lorenzo (ago 2026): SLA Semplice 7 / Con immobili 10.
-- Il calendario CRM deriva `due_date` da packages.sla_days (slaDueDate).

update public.packages
set sla_days = 7, updated_at = now()
where key = 'SEMPLICE';

update public.packages
set
  sla_days = 10,
  description = replace(
    replace(description, ' da geometra', ''),
    'dati catastali',
    'dati catastali e atti di provenienza'
  ),
  features = (
    select jsonb_agg(
      to_jsonb(
        replace(
          replace(elem, ' da geometra', ''),
          'dati catastali',
          'dati catastali e atti di provenienza'
        )
      )
    )
    from jsonb_array_elements_text(features) as elem
  ),
  updated_at = now()
where key = 'COMPLETO'
  and description not like '%dati catastali e atti di provenienza%';

-- Se la description era gia stata aggiornata a mano, allinea comunque lo SLA.
update public.packages
set sla_days = 10, updated_at = now()
where key = 'COMPLETO' and sla_days is distinct from 10;
