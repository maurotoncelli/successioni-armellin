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

const REVIEWED = "Vergi kısmı muhasebeciler tarafından incelendi";

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
      { type: "callout", tone: "info", title: "Her zaman gerekli değildir", text: "Bazı durumlarda beyan hiç zorunlu değildir. Bunu muafiyet rehberinde açıklıyoruz: ödeme yapmadan önce durumunuzu ücretsiz kontrol ediyoruz." },
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
          "Vefat edenin ölüm belgesi veya özeti (izin verildiğinde öz-beyan).",
          "Vefat edenin ve tüm mirasçıların kimlik belgesi ve vergi numarası (C.F.).",
          "Mirasçıların aile durumu ve akrabalık derecesinin öz-beyanı.",
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
          "Geri ödeme veya vergi tahsilatı için mirasçının IBAN'ı.",
        ],
      },
      { type: "callout", tone: "info", title: "Eksik bir şey mi var? Çoğu zaman biz temin edebiliriz", text: "Belge temini işimizin parçasıdır: kadastro kayıtları, menşe belgeleri ve eksik verileri kurum ve bankalardan biz temin ederiz." },
      { type: "callout", tone: "warning", title: "Gösterge liste", text: "Bu liste gösterge niteliğindedir ve durumunuza uyarlanır. Kesin listeyi Lorenzo somut durumunuzu kontrol ettikten sonra onaylar." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Yurt dışında yaşayan mirasçılar: işlem nasıl yürütülür",
    excerpt: "Mirasçılardan biri İtalya dışında ikamet ettiğinde ne değişir ve işlemi uzaktan, kendi dilinizde de nasıl takip ederiz.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Yurt dışında yaşayan bir mirasçı sorun değildir: veraset beyanı İtalya'daki mal varlığını ilgilendirir ve yine Agenzia delle Entrate'e sunulur. Özellikle belge ve imza toplama şekli değişir; tamamını uzaktan yönetiriz." },
      { type: "h2", text: "Gerçekten ne gerekir" },
      {
        type: "ul",
        items: [
          "Her mirasçının İtalyan vergi numarası (C.F.) (yurt dışındakiler dahil): yoksa talep edilebilir.",
          "Tüm mirasçıların kimlik belgeleri ve kişisel bilgileri.",
          "Beyanı sunan bir mirasçı olduğu ve biz onun adına ilettiğimiz için aracıya vekalet veya yetki.",
        ],
      },
      { type: "p", text: "Yurt dışı ikamet edenler istisnaen yalnızca elektronik iletim mümkün değilse kağıt model sunabilir; vakaların büyük çoğunluğunda yetkili aracı olarak biz elektronik yolla ilerleriz." },
      { type: "h2", text: "Tamamen uzaktan, kendi dilinizde de" },
      { type: "p", text: "Anket, belgeler, iletişim ve imzalar çevrimiçi yapılır: İtalya'ya dönmeniz gerekmez. E-posta veya mesajlaşmayla kendi dilinizde takip edebiliriz; gerektiğinde tercümeli görüşme ayarlanabilir. Önemli noktaları (tutarlar, süreler, belgeler) her zaman yazılı onaylarız; resmi belgeler İtalyanca kalır." },
      { type: "callout", tone: "info", title: "Saat dilimi ve mesafe önemli değil", text: "Belgeleri kişisel alanınızdan istediğiniz zaman yükleyin, telefon fotoğrafıyla bile. Kontrol etmeyi ve süreler içinde işlemi tamamlamayı biz üstleniriz." },
    ],
    sources: [FONTE_ADE_SCHEDA],
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
