import type { ArticleBlock, ArticleSource } from "./articles";

/*
  Turkish courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleTrOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Veraset beyanı",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - Vergiler nasıl ödenir",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS Kanun Hükmünde Kararname 346/1990",
  href: "https://www.normattiva.it",
};
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - Beyan nasıl ve ne zaman sunulur",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Codice fiscale talebi (modello AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/modello-aa4-8-cf-pf",
};
const FONTE_UE_650: ArticleSource = {
  label: "(AB) 650/2012 sayılı Tüzük - Sınır ötesi verasetler",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "(AB) 2016/1191 Tüzüğü - Legalizasyon olmadan resmi belgeler",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "İtalya Dışişleri Bakanlığı - Yurt dışındaki İtalyanlar için konsolosluk hizmetleri",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
};

export const articlesTr: Record<string, ArticleTrOverlay> = {
  "successione-cosa-e": {
    title: "Veraset: nedir ve ne zaman sunulmalıdır",
    excerpt: "Bildirimin ne olduğunu, kimin yapması gerektiğini, süreleri ve sunulmamasının risklerini anlamak için net bir rehber.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Veraset beyanı, vefat eden kişinin (de cuius) bıraktığı mal varlığının ve mirasçılara devredilen kısmının Agenzia delle Entrate'e bildirildiği vergi yükümlülüğüdür. Mirasın kabulü değildir ve noter işlemi de değildir: mirasın aktif varlıklarını beyan etmeye, ödenmesi gereken vergileri tahsil etmeye ve taşınmaz varsa Kadastro'da devir (voltura) işlemini güncellemeye yarar." },
      { type: "h2", text: "Kim sunmalıdır" },
      { type: "p", text: "Mirasçılar, mirasa çağrılanlar ve vasiyet lehtarları (veya yasal temsilcileri) ile birlikte yöneticiler, hareketsiz mirasın kayyımları, vasiyet icra memurları ve trustee'ler yükümlüdür." },
      {
        type: "ul",
        items: [
          "Yükümlülerden yalnızca birinin sunması yeterlidir: beyan herkes için geçerlidir.",
          "Entratel yetkili bir aracı (yetkili bir Geom. gibi) tarafından iletilebilir: bunu biz yapıyoruz.",
        ],
      },
      { type: "h2", text: "Ne zamana kadar sunulmalıdır" },
      { type: "p", text: "Olağan süre, verasetin açıldığı tarihten itibaren 12 aydır; bu genellikle vefat tarihiyle aynıdır (TUS md. 31). Özel hallerde (hareketsiz miras, envanter menfaatiyle kabul, kayyım atanması) süre, kişinin yasal olarak hareket edebilir hale geldiği andan başlar." },
      { type: "callout", tone: "warning", title: "Sürelere dikkat", text: "Geç sunmak ceza ve faiz doğurabilir. 12 aylık süre yaklaştıysa hemen harekete geçmek en iyisidir: doğru sürelerde biz ilgileniyoruz." },
      { type: "h2", text: "Bugün nasıl sunulur" },
      { type: "p", text: "Beyan, Agenzia delle Entrate yazılımıyla elektronik olarak iletilir. Oluşturulan dosya (.SUC uzantılı) yetkili mükellef tarafından veya çoğu zaman Entratel yetkili bir aracı tarafından doğrudan gönderilir. Eski kağıt Model 4 yalnızca kalıntı haller için geçerlidir (3 Ekim 2006'dan önceki vefatlar veya elektronik iletim mümkün olmayan yurt dışındaki ikamet edenler)." },
      { type: "h2", text: "Yapmazsanız (veya hata yaparsanız) ne risk alırsınız" },
      { type: "p", text: "Sunulmaması, ödenmesi gereken vergiyle orantılı bir cezayı ve faizi doğurur; geç veya hatalı sunum ise duruma göre indirilmiş veya orantılı cezalara yol açar. Tutarlar zamanla değişir: resmi kaynaklardan ve uzmanla birlikte doğrulanmalıdır." },
      { type: "callout", tone: "info", title: "Her zaman gerekli değildir", text: "Bazı durumlarda beyan hiç zorunlu değildir. Bunu muafiyet rehberinde açıklıyoruz: durumunuzu ücretsiz kontrol ediyoruz." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "Veraset zorunlu OLMADIĞI durumlar",
    excerpt: "Kanunun öngördüğü muafiyet: birlikte geçerli olması gereken üç koşul ve tek bir taşınmazın yükümlülüğü nasıl tetiklediği.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Veraset beyanı her zaman zorunlu değildir. Kanun (TUS md. 28, f. 7) EŞ ZAMANLI üç koşul bir arada gerçekleştiğinde muafiyet öngörür. Tek bir koşul bile eksikse yükümlülük yeniden doğar." },
      { type: "h2", text: "Muafiyetin üç koşulu" },
      {
        type: "ol",
        items: [
          "Miras eşe ve/veya düz hattaki akrabalara (çocuklar, ebeveynler) intikal eder.",
          "Mirasın aktif varlığı 100.000 avroyu aşmaz.",
          "Miras taşınmaz veya taşınmaza ilişkin ayni hakları kapsamaz.",
        ],
      },
      { type: "callout", tone: "warning", title: "Tek taşınmaz yeter", text: "Değeri ne kadar düşük olursa olsun tek bir taşınmaz bile toplam değerden bağımsız olarak yükümlülüğü tetikler. Ev, arsa veya garaj varlığı her şeyi değiştirir." },
      { type: "h2", text: "Diğer zorunluluk olmama halleri" },
      { type: "p", text: "Muafiyet veya zorunluluk olmama için ek haller vardır; örneğin 12 aylık süre dolmadan mirasın reddi (TUS md. 28, f. 5). Koşullar sonradan da ortadan kalkabilir: bu nedenle değerlendirme her zaman somut olaya göre yapılır." },
      { type: "callout", tone: "info", title: "Size ücretsiz söylüyoruz", text: "Durumunuzda veraset gerekli olmayabileceği anlaşılırsa gereksiz bir hizmet satmayız: size söyleriz. Kesin değerlendirme somut olaya bağlıdır." },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "Veraset vergisi ne kadar ödenir",
    excerpt: "Muafiyetler, oranlar ve 2025 öz-beyanı: vergiler nasıl işler, kim öder ve doğrudan mirasçılar için neden çoğu zaman sıfırdır.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Önemli bir ön not: hizmetimizin fiyatı (ücret) bir şey, vergiler başka bir şeydir. Vergiler mirasçıya aittir, ücretten ayrıdır ve gönderimden ÖNCE hesaplayıp bildiririz." },
      { type: "h2", text: "Veraset vergisi: oranlar ve muafiyetler" },
      { type: "p", text: "Veraset vergisi yalnızca muafiyeti aşan değere uygulanır; muafiyet vefat edenle akrabalık derecesine bağlıdır." },
      {
        type: "table",
        headers: ["Lehtar", "Oran", "Muafiyet (lehtar başına)"],
        rows: [
          ["Eş ve düz hattaki akrabalar (çocuklar, ebeveynler)", "4%", "1.000.000 EUR"],
          ["Kardeşler", "6%", "100.000 EUR"],
          ["4. dereceye kadar diğer akrabalar ve kayın hısımları (kanuni sınırlar içinde)", "6%", "nessuna"],
          ["Diğer kişiler (yabancılar)", "8%", "nessuna"],
          ["Ağır engelli kişiler (L. 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "Doğrudan mirasçılar için çoğu zaman sıfır", text: "Eş ve çocuklarla muafiyet kişi başına 1.000.000 avrodur: bu nedenle aile verasetlerinin çoğunda asıl veraset vergisi sıfırdır." },
      { type: "h2", text: "İpotek ve kadastro vergileri (yalnızca taşınmaz varsa)" },
      { type: "p", text: "Taşınmaz olduğunda ipotek vergisi (kadastro değerinin %2'si, asgari 200 avro) ve kadastro vergisi (kadastro değerinin %1'i, asgari 200 avro) ödenir. Bir mirasçı için ilk konut indirimiyle her ikisi de sabit 200 avroya iner. Damga, ipotek harçları ve sabit tutarlı özel kadastro vergileri eklenir." },
      { type: "h2", text: "2025 öz-beyanı: ne değişti" },
      { type: "p", text: "1 Ocak 2025'ten itibaren açılan verasetlerde veraset vergisi mükellef tarafından doğrudan beyanda öz-beyan edilir (artık resen tahakkuk değil). Ödeme, sunum süresinin bittiği tarihten itibaren 90 gün içinde F24 ile yapılır." },
      {
        type: "ul",
        items: [
          "Tutar en az 1.000 avro ise taksit kabul edilir: asgari %20 peşinat ve bakiye 8 üç aylık taksitte (20.000 avronun üzerinde 12 taksite kadar), faizli.",
          "2025'ten önce açılan verasetlerde resen tahakkuk ve tebliğden itibaren 60 gün içinde ödeme geçerlidir.",
        ],
      },
      { type: "h2", text: "Somut bir örnek (anonim gerçek vaka)" },
      { type: "p", text: "Eş ve 2 çocuklu aile, yaklaşık 117.000 avroluk miras (taşınmaz, menkul kıymet ve likidite), ilk konut ve kadastro devri. Toplam vergiler yaklaşık 1.200 avro (ipotek, kadastro, damga ve harçlar); veraset vergisi sıfır çünkü doğrudan mirasçılar muafiyetin çok altındaydı. Hizmet ücreti ayrıdır." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "Verasette ilk konut indirimi: nasıl işler",
    excerpt: "Yüzde yerine sabit vergiler ne zaman uygulanır, kim talep edebilir ve menfaati kaybetmemek için ne gerekir.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Verasette en az bir mirasçı için ilk konut indiriminden yararlanabilecek taşınmaz olduğunda ipotek ve kadastro vergileri yüzde olarak değil sabit tutarla ödenir: her biri 200 avro, kadastro değerinin %2 ve %1'i yerine. Belirli değerdeki taşınmazlarda tasarruf önemlidir." },
      { type: "h2", text: "Kim yararlanabilir" },
      { type: "p", text: "Menfaat, en az bir mirasçının kanunun ilk konut için öngördüğü koşulları taşımasını gerektirir (kısaca: aynı belediyede başka taşınmaz üzerinde hak sahibi olmamak ve indirimi başka yerde kullanmamış olmak, taşınmazın bulunduğu belediyede kanuni süreler içinde ikamet). Koşulları tek bir mirasçının karşılaması indirimin taşınmaza uygulanması için yeterlidir." },
      { type: "callout", tone: "warning", title: "Koşullar doğrulanmalıdır", text: "İndirim modelin EH bölümünde beyan edilir ve doğru işaretlenmelidir. Koşullar yoksa veya ortadan kalkarsa menfaat kaybedilir, vergi ve ceza geri alınır: önceden teknik kontrol daha iyidir." },
      { type: "h2", text: "Biz ne kontrol ediyoruz" },
      { type: "p", text: "Geom. olarak bizim görevimiz tam da kadastro kontrolüdür: parseller, bağımsız bölümler, kategori, gelir ve menşe belgeleri. Verilerin doğru olduğunu ve ilk konutun doğru beyan edildiğini kontrol ederiz; indirim geçerli kalır, sürpriz olmaz." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "Veraset için belgeler: tam liste",
    excerpt: "Tipik tüm belgeler ve duruma göre nasıl temin edilir. Hepsi her zaman gerekmez: durumunuza bağlıdır.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Veraset beyanı için belgeler olaya göre değişir: hepsi bir arada asla gerekmez. Aşağıda en yaygın olanlar duruma göre gruplandırılmıştır. Eksik bir şey varsa çoğu zaman biz temin edebiliriz (tapu kayıtları, menşe belgeleri, eksik veriler)." },
      { type: "h2", text: "Her zaman gerekli belgeler" },
      {
        type: "ul",
        items: [
          "Vefat edenin ölüm belgesi veya özeti.",
          "Vefat edenin ve mirasçıların kimlik belgesi; mirasçıların vergi numarası (C.F.).",
          "Mirasçıların aile durumu ve akrabalık derecesinin öz-beyanı.",
          "Mirasçının IBAN'ı (her zaman gerekli, geri ödeme veya vergi tahsilatı için).",
        ],
      },
      { type: "h2", text: "Taşınmaz varsa" },
      {
        type: "ul",
        items: [
          "Verastaki taşınmazların kadastro kayıtları (biz temin edebiliriz).",
          "Menşe belgeleri: noter senetleri, bağışlar veya önceki veraset beyanları.",
          "Kadastro kontrolü için gerektiğinde kat planları.",
        ],
      },
      { type: "h2", text: "Vasiyetname veya özel mirasçılar varsa" },
      {
        type: "ul",
        items: [
          "Yayınlanmış vasiyetnamenin ve varsa yayın tutanağının kopyası.",
          "Reşit olmayan veya ehliyetsiz mirasçılar varsa Vesayet Hakimi izni.",
        ],
      },
      { type: "h2", text: "Hesap ve yatırımlar varsa" },
      {
        type: "ul",
        items: [
          "Vefat tarihindeki hesap, cüzdan ve menkul kıymet bakiye ve mevduat belgesi.",
        ],
      },
      { type: "callout", tone: "info", title: "Eksik bir şey mi var? Çoğu zaman biz temin edebiliriz", text: "Belge temini işimizin parçasıdır: kadastro kayıtları, menşe belgeleri ve eksik verileri kurum ve bankalardan biz temin ederiz." },
      { type: "callout", tone: "warning", title: "Gösterge liste", text: "Bu liste gösterge niteliğindedir ve durumunuza uyarlanır. Kesin listeyi Lorenzo somut durumunuzu kontrol ettikten sonra onaylar." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Yurt dışında yaşıyorsanız İtalya'da veraset: eksiksiz rehber",
    excerpt: "Almanya, İsviçre, Birleşik Krallık, Arjantin veya başka bir yerde yaşıyorsanız ve İtalya'da ev veya hesap miras aldınız mı? Gerçekte ne değişir, ne gerekir ve İtalya'ya dönmeden her şey nasıl yapılır.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Yurt dışında yaşıyorsanız ve İtalya'da ebeveynlerinizin evi, bir arsa veya hesap kaldıysa, dichiarazione di successione (veraset beyanı) yine de İtalya'da, vefat tarihinden itibaren 12 ay içinde sunulmalıdır. İtalya'ya gelmeniz gerekmez: beyan telematik olarak yetkili bir aracı tarafından iletilir, yani biz. Hizmetimiz ofise gelemeyenler için online kuruldu; yurt dışında yaşayanlar için bu en çok önem taşır." },
      { type: "h2", text: "İki tipik durum" },
      {
        type: "ul",
        items: [
          "Vefat eden İtalya'da yaşıyordu, bir veya daha fazla mirasçı yurt dışında: işlem olağandır, yalnızca belge ve imza toplama şekli değişir.",
          "Vefat eden yurt dışında yaşıyordu ve İtalya'da mal varlığı vardı: beyan yine de İtalya'da sunulur; yetkili ofis, vergiler ve uygulanacak hukuk konusunda ek kurallar vardır. Bunu ayrı bir rehberde anlatıyoruz.",
        ],
      },
      { type: "h2", text: "İtalya'da yaşamaya kıyasla ne değişir" },
      {
        type: "ul",
        items: [
          "Codice fiscale (İtalyan vergi numarası): her mirasçının olmalıdır, İtalya'da hiç yaşamamış olsa bile. Olmadan beyan iletilemez. Konsoloslukta alınabilir veya daha hızlı olarak bize vekalet vererek İtalya'da.",
          "Yabancı belgeler: yurt dışında düzenlenen ölüm belgesi veya vasiyetname apostille veya legalizasyon ve tercüme gerektirebilir. Avrupa Birliği içinde kurallar daha basittir.",
          "İmzalar: beyanı uzaktan imzalanmış vekaletinizle biz iletiriz. Yalnızca beyan için noter vekaleti gerekmez.",
          "Vergi ödemesi: İtalyan banka hesabından tahsilatla yapılır. Yoksa çözümler vardır; aracı olarak ofis hesabından tahsilat dahil.",
          "Saat dilimi ve dil: yazılı çalışırız, WhatsApp ve e-posta ile; uygun olduğunuzda yanıtlayın. Site ve iletişim birkaç dilde mevcuttur.",
        ],
      },
      { type: "h2", text: "Nasıl işler: beş adım" },
      {
        type: "ol",
        items: [
          "Online anketi doldurursunuz: iki dakika, hangi pakete ihtiyacınız olduğunu ve ne kadar tuttuğunu hemen öğrenirsiniz.",
          "WhatsApp'tan yazarsınız veya doğrudan ödersiniz. Durumunuza özel belge listesiyle kişisel alanınızı açarız.",
          "Belgeleri istediğiniz zaman yüklersiniz, telefon fotoğrafıyla bile. Kadastro verilerini, menşe belgelerini ve codice fiscale'leri kontrol ederiz; eksik varsa çoğu zaman İtalya'da biz temin ederiz.",
          "Vergileri ve tutarları yazılı onaylarız, siz vekaleti uzaktan imzalarsınız, beyanı Agenzia delle Entrate'e iletiriz.",
          "Sunum makbuzunu alırsınız; taşınmaz varsa kadastro voltura (devir). Her şey kişisel alanınızda kalır.",
        ],
      },
      { type: "callout", tone: "info", title: "İtalya'ya gelmeniz gerekmez", text: "Dichiarazione di successione'nin hiçbir aşaması fiziksel varlığınızı gerektirmez. İtalya'da gişede yapılan codice fiscale talebi veya kadastro sorgusu gibi işlemleri vekaletinizle biz yaparız." },
      { type: "h2", text: "Biz somut olarak ne yaparız" },
      {
        type: "ul",
        items: [
          "Codice fiscale'i olmayan mirasçılar için vekalet ile Agenzia delle Entrate'ten talep ederiz.",
          "Taşınmazları Kadastro'da ve tapularda kontrol ederiz: uzaktan yürütülen işlemler en çok burada takılır.",
          "Yetkili aracı olarak beyanı ve kadastro voltura'sını hazırlayıp iletiriz.",
          "İtalyan hesabınız yoksa vergileri ofis aracılığıyla, tutarlar ve makbuzlar yazılı olarak kararlaştırırız.",
          "Hangi adımda noter veya konsolosluk gerektiğini ve hangisinin gerektiğini açıkça söyleriz.",
        ],
      },
      { type: "h2", text: "Noter veya konsolosluk ne zaman de gerekir" },
      { type: "p", text: "Dichiarazione di successione noter işlemi değildir ve noter gerektirmez. Mirastan feragat, beneficio d'inventario ile kabul, vasiyetname ilanı ve miras kalan taşınmazın satışı için noter veya İtalyan vatandaşları için bazı noter işlevlerini yürüten İtalyan konsolosluğu gerekir. Durumunuz bunları gerektiriyorsa baştan söyleriz, sonra değil." },
      { type: "h2", text: "Ne kadar tutar" },
      { type: "p", text: "Paketler İtalya'da yaşayanlarla aynıdır ve Tarifeler sayfasında görünür: ücret geometra, beyan ve voltura'yı kapsar. Kanuni vergiler herkes için ayrıdır ve iletimden önce bildiririz. Codice fiscale veya tercüme gibi ek adımlar gerekiyorsa hemen, tutarla birlikte söyleriz." },
      { type: "callout", tone: "warning", title: "12 ay sizin için de geçerli", text: "Süre vefat tarihinden işler, siz ilgilenmeye başladığınız andan değil. Yakınsa hemen yazın: yurt dışında yaşayanlar için en uzun kısım çoğu zaman codice fiscale'dir." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "Yurt dışında yaşayan mirasçı için codice fiscale: nasıl alınır",
    excerpt: "Her mirasçının codice fiscale'i olmadan beyan iletilemez. Kimin farkında olmadan zaten vardır; konsoloslukta veya vekalet ile İtalya'da nasıl talep edilir; ne gerekir.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "İtalyan codice fiscale (vergi numarası), yurt dışındaki mirasçıları olan verasetlerde en sık tıkanan noktadır: elektronik beyan her mirasçı ve legatario için ister; olmadan iletilmez. İyi haber: almak sandığınızdan kolaydır ve İtalya'ya gelmek gerekmez." },
      { type: "h2", text: "Belki zaten vardır" },
      { type: "p", text: "İtalya'da doğan, çalışan veya okuyan, eski tessera sanitaria'sı olan veya AIRE (yurt dışındaki İtalyanlar kaydı) kayıtlı olanların çoğunun codice fiscale'i vardır, yıllardır kullanmasa bile. Eski belgeleri, tessera sanitaria'yı veya vergi beyanını kontrol edin. Bulamazsanız kişisel verilerinizle biz var olup olmadığını kontrol edebiliriz: codice fiscale iki kez talep edilmez." },
      { type: "h2", text: "Eksikse nasıl alınır" },
      {
        type: "ol",
        items: [
          "Yaşadığınız ülkenin İtalyan konsolosluğunda: yurt dışı ikamet eden vatandaşlar için olağan yol. Geçerli kimlikle modello AA4/8 sunulur. Süre konsolosluğa bağlıdır ve uzun olabilir.",
          "İtalya'da, Agenzia delle Entrate'in herhangi bir ofisinde, vekil aracılığıyla: modello AA4/8'i siz imzalarsınız, vekalet bölümü doldurulur; vekil kendi kimliği ve sizin kopyanızla sunar. Bizim kullandığımız yol budur, genelde en hızlısıdır.",
        ],
      },
      { type: "callout", tone: "info", title: "Vekaletinizle biz yaparız", text: "Önceden doldurulmuş modello AA4/8'i göndeririz, imzalarsınız ve kimlik kopyanızla iade edersiniz. Agenzia delle Entrate'e sunarız ve codice fiscale atanır atanmaz bildiririz." },
      { type: "h2", text: "Ne gerekir" },
      {
        type: "ul",
        items: [
          "Geçerli pasaport veya kimlik kartı (okunaklı kopya, ön ve arka).",
          "Tam kişisel bilgiler: soyad, ad, cinsiyet, doğum tarihi ve yeri, yurt dışı ikamet adresi.",
          "Talep nedeni: İtalya'daki veraset. Modello AA4/8'de belirtilmelidir.",
          "İmzalı modello AA4/8; biz sunuyorsak doldurulmuş vekalet bölümüyle.",
        ],
      },
      { type: "h2", text: "İtalyan vatandaşı olmayan mirasçılar" },
      { type: "p", text: "Aynı prosedür geçerlidir: modello AA4/8 gerekçeli olarak vekil aracılığıyla herhangi bir Agenzia delle Entrate ofisine sunulabilir. Yabancı vatandaşlar için İtalyan konsolosluğu yalnızca özel hallerde devreye girer; bu yüzden İtalya'daki vekalet neredeyse her zaman en basit yoldur." },
      { type: "callout", tone: "warning", title: "Süre yakınsa buradan başlayın", text: "Codice fiscale tüm işlemde en az öngörülebilir süreye sahip adımdır. Vefat birkaç ay önce olduysa hemen talep edin: beyanın geri kalanı paralel hazırlanır." },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "Vefat eden yurt dışında yaşıyordu ve İtalya'da mal varlığı vardı: ne yapmalı",
    excerpt: "Vefat yurt dışında olsa bile beyan İtalya'da sunulur: hangi ofis, hangi mal varlıkları vergilendirilir, AB veraset tüzüğü ne der ve noter ne zaman gerekir.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Göçmen ailelerin klasik durumu: ebeveyn yıllarca Almanya, İsviçre veya Arjantin'de yaşadı ama İtalya'da köy evi veya kirada daire bıraktı. İtalya'da mal varlığı varsa dichiarazione di successione, vefat yurt dışında olsa ve tüm mirasçılar yurt dışında olsa bile, vefat tarihinden itibaren 12 ay içinde İtalya'da sunulmalıdır." },
      { type: "h2", text: "Hangi mal varlıkları vergilendirilir" },
      { type: "p", text: "Kural TUS'ta (md. 2). Vefat anında vefat eden İtalya'da ikamet ediyorsa vergi nerede olursa olsun tüm mal varlığına uygulanır. İtalya'da ikamet etmiyorsa yalnızca İtalya'daki mal varlığı: taşınmaz, İtalyan bankalardaki hesaplar, İtalyan şirketlerdeki paylar. Yurt dışındaki mal varlığı bulunduğu ülkenin kurallarına tabidir." },
      { type: "callout", tone: "info", title: "Çifte vergilendirme", text: "İtalya'nın veraset konusunda çifte vergilendirmeyi önleyen anlaşmaları az sayıda ülkeyle vardır; Fransa, Birleşik Krallık ve ABD dahil. Diğerlerinde İtalya'daki İtalyan mal varlığına ödedikleriniz ikamet ülkenizdeki beyanla koordine edilmelidir: yerel danışmanla görüşmek iyi olur." },
      { type: "h2", text: "Hangi ofis yetkilidir" },
      { type: "p", text: "Vefat eden yurt dışına taşınmadan önce İtalya'da ikamet etmişse yetkili ofis son İtalyan ikametindeki Agenzia delle Entrate ofisidir. Hiç İtalya'da ikamet etmemişse veya son ikamet bilinmiyorsa Agenzia'nın belirlediği Roma ofisi yetkilidir. Elektronik sunumda bu ayrıntıyı beyan hazırlığında biz yönetiriz." },
      { type: "h2", text: "Nasıl sunulur" },
      { type: "p", text: "Yetkili aracı aracılığıyla elektronik olarak, İtalya'da yaşayanlar gibi: belgeleri ve imzaları uzaktan toplar ve biz iletiriz. Kanun yurt dışı ikamet edenlere yalnızca elektronik iletim imkansızsa kağıt modeli taahhütlü postayla göndermeye izin verir: pratikte neredeyse hiç gerekmediği bir istisnadır." },
      { type: "h2", text: "Kim miras alır: uygulanacak hukuk" },
      { type: "p", text: "Vergi tarafı ile medeni taraf farklı şeylerdir. Mirasçıların kim olduğu ve hangi paylarla miras aldığı verasete uygulanacak hukukla belirlenir. AB'de Regolamento 650/2012 geçerlidir: 17 agosto 2015'ten itibaren vefatlarda vefat edenin olağan ikametgahı ülkesinin hukuku uygulanır, vasiyette vatandaşlık ülkesi hukuku seçilmedikçe. Almanya'da ikamet eden İtalyan, vasiyetsiz Alman hukukuna göre miras alır; İtalya'daki ev dahil. Birleşik Krallık, İrlanda ve Danimarka tüzüğü uygulamaz; AB dışı ülkelerde İtalyan uluslararası özel hukuk kuralları geçerlidir." },
      { type: "callout", tone: "warning", title: "Bizim işimizin bittiği yer", text: "İtalya'daki mal varlığı için beyanı ve voltura'yı hazırlayıp iletiriz. Veraset yabancı hukuka tabiyse, yabancı vasiyetname geçerli kılınacaksa veya Avrupa veraset belgesi alınacaksa noter veya avukat da gerekir: baştan, isimler ve adımlarla söyleriz, işin ortasında değil." },
      { type: "h2", text: "Ek belgeler" },
      {
        type: "ul",
        items: [
          "Yurt dışında düzenlenen ölüm belgesi: vefat eden İtalyan vatandaşıysa kayıt konsolosluk aracılığıyla İtalyan belediyesine işlenir ve İtalyan belge verilir. Değilse yabancı belge, AB sadeleştirmeleri saklı, apostille veya legalizasyon ve tercüme ile.",
          "Vefat edenin yurt dışı ikametinin kanıtı, örneğin AIRE kaydı veya yabancı ülke ikamet belgesi.",
          "Vefat edenin ve tüm mirasçıların codice fiscale'i: İtalyan olmayan mirasçılar da sahip olmalıdır.",
          "Varsa vasiyetname, ilanı veya Avrupa veraset belgesi ile.",
        ],
      },
      { type: "h2", text: "Prima casa indirimi" },
      { type: "p", text: "Miras kalan taşınmazda ipotek ve kadastro vergileri prima casa indirimiyle düşürülebilir; yurt dışında yaşayanlar için kurallar özeldir ve 2023'te değişti: taşınmazın yeri ve mirasçının İtalya ile bağlantısına bağlıdır. Vergileri hesaplamadan önce duruma göre kontrol ederiz." },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "Yurt dışından belgeler: apostille, tercümeler ve uzaktan imzalar",
    excerpt: "Yabancı ölüm belgesi, yabancı vasiyetname, İtalyan olmayan kimlik belgeleri: apostille, legalizasyon veya yeminli tercüme ne zaman gerekir ve İtalya'ya gelmeden her şey nasıl imzalanır.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Mirasçı veya vefat eden yurt dışında olan verasette neredeyse tüm belgeler İtalyan işlemle aynıdır. Başka ülkeden gelebilecekler az ama hassastır: vefat yurt dışındaysa ölüm belgesi, yabancı vasiyetname, mirasçı kimlik belgeleri ve bazen medeni hal belgeleri. Agenzia delle Entrate ve Kadastro'nun kabul etmesi için gerçekten ne gerekir." },
      { type: "h2", text: "Ülkeye göre üç kural" },
      {
        type: "table",
        headers: ["Düzenleyen ülke", "Legalizasyon", "Tercüme"],
        rows: [
          ["Avrupa Birliği", "Gerekmez: Regolamento 2016/1191 medeni hal belgelerinde apostille ve legalizasyonu kaldırır", "Belgeyle birlikte çok dilli standart form istenerek kaçınılabilir"],
          ["1961 Lahey Sözleşmesi ülkeleri (ör. Birleşik Krallık, ABD, İsviçre, Arjantin, Brezilya, Avustralya)", "Apostille, belgeyi düzenleyen ülkenin makamı tarafından", "İtalya'da yeminli tercüme veya İtalyan konsolosluğu onaylı"],
          ["Diğer ülkeler", "Düzenleyen ülkedeki İtalyan konsolosluğunda legalizasyon", "İtalya'da yeminli tercüme veya İtalyan konsolosluğu onaylı"],
        ],
      },
      { type: "h2", text: "Ölüm belgesi" },
      { type: "p", text: "Vefat eden İtalyan vatandaşıysa ve yurt dışında vefat ettiyse en basit yol ölüm kaydının konsolosluk aracılığıyla İtalyan belediyesine işlenmesidir: o andan itibaren belgeyi belediye İtalyanca verir; apostille ve tercüme gerekmez. İtalyan değilse tablodaki kurallarla yabancı belge kullanılır." },
      { type: "h2", text: "Yabancı vasiyetname" },
      { type: "p", text: "Yurt dışında düzenlenen vasiyetname genelde noter aracılığıyla İtalya'da ilan edilir veya geçerli kılınır; yeminli tercüme ve gerekiyorsa legalizasyon ile. Bizden farklı profesyonel gerektiren az adımdan biridir: hemen yönlendiririz ve beyanı onların süreleriyle koordine ederiz." },
      { type: "h2", text: "İtalyan olmayan kimlik belgeleri" },
      { type: "p", text: "Geçerli yabancı pasaport veya kimlik kartı dichiarazione di successione ve codice fiscale talebi için uygundur. Okunaklı kopya, ön ve arka yeterlidir; tercüme gerekmez." },
      { type: "h2", text: "İmzalar: ne gerekir, ne gerekmez" },
      {
        type: "ul",
        items: [
          "Dichiarazione di successione ve voltura için noter vekaleti gerekmez: aracı olarak kişisel alanda veya kimlik kopyasıyla imzalanmış vekaletinizle iletiriz.",
          "Codice fiscale için modello AA4/8'deki vekalet, sizin imzanızla yeterlidir.",
          "Mirastan feragat, beneficio d'inventario ile kabul ve taşınmaz satış vekaleti için noter veya İtalyan konsolosluğu gerekir.",
        ],
      },
      { type: "callout", tone: "info", title: "Önce fotoğraflar, sonra orijinaller", text: "İlk kontroller için kişisel alana yüklenen fotoğraf veya taramalar yeterlidir. Orijinaller veya apostille ve tercümeli kopyalar yalnızca gerçekten gereken belgeler için istenir; önceden söyleriz." },
      { type: "callout", tone: "warning", title: "Apostille ve tercüme sürelerine dikkat", text: "Belge talebi, apostille ve yeminli tercüme arasında haftalar geçebilir. 12 aylık süre yakınsa bu belgelerle başlayın; biz geri kalanı hazırlarken." },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "İtalyan veraset vergilerini yurt dışından, İtalyan hesap olmadan ödemek",
    excerpt: "Vergiler İtalyan hesaptan tahsilatla ödenir. Yurt dışında yaşıyorsanız ve hesabınız yoksa üç olası çözüm; aracı olarak ofis üzerinden ödeme dahil.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Yurt dışında yaşayanlar için vergi ödemesi sık sık en can sıkıcı pratik engeldir: elektronik beyanla ödenmesi gereken tutarlar İtalyan vadesiz hesaptan tahsil edilir; birçok göçmenin artık hesabı yoktur. Hangi vergiler ödenir, nasıl ve İtalyan hesap yoksa çözümler." },
      { type: "h2", text: "Hangi vergiler ödenir" },
      {
        type: "ul",
        items: [
          "Beyanla birlikte taşınmaz varsa: ipotek vergisi (%2) ve kadastro vergisi (%1) kadastro değeri üzerinden, her biri için minimum 200 euro, artı damga vergisi ve özel harçlar. Kendi kendine hesaplanır ve iletim anında ödenir.",
          "Asıl veraset vergisi yalnızca mal varlığı muafiyetleri aşarsa: her çocuk veya eş için 1 milione di euro (%4), kardeşler için 100.000 euro (%6), diğerleri için muafiyet yok (%6 veya %8). 2025'ten itibaren açılan verasetlerde vergi mükellefi beyanda hesaplar; sunum süresinden itibaren 90 gün içinde veya hemen geri kalanla birlikte öder.",
        ],
      },
      { type: "h2", text: "Elektronik beyanla ödeme nasıl yapılır" },
      { type: "p", text: "Kendi kendine hesaplanan tutarlar Agenzia delle Entrate ile anlaşmalı bankada veya Poste Italiane'de açılmış vadesiz hesaptan tahsil edilir. Hesap beyan sahibine veya elektronik iletimden sorumlu kişiye, yani aracıya ait olabilir. Beyanda IBAN ve hesap sahibinin codice fiscale'i belirtilir." },
      { type: "h2", text: "İtalyan hesabınız yoksa: üç çözüm" },
      {
        type: "ol",
        items: [
          "İtalya'da ikamet eden bir ortak mirasçı herkes için öder: beyanda mirasçılardan birinin hesabı gösterilebilir. Mümkün olduğunda en basit çözüm.",
          "Aracı olarak ofis öder: yazılı bildirdiğimiz tam vergi tutarını önceden havale edersiniz; iletim anında ofis hesabından tahsil ederiz. Makbuzları alırsınız. Duruma göre kararlaştırırız.",
          "Vekil aracılığıyla İtalya'da modello F24: beyan ofiste sunulduğunda mümkün ama en yavaş yol; ilk ikisi uygulanamazsa kullanırız.",
        ],
      },
      { type: "callout", tone: "info", title: "Her şey önceden yazılı", text: "İletimden önce vergi hesaplamasını kalem kalem göndeririz. Yalnızca o tutarı, gördükten sonra ödersiniz. Vergiler devlete gider, bize değil: paket ücreti ayrıdır." },
      { type: "h2", text: "Yurt dışından havaleler ve kur" },
      { type: "p", text: "Vergiler euro cinsindendir. Hesabınız başka para birimindeyse banka komisyonlarını ve kurunu düşünün: euro bölgesi ve İsviçre'den SEPA havaleleri ucuzdur; diğer ülkelerden önce kontrol etmek iyi olur. Paket ücreti sitede Stripe ile kartla, her ülkeden ödenir." },
      { type: "h2", text: "2025'ten önce açılan verasetler" },
      { type: "p", text: "31 dicembre 2024'e kadar vefatlarda veraset vergisi, ödenmesi gerekiyorsa, hâlâ Agenzia delle Entrate tarafından hesaplanır ve avviso di liquidazione gelir; modello F24 ile 60 gün içinde ödenir. İtalyan hesabınız yoksa ödemeyi ofis aracılığıyla biz yönetebiliriz." },
      { type: "callout", tone: "warning", title: "Tutarlar değişir", text: "Oranlar, muafiyetler ve minimumlar bu rehberin tarihinde yürürlükte olanlardır. Vergileri hesaplamadan önce somut durumu ve resmi kaynakları her zaman kontrol ederiz." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "fai-da-te-precompilata": {
    title: "Önceden doldurulmuş veraset: kendin yapmak mantıklı mı?",
    excerpt: "Agenzia sitesindeki ücretsiz beyan gerçekten var. Ne zaman mantıklı, ne zaman yetki devretmek daha iyi.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Dürüstçe hemen söyleyelim: veraset beyanını ücretsiz kendiniz yapabilirsiniz. Agenzia delle Entrate en basit haller için rehberli web süreci ve daha karmaşık olanlar için resmi yazılım sunar. Meşru bir seçenektir." },
      { type: "h2", text: "Kendin yapmak yeterli olabileceği durumlar" },
      { type: "p", text: "Durum gerçekten basitse (az sayıda doğrudan mirasçı, taşınmaz yok veya tek basit taşınmaz, kadastro verileri net ve doğru) ve SPID ile çevrimiçi süreçlere aşinaysanız önceden doldurulmuş form yeterli olabilir." },
      { type: "h2", text: "Kendin yapmanın riskli olduğu durumlar" },
      {
        type: "table",
        headers: ["Konu", "Kendin yap", "Bizimle"],
        rows: [
          ["Gereken süre", "Saatler ve SPID size ait", "Biz hallederiz"],
          ["Kadastro verilerinin kontrolü", "Sizin sorumluluğunuzda", "Bir geometra halleder"],
          ["Vergi hesaplaması", "Kendi başına", "Gönderimden önce biz yapıyoruz"],
          ["Destek", "Yok", "Gerçek bir insan"],
          ["Hatalardan dolayı ceza riski", "Sizin", "Yönetildi"],
        ],
      },
      { type: "callout", tone: "warning", title: "Zayıf nokta kadastro verileridir", text: "Önceden doldurulmuş form kadastro verilerini doğrulamaz: işlemlerin çoğu tam da orada takılır veya hata yapılır. Parseller, bağımsız bölümler, ek yapılar ve menşe belgeleri kontrol edilmelidir; bu Geom.'un işidir." },
      { type: "p", text: "Özetle: durumunuz basitse ve kendinize güveniyorsanız kendin yapmak dürüst bir seçenektir. Taşınmaz, şüphe veya az zaman varsa yetki devretmek hata ve ceza riskini kaldırır. Her durumda karar vermeden önce durumunuzu ücretsiz kontrol ederiz." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleTr(slug: string): ArticleTrOverlay | undefined {
  return articlesTr[slug];
}
