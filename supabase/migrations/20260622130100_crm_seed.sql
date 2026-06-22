-- Seed CRM demo: 8 contatti + 8 pratiche (gli stessi del prototipo Fase 2).
-- Idempotente (ON CONFLICT DO NOTHING). Serve a far vedere a Lorenzo il CRM
-- gia popolato; i nuovi lead reali arrivano dal form del sito.

insert into public.contacts (id, first_name, last_name, email, phone, source, marketing_consent, last_activity) values
  ('11111111-1111-1111-1111-000000000001', $t$Maria$t$,    $t$Rossi$t$,     $t$maria.rossi@email.it$t$, $t$+39 333 1234567$t$, $t$Form sito$t$,   true,  '2026-06-20'),
  ('11111111-1111-1111-1111-000000000002', $t$Ahmed$t$,    $t$Benali$t$,    $t$a.benali@email.it$t$,    $t$+39 340 9988776$t$, $t$Google Ads$t$,  false, '2026-06-18'),
  ('11111111-1111-1111-1111-000000000003', $t$Lucia$t$,    $t$Ferri$t$,     $t$lucia.ferri@email.it$t$, $t$+39 348 1122334$t$, $t$Passaparola$t$, true,  '2026-06-19'),
  ('11111111-1111-1111-1111-000000000004', $t$Giovanni$t$, $t$Bruno$t$,     $t$g.bruno@email.it$t$,     $t$+39 339 5566778$t$, $t$Form sito$t$,   true,  '2026-06-20'),
  ('11111111-1111-1111-1111-000000000005', $t$Sofia$t$,    $t$Greco$t$,     $t$sofia.greco@email.it$t$, $t$+39 347 2233445$t$, $t$Referral$t$,    false, '2026-06-17'),
  ('11111111-1111-1111-1111-000000000006', $t$Roberto$t$,  $t$Conti$t$,     $t$r.conti@email.it$t$,     $t$+39 333 9090909$t$, $t$Form sito$t$,   true,  '2026-04-12'),
  ('11111111-1111-1111-1111-000000000007', $t$Wei$t$,      $t$Chen$t$,      $t$wei.chen@email.it$t$,    $t$+39 351 4455667$t$, $t$Google Ads$t$,  true,  '2026-06-21'),
  ('11111111-1111-1111-1111-000000000008', $t$Elisa$t$,    $t$Marchetti$t$, $t$e.marchetti@email.it$t$, $t$+39 333 7766554$t$, $t$Passaparola$t$, false, '2026-06-17')
on conflict (id) do nothing;

insert into public.practices (
  id, code, status, action_owner, contact_id,
  client_name, client_email, client_phone, relation,
  deceased_name, deceased_cf, date_of_death, residence,
  has_will, heirs_count, has_minor_heirs, has_real_estate, real_estate_count,
  requires_custom_quote, urgent, suggested_package, selected_package,
  price, line_items, payment_status, payment_method,
  opened_at, due_date, submitted_at, state_taxes,
  call_notes, payment_notes, notes,
  checklist, communications, tasks, log, created_at
) values
(
  '22222222-2222-2222-2222-000000000001', 'SUC-2026-0012', 'LEAD', 'ADMIN', '11111111-1111-1111-1111-000000000001',
  $t$Maria Rossi$t$, $t$maria.rossi@email.it$t$, $t$+39 333 1234567$t$, $t$Figlia$t$,
  $t$Giuseppe Rossi$t$, $t$RSSGPP40A01G702X$t$, '2026-03-14', $t$Pontedera (PI)$t$,
  false, 3, false, true, 2,
  false, false, 'COMPLETO', null,
  0, $j$[]$j$::jsonb, 'NONE', null,
  null, null, null, null,
  $t$$t$, $t$$t$, $t$Lead dal form. Da richiamare per consulenza.$t$,
  $j$[]$j$::jsonb,
  $j$[{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Abbiamo ricevuto la tua richiesta","occurredAt":"2026-06-20 09:12"}]$j$::jsonb,
  $j$[{"title":"Chiamare Maria per consulenza","dueDate":"2026-06-23","done":false}]$j$::jsonb,
  $j$[{"action":"lead_creato","at":"2026-06-20 09:12"}]$j$::jsonb,
  '2026-06-20'
),
(
  '22222222-2222-2222-2222-000000000002', 'SUC-2026-0011', 'PREVENTIVO_INVIATO', 'CLIENT', '11111111-1111-1111-1111-000000000002',
  $t$Ahmed Benali$t$, $t$a.benali@email.it$t$, $t$+39 340 9988776$t$, $t$Figlio$t$,
  $t$Fatima Benali$t$, $t$BNLFTM55E41Z330K$t$, '2026-02-02', $t$Cascina (PI)$t$,
  false, 4, true, true, 1,
  false, false, 'COMPLETO', 'COMPLETO',
  490, $j$[{"label":"Successione Completa","amount":490}]$j$::jsonb, 'PENDING', null,
  null, null, null, null,
  $t$Eredi minorenni: serve autorizzazione GT. Spiegato al cliente.$t$, $t$Link di pagamento inviato il 18/06.$t$, $t$$t$,
  $j$[]$j$::jsonb,
  $j$[{"channel":"PHONE","direction":"OUTBOUND","source":"MANUAL","subject":"Consulenza telefonica (15 min)","occurredAt":"2026-06-18 11:00"},{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Il tuo preventivo + link di pagamento","occurredAt":"2026-06-18 11:20"}]$j$::jsonb,
  $j$[]$j$::jsonb,
  $j$[{"action":"lead_creato","at":"2026-06-15 16:02"},{"action":"preventivo_inviato","at":"2026-06-18 11:20"}]$j$::jsonb,
  '2026-06-15'
),
(
  '22222222-2222-2222-2222-000000000003', 'SUC-2026-0010', 'ATTESA_DOC', 'CLIENT', '11111111-1111-1111-1111-000000000003',
  $t$Lucia Ferri$t$, $t$lucia.ferri@email.it$t$, $t$+39 348 1122334$t$, $t$Coniuge$t$,
  $t$Marco Ferri$t$, $t$FRRMRC58H12G843T$t$, '2026-01-20', $t$Pisa$t$,
  false, 2, false, true, 3,
  false, false, 'COMPLETO', 'COMPLETO',
  490, $j$[{"label":"Successione Completa","amount":490}]$j$::jsonb, 'PAID', 'STRIPE',
  '2026-06-10', null, null, null,
  $t$$t$, $t$Pagato online il 10/06.$t$, $t$Mancano ancora 2 visure.$t$,
  $j$[{"label":"Carta d'identita di Lucia Ferri","required":true,"status":"APPROVATO","help":"Fronte e retro, ben leggibili."},{"label":"Certificato di morte","required":true,"status":"APPROVATO"},{"label":"Visura catastale - immobile 1","required":true,"status":"CARICATO","help":"La trovi tra i documenti del catasto o te la procuriamo noi."},{"label":"Visura catastale - immobile 2","required":true,"status":"ATTESO","help":"La trovi tra i documenti del catasto o te la procuriamo noi."},{"label":"Atto di provenienza","required":true,"status":"RIFIUTATO","reason":"Il file caricato e illeggibile: ricarica una scansione piu nitida o una foto a fuoco.","help":"E' il rogito/atto con cui il defunto aveva acquisito l'immobile."},{"label":"IBAN dell'erede","required":false,"status":"ATTESO","help":"Serve solo per l'eventuale addebito delle imposte (F24)."}]$j$::jsonb,
  $j$[{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Pagamento confermato + invito caricamento documenti","occurredAt":"2026-06-10 14:32"},{"channel":"WHATSAPP","direction":"OUTBOUND","source":"AUTO","subject":"Promemoria: mancano 2 documenti","occurredAt":"2026-06-19 09:00"}]$j$::jsonb,
  $j$[{"title":"Sollecitare visure mancanti","dueDate":"2026-06-24","done":false}]$j$::jsonb,
  $j$[{"action":"preventivo_inviato","at":"2026-06-08 10:00"},{"action":"pagamento_ricevuto","at":"2026-06-10 14:32"},{"action":"documento_approvato","at":"2026-06-12 08:40"}]$j$::jsonb,
  '2026-06-05'
),
(
  '22222222-2222-2222-2222-000000000004', 'SUC-2026-0009', 'LAVORAZIONE', 'ADMIN', '11111111-1111-1111-1111-000000000004',
  $t$Giovanni Bruno$t$, $t$g.bruno@email.it$t$, $t$+39 339 5566778$t$, $t$Figlio$t$,
  $t$Anna Bruno$t$, $t$BRNNNA42D55G702Y$t$, '2025-12-10', $t$Pontedera (PI)$t$,
  true, 2, false, true, 1,
  false, true, 'COMPLETO', 'ZERO_STRESS',
  790, $j$[{"label":"Zero Stress","amount":790}]$j$::jsonb, 'PAID', 'STRIPE',
  '2026-05-28', '2026-07-03', null, 1240,
  $t$Testamento pubblicato. Cliente molto ansioso, tenere aggiornato.$t$, $t$$t$, $t$Tutti i documenti approvati il 20/06. In lavorazione.$t$,
  $j$[{"label":"Carta d'identita di Giovanni Bruno","required":true,"status":"APPROVATO"},{"label":"Certificato di morte","required":true,"status":"APPROVATO"},{"label":"Testamento pubblicato","required":true,"status":"APPROVATO"},{"label":"Visura catastale","required":true,"status":"APPROVATO"},{"label":"Atto di provenienza","required":true,"status":"APPROVATO"}]$j$::jsonb,
  $j$[{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Documenti completi: iniziamo la lavorazione","occurredAt":"2026-06-20 16:00"}]$j$::jsonb,
  $j$[{"title":"Compilare quadri su Sogei","dueDate":"2026-06-30","done":false},{"title":"Comunicare imposte al cliente","dueDate":"2026-06-26","done":false}]$j$::jsonb,
  $j$[{"action":"pagamento_ricevuto","at":"2026-05-28 10:00"},{"action":"documenti_approvati","at":"2026-06-20 15:50"},{"action":"imposte_comunicate","at":"2026-06-21 09:00"}]$j$::jsonb,
  '2026-05-20'
),
(
  '22222222-2222-2222-2222-000000000005', 'SUC-2026-0008', 'INVIATA', 'EXTERNAL', '11111111-1111-1111-1111-000000000005',
  $t$Sofia Greco$t$, $t$sofia.greco@email.it$t$, $t$+39 347 2233445$t$, $t$Figlia$t$,
  $t$Paolo Greco$t$, $t$GRCPLA39A01H501Z$t$, '2025-11-05', $t$Livorno$t$,
  false, 1, false, false, null,
  false, false, 'SEMPLICE', 'SEMPLICE',
  290, $j$[{"label":"Successione Semplice","amount":290}]$j$::jsonb, 'PAID', 'STRIPE',
  '2026-05-12', '2026-06-18', '2026-06-17', 320,
  $t$$t$, $t$$t$, $t$Inviata all'AdE il 17/06, in attesa ricevute.$t$,
  $j$[{"label":"Carta d'identita di Sofia Greco","required":true,"status":"APPROVATO"},{"label":"Certificato di morte","required":true,"status":"APPROVATO"},{"label":"Certificazione saldo conti","required":true,"status":"APPROVATO"}]$j$::jsonb,
  $j$[{"channel":"EMAIL","direction":"OUTBOUND","source":"MANUAL","subject":"Dichiarazione inviata all'Agenzia","occurredAt":"2026-06-17 12:00"}]$j$::jsonb,
  $j$[]$j$::jsonb,
  $j$[{"action":"documenti_approvati","at":"2026-06-01 10:00"},{"action":"dichiarazione_presentata","at":"2026-06-17 12:00"}]$j$::jsonb,
  '2026-05-05'
),
(
  '22222222-2222-2222-2222-000000000006', 'SUC-2026-0007', 'CHIUSA', 'NONE', '11111111-1111-1111-1111-000000000006',
  $t$Roberto Conti$t$, $t$r.conti@email.it$t$, $t$+39 333 9090909$t$, $t$Coniuge$t$,
  $t$Elena Conti$t$, $t$CNTLNE60M41G702W$t$, '2025-09-01', $t$Pontedera (PI)$t$,
  false, 2, false, true, 1,
  false, false, 'COMPLETO', 'COMPLETO',
  490, $j$[{"label":"Successione Completa","amount":490}]$j$::jsonb, 'PAID', 'STRIPE',
  '2026-03-10', '2026-04-15', '2026-04-10', 980,
  $t$$t$, $t$$t$, $t$Pratica conclusa, documenti finali consegnati.$t$,
  $j$[{"label":"Documenti","required":true,"status":"APPROVATO"}]$j$::jsonb,
  $j$[{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Pratica conclusa: documenti disponibili","occurredAt":"2026-04-12 10:00"}]$j$::jsonb,
  $j$[]$j$::jsonb,
  $j$[{"action":"dichiarazione_presentata","at":"2026-04-10 11:00"},{"action":"pratica_chiusa","at":"2026-04-12 10:00"}]$j$::jsonb,
  '2026-03-01'
),
(
  '22222222-2222-2222-2222-000000000007', 'SUC-2026-0006', 'PAGATO', 'ADMIN', '11111111-1111-1111-1111-000000000007',
  $t$Wei Chen$t$, $t$wei.chen@email.it$t$, $t$+39 351 4455667$t$, $t$Figlio$t$,
  $t$Li Chen$t$, $t$CHNLIA52T70Z210B$t$, '2026-04-01', $t$Empoli (FI)$t$,
  false, 2, false, true, 1,
  false, false, 'COMPLETO', 'COMPLETO',
  490, $j$[{"label":"Successione Completa","amount":490}]$j$::jsonb, 'PAID', 'STRIPE',
  '2026-06-21', null, null, null,
  $t$Cliente straniero: comunicare per iscritto i punti chiave.$t$, $t$Pagato online il 21/06.$t$, $t$Da generare la checklist documenti.$t$,
  $j$[]$j$::jsonb,
  $j$[{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Pagamento confermato","occurredAt":"2026-06-21 18:05"}]$j$::jsonb,
  $j$[{"title":"Generare e inviare checklist documenti","dueDate":"2026-06-23","done":false}]$j$::jsonb,
  $j$[{"action":"preventivo_inviato","at":"2026-06-19 10:00"},{"action":"pagamento_ricevuto","at":"2026-06-21 18:05"}]$j$::jsonb,
  '2026-06-16'
),
(
  '22222222-2222-2222-2222-000000000008', 'SUC-2026-0005', 'PREVENTIVO_INVIATO', 'CLIENT', '11111111-1111-1111-1111-000000000008',
  $t$Elisa Marchetti$t$, $t$e.marchetti@email.it$t$, $t$+39 333 7766554$t$, $t$Altro (nipote)$t$,
  $t$Carla Marchetti$t$, $t$MRCCRL35P61G702Q$t$, '2025-08-15', $t$Pontedera (PI)$t$,
  true, 5, false, true, 4,
  true, true, null, null,
  1150, $j$[{"label":"Preventivo su misura (caso complesso)","amount":1150}]$j$::jsonb, 'PENDING', null,
  null, null, null, null,
  $t$4 immobili + terreni agricoli + testamento. Preventivo su misura 1.150.$t$, $t$Link su misura inviato il 17/06.$t$, $t$Scadenza 12 mesi vicina (15/08): URGENTE.$t$,
  $j$[]$j$::jsonb,
  $j$[{"channel":"PHONE","direction":"INBOUND","source":"MANUAL","subject":"Il cliente ha chiamato per chiarimenti","occurredAt":"2026-06-17 15:30"},{"channel":"EMAIL","direction":"OUTBOUND","source":"AUTO","subject":"Preventivo su misura + link di pagamento","occurredAt":"2026-06-17 16:00"}]$j$::jsonb,
  $j$[{"title":"Ricontattare per sollecito (scadenza vicina)","dueDate":"2026-06-23","done":false}]$j$::jsonb,
  $j$[{"action":"lead_creato","at":"2026-06-12 09:00"},{"action":"preventivo_inviato","at":"2026-06-17 16:00"}]$j$::jsonb,
  '2026-06-12'
)
on conflict (id) do nothing;
