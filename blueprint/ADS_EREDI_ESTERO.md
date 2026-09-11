# Google Ads — Campagna «Italiani all'estero» (piano operativo, 11/09/2026)

Obiettivo: intercettare chi vive fuori dall'Italia e deve fare una successione in Italia
(casa dei genitori, terreno, conto). È il pubblico per cui «tutto online, senza rientrare»
non è un vantaggio ma una necessità; concorrenza Search debole; l'unico cliente pagante
finora era un italiano in Germania. Budget: quello liberato dalla Locale Toscana sospesa.

Contenuti già online a supporto (categoria Guide «Eredi stranieri / dall'estero», 11 lingue):
- `/guide/eredi-estero` — pilastro, in evidenza (landing della campagna)
- `/guide/codice-fiscale-erede-estero`
- `/guide/successione-defunto-residente-estero`
- `/guide/documenti-esteri-successione-apostille`
- `/guide/pagare-imposte-successione-dall-estero`

---

## 1. Struttura account (UI Google Ads, account 469-614-3939)

| Campagna | Budget | Paesi (Presenza) | Lingua | Offerte | Rete |
|---|---|---|---|---|---|
| `Search \| Estero IT \| Soft launch` | **7 €/gg** | Fase 1: Germania, Svizzera, Regno Unito, Francia, Belgio, Spagna, Paesi Bassi, Lussemburgo | Italiano | Massimizza i clic, **cap CPC 2,50 €** | Solo Search |
| `Search \| Estero EN \| Fase 2` | 5 €/gg (dopo 3 settimane di dati) | Regno Unito, Stati Uniti, Canada, Australia | Inglese | Massimizza i clic, cap 3 € | Solo Search |

Fase 1 solo Paesi europei: SEPA per bonifici/imposte, documenti senza apostille (Reg. UE
2016/1191), fuso orario compatibile, CPC più bassi. Fase 2 aggiunge Argentina, USA, Canada,
Australia alla campagna IT (Argentina: ricerche in italiano rare, valutare gruppo in spagnolo).
Brasile: servirebbe il portoghese sul sito (non presente), rinviare.

**Impostazioni da rispettare** (stesse lezioni della Nazionale, vedi HANDOFF):
- Località: opzione **«Presenza»** (persone che si trovano nei Paesi), NON «presenza o interesse»,
  altrimenti entrano italiani in Italia che cercano «estero».
- Reti: togliere Display e Partner di ricerca.
- **AI Max off, asset automatici off, DSA off** (campo Website vuoto), broad match off.
- Elenco negative condiviso **`escluse`** agganciato + le negative del §4.
- Conversioni: le stesse dell'account (Lead, Contatto tel/WA, Acquisto da tag). Nessuna nuova.
- Pianificazione: tutto il giorno, tutti i giorni (fusi diversi; il sabato è il giorno migliore
  anche in Italia).
- Tagging automatico attivo (gclid) → GA4 legge `campaign`, `country`, `city` senza UTM.
  Facoltativo: aggiungere `?utm_source=google&utm_medium=cpc&utm_campaign=estero_it` al final URL
  per leggere la campagna anche in Supabase `leads.utm_*`.

---

## 2. Landing

**Final URL:** `https://www.successioniarmellin.it/guide/eredi-estero`
(la guida ha il box CTA verso `/preventivo` + telefono; il cookie lingua resta IT).

Perché la guida e non la Home: chi cerca «successione dall'estero» ha una domanda specifica
(codice fiscale, imposte senza conto, documenti) e la Home non la nomina. La guida risponde e
poi manda al questionario. Da valutare dopo 100 clic: landing dedicata `/eredi-estero`
(hero + 3 problemi risolti + questionario inline) se il tasso `quote_result` è sotto il 20%.

Fase 2 EN: `https://www.successioniarmellin.it/en/guide/eredi-estero`.

---

## 3. Gruppi di annunci e keyword (campagna IT)

Corrispondenza **a frase** salvo `[esatta]`. Massimo 8-10 keyword per gruppo, come le altre
campagne. Volumi bassi per singola keyword: è normale, la somma conta.

### Gruppo A — «Successione dall'estero» (intento pieno)
- "successione in italia dall'estero"
- "dichiarazione di successione dall'estero"
- "successione eredi all'estero"
- "erede residente all'estero successione"
- "successione italiana residente all'estero"
- "successione per italiani all'estero"
- [successione dall'estero]
- [dichiarazione di successione residente all'estero]

### Gruppo B — «Casa ereditata in Italia»
- "casa ereditata in italia vivo all'estero"
- "ereditare casa in italia dall'estero"
- "successione immobile in italia dall'estero"
- "eredità in italia residente all'estero"
- "genitore morto in italia successione dall'estero"
- [eredità casa in italia dall'estero]

### Gruppo C — «Defunto all'estero, beni in Italia»
- "defunto residente all'estero successione italia"
- "successione genitore morto all'estero casa in italia"
- "successione beni in italia defunto estero"
- "morto all'estero successione in italia"

### Gruppo D — «Codice fiscale / imposte» (informazionale, CPC basso; landing = guida specifica)
- "codice fiscale erede all'estero successione" → `/guide/codice-fiscale-erede-estero`
- "codice fiscale per successione residente estero" → idem
- "pagare imposte successione dall'estero" → `/guide/pagare-imposte-successione-dall-estero`
- "successione senza conto corrente italiano" → idem

Se dopo 2 settimane il gruppo D porta clic senza `quote_result`, metterlo in pausa: le guide
lavorano comunque in organico.

---

## 4. Negative aggiuntive (oltre a `escluse`)

Corrispondenza a frase, a livello campagna:
`lavoro`, `pensione`, `inps`, `iscrizione aire`, `cittadinanza`, `passaporto`, `visto`,
`consolato orari`, `trasferirsi`, `residenza fiscale`, `tasse redditi estero`, `notaio`,
`avvocato`, `gratis`, `modulo`, `fac simile`, `precompilata`, `agenzia entrate login`,
`successione ereditaria legge` (informazionale puro), `quote ereditarie`, `testamento come fare`.

---

## 5. Annunci (RSA) — campagna IT

Un RSA per gruppo; titoli comuni + 2 titoli specifici del gruppo. Pinnare in posizione 1 il
titolo del gruppo, posizione 2 «Tutto Online, Senza Rientrare». Massimo 30 caratteri per
titolo, 90 per descrizione (lunghezze verificate).

**Titoli comuni**
1. `Successione Italia dall'Estero` (30)
2. `Tutto Online, Senza Rientrare` (29)
3. `Per Italiani all'Estero` (23)
4. `Geometra, Prezzo Chiaro` (23)
5. `Da 290 €, Imposte a Parte` (25)
6. `Codice Fiscale con Delega` (25)
7. `Imposte Senza Conto Italiano` (28)
8. `Preventivo Online in 2 Minuti` (29)
9. `Risposta su WhatsApp` (20)
10. `Firma a Distanza, Zero Viaggi` (29)
11. `Voltura Catastale Inclusa` (25)
12. `Documenti da Foto col Telefono` (30)

**Titoli specifici**
- Gruppo B: `Casa Ereditata in Italia?` (25) · `Vivi all'Estero? Facciamo Noi` (29)
- Gruppo C: `Genitore Morto all'Estero?` (26) · `Beni in Italia, Eredi Fuori` (27)
- Gruppo D: `Codice Fiscale Erede Estero` (27) · `Paghi le Imposte Tramite Noi` (28)

**Descrizioni**
1. `Successione per chi vive all'estero: tutto a distanza, con un geometra abilitato vero.` (86)
2. `Codice fiscale con delega, documenti da foto, imposte pagabili tramite lo studio.` (81)
3. `Onorario tutto incluso, imposte a parte comunicate prima. Nessun professionista da pagare.` (90)
4. `Scrivi su WhatsApp: risponde Lorenzo in persona. Eredi in Germania, Svizzera, UK e oltre.` (89)

**Percorso visualizzato:** `successioniarmellin.it/estero/online`

**Asset**
- Sitelink: Preventivo (`/preventivo`), Tariffe (`/tariffe`), Codice fiscale dall'estero
  (`/guide/codice-fiscale-erede-estero`), Pagare le imposte (`/guide/pagare-imposte-successione-dall-estero`).
- Callout: `Tutto online`, `Geometra abilitato`, `WhatsApp`, `Pagamento con carta`, `11 lingue`.
- Snippet strutturati (Servizi): Dichiarazione di successione, Voltura catastale, Codice fiscale
  con delega, Calcolo imposte.
- Call asset: sì, numero 320 157 0567 (WhatsApp è lo stesso numero; dall'estero il prefisso +39
  va mostrato: Google lo aggiunge in base al Paese).

---

## 6. Annunci — campagna EN (fase 2, bozza)

Keyword (frase): "italian inheritance tax declaration", "inheritance in italy living abroad",
"dichiarazione di successione english", "inherited property in italy what to do",
"italian succession declaration help", "codice fiscale for inheritance italy",
"inherited house in italy from abroad", "italian estate declaration non resident".
Negative: `lawyer`, `attorney`, `citizenship`, `jure sanguinis`, `visa`, `buy property`,
`mortgage`, `free`, `template`.

Titoli (≤30): `Italian Inheritance, Done Online` (31 → usare `Italian Inheritance Online` 26),
`Inherited a House in Italy?` (27), `Licensed Italian Surveyor` (25), `No Travel to Italy Needed` (25),
`Tax Code Obtained for You` (25), `Fixed Fee from €290` (19), `Reply on WhatsApp` (17),
`Pay Taxes Without IT Account` (28), `Cadastral Transfer Included` (27), `Quote Online in 2 Minutes` (25).
Descrizioni (≤90): `Succession declaration for heirs abroad: documents by photo, remote signature, clear fee.` (89) ·
`We obtain your codice fiscale by proxy and can pay the Italian taxes for you. Quote online.` → 91, usare
`We get your codice fiscale by proxy and can pay the Italian taxes for you. Quote online.` (88) ·
`Lorenzo, licensed surveyor in Tuscany, files your Italian succession remotely. WhatsApp.` (88)
Landing: `/en/guide/eredi-estero`.

---

## 7. Misurazione e criteri di decisione

Dopo **100 clic o 3 settimane** (quello che arriva prima), lettura con `node scripts/ga4-report.mjs`
+ query per Paese (`country`, `sessionCampaignName`):

| Metrica | Soglia «continua» | Soglia «ferma/rivedi» |
|---|---|---|
| CTR Search | ≥ 4% | < 2% (annunci o keyword sbagliati) |
| CPC medio | ≤ 2,50 € | > 3,50 € |
| `quote_result` / sessione cpc | ≥ 20% (la Nazionale fa ~50% nei giorni buoni) | < 10% → landing dedicata |
| `contact_click` + `generate_lead` / sessione | ≥ 8% | < 3% |
| Termini di ricerca fuori tema | < 20% dei clic | > 40% → negative + esatte |

Confronto con la Nazionale sugli stessi giorni. Se la Estero IT converte in contatti almeno
quanto la Nazionale con CPC simile, spostare budget 50/50; se meglio, 60/40 a favore
dell'estero.

---

## 8. Canali gratuiti in parallelo (costo zero, tempi lunghi)

- Guide pubblicate = SEO su ricerche in italiano dall'estero (pochissimi contenuti seri).
  Sitemap già aggiornata automaticamente.
- Gruppi Facebook «Italiani a Londra / Berlino / Zurigo / Bruxelles / Parigi»: un post
  informativo (non pubblicitario) che linka la guida sul codice fiscale.
- Com.It.Es, patronati, associazioni di emigrati, parrocchie italiane all'estero: email con la
  guida pilastro e disponibilità a rispondere a domande dei loro iscritti.
- Google Business Profile: aggiungere «Successioni per italiani all'estero» tra i servizi.

---

## 9. Prossimi passi sul sito (non ancora fatti)

1. Domanda nel questionario «Vivi all'estero?» (sì/no) → snapshot CRM + prefill WhatsApp
   dedicato; permette di misurare il segmento anche in organico.
2. Landing `/eredi-estero` se la guida come landing converte poco (vedi §2).
3. Pacchetto o supplemento «Erede all'estero» in `packages`/`addons` (codice fiscale con
   delega, gestione apostille/traduzioni, imposte tramite studio) con prezzo suo.
4. Campagna EN (fase 2) e valutazione portoghese per il Brasile.
5. FAQ dedicate (3-4) nella categoria esistente, con link alle guide.
