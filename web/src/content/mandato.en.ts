import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  English courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsEn({
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
    `I, the undersigned ${signerName} (hereinafter, the "Client"), appoint ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, VAT no. P.IVA ${studio.piva ?? ""}, tax code C.F. ${
      studio.cf ?? ""
    }, registered with ${
      studio.albo ?? "the professional board"
    }, PEC ${pec}, email ${email} (hereinafter, the "Professional"), to carry out the professional engagement described below, relating to case ${practiceCode}.`,

    "1. SUBJECT. The engagement covers assistance in preparing the succession declaration and filing it electronically with Agenzia delle Entrate, which the Professional performs as an authorised Entratel intermediary, as well as related steps included in the purchased package (e.g. cadastral transfers / volture). Activities not included in the package are excluded and may be the subject of a separate quote.",

    "2. FEE. The fee is that of the purchased package, shown in the \"Your purchase\" section of the client area and already paid at order. Taxes and duties owed to the State (succession tax, mortgage tax, cadastral tax, stamps, special duties) are NOT included in the fee: they are calculated on the specific situation, notified to the Client before filing the declaration, and paid by the Client, with no mark-up by the Professional.",

    "3. CLIENT OBLIGATIONS. The Client undertakes to provide true, complete and timely data and documents, and remains responsible for their accuracy. Delivery deadlines start when the necessary documentation is complete and validated by the Professional, and do not include third-party times (Agenzia delle Entrate, Cadastre, banks).",

    "4. CARE AND LIABILITY. The Professional performs the engagement with the professional care required by the nature of the activity (obligation of means), with tax supervision by a chartered accountant. For anything not provided in this mandate, the Terms of sale accepted at purchase apply, including limitations of liability, package changes and settlement.",

    "5. WITHDRAWAL. The right of withdrawal under arts. 52–59 of the Consumer Code remains as set out in the Terms of sale and the Withdrawal page of the site. If withdrawal occurs after work has started, the Client pays an amount proportional to the service already provided.",

    "6. PERSONAL DATA. Processing of the Client's personal data and of persons involved in the case (including the deceased and other heirs) is described in the Privacy notice on the site, which the Client declares to have read. The Client warrants they are authorised to communicate third-party data.",

    "7. APPOINTMENT AND SIGNATURE. This mandate is granted remotely. Signature is, at the Client's choice, electronic (selecting the acceptance box and the sign button in the client area, with date and time recorded) or handwritten on the downloaded document followed by upload of the signed copy.",

    "(The Italian version of this mandate is legally binding. Any translation is for convenience only; in case of discrepancy, the Italian version prevails.)",
  ];
}

export function buildMandatoTextEn(params: MandatoParams): string {
  return (
    `Professional mandate — Case ${params.practiceCode}\n\n` +
    buildMandatoParagraphsEn(params).join("\n\n") +
    `\n\nPlace and date: _________________________\n\nClient signature: _________________________\n`
  );
}
