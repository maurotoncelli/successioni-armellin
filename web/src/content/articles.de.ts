import type { ArticleBlock, ArticleSource } from "./articles";

/*
  German courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleDeOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "Steuerlicher Teil von Steuerberatern geprüft";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Erbschaftserklärung",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - Wie Steuern gezahlt werden",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS Gesetzesdekret 346/1990",
  href: "https://www.normattiva.it",
};

export const articlesDe: Record<string, ArticleDeOverlay> = {
  "successione-cosa-e": {
    title: "Erbschaft: Was ist das und wann muss sie eingereicht werden?",
    excerpt: "Ein klarer Leitfaden: Wer muss es tun, Fristen und Risiken bei Nichteinreichung.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Die Erbschaftserklärung ist die steuerliche Meldung an die Agenzia delle Entrate über den vom Verstorbenen (de cuius) hinterlassenen und an die Erben übergegangenen Nachlass. Sie ist keine Annahme der Erbschaft und keine notarielle Urkunde: Sie erfasst das Erbschaftsvermögen, regelt fällige Steuern und aktualisiert bei Immobilien das Kataster (Umschreibung)." },
      { type: "h2", text: "Wer muss sie einreichen" },
      { type: "p", text: "Verpflichtet sind Erben, Berufenen und Vermächtnisnehmer (oder deren gesetzliche Vertreter) sowie Verwalter, Kuratoren der ruhenden Erbschaft, Testamentsvollstrecker und Treuhänder." },
      {
        type: "ul",
        items: [
          "Es genügt, wenn einer der Verpflichteten sie einreicht: Die Erklärung gilt für alle.",
          "Übermittlung durch einen Entratel-berechtigten Vermittler (z. B. berechtigten Geometer) ist möglich — das machen wir.",
        ],
      },
      { type: "h2", text: "Bis wann einreichen" },
      { type: "p", text: "Ordentliche Frist: 12 Monate ab Eröffnung der Erbschaft, in der Regel Todestag (Art. 31 TUS). In Sonderfällen (ruhende Erbschaft, Annahme mit Inventarvorteil, Kurator) ab rechtlicher Handlungsfähigkeit." },
      { type: "callout", tone: "warning", title: "Fristen beachten", text: "Verspätete Einreichung kann Bußgelder und Zinsen bedeuten. Naht die 12-Monats-Frist, lieber sofort handeln — wir halten die Fristen ein." },
      { type: "h2", text: "Wie heute eingereicht wird" },
      { type: "p", text: "Elektronisch mit Software der Agenzia delle Entrate. Die Datei (.SUC) sendet der Berechtigte oder meist ein Entratel-Vermittler. Papier-Modell 4 nur in Restfällen (Tod vor 3.10.2006 oder Ausland ohne elektronische Übermittlung)." },
      { type: "h2", text: "Was droht bei Nichteinreichung (oder Fehlern)" },
      { type: "p", text: "Ausbleibende Einreichung: Bußgeld nach Steuerschuld plus Zinsen; verspätete oder unrichtige Einreichung: reduzierte oder proportionale Bußgelder. Beträge ändern sich — offizielle Quellen und Fachperson prüfen." },
      { type: "callout", tone: "info", title: "Nicht immer Pflicht", text: "Manchmal ist keine Erklärung nötig. In unserem Befreiungs-Leitfaden erklärt; kostenlose Prüfung Ihres Falls vor Zahlung." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "Wann Sie KEINE Erbschaftserklärung abgeben müssen",
    excerpt: "Gesetzliche Befreiung: drei Bedingungen gleichzeitig — warum schon eine Immobilie die Pflicht auslöst.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Nicht immer Pflicht zur Erbschaftserklärung. Gesetz (Art. 28 Abs. 7 TUS): Befreiung bei DREI gleichzeitigen Bedingungen. Fehlt eine, gilt die Pflicht wieder." },
      { type: "h2", text: "Die drei Befreiungsbedingungen" },
      {
        type: "ol",
        items: [
          "Nachlass an Ehepartner und/oder Verwandte in gerader Linie (Kinder, Eltern).",
          "Erbschaftsvermögen nicht über 100.000 Euro.",
          "Keine Immobilien oder dingliche Rechte an Immobilien im Nachlass.",
        ],
      },
      { type: "callout", tone: "warning", title: "Eine Immobilie genügt", text: "Schon eine Immobilie — auch geringen Werts — löst die Pflicht aus, unabhängig vom Gesamtwert. Haus, Grundstück oder Garage ändern alles." },
      { type: "h2", text: "Weitere Fälle ohne Pflicht" },
      { type: "p", text: "Weitere Befreiungen, z. B. Verzicht vor Ablauf von 12 Monaten (Art. 28 Abs. 5). Bedingungen können sich ändern — Prüfung am konkreten Fall." },
      { type: "callout", tone: "info", title: "Sagen wir es kostenlos", text: "Scheint keine Erbschaft nötig, verkaufen wir keinen unnützen Service. Endgültige Prüfung am konkreten Fall." },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "Wie viel Erbschaftsteuer zahlen Sie",
    excerpt: "Freibeträge, Sätze und Selbstanzeige 2025: Wer zahlt, warum direkte Erben oft null zahlen.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Wichtig: Servicepreis (Honorar) und Steuern sind getrennt. Steuern trägt der Erbe, getrennt vom Honorar — berechnet und mitgeteilt VOR Einreichung." },
      { type: "h2", text: "Erbschaftsteuer: Sätze und Freibeträge" },
      { type: "p", text: "Erbschaftsteuer nur auf den Freibetrag übersteigenden Wert, abhängig vom Verwandtschaftsgrad." },
      {
        type: "table",
        headers: ["Begünstigter", "Satz", "Freibetrag (je Begünstigten)"],
        rows: [
          ["Ehepartner und Verwandte in gerader Linie (Kinder, Eltern)", "4%", "1.000.000 EUR"],
          ["Geschwister", "6%", "100.000 EUR"],
          ["Andere Verwandte bis 4. Grad und Schwiegerverwandte (gesetzliche Grenzen)", "6%", "nessuna"],
          ["Andere Personen (Fremde)", "8%", "nessuna"],
          ["Personen mit schwerer Behinderung (Gesetz 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "Für direkte Erben oft null", text: "Mit Ehepartner und Kindern je 1.000.000 Euro Freibetrag — in den meisten Familienerbschaften null Erbschaftsteuer." },
      { type: "h2", text: "Hypotheken- und Katastersteuer (nur bei Immobilien)" },
      { type: "p", text: "Bei Immobilien: Hypothekensteuer (2 % Katasterwert, min. 200 Euro) und Katastersteuer (1 %, min. 200 Euro). Mit Erstwohnungs-Vergünstigung je 200 Euro Festbetrag. Dazu Stempel, Registergebühren, feste Katasterabgaben." },
      { type: "h2", text: "Selbstanzeige 2025: was sich geändert hat" },
      { type: "p", text: "Ab Erbschaften ab 1.1.2025: Erbschaftsteuer selbst in der Erklärung (nicht mehr Amtsfestsetzung). Zahlung innerhalb 90 Tagen nach Einreichungsfrist, per F24." },
      {
        type: "ul",
        items: [
          "Ratenzahlung ab 1.000 Euro: mindestens 20 % Anzahlung, Rest in 8 Quartalsraten (bis 12 über 20.000 Euro), mit Zinsen.",
          "Vor 2025: Amtsfestsetzung mit Bescheid, Zahlung innerhalb 60 Tagen nach Zustellung.",
        ],
      },
      { type: "h2", text: "Konkretes Beispiel (anonymisierter Fall)" },
      { type: "p", text: "Familie mit Ehepartner und 2 Kindern, Nachlass ca. 117.000 Euro (Immobilien, Wertpapiere, Liquidität), Erstwohnung und Katasterumschreibung. Steuern gesamt ca. 1.200 Euro (Hypothek, Kataster, Stempel), Erbschaftsteuer null wegen Freibeträgen. Servicehonorar separat." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "Erstwohnungs-Vergünstigung bei Erbschaft: So funktioniert es",
    excerpt: "Wann Festbeträge statt Prozentsätze, wer Anspruch hat, was nötig ist, um den Vorteil nicht zu verlieren.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Begünstigte Immobilie für mindestens einen Erben: Hypotheken- und Katastersteuer je 200 Euro statt 2 % und 1 % des Katasterwerts. Bei höheren Werten deutliche Ersparnis." },
      { type: "h2", text: "Wer kann profitieren" },
      { type: "p", text: "Mindestens ein Erbe mit gesetzlichen Erstwohnungs-Voraussetzungen (kurz: keine weiteren Rechte an Immobilien in derselben Gemeinde, Vergünstigung nicht anderswo genutzt, Wohnsitz in der Gemeinde der Immobilie fristgerecht). Ein qualifizierter Erbe genügt." },
      { type: "callout", tone: "warning", title: "Voraussetzungen prüfen", text: "Vergünstigung in Feld EH der Erklärung korrekt ankreuzen. Fehlen oder Entfallen: Verlust mit Steuernachforderung und Bußgeldern — technische Prüfung vorher sinnvoll." },
      { type: "h2", text: "Was wir prüfen" },
      { type: "p", text: "Als Geometer: Katasterprüfung — Parzellen, Untereinheiten, Kategorie, Ertrag, Erwerbsurkunden. Erstwohnung korrekt erklärt, damit die Vergünstigung Bestand hat." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "Dokumente für die Erbschaft: vollständige Liste",
    excerpt: "Typische Dokumente und Beschaffung, Fall für Fall. Nicht immer alle nötig — abhängig von Ihrer Situation.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Dokumente variieren je Fall — nie alle gleichzeitig. Häufigste unten nach Situation. Fehlendes oft von uns beschaffbar (Auszüge, Urkunden, fehlende Daten)." },
      { type: "h2", text: "Immer erforderliche Dokumente" },
      {
        type: "ul",
        items: [
          "Sterbeurkunde oder Auszug (oder Selbstauskunft wo zulässig).",
          "Ausweis und C.F. des Verstorbenen und aller Erben.",
          "Selbstauskunft Familienstand und Verwandtschaftsgrad der Erben.",
        ],
      },
      { type: "h2", text: "Bei Immobilien" },
      {
        type: "ul",
        items: [
          "Katasterauszüge der Erbschaftsimmobilien (beschaffen wir).",
          "Erwerbsurkunden: Notarurkunden, Schenkungen oder frühere Erbschaftserklärungen.",
          "Grundrisse, wo für Katasterprüfung nötig.",
        ],
      },
      { type: "h2", text: "Bei Testament oder besonderen Erben" },
      {
        type: "ul",
        items: [
          "Kopie des veröffentlichten Testaments und ggf. Protokoll der Veröffentlichung.",
          "Genehmigung des Vormundschaftsrichters bei minderjährigen oder geschäftsunfähigen Erben.",
        ],
      },
      { type: "h2", text: "Bei Konten und Anlagen" },
      {
        type: "ul",
        items: [
          "Saldo- und Bestandsbestätigung von Konten, Sparbüchern und Wertpapieren zum Todestag.",
          "IBAN des Erben für Erstattungen oder Steuerabbuchung.",
        ],
      },
      { type: "callout", tone: "info", title: "Fehlt etwas? Oft können wir es beschaffen", text: "Dokumentenbeschaffung gehört zu unserer Arbeit: Katasterauszüge, Erwerbsurkunden und fehlende Daten holen wir bei Behörden und Banken ein." },
      { type: "callout", tone: "warning", title: "Orientierungsliste", text: "Diese Liste ist orientierend und passt sich Ihrem Fall an. Lorenzo bestätigt die endgültige Liste nach Prüfung Ihrer Situation." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Im Ausland lebende Erben: Aktenführung",
    excerpt: "Was sich ändert, wenn ein Erbe außerhalb Italiens lebt, und wie wir die Akte remote begleiten — auch in Ihrer Sprache.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Ein im Ausland lebender Erbe ist kein Problem: Die Erbschaftserklärung betrifft Vermögen in Italien und wird bei Agenzia delle Entrate eingereicht. Vor allem Dokumente und Unterschriften regeln wir vollständig remote." },
      { type: "h2", text: "Was wirklich nötig ist" },
      {
        type: "ul",
        items: [
          "Italienische Steuernummer (C.F.) jedes Erben (auch im Ausland): fehlt sie, kann sie beantragt werden.",
          "Ausweisdokumente und persönliche Daten aller Erben.",
          "Mandat oder Vollmacht für den Vermittler, da ein Erbe einreicht und wir in seinem Namen übermitteln.",
        ],
      },
      { type: "p", text: "Auslandsansässige können ausnahmsweise das Papierformular nur bei Unmöglichkeit der elektronischen Übermittlung nutzen; in der überwiegenden Mehrheit übermitteln wir elektronisch als berechtigter Vermittler." },
      { type: "h2", text: "Alles remote, auch in Ihrer Sprache" },
      { type: "p", text: "Fragebogen, Dokumente, Mitteilungen und Unterschriften online — Rückkehr nach Italien nicht nötig. Begleitung per E-Mail oder Messenger in Ihrer Sprache; bei Bedarf Anruf mit Übersetzung. Wichtiges (Beträge, Fristen, Dokumente) schriftlich bestätigt; offizielle Dokumente italienisch." },
      { type: "callout", tone: "info", title: "Zeitzone und Entfernung spielen keine Rolle", text: "Dokumente jederzeit im Persönlichen Bereich hochladen, auch per Handy-Foto. Wir prüfen und halten Fristen ein." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "fai-da-te-precompilata": {
    title: "Vorausgefüllte Erbschaft: lohnt sich Selbst erledigen?",
    excerpt: "Die kostenlose Erklärung auf der Agenzia-Website existiert wirklich. Wann sinnvoll und wann Delegation.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Ehrlich gesagt: Erbschaftserklärung kostenlos selbst möglich. Agenzia bietet Web-Assistent für einfache Fälle und offizielle Software für komplexere. Legitime Option." },
      { type: "h2", text: "Wann Selbst erledigen reichen kann" },
      { type: "p", text: "Wirklich einfacher Fall (wenige direkte Erben, keine oder eine einfache Immobilie, klare Katasterdaten) und SPID/Online-Vertrautheit — vorausgefüllt kann genügen." },
      { type: "h2", text: "Wo Selbst erledigen riskant wird" },
      {
        type: "table",
        headers: ["Aspekt", "Selbst erledigen", "Mit uns"],
        rows: [
          ["Zeitaufwand", "Zeit und SPID in Ihrer Verantwortung", "Wir kümmern uns darum"],
          ["Katasterdatenprüfung", "In Ihrer Verantwortung", "Erledigt von einem Geometer"],
          ["Steuerberechnung", "Allein", "Wir erledigen das vor der Einreichung"],
          ["Support", "Keine", "Eine echte Person"],
          ["Bußgeldrisiko bei Fehlern", "Ihr", "Bearbeitet"],
        ],
      },
      { type: "callout", tone: "warning", title: "Schwachstelle: Katasterdaten", text: "Vorausgefüllt validiert keine Katasterdaten — dort hängen die meisten Akten. Parzellen, Untereinheiten, Anbauten und Erwerbsurkunden prüfen — Geometersache." },
      { type: "p", text: "Kurz: einfacher Fall und Sicherheit — Selbst erledigen ist ehrlich. Immobilien, Zweifel oder wenig Zeit — Delegation vermeidet Fehler und Bußgelder. Kostenlose Prüfung vor Ihrer Entscheidung." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleDe(slug: string): ArticleDeOverlay | undefined {
  return articlesDe[slug];
}
