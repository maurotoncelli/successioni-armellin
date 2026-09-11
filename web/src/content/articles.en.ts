import type { ArticleBlock, ArticleSource } from "./articles";

/*
  English courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleEnOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Succession declaration",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - How to pay taxes",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS Legislative Decree 346/1990",
  href: "https://www.normattiva.it",
};
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - How and when to file the declaration",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Tax code request (form AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/modello-aa4-8-cf-pf",
};
const FONTE_UE_650: ArticleSource = {
  label: "Regulation (EU) No 650/2012 on cross-border successions",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Regulation (EU) 2016/1191 - Public documents without legalisation",
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "Italian Ministry of Foreign Affairs - Consular services for Italians abroad",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
};

export const articlesEn: Record<string, ArticleEnOverlay> = {
  "successione-cosa-e": {
    title: "Succession: what it is and when it must be filed",
    excerpt: "A clear guide to understand the filing, who must do it, the deadlines, and the risks of not filing.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "The succession declaration is the tax filing that notifies Agenzia delle Entrate of the estate left by the deceased (the de cuius) and transferred to the heirs. It is not acceptance of the inheritance and not a notarial deed: it declares the hereditary assets, settles taxes due and, when there are properties, updates the Cadastre with the voltura." },
      { type: "h2", text: "Who must file it" },
      { type: "p", text: "Heirs, persons called to inherit and legatees (or their legal representatives) are obliged, as well as administrators, curators of vacant estates, executors and trustees." },
      {
        type: "ul",
        items: [
          "It is enough for one of the obliged persons to file it: the declaration applies to everyone.",
          "It can be filed by an authorised Entratel intermediary (such as a licensed surveyor): that is what we do.",
        ],
      },
      { type: "h2", text: "By when it must be filed" },
      { type: "p", text: "The ordinary deadline is 12 months from the opening of the succession, which normally coincides with the date of death (art. 31 TUS). In special cases (vacant estate, acceptance with inventory benefit, appointment of a curator) the deadline starts when the person is legally able to act." },
      { type: "callout", tone: "warning", title: "Watch the deadlines", text: "Filing late can mean penalties and interest. If the 12-month deadline is near, it is better to act now: we handle it within the correct times." },
      { type: "h2", text: "How it is filed today" },
      { type: "p", text: "The declaration is filed electronically with Agenzia delle Entrate software. The file produced (.SUC extension) is sent by an authorised taxpayer or, more often, by an authorised Entratel intermediary. The old paper Model 4 remains only for residual cases (deaths before 3 October 2006 or residents abroad unable to file electronically)." },
      { type: "h2", text: "What you risk if you don't file (or get it wrong)" },
      { type: "p", text: "Failure to file carries a penalty linked to the tax due, plus interest; late or inaccurate filing carries reduced or proportional penalties depending on the case. Amounts change over time: check official sources and with a professional." },
      { type: "callout", tone: "info", title: "It is not always required", text: "In some cases the declaration is not even mandatory. We explain this in the dedicated exemption guide: we check your case for free." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "When you are NOT required to file a succession",
    excerpt: "The exemption provided by law: the three conditions that must all apply, and why a single property triggers the obligation.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "The succession declaration is not always mandatory. The law (art. 28, para. 7 TUS) provides an exemption when THREE conditions apply TOGETHER. If even one is missing, the obligation returns." },
      { type: "h2", text: "The three exemption conditions" },
      {
        type: "ol",
        items: [
          "The estate passes to the spouse and/or relatives in the direct line (children, parents).",
          "The hereditary assets do not exceed €100,000 in value.",
          "The estate does not include real estate or real rights over property.",
        ],
      },
      { type: "callout", tone: "warning", title: "One property is enough", text: "Even a single property, however small in value, triggers the obligation regardless of the total. A home, land or garage changes everything." },
      { type: "h2", text: "Other cases of non-obligation" },
      { type: "p", text: "There are further cases of exemption or non-obligation, for example renouncing the inheritance before the 12-month deadline (art. 28, para. 5). Conditions can also change later: that is why assessment is always on the specific case." },
      { type: "callout", tone: "info", title: "We'll tell you for free", text: "If your case suggests succession may not be required, we won't sell you a useless service: we'll tell you. Final verification remains on the specific case." },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "How much succession tax you pay",
    excerpt: "Allowances, rates and 2025 self-assessment: how taxes work, who pays them, and why for direct heirs they are often zero.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "An important premise: the price of our service (the fee) is one thing; taxes are another. Taxes are paid by the heir, separate from the fee, and we calculate and notify them BEFORE filing." },
      { type: "h2", text: "Succession tax: rates and allowances" },
      { type: "p", text: "Succession tax applies only to the value exceeding the allowance, which depends on the degree of kinship with the deceased." },
      {
        type: "table",
        headers: ["Beneficiary", "Rate", "Allowance (per beneficiary)"],
        rows: [
          ["Spouse and relatives in the direct line (children, parents)", "4%", "1.000.000 EUR"],
          ["Siblings", "6%", "100.000 EUR"],
          ["Other relatives up to the 4th degree and in-laws (within legal limits)", "6%", "nessuna"],
          ["Other persons (unrelated)", "8%", "nessuna"],
          ["Persons with severe disability (Law 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "For direct heirs it is often zero", text: "With spouse and children the allowance is €1,000,000 each: for that reason, in most family successions, succession tax itself is zero." },
      { type: "h2", text: "Mortgage and cadastral taxes (only with property)" },
      { type: "p", text: "When there are properties you pay mortgage tax (2% of cadastral value, minimum €200) and cadastral tax (1% of cadastral value, minimum €200). With primary-residence relief for an heir, both drop to a fixed €200 each. Stamp duty, mortgage fee and special cadastral duties also apply at fixed amounts." },
      { type: "h2", text: "2025 self-assessment: what changed" },
      { type: "p", text: "For successions opened from 1 January 2025, succession tax is self-assessed by the taxpayer in the declaration (no longer assessed by the office). Payment is due within 90 days of the filing deadline, via F24." },
      {
        type: "ul",
        items: [
          "Instalments are allowed if the amount is at least €1,000: minimum 20% deposit and the balance in 8 quarterly instalments (up to 12 instalments over €20,000), with interest.",
          "For successions opened before 2025, office assessment remains, with notice and payment within 60 days of notification.",
        ],
      },
      { type: "h2", text: "A concrete example (anonymous real case)" },
      { type: "p", text: "Family with spouse and 2 children, estate of about €117,000 (property, securities and cash), with a primary home and cadastral transfer. Total taxes were about €1,200 (mortgage, cadastral, stamp and duties), while succession tax was zero because direct heirs were well under the allowance. The service fee is separate." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "Primary-residence relief in succession: how it works",
    excerpt: "When fixed taxes apply instead of percentages, who can claim it, and what you need so you don't lose the benefit.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "When a succession includes a property that can benefit from primary-residence relief for at least one heir, mortgage and cadastral taxes are not percentage-based but fixed: €200 each, instead of 2% and 1% of cadastral value. On higher-value properties the saving is significant." },
      { type: "h2", text: "Who may qualify" },
      { type: "p", text: "The benefit requires that at least one heir meets the legal primary-residence requirements (in short: not holding other rights on properties in the same municipality and not having already used the relief elsewhere, with residence in the property's municipality within legal deadlines). It is enough that one heir meets the requirements for the relief to apply to the property." },
      { type: "callout", tone: "warning", title: "Requirements must be checked", text: "The relief is declared in box EH of the form and must be ticked correctly. If requirements are missing or lapse, the benefit is lost with recovery of tax and penalties: a technical check beforehand is better." },
      { type: "h2", text: "What we check" },
      { type: "p", text: "As surveyors, our part is exactly the cadastral check: parcels, subunits, category, income and title deeds. We ensure the data is correct and that primary residence is declared properly, so the relief holds and there are no surprises." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "Documents for succession: the complete list",
    excerpt: "All typical documents and how to obtain them, case by case. Not all are always needed: it depends on your situation.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Documents for the succession declaration vary by case: you never need all of them at once. Below are the most common, grouped by situation. If something is missing, we can often retrieve it (searches, title deeds, missing data)." },
      { type: "h2", text: "Documents always needed" },
      {
        type: "ul",
        items: [
          "Death certificate or extract of the deceased.",
          "ID of the deceased and the heirs; tax code of the heirs.",
          "Self-certification of family status and degree of kinship of the heirs.",
          "Heir's IBAN (always required, for refunds or to debit taxes).",
        ],
      },
      { type: "h2", text: "If there are properties" },
      {
        type: "ul",
        items: [
          "Cadastral searches of properties in the succession (we can retrieve them).",
          "Title deeds: notarial deeds, gifts or previous succession declarations.",
          "Floor plans, where needed for the cadastral check.",
        ],
      },
      { type: "h2", text: "If there is a will or special heirs" },
      {
        type: "ul",
        items: [
          "Copy of the published will and any publication record.",
          "Authorisation of the Guardianship Judge where there are minor or incapacitated heirs.",
        ],
      },
      { type: "h2", text: "If there are accounts and investments" },
      {
        type: "ul",
        items: [
          "Certification of balance and holdings of accounts, passbooks and securities at the date of death.",
        ],
      },
      { type: "callout", tone: "info", title: "Missing something? We can often retrieve it", text: "Document retrieval is part of our job: cadastral searches, title deeds and missing data. Ask us." },
      { type: "callout", tone: "warning", title: "Indicative list", text: "This list is indicative and adapts to your case. Lorenzo confirms the final list after reviewing your situation." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Italian inheritance when you live abroad: the complete guide",
    excerpt: "Inherited a house or a bank account in Italy but living in Germany, Switzerland, the UK, the US, Argentina or elsewhere? What really changes, what you need, and how everything is done remotely, without travelling.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "If you live abroad and your parents' house, a plot of land or a bank account remained in Italy, the succession declaration (dichiarazione di successione) must still be filed in Italy, within 12 months of the death. You don't need to travel: the declaration is filed electronically by an authorised intermediary, which is what we are. Our service was built online precisely for people who cannot walk into an office, and living abroad is the case where that matters most." },
      { type: "h2", text: "The two typical cases" },
      {
        type: "ul",
        items: [
          "The deceased lived in Italy and one or more heirs live abroad: the procedure is the ordinary one, only the way documents and signatures are collected changes.",
          "The deceased lived abroad and owned assets in Italy: the declaration must still be filed in Italy, with a few extra rules on the competent office, taxes and applicable law. We cover it in a dedicated guide.",
        ],
      },
      { type: "h2", text: "What changes compared with living in Italy" },
      {
        type: "ul",
        items: [
          "Tax code (codice fiscale): every heir must have one, even if they never lived in Italy. Without it the declaration cannot be transmitted. It can be obtained at the consulate or, faster, in Italy through a proxy given to us.",
          "Foreign documents: a death certificate or a will issued abroad may need an apostille or legalisation and a translation. Within the European Union the rules are simpler.",
          "Signatures: we transmit the declaration with your engagement letter signed remotely. No notarial power of attorney is needed for the declaration alone.",
          "Paying the taxes: they are paid by direct debit from an Italian bank account. If you don't have one, there are solutions, including debiting the firm's account as intermediary.",
          "Time zones and language: we work in writing, on WhatsApp and email, so you reply when you can. The site and our communications are available in several languages.",
        ],
      },
      { type: "h2", text: "How it works, in five steps" },
      {
        type: "ol",
        items: [
          "You fill in the online questionnaire: two minutes, and you immediately know which package you need and what it costs.",
          "You message us on WhatsApp or pay directly. We open your client area with the document list for your case.",
          "You upload documents whenever you like, even as phone photos. We check cadastral data, title deeds and tax codes; if something is missing, we can often retrieve it in Italy.",
          "We confirm taxes and amounts in writing, then you sign the engagement remotely and we transmit the declaration to Agenzia delle Entrate.",
          "You receive the filing receipt and, if there are properties, the cadastral transfer (voltura). Everything stays in your client area.",
        ],
      },
      { type: "callout", tone: "info", title: "You don't need to come to Italy", text: "No step of the succession declaration requires your physical presence. Things that in Italy are done at a counter, such as requesting a tax code or a cadastral search, we do for you with your proxy." },
      { type: "h2", text: "What we actually do for you" },
      {
        type: "ul",
        items: [
          "We request the tax code for heirs who don't have one, by proxy, at Agenzia delle Entrate.",
          "We check the properties in the Cadastre and in the deeds: this is where cases handled from a distance most often get stuck.",
          "We prepare and transmit the declaration and the cadastral transfer as an authorised intermediary.",
          "If you don't have an Italian bank account, we agree on paying the taxes through the firm, with amounts and receipts in writing.",
          "We tell you clearly if any step requires a notary or the consulate, and which one.",
        ],
      },
      { type: "h2", text: "When a notary or the consulate is also needed" },
      { type: "p", text: "The succession declaration is not a notarial deed and does not require one. A notary, or the Italian consulate, which performs some notarial functions for Italian citizens, is needed instead to renounce the inheritance, to accept it with benefit of inventory, to publish a will and to sell the inherited property. If your case involves them, we tell you before, not after." },
      { type: "h2", text: "How much it costs" },
      { type: "p", text: "The packages are the same as for people living in Italy and are shown on the Pricing page: the fee includes the surveyor, the declaration and the cadastral transfer. Statutory taxes are separate for everyone and we tell you the amount before filing. If your case needs extra steps, such as a tax code or a translation, we tell you straight away, with the figure." },
      { type: "callout", tone: "warning", title: "The 12 months apply to you too", text: "The deadline runs from the date of death, not from when you manage to deal with it. If it is close, write to us now: for people abroad, the longest part is often the tax code." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "Italian tax code for an heir living abroad: how to get it",
    excerpt: "Without every heir's codice fiscale the declaration cannot be filed. Who already has one without knowing, how to request it at the consulate or in Italy by proxy, what you need.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "The Italian tax code (codice fiscale) is the single item that most often blocks successions with heirs abroad: the electronic declaration requires one for every heir and legatee, and without it the file is rejected. The good news is that getting one is easier than it seems, and does not require coming to Italy." },
      { type: "h2", text: "You may already have one" },
      { type: "p", text: "Anyone born in Italy, who worked or studied in Italy, has an old health card or is registered with AIRE often already has a tax code, even if unused for years. Check old documents, the health card or a tax return. If you can't find it, with your personal details we can check whether one already exists: a tax code is never issued twice." },
      { type: "h2", text: "How to get one if missing" },
      {
        type: "ol",
        items: [
          "At the Italian consulate of the country where you live: the ordinary route for citizens resident abroad. You file form AA4/8 with a valid ID. Timing depends on the consulate and can be long.",
          "In Italy, at any Agenzia delle Entrate office, through a proxy: form AA4/8 is signed by you, with the proxy section filled in, and the proxy holder files it with their own ID and a copy of yours. This is the route we use, because it is usually the fastest.",
        ],
      },
      { type: "callout", tone: "info", title: "We do it with your proxy", text: "We send you the pre-filled form, you sign it and return it with a copy of your ID. We file it at Agenzia delle Entrate and send you the tax code as soon as it is issued." },
      { type: "h2", text: "What you need" },
      {
        type: "ul",
        items: [
          "A valid passport or identity card (legible copy, front and back).",
          "Full personal details: surname, name, sex, date and place of birth, residential address abroad.",
          "The reason for the request: the succession in Italy. It must be stated on the form.",
          "Form AA4/8 signed, with the proxy section completed if we file it.",
        ],
      },
      { type: "h2", text: "Heirs who are not Italian citizens" },
      { type: "p", text: "The same procedure applies: form AA4/8 can be filed at any Agenzia delle Entrate office through a proxy, with a stated reason. For foreign citizens the Italian consulate only steps in in special cases, so the proxy route in Italy is almost always the simplest." },
      { type: "callout", tone: "warning", title: "Start here if the deadline is close", text: "The tax code is the step with the least predictable timing in the whole procedure. If the death was several months ago, request it now: the rest of the declaration is prepared in parallel." },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "The deceased lived abroad and owned assets in Italy: what to do",
    excerpt: "The declaration is filed in Italy even if the death occurred abroad: which office, which assets are taxed, what the EU Succession Regulation says and when a notary is needed.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "It is the classic situation of many emigrant families: a parent lived for years in Germany, Switzerland or Argentina but left the family home or a rented flat in Italy. If there are assets in Italy, the succession declaration must be filed in Italy, within 12 months of the death, even if the death occurred abroad and even if all the heirs live abroad." },
      { type: "h2", text: "Which assets are taxed" },
      { type: "p", text: "The rule is in the Italian succession tax code (TUS, art. 2). If the deceased was resident in Italy at the time of death, the tax applies to all assets, wherever located. If the deceased was not resident in Italy, the tax applies only to assets located in Italy: real estate, accounts with Italian banks, shares in Italian companies. Assets abroad follow the rules of the country where they are." },
      { type: "callout", tone: "info", title: "Double taxation", text: "Italy has inheritance-tax treaties with only a few countries, including France, the United Kingdom and the United States. Otherwise, what you pay in Italy on Italian assets must be coordinated with the estate filing in your country of residence: worth checking with a local adviser." },
      { type: "h2", text: "Which office is competent" },
      { type: "p", text: "If the deceased had lived in Italy before moving abroad, the competent office is the Agenzia delle Entrate office of the last Italian residence. If they were never resident in Italy or the last residence is unknown, a Rome office designated by the Agency is competent. With electronic filing we handle this detail when preparing the declaration." },
      { type: "h2", text: "How it is filed" },
      { type: "p", text: "Electronically through an authorised intermediary, exactly as for people living in Italy: we collect documents and signatures remotely and transmit the file. The law allows residents abroad, only if electronic filing is impossible, to post the paper form by registered mail: an exception that is almost never needed in practice." },
      { type: "h2", text: "Who inherits: the applicable law" },
      { type: "p", text: "The tax side and the civil side are two different things. Who the heirs are, and in which shares, is determined by the law applicable to the succession. In the European Union, Regulation 650/2012 applies: for deaths from 17 August 2015, the law of the country where the deceased was habitually resident governs, unless the will chose the law of the country of nationality. So an Italian resident in Germany without a will is inherited under German law, including for the house in Italy. The United Kingdom, Ireland and Denmark do not apply the Regulation; for non-EU countries, Italian private international law rules apply." },
      { type: "callout", tone: "warning", title: "Where our work ends", text: "We prepare and transmit the declaration and the cadastral transfer for the assets in Italy. If the succession is governed by foreign law, if there is a foreign will to enforce or a European Certificate of Succession to obtain, a notary or a lawyer is also needed: we tell you at the start, with names and steps, not halfway through." },
      { type: "h2", text: "The extra documents" },
      {
        type: "ul",
        items: [
          "Death certificate issued abroad: if the deceased was an Italian citizen, the record must be registered in the Italian municipality through the consulate, and an Italian certificate is then issued. Otherwise, the foreign certificate with apostille or legalisation and translation is needed, subject to EU simplifications.",
          "Proof of the deceased's residence abroad, for example AIRE registration or a residence certificate from the foreign country.",
          "Tax code of the deceased and of all heirs: non-Italian heirs must have one too.",
          "The will, if any, with its publication or a European Certificate of Succession.",
        ],
      },
      { type: "h2", text: "First-home relief" },
      { type: "p", text: "Mortgage and cadastral taxes on the inherited property can be reduced with the first-home relief, but for people living abroad the rules are specific and changed in 2023: they depend on where the property is and on the heir's ties with Italy. We check it case by case before calculating the taxes." },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "Documents from abroad: apostille, translations and remote signatures",
    excerpt: "Foreign death certificate, foreign will, non-Italian ID documents: when an apostille, legalisation or sworn translation is needed, and how everything is signed without coming to Italy.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "In a succession with heirs or deceased abroad, almost all documents are the same as in an Italian case. Those that may come from another country are few but delicate: the death certificate if the death occurred abroad, a foreign will, the heirs' ID documents and, in some cases, civil-status certificates. Here is what is really needed for Agenzia delle Entrate and the Cadastre to accept them." },
      { type: "h2", text: "Three rules depending on the country" },
      {
        type: "table",
        headers: ["Issuing country", "Legalisation", "Translation"],
        rows: [
          ["European Union", "Not needed: Regulation 2016/1191 removes apostille and legalisation for civil-status certificates", "Can be avoided by requesting the multilingual standard form together with the certificate"],
          ["Countries of the 1961 Hague Convention (e.g. United Kingdom, United States, Switzerland, Argentina, Brazil, Australia)", "Apostille, affixed by the authority of the issuing country", "Sworn translation in Italy or certified by the Italian consulate"],
          ["Other countries", "Legalisation at the Italian consulate in the issuing country", "Sworn translation in Italy or certified by the Italian consulate"],
        ],
      },
      { type: "h2", text: "The death certificate" },
      { type: "p", text: "If the deceased was an Italian citizen and died abroad, the simplest route is to have the death record registered in the Italian municipality through the consulate: from then on the certificate is issued by the municipality, in Italian, and neither apostille nor translation is needed. If the deceased was not Italian, the foreign certificate is used with the rules in the table." },
      { type: "h2", text: "A foreign will" },
      { type: "p", text: "A will drawn up abroad normally has to be published or enforced in Italy through a notary, with a sworn translation and, where needed, legalisation. It is one of the few steps that requires a professional other than us: we point you to one straight away and coordinate the declaration with their timing." },
      { type: "h2", text: "Non-Italian ID documents" },
      { type: "p", text: "A valid foreign passport or identity card is fine for the succession declaration and for the tax code request. A legible copy, front and back, is enough; no translation." },
      { type: "h2", text: "Signatures: what is needed and what isn't" },
      {
        type: "ul",
        items: [
          "For the succession declaration and the cadastral transfer no notarial power of attorney is needed: we transmit them as intermediary, with your engagement signed remotely in the client area or returned signed with a copy of your ID.",
          "For the tax code, the proxy included in form AA4/8, signed by you, is enough.",
          "A notary or the Italian consulate, which performs notarial functions for Italian citizens, is needed instead to renounce the inheritance, to accept it with benefit of inventory and to sign a power of attorney to sell the property.",
        ],
      },
      { type: "callout", tone: "info", title: "Photos first, originals later", text: "For the initial checks, photos or scans uploaded to the client area are enough. Originals, or copies with apostille and translation, are requested only for the documents that really require them, and we tell you beforehand." },
      { type: "callout", tone: "warning", title: "Mind the timing of apostilles and translations", text: "Between requesting the certificate, the apostille and the sworn translation, weeks can pass. If the 12-month deadline is close, start with these documents while we prepare the rest." },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "Paying Italian inheritance taxes from abroad, without an Italian bank account",
    excerpt: "Taxes are paid by direct debit from an Italian account. If you live abroad and don't have one, here are the three possible solutions, including payment through the firm as intermediary.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "For people living abroad, paying the taxes is often the most annoying practical hurdle: the amounts due with the electronic declaration are paid by direct debit from an Italian bank account, and many emigrants no longer have one. Here is which taxes are paid, how, and the solutions when the Italian account is missing." },
      { type: "h2", text: "Which taxes are paid" },
      {
        type: "ul",
        items: [
          "With the declaration, if there are properties: mortgage tax (2%) and cadastral tax (1%) on the cadastral value, with a minimum of 200 euros each, plus stamp duty and special fees. They are self-assessed and paid at the time of filing.",
          "Inheritance tax proper only if the estate exceeds the allowances: 1 million euros for each child or for the spouse (4% rate), 100,000 euros for siblings (6%), no allowance for others (6% or 8%). For successions opened from 2025 it is calculated by the taxpayer in the declaration and paid within 90 days of the filing deadline, or immediately together with the rest.",
        ],
      },
      { type: "h2", text: "How payment works with electronic filing" },
      { type: "p", text: "Self-assessed amounts are paid by direct debit from a current account held with a bank partnered with Agenzia delle Entrate or with Poste Italiane. The account may belong to the declarant or to the person in charge of the electronic transmission, i.e. the intermediary. The declaration states the IBAN and the tax code of the account holder." },
      { type: "h2", text: "No Italian account? Three solutions" },
      {
        type: "ol",
        items: [
          "A co-heir resident in Italy pays for everyone: the declaration can state the account of one of the heirs. The simplest solution when available.",
          "The firm pays as intermediary: you wire us in advance the exact amount of the taxes, which we confirm in writing, and we pay them by debit from the firm's account at the time of filing. You receive the receipts. This is an option we agree on case by case.",
          "F24 form in Italy through a proxy: possible when the declaration is filed at the office, but it is the slowest route and we use it only if the first two are not feasible.",
        ],
      },
      { type: "callout", tone: "info", title: "Everything in writing, beforehand", text: "Before filing we send you the tax calculation item by item. You pay only that figure, and only after seeing it. Taxes go to the State, not to us: the package fee is separate." },
      { type: "h2", text: "Transfers from abroad and exchange rates" },
      { type: "p", text: "Taxes are in euros. If your account is in another currency, consider your bank's fees and exchange rate: SEPA transfers from euro-area countries and Switzerland cost little, from other countries it is better to check first. The package fee, on the other hand, is paid on the site by card through Stripe, from any country." },
      { type: "h2", text: "Successions opened before 2025" },
      { type: "p", text: "For deaths up to 31 December 2024, inheritance tax, if due, is still calculated by Agenzia delle Entrate and a payment notice arrives, to be paid with an F24 form within 60 days. In this case too, if you don't have an Italian account, we can handle the payment through the firm." },
      { type: "callout", tone: "warning", title: "Amounts change", text: "Rates, allowances and minimums are those in force at the date of this guide. We always check the specific case and the official sources before calculating the taxes." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "fai-da-te-precompilata": {
    title: "Pre-filled succession: is DIY worth it?",
    excerpt: "The free declaration on the Agency site really exists. When it makes sense and when it doesn't.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Let's say it upfront, honestly: you can file the succession declaration for free yourself. It is an honest option — with limits." },
      { type: "h2", text: "When DIY may be enough" },
      { type: "p", text: "If the case is truly simple (few direct heirs, no property or one very simple property) and you are comfortable with SPID and forms, DIY can work." },
      { type: "h2", text: "Where DIY becomes risky" },
      {
        type: "table",
        headers: ["Aspect", "DIY", "With us"],
        rows: [
          ["Time required", "Hours and SPID on you", "We take care of it"],
          ["Cadastral data check", "Your responsibility", "Done by a surveyor"],
          ["Tax calculation", "On your own", "We do it before filing"],
          ["Support", "None", "A real person"],
          ["Risk of penalties for errors", "Your", "Handled"],
        ],
      },
      { type: "callout", tone: "warning", title: "The weak point is cadastral data", text: "The pre-filled form does not validate cadastral data: that is exactly where most cases get stuck or go wrong. Parcels, subunits, outbuildings and title deeds must be checked — surveyor's work." },
      { type: "p", text: "In short: if your case is simple and you feel confident, DIY is honest. If there are properties, doubts or little time, delegating removes the risk of errors and penalties. In any case, we check your situation for free before you decide." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleEn(slug: string): ArticleEnOverlay | undefined {
  return articlesEn[slug];
}
