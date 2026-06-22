-- Seed iniziale CMS con i contenuti confermati (Riunione 2).
-- Idempotente: ON CONFLICT DO NOTHING, cosi le modifiche fatte da Lorenzo non vengono sovrascritte.

insert into public.packages (key, name, tagline, description, features, price, extra_property_fee, sla_days, badge, sort_order, is_active) values
(
  'SEMPLICE',
  'Successione Semplice',
  'Per i casi lineari, senza immobili',
  'La dichiarazione di successione predisposta e inviata all''Agenzia delle Entrate, quando non ci sono immobili da gestire.',
  '["Predisposizione della dichiarazione","Invio telematico all''Agenzia delle Entrate","Calcolo delle imposte comunicato prima dell''invio","Assistenza di una persona reale"]'::jsonb,
  290, null, 10, null, 1, true
),
(
  'COMPLETO',
  'Successione Completa',
  'Con immobili e voltura catastale',
  'Tutto incluso quando ci sono immobili: controllo dei dati catastali, dichiarazione e voltura catastale. Copre fino a 5 eredi, da 1 a 3 immobili e fino a 5 conti bancari.',
  '["Tutto quello del pacchetto Semplice","Fino a 5 eredi, 1-3 immobili, fino a 5 conti","Controllo dei dati catastali da geometra","Voltura catastale inclusa"]'::jsonb,
  490, 60, 15, 'Il piu scelto', 2, true
),
(
  'ZERO_STRESS',
  'Zero Stress',
  'Ce ne occupiamo noi, dall''inizio alla fine',
  'La massima tranquillita per i casi piu corposi: da 3 a 8 immobili, fino a 5 conti e 5 eredi. Recuperiamo noi i documenti mancanti e ti aggiorniamo a ogni step.',
  '["Tutto quello del pacchetto Completo","Da 3 a 8 immobili, fino a 5 conti e 5 eredi","Recupero documenti presso enti e banche","Priorita di lavorazione"]'::jsonb,
  790, 60, 10, null, 3, true
)
on conflict (key) do nothing;

insert into public.addons (key, name, description, price, sort_order, is_active) values
('RIUNIONE_USUFRUTTO', 'Riunione di usufrutto', 'Aggiornamento catastale a seguito dell''estinzione dell''usufrutto.', 150, 1, true),
('ADEGUAMENTO_IMU', 'Adeguamento e ricalcolo IMU', 'Ricalcolo dell''IMU dopo la successione e aggiornamento per i nuovi intestatari.', 90, 2, true),
('VOLTURA_EXTRA', 'Voltura aggiuntiva', 'Voltura per immobili oltre quelli inclusi nel pacchetto.', 60, 3, true)
on conflict (key) do nothing;

insert into public.faqs (locale, question, answer, category, sort_order, is_published) values
('it', 'Cos''e la dichiarazione di successione?', 'E l''adempimento fiscale con cui si comunica all''Agenzia delle Entrate il patrimonio del defunto trasferito agli eredi. Va presentata di norma entro 12 mesi dal decesso.', 'Capire la successione', 1, true),
('it', 'Entro quando va presentata?', 'Generalmente entro 12 mesi dalla data del decesso. Presentarla in ritardo puo comportare sanzioni: ce ne occupiamo noi nei tempi corretti.', 'Capire la successione', 2, true),
('it', 'Quanto costa il vostro servizio?', 'Paghi un onorario fisso in base al pacchetto. Le imposte di Stato sono separate, a carico dell''erede, e te le calcoliamo e comunichiamo prima dell''invio, senza ricarichi.', 'Costi e imposte', 3, true),
('it', 'Le imposte sono comprese nel prezzo?', 'No: il prezzo del pacchetto e l''onorario professionale. Le imposte di Stato (successione, ipotecaria, catastale, bolli) si versano con F24 e sono separate. Te le calcoliamo noi prima.', 'Costi e imposte', 4, true),
('it', 'Posso farla gratis da solo sul sito dell''Agenzia?', 'Si, esiste la successione precompilata gratuita ed e un''opzione onesta. Richiede pero SPID e competenza: non valida i dati catastali e gli eventuali errori (e le sanzioni) restano a tuo carico.', 'Perche non da soli', 5, true),
('it', 'Devo andare in qualche ufficio?', 'No. Questionario, documenti, comunicazioni e invio all''Agenzia avvengono online. C''e sempre una chiamata con Lorenzo per spiegarti tutto.', 'Come funziona', 6, true),
('it', 'Quali documenti servono?', 'Dipende dal tuo caso: ti diamo una lista personalizzata. Se ti manca qualcosa, spesso lo recuperiamo noi (visure, atti di provenienza).', 'Come funziona', 7, true),
('it', 'Cosa ricevo a fine pratica?', 'Ricevuta di presentazione/registrazione, copia della dichiarazione, esito F24 e, dove prevista, esito della voltura catastale, oltre alla nostra fattura.', 'Dopo il servizio', 8, true);
