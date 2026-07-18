import type { ArticleBlock, ArticleSource } from "./articles";

/*
  Albanian courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleSqOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "Rishikuar pjesa fiskale nga kontabilistë";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Deklarata e trashëgimisë",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - Si të paguani taksat",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS dekret ligjor 346/1990",
  href: "https://www.normattiva.it",
};

export const articlesSq: Record<string, ArticleSqOverlay> = {
  "successione-cosa-e": {
    title: "Trashëgimia: çfarë është dhe kur duhet paraqitur",
    excerpt: "Një udhëzues i qartë për të kuptuar detyrimin, kush duhet ta kryejë, afatet dhe çfarë rrezikoni nëse nuk e paraqisni.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Deklarata e trashëgimisë është detyrimi fiskal me të cilin i njoftohet Agenzia delle Entrate pasuria e lënë nga i vdekuri (de cuius) dhe e transferuar te trashëgimtarët. Nuk është pranimi i trashëgimisë dhe nuk është akt noterial: shërben për të deklaruar pasurinë aktive të trashëgimisë, për të likuiduar taksat e duhura dhe, kur ka pasuri të paluajtshme, për të përditësuar Katastrin me volturën." },
      { type: "h2", text: "Kush duhet ta paraqesë" },
      { type: "p", text: "Janë të detyruar trashëgimtarët, të thirrurit në trashëgim dhe legatari (ose përfaqësuesit e tyre ligjorë), si dhe administratorët, kujdestarët e trashëgimisë të palëvizshme, ekzekutorët testamentarë dhe trustee." },
      {
        type: "ul",
        items: [
          "Mjafton ta paraqesë vetëm një nga të detyruarit: deklarata vlen për të gjithë.",
          "Mund të transmetohet nga një ndërmjetës i autorizuar Entratel (si një Geom. i autorizuar): këtë e bëjmë ne.",
        ],
      },
      { type: "h2", text: "Deri kur duhet paraqitur" },
      { type: "p", text: "Afati i zakonshëm është 12 muaj nga data e hapjes së trashëgimisë, e cila zakonisht përkon me datën e vdekjes (neni 31 TUS). Në raste të veçanta (trashëgimi e palëvizshme, pranim me beneficion inventari, emërim kujdestari) afati fillon kur subjekti është ligjërisht në gjendje të veprojë." },
      { type: "callout", tone: "warning", title: "Kujdes me afatet", text: "Paraqitja me vonesë mund të sjellë gjoba dhe interesa. Nëse afati prej 12 muajsh është afër, është më mirë të veprohet menjëherë: ne e menaxhojmë brenda afateve të duhura." },
      { type: "h2", text: "Si paraqitet sot" },
      { type: "p", text: "Deklarata transmetohet në mënyrë telematike me softuerin e Agenzia delle Entrate. Skedari i prodhuar (me zgjatje .SUC) dërgohet drejtpërdrejt nga kontribuesi i autorizuar ose, më shpesh, nga një ndërmjetës i autorizuar Entratel. Modeli i vjetër 4 në letër mbetet vetëm për rastet e mbetura (vdekje para 3 tetorit 2006 ose banorë jashtë vendit të pamundur për transmetim telematik)." },
      { type: "h2", text: "Çfarë rrezikoni nëse nuk e bëni (ose e bëni gabim)" },
      { type: "p", text: "Mosparaqitja sjell një gjobë në raport me taksën e duhur, përveç interesave; paraqitja e vonuar ose jo e saktë sjell gjoba të reduktuara ose proporcionale sipas rastit. Shumat ndryshojnë me kalimin e kohës: duhet verifikuar te burimet zyrtare dhe me profesionistin." },
      { type: "callout", tone: "info", title: "Nuk është gjithmonë e detyrueshme", text: "Në disa raste deklarata nuk është fare e detyrueshme. E shpjegojmë në udhëzuesin e dedikuar për përjashtimin: verifikojmë falas rastin tuaj para se t'ju bëjmë të paguani." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "Kur NUK jeni të detyruar të bëni trashëgiminë",
    excerpt: "Përjashtimi i parashikuar nga ligji: tre kushtet që duhet të vlejnë së bashku dhe pse mjafton një pasuri e paluajtshme për të aktivizuar detyrimin.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Deklarata e trashëgimisë nuk është gjithmonë e detyrueshme. Ligji (neni 28, par. 7 i TUS) parashikon një përjashtim kur plotësohen NJËKOHËSISHT tre kushte. Nëse mungon edhe vetëm një, detyrimi kthehet." },
      { type: "h2", text: "Tre kushtet e përjashtimit" },
      {
        type: "ol",
        items: [
          "Trashëgimia i kalon bashkëshortit dhe/ose të afërmve në linjë të drejtë (fëmijë, prindër).",
          "Pasuria aktive e trashëgimisë ka vlerë jo më të madhe se 100.000 euro.",
          "Trashëgimia nuk përfshin pasuri të paluajtshme ose të drejta reale mbi pasuri të paluajtshme.",
        ],
      },
      { type: "callout", tone: "warning", title: "Mjafton një pasuri e paluajtshme", text: "Edhe një e vetme pasuri e paluajtshme, edhe me vlerë minimale, aktivizon detyrimin pavarësisht nga vlera totale. Prania e një shtëpie, toke ose garazhi ndryshon gjithçka." },
      { type: "h2", text: "Raste të tjera pa detyrim" },
      { type: "p", text: "Ekzistojnë hipoteza të tjera përjashtimi ose mungese detyrimi, p.sh. heqja dorë nga trashëgimia para afatit prej 12 muajsh (neni 28, par. 5). Kushtet mund të pushojnë edhe për shkak të ndodhive të mëvonshme: prandaj vlerësimi bëhet gjithmonë mbi rastin konkret." },
      { type: "callout", tone: "info", title: "Jua themi falas", text: "Nëse nga rasti juaj del se trashëgimia mund të mos jetë e detyrueshme, nuk ju shesim një shërbim të panevojshëm: jua themi. Verifikimi përfundimtar mbetet mbi rastin konkret." },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "Sa paguhet taksë trashëgimie",
    excerpt: "Franchigie, aliqote dhe autolikuidim 2025: si funksionojnë taksat, kush i paguan dhe pse shpesh për trashëgimtarët e drejtpërdrejtë janë zero.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Një parakusht i rëndësishëm: çmimi i shërbimit tonë (honorari) është një gjë, taksat janë tjetër. Taksat i paguan trashëgimtari, veç nga honorari, dhe ne i llogaritim dhe i komunikojmë PARA dërgimit." },
      { type: "h2", text: "Taksa e trashëgimisë: aliqote dhe franchigie" },
      { type: "p", text: "Taksa e trashëgimisë zbatohet vetëm mbi vlerën që tejkalon franchigien, e cila varet nga shkalla e afinitetit me të vdekurin." },
      {
        type: "table",
        headers: ["Përfituesi", "Aliquota", "Franchigia (për përfitues)"],
        rows: [
          ["Bashkëshorti dhe të afërmit në linjë të drejtë (fëmijë, prindër)", "4%", "1.000.000 EUR"],
          ["Vëllezërit dhe motrat", "6%", "100.000 EUR"],
          ["Të afërmit e tjerë deri në gradën e 4-të dhe afinitet (brenda kufijve ligjorë)", "6%", "nessuna"],
          ["Subjekte të tjera (të huaj)", "8%", "nessuna"],
          ["Persona me aftësi të kufizuar të rëndë (L. 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "Për trashëgimtarët e drejtpërdrejtë shpesh është zero", text: "Me bashkëshort dhe fëmijë franchigia është 1.000.000 euro për person: për këtë arsye, në shumicën e trashëgimive familjare, taksa e trashëgimisë në vetvete është zero." },
      { type: "h2", text: "Taksat hipotekore dhe kadastrale (vetëm me pasuri të paluajtshme)" },
      { type: "p", text: "Kur ka pasuri të paluajtshme paguhen taksa hipotekore (2% e vlerës kadastrale, minimumi 200 euro) dhe taksa kadastrale (1% e vlerës kadastrale, minimumi 200 euro). Me lehtesimin e shtëpisë së parë në emër të një trashëgimtari, të dyja ulen në shumën fikse prej 200 euro secila. Shtohen pulla, taksë hipotekore dhe taksat speciale kadastrale me shumë fikse." },
      { type: "h2", text: "Autolikuidim 2025: çfarë ka ndryshuar" },
      { type: "p", text: "Për trashëgimitë e hapura nga 1 janari 2025, taksa e trashëgimisë autolikuidohet nga kontribuesi drejtpërdrejt në deklaratë (jo më e likuiduar nga zyra). Pagesa bëhet brenda 90 ditëve nga afati i paraqitjes, me F24." },
      {
        type: "ul",
        items: [
          "Lejohet këstëzimi nëse shuma është të paktën 1.000 euro: parapagim minimal 20% dhe saldo në 8 këste tremujore (deri në 12 këste mbi 20.000 euro), me interesa.",
          "Për trashëgimitë e hapura para 2025 mbetet likuidimi nga zyra me njoftim dhe pagesë brenda 60 ditëve nga njoftimi.",
        ],
      },
      { type: "h2", text: "Një shembull konkret (rast real anonim)" },
      { type: "p", text: "Familje me bashkëshort dhe 2 fëmijë, pasuri trashëgimi rreth 117.000 euro (pasuri të paluajtshme, tituj dhe likuiditet), me shtëpi të parë dhe volturë kadastrale. Taksat totale ishin rreth 1.200 euro (hipotekore, kadastrale, pullë dhe taksa), ndërsa taksa e trashëgimisë ishte zero sepse trashëgimtarët e drejtpërdrejtë ishin shumë nën franchigien. Honorari i shërbimit është i veçantë." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "Lehtesimi i shtëpisë së parë në trashëgim: si funksionon",
    excerpt: "Kur u takojnë taksat fikse në vend të përqindjeve, kush mund ta kërkojë dhe çfarë duhet për të mos humbur përfitimin.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Kur në një trashëgim ka një pasuri të paluajtshme që mund të përfitojë nga lehtesimi i shtëpisë së parë në emër të të paktën një trashëgimtari, taksat hipotekore dhe kadastrale nuk paguhen me përqindje por me shumë fikse: 200 euro secila, në vend të 2% dhe 1% të vlerës kadastrale. Për pasuri me vlerë të caktuar kursimi është i konsiderueshëm." },
      { type: "h2", text: "Kujt i takon" },
      { type: "p", text: "Përfitimi kërkon që të paktën një trashëgimtar të plotësojë kërkesat e parashikuara nga ligji për shtëpinë e parë (në thelb: të mos jetë titullar i të drejtave të tjera mbi pasuri të paluajtshme në të njëjtën bashki dhe të mos ketë përfituar tashmë nga lehtesimi diku tjetër, me vendbanim në bashkinë e pasurisë brenda afateve ligjore). Mjafton që kërkesat t'i plotësojë vetëm një trashëgimtar që lehtesimi të zbatohet mbi pasurinë." },
      { type: "callout", tone: "warning", title: "Kërkesat duhen verifikuar", text: "Lehtesimi deklarohet në kuadrin EH të modelit dhe duhet shënuar saktë. Nëse kërkesat mungojnë ose pushojnë, përfitimi humbet me rikuperim taksash dhe gjobash: më mirë një verifikim teknik paraprakisht." },
      { type: "h2", text: "Çfarë kontrollojmë ne" },
      { type: "p", text: "Si Geom., pjesa jonë është pikërisht verifikimi kadastral: parcelat, nënalternativat, kategoria, rendita dhe aktet e proveniencës. Kontrollojmë që të dhënat janë të sakta dhe shtëpia e parë të deklarohet si duhet, që lehtesimi të mbajë dhe të mos vijnë surpriza." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "Dokumentet për trashëgiminë: lista e plotë",
    excerpt: "Të gjitha dokumentet tipike dhe si t'i merrni, rast pas rasti. Jo gjithmonë nevojiten të gjitha: varet nga situata juaj.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Dokumentet për deklaratën e trashëgimisë ndryshojnë sipas rastit: nuk nevojiten kurrë të gjitha njëherësh. Më poshtë më të zakonshmet, të ndara sipas situatës. Nëse ju mungon diçka, shpesh mund ta marrim ne (vërtetime, akte provenience, të dhëna që mungojnë)." },
      { type: "h2", text: "Dokumente gjithmonë të nevojshme" },
      {
        type: "ul",
        items: [
          "Certifikatë ose ekstrakt vdekjeje të të vdekurit (ose vetëdeklaratë ku lejohet).",
          "Dokument identiteti dhe kod fiskal i të vdekurit dhe i të gjithë trashëgimtarëve.",
          "Vetëdeklaratë e gjendjes familjare dhe e shkallës së afinitetit të trashëgimtarëve.",
        ],
      },
      { type: "h2", text: "Nëse ka prona" },
      {
        type: "ul",
        items: [
          "Vërtetime kadastrale të pasurive të paluajtshme në trashëgim (mund t'i marrim ne).",
          "Akte provenience: rogit, dhurata ose deklarata të mëparshme trashëgimi.",
          "Planimetri, ku nevojiten për verifikimin kadastral.",
        ],
      },
      { type: "h2", text: "Nëse ka testamente ose trashëgimtarë të veçantë" },
      {
        type: "ul",
        items: [
          "Kopje e testamenteve të publikuara dhe eventuale procesverbal i publikimit.",
          "Autorizim i Gjyqtarit Kujdestar në prani të trashëgimtarëve të mitur ose të paaftë.",
        ],
      },
      { type: "h2", text: "Nëse ka llogari dhe investime" },
      {
        type: "ul",
        items: [
          "Certifikim i bilancit dhe gjendjes së llogarive, fletëve dhe titujve në datën e vdekjes.",
          "IBAN i trashëgimtarit për rimbursime eventuale ose për debitimin e taksave.",
        ],
      },
      { type: "callout", tone: "info", title: "Ju mungon diçka? Shpesh mund ta marrim ne", text: "Rikuperimi dokumentar është pjesë e punës sonë: vërtetime kadastrale, akte provenience dhe të dhëna që mungojnë i marrim ne te entet dhe bankat." },
      { type: "callout", tone: "warning", title: "Listë orientuese", text: "Kjo listë është orientuese dhe përshtatet me rastin tuaj. Listën përfundimtare e konfirmon Lorenzo pasi të ketë verifikuar situatën tuaj konkrete." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Trashëgimtarë që jetojnë jashtë vendit: si menaxhohet praktika",
    excerpt: "Çfarë ndryshon kur një nga trashëgimtarët banon jashtë Italisë dhe si e ndjekim praktikën në distancë, edhe në gjuhën tuaj.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Të kesh një trashëgimtar që jeton jashtë vendit nuk është problem: deklarata e trashëgimisë lidhet me pasurinë në Itali dhe paraqitet gjithsesi te Agenzia delle Entrate. Ndryshon kryesisht mënyra e mbledhjes së dokumenteve dhe nënshkrimeve, që i menaxhojmë plotësisht në distancë." },
      { type: "h2", text: "Çfarë nevojitet vërtet" },
      {
        type: "ul",
        items: [
          "Kodi fiskal italian i çdo trashëgimtari (edhe i atyre që jetojnë jashtë vendit): nëse mungon, mund të kërkohet.",
          "Dokumentet e identitetit dhe të dhënat personale të të gjithë trashëgimtarëve.",
          "Një mandat ose delegim te ndërmjetësi, meqë deklaratën e paraqet një trashëgimtar dhe ne e transmetojmë në emër të tij.",
        ],
      },
      { type: "p", text: "Banorët jashtë vendit, si përjashtim, mund të paraqesin modelin në letër vetëm nëse janë të pamundur për transmetim telematik; në shumicën dërmuese të rasteve ne veprojmë në mënyrë telematike si ndërmjetës i autorizuar." },
      { type: "h2", text: "Gjithçka në distancë, edhe në gjuhën tuaj" },
      { type: "p", text: "Pyetësor, dokumente, komunikime dhe nënshkrime bëhen online: nuk duhet të ktheheni në Itali. Mund t'ju ndjekim me email ose mesazhe në gjuhën tuaj dhe, ku nevojitet, të organizojmë një telefonatë me përkthim. Pikat e rëndësishme (shumat, afatet, dokumentet) jua konfirmojmë gjithmonë me shkrim; dokumentet zyrtare mbeten në italisht." },
      { type: "callout", tone: "info", title: "Ora dhe distanca nuk kanë rëndësi", text: "Ngarkoni dokumentet kur të doni nga zona juaj personale, edhe me foto nga telefoni. Ne i kontrollojmë dhe ju vëmë në rregull brenda afateve." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "fai-da-te-precompilata": {
    title: "Trashëgimi i paraplotësuar: ia vlen bëje vetë?",
    excerpt: "Deklarata falas në faqen e Agenzia ekziston vërtet. Shohim kur ka kuptim dhe kur ia vlen të delegoni.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "E themi menjëherë, me sinqeritet: deklaratën e trashëgimisë mund ta bëni falas vetë. Agenzia delle Entrate ofron një procedurë web të udhëzuar për rastet më të thjeshta dhe softuerin zyrtar për ato më të ndërlikuara. Është një opsion legjitim." },
      { type: "h2", text: "Kur bëje vetë mund të mjaftojë" },
      { type: "p", text: "Nëse rasti është vërtet i thjeshtë (pak trashëgimtarë të drejtpërdrejtë, asnjë pasuri e paluajtshme ose vetëm një e thjeshtë, të dhëna kadastrale tashmë të qarta dhe të sakta) dhe jeni të familiarizuar me SPID dhe procedurat online, paraplotësimi mund të mjaftojë." },
      { type: "h2", text: "Ku bëje vetë bëhet i rrezikshëm" },
      {
        type: "table",
        headers: ["Aspekti", "Bëjeni vetë", "Me ne"],
        rows: [
          ["Koha e nevojshme", "Orët dhe SPID mbeten mbi ju", "Ne merremi ne"],
          ["Kontrolli i të dhënave kadastrale", "Në përgjegjësi tuaj", "E kryen një gjeometër"],
          ["Llogaritja e taksave", "Vetë", "Ne e bëjmë, para dërgimit"],
          ["Asistencë", "Asnjë", "Një person real"],
          ["Rrezik gjobash për gabime", "Juaj", "Menaxhuar"],
        ],
      },
      { type: "callout", tone: "warning", title: "Pika e dobët janë të dhënat kadastrale", text: "Paraplotësimi nuk i vërteton të dhënat kadastrale: pikërisht aty bllokohen ose gabojnë shumica e praktikave. Parcelat, nënalternativat, anekset dhe aktet e proveniencës duhen verifikuar, dhe kjo është puna e Geom." },
      { type: "p", text: "Në thelb: nëse rasti juaj është i thjeshtë dhe ndiheni të sigurt, bëje vetë është i sinqertë. Nëse ka pasuri të paluajtshme, dyshime ose pak kohë, delegimi ju heq rrezikun e gabimeve dhe gjobave. Në çdo rast, verifikojmë falas situatën tuaj para se të vendosni." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleSq(slug: string): ArticleSqOverlay | undefined {
  return articlesSq[slug];
}
