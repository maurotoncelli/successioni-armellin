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

const REVIEWED = "Partie fiscale revue par des experts-comptables";

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
      { type: "callout", tone: "info", title: "Ce n'est pas toujours obligatoire", text: "Dans certains cas, la déclaration n'est même pas obligatoire. Nous l'expliquons dans le guide dédié à l'exonération : nous vérifions gratuitement votre situation avant de vous faire payer." },
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
          "Certificat ou extrait de décès du défunt (ou autocertification lorsque admise).",
          "Pièce d'identité et code fiscal du défunt et de tous les héritiers.",
          "Autocertification de l'état de famille et du degré de parenté des héritiers.",
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
          "IBAN de l'héritier pour d'éventuels remboursements ou pour le prélèvement des impôts.",
        ],
      },
      { type: "callout", tone: "info", title: "Il vous manque quelque chose ? Nous pouvons souvent le récupérer", text: "La recherche documentaire fait partie de notre travail : visures cadastrales, actes de provenance et données manquantes, nous les obtenons auprès des organismes et des banques." },
      { type: "callout", tone: "warning", title: "Liste indicative", text: "Cette liste est indicative et s'adapte à votre cas. Lorenzo confirme la liste définitive après avoir vérifié votre situation concrète." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Héritiers vivant à l'étranger : comment gérer la procédure",
    excerpt: "Ce qui change lorsqu'un héritier réside hors d'Italie et comment nous suivons la procédure à distance, y compris dans votre langue.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Avoir un héritier qui vit à l'étranger n'est pas un problème : la déclaration de succession concerne le patrimoine en Italie et se dépose néanmoins auprès de l'Agenzia delle Entrate. Ce qui change surtout, c'est la façon de recueillir documents et signatures, que nous gérons entièrement à distance." },
      { type: "h2", text: "Ce qu'il faut vraiment" },
      {
        type: "ul",
        items: [
          "Le code fiscal italien de chaque héritier (y compris ceux vivant à l'étranger) : s'il manque, il peut être demandé.",
          "Les pièces d'identité et les données personnelles de tous les héritiers.",
          "Un mandat ou une délégation à l'intermédiaire, puisque la déclaration est déposée par un héritier et que nous la transmettons pour son compte.",
        ],
      },
      { type: "p", text: "Les résidents à l'étranger peuvent, à titre exceptionnel, déposer le modèle papier uniquement s'ils sont dans l'impossibilité de transmettre par voie télématique ; dans la grande majorité des cas, nous procédons par voie télématique en tant qu'intermédiaire habilité." },
      { type: "h2", text: "Tout à distance, y compris dans votre langue" },
      { type: "p", text: "Questionnaire, documents, communications et signatures se font en ligne : vous n'avez pas à retourner en Italie. Nous pouvons vous accompagner par e-mail ou messagerie dans votre langue et, si besoin, organiser un appel avec traduction. Les points importants (montants, délais, documents) vous sont toujours confirmés par écrit ; les documents officiels restent en italien." },
      { type: "callout", tone: "info", title: "Fuseau horaire et distance ne comptent pas", text: "Vous téléchargez les documents quand vous voulez depuis votre espace personnel, même en photo avec votre téléphone. Nous nous chargeons de les contrôler et de vous mettre en règle dans les délais." },
    ],
    sources: [FONTE_ADE_SCHEDA],
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
