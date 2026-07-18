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

const REVIEWED = "Tax aspects reviewed by accountants";

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
      { type: "callout", tone: "info", title: "It is not always required", text: "In some cases the declaration is not even mandatory. We explain this in the dedicated exemption guide: we check your case for free before you pay." },
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
          "Death certificate or extract of the deceased (or self-certification where allowed).",
          "ID document and tax code of the deceased and of all heirs.",
          "Self-certification of family status and degree of kinship of the heirs.",
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
          "Heir's IBAN for any refunds or for tax debit.",
        ],
      },
      { type: "callout", tone: "info", title: "Missing something? We can often retrieve it", text: "Document retrieval is part of our job: cadastral searches, title deeds and missing data. Ask us." },
      { type: "callout", tone: "warning", title: "Indicative list", text: "This list is indicative and adapts to your case. Lorenzo confirms the final list after reviewing your situation." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Heirs living abroad: how to manage the case",
    excerpt: "What changes when an heir lives outside Italy and how we follow the case remotely.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Having an heir who lives abroad is not a problem: the succession declaration concerns Italian assets and can be handled entirely remotely." },
      { type: "h2", text: "What you really need" },
      {
        type: "ul",
        items: [
          "The Italian tax code of every heir (including those living abroad): if missing, it can be obtained.",
          "ID documents and personal details of all heirs.",
          "A mandate or power of attorney to the intermediary, since the person filing is an heir and/or their representative.",
        ],
      },
      { type: "p", text: "Residents abroad may, exceptionally, file the paper form only if electronic filing is impossible; we handle the electronic route for you." },
      { type: "h2", text: "Fully remote, in your language too" },
      { type: "p", text: "Questionnaire, documents, communications and signatures happen online: you don't need to return to Italy for the declaration." },
      { type: "callout", tone: "info", title: "Time zone and distance don't matter", text: "Upload documents whenever you like from your client area, even with phone photos. We take care of the rest." },
    ],
    sources: [FONTE_ADE_SCHEDA],
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
