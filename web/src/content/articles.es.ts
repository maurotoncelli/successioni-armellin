import type { ArticleBlock, ArticleSource } from "./articles";

/*
  Spanish courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleEsOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = "Revisado en la parte fiscal por asesores fiscales";

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: "Agenzia delle Entrate - Declaración de sucesión",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: "Agenzia delle Entrate - Cómo se pagan los impuestos",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: "Normattiva - TUS Decreto Legislativo 346/1990",
  href: "https://www.normattiva.it",
};

export const articlesEs: Record<string, ArticleEsOverlay> = {
  "successione-cosa-e": {
    title: "Sucesión: qué es y cuándo presentarla",
    excerpt: "Una guía clara para entender la obligación, quién debe hacerla, los plazos y qué se arriesga si no se presenta.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "La declaración de sucesión es el cumplimiento fiscal con el que se comunica a la Agenzia delle Entrate el patrimonio dejado por el fallecido (el de cuius) y transferido a los herederos. No es la aceptación de la herencia ni un acto notarial: sirve para declarar el activo hereditario, liquidar los impuestos debidos y, cuando hay inmuebles, actualizar el Catasto con la voltura." },
      { type: "h2", text: "Quién debe presentarla" },
      { type: "p", text: "Están obligados los herederos, los llamados a la herencia y los legatarios (o sus representantes legales), además de administradores, curadores de herencia yacente, albaceas testamentarios y trustees." },
      {
        type: "ul",
        items: [
          "Basta con que la presente uno solo de los obligados: la declaración vale para todos.",
          "Puede ser transmitida por un intermediario habilitado Entratel (como un geometra habilitado): eso es lo que hacemos nosotros.",
        ],
      },
      { type: "h2", text: "Plazo de presentación" },
      { type: "p", text: "El plazo ordinario es de 12 meses desde la fecha de apertura de la sucesión, que normalmente coincide con la fecha del fallecimiento (art. 31 TUS). En casos particulares (herencia yacente, aceptación con beneficio de inventario, nombramiento de un curador) el plazo empieza cuando la persona puede actuar legalmente." },
      { type: "callout", tone: "warning", title: "Atención a los plazos", text: "Presentarla tarde puede conllevar sanciones e intereses. Si la fecha límite de los 12 meses está cerca, conviene actuar de inmediato: nos encargamos nosotros en los plazos correctos." },
      { type: "h2", text: "Cómo se presenta hoy" },
      { type: "p", text: "La declaración se transmite telemáticamente con el software de la Agenzia delle Entrate. El archivo producido (extensión .SUC) se envía directamente por el contribuyente habilitado o, más a menudo, por un intermediario habilitado Entratel. El antiguo Modelo 4 en papel queda solo para casos residuales (fallecimientos anteriores al 3 de octubre de 2006 o residentes en el extranjero imposibilitados de transmitir telemáticamente)." },
      { type: "h2", text: "Qué se arriesga si no la haces (o si la haces mal)" },
      { type: "p", text: "La omisión conlleva una sanción proporcional al impuesto debido, además de intereses; la presentación tardía o infiel conlleva sanciones reducidas o proporcionales según el caso. Los importes cambian con el tiempo: deben verificarse en fuentes oficiales y con el profesional." },
      { type: "callout", tone: "info", title: "No siempre es obligatoria", text: "En algunos casos la declaración ni siquiera es obligatoria. Lo explicamos en la guía dedicada a la exención: verificamos gratis tu caso antes de cobrarte." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_NORMATTIVA],
  },
  "quando-non-obbligatoria": {
    title: "Cuándo NO estás obligado a hacer la sucesión",
    excerpt: "La exención prevista por la ley: las tres condiciones que deben cumplirse a la vez y por qué basta un inmueble para activar la obligación.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "No siempre la declaración de sucesión es obligatoria. La ley (art. 28, párr. 7 del TUS) prevé una exención cuando se cumplen SIMULTÁNEAMENTE tres condiciones. Si falta aunque sea una, la obligación vuelve a existir." },
      { type: "h2", text: "Las tres condiciones de la exención" },
      {
        type: "ol",
        items: [
          "La herencia se transmite al cónyuge y/o a parientes en línea recta (hijos, padres).",
          "El activo hereditario tiene un valor no superior a 100.000 euros.",
          "La herencia no comprende bienes inmuebles ni derechos reales inmobiliarios.",
        ],
      },
      { type: "callout", tone: "warning", title: "Basta un inmueble", text: "Aunque sea un solo inmueble, aunque de valor mínimo, activa la obligación con independencia del valor global. La presencia de una vivienda, un terreno o un trastero lo cambia todo." },
      { type: "h2", text: "Otros casos de no obligación" },
      { type: "p", text: "Existen otras hipótesis de exención o no obligación, por ejemplo la renuncia a la herencia efectuada antes del plazo de 12 meses (art. 28, párr. 5). Las condiciones también pueden desaparecer por hechos sobrevenidos: por eso la valoración siempre es sobre el caso concreto." },
      { type: "callout", tone: "info", title: "Te lo decimos gratis", text: "Si de tu caso resulta que la sucesión podría no ser debida, no te vendemos un servicio inútil: te lo decimos. La verificación definitiva queda sobre el caso concreto." },
    ],
    sources: [FONTE_NORMATTIVA, FONTE_ADE_SCHEDA],
  },
  "imposte-successione-2026": {
    title: "Cuánto se paga de impuestos de sucesión",
    excerpt: "Franquicias, tipos y autoliquidación 2025: cómo funcionan los impuestos, quién los paga y por qué a menudo son cero para herederos directos.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Una premisa importante: el precio de nuestro servicio (los honorarios) es una cosa, los impuestos otra. Los impuestos son a cargo del heredero, separados de los honorarios, y los calculamos y comunicamos ANTES del envío." },
      { type: "h2", text: "Impuesto de sucesión: tipos y franquicias" },
      { type: "p", text: "El impuesto de sucesión se aplica solo sobre el valor que excede la franquicia, que depende del grado de parentesco con el fallecido." },
      {
        type: "table",
        headers: ["Beneficiario", "Tipo", "Franquicia (por beneficiario)"],
        rows: [
          ["Cónyuge y parientes en línea recta (hijos, padres)", "4%", "1.000.000 EUR"],
          ["Hermanos y hermanas", "6%", "100.000 EUR"],
          ["Otros parientes hasta el 4.º grado y afines (dentro de los límites legales)", "6%", "nessuna"],
          ["Otros sujetos (extraños)", "8%", "nessuna"],
          ["Personas con discapacidad grave (L. 104/1992)", "secondo parentela", "1.500.000 EUR"],
        ],
      },
      { type: "callout", tone: "info", title: "Para herederos directos a menudo es cero", text: "Con cónyuge e hijos la franquicia es de 1.000.000 de euros por persona: por eso, en la mayoría de sucesiones familiares, el impuesto de sucesión propiamente dicho es cero." },
      { type: "h2", text: "Impuestos hipotecario y catastral (solo con inmuebles)" },
      { type: "p", text: "Cuando hay inmuebles se pagan el impuesto hipotecario (2 % del valor catastral, mínimo 200 euros) y el impuesto catastral (1 % del valor catastral, mínimo 200 euros). Con el beneficio de primera vivienda a favor de un heredero, ambos bajan a la cuota fija de 200 euros cada uno. Se añaden timbre, tasa hipotecaria y tributos catastrales especiales a cuota fija." },
      { type: "h2", text: "Autoliquidación 2025: qué ha cambiado" },
      { type: "p", text: "Para sucesiones abiertas desde el 1 de enero de 2025, el impuesto de sucesión se autoliquida por el contribuyente directamente en la declaración (ya no se liquida de oficio). El pago debe hacerse en 90 días desde el plazo de presentación, con F24." },
      {
        type: "ul",
        items: [
          "Fraccionamiento permitido si el importe es al menos 1.000 euros: anticipo mínimo del 20 % y saldo en 8 plazos trimestrales (hasta 12 plazos por encima de 20.000 euros), con intereses.",
          "Para sucesiones abiertas antes de 2025 sigue la liquidación de oficio con aviso y pago en 60 días desde la notificación.",
        ],
      },
      { type: "h2", text: "Un ejemplo concreto (caso real anonimizado)" },
      { type: "p", text: "Familia con cónyuge y 2 hijos, patrimonio de unos 117.000 euros (inmuebles, títulos y liquidez), con una primera vivienda y voltura catastral. Los impuestos totales fueron unos 1.200 euros (hipotecario, catastral, timbre y tributos), mientras que el impuesto de sucesión fue cero porque los herederos directos estaban muy por debajo de la franquicia. Los honorarios del servicio son aparte." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
  },
  "agevolazione-prima-casa": {
    title: "Beneficio de primera vivienda en sucesión: cómo funciona",
    excerpt: "Cuándo corresponden las cuotas fijas en lugar de los porcentajes, quién puede solicitarlo y qué hace falta para no perder el beneficio.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Cuando en una sucesión hay un inmueble que puede beneficiarse del beneficio de primera vivienda a favor de al menos un heredero, los impuestos hipotecario y catastral no se pagan en porcentaje sino en cuota fija: 200 euros cada uno, en lugar del 2 % y el 1 % del valor catastral. En inmuebles de cierto valor el ahorro es significativo." },
      { type: "h2", text: "A quién puede corresponder" },
      { type: "p", text: "El beneficio exige que al menos un heredero cumpla los requisitos previstos por la ley para la primera vivienda (en resumen: no ser titular de otros derechos sobre inmuebles en el mismo municipio y no haber disfrutado ya del beneficio en otro lugar, con residencia en el municipio del inmueble dentro de los plazos legales). Basta con que uno solo de los herederos cumpla los requisitos para que el beneficio se aplique al inmueble." },
      { type: "callout", tone: "warning", title: "Los requisitos deben verificarse", text: "El beneficio se declara en el cuadro EH del modelo y debe marcarse correctamente. Si los requisitos no existen o decaen, se pierde el beneficio con recupero de impuestos y sanciones: mejor una verificación técnica previa." },
      { type: "h2", text: "Qué controlamos nosotros" },
      { type: "p", text: "Como geometras, nuestra parte es precisamente la verificación catastral: parcelas, subalternos, categoría, rendita y actos de procedencia. Comprobamos que los datos sean correctos y que la primera vivienda se declare correctamente, para que el beneficio se mantenga y no haya sorpresas." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_ADE_SCHEDA],
  },
  "documenti-successione": {
    title: "Los documentos para la sucesión: la lista completa",
    excerpt: "Todos los documentos habituales y cómo recuperarlos, caso por caso. No siempre hacen falta todos: depende de tu situación.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Los documentos para la declaración de sucesión varían según el caso: nunca hacen falta todos a la vez. A continuación los más habituales, divididos por situación. Si te falta algo, a menudo podemos recuperarlo nosotros (notas, actos de procedencia, datos faltantes)." },
      { type: "h2", text: "Documentos siempre necesarios" },
      {
        type: "ul",
        items: [
          "Certificado o extracto de defunción del fallecido (o autocertificación donde se admita).",
          "Documento de identidad y código fiscal del fallecido y de todos los herederos.",
          "Autocertificación del estado civil y grado de parentesco de los herederos.",
        ],
      },
      { type: "h2", text: "Si hay inmuebles" },
      {
        type: "ul",
        items: [
          "Notas catastrales de los inmuebles en sucesión (podemos recuperarlas nosotros).",
          "Actos de procedencia: escrituras, donaciones o declaraciones de sucesión anteriores.",
          "Planos, cuando sean necesarios para la verificación catastral.",
        ],
      },
      { type: "h2", text: "Si hay testamento o herederos particulares" },
      {
        type: "ul",
        items: [
          "Copia del testamento publicado y eventual acta de publicación.",
          "Autorización del Juez de Tutelas en presencia de herederos menores o incapaces.",
        ],
      },
      { type: "h2", text: "Si hay cuentas e inversiones" },
      {
        type: "ul",
        items: [
          "Certificación de saldo y posición de cuentas, libretas y títulos a la fecha del fallecimiento.",
          "IBAN del heredero para posibles reembolsos o para el cargo de impuestos.",
        ],
      },
      { type: "callout", tone: "info", title: "¿Te falta algo? A menudo podemos recuperarlo nosotros", text: "La recuperación documental forma parte de nuestro trabajo: notas catastrales, actos de procedencia y datos faltantes los obtenemos nosotros ante organismos y bancos." },
      { type: "callout", tone: "warning", title: "Lista orientativa", text: "Esta lista es orientativa y se adapta a tu caso. Lorenzo confirma la lista definitiva tras verificar tu situación concreta." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Herederos que viven en el extranjero: cómo gestionar el expediente",
    excerpt: "Qué cambia cuando uno de los herederos reside fuera de Italia y cómo seguimos el expediente a distancia, también en tu idioma.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Tener un heredero que vive en el extranjero no es un problema: la declaración de sucesión afecta al patrimonio en Italia y se presenta igualmente a la Agenzia delle Entrate. Lo que cambia sobre todo es la forma de recoger documentos y firmas, que gestionamos íntegramente a distancia." },
      { type: "h2", text: "Qué hace falta realmente" },
      {
        type: "ul",
        items: [
          "El código fiscal italiano de cada heredero (también de quien vive en el extranjero): si falta, puede solicitarse.",
          "Los documentos de identidad y los datos personales de todos los herederos.",
          "Un mandato o delegación al intermediario, ya que quien presenta la declaración es un heredero y nosotros la transmitimos en su nombre.",
        ],
      },
      { type: "p", text: "Los residentes en el extranjero, excepcionalmente, pueden presentar el modelo en papel solo si están imposibilitados de transmitir telemáticamente; en la gran mayoría de casos procedemos nosotros telemáticamente como intermediario habilitado." },
      { type: "h2", text: "Todo a distancia, también en tu idioma" },
      { type: "p", text: "Cuestionario, documentos, comunicaciones y firmas se hacen en línea: no tienes que volver a Italia. Podemos acompañarte por correo o mensajería en tu idioma y, si hace falta, organizar una llamada con traducción. Los puntos importantes (importes, plazos, documentos) siempre te los confirmamos por escrito; los documentos oficiales permanecen en italiano." },
      { type: "callout", tone: "info", title: "Huso horario y distancia no importan", text: "Subes los documentos cuando quieras desde tu área personal, también con fotos del móvil. Nos encargamos nosotros de revisarlos y ponerte en regla a tiempo." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "fai-da-te-precompilata": {
    title: "Sucesión precompilada: ¿conviene hacerlo uno mismo?",
    excerpt: "La declaración gratuita en el sitio de la Agenzia existe de verdad. Veamos cuándo tiene sentido y cuándo conviene delegar.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Digámoslo de entrada, con honestidad: se puede hacer la declaración de sucesión gratis por uno mismo. La Agenzia delle Entrate ofrece un procedimiento web guiado para los casos más simples y el software oficial para los más complejos. Es una opción legítima." },
      { type: "h2", text: "Cuándo puede bastar hacerlo uno mismo" },
      { type: "p", text: "Si el caso es realmente sencillo (pocos herederos directos, ningún inmueble o un solo inmueble simple, datos catastrales ya claros y correctos) y tienes soltura con SPID y procedimientos en línea, la precompilada puede ser suficiente." },
      { type: "h2", text: "Dónde hacerlo uno mismo se vuelve arriesgado" },
      {
        type: "table",
        headers: ["Aspecto", "Hazlo tú mismo", "Con nosotros"],
        rows: [
          ["Tiempo necesario", "Horas y SPID a tu cargo", "Nos encargamos nosotros"],
          ["Control de datos catastrales", "A tu cargo", "Lo hace un geometra"],
          ["Cálculo de impuestos", "Por tu cuenta", "Lo hacemos nosotros, antes del envío"],
          ["Asistencia", "Ninguna", "Una persona real"],
          ["Riesgo de sanciones por errores", "Tu", "Gestionado"],
        ],
      },
      { type: "callout", tone: "warning", title: "El punto débil son los datos catastrales", text: "La precompilada no valida los datos catastrales: precisamente ahí es donde la mayoría de expedientes se bloquean o se equivocan. Parcelas, subalternos, anexos y actos de procedencia deben verificarse, y es el oficio del geometra." },
      { type: "p", text: "En resumen: si tu caso es simple y te sientes seguro/a, hacerlo uno mismo es honesto. Si hay inmuebles, dudas o poco tiempo, delegar te evita el riesgo de errores y sanciones. En todo caso, verificamos gratis tu situación antes de que decidas." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_IMPOSTE],
  },
};

export function getArticleEs(slug: string): ArticleEsOverlay | undefined {
  return articlesEs[slug];
}
