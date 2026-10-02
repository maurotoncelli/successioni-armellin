import type { Locale } from "@/lib/content";

/*
  Landing «Eredi all'estero» (/eredi-estero): solo italiano e inglese.
  Le altre lingue mostrano l'inglese (canonical → /en/eredi-estero).
  I fatti sono quelli delle guide della categoria `stranieri` (articles.ts):
  se cambiano lì, vanno allineati qui.
*/

export type ErediEsteroItem = { title: string; text: string };

export type ErediEsteroCopy = {
  meta_title: string;
  meta_description: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_whatsapp: string;
  cta_quote: string;
  hero_note: string;
  whatsapp_prefill: string;
  hero_image_alt: string;
  help_title: string;
  help_intro: string;
  help_items: ErediEsteroItem[];
  steps_title: string;
  steps: ErediEsteroItem[];
  price_title: string;
  price_intro: string;
  price_note: string;
  faq_title: string;
  faqs: { question: string; answer: string }[];
  guides_title: string;
  guides: { label: string; href: string }[];
  final_title: string;
  final_subtitle: string;
};

const IT: ErediEsteroCopy = {
  meta_title: "Successione in Italia per chi vive all'estero",
  meta_description:
    "Eredità in Italia e vivi all'estero? Dichiarazione di successione, codice fiscale, volture e imposte gestite a distanza dal Geom. Lorenzo Armellin. Non serve venire in Italia.",
  eyebrow: "Eredi all'estero",
  title: "Eredità in Italia? Ci pensiamo noi, anche se vivi all'estero",
  subtitle:
    "Dichiarazione di successione, volture e imposte gestite a distanza dal Geom. Lorenzo Armellin. Non serve venire in Italia: si fa tutto per iscritto, su WhatsApp ed email.",
  cta_whatsapp: "Scrivi a Lorenzo su WhatsApp",
  cta_quote: "Calcola il preventivo",
  hero_note: "Puoi scriverci anche nella tua lingua. Rispondi quando puoi, anche con un altro fuso orario.",
  whatsapp_prefill:
    "Ciao Lorenzo, vivo all'estero e devo fare una successione in Italia. Come procediamo?",
  hero_image_alt: "Il Geom. Lorenzo Armellin al lavoro nel suo studio",
  help_title: "Cosa facciamo per te, da lontano",
  help_intro: "Le cose che di solito bloccano chi vive fuori dall'Italia le seguiamo noi.",
  help_items: [
    {
      title: "Codice fiscale degli eredi",
      text: "Senza, la dichiarazione non parte. Se ti manca, lo richiediamo noi all'Agenzia delle Entrate con la tua delega: firmi un modulo e ce lo rimandi.",
    },
    {
      title: "Firme a distanza",
      text: "Ci dai l'incarico firmandolo a distanza. Per la sola dichiarazione non serve una procura dal notaio.",
    },
    {
      title: "Documenti dall'estero",
      text: "Certificati e documenti stranieri: ti guidiamo su apostille e traduzioni dove servono. Per i certificati dei Paesi dell'Unione europea di solito non servono.",
    },
    {
      title: "Imposte senza conto italiano",
      text: "Le calcoliamo noi. Si pagano con addebito su un conto italiano: se non ce l'hai, può pagare un coerede in Italia oppure lo studio come intermediario, con le quietanze per te.",
    },
    {
      title: "Dichiarazione, invio e volture",
      text: "Prepariamo la dichiarazione e la inviamo all'Agenzia delle Entrate. Le volture catastali degli immobili sono comprese.",
    },
    {
      title: "Tutto per iscritto",
      text: "WhatsApp ed email, documenti anche in foto. I punti importanti te li confermiamo sempre per iscritto; gli atti ufficiali restano in italiano.",
    },
  ],
  steps_title: "Come funziona, da dove sei",
  steps: [
    {
      title: "Ci scrivi",
      text: "Su WhatsApp o compilando il preventivo online: in due minuti sai se il tuo caso rientra nel prezzo e cosa serve.",
    },
    {
      title: "Mandi i documenti",
      text: "In foto su WhatsApp, via email o dall'area personale. Lorenzo li controlla gratis e ti conferma prezzo e imposte: paghi online solo dopo, con il link che ti manda lui.",
    },
    {
      title: "Pensiamo a tutto noi",
      text: "Inviamo la dichiarazione entro 48 ore lavorative dai documenti completi e ti mettiamo ricevute e documenti finali nell'area personale.",
    },
  ],
  price_title: "Quanto costa",
  price_intro: "Lo stesso prezzo di chi vive in Italia: vivere all'estero non costa di più.",
  price_note:
    "Le imposte dello Stato sono a parte e te le calcoliamo noi. Se dai documenti emerge un passaggio che non facciamo noi, per esempio un testamento straniero da far valere in Italia tramite notaio, te lo segnaliamo.",
  faq_title: "Le domande di chi vive all'estero",
  faqs: [
    {
      question: "Devo venire in Italia?",
      answer:
        "No. La dichiarazione si presenta online tramite un intermediario abilitato, cioè noi. Documenti, firme e pagamenti si fanno a distanza.",
    },
    {
      question: "Non ho il codice fiscale italiano: è un problema?",
      answer:
        "No. Forse ce l'hai già senza saperlo, se sei nato, hai lavorato o studiato in Italia o sei iscritto all'AIRE: possiamo verificarlo noi. Se manca, lo richiediamo all'Agenzia delle Entrate con la tua delega; al consolato i tempi di solito sono più lunghi.",
    },
    {
      question: "Il defunto viveva all'estero: la successione si fa lo stesso in Italia?",
      answer:
        "Sì, se aveva beni in Italia, per esempio una casa, un terreno o un conto in una banca italiana. In quel caso le imposte italiane riguardano solo i beni che si trovano in Italia. L'ufficio competente lo individuiamo noi.",
    },
    {
      question: "Come pago le imposte se non ho un conto in Italia?",
      answer:
        "Le imposte si versano con addebito su un conto italiano. Se nessuno degli eredi ne ha uno, puoi fare un bonifico allo studio per l'importo esatto, che ti comunichiamo per iscritto, e le versiamo noi come intermediario. Ricevi le quietanze.",
    },
    {
      question: "Servono traduzioni o apostille?",
      answer:
        "Solo per alcuni documenti rilasciati fuori dall'Italia. Per i certificati di stato civile dei Paesi dell'Unione europea di solito no; per gli altri Paesi può servire l'apostille o la legalizzazione, più una traduzione. Ti guidiamo caso per caso.",
    },
    {
      question: "In che lingua ci sentiamo?",
      answer:
        "Scrivici nella lingua che preferisci, su WhatsApp o via email: ci capiamo senza problemi. I punti importanti (importi, scadenze, documenti) te li confermiamo sempre per iscritto. I documenti ufficiali restano in italiano.",
    },
    {
      question: "Quanto tempo ci vuole?",
      answer:
        "Inviamo la dichiarazione entro 48 ore lavorative da quando abbiamo tutti i documenti completi. Se serve richiedere un codice fiscale o un documento all'estero, si aggiungono i tempi di quegli uffici.",
    },
  ],
  guides_title: "Vuoi approfondire?",
  guides: [
    { label: "Successione in Italia se vivi all'estero: la guida completa", href: "/guide/eredi-estero" },
    { label: "Codice fiscale per un erede che vive all'estero", href: "/guide/codice-fiscale-erede-estero" },
    { label: "Pagare le imposte dall'estero, senza un conto italiano", href: "/guide/pagare-imposte-successione-dall-estero" },
    { label: "Il defunto viveva all'estero e aveva beni in Italia", href: "/guide/successione-defunto-residente-estero" },
    { label: "Documenti dall'estero: apostille, traduzioni e firme a distanza", href: "/guide/documenti-esteri-successione-apostille" },
  ],
  final_title: "Raccontaci il tuo caso",
  final_subtitle: "Scrivi a Lorenzo su WhatsApp: ti risponde lui, di solito entro poche ore.",
};

const EN: ErediEsteroCopy = {
  meta_title: "Italian inheritance when you live abroad",
  meta_description:
    "Inherited property or money in Italy and live abroad? Succession declaration, Italian tax code, cadastral transfers and taxes handled remotely by Geom. Lorenzo Armellin. No need to travel to Italy.",
  eyebrow: "Heirs living abroad",
  title: "Inheritance in Italy? We take care of it, even if you live abroad",
  subtitle:
    "Succession declaration, cadastral transfers and taxes handled remotely by Geom. Lorenzo Armellin. No need to travel to Italy: everything is done in writing, on WhatsApp and by email.",
  cta_whatsapp: "Message Lorenzo on WhatsApp",
  cta_quote: "Get your quote",
  hero_note: "You can write to us in your own language. Reply whenever suits you, whatever your time zone.",
  whatsapp_prefill:
    "Hi Lorenzo, I live abroad and need to handle a succession in Italy. How do we proceed?",
  hero_image_alt: "Geom. Lorenzo Armellin at work in his office",
  help_title: "What we do for you, from a distance",
  help_intro: "We handle the things that usually block people who live outside Italy.",
  help_items: [
    {
      title: "Italian tax code for the heirs",
      text: "Without it the declaration can't be filed. If you don't have one, we request it from the Agenzia delle Entrate with your proxy: you sign a form and send it back.",
    },
    {
      title: "Signatures from a distance",
      text: "You appoint us by signing remotely. For the declaration alone you don't need a power of attorney from a notary.",
    },
    {
      title: "Documents from abroad",
      text: "Foreign certificates and documents: we guide you on apostilles and translations where needed. For certificates from EU countries they are usually not needed.",
    },
    {
      title: "Taxes without an Italian bank account",
      text: "We calculate them. They are paid by direct debit from an Italian account: if you don't have one, a co-heir in Italy can pay, or our office can pay as intermediary, with the receipts sent to you.",
    },
    {
      title: "Declaration, filing and cadastral transfers",
      text: "We prepare the declaration and file it with the Agenzia delle Entrate. Cadastral transfers for the properties are included.",
    },
    {
      title: "Everything in writing",
      text: "WhatsApp and email, documents even as photos. We always confirm the key points in writing; official documents remain in Italian.",
    },
  ],
  steps_title: "How it works, wherever you are",
  steps: [
    {
      title: "Get in touch",
      text: "On WhatsApp or with the online quote: in two minutes you know whether your case is covered by the price and what is needed.",
    },
    {
      title: "Send the documents",
      text: "As photos on WhatsApp, by email or from your client area. Lorenzo checks them for free and confirms the price and taxes: you only pay online afterwards, with the link he sends you.",
    },
    {
      title: "We handle the rest",
      text: "We file the declaration within 48 hours (business days) once the documents are complete, and put receipts and final documents in your client area.",
    },
  ],
  price_title: "What it costs",
  price_intro: "The same price as for people living in Italy: living abroad doesn't cost more.",
  price_note:
    "State taxes are separate and we calculate them for you. If the documents show a step we don't handle, for example a foreign will that has to be recognised in Italy through a notary, we'll let you know.",
  faq_title: "Questions from people living abroad",
  faqs: [
    {
      question: "Do I have to come to Italy?",
      answer:
        "No. The declaration is filed online through an authorised intermediary, which is us. Documents, signatures and payments are all handled remotely.",
    },
    {
      question: "I don't have an Italian tax code: is that a problem?",
      answer:
        "No. You may already have one without knowing it, if you were born, worked or studied in Italy or are registered with AIRE: we can check for you. If you don't, we request it from the Agenzia delle Entrate with your proxy; through the consulate it usually takes longer.",
    },
    {
      question: "The deceased lived abroad: is the succession still filed in Italy?",
      answer:
        "Yes, if they had assets in Italy, for example a house, land or an account with an Italian bank. In that case Italian taxes apply only to the assets located in Italy. We identify the competent office for you.",
    },
    {
      question: "How do I pay the taxes without an Italian bank account?",
      answer:
        "Taxes are paid by direct debit from an Italian account. If none of the heirs has one, you can make a bank transfer to our office for the exact amount, which we confirm in writing, and we pay it as intermediary. You receive the receipts.",
    },
    {
      question: "Do I need translations or apostilles?",
      answer:
        "Only for some documents issued outside Italy. Civil status certificates from EU countries usually don't need them; for other countries an apostille or legalisation may be required, plus a translation. We guide you case by case.",
    },
    {
      question: "What language do we speak?",
      answer:
        "Write to us in the language you prefer, on WhatsApp or by email: we'll understand each other. We always confirm the key points (amounts, deadlines, documents) in writing. Official documents remain in Italian.",
    },
    {
      question: "How long does it take?",
      answer:
        "We file the declaration within 48 hours, counting business days only, once we have all the complete documents. If a tax code or a document from abroad has to be requested, the time taken by those offices is added.",
    },
  ],
  guides_title: "Want to read more?",
  guides: [
    { label: "Succession in Italy when you live abroad: the complete guide", href: "/guide/eredi-estero" },
    { label: "Italian tax code for an heir living abroad", href: "/guide/codice-fiscale-erede-estero" },
    { label: "Paying the taxes from abroad, without an Italian account", href: "/guide/pagare-imposte-successione-dall-estero" },
    { label: "The deceased lived abroad and had assets in Italy", href: "/guide/successione-defunto-residente-estero" },
    { label: "Documents from abroad: apostilles, translations and remote signatures", href: "/guide/documenti-esteri-successione-apostille" },
  ],
  final_title: "Tell us about your case",
  final_subtitle: "Message Lorenzo on WhatsApp: he replies personally, usually within a few hours.",
};

/** Italiano solo per `it`; tutte le altre lingue leggono l'inglese. */
export function erediEsteroCopy(locale: Locale): ErediEsteroCopy {
  return locale === "it" ? IT : EN;
}
