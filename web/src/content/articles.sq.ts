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

const REVIEWED = "";

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
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - Si dhe kur të paraqitet deklarata",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Kërkesa për codice fiscale (modello AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/codice-fiscale-e-tessera-sanitaria/modello-e-istruzioni-cittadini",
};
const FONTE_UE_650: ArticleSource = {
  label: "Rregullorja (BE) nr. 650/2012 mbi trashëgimitë ndërkufitare",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Rregullorja (BE) 2016/1191 - Dokumentet publike pa legalizim",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "Ministria e Punëve të Jashtme e Italisë - Shërbimet konsullore për italianët jashtë vendit",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
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
      { type: "callout", tone: "info", title: "Nuk është gjithmonë e detyrueshme", text: "Në disa raste deklarata nuk është fare e detyrueshme. E shpjegojmë në udhëzuesin e dedikuar për përjashtimin: verifikojmë falas rastin tuaj." },
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
          "Certifikatë ose ekstrakt vdekjeje të të vdekurit.",
          "Dokument identiteti i të vdekurit dhe i trashëgimtarëve; kodi fiskal i trashëgimtarëve.",
          "Vetëdeklaratë e gjendjes familjare dhe e shkallës së afinitetit të trashëgimtarëve.",
          "IBAN i trashëgimtarit (duhet gjithmonë, për rimbursime ose debitimin e taksave).",
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
        ],
      },
      { type: "callout", tone: "info", title: "Ju mungon diçka? Shpesh mund ta marrim ne", text: "Rikuperimi dokumentar është pjesë e punës sonë: vërtetime kadastrale, akte provenience dhe të dhëna që mungojnë i marrim ne te entet dhe bankat." },
      { type: "callout", tone: "warning", title: "Listë orientuese", text: "Kjo listë është orientuese dhe përshtatet me rastin tuaj. Listën përfundimtare e konfirmon Lorenzo pasi të ketë verifikuar situatën tuaj konkrete." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Trashëgimia në Itali kur jetoni jashtë vendit: udhëzuesi i plotë",
    excerpt: "Keni trashëguar një shtëpi ose llogari në Itali por jetoni në Gjermani, Zvicër, Mbretëri të Bashkuar, Argjentinë apo diku tjetër? Çfarë ndryshon vërtet, çfarë ju duhet dhe si bëhet gjithçka në distancë, pa u kthyer.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Nëse jetoni jashtë vendit dhe në Itali ka mbetur shtëpia e prindërve, një tokë ose një llogari, dichiarazione di successione (deklarata e trashëgimisë) duhet paraqitur gjithsesi në Itali, brenda 12 muajve nga vdekja. Nuk duhet të ktheheni: deklarata transmetohet telematikisht nga një ndërmjetës i autorizuar, pra ne. Shërbimi ynë u krijua online pikërisht për ata që nuk mund të vijnë në zyrë, dhe për ata që jetojnë jashtë vendit kjo ka rëndësi më të madhe." },
      { type: "h2", text: "Dy rastet tipike" },
      {
        type: "ul",
        items: [
          "I vdekuri jetonte në Itali dhe një ose më shumë trashëgimtarë jetojnë jashtë vendit: praktika është e zakonshme, ndryshon vetëm mënyra e mbledhjes së dokumenteve dhe nënshkrimeve.",
          "I vdekuri jetonte jashtë vendit dhe kishte pasuri në Itali: deklarata bëhet gjithsesi në Itali, me disa rregulla shtesë mbi zyrën kompetente, taksat dhe ligjin e zbatueshëm. E trajtojmë në një udhëzues të dedikuar.",
        ],
      },
      { type: "h2", text: "Çfarë ndryshon krahasuar me banimin në Itali" },
      {
        type: "ul",
        items: [
          "Codice fiscale (kodi fiskal italian): duhet te çdo trashëgimtar, edhe nëse nuk ka jetuar kurrë në Itali. Pa të, deklarata nuk transmetohet. Mund të merret në konsullat ose, më shpejt, në Itali me delegim te ne.",
          "Dokumente të huaja: certifikata e vdekjes ose testamenti i lëshuar jashtë vendit mund të kërkojnë apostille ose legalizim dhe përkthim. Brenda Bashkimit Evropian rregullat janë më të thjeshta.",
          "Nënshkrimet: deklaratën e transmetojmë ne me mandatin tuaj të nënshkruar në distancë. Nuk nevojitet prokurë noteriale vetëm për deklaratën.",
          "Pagesa e taksave: bëhet me debitim nga një llogari italiane. Nëse nuk keni, ka zgjidhje, përfshirë debitimin nga llogaria e studios si ndërmjetës.",
          "Ora dhe gjuha: punojmë me shkrim, në WhatsApp dhe email, që të përgjigjeni kur mundeni. Faqja dhe komunikimet janë në disa gjuhë.",
        ],
      },
      { type: "h2", text: "Si funksionon, në pesë hapa" },
      {
        type: "ol",
        items: [
          "Plotësoni pyetësorin online: dy minuta dhe e dini menjëherë cilin paketë ju duhet dhe sa kushton.",
          "Na shkruani në WhatsApp ose paguani direkt. Ju hapim zonën personale me listën e dokumenteve për rastin tuaj.",
          "Ngarkoni dokumentet kur të doni, edhe si foto nga telefoni. Ne kontrollojmë të dhënat kadastrale, aktet e proveniencës dhe codice fiscale; nëse mungon diçka, shpesh e marrim ne në Itali.",
          "Ju konfirmojmë me shkrim taksat dhe shumat, pastaj nënshkruani mandatin në distancë dhe ne transmetojmë deklaratën te Agenzia delle Entrate.",
          "Merrni faturën e paraqitjes dhe, nëse ka pasuri të paluajtshme, voltura kadastrale. Gjithçka mbetet në zonën tuaj personale.",
        ],
      },
      { type: "callout", tone: "info", title: "Nuk duhet të ktheheni në Itali", text: "Asnjë hap i dichiarazione di successione nuk kërkon praninë tuaj fizike. Gjërat që në Itali bëhen te sporteli, si kërkesa për codice fiscale ose vërtetim kadastral, i bëjmë ne me delegimin tuaj." },
      { type: "h2", text: "Çfarë bëjmë ne, konkretisht" },
      {
        type: "ul",
        items: [
          "Kërkojmë codice fiscale për trashëgimtarët që nuk e kanë, me delegim, te Agenzia delle Entrate.",
          "Verifikojmë pasuritë e paluajtshme në Katastro dhe në aktet: këtu praktikat e menaxhuara nga distanca ngecin më shpesh.",
          "Përgatisim dhe transmetojmë deklaratën dhe voltura kadastrale si ndërmjetës i autorizuar.",
          "Nëse nuk keni llogari në Itali, bien dakord për pagesën e taksave përmes studios, me shuma dhe fatura me shkrim.",
          "Ju themi qartë nëse ndonjë hap kërkon noter ose konsullat, dhe cilin.",
        ],
      },
      { type: "h2", text: "Kur nevojitet edhe noteri ose konsullati" },
      { type: "p", text: "Dichiarazione di successione nuk është akt noterial dhe nuk e kërkon. Nevojiten në vend noteri, ose konsullati italian që për shtetasit italianë kryen disa funksione noteriale, për heqjen dorë nga trashëgimia, për pranimin me beneficio d'inventario, për publikimin e testamenteve dhe për shitjen e pasurisë së trashëguar. Nëse nga dokumentet del se rasti juaj i kërkon, jua sinjalizojmë dhe ju tregojmë kujt t'i drejtoheni." },
      { type: "h2", text: "Sa kushton" },
      { type: "p", text: "Paketat janë të njëjta me ata që jetojnë në Itali dhe i shihni në faqen e Tarifave: honorari përfshin gjeometrin, deklaratën dhe voltura. Taksat ligjore janë veç e veç për të gjithë dhe jua komunikojmë para transmetimit. Nëse rasti kërkon hapa shtesë, si codice fiscale ose përkthim, jua themi menjëherë, me shifër." },
      { type: "callout", tone: "warning", title: "12 muajt vlejnë edhe për ata që jetojnë jashtë vendit", text: "Afati fillon nga data e vdekjes, jo nga momenti kur arrini të merreni me praktikën. Nëse është afër, na shkruani menjëherë: për ata që jetojnë jashtë vendit, pjesa më e gjatë shpesh është codice fiscale." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "Codice fiscale për trashëgimtar që jeton jashtë vendit: si ta merrni",
    excerpt: "Pa codice fiscale të çdo trashëgimtari deklarata nuk transmetohet. Kush e ka tashmë pa e ditur; si ta kërkoni në konsullat ose në Itali me delegim; çfarë ju duhet.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Codice fiscale italian (kodi fiskal) është të dhëna që më shpesh bllokon trashëgimitë me trashëgimtarë jashtë vendit: deklarata telematike kërkon të gjithëve trashëgimtarëve dhe legatarëve, dhe pa të nuk transmetohet. Lajmi i mirë: ta merrni më lehtë sesa duket, dhe nuk kërkon të vini në Itali." },
      { type: "h2", text: "Ndoshta e keni tashmë" },
      { type: "p", text: "Kush ka lindur në Itali, ka punuar ose studiuar në Itali, ka tessera sanitaria të vjetër ose është i regjistruar në AIRE (regjistri i italianëve jashtë vendit) shpesh e ka tashmë codice fiscale, edhe nëse nuk e përdor prej vitesh. Kontrolloni dokumente të vjetra, tessera sanitaria ose deklaratën e të ardhurave. Nëse nuk e gjeni, me të dhënat tuaja anagrafike mund ta verifikojmë ne nëse ekziston: codice fiscale nuk kërkohet dy herë." },
      { type: "h2", text: "Si merret nëse mungon" },
      {
        type: "ol",
        items: [
          "Në konsullatën italiane të vendit ku jetoni: rruga e zakonshme për shtetasit rezidentë jashtë vendit. Paraqitet modello AA4/8 me dokument të vlefshëm. Afatet varen nga konsullata dhe mund të jenë të gjata.",
          "Në Itali, te çdo zyrë e Agenzia delle Entrate, përmes personit të deleguar: modello AA4/8 e nënshkruani ju, me pjesën e delegimit të plotësuar, dhe deleguari e paraqet me dokumentin e vet dhe kopjen tuaj. Është rruga që përdorim ne, zakonisht më e shpejta.",
        ],
      },
      { type: "callout", tone: "info", title: "E bëjmë ne me delegimin tuaj", text: "Ju dërgojmë modello AA4/8 të paraplotësuar, e nënshkruani dhe na e ktheni me kopjen e dokumentit. Ne e paraqesim te Agenzia delle Entrate dhe ju komunikojmë codice fiscale sapo t'i caktohet." },
      { type: "h2", text: "Çfarë ju duhet" },
      {
        type: "ul",
        items: [
          "Pasaportë ose kartë identiteti e vlefshme (kopje e lexueshme, para dhe prapa).",
          "Të dhëna anagrafike të plota: mbiemër, emër, gjinia, datë dhe vend lindjeje, adresa e banimit jashtë vendit.",
          "Arsyeja e kërkesës: trashëgimia në Itali. Duhet shënuar në modello AA4/8.",
          "Modello AA4/8 i nënshkruar, me delegimin e plotësuar nëse e paraqesim ne.",
        ],
      },
      { type: "h2", text: "Trashëgimtarë që nuk janë shtetas italianë" },
      { type: "p", text: "Vlen e njëjta procedurë: modello AA4/8 mund të paraqitet te çdo zyrë e Agenzia delle Entrate përmes deleguarit, me arsye të deklaruar. Për shtetas të huaj konsullata italiane ndërhyen vetëm në raste të veçanta, prandaj delegimi në Itali është pothuajse gjithmonë rruga më e thjeshtë." },
      { type: "callout", tone: "warning", title: "Filloni këtu nëse afati është afër", text: "Codice fiscale është hapi me afatet më pak të parashikueshme në të gjithë praktikën. Nëse vdekja ndodhi disa muaj më parë, kërkojeni menjëherë: pjesa tjetër e deklaratës përgatitet paralelisht." },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "I vdekuri jetonte jashtë vendit dhe kishte pasuri në Itali: çfarë të bëni",
    excerpt: "Deklarata në Itali edhe nëse vdekja ndodhi jashtë vendit: cila zyrë, mbi cilat pasuri paguhen taksat, çfarë thotë rregullorja evropiane mbi trashëgimitë dhe kur nevojitet noteri.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Është rasti klasik i shumë familjeve emigrante: prindi jetonte prej vitesh në Gjermani, Zvicër ose Argjentinë, por në Itali ka lënë shtëpinë e fshatit ose një apartament me qira. Nëse ka pasuri në Itali, dichiarazione di successione paraqitet në Itali brenda 12 muajve nga vdekja, edhe nëse vdekja ndodhi jashtë vendit dhe edhe nëse të gjithë trashëgimtarët jetojnë jashtë." },
      { type: "h2", text: "Mbi cilat pasuri paguhen taksat" },
      { type: "p", text: "Rregulla është në TUS (neni 2). Nëse i vdekuri ishte rezident në Itali në momentin e vdekjes, taksa lidhet me të gjitha pasuritë, kudo që ndodhen. Nëse nuk ishte rezident në Itali, taksa lidhet vetëm me pasuritë që ndodhen në Itali: pasuri të paluajtshme, llogari në banka italiane, pjesëmarrje në shoqëri italiane. Pasuritë jashtë vendit ndjekin rregullat e vendit ku ndodhen." },
      { type: "callout", tone: "info", title: "Taksim i dyfishtë", text: "Italia ka marrëveshje kundër taksimit të dyfishtë në materie trashëgimi me pak vende, përfshirë Francën, Mbretërinë e Bashkuar dhe Shtetet e Bashkuara. Për të tjerat, ajo që paguani në Itali mbi pasuritë italiane duhet koordinuar me deklaratën në vendin e banimit: ia vlen të konsultoheni me një këshilltar lokal." },
      { type: "h2", text: "Te cila zyrë paraqitet" },
      { type: "p", text: "Nëse i vdekuri kishte pasur banim në Itali para se të transferohej jashtë, zyra kompetente është ajo e Agenzia delle Entrate të banimit të fundit italian. Nëse nuk ka qenë kurrë rezident në Itali ose banimi i fundit nuk dihet, kompetenca i takon një zyre të Romës të caktuar nga Agenzia. Me deklaratën telematike këtë detaj e menaxhojmë ne në fazën e plotësimit." },
      { type: "h2", text: "Si paraqitet" },
      { type: "p", text: "Në mënyrë telematike përmes ndërmjetësi të autorizuar, saktësisht si për ata që jetojnë në Itali: mbledhim dokumente dhe nënshkrime në distancë dhe transmetojmë ne. Ligji lejon rezidentët jashtë vendit, vetëm nëse janë të pamundur për transmetim telematik, të dërgojnë modelin në letër me postë të rekomanduar: një përjashtim që në praktikë pothuajse kurrë nuk nevojitet." },
      { type: "h2", text: "Kush trashëgon: ligji i zbatueshëm" },
      { type: "p", text: "Ana fiskale dhe ana civile janë dy gjëra të ndryshme. Kush janë trashëgimtarët dhe në çfarë kuotash e përcakton ligji i zbatueshëm për trashëgiminë. Në Bashkimin Evropian vlen Regolamento 650/2012: për vdekjet nga 17 agosto 2015 zbatohet ligji i vendit ku i vdekuri kishte banimin e zakonshëm, përveç nëse në testamente kishte zgjedhur ligjin e vendit të shtetësisë. Pra një italian rezident në Gjermani pa testament trashëgon sipas ligjit gjerman, edhe për shtëpinë në Itali. Mbretëria e Bashkuar, Irlanda dhe Danimarka nuk e zbatojnë rregulloren; për vendet jashtë BE-së vlejnë normat italiane të së drejtës ndërkombëtare private." },
      { type: "callout", tone: "warning", title: "Ku mbaron puna jonë", text: "Ne përgatisim dhe transmetojmë deklaratën dhe voltura mbi pasuritë në Itali. Nëse trashëgimia rregullohet nga ligj i huaj, nëse ka testament të huaj për ta vlerësuar ose certifikatë evropiane trashëgimi për ta marrë, nevojitet edhe noter ose avokat: sapo del nga dokumentet, jua sinjalizojmë dhe ju tregojmë hapat." },
      { type: "h2", text: "Dokumentet shtesë" },
      {
        type: "ul",
        items: [
          "Certifikata e vdekjes e lëshuar jashtë vendit: nëse i vdekuri ishte shtetas italian, akti regjistrohet në komunën italiane përmes konsullatës dhe prej andej lëshohet certifikata italiane. Përndryshe nevojitet certifikata e huaj me apostille ose legalizim dhe përkthim, me thjeshtimet evropiane.",
          "Provë e banimit jashtë vendit të të vdekurit, p.sh. regjistrimi AIRE ose certifikatë banimi e vendit të huaj.",
          "Codice fiscale i të vdekurit dhe i të gjithë trashëgimtarëve: edhe trashëgimtarët jo italianë duhet ta kenë.",
          "Testamenti, nëse ka, me publikim ose certifikatë evropiane trashëgimi.",
        ],
      },
      { type: "h2", text: "Lehtësimi prima casa" },
      { type: "p", text: "Taksat ipotekore dhe kadastrale mbi pasurinë e trashëguar mund të ulen me lehtësimin prima casa, por për ata që jetojnë jashtë vendit rregullat janë specifike dhe ndryshuan në 2023: varen nga vendi i pasurisë dhe lidhja e trashëgimtarit me Italinë. E verifikojmë rast pas rasti para llogaritjes së taksave." },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "Dokumente nga jashtë vendit: apostille, përkthime dhe nënshkrime në distancë",
    excerpt: "Certifikatë vdekjeje e huaj, testament i huaj, dokumente identiteti jo italiane: kur nevojiten apostille, legalizim ose përkthim i betuar, dhe si nënshkruhet gjithçka pa ardhur në Itali.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Në një trashëgimi me trashëgimtarë ose të vdekur jashtë vendit, pothuajse të gjitha dokumentet janë të njëjta me një praktikë italiane. Ata që mund të vijnë nga një vend tjetër janë pak por delikate: certifikata e vdekjes nëse vdekja ndodhi jashtë vendit, testament i huaj, dokumentet e identitetit të trashëgimtarëve dhe, në disa raste, certifikata civile. Shohim çfarë nevojitet vërtet që Agenzia delle Entrate dhe Katastro t'i pranojnë." },
      { type: "h2", text: "Tre rregulla sipas vendit" },
      {
        type: "table",
        headers: ["Vendi i lëshimit", "Legalizim", "Përkthim"],
        rows: [
          ["Bashkimi Evropian", "Nuk nevojitet: Regolamento 2016/1191 eliminon apostille dhe legalizim për certifikatat civile", "Mund të shmangeni duke kërkuar formularin standard shumëgjuhësh së bashku me certifikatën"],
          ["Vendet e Konventës së Hagës 1961 (p.sh. Mbretëria e Bashkuar, Shtetet e Bashkuara, Zvicra, Argjentina, Brazili, Australia)", "Apostille, e vënë nga autoriteti i vendit që e ka lëshuar dokumentin", "Përkthim i betuar në Itali ose i certifikuar nga konsullata italiane"],
          ["Vende të tjera", "Legalizim te konsullata italiane në vendin e lëshimit", "Përkthim i betuar në Itali ose i certifikuar nga konsullata italiane"],
        ],
      },
      { type: "h2", text: "Certifikata e vdekjes" },
      { type: "p", text: "Nëse i vdekuri ishte shtetas italian dhe vdiq jashtë vendit, rruga më e thjeshtë është regjistrimi i aktit të vdekjes në komunën italiane përmes konsullatës: prej aty certifikatën e lëshon komuna, në italisht, dhe nuk nevojiten as apostille as përkthim. Nëse i vdekuri nuk ishte italian, përdoret certifikata e huaj me rregullat e tabelës." },
      { type: "h2", text: "Testamenti i huaj" },
      { type: "p", text: "Një testament i hartuar jashtë vendit zakonisht publikohet ose vlerësohet në Itali përmes noterit, me përkthim të betuar dhe, nëse nevojitet, legalizim. Është një nga pak hapat që kërkojnë profesionist tjetër nga ne: jua tregojmë dhe koordinojmë deklaratën me afatet e tij." },
      { type: "h2", text: "Dokumente identiteti jo italiane" },
      { type: "p", text: "Pasaportë ose kartë identiteti e huaj e vlefshme janë të mjaftueshme për dichiarazione di successione dhe kërkesën e codice fiscale. Nevojitet kopje e lexueshme, para dhe prapa; pa përkthim." },
      { type: "h2", text: "Nënshkrimet: çfarë nevojitet dhe çfarë jo" },
      {
        type: "ul",
        items: [
          "Për dichiarazione di successione dhe voltura nuk nevojitet prokurë noteriale: i transmetojmë ne si ndërmjetës, me mandatin tuaj të nënshkruar në distancë në zonën personale ose të kthyer me kopje dokumenti.",
          "Për codice fiscale mjafton delegimi në modello AA4/8, i nënshkruar nga ju.",
          "Nevojiten noteri ose konsullata italiane për heqjen dorë nga trashëgimia, pranimin me beneficio d'inventario dhe prokurën për shitjen e pasurisë.",
        ],
      },
      { type: "callout", tone: "info", title: "Së pari fotot, pastaj origjinalët", text: "Për kontrollet fillestare mjaftojnë foto ose skanime të ngarkuara në zonën personale. Origjinalët, ose kopjet me apostille dhe përkthim, i kërkojmë vetëm për dokumentet që i kërkojnë vërtet, dhe jua themi paraprakisht." },
      { type: "callout", tone: "warning", title: "Kujdes me afatet e apostille dhe përkthimeve", text: "Midis kërkesës së certifikatës, apostille dhe përkthimit të betuar mund të kalojnë javë. Nëse afati prej 12 muajsh është afër, filloni nga këto dokumente ndërsa ne përgatisim pjesën tjetër." },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "Pagimi i taksave të trashëgimisë nga jashtë vendit, pa llogari italiane",
    excerpt: "Taksat paguhen me debitim nga llogari italiane. Nëse jetoni jashtë vendit dhe nuk keni, ja tre zgjidhjet e mundshme, përfshirë pagesën përmes studios si ndërmjetës.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Për ata që jetojnë jashtë vendit, pagesa e taksave shpesh është pengesa praktike më e bezdisshme: shumat e duhura me deklaratën telematike paguhen me debitim nga llogari rrjedhëse italiane, dhe shumë emigrantë nuk kanë më llogari në Itali. Shohim cilat taksat paguhen, si dhe zgjidhjet kur mungon llogaria italiane." },
      { type: "h2", text: "Cilat taksat paguhen" },
      {
        type: "ul",
        items: [
          "Me deklaratën, nëse ka pasuri të paluajtshme: taksa ipotekore (2%) dhe kadastrale (1%) mbi vlerën kadastrale, me minimum 200 euro secila, plus pullë dhe tarifa speciale. Autolikuidohen dhe paguhen në momentin e transmetimit.",
          "Taksa e trashëgimisë vetë vetëm nëse pasuria tejkalon franqizat: 1 milione di euro për çdo fëmijë ose për bashkëshortin (4%), 100.000 euro për vëllezërit dhe motrat (6%), pa franqizë për të tjerët (6% ose 8%). Për trashëgimitë e hapura nga 2025 e llogarit kontribuesi në deklaratë dhe paguan brenda 90 ditëve nga afati i paraqitjes, ose menjëherë së bashku me pjesën tjetër.",
        ],
      },
      { type: "h2", text: "Si paguhet me deklaratën telematike" },
      { type: "p", text: "Shumat e autolikuiduara paguhen me debitim nga llogari rrjedhëse e hapur te bankë e konvencionuar me Agenzia delle Entrate ose te Poste Italiane. Llogaria mund të jetë e deklaruesit ose e subjektit të ngarkuar me transmetimin telematik, pra ndërmjetësit. Në deklaratë tregohen IBAN dhe codice fiscale i titullarit të llogarisë." },
      { type: "h2", text: "Nëse nuk keni llogari në Itali: tre zgjidhje" },
      {
        type: "ol",
        items: [
          "Një bashkëtrashëgimtar rezident në Itali paguan për të gjithë: deklarata mund të tregojë llogarinë e një trashëgimtari. Zgjidhja më e thjeshtë kur ekziston.",
          "Paguan studioja si ndërmjetës: na bëni bonifico paraprakisht për shumën e saktë të taksave, që jua komunikojmë me shkrim, dhe ne i paguajmë me debitim nga llogaria e studios në momentin e transmetimit. Merrni faturat. Është mundësi që biem dakord rast pas rasti.",
          "Modello F24 në Itali përmes deleguarit: e mundur kur deklarata paraqitet në zyrë, por rruga më e ngadaltë; e përdorim vetëm nëse dy të parat nuk janë të zbatueshme.",
        ],
      },
      { type: "callout", tone: "info", title: "Gjithçka me shkrim, paraprakisht", text: "Para transmetimit ju dërgojmë llogaritjen e taksave artikull pas artikulli. Pagani vetëm atë shumë, dhe vetëm pasi ta shihni. Taksat shkojnë te shteti, jo te ne: honorari i paketës është veç e veç." },
      { type: "h2", text: "Bonifico nga jashtë vendit dhe kursi" },
      { type: "p", text: "Taksat janë në euro. Nëse llogaria juaj është në monedhë tjetër, merrni parasysh komisionet dhe kursin e bankës: bonificot SEPA nga vendet e zonës euro dhe nga Zvicra kushtojnë pak; nga vende të tjera është mirë të verifikoni paraprakisht. Honorari i paketës, ndërkohë, paguhet në faqe me kartë përmes Stripe, nga çdo vend." },
      { type: "h2", text: "Trashëgimi të hapura para 2025" },
      { type: "p", text: "Për vdekjet deri më 31 dicembre 2024 taksën e trashëgimisë, nëse duhet, e llogarit ende Agenzia delle Entrate dhe vjen avviso di liquidazione për t'u paguar me modello F24 brenda 60 ditëve. Edhe në këtë rast, nëse nuk keni llogari italiane, mund ta menaxhojmë pagesën përmes studios." },
      { type: "callout", tone: "warning", title: "Shumat ndryshojnë", text: "Aliquotat, franqizat dhe minimumet janë ato në fuqi në datën e këtij udhëzuesi. Verifikojmë gjithmonë rastin konkret dhe burimet zyrtare para llogaritjes së taksave." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
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
