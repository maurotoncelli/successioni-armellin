import type { ArticleBlock, ArticleSource } from "./articles";

/*
  Hindi courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleHiOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "कर पक्ष की समीक्षा कर सलाहकारों ने की";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - उत्तराधिकार घोषणा",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - कर कैसे चुकाए जाते हैं",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS विधायी डिक्री 346/1990",
  href: "https://www.normattiva.it",
};

export const articlesHi: Record<string, ArticleHiOverlay> = {
  "successione-cosa-e": {
    title: "उत्तराधिकार: क्या है और कब जमा करना है",
    excerpt: "घोषणा क्या है, कौन करे, समयसीमा और न जमा करने के जोखिम — समझने के लिए स्पष्ट गाइड।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "उत्तराधिकार घोषणा वह कर अनुपालन है जिसमें Agenzia delle Entrate को मृतक (de cuius) की विरासत और उत्तराधिकारियों को हस्तांतरित संपत्ति की सूचना दी जाती है। यह विरासत स्वीकार नहीं और नोटरी अधिनियम नहीं: विरासत की संपत्ति घोषित करने, देय कर अदा करने और संपत्ति हो तो Catasto में voltura अपडेट करने के लिए।" },
      { type: "h2", text: "कौन जमा करे" },
      { type: "p", text: "उत्तराधिकारी, विरासत के लिए बुलाए गए और वसीयत लाभार्थी (या उनके कानूनी प्रतिनिधि), साथ ही प्रशासक, giacente विरासत के curator, executors और trustee बाध्य हैं।" },
      {
        type: "ul",
        items: [
          "बाध्य में से किसी एक का जमा करना पर्याप्त: घोषणा सभी के लिए मान्य।",
          "Entratel-प्राधिकृत मध्यस्थ (प्राधिकृत Geom. जैसे) भेज सकता है: हम करते हैं।",
        ],
      },
      { type: "h2", text: "कब तक जमा करें" },
      { type: "p", text: "सामान्य अवधि विरासत खुलने से 12 महीने, जो सामान्यतः मृत्यु तिथि (TUS अनु. 31)। विशेष मामलों (giacente विरासत, inventario लाभ, curator) में जब व्यक्ति कानूनी रूप से कार्य कर सके।" },
      { type: "callout", tone: "warning", title: "समय पर ध्यान", text: "देर से जमा करने पर जुर्माना और ब्याज। 12 महीने निकट हों तो तुरंत: हम सही समय में संभालते हैं।" },
      { type: "h2", text: "आज कैसे जमा होता है" },
      { type: "p", text: "घोषणा Agenzia delle Entrate सॉफ़्टवेयर से इलेक्ट्रॉनिक। .SUC फ़ाइल प्राधिकृत contribuente या अक्सर Entratel मध्यस्थ भेजता है। पुराना Model 4 केवल अवशिष्ट (3 अक्टूबर 2006 से पहले मृत्यु या इलेक्ट्रॉनिक असंभव विदेश निवासी)।" },
      { type: "h2", text: "न करें (या गलती) तो क्या जोखिम" },
      { type: "p", text: "न जमा: देय कर के अनुपात में जुर्माना और ब्याज; देर/गलत: कम या अनुपातिक जुर्माना। राशि समय के साथ बदलती: आधिकारिक स्रोत और पेशेवर से पुष्टि।" },
      { type: "callout", tone: "info", title: "हमेशा आवश्यक नहीं", text: "कुछ मामलों में घोषणा बाध्य नहीं। छूट गाइड में: भुगतान से पहले मुफ़्त जाँच।" },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "जब उत्तराधिकार बाध्य नहीं",
    excerpt: "कानूनी छूट: तीन एक साथ शर्तें और एक संपत्ति कैसे बाध्यता लाती है।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "घोषणा हमेशा बाध्य नहीं। कानून (TUS अनु. 28 § 7) तीन शर्तें एक साथ: एक भी कम — बाध्यता वापस।" },
      { type: "h2", text: "छूट की तीन शर्तें" },
      {
        type: "ol",
        items: [
          "विरासत पति/पत्नी और/या прямी रिश्तेदार (बच्चे, माता-पिता) को।",
          "विरासत संपत्ति €100,000 से अधिक नहीं।",
          "विरासत में संपत्ति या अचल अधिकार नहीं।",
        ],
      },
      { type: "callout", tone: "warning", title: "एक संपत्ति पर्याप्त", text: "मूल्य कितना भी कम, एक संपत्ति कुल मूल्य से स्वतंत्र बाध्यता। घर, भूमि या गैरेज सब बदल देता है।" },
      { type: "h2", text: "अन्य गैर-बाध्यता" },
      { type: "p", text: "अन्य छूट/गैर-बाध्यता, जैसे 12 महीने से पहले विरासत त्याग (TUS अनु. 28 § 5)। शर्तें बाद में बदल सकती: मूल्यांकन वास्तविक मामले पर।" },
      { type: "callout", tone: "info", title: "मुफ़्त बताते हैं", text: "यदि विरासत शायद न देय, अनावश्यक सेवा नहीं बेचते: बताते हैं। अंतिम पुष्टि वास्तविक मामले पर।" },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "उत्तराधिकार कर कितना",
    excerpt: "छूट, दरें, 2025 स्व-निर्धारण: कर कैसे, कौन भुगतान, प्रत्यक्ष उत्तराधिकारी के लिए अक्सर शून्य।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "महत्वपूर्ण: सेवा कीमत (शुल्क) अलग, कर अलग। कर उत्तराधिकारी के, शुल्क से अलग, जमा से पहले गणना/सूचना।" },
      { type: "h2", text: "उत्तराधिकार कर: दरें और छूट" },
      { type: "p", text: "कर केवल छूट से अधिक मूल्य पर; छूट मृतक से रिश्ते पर।" },
      {
        type: "table",
        headers: ["लाभार्थी", "दर", "छूट (प्रति लाभार्थी)"],
        rows: [
          ["पति/पत्नी और прямी रिश्तेदार (बच्चे, माता-पिता)", "4%", "1.000.000 EUR"],
          ["भाई-बहन", "6%", "100.000 EUR"],
          ["4वें स्तर तक अन्य रिश्तेदार (कानूनी सीमा)", "6%", "nessuna"],
          ["अन्य (बाहरी)", "8%", "nessuna"],
          ["गंभीर विकलांगता (L. 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "प्रत्यक्ष उत्तराधिकारी के लिए अक्सर शून्य", text: "पति/पत्नी/बच्चों: €1,000,000 प्रति व्यक्ति छूट: अधिकांश पारिवारिक विरासत में कर शून्य।" },
      { type: "h2", text: "बंधक/भू-अभिलेख कर (केवल संपत्ति)" },
      { type: "p", text: "संपत्ति पर: बंधक कर (भू-अभिलेख मूल्य 2%, न्यून €200), भू-अभिलेख कर (1%, न्यून €200)। prima casa: प्रत्येक €200 निश्चित। स्टाम्प, बंधक शुल्क, विशेष भू-अभिलेख कर।" },
      { type: "h2", text: "2025 स्व-निर्धारण: क्या बदला" },
      { type: "p", text: "1 जनवरी 2025 से विरासत: करदाता स्व-निर्धारित (अब resen नहीं)। जमा अवधि +90 दिन F24।" },
      {
        type: "ul",
        items: [
          "≥€1,000: किश्त — न्यून 20% अग्रिम, 8 तिमाही (€20,000+ पर 12), ब्याज।",
          "2025 से पहले: resen liquidazione, सूचना +60 दिन।",
        ],
      },
      { type: "h2", text: "वास्तविक उदाहरण (अज्ञात)" },
      { type: "p", text: "पति/पत्नी + 2 बच्चे, ~€117,000 विरासत (संपत्ति, प्रतिभूति, तरलता), prima casa, voltura। कुल कर ~€1,200; विरासत कर शून्य (छूट के नीचे)। सेवा शुल्क अलग।" },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "विरासत में prima casa छूट",
    excerpt: "निश्चित कर कब, कौन, लाभ न खोने के लिए क्या।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "कम से कम एक उत्तराधिकारी prima casa योग्य immobile पर: बंधक/भू-अभिलेख कर निश्चित €200, प्रतिशत नहीं। उच्च मूल्य पर बचत।" },
      { type: "h2", text: "किसे मिल सकता" },
      { type: "p", text: "कम से कम एक उत्तराधिकारी prima casa शर्तें (संक्षेप: उसी Comune में अन्य immobile अधिकार नहीं, छूट अन्यत्र नहीं, Comune में निवास)। एक पर्याप्त।" },
      { type: "callout", tone: "warning", title: "शर्तें सत्यापित", text: "EH quadro में घोषित, सही चिह्नित। शर्तें न हों/समाप्त: लाभ खोना, कर+जुर्माना वसूली। पहले तकनीकी जाँच।" },
      { type: "h2", text: "हम क्या जाँचते" },
      { type: "p", text: "Geom. के रूप में भू-अभिलेख: particelle, subalterni, category, rendita, atti। prima casa सही घोषणा, कोई आश्चर्य नहीं।" },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "उत्तराधिकार दस्तावेज़: पूर्ण सूची",
    excerpt: "सामान्य दस्तावेज़ और प्राप्ति। सभी हमेशा नहीं: स्थिति पर।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "दस्तावेज़ मामले पर; सभी एक साथ नहीं। सामान्य, स्थिति अनुसार। कम हो तो अक्सर हम (visure, atti)।" },
      { type: "h2", text: "हमेशा आवश्यक" },
      {
        type: "ul",
        items: [
          "मृतक मृत्यु प्रमाण/अंश (जहाँ स्व-प्रमाण)।",
          "मृतक और सभी उत्तराधिकारी ID और codice fiscale।",
          "उत्तराधिकारी परिवार स्थिति और रिश्ता स्व-प्रमाण।",
        ],
      },
      { type: "h2", text: "यदि संपत्तियाँ हैं" },
      {
        type: "ul",
        items: [
          "विरासत immobili visure (हम प्राप्त)।",
          "atti: rogiti, donazioni, पिछली उत्तराधिकार घोषणाएँ।",
          "planimetrie जहाँ ज़रूरी।",
        ],
      },
      { type: "h2", text: "वसीयत या विशेष उत्तराधिकारी" },
      {
        type: "ul",
        items: [
          "प्रकाशित वसीयत और publication verbale।",
          "नाबालिग/incapaci: Giudice Tutelare अनुमति।",
        ],
      },
      { type: "h2", text: "खाते/निवेश" },
      {
        type: "ul",
        items: [
          "मृत्यु तिथि पर खाता/पासबुक/प्रतिभूति शेष प्रमाण।",
          "कर डेबिट या संभावित रिफ़ंड के लिए उत्तराधिकारी का IBAN।",
        ],
      },
      { type: "callout", tone: "info", title: "कुछ कम है? अक्सर हम प्राप्त कर लेते हैं", text: "दस्तावेज़ पुनर्प्राप्ति हमारे काम का हिस्सा: visure, atti और लापता डेटा हम enti/बैंकों से लाते हैं।" },
      { type: "callout", tone: "warning", title: "संकेत सूची", text: "यह सूची संकेतात्मक, आपके मामले अनुसार। Lorenzo वास्तविक स्थिति देखकर अंतिम पुष्टि करेंगे।" },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "विदेश में रहने वाले उत्तराधिकारी: फ़ाइल कैसे",
    excerpt: "जब कोई उत्तराधिकारी Italy के बाहर रहता है क्या बदलता है; दूर से, आपकी भाषा में।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "विदेशी उत्तराधिकारी समस्या नहीं: घोषणा Italy की संपत्ति पर, Agenzia को जमा। दस्तावेज़/हस्ताक्षर संग्रह दूर से।" },
      { type: "h2", text: "वास्तव में क्या चाहिए" },
      {
        type: "ul",
        items: [
          "प्रत्येक उत्तराधिकारी का Italian codice fiscale (विदेशी भी); न हो तो अनुरोध।",
          "सभी उत्तराधिकारी ID और व्यक्तिगत डेटा।",
          "मध्यस्थ को अधिदेश/delega, क्योंकि जमा करने वाला उत्तराधिकारी है और हम उसकी ओर से भेजते हैं।",
        ],
      },
      { type: "p", text: "विदेश निवासी, अपवाद में, केवल telematica असंभव हो तो कागज़; अधिकांश में हम telematica मध्यस्थ।" },
      { type: "h2", text: "सब दूर, आपकी भाषा में" },
      { type: "p", text: "प्रश्नावली, दस्तावेज़, संचार, हस्ताक्षर ऑनलाइन: Italy वापसी नहीं। ईमेल/मैसेजिंग; अनुवाद कॉल; महत्वपूर्ण बातें लिखित; आधिकारिक दस्तावेज़ इतालवी।" },
      { type: "callout", tone: "info", title: "समय क्षेत्र/दूरी मायने नहीं", text: "व्यक्तिगत क्षेत्र से दस्तावेज़, फ़ोन फ़ोटो से। हम जाँच और समय में compliance।" },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "fai-da-te-precompilata": {
    title: "precompilata उत्तराधिकार: DIY ठीक?",
    excerpt: "Agenzia की मुफ़्त घोषणा वास्तव में है। कब DIY, कब delegate।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "ईमानदारी से: मुफ़्त DIY संभव। Agenzia delle Entrate guided web + official software। वैध विकल्प।" },
      { type: "h2", text: "DIY कब पर्याप्त" },
      { type: "p", text: "सरल मामला (कुछ प्रत्यक्ष उत्तराधिकारी, 0/1 सरल immobile, स्पष्ट catastali, SPID अनुभव): precompilata पर्याप्त।" },
      { type: "h2", text: "DIY जोखिम कहाँ" },
      {
        type: "table",
        headers: ["पहलू", "स्वयं करें", "हमारे साथ"],
        rows: [
          ["आवश्यक समय", "घंटे और SPID आपकी ज़िम्मेदारी", "हम इसका ध्यान रखते हैं"],
          ["भू-अभिलेख डेटा जाँच", "आपकी ज़िम्मेदारी", "Geom. द्वारा किया जाता है"],
          ["कर गणना", "अकेले", "हम पहले करते हैं"],
          ["सहायता", "कोई नहीं", "एक वास्तविक व्यक्ति"],
          ["त्रुटि जुर्माना जोखिम", "आपका", "प्रबंधित"],
        ],
      },
      { type: "callout", tone: "warning", title: "कमज़ोर बिंदु catastali", text: "precompilata catastali validate नहीं: यहीं अटक/गलती। particelle, subalterni, annessi, atti — Geom. का काम।" },
      { type: "p", text: "संक्षेप: सरल+आत्मविश्वास = DIY ईमानदार। immobili/सं doubt/कम समय = delegate। हमेशा मुफ़्त जाँच पहले।" },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleHi(slug: string): ArticleHiOverlay | undefined {
  return articlesHi[slug];
}
