import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  Albanian courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsSq({
  practiceCode,
  signerName,
}: MandatoParams): string[] {
  const studio = obj<{
    ragione_sociale?: string;
    forma_giuridica?: string;
    piva?: string;
    cf?: string;
    albo?: string;
    indirizzo?: string;
  }>("footer", "studio", {});
  const pec = text("settings", "pec", "");
  const email = text("settings", "email", "");

  return [
    `Unë, i nënshkruari/e nënshkruara ${signerName} (më poshtë, «Klienti»), i jap ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, P.IVA ${studio.piva ?? ""}, C.F. ${
      studio.cf ?? ""
    }, i regjistruar në ${
      studio.albo ?? "regjistrin profesional"
    }, PEC ${pec}, email ${email} (më poshtë, «Profesionisti»), mandatit profesional të përshkruar më poshtë, lidhur me praktikën ${practiceCode}.`,

    "1. OBJEKTI. Mandati mbulon ndihmën për përgatitjen e deklaratës së trashëgimisë dhe dërgimin e saj elektronik te Agenzia delle Entrate, që Profesionisti e kryen si ndërmjetës i autorizuar Entratel, si dhe hapat e lidhur të përfshirë në paketën e blerë (p.sh. transferime kadastrale / volture). Aktivitetet që nuk përfshihen në paketë përjashtohen dhe mund të jenë objekt i një preventivi të veçantë.",

    "2. SHPËRBLIMI. Shpërblimi është ai i paketës së blerë, i treguar në seksionin «Blerja juaj» të zonës personale dhe i paguar tashmë në porosi. Taksat dhe detyrimet ndaj Shtetit (taksa e trashëgimisë, hipotekore, kadastrale, pulla, detyrime speciale) NUK përfshihen në shpërblim: llogariten sipas situatës konkrete, i komunikohen Klientit para dërgimit të deklaratës dhe paguhen nga Klienti, pa asnjë shtesë nga Profesionisti.",

    "3. DETYRIMET E KLIENTIT. Klienti zotohet të japë të dhëna dhe dokumente të vërteta, të plota dhe në kohë, dhe mbetet përgjegjës për saktësinë e tyre. Afati i dorëzimit fillon kur dokumentacioni i nevojshëm është i plotë dhe i vlerësuar nga Profesionisti, dhe nuk përfshin kohët e palëve të treta (Agenzia delle Entrate, Kadastro, banka).",

    "4. KUJDESI DHE PËRGJEGJËSIA. Profesionisti e kryen mandatin me kujdesin profesional të kërkuar nga natyra e veprimtarisë (detyrim mjetesh), me mbikëqyrje fiskale nga një kontabilist. Për çdo gjë që nuk parashikohet në këtë mandat zbatohen Kushtet e shitjes të pranuara në blerje, duke përfshirë kufizimet e përgjegjësisë, ndryshimin e paketës dhe rregullimin.",

    "5. TËRHEQJA. E drejta e tërheqjes sipas neneve 52–59 të Kodit të Konsumatorit mbetet siç tregohet në Kushtet e shitjes dhe në faqen Tërheqje të sitit. Nëse tërheqja ndodh pasi ka filluar puna, Klienti paguan një shumë proporcionale me shërbimin tashmë të kryer.",

    "6. TË DHËNAT PERSONALE. Trajtimi i të dhënave personale të Klientit dhe të personave të përfshirë në praktikë (përfshirë të ndjerin dhe trashëgimtarët e tjerë) përshkruhet në Informativën e Privatësisë në sit, që Klienti deklaron se e ka lexuar. Klienti garanton se është i autorizuar të komunikojë të dhëna të palëve të treta.",

    "7. DHËNIA DHE NËNSHKRIMI. Ky mandat jepet në distancë. Nënshkrimi bëhet, sipas zgjedhjes së Klientit, në mënyrë elektronike (zgjedhja e kutisë së pranimit dhe e butonit të nënshkrimit në zonën personale, me regjistrim të datës dhe orës) ose me nënshkrim të dorës mbi dokumentin e shkarkuar dhe ngarkimin e mëpasëm të kopjes së nënshkruar.",

    "(Versioni italian i këtij mandati është ligjërisht detyrues. Çdo përkthim është vetëm për lehtësi; në rast mospërputhjeje, mbizotëron versioni italian.)",
  ];
}

export function buildMandatoTextSq(params: MandatoParams): string {
  return (
    `Mandat profesional — Praktika ${params.practiceCode}\n\n` +
    buildMandatoParagraphsSq(params).join("\n\n") +
    `\n\nVendi dhe data: _________________________\n\nNënshkrimi i Klientit: _________________________\n`
  );
}
