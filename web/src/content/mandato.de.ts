import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  German courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsDe({
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
    `Ich, der/die Unterzeichnete ${signerName} (nachfolgend der „Klient“), beauftrage ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, P.IVA ${studio.piva ?? ""}, C.F. ${
      studio.cf ?? ""
    }, eingetragen bei ${
      studio.albo ?? "der Berufskammer"
    }, PEC ${pec}, E-Mail ${email} (nachfolgend der „Professionelle“), mit dem nachstehend beschriebenen beruflichen Auftrag, der die Akte ${practiceCode} betrifft.`,

    "1. GEGENSTAND. Der Auftrag umfasst die Unterstützung bei der Erstellung der Erbschaftserklärung und deren elektronische Übermittlung an die Agenzia delle Entrate, die der Professionelle als zugelassener Entratel-Vermittler vornimmt, sowie die in dem erworbenen Paket vorgesehenen damit verbundenen Schritte (z. B. katasterliche Umschreibungen / volture). Nicht im Paket enthaltene Tätigkeiten sind ausgeschlossen und können Gegenstand eines gesonderten Kostenvoranschlags sein.",

    "2. HONORAR. Das Honorar entspricht dem erworbenen Paket, angegeben im Bereich „Ihr Kauf“ des persönlichen Bereichs und bereits bei der Bestellung bezahlt. An den Staat geschuldete Steuern und Abgaben (Erbschaftsteuer, Hypotheken- und Katastersteuern, Stempel, Sonderabgaben) sind NICHT im Honorar enthalten: sie werden nach dem konkreten Fall berechnet, dem Klienten vor der Einreichung der Erklärung mitgeteilt und vom Klienten gezahlt, ohne Aufschlag seitens des Professionellen.",

    "3. PFLICHTEN DES KLIENTEN. Der Klient verpflichtet sich, korrekte, vollständige und rechtzeitige Daten und Unterlagen bereitzustellen und bleibt für deren Richtigkeit verantwortlich. Lieferfristen beginnen, sobald die erforderlichen Unterlagen vollständig sind und vom Professionellen geprüft wurden, und umfassen nicht die Fristen Dritter (Agenzia delle Entrate, Kataster, Banken).",

    "4. SORGFALT UND HAFTUNG. Der Professionelle führt den Auftrag mit der beruflich gebotenen Sorgfalt aus (Mittelverpflichtung), mit steuerlicher Aufsicht durch einen vereidigten Steuerberater. Für alles, was in diesem Mandat nicht geregelt ist, gelten die bei Kauf akzeptierten Verkaufsbedingungen, einschließlich Haftungsbeschränkungen, Paketänderung und Abrechnung.",

    "5. WIDERRUF. Das Widerrufsrecht nach Art. 52–59 des Verbraucherschutzgesetzes bleibt wie in den Verkaufsbedingungen und auf der Widerrufsseite der Website angegeben. Bei Widerruf nach Beginn der Arbeiten zahlt der Klient einen Betrag proportional zur bereits erbrachten Leistung.",

    "6. PERSONENBEZOGENE DATEN. Die Verarbeitung der personenbezogenen Daten des Klienten und der am Fall beteiligten Personen (einschließlich des Verstorbenen und anderer Erben) ist in der auf der Website verfügbaren Datenschutzerklärung beschrieben, die der Klient als gelesen erklärt. Der Klient gewährleistet, zur Mitteilung von Daten Dritter befugt zu sein.",

    "7. ERTEILUNG UND UNTERSCHRIFT. Dieses Mandat wird aus der Ferne erteilt. Die Unterschrift erfolgt nach Wahl des Klienten elektronisch (Annahme-Checkbox und Unterschriftsbutton im persönlichen Bereich, mit Datum und Uhrzeit) oder handschriftlich auf dem heruntergeladenen Dokument mit anschließendem Upload der unterschriebenen Kopie.",

    "(Die italienische Fassung dieses Mandats ist rechtlich verbindlich. Jede Übersetzung dient nur der Orientierung; bei Widersprüchen gilt die italienische Fassung.)",
  ];
}

export function buildMandatoTextDe(params: MandatoParams): string {
  return (
    `Berufliches Mandat — Akte ${params.practiceCode}\n\n` +
    buildMandatoParagraphsDe(params).join("\n\n") +
    `\n\nOrt und Datum: _________________________\n\nUnterschrift des Klienten: _________________________\n`
  );
}
