import type { ArticleBlock, ArticleSource } from "./articles";

/*
  French courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleFrOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Déclaration de succession",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - Comment payer les impôts",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS décret législatif 346/1990",
  href: "https://www.normattiva.it",
};
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - Comment et quand déposer la déclaration",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Demande de codice fiscale (formulaire AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/modello-aa4-8-cf-pf",
};
const FONTE_UE_650: ArticleSource = {
  label: "Règlement (UE) n° 650/2012 sur les successions transfrontalières",
  href: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Règlement (UE) 2016/1191 - Documents publics sans légalisation",
  href: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "Ministère des Affaires étrangères italien - Services consulaires pour les Italiens à l'étranger",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
};

export const articlesFr: Record<string, ArticleFrOverlay> = {
  "successione-cosa-e": {
    title: "Succession : qu'est-ce que c'est et quand la déposer",
    excerpt: "Un guide clair pour comprendre l'obligation, qui doit la faire, les délais et les risques en cas de non-dépôt.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "La déclaration de succession est l'obligation fiscale par laquelle on informe l'Agenzia delle Entrate du patrimoine laissé par le défunt (le de cuius) et transféré aux héritiers. Ce n'est ni l'acceptation de l'héritage ni un acte notarial : elle sert à déclarer l'actif successoral, à liquider les impôts dus et, en présence d'immeubles, à mettre à jour le Cadastre par la voltura." },
      { type: "h2", text: "Qui doit la déposer" },
      { type: "p", text: "Sont tenus de la déposer les héritiers, les appelés à la succession et les légataires (ou leurs représentants légaux), ainsi que les administrateurs, curateurs de succession vacante, exécuteurs testamentaires et trustees." },
      {
        type: "ul",
        items: [
          "Il suffit qu'un seul des obligés la dépose : la déclaration vaut pour tous.",
          "Elle peut être transmise par un intermédiaire habilité Entratel (comme un Geom. habilité) : c'est ce que nous faisons.",
        ],
      },
      { type: "h2", text: "Délai de dépôt" },
      { type: "p", text: "Le délai ordinaire est de 12 mois à compter de l'ouverture de la succession, qui coïncide en principe avec la date du décès (art. 31 TUS). Dans certains cas (succession vacante, acceptation avec bénéfice d'inventaire, nomination d'un curateur), le délai court à partir du moment où la personne est légalement en mesure d'agir." },
      { type: "callout", tone: "warning", title: "Attention aux délais", text: "Un dépôt tardif peut entraîner des sanctions et des intérêts. Si l'échéance des 12 mois approche, mieux vaut agir tout de suite : nous nous en chargeons dans les délais requis." },
      { type: "h2", text: "Comment la déposer aujourd'hui" },
      { type: "p", text: "La déclaration se transmet par voie télématique avec le logiciel de l'Agenzia delle Entrate. Le fichier produit (extension .SUC) est envoyé directement par le contribuable habilité ou, le plus souvent, par un intermédiaire habilité Entratel. L'ancien Modèle 4 papier ne reste que pour les cas résiduels (décès antérieurs au 3 octobre 2006 ou résidents à l'étranger dans l'impossibilité de transmettre par voie télématique)." },
      { type: "h2", text: "Ce que vous risquez si vous ne la déposez pas (ou si vous la faites mal)" },
      { type: "p", text: "L'absence de dépôt entraîne une sanction proportionnée à l'impôt dû, plus les intérêts ; un dépôt tardif ou inexact entraîne des sanctions réduites ou proportionnelles selon les cas. Les montants évoluent dans le temps : ils doivent être vérifiés sur les sources officielles et avec le professionnel." },
      { type: "callout", tone: "info", title: "Ce n'est pas toujours obligatoire", text: "Dans certains cas, la déclaration n'est même pas obligatoire. Nous l'expliquons dans le guide dédié à l'exonération : nous vérifions gratuitement votre situation." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "Quand vous N'ÊTES PAS obligé de déposer une succession",
    excerpt: "L'exonération prévue par la loi : les trois conditions qui doivent être réunies et pourquoi un seul immeuble déclenche l'obligation.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "La déclaration de succession n'est pas toujours obligatoire. La loi (art. 28, al. 7 du TUS) prévoit une exonération lorsque trois conditions sont réunies SIMULTANÉMENT. S'il en manque une seule, l'obligation réapparaît." },
      { type: "h2", text: "Les trois conditions de l'exonération" },
      {
        type: "ol",
        items: [
          "La succession est dévolue au conjoint et/ou aux parents en ligne directe (enfants, parents).",
          "L'actif successoral a une valeur ne dépassant pas 100 000 euros.",
          "La succession ne comprend pas de biens immobiliers ni de droits réels immobiliers.",
        ],
      },
      { type: "callout", tone: "warning", title: "Un seul immeuble suffit", text: "Même un seul immeuble, même de faible valeur, déclenche l'obligation quelle que soit la valeur globale. La présence d'une maison, d'un terrain ou d'un box change tout." },
      { type: "h2", text: "Autres cas de non-obligation" },
      { type: "p", text: "Il existe d'autres cas d'exonération ou de non-obligation, par exemple la renonciation à la succession effectuée avant l'échéance des 12 mois (art. 28, al. 5). Les conditions peuvent aussi disparaître par des faits survenus ultérieurement : l'évaluation porte donc toujours sur le cas concret." },
      { type: "callout", tone: "info", title: "Nous vous le disons gratuitement", text: "Si votre situation laisse penser que la succession pourrait ne pas être due, nous ne vous vendons pas un service inutile : nous vous le disons. La vérification définitive reste sur le cas concret." },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "Combien coûtent les droits de succession",
    excerpt: "Abattements, taux et autoliquidation 2025 : comment fonctionnent les impôts, qui les paie et pourquoi ils sont souvent nuls pour les héritiers directs.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Une précision importante : le prix de notre service (l'honoraire) est une chose, les impôts en sont une autre. Les impôts sont à la charge de l'héritier, distincts de l'honoraire, et nous les calculons et vous les communiquons AVANT l'envoi." },
      { type: "h2", text: "Droit de succession : taux et abattements" },
      { type: "p", text: "Le droit de succession s'applique uniquement à la valeur excédant l'abattement, qui dépend du degré de parenté avec le défunt." },
      {
        type: "table",
        headers: ["Bénéficiaire", "Taux", "Abattement (par bénéficiaire)"],
        rows: [
          ["Conjoint et parents en ligne directe (enfants, parents)", "4%", "1.000.000 EUR"],
          ["Frères et sœurs", "6%", "100.000 EUR"],
          ["Autres parents jusqu'au 4e degré et alliés (dans les limites légales)", "6%", "nessuna"],
          ["Autres personnes (étrangers à la famille)", "8%", "nessuna"],
          ["Personnes en situation de handicap grave (L. 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "Pour les héritiers directs, c'est souvent zéro", text: "Avec conjoint et enfants, l'abattement est de 1 000 000 d'euros par personne : c'est pourquoi, dans la plupart des successions familiales, le droit de succession proprement dit est nul." },
      { type: "h2", text: "Impôts hypothécaire et cadastral (uniquement avec des immeubles)" },
      { type: "p", text: "En présence d'immeubles, on paie l'impôt hypothécaire (2 % de la valeur cadastrale, minimum 200 euros) et l'impôt cadastral (1 % de la valeur cadastrale, minimum 200 euros). Avec l'abattement résidence principale au profit d'un héritier, les deux passent au montant fixe de 200 euros chacun. S'ajoutent le timbre, la taxe hypothécaire et les prélèvements cadastraux spéciaux à montant fixe." },
      { type: "h2", text: "Autoliquidation 2025 : ce qui a changé" },
      { type: "p", text: "Pour les successions ouvertes à partir du 1er janvier 2025, le droit de succession est autoliquidé par le contribuable directement dans la déclaration (plus liquidé d'office). Le paiement doit être effectué dans les 90 jours suivant le délai de dépôt, avec le F24." },
      {
        type: "ul",
        items: [
          "Échelonnement possible si le montant est d'au moins 1 000 euros : acompte minimum de 20 % et solde en 8 versements trimestriels (jusqu'à 12 versements au-delà de 20 000 euros), avec intérêts.",
          "Pour les successions ouvertes avant 2025, la liquidation d'office reste en vigueur, avec avis et paiement dans les 60 jours suivant la notification.",
        ],
      },
      { type: "h2", text: "Un exemple concret (cas réel anonymisé)" },
      { type: "p", text: "Famille avec conjoint et 2 enfants, patrimoine d'environ 117 000 euros (immeubles, titres et liquidités), avec une résidence principale et voltura cadastrale. Les impôts totaux se sont élevés à environ 1 200 euros (hypothécaire, cadastral, timbre et prélèvements), tandis que le droit de succession a été nul car les héritiers directs étaient largement en dessous de l'abattement. L'honoraire du service est distinct." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "Abattement résidence principale en succession : comment ça fonctionne",
    excerpt: "Quand les impôts fixes s'appliquent à la place des pourcentages, qui peut en bénéficier et ce qu'il faut pour ne pas perdre l'avantage.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Lorsqu'une succession comprend un immeuble pouvant bénéficier de l'abattement résidence principale au profit d'au moins un héritier, les impôts hypothécaire et cadastral ne se paient pas en pourcentage mais au montant fixe : 200 euros chacun, au lieu de 2 % et 1 % de la valeur cadastrale. Sur des immeubles de valeur élevée, l'économie est significative." },
      { type: "h2", text: "Qui peut en bénéficier" },
      { type: "p", text: "L'avantage exige qu'au moins un héritier remplisse les conditions prévues par la loi pour la résidence principale (en résumé : ne pas détenir d'autres droits sur des immeubles dans la même commune et ne pas avoir déjà bénéficié de l'abattement ailleurs, avec résidence dans la commune de l'immeuble dans les délais légaux). Il suffit qu'un seul héritier remplisse les conditions pour que l'abattement s'applique à l'immeuble." },
      { type: "callout", tone: "warning", title: "Les conditions doivent être vérifiées", text: "L'abattement se déclare dans le cadre EH du modèle et doit être correctement coché. Si les conditions ne sont pas remplies ou disparaissent, l'avantage est perdu avec recouvrement d'impôts et sanctions : mieux vaut une vérification technique au préalable." },
      { type: "h2", text: "Ce que nous contrôlons" },
      { type: "p", text: "En tant que Geom., notre part est précisément la vérification cadastrale : parcelles, subalternes, catégorie, rendita et actes de provenance. Nous vérifions que les données sont correctes et que la résidence principale est déclarée correctement, pour que l'abattement tienne et qu'il n'y ait pas de surprises." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "Les documents pour la succession : la liste complète",
    excerpt: "Tous les documents typiques et comment les obtenir, cas par cas. Tous ne sont pas toujours nécessaires : cela dépend de votre situation.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Les documents pour la déclaration de succession varient selon le cas : on n'a jamais besoin de tous en même temps. Voici les plus courants, classés par situation. S'il vous manque quelque chose, nous pouvons souvent le récupérer (visures, actes de provenance, données manquantes)." },
      { type: "h2", text: "Documents toujours nécessaires" },
      {
        type: "ul",
        items: [
          "Certificat ou extrait de décès du défunt.",
          "Pièce d'identité du défunt et des héritiers ; code fiscal des héritiers.",
          "Autocertification de l'état de famille et du degré de parenté des héritiers.",
          "IBAN de l'héritier (toujours nécessaire, pour les remboursements ou le prélèvement des impôts).",
        ],
      },
      { type: "h2", text: "S'il y a des biens immobiliers" },
      {
        type: "ul",
        items: [
          "Visures cadastrales des immeubles en succession (nous pouvons les récupérer).",
          "Actes de provenance : actes notariés, donations ou déclarations de succession antérieures.",
          "Plans, lorsque nécessaires pour la vérification cadastrale.",
        ],
      },
      { type: "h2", text: "S'il y a un testament ou des héritiers particuliers" },
      {
        type: "ul",
        items: [
          "Copie du testament publié et éventuel procès-verbal de publication.",
          "Autorisation du juge des tutelles en présence d'héritiers mineurs ou incapables.",
        ],
      },
      { type: "h2", text: "S'il y a des comptes et des investissements" },
      {
        type: "ul",
        items: [
          "Attestation de solde et de position de comptes, livrets et titres à la date du décès.",
        ],
      },
      { type: "callout", tone: "info", title: "Il vous manque quelque chose ? Nous pouvons souvent le récupérer", text: "La recherche documentaire fait partie de notre travail : visures cadastrales, actes de provenance et données manquantes, nous les obtenons auprès des organismes et des banques." },
      { type: "callout", tone: "warning", title: "Liste indicative", text: "Cette liste est indicative et s'adapte à votre cas. Lorenzo confirme la liste définitive après avoir vérifié votre situation concrète." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Succession en Italie si vous vivez à l'étranger : le guide complet",
    excerpt: "Vous avez hérité d'une maison ou d'un compte en Italie mais vivez en Allemagne, en Suisse, au Royaume-Uni, en Argentine ou ailleurs ? Ce qui change vraiment, ce qu'il faut et comment tout faire à distance, sans revenir.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Si vous vivez à l'étranger et qu'en Italie est restée la maison de vos parents, un terrain ou un compte, la dichiarazione di successione (déclaration de succession) doit être déposée en Italie dans les 12 mois suivant le décès. Pas besoin de revenir : la déclaration est télématique et la transmet un intermédiaire habilité, c'est-à-dire nous. Notre service a été conçu en ligne précisément pour ceux qui ne peuvent pas se rendre au guichet, et vivre à l'étranger est le cas où cela compte le plus." },
      { type: "h2", text: "Les deux cas typiques" },
      {
        type: "ul",
        items: [
          "Le défunt vivait en Italie et un ou plusieurs héritiers vivent à l'étranger : la procédure est ordinaire, seule la façon de recueillir documents et signatures change.",
          "Le défunt vivait à l'étranger et avait des biens en Italie : la déclaration se fait quand même en Italie, avec quelques règles supplémentaires sur l'office compétent, les impôts et la loi applicable. Nous en parlons dans un guide dédié.",
        ],
      },
      { type: "h2", text: "Ce qui change par rapport à qui vit en Italie" },
      {
        type: "ul",
        items: [
          "Codice fiscale (code fiscal italien) : chaque héritier doit en avoir un, même s'il n'a jamais vécu en Italie. Sans lui, la déclaration ne se transmet pas. Il peut s'obtenir au consulat ou, plus vite, en Italie par délégation à nous.",
          "Documents étrangers : un certificat de décès ou un testament délivré à l'étranger peuvent exiger apostille ou légalisation et traduction. Au sein de l'Union européenne, les règles sont plus simples.",
          "Signatures : nous transmettons la déclaration avec votre mandat signé à distance. Aucune procuration notariale n'est nécessaire pour la seule déclaration.",
          "Paiement des impôts : il se fait par prélèvement sur un compte italien. Si vous n'en avez pas, il existe des solutions, y compris le prélèvement sur le compte du cabinet en tant qu'intermédiaire.",
          "Fuseau horaire et langue : nous travaillons par écrit, sur WhatsApp et par e-mail, pour que vous répondiez quand vous le pouvez. Le site et les communications sont disponibles en plusieurs langues.",
        ],
      },
      { type: "h2", text: "Comment ça marche, en cinq étapes" },
      {
        type: "ol",
        items: [
          "Vous remplissez le questionnaire en ligne : deux minutes, et vous savez tout de suite quel forfait il vous faut et combien ça coûte.",
          "Vous nous écrivez sur WhatsApp ou payez directement. Nous ouvrons votre espace personnel avec la liste des documents pour votre cas.",
          "Vous téléchargez les documents quand vous voulez, même en photo depuis le téléphone. Nous vérifions les données cadastrales, les actes de provenance et les codice fiscale ; s'il manque quelque chose, nous le récupérons souvent en Italie.",
          "Nous vous confirmons par écrit impôts et montants, puis vous signez le mandat à distance et nous transmettons la déclaration à l'Agenzia delle Entrate (administration fiscale italienne).",
          "Vous recevez l'accusé de dépôt et, s'il y a des immeubles, la voltura (mise à jour cadastrale). Tout reste dans votre espace personnel.",
        ],
      },
      { type: "callout", tone: "info", title: "Vous n'avez pas à revenir en Italie", text: "Aucune étape de la déclaration de succession n'exige votre présence physique. Ce qui en Italie se fait au guichet — demander un codice fiscale ou une visure — nous le faisons avec votre délégation." },
      { type: "h2", text: "Ce que nous faisons concrètement" },
      {
        type: "ul",
        items: [
          "Nous demandons le codice fiscale des héritiers qui n'en ont pas, par délégation, auprès de l'Agenzia delle Entrate.",
          "Nous vérifions les immeubles au Cadastre et dans les actes : c'est là que les dossiers menés de loin bloquent le plus souvent.",
          "Nous préparons et transmettons la déclaration et la voltura en tant qu'intermédiaire habilité.",
          "Si vous n'avez pas de compte en Italie, nous convenons du paiement des impôts via le cabinet, avec montants et reçus par écrit.",
          "Nous vous disons clairement si une étape requiert un notaire ou le consulat, et lequel.",
        ],
      },
      { type: "h2", text: "Quand il faut aussi un notaire ou le consulat" },
      { type: "p", text: "La déclaration de succession n'est pas un acte notarial et n'en exige pas. En revanche, un notaire — ou le consulat italien, qui pour les citoyens italiens exerce certaines fonctions notariales — est nécessaire pour renoncer à la succession, l'accepter avec bénéfice d'inventaire, publier un testament et vendre l'immeuble hérité. Si votre cas le prévoit, nous vous le disons avant, pas après." },
      { type: "h2", text: "Combien ça coûte" },
      { type: "p", text: "Les forfaits sont les mêmes que pour ceux qui vivent en Italie et figurent sur la page Tarifs : l'honoraire comprend le géomètre, la déclaration et la voltura. Les impôts légaux sont en sus pour tout le monde et nous vous les communiquons avant la transmission. Si votre cas exige des étapes supplémentaires, comme le codice fiscale ou une traduction, nous vous le disons tout de suite, avec le montant." },
      { type: "callout", tone: "warning", title: "Les 12 mois valent aussi à l'étranger", text: "Le délai court à partir de la date du décès, pas du moment où vous pouvez vous en occuper. S'il approche, écrivez-nous tout de suite : pour ceux qui vivent à l'étranger, l'étape la plus longue est souvent le codice fiscale." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "Codice fiscale pour un héritier vivant à l'étranger : comment l'obtenir",
    excerpt: "Sans le codice fiscale de chaque héritier, la déclaration ne se transmet pas. Qui en a déjà un sans le savoir, comment le demander au consulat ou en Italie par délégation, ce qu'il faut.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Le codice fiscale italien est la donnée qui bloque le plus souvent les successions avec héritiers à l'étranger : la déclaration télématique exige celui de chaque héritier et légataire, et sans lui la transmission est impossible. La bonne nouvelle : l'obtenir est plus simple qu'il n'y paraît, et ne demande pas de venir en Italie." },
      { type: "h2", text: "Vous l'avez peut-être déjà" },
      { type: "p", text: "Qui est né en Italie, y a travaillé ou étudié, possède une ancienne carte sanitaire ou est inscrit à l'AIRE (registre des Italiens à l'étranger) a souvent déjà un codice fiscale, même s'il ne l'utilise plus depuis des années. Vérifiez d'anciens documents, la carte sanitaire ou une déclaration de revenus. Si vous ne le trouvez pas, avec vos données personnelles nous pouvons vérifier s'il existe déjà : un codice fiscale ne se demande pas deux fois." },
      { type: "h2", text: "Comment l'obtenir s'il manque" },
      {
        type: "ol",
        items: [
          "Au consulat italien du pays où vous vivez : la voie ordinaire pour les citoyens résidents à l'étranger. On présente le formulaire AA4/8 avec une pièce d'identité valide. Les délais dépendent du consulat et peuvent être longs.",
          "En Italie, dans n'importe quel bureau de l'Agenzia delle Entrate, par une personne déléguée : le formulaire AA4/8 est signé par vous, avec la partie délégation remplie, et le délégué le dépose avec sa pièce et une copie de la vôtre. C'est la voie que nous utilisons, car c'est en général la plus rapide.",
        ],
      },
      { type: "callout", tone: "info", title: "Nous le faisons avec votre délégation", text: "Nous vous envoyons le formulaire prérempli, vous le signez et nous le renvoyez avec une copie de votre pièce d'identité. Nous le déposons auprès de l'Agenzia delle Entrate et vous communiquons le codice fiscale dès qu'il est attribué." },
      { type: "h2", text: "Ce qu'il faut" },
      {
        type: "ul",
        items: [
          "Passeport ou carte d'identité en cours de validité (copie lisible, recto et verso).",
          "Données personnelles complètes : nom, prénom, sexe, date et lieu de naissance, adresse de résidence à l'étranger.",
          "Motif de la demande : la succession en Italie. Il doit figurer sur le formulaire.",
          "Formulaire AA4/8 signé, avec la délégation remplie si nous le déposons.",
        ],
      },
      { type: "h2", text: "Héritiers qui ne sont pas citoyens italiens" },
      { type: "p", text: "Même procédure : le formulaire AA4/8 peut être déposé dans n'importe quel bureau de l'Agenzia delle Entrate par un délégué, avec une demande motivée. Pour les citoyens étrangers, le consulat italien n'intervient que dans des cas particuliers : la délégation en Italie est presque toujours la voie la plus simple." },
      { type: "callout", tone: "warning", title: "Commencez par là si le délai approche", text: "Le codice fiscale est l'étape aux délais les moins prévisibles de toute la procédure. Si le décès remonte à plusieurs mois, demandez-le tout de suite : le reste de la déclaration se prépare en parallèle." },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "Le défunt vivait à l'étranger et avait des biens en Italie : que faire",
    excerpt: "Déclaration en Italie même si le décès est survenu à l'étranger : quel office, quels biens sont imposés, ce que dit le règlement européen et quand un notaire est nécessaire.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "C'est le cas classique de tant de familles émigrées : un parent vivait depuis des années en Allemagne, en Suisse ou en Argentine, mais en Italie a laissé la maison du village ou un appartement loué. S'il y a des biens en Italie, la dichiarazione di successione doit être déposée en Italie dans les 12 mois suivant le décès, même si le décès est survenu à l'étranger et même si tous les héritiers vivent à l'étranger." },
      { type: "h2", text: "Sur quels biens s'imposent les impôts" },
      { type: "p", text: "La règle est dans le Testo unico sulle successioni (TUS, art. 2). Si le défunt était résident en Italie au moment du décès, l'impôt porte sur tous les biens, où qu'ils se trouvent. S'il n'était pas résident en Italie, l'impôt ne porte que sur les biens situés en Italie : immeubles, comptes auprès de banques italiennes, participations dans des sociétés italiennes. Les biens à l'étranger suivent les règles du pays où ils se trouvent." },
      { type: "callout", tone: "info", title: "Double imposition", text: "L'Italie n'a des conventions contre la double imposition en matière de successions qu'avec quelques pays, dont la France, le Royaume-Uni et les États-Unis. Pour le reste, ce que vous payez en Italie sur les biens italiens doit être coordonné avec la déclaration dans le pays de résidence : il vaut la peine de consulter un conseiller local." },
      { type: "h2", text: "Auprès de quel office déposer" },
      { type: "p", text: "Si le défunt avait eu une résidence en Italie avant de s'installer à l'étranger, l'office compétent est celui de l'Agenzia delle Entrate de la dernière résidence italienne. S'il n'a jamais été résident en Italie ou si la dernière résidence est inconnue, la compétence revient à un office de Rome désigné par l'Agence. Avec la déclaration télématique, nous gérons ce détail lors de la compilation." },
      { type: "h2", text: "Comment la déposer" },
      { type: "p", text: "Par voie télématique via un intermédiaire habilité, exactement comme pour ceux qui vivent en Italie : nous recueillons documents et signatures à distance et transmettons. La loi permet aux résidents à l'étranger, seulement s'ils sont dans l'impossibilité de transmettre par voie télématique, d'envoyer le modèle papier par recommandé : une exception presque jamais utile en pratique." },
      { type: "h2", text: "Qui hérite : la loi applicable" },
      { type: "p", text: "Le volet fiscal et le volet civil sont deux choses distinctes. Qui sont les héritiers et en quelles quotes-parts, c'est la loi applicable à la succession qui le détermine. Dans l'Union européenne, le règlement 650/2012 s'applique : pour les décès à partir du 17 août 2015, c'est la loi du pays où le défunt avait sa résidence habituelle qui s'applique, sauf si le testament avait choisi la loi du pays de citoyenneté. Ainsi, un Italien résident en Allemagne sans testament hérite selon le droit allemand, y compris pour la maison en Italie. Le Royaume-Uni, l'Irlande et le Danemark n'appliquent pas le règlement ; hors UE, valent les règles italiennes de droit international privé." },
      { type: "callout", tone: "warning", title: "Où s'arrête notre travail", text: "Nous préparons et transmettons la déclaration et la voltura sur les biens en Italie. Si la succession est régie par une loi étrangère, s'il y a un testament étranger à faire valoir ou un certificat successoral européen à obtenir, il faut aussi un notaire ou un avocat : nous vous le disons dès le départ, avec noms et étapes, pas au milieu de la procédure." },
      { type: "h2", text: "Les documents supplémentaires" },
      {
        type: "ul",
        items: [
          "Certificat de décès délivré à l'étranger : si le défunt était citoyen italien, l'acte doit être transcrit dans la commune italienne via le consulat, et c'est la commune qui délivre ensuite le certificat. Sinon, le certificat étranger avec apostille ou légalisation et traduction, sous réserve des simplifications européennes.",
          "Preuve de la résidence à l'étranger du défunt, par exemple inscription AIRE ou certificat de résidence du pays étranger.",
          "Codice fiscale du défunt et de tous les héritiers : les héritiers non italiens doivent aussi en avoir un.",
          "Testament, s'il y en a un, avec publication ou certificat successoral européen.",
        ],
      },
      { type: "h2", text: "Avantage première maison" },
      { type: "p", text: "Les impôts hypothécaire et cadastral sur l'immeuble hérité peuvent être réduits avec l'avantage première maison, mais pour ceux qui vivent à l'étranger les règles sont spécifiques et ont changé en 2023 : elles dépendent de l'emplacement de l'immeuble et du lien avec l'Italie de l'héritier. Nous le vérifions au cas par cas avant de calculer les impôts." },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "Documents de l'étranger : apostille, traductions et signatures à distance",
    excerpt: "Certificat de décès étranger, testament étranger, pièces d'identité non italiennes : quand apostille, légalisation ou traduction assermentée sont nécessaires, et comment tout signer sans venir en Italie.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Dans une succession avec héritiers ou défunt à l'étranger, presque tous les documents sont les mêmes que dans une procédure italienne. Ceux qui peuvent venir d'un autre pays sont peu nombreux mais délicats : le certificat de décès si le décès est survenu à l'étranger, un testament étranger, les pièces d'identité des héritiers et, parfois, des certificats d'état civil. Voyons ce qui est vraiment nécessaire pour que l'Agenzia delle Entrate et le Cadastre les acceptent." },
      { type: "h2", text: "Trois règles selon le pays" },
      {
        type: "table",
        headers: ["Pays de délivrance", "Légalisation", "Traduction"],
        rows: [
          ["Union européenne", "Inutile : le règlement 2016/1191 supprime apostille et légalisation pour les certificats d'état civil", "Peut être évitée en demandant le formulaire standard multilingue avec le certificat"],
          ["Pays de la Convention de La Haye de 1961 (p. ex. Royaume-Uni, États-Unis, Suisse, Argentine, Brésil, Australie)", "Apostille, apposée par l'autorité du pays qui a délivré le document", "Traduction assermentée en Italie ou certifiée par le consulat italien"],
          ["Autres pays", "Légalisation au consulat italien du pays de délivrance", "Traduction assermentée en Italie ou certifiée par le consulat italien"],
        ],
      },
      { type: "h2", text: "Le certificat de décès" },
      { type: "p", text: "Si le défunt était citoyen italien et que le décès est survenu à l'étranger, la voie la plus simple est de faire transcrire l'acte de décès dans la commune italienne via le consulat : à partir de ce moment, c'est la commune qui délivre le certificat, en italien, sans apostille ni traduction. Si le défunt n'était pas italien, on utilise le certificat étranger selon les règles du tableau." },
      { type: "h2", text: "Le testament étranger" },
      { type: "p", text: "Un testament rédigé à l'étranger doit en principe être publié ou fait valoir en Italie par un notaire, avec traduction assermentée et, si besoin, légalisation. C'est l'une des rares étapes qui requiert un professionnel autre que nous : nous vous l'indiquons tout de suite et coordonnons la déclaration avec ses délais." },
      { type: "h2", text: "Pièces d'identité non italiennes" },
      { type: "p", text: "Un passeport ou une carte d'identité étrangers en cours de validité conviennent pour la déclaration de succession et la demande de codice fiscale. Une copie lisible, recto et verso, suffit ; aucune traduction." },
      { type: "h2", text: "Les signatures : ce qu'il faut et ce qu'il ne faut pas" },
      {
        type: "ul",
        items: [
          "Pour la déclaration de succession et la voltura, aucune procuration notariale n'est nécessaire : nous les transmettons en tant qu'intermédiaire, avec votre mandat signé à distance dans l'espace personnel ou renvoyé signé avec copie de votre pièce d'identité.",
          "Pour le codice fiscale, la délégation incluse dans le formulaire AA4/8, signée par vous, suffit.",
          "En revanche, un notaire ou le consulat italien, qui pour les citoyens italiens exerce des fonctions notariales, est nécessaire pour renoncer à la succession, l'accepter avec bénéfice d'inventaire et signer une procuration pour vendre l'immeuble.",
        ],
      },
      { type: "callout", tone: "info", title: "D'abord les photos, ensuite les originaux", text: "Pour les contrôles initiaux, des photos ou scans téléchargés dans l'espace personnel suffisent. Les originaux, ou copies avec apostille et traduction, ne sont demandés que pour les documents qui les exigent vraiment, et nous vous le disons avant." },
      { type: "callout", tone: "warning", title: "Attention aux délais d'apostille et de traductions", text: "Entre la demande du certificat, l'apostille et la traduction assermentée, des semaines peuvent s'écouler. Si le délai de 12 mois approche, commencez par ces documents pendant que nous préparons le reste." },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "Payer les impôts de succession depuis l'étranger, sans compte italien",
    excerpt: "Les impôts se paient par prélèvement sur un compte italien. Si vous vivez à l'étranger sans en avoir un, voici les trois solutions possibles, y compris le paiement via le cabinet en tant qu'intermédiaire.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Pour ceux qui vivent à l'étranger, le paiement des impôts est souvent l'obstacle pratique le plus gênant : les sommes dues avec la déclaration télématique se paient par prélèvement sur un compte courant italien, et beaucoup d'émigrés n'ont plus de compte en Italie. Voyons quels impôts se paient, comment, et les solutions quand le compte italien manque." },
      { type: "h2", text: "Quels impôts se paient" },
      {
        type: "ul",
        items: [
          "Avec la déclaration, s'il y a des immeubles : impôt hypothécaire (2 %) et cadastral (1 %) sur la valeur cadastrale, avec un minimum de 200 euros chacun, plus droits de timbre et taxes spéciales. Autoliquidés et payés au moment de la transmission.",
          "L'impôt de succession proprement dit seulement si le patrimoine dépasse les abattements : 1 million d'euros pour chaque enfant ou pour le conjoint (taux 4 %), 100.000 euros pour frères et sœurs (6 %), aucun abattement pour les autres (6 % ou 8 %). Pour les successions ouvertes à partir de 2025, le contribuable le calcule dans la déclaration et le paie dans les 90 jours suivant le délai de dépôt, ou immédiatement avec le reste.",
        ],
      },
      { type: "h2", text: "Comment payer avec la déclaration télématique" },
      { type: "p", text: "Les sommes autoliquidées se paient par prélèvement sur un compte courant ouvert auprès d'une banque conventionnée avec l'Agenzia delle Entrate ou auprès de Poste Italiane. Le compte peut être au nom du déclarant ou de la personne chargée de la transmission télématique, c'est-à-dire l'intermédiaire. La déclaration indique l'IBAN et le codice fiscale du titulaire du compte." },
      { type: "h2", text: "Pas de compte en Italie ? Trois solutions" },
      {
        type: "ol",
        items: [
          "Un cohéritier résident en Italie paie pour tous : la déclaration peut indiquer le compte de l'un des héritiers. La solution la plus simple quand elle existe.",
          "Le cabinet paie en tant qu'intermédiaire : vous nous faites un virement anticipé pour le montant exact des impôts, que nous vous communiquons par écrit, et nous les payons par prélèvement sur le compte du cabinet au moment de la transmission. Vous recevez les quittances. Possibilité que nous convenons au cas par cas.",
          "Modèle F24 en Italie par un délégué : possible lorsque la déclaration est déposée au guichet, mais c'est la voie la plus lente et nous ne l'utilisons que si les deux premières ne sont pas praticables.",
        ],
      },
      { type: "callout", tone: "info", title: "Tout par écrit, avant", text: "Avant la transmission, nous vous envoyons le calcul des impôts poste par poste. Vous ne payez que ce montant, et seulement après l'avoir vu. Les impôts vont à l'État, pas à nous : l'honoraire du forfait est séparé." },
      { type: "h2", text: "Virements depuis l'étranger et change" },
      { type: "p", text: "Les impôts sont en euros. Si votre compte est dans une autre devise, tenez compte des frais et du change de votre banque : les virements SEPA depuis les pays de la zone euro et la Suisse coûtent peu ; depuis d'autres pays, mieux vaut vérifier avant. L'honoraire du forfait, en revanche, se paie sur le site par carte via Stripe, depuis n'importe quel pays." },
      { type: "h2", text: "Successions ouvertes avant 2025" },
      { type: "p", text: "Pour les décès jusqu'au 31 décembre 2024, l'impôt de succession, s'il est dû, est encore calculé par l'Agenzia delle Entrate et un avis de liquidation arrive, à payer avec F24 dans les 60 jours. Là aussi, si vous n'avez pas de compte italien, nous pouvons gérer le paiement via le cabinet." },
      { type: "callout", tone: "warning", title: "Les montants changent", text: "Taux, abattements et minima sont ceux en vigueur à la date de ce guide. Nous vérifions toujours le cas concret et les sources officielles avant de calculer les impôts." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "fai-da-te-precompilata": {
    title: "Succession préremplie : le faire soi-même, est-ce intéressant ?",
    excerpt: "La déclaration gratuite sur le site de l'Agenzia existe vraiment. Voyons quand cela a du sens et quand il vaut mieux déléguer.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Disons-le tout de suite, avec honnêteté : on peut faire la déclaration de succession gratuitement soi-même. L'Agenzia delle Entrate met à disposition une procédure web guidée pour les cas les plus simples et le logiciel officiel pour les plus complexes. C'est une option légitime." },
      { type: "h2", text: "Quand le faire soi-même peut suffire" },
      { type: "p", text: "Si le cas est vraiment simple (peu d'héritiers directs, aucun immeuble ou un seul immeuble simple, données cadastrales déjà claires et correctes) et que vous êtes à l'aise avec SPID et les procédures en ligne, la version préremplie peut suffire." },
      { type: "h2", text: "Où le faire soi-même devient risqué" },
      {
        type: "table",
        headers: ["Aspect", "À faire soi-même", "Avec nous"],
        rows: [
          ["Temps à consacrer", "Heures et SPID à votre charge", "Nous nous en occupons"],
          ["Contrôle des données cadastrales", "À votre charge", "Un géomètre s'en charge"],
          ["Calcul des impôts", "Seul", "Nous le faisons avant l'envoi"],
          ["Assistance", "Aucune", "Une vraie personne"],
          ["Risque de sanctions en cas d'erreurs", "Votre", "Pris en charge"],
        ],
      },
      { type: "callout", tone: "warning", title: "Le point faible, ce sont les données cadastrales", text: "La version préremplie ne valide pas les données cadastrales : c'est précisément là que la plupart des dossiers bloquent ou se trompent. Parcelles, subalternes, annexes et actes de provenance doivent être vérifiés, et c'est le métier du Geom." },
      { type: "p", text: "En bref : si votre cas est simple et que vous vous sentez sûr, le faire soi-même est honnête. S'il y a des immeubles, des doutes ou peu de temps, déléguer vous évite le risque d'erreurs et de sanctions. Dans tous les cas, nous vérifions gratuitement votre situation avant de vous laisser décider." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleFr(slug: string): ArticleFrOverlay | undefined {
  return articlesFr[slug];
}
