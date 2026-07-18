import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  Turkish courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsTr({
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
    `Aşağıda imzası bulunan ${signerName} (bundan sonra "Müşteri"), ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, P.IVA ${studio.piva ?? ""}, C.F. ${
      studio.cf ?? ""
    }, kayıtlı olduğu ${
      studio.albo ?? "meslek odası"
    }, PEC ${pec}, e-posta ${email} (bundan sonra "Profesyonel") kişisine, ${practiceCode} dosyasıyla ilgili aşağıdaki mesleki görevi vermektedir.`,

    "1. KONU. Görev, veraset beyannamesinin hazırlanmasına yardım ve bunun Agenzia delle Entrate'ye elektronik olarak iletilmesini kapsar; Profesyonel bunu yetkili Entratel aracısı sıfatıyla yapar. Ayrıca satın alınan pakette öngörülen bağlı işlemler (ör. kadastro/tapu devirleri — volture) dahildir. Pakete dahil olmayan faaliyetler hariçtir ve ayrı bir ön teklife konu olabilir.",

    '2. ÜCRET. Ücret, satın alınan paketin ücretidir; kişisel alandaki "Satın alımınız" bölümünde gösterilir ve siparişte zaten ödenmiştir. Devlete ödenen vergi ve harçlar (veraset vergisi, ipotek vergisi, kadastro vergisi, pullar, özel harçlar) ücrete DAHİL DEĞİLDİR: somut duruma göre hesaplanır, beyanname gönderilmeden önce Müşteriye bildirilir ve Profesyonel tarafından herhangi bir zam olmaksızın Müşteri tarafından ödenir.',

    "3. MÜŞTERİ YÜKÜMLÜLÜKLERİ. Müşteri doğru, eksiksiz ve zamanında veri ve belgeler sağlamayı taahhüt eder ve bunların doğruluğundan sorumludur. Teslim süreleri, gerekli belgelerin tamamlandığı ve Profesyonel tarafından doğrulandığı andan itibaren işlemeye başlar; üçüncü taraf sürelerini (Agenzia delle Entrate, Kadastro, bankalar) kapsamaz.",

    "4. ÖZEN VE SORUMLULUK. Profesyonel görevi, faaliyetin niteliğinin gerektirdiği mesleki özenle (araç yükümlülüğü) yerine getirir; vergi denetimi bir yeminli mali müşavir tarafından sağlanır. Bu vekâlette düzenlenmeyen hususlarda, satın alma sırasında kabul edilen satış koşulları uygulanır; bunlar sorumluluk sınırlamaları, paket değişikliği ve mahsup hükümlerini içerir.",

    "5. CAYMA. Tüketici Kanunu md. 52–59 uyarınca cayma hakkı, satış koşulları ve sitedeki Cayma sayfasında belirtilen şekilde saklıdır. Çalışma başladıktan sonra cayma halinde Müşteri, hâlihazırda sunulan hizmetle orantılı bir tutarı öder.",

    "6. KİŞİSEL VERİLER. Müşterinin ve dosyada yer alan kişilerin (müteveffa ve diğer mirasçılar dahil) kişisel verilerinin işlenmesi, sitedeki Gizlilik bilgilendirmesinde açıklanmıştır; Müşteri bunu okuduğunu beyan eder. Müşteri, üçüncü kişilere ait verileri iletmeye yetkili olduğunu garanti eder.",

    "7. VERİLİŞ VE İMZA. Bu vekâlet uzaktan verilir. İmza, Müşterinin seçimine göre elektronik olarak (kişisel alanda kabul kutusunun ve imza düğmesinin seçilmesi, tarih ve saatin kaydıyla) veya indirilen belgenin el yazısıyla imzalanıp imzalı kopyanın yüklenmesiyle gerçekleşir.",

    "(Bu vekâletin İtalyanca sürümü hukuken bağlayıcıdır. Her türlü çeviri yalnızca kolaylık içindir; uyuşmazlık halinde İtalyanca metin geçerlidir.)",
  ];
}

export function buildMandatoTextTr(params: MandatoParams): string {
  return (
    `Mesleki vekâlet — Dosya ${params.practiceCode}\n\n` +
    buildMandatoParagraphsTr(params).join("\n\n") +
    `\n\nYer ve tarih: _________________________\n\nMüşteri imzası: _________________________\n`
  );
}
