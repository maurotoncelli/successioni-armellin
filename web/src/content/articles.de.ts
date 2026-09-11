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

const REVIEWED = "";

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
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - Wie und wann die Erklärung eingereicht wird",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Antrag codice fiscale (Formular AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/codice-fiscale-e-tessera-sanitaria/modello-e-istruzioni-cittadini",
};
const FONTE_UE_650: ArticleSource = {
  label: "Verordnung (EU) Nr. 650/2012 über grenzüberschreitende Erbschaften",
  href: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Verordnung (EU) 2016/1191 - Öffentliche Urkunden ohne Legalisation",
  href: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "Italienisches Außenministerium - Konsularische Dienste für Italiener im Ausland",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
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
      { type: "callout", tone: "info", title: "Nicht immer Pflicht", text: "Manchmal ist keine Erklärung nötig. In unserem Befreiungs-Leitfaden erklärt; kostenlose Prüfung Ihres Falls." },
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
          "Sterbeurkunde oder Auszug des Verstorbenen.",
          "Ausweis des Verstorbenen und der Erben; Steuernummer der Erben.",
          "Selbstauskunft Familienstand und Verwandtschaftsgrad der Erben.",
          "IBAN des Erben (immer erforderlich, für Erstattungen oder die Steuerabbuchung).",
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
        ],
      },
      { type: "callout", tone: "info", title: "Fehlt etwas? Oft können wir es beschaffen", text: "Dokumentenbeschaffung gehört zu unserer Arbeit: Katasterauszüge, Erwerbsurkunden und fehlende Daten holen wir bei Behörden und Banken ein." },
      { type: "callout", tone: "warning", title: "Orientierungsliste", text: "Diese Liste ist orientierend und passt sich Ihrem Fall an. Lorenzo bestätigt die endgültige Liste nach Prüfung Ihrer Situation." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Erbschaft in Italien, wenn Sie im Ausland leben: der vollständige Leitfaden",
    excerpt: "Haben Sie ein Haus oder ein Konto in Italien geerbt, leben aber in Deutschland, der Schweiz, Großbritannien, Argentinien oder anderswo? Was sich wirklich ändert, was Sie brauchen und wie alles aus der Ferne erledigt wird — ohne nach Italien zurückzukehren.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Wenn Sie im Ausland leben und in Italien das Elternhaus, ein Grundstück oder ein Konto geblieben ist, muss die dichiarazione di successione (Erbschaftserklärung) dennoch in Italien innerhalb von 12 Monaten nach dem Tod eingereicht werden. Eine Rückreise ist nicht nötig: Die Erklärung wird elektronisch von einem berechtigten Vermittler übermittelt — also von uns. Unser Service wurde online genau für Menschen entwickelt, die nicht ins Büro kommen können; wer im Ausland lebt, ist der Fall, in dem das am meisten zählt." },
      { type: "h2", text: "Die zwei typischen Fälle" },
      {
        type: "ul",
        items: [
          "Der Verstorbene lebte in Italien und ein oder mehrere Erben leben im Ausland: Das Verfahren ist das gewöhnliche, nur die Art, Dokumente und Unterschriften zu sammeln, ändert sich.",
          "Der Verstorbene lebte im Ausland und hatte Vermögen in Italien: Die Erklärung muss trotzdem in Italien eingereicht werden, mit einigen zusätzlichen Regeln zu zuständigem Amt, Steuern und anwendbarem Recht. Dazu gibt es einen eigenen Leitfaden.",
        ],
      },
      { type: "h2", text: "Was sich gegenüber einem Leben in Italien ändert" },
      {
        type: "ul",
        items: [
          "Codice fiscale (italienische Steuernummer): Jeder Erbe braucht eine, auch wenn er nie in Italien gelebt hat. Ohne sie kann die Erklärung nicht übermittelt werden. Sie ist beim Konsulat erhältlich oder — schneller — in Italien über eine Vollmacht an uns.",
          "Ausländische Dokumente: Eine im Ausland ausgestellte Sterbeurkunde oder ein Testament kann Apostille, Legalisation und Übersetzung erfordern. Innerhalb der Europäischen Union sind die Regeln einfacher.",
          "Unterschriften: Wir übermitteln die Erklärung mit Ihrem aus der Ferne unterzeichneten Mandat. Für die Erklärung allein ist keine notarielle Vollmacht nötig.",
          "Steuerzahlung: Die Steuern werden per Lastschrift von einem italienischen Bankkonto eingezogen. Haben Sie keins, gibt es Lösungen — auch die Abbuchung vom Konto der Kanzlei als Vermittler.",
          "Zeitzone und Sprache: Wir arbeiten schriftlich, per WhatsApp und E-Mail, damit Sie antworten können, wenn es Ihnen passt. Website und Kommunikation sind in mehreren Sprachen verfügbar.",
        ],
      },
      { type: "h2", text: "So funktioniert es — in fünf Schritten" },
      {
        type: "ol",
        items: [
          "Sie füllen den Online-Fragebogen aus: zwei Minuten, und Sie wissen sofort, welches Paket Sie brauchen und was es kostet.",
          "Sie schreiben uns per WhatsApp oder zahlen direkt. Wir eröffnen Ihren persönlichen Bereich mit der Dokumentenliste für Ihren Fall.",
          "Sie laden die Dokumente hoch, wann Sie möchten — auch als Handy-Fotos. Wir prüfen Katasterdaten, Erwerbsurkunden und codice fiscale; fehlt etwas, holen wir es oft in Italien ein.",
          "Wir bestätigen Ihnen schriftlich Steuern und Beträge, dann unterschreiben Sie das Mandat aus der Ferne und wir übermitteln die Erklärung an die Agenzia delle Entrate (italienische Steuerbehörde).",
          "Sie erhalten die Einreichungsbestätigung und bei Immobilien die voltura (Katasterumschreibung). Alles bleibt in Ihrem persönlichen Bereich.",
        ],
      },
      { type: "callout", tone: "info", title: "Sie müssen nicht nach Italien zurückkehren", text: "Kein Schritt der Erbschaftserklärung erfordert Ihre physische Anwesenheit. Was in Italien am Schalter erledigt wird — codice fiscale beantragen, Katasterauszug — erledigen wir mit Ihrer Vollmacht." },
      { type: "h2", text: "Was wir konkret für Sie tun" },
      {
        type: "ul",
        items: [
          "Wir beantragen den codice fiscale für Erben, die keinen haben, per Vollmacht bei der Agenzia delle Entrate.",
          "Wir prüfen Immobilien im Kataster und in den Urkunden: Hier hängen Fernfälle am häufigsten.",
          "Wir bereiten die Erklärung vor, übermitteln sie und die voltura als berechtigter Vermittler.",
          "Haben Sie kein Konto in Italien, vereinbaren wir die Steuerzahlung über die Kanzlei — mit Beträgen und Quittungen schriftlich.",
          "Wir sagen Ihnen klar, ob und wo ein Notar oder das Konsulat nötig ist.",
        ],
      },
      { type: "h2", text: "Wann zusätzlich ein Notar oder das Konsulat nötig ist" },
      { type: "p", text: "Die Erbschaftserklärung ist keine notarielle Urkunde und erfordert keinen Notar. Ein Notar — oder das italienische Konsulat, das für italienische Staatsbürger einige notarielle Funktionen wahrnimmt — ist dagegen nötig, um die Erbschaft auszuschlagen, sie mit Inventarvorteil anzunehmen, ein Testament zu veröffentlichen oder die geerbte Immobilie zu verkaufen. Ergibt sich aus den Unterlagen, dass Ihr Fall das erfordert, weisen wir Sie darauf hin und sagen Ihnen, an wen Sie sich wenden können." },
      { type: "h2", text: "Was es kostet" },
      { type: "p", text: "Die Pakete sind dieselben wie für Menschen in Italien und stehen auf der Tarifseite: Das Honorar umfasst den Geometer, die Erklärung und die voltura. Gesetzliche Steuern kommen für alle extra dazu; wir nennen Ihnen die Beträge vor der Übermittlung. Braucht Ihr Fall zusätzliche Schritte — codice fiscale oder Übersetzung — sagen wir es sofort, mit dem Betrag." },
      { type: "callout", tone: "warning", title: "Die 12 Monate gelten auch im Ausland", text: "Die Frist beginnt am Todestag, nicht erst, wenn Sie sich der Sache widmen können. Naht sie, schreiben Sie uns sofort: Für Auslandsansässige ist der codice fiscale oft der langwierigste Schritt." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "Codice fiscale für einen im Ausland lebenden Erben: so erhalten Sie ihn",
    excerpt: "Ohne den codice fiscale jedes Erben kann die Erklärung nicht übermittelt werden. Wer ihn vielleicht schon hat, wie man ihn beim Konsulat oder in Italien per Vollmacht beantragt, was nötig ist.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Der italienische codice fiscale (Steuernummer) ist der Punkt, der Erbschaften mit Erben im Ausland am häufigsten blockiert: Die elektronische Erklärung verlangt ihn für jeden Erben und Vermächtnisnehmer — ohne geht die Übermittlung nicht. Die gute Nachricht: Er ist einfacher zu bekommen, als es scheint, und erfordert keine Reise nach Italien." },
      { type: "h2", text: "Vielleicht haben Sie ihn schon" },
      { type: "p", text: "Wer in Italien geboren ist, dort gearbeitet oder studiert hat, eine alte Gesundheitskarte hat oder bei AIRE (Auslandsregister italienischer Staatsbürger) eingetragen ist, hat oft schon einen codice fiscale — auch wenn er jahrelang ungenutzt blieb. Prüfen Sie alte Unterlagen, die Gesundheitskarte oder eine Steuererklärung. Finden Sie ihn nicht, können wir mit Ihren Personalien prüfen, ob er existiert: Ein codice fiscale wird nicht zweimal vergeben." },
      { type: "h2", text: "So erhalten Sie ihn, wenn er fehlt" },
      {
        type: "ol",
        items: [
          "Beim italienischen Konsulat des Landes, in dem Sie leben: der übliche Weg für im Ausland wohnhafte Staatsbürger. Sie reichen das Formular AA4/8 mit gültigem Ausweis ein. Die Dauer hängt vom Konsulat ab und kann lang sein.",
          "In Italien bei jeder Agenzia delle Entrate über eine bevollmächtigte Person: Das Formular AA4/8 unterschreiben Sie, der Vollmachtsteil ist ausgefüllt, und der Bevollmächtigte reicht es mit eigenem Ausweis und Kopie Ihres ein. Das ist der Weg, den wir nutzen — meist der schnellste.",
        ],
      },
      { type: "callout", tone: "info", title: "Wir erledigen es mit Ihrer Vollmacht", text: "Wir senden Ihnen das vorausgefüllte Formular, Sie unterschreiben und senden es mit einer Ausweiskopie zurück. Wir reichen es bei der Agenzia delle Entrate ein und teilen Ihnen den codice fiscale mit, sobald er vergeben ist." },
      { type: "h2", text: "Was Sie brauchen" },
      {
        type: "ul",
        items: [
          "Gültiger Reisepass oder Personalausweis (lesbare Kopie, Vorder- und Rückseite).",
          "Vollständige Personalien: Nachname, Vorname, Geschlecht, Geburtsdatum und -ort, Wohnadresse im Ausland.",
          "Grund der Anfrage: die Erbschaft in Italien. Er muss im Formular angegeben werden.",
          "Unterschriebenes Formular AA4/8, mit ausgefüllter Vollmacht, wenn wir es einreichen.",
        ],
      },
      { type: "h2", text: "Erben, die keine italienischen Staatsbürger sind" },
      { type: "p", text: "Gleiches Verfahren: Das Formular AA4/8 kann bei jeder Agenzia delle Entrate über einen Bevollmächtigten mit begründetem Antrag eingereicht werden. Für ausländische Staatsbürger greift das italienische Konsulat nur in besonderen Fällen ein — die Vollmacht in Italien ist fast immer der einfachste Weg." },
      { type: "callout", tone: "warning", title: "Hier beginnen, wenn die Frist naht", text: "Der codice fiscale ist der Schritt mit den am wenigsten vorhersehbaren Zeiten im gesamten Verfahren. Liegt der Tod mehrere Monate zurück, beantragen Sie ihn jetzt: Den Rest der Erklärung bereiten wir parallel vor." },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "Der Verstorbene lebte im Ausland und hatte Vermögen in Italien: was zu tun ist",
    excerpt: "Erklärung in Italien, auch wenn der Tod im Ausland eintrat: welches Amt, welche Vermögenswerte besteuert werden, was die EU-Erbverordnung sagt und wann ein Notar nötig ist.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Der klassische Fall vieler Auswandererfamilien: Ein Elternteil lebte jahrelang in Deutschland, der Schweiz oder Argentinien, hinterließ aber das Haus im Heimatort oder eine vermietete Wohnung in Italien. Gibt es Vermögen in Italien, muss die dichiarazione di successione dort innerhalb von 12 Monaten nach dem Tod eingereicht werden — auch wenn der Tod im Ausland eintrat und alle Erben im Ausland leben." },
      { type: "h2", text: "Welche Vermögenswerte besteuert werden" },
      { type: "p", text: "Die Regel steht im Testo unico sulle successioni (TUS, art. 2). War der Verstorbene zum Zeitpunkt des Todes in Italien ansässig, gilt die Steuer auf alle Vermögenswerte — wo auch immer. War er nicht in Italien ansässig, nur auf Vermögen in Italien: Immobilien, Konten bei italienischen Banken, Beteiligungen an italienischen Gesellschaften. Vermögen im Ausland folgt den Regeln des jeweiligen Landes." },
      { type: "callout", tone: "info", title: "Doppelbesteuerung", text: "Italien hat Erbschaftsteuerabkommen nur mit wenigen Ländern — unter anderem Frankreich, Großbritannien und den USA. Sonst muss das, was Sie in Italien auf italienisches Vermögen zahlen, mit der Erbschaftserklärung im Wohnsitzland abgestimmt werden: lohnt sich ein lokaler Berater." },
      { type: "h2", text: "Bei welchem Amt einreichen" },
      { type: "p", text: "Hatte der Verstorbene vor dem Auslandsaufenthalt einen Wohnsitz in Italien, ist die Agenzia delle Entrate des letzten italienischen Wohnsitzes zuständig. War er nie in Italien ansässig oder ist der letzte Wohnsitz unbekannt, ist ein von der Behörde benanntes Amt in Rom zuständig. Bei elektronischer Übermittlung klären wir das bei der Erstellung." },
      { type: "h2", text: "Wie eingereicht wird" },
      { type: "p", text: "Elektronisch über einen berechtigten Vermittler — genau wie für Menschen in Italien: Wir sammeln Dokumente und Unterschriften aus der Ferne und übermitteln. Das Gesetz erlaubt Auslandsansässigen, nur bei Unmöglichkeit der elektronischen Übermittlung, das Papierformular per Einschreiben zu senden — eine Ausnahme, die praktisch fast nie nötig ist." },
      { type: "h2", text: "Wer erbt: das anwendbare Recht" },
      { type: "p", text: "Steuerliche und zivilrechtliche Seite sind zwei verschiedene Dinge. Wer die Erben sind und in welchen Quoten, bestimmt das auf die Erbschaft anwendbare Recht. In der EU gilt die Verordnung 650/2012: Für Todesfälle ab 17. August 2015 gilt das Recht des Landes des gewöhnlichen Aufenthalts des Verstorbenen — es sei denn, das Testament wählte das Recht des Staatsangehörigkeitslandes. Ein in Deutschland wohnhafter Italiener ohne Testament erbt also nach deutschem Recht — auch für das Haus in Italien. Großbritannien, Irland und Dänemark wenden die Verordnung nicht an; außerhalb der EU gelten italienische Regeln des internationalen Privatrechts." },
      { type: "callout", tone: "warning", title: "Wo unsere Arbeit endet", text: "Wir bereiten die Erklärung vor und übermitteln sie samt voltura für Vermögen in Italien. Ist die Erbschaft nach ausländischem Recht geregelt, gibt es ein ausländisches Testament durchzusetzen oder eine europäische Erburkunde zu holen, brauchen Sie auch einen Notar oder Anwalt: Sobald es sich aus den Unterlagen ergibt, weisen wir Sie darauf hin und erklären die Schritte." },
      { type: "h2", text: "Die zusätzlichen Dokumente" },
      {
        type: "ul",
        items: [
          "Im Ausland ausgestellte Sterbeurkunde: War der Verstorbene italienischer Staatsbürger, wird der Sterbeeintrag über das Konsulat in der italienischen Gemeinde eingetragen — dann stellt die Gemeinde die Urkunde aus. Sonst die ausländische Urkunde mit Apostille oder Legalisation und Übersetzung, vorbehaltlich EU-Vereinfachungen.",
          "Nachweis des Auslandswohnsitzes des Verstorbenen, z. B. AIRE-Eintragung oder Wohnsitzbescheinigung des Auslandsstaates.",
          "Codice fiscale des Verstorbenen und aller Erben: auch nicht-italienische Erben brauchen einen.",
          "Testament, falls vorhanden, mit Veröffentlichung oder europäischer Erburkunde.",
        ],
      },
      { type: "h2", text: "Erstwohnungs-Vergünstigung" },
      { type: "p", text: "Hypotheken- und Katastersteuer auf die geerbte Immobilie können mit der Erstwohnungs-Vergünstigung sinken — für Auslandsansässige gelten besondere Regeln, die sich 2023 geändert haben: Sie hängen vom Standort der Immobilie und vom Bezug des Erben zu Italien ab. Wir prüfen das fallweise vor der Steuerberechnung." },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "Dokumente aus dem Ausland: Apostille, Übersetzungen und Unterschriften aus der Ferne",
    excerpt: "Ausländische Sterbeurkunde, ausländisches Testament, nicht-italienische Ausweise: wann Apostille, Legalisation oder beglaubigte Übersetzung nötig sind und wie alles ohne Italienreise unterschrieben wird.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "In einer Erbschaft mit Erben oder Verstorbenem im Ausland sind fast alle Dokumente dieselben wie in einem italienischen Fall. Die wenigen, die aus einem anderen Land kommen können, sind heikel: die Sterbeurkunde bei Tod im Ausland, ein ausländisches Testament, Ausweisdokumente der Erben und manchmal Personenstandsurkunden. Was wirklich nötig ist, damit Agenzia delle Entrate und Kataster sie annehmen." },
      { type: "h2", text: "Drei Regeln je nach Land" },
      {
        type: "table",
        headers: ["Ausstellungsland", "Legalisation", "Übersetzung"],
        rows: [
          ["Europäische Union", "Nicht nötig: Verordnung 2016/1191 entfällt Apostille und Legalisation für Personenstandsurkunden", "Vermeidbar durch das mehrsprachige Standardformular zusammen mit der Urkunde"],
          ["Staaten des Haager Übereinkommens von 1961 (z. B. Großbritannien, USA, Schweiz, Argentinien, Brasilien, Australien)", "Apostille der ausstellenden Behörde", "Beglaubigte Übersetzung in Italien oder vom italienischen Konsulat bestätigt"],
          ["Andere Staaten", "Legalisation beim italienischen Konsulat im Ausstellungsland", "Beglaubigte Übersetzung in Italien oder vom italienischen Konsulat bestätigt"],
        ],
      },
      { type: "h2", text: "Die Sterbeurkunde" },
      { type: "p", text: "War der Verstorbene italienischer Staatsbürger und starb im Ausland, ist der einfachste Weg, den Sterbeeintrag über das Konsulat in der italienischen Gemeinde eintragen zu lassen: Ab dann stellt die Gemeinde die Urkunde auf Italienisch aus — ohne Apostille und Übersetzung. War der Verstorbene nicht Italiener, gilt die ausländische Urkunde nach den Regeln der Tabelle." },
      { type: "h2", text: "Ein ausländisches Testament" },
      { type: "p", text: "Ein im Ausland errichtetes Testament muss in der Regel in Italien durch einen Notar veröffentlicht oder durchgesetzt werden — mit beglaubigter Übersetzung und ggf. Legalisation. Einer der wenigen Schritte, die einen anderen Fachmann als uns brauchen: Wir weisen Sie darauf hin und koordinieren die Erklärung mit dessen Zeitplan." },
      { type: "h2", text: "Nicht-italienische Ausweisdokumente" },
      { type: "p", text: "Ein gültiger ausländischer Reisepass oder Personalausweis genügt für die Erbschaftserklärung und den codice fiscale-Antrag. Lesbare Kopie, Vorder- und Rückseite — keine Übersetzung." },
      { type: "h2", text: "Unterschriften: was nötig ist und was nicht" },
      {
        type: "ul",
        items: [
          "Für Erbschaftserklärung und voltura ist keine notarielle Vollmacht nötig: Wir übermitteln als Vermittler mit Ihrem aus der Ferne unterzeichneten Mandat im persönlichen Bereich oder per Rücksendung mit Ausweiskopie.",
          "Für den codice fiscale genügt die Vollmacht im Formular AA4/8, von Ihnen unterschrieben.",
          "Notar oder italienisches Konsulat — das für Italiener notarielle Funktionen wahrnimmt — sind dagegen nötig, um die Erbschaft auszuschlagen, sie mit Inventarvorteil anzunehmen oder eine Vollmacht zum Verkauf der Immobilie zu unterzeichnen.",
        ],
      },
      { type: "callout", tone: "info", title: "Erst Fotos, dann Originale", text: "Für die ersten Prüfungen reichen Fotos oder Scans im persönlichen Bereich. Originale oder Kopien mit Apostille und Übersetzung verlangen wir nur, wo wirklich nötig — und sagen es vorher." },
      { type: "callout", tone: "warning", title: "Zeit für Apostille und Übersetzungen einplanen", text: "Zwischen Urkundenantrag, Apostille und beglaubigter Übersetzung können Wochen vergehen. Naht die 12-Monats-Frist, starten Sie mit diesen Dokumenten, während wir den Rest vorbereiten." },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "Erbschaftsteuern aus dem Ausland zahlen, ohne italienisches Bankkonto",
    excerpt: "Die Steuern werden per Lastschrift von einem italienischen Konto eingezogen. Leben Sie im Ausland ohne Konto, gibt es drei Lösungen — auch Zahlung über die Kanzlei als Vermittler.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Für Auslandsansässige ist die Steuerzahlung oft das größte praktische Hindernis: Die mit der elektronischen Erklärung fälligen Beträge werden per Lastschrift von einem italienischen Girokonto eingezogen — viele Auswanderer haben keins mehr. Welche Steuern anfallen, wie gezahlt wird und was fehlt, wenn kein italienisches Konto da ist." },
      { type: "h2", text: "Welche Steuern gezahlt werden" },
      {
        type: "ul",
        items: [
          "Mit der Erklärung bei Immobilien: Hypothekensteuer (2 %) und Katastersteuer (1 %) auf den Katasterwert, mindestens 200 Euro je, plus Stempelsteuer und Sonderabgaben. Selbstanzeige und Zahlung bei Übermittlung.",
          "Erbschaftsteuer nur, wenn der Nachlass die Freibeträge übersteigt: 1 Million Euro je Kind oder Ehepartner (4 %), 100.000 Euro für Geschwister (6 %), keine Freibeträge für andere (6 % oder 8 %). Für Erbschaften ab 2025 berechnet der Steuerpflichtige sie in der Erklärung und zahlt innerhalb von 90 Tagen nach Einreichungsfrist — oder sofort mit dem Rest.",
        ],
      },
      { type: "h2", text: "Zahlung bei elektronischer Übermittlung" },
      { type: "p", text: "Selbstanzeige-Beträge werden per Lastschrift von einem Girokonto bei einer mit der Agenzia delle Entrate kooperierenden Bank oder bei Poste Italiane eingezogen. Das Konto kann dem Erklärenden oder dem für die elektronische Übermittlung Verantwortlichen — dem Vermittler — gehören. In der Erklärung stehen IBAN und codice fiscale des Kontoinhabers." },
      { type: "h2", text: "Kein Konto in Italien? Drei Lösungen" },
      {
        type: "ol",
        items: [
          "Ein in Italien wohnhafter Miterbe zahlt für alle: Die Erklärung kann das Konto eines Erben angeben. Die einfachste Lösung, wenn möglich.",
          "Die Kanzlei zahlt als Vermittler: Sie überweisen uns im Voraus den exakten Steuerbetrag — schriftlich mitgeteilt — und wir zahlen per Abbuchung vom Kanzleikonto bei Übermittlung. Sie erhalten die Quittungen. Fallweise vereinbart.",
          "F24-Formular in Italien über Bevollmächtigten: möglich bei Amtsvorlage, aber langsamster Weg — nur wenn die ersten beiden nicht gehen.",
        ],
      },
      { type: "callout", tone: "info", title: "Alles schriftlich, vorher", text: "Vor der Übermittlung senden wir Ihnen die Steuerberechnung Posten für Posten. Sie zahlen nur diesen Betrag — und erst nach Einsicht. Die Steuern gehen an den Staat, nicht an uns: Das Paket-Honorar ist getrennt." },
      { type: "h2", text: "Überweisungen aus dem Ausland und Wechselkurs" },
      { type: "p", text: "Die Steuern sind in Euro. Ist Ihr Konto in anderer Währung, bedenken Sie Gebühren und Kurs Ihrer Bank: SEPA-Überweisungen aus Euro-Ländern und der Schweiz kosten wenig, aus anderen Ländern vorher prüfen. Das Paket-Honorar zahlen Sie auf der Website per Karte über Stripe — aus jedem Land." },
      { type: "h2", text: "Erbschaften vor 2025" },
      { type: "p", text: "Für Todesfälle bis 31. Dezember 2024 berechnet die Agenzia delle Entrate die Erbschaftsteuer noch selbst und sendet einen Zahlungsbescheid — F24 innerhalb von 60 Tagen. Auch dann können wir die Zahlung über die Kanzlei abwickeln, wenn Sie kein italienisches Konto haben." },
      { type: "callout", tone: "warning", title: "Beträge können sich ändern", text: "Sätze, Freibeträge und Mindestbeträge gelten zum Stand dieses Leitfadens. Wir prüfen immer den konkreten Fall und offizielle Quellen vor der Berechnung." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
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
