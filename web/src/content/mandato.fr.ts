import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  French courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsFr({
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
    `Je soussigné(e) ${signerName} (ci-après, le « Client ») confie à ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, P.IVA ${studio.piva ?? ""}, C.F. ${
      studio.cf ?? ""
    }, inscrit à ${
      studio.albo ?? "l'ordre professionnel"
    }, PEC ${pec}, e-mail ${email} (ci-après, le « Professionnel »), la mission professionnelle décrite ci-après, relative au dossier ${practiceCode}.`,

    "1. OBJET. La mission porte sur l'assistance à la préparation de la déclaration de succession et sa transmission électronique à l'Agenzia delle Entrate, que le Professionnel effectue en qualité d'intermédiaire habilité Entratel, ainsi que les démarches connexes prévues par la formule achetée (ex. mutations cadastrales / volture). Les activités non comprises dans la formule sont exclues et pourront faire l'objet d'un devis séparé.",

    "2. HONORAIRES. Les honoraires sont ceux de la formule achetée, indiqués dans la section « Votre achat » de l'espace personnel et déjà réglés à la commande. Les impôts et taxes dus à l'État (impôt de succession, impôts hypothécaire et cadastral, timbres, taxes spéciales) ne sont PAS compris dans les honoraires : ils sont calculés selon la situation concrète, communiqués au Client avant l'envoi de la déclaration et versés par le Client, sans aucune majoration de la part du Professionnel.",

    "3. OBLIGATIONS DU CLIENT. Le Client s'engage à fournir des données et documents exacts, complets et en temps utile, et demeure responsable de leur exactitude. Les délais de livraison courent à compter du moment où la documentation nécessaire est complète et validée par le Professionnel, et n'incluent pas les délais des tiers (Agenzia delle Entrate, Cadastre, banques).",

    "4. DILIGENCE ET RESPONSABILITÉ. Le Professionnel exécute la mission avec la diligence professionnelle requise par la nature de l'activité (obligation de moyens), avec la supervision fiscale d'un expert-comptable. Pour tout ce qui n'est pas prévu par le présent mandat, s'appliquent les Conditions de vente acceptées à l'achat, y compris les limitations de responsabilité, la modification de formule et le règlement.",

    "5. RÉTRACTATION. Le droit de rétractation prévu aux art. 52–59 du Code de la consommation demeure tel qu'indiqué dans les Conditions de vente et sur la page Rétractation du site. En cas de rétractation après le début des travaux, le Client paie un montant proportionnel au service déjà fourni.",

    "6. DONNÉES PERSONNELLES. Le traitement des données personnelles du Client et des personnes concernées par le dossier (y compris le défunt et les autres héritiers) est décrit dans l'Informativa Privacy disponible sur le site, que le Client déclare avoir lue. Le Client garantit être habilité à communiquer les données de tiers.",

    "7. CONFÉRÉ ET SIGNATURE. Le présent mandat est conféré à distance. La signature intervient, au choix du Client, par voie électronique (case d'acceptation et bouton de signature dans l'espace personnel, avec enregistrement de la date et de l'heure) ou par signature manuscrite du document téléchargé puis téléversement de la copie signée.",

    "(La version italienne du présent mandat fait foi. Toute traduction est fournie à titre de courtoisie ; en cas de divergence, la version italienne prévaut.)",
  ];
}

export function buildMandatoTextFr(params: MandatoParams): string {
  return (
    `Mandat professionnel — Dossier ${params.practiceCode}\n\n` +
    buildMandatoParagraphsFr(params).join("\n\n") +
    `\n\nLieu et date : _________________________\n\nSignature du Client : _________________________\n`
  );
}
