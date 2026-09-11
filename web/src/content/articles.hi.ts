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

const REVIEWED = "";

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
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - घोषणा कैसे और कब जमा करें",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - codice fiscale अनुरोध (modello AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/modello-aa4-8-cf-pf",
};
const FONTE_UE_650: ArticleSource = {
  label: "Regolamento (UE) n. 650/2012 सीमा-पार उत्तराधिकार पर",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Regolamento (UE) 2016/1191 - legalizzazione के बिना सार्वजनिक दस्तावेज़",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "विदेश मंत्रालय - विदेश में इतालवी नागरिकों के लिए वाणिज्य दूतावास सेवाएँ",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
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
      { type: "callout", tone: "info", title: "हमेशा आवश्यक नहीं", text: "कुछ मामलों में घोषणा बाध्य नहीं। छूट गाइड में: मुफ़्त जाँच।" },
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
          "मृतक का मृत्यु प्रमाण या अंश।",
          "मृतक और उत्तराधिकारियों का पहचान पत्र; उत्तराधिकारियों का codice fiscale।",
          "उत्तराधिकारी परिवार स्थिति और रिश्ता स्व-प्रमाण।",
          "उत्तराधिकारी का IBAN (हमेशा आवश्यक, रिफ़ंड या कर डेबिट के लिए)।",
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
        ],
      },
      { type: "callout", tone: "info", title: "कुछ कम है? अक्सर हम प्राप्त कर लेते हैं", text: "दस्तावेज़ पुनर्प्राप्ति हमारे काम का हिस्सा: visure, atti और लापता डेटा हम enti/बैंकों से लाते हैं।" },
      { type: "callout", tone: "warning", title: "संकेत सूची", text: "यह सूची संकेतात्मक, आपके मामले अनुसार। Lorenzo वास्तविक स्थिति देखकर अंतिम पुष्टि करेंगे।" },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "विदेश में रहते हुए Italy में उत्तराधिकार: पूर्ण गाइड",
    excerpt: "Germany, Switzerland, UK, US, Argentina या कहीं और रहते हैं और Italy में घर या बैंक खाता मिला? वास्तव में क्या बदलता है, क्या चाहिए, और बिना वापस आए सब कैसे दूर से होता है।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "यदि आप विदेश में रहते हैं और Italy में माता-पिता का घर, ज़मीन या बैंक खाता रह गया है, dichiarazione di successione (उत्तराधिकार घोषणा) फिर भी Italy में, मृत्यु से 12 महीने के भीतर जमा होनी चाहिए। वापस आने की ज़रूरत नहीं: घोषणा इलेक्ट्रॉनिक रूप से प्राधिकृत मध्यस्थ भेजता है — यही हम हैं। हमारी सेवा ऑनलाइन बनी है उनके लिए जो कार्यालय नहीं जा सकते; विदेश में रहना वह मामला है जहाँ यह सबसे ज़्यादा मायने रखता है।" },
      { type: "h2", text: "दो सामान्य मामले" },
      {
        type: "ul",
        items: [
          "मृतक Italy में रहता था और एक या अधिक उत्तराधिकारी विदेश में: प्रक्रिया सामान्य है, केवल दस्तावेज़ और हस्ताक्षर इकट्ठा करने का तरीका बदलता है।",
          "मृतक विदेश में रहता था और Italy में संपत्ति थी: घोषणा फिर भी Italy में, सक्षम कार्यालय, कर और लागू कानून पर कुछ अतिरिक्त नियमों के साथ। इस पर एक अलग गाइड है।",
        ],
      },
      { type: "h2", text: "Italy में रहने वालों से क्या अलग" },
      {
        type: "ul",
        items: [
          "codice fiscale (कर कोड): हर उत्तराधिकारी को चाहिए, भले वह Italy में कभी न रहा हो। इसके बिना घोषणा नहीं भेजी जा सकती। वाणिज्य दूतावास से मिल सकता है, या तेज़ — Italy में हमें delega (अधिदेश) देकर।",
          "विदेशी दस्तावेज़: विदेश में जारी मृत्यु प्रमाण या वसीयत को apostille, legalizzazione और अनुवाद चाहिए हो सकता है। EU के भीतर नियम सरल हैं।",
          "हस्ताक्षर: हम आपके दूर से हस्ताक्षरित incarico के साथ घोषणा भेजते हैं। केवल घोषणा के लिए नोटarial procura नहीं चाहिए।",
          "कर भुगतान: Italian बैंक खाते से direct debit। न हो तो समाधान हैं, मध्यस्थ के रूप में हमारे studio खाते से debit सहित।",
          "समय क्षेत्र और भाषा: हम लिखित, WhatsApp और email से काम करते हैं, जब सुविधा हो तब जवाब दें। साइट और संचार कई भाषाओं में।",
        ],
      },
      { type: "h2", text: "कैसे काम करता है — पाँच चरण" },
      {
        type: "ol",
        items: [
          "ऑनलाइन प्रश्नावली भरें: दो मिनट, तुरंत पता चलता है कौन सा पैकेज और कितना।",
          "WhatsApp पर लिखें या सीधे भुगतान करें। आपका व्यक्तिगत क्षेत्र खुलता है, आपके मामले की दस्तावेज़ सूची के साथ।",
          "जब चाहें दस्तावेज़ अपलोड करें, फ़ोन फ़ोटो भी। हम catastali डेटा, atti और codice fiscale जाँचते हैं; कुछ कम हो तो अक्सर Italy में हम लाते हैं।",
          "हम लिखित में कर और राशि पुष्टि करते हैं, फिर आप दूर से incarico पर हस्ताक्षर करते हैं और हम Agenzia delle Entrate (इталियन कर प्राधिकरण) को घोषणा भेजते हैं।",
          "जमा रसीद मिलती है और immobili हो तो voltura (cadastral स्थानांतरण)। सब आपके व्यक्तिगत क्षेत्र में रहता है।",
        ],
      },
      { type: "callout", tone: "info", title: "Italy वापस आने की ज़रूरत नहीं", text: "dichiarazione di successione का कोई चरण आपकी शारीरिक उपस्थिति नहीं माँगता। Italy में counter पर जो होता है — codice fiscale अनुरोध, visura — हम आपकी delega से करते हैं।" },
      { type: "h2", text: "हम वास्तव में क्या करते हैं" },
      {
        type: "ul",
        items: [
          "जिन उत्तराधिकारियों के पास codice fiscale नहीं, delega से Agenzia delle Entrate में अनुरोध।",
          "Catasto और atti में immobili जाँच: दूर से की गई फ़ाइलें यहाँ अक्सर अटकती हैं।",
          "प्राधिकृत मध्यस्थ के रूप में घोषणा और voltura तैयार व भेजना।",
          "Italian खाता न हो तो studio के माध्यम से कर भुगतान, राशि और रसीदें लिखित।",
          "स्पष्ट बताते हैं किस चरण में notaio या consolato चाहिए, और कौन सा।",
        ],
      },
      { type: "h2", text: "कब notaio या consolato भी चाहिए" },
      { type: "p", text: "dichiarazione di successione notarial अधिनियम नहीं और notaio नहीं माँगती। विरासत त्याग, inventario लाभ के साथ स्वीकार, वसीयत proroga और विरासती immobile बेचने के लिए notaio, या Italian consolato (Italian नागरिकों के लिए कुछ notarial कार्य) चाहिए। आपके मामले में हो तो पहले बताते हैं, बाद में नहीं।" },
      { type: "h2", text: "कितना खर्च" },
      { type: "p", text: "पैकेज Italy में रहने वालों जैसे, Tariffe पृष्ठ पर: onorario में geometra, घोषणा और voltura। कानूनी कर सभी के लिए अलग, भेजने से पहले राशि बताते हैं। codice fiscale या अनुवाद जैसे अतिरिक्त चरण हों तो तुरंत, राशि के साथ।" },
      { type: "callout", tone: "warning", title: "12 महीने आप पर भी लागू", text: "अवधि मृत्यु तिथि से, जब आप संभाल पाएं उससे नहीं। निकट हो तो अभी लिखें: विदेश में रहने वालों के लिए सबसे लंबा चरण अक्सर codice fiscale।" },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "विदेश में रहने वाले उत्तराधिकारी के लिए Italian codice fiscale: कैसे मिले",
    excerpt: "हर उत्तराधिकारी का codice fiscale बिना घोषणा नहीं भेजी जा सकती। किसके पास पहले से हो सकता है, consolato या Italy में delega से कैसे, क्या चाहिए।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Italian codice fiscale (कर कोड) सबसे अधिक विदेशी उत्तराधिकारियों वाली विरासतें रोकता है: इलेक्ट्रॉनिक घोषणा हर उत्तराधिकारी और legatario का माँगती है, बिना फ़ाइल अस्वीकार। अच्छी बात: मिलना आसान लगता से, Italy आने की ज़रूरत नहीं।" },
      { type: "h2", text: "शायद पहले से है" },
      { type: "p", text: "Italy में जन्म, काम/पढ़ाई, पुरानी tessera sanitaria या AIRE (विदेश में Italian नागरिकों का रजिस्टर) पंजीकरण — अक्सर codice fiscale है, वर्षों से अप्रयुक्त भी। पुराने दस्तावेज़, tessera sanitaria या dichiarazione dei redditi देखें। न मिले तो आपके anagrafici से हम जाँच सकते हैं: codice fiscale दो बार नहीं मिलता।" },
      { type: "h2", text: "न हो तो कैसे मिले" },
      {
        type: "ol",
        items: [
          "जहाँ रहते हैं उस देश के Italian consolato: विदेश निवासी नागरिकों का सामान्य रास्ता। modello AA4/8 वैध ID के साथ। समय consolato पर, लंबा हो सकता है।",
          "Italy में किसी भी Agenzia delle Entrate कार्यालय, delegato के माध्यम से: modello AA4/8 आप हस्ताक्षर, delega भरा, delegato अपना ID और आपकी copy के साथ जमा। हम यह रास्ता — आमतौर पर सबसे तेज़।",
        ],
      },
      { type: "callout", tone: "info", title: "हम आपकी delega से करते हैं", text: "precompilato modello भेजते हैं, आप हस्ताक्षर और ID copy लौटाएँ। हम Agenzia delle Entrate में जमा करते हैं, codice fiscale मिलते ही बताते हैं।" },
      { type: "h2", text: "क्या चाहिए" },
      {
        type: "ul",
        items: [
          "वैध passport या carta d'identità (स्पष्ट copy, आगे-पीछे)।",
          "पूर्ण anagrafici: cognome, nome, sesso, जन्म तिथि/स्थान, विदेश residential पता।",
          "अनुरोध का कारण: Italy में successione। modello में दर्शाना होगा।",
          "हस्ताक्षरित modello AA4/8, delega भरी यदि हम जमा करें।",
        ],
      },
      { type: "h2", text: "Italian नागरिक नहीं उत्तराधिकारी" },
      { type: "p", text: "वही प्रक्रिया: modello AA4/8 delegato से किसी Agenzia delle Entrate में, motivated अनुरोध। विदेशी नागरिकों के लिए Italian consolato विशेष मामलों में; Italy में delega लगभग हमेशा सबसे सरल।" },
      { type: "callout", tone: "warning", title: "अवधि निकट हो तो यहाँ से शुरू", text: "codice fiscale पूरी प्रक्रिया में सबसे कम predictable समय। मृत्यु कई महीने पहले — अभी माँगें: बाकी घोषणा parallel तैयार।" },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "मृतक विदेश में रहता था और Italy में संपत्ति थी: क्या करें",
    excerpt: "मृत्यु विदेश में हुई हो तो भी घोषणा Italy में: कौन सा कार्यालय, किन संपत्तियों पर कर, EU Regolamento 650/2012 क्या कहता है, कब notaio।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "कई emigrati परिवारों का classic मामला: माता-पिता वर्षों Germany, Switzerland या Argentina में, पर Italy में gaon का घर या किराए का appartamento। Italy में संपत्ति हो तो dichiarazione di successione Italy में, मृत्यु से 12 महीने के भीतर, भले मृत्यु विदेश में हो और सभी उत्तराधिकारी विदेश में हों।" },
      { type: "h2", text: "किन संपत्तियों पर कर" },
      { type: "p", text: "नियम TUS (art. 2) में। मृतक मृत्यु पर Italy resident — कर सभी संपत्ति पर, कहीं भी। Italy resident नहीं — केवल Italy में: immobili, Italian बैंक खाते, Italian companies में हिस्सेदारी। विदेश की संपत्ति उस देश के नियम।" },
      { type: "callout", tone: "info", title: "दोहरा कर", text: "Italy के पास कुछ देशों — France, UK, US सहित — के साथ inheritance कर convention। बाकी में Italy में Italian संपत्ति पर जो भुगतान, residence देश की declaration से coordinate: local सलाहकार उपयोगी।" },
      { type: "h2", text: "किस कार्यालय में" },
      { type: "p", text: "Italy में पहले residence था — Agenzia delle Entrate अंतिम Italian residence का। कभी Italy resident नहीं या अज्ञात — Roma का Agency-determined कार्यालय। इलेक्ट्रॉनिक filing में हम compilation में संभालते हैं।" },
      { type: "h2", text: "कैसे जमा" },
      { type: "p", text: "प्राधिकृत मध्यस्थ telematica — Italy residents जैसा: दूर से दस्तावेज़/हस्ताक्षर, हम भेजते हैं। कानून विदेश residents को केवल telematica असंभव हो तो raccomandata — व्य práctica में लगभग कभी नहीं।" },
      { type: "h2", text: "कौन विरासत पाता: लागू कानून" },
      { type: "p", text: "कर और civil अलग। उत्तराधिकारी और हिस्से applicable succession कानून तय करता है। EU में Regolamento 650/2012: 17 agosto 2015 से मृत्यु — deceased habitual residence देश का कानून, जब तक testamento nationality देश चुने। Germany resident Italian बिना testamento — German कानून, Italy घर सहित। UK, Ireland, Denmark Regolamento नहीं; EU बाहर Italian private international law।" },
      { type: "callout", tone: "warning", title: "हमारा काम कहाँ समाप्त", text: "हम Italy संपत्ति पर घोषणा और voltura तैयार/भेजते। foreign कानून, foreign testamento enforce या European certificato successorio — notaio/avvocato भी: शुरुआत में, नाम और चरण, आधे में नहीं।" },
      { type: "h2", text: "अतिरिक्त दस्तावेज़" },
      {
        type: "ul",
        items: [
          "विदेश में जारी morte certificate: deceased Italian citizen — consolato से Italian comune transcription, फिर Italian certificate। नहीं — foreign certificate apostille/legalizzazione/translation, EU simplifications।",
          "deceased विदेश residence प्रमाण, जैसे AIRE या foreign residence certificate।",
          "deceased और सभी heirs का codice fiscale: non-Italian heirs भी।",
          "testamento, proroga या certificato successorio europeo।",
        ],
      },
      { type: "h2", text: "prima casa agevolazione" },
      { type: "p", text: "विरासती immobile पर ipotecaria/catastale कर prima casa agevolazione से कम — विदेश residents के लिए विशेष नियम, 2023 में बदले: immobile स्थान और heir का Italy से संबंध। case-by-case जाँच करके कर गणना।" },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "विदेश से दस्तावेज़: apostille, अनुवाद और दूर हस्ताक्षर",
    excerpt: "विदेशी morte certificate, foreign testamento, non-Italian ID: कब apostille, legalizzazione, giurata translation; Italy बिना हस्ताक्षर कैसे।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "heirs/deceased विदेश में successione — लगभग सभी दस्तावेज़ Italian मामले जैसे। दूसरे देश से कुछ — morte certificate (विदेश में मृत्यु), foreign testamento, heirs ID, कभी stato civile certificates। Agenzia delle Entrate और Catasto स्वीकार के लिए वास्तव में क्या चाहिए।" },
      { type: "h2", text: "देश के अनुसार तीन नियम" },
      {
        type: "table",
        headers: ["जारी करने वाला देश", "Legalizzazione", "अनुवाद"],
        rows: [
          ["EU", "नहीं: Regolamento 2016/1191 stato civile certificates के लिए apostille/legalizzazione हटाता", "multilingue standard form certificate के साथ translation टाल सकते"],
          ["1961 Hague Convention (UK, US, Switzerland, Argentina, Brazil, Australia)", "apostille, issuing authority", "Italy में giurata translation या Italian consolato certified"],
          ["अन्य देश", "issuing country में Italian consolato legalizzazione", "Italy में giurata translation या consolato certified"],
        ],
      },
      { type: "h2", text: "morte certificate" },
      { type: "p", text: "deceased Italian citizen, विदेश में मृत्यु — consolato से Italian comune transcription: फिर comune Italian certificate, apostille/translation नहीं। non-Italian — foreign certificate table rules।" },
      { type: "h2", text: "foreign testamento" },
      { type: "p", text: "विदेश में testamento — Italy में notaio proroga/enforce, giurata translation, legalizzazione। कुछ चरणों में हमसे अलग professional: तुरंत बताते, timing coordinate।" },
      { type: "h2", text: "non-Italian ID" },
      { type: "p", text: "वैध foreign passport/carta d'identità dichiarazione di successione और codice fiscale अनुरोध के लिए ठीक। स्पष्ट copy आगे-पीछे; translation नहीं।" },
      { type: "h2", text: "हस्ताक्षर: क्या चाहिए, क्या नहीं" },
      {
        type: "ul",
        items: [
          "dichiarazione di successione और voltura notarial procura नहीं: हम intermediary, दूर incarico व्यक्तिगत क्षेत्र या signed incarico + ID copy।",
          "codice fiscale: modello AA4/8 में delega, आप signed।",
          "notaio/consolato (Italian citizens notarial functions): virasat tyag, inventario benefit accept, immobile बेचने procura।",
        ],
      },
      { type: "callout", tone: "info", title: "पहले photos, फिर originals", text: "initial checks — photos/scans व्यक्तिगत क्षेत्र। originals/apostille copies केवल जहाँ वास्तव में, पहले बताते।" },
      { type: "callout", tone: "warning", title: "apostille/translation समय", text: "certificate, apostille, giurata translation — हफ़्ते। 12 महीने निकट — इन दस्तावेज़ों से शुरू, बाकी parallel।" },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "Italian inheritance कर विदेश से, Italian बैंक खाते बिना",
    excerpt: "कर Italian खाते direct debit। विदेश में रहें, खाता न हो — तीन समाधान, studio intermediary भुगतान सहित।",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "विदेश residents के लिए कर भुगतान अक्सर सबसे annoying practical बाधा: telematica declaration राशि Italian conto corrente debit — कई emigrati का Italy खाता नहीं। कौन से कर, कैसे, Italian खाता missing solutions।" },
      { type: "h2", text: "कौन से कर" },
      {
        type: "ul",
        items: [
          "declaration के साथ, immobili हो तो: ipotecaria (2%) और catastale (1%) valore catastale, न्यूनतम 200 euro each, bollo/speciali। autoliquidazione, transmission पर।",
          "successione imposta proper केवल patrimonio franchigie से अधिक: 1 milione euro प्रति figlio/coniuge (4%), 100.000 euro fratelli/sorelle (6%), अन्य franchigia नहीं (6%/8%)। 2025 से successioni taxpayer declaration में, 90 giorni presentation term या तुरंत बाकी के साथ।",
        ],
      },
      { type: "h2", text: "telematica declaration payment" },
      { type: "p", text: "autoliquidate राशि Agenzia delle Entrate/Poste Italiane convenzionata banca conto corrente debit। conto dichiarante या telematica transmission responsible — intermediary। declaration में IBAN और conto holder codice fiscale।" },
      { type: "h2", text: "Italy खाता नहीं? तीन समाधान" },
      {
        type: "ol",
        items: [
          "Italy resident coerede सभी के लिए: declaration एक heir का conto। सबसे simple जब available।",
          "studio intermediary: exact imposte राशि advance bonifico (लिखित), हम studio conto debit transmission पर, quietanze। case-by-case।",
          "Italy delegato F24: ufficio presentation — slowest, पहले दो impraticabili तभी।",
        ],
      },
      { type: "callout", tone: "info", title: "सब लिखित, पहले", text: "transmission से पहले imposte voce per voce। केवल वह राशि, देखने के बाद। imposte State को, हमें नहीं: pacchetto onorario अलग।" },
      { type: "h2", text: "विदेश bonifici और cambio" },
      { type: "p", text: "imposte euro। दूसरी currency conto — bank commissioni/cambio; SEPA euro area/Switzerland सस्ता, अन्य verify। pacchetto onorario site पर Stripe card, किसी भी देश।" },
      { type: "h2", text: "2025 से पहले successioni" },
      { type: "p", text: "31 dicembre 2024 तक decessi — successione imposta Agenzia delle Entrate calculate, avviso liquidazione F24 60 giorni। Italian conto न हो — studio से versamento।" },
      { type: "callout", tone: "warning", title: "राशि बदल सकती", text: "aliquote, franchigie, minimi इस guide की तारीख पर। हमेशा concrete case और official sources verify।" },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
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
