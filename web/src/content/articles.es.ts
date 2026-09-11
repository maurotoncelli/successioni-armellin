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

const REVIEWED = "";

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
const FONTE_ADE_COME_PRESENTARE: ArticleSource = {
  label: "Agenzia delle Entrate - Cómo y cuándo presentar la declaración",
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/come-quando-dichsucc",
};
const FONTE_ADE_CODICE_FISCALE: ArticleSource = {
  label: "Agenzia delle Entrate - Solicitud de codice fiscale (modelo AA4/8)",
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/modello-aa4-8-cf-pf",
};
const FONTE_UE_650: ArticleSource = {
  label: "Reglamento (UE) n.º 650/2012 sobre sucesiones transfronterizas",
  href: "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32012R0650",
};
const FONTE_UE_1191: ArticleSource = {
  label: "Reglamento (UE) 2016/1191 - Documentos públicos sin legalización",
  href: "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R1191",
};
const FONTE_ESTERI: ArticleSource = {
  label: "Ministerio de Asuntos Exteriores italiano - Servicios consulares para italianos en el extranjero",
  href: "https://www.esteri.it/it/servizi-consolari-e-visti/",
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
      { type: "callout", tone: "info", title: "No siempre es obligatoria", text: "En algunos casos la declaración ni siquiera es obligatoria. Lo explicamos en la guía dedicada a la exención: verificamos gratis tu caso." },
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
          "Certificado o extracto de defunción del fallecido.",
          "Documento de identidad del fallecido y de los herederos; código fiscal de los herederos.",
          "Autocertificación del estado civil y grado de parentesco de los herederos.",
          "IBAN del heredero (siempre necesario, para reembolsos o para el cargo de impuestos).",
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
        ],
      },
      { type: "callout", tone: "info", title: "¿Te falta algo? A menudo podemos recuperarlo nosotros", text: "La recuperación documental forma parte de nuestro trabajo: notas catastrales, actos de procedencia y datos faltantes los obtenemos nosotros ante organismos y bancos." },
      { type: "callout", tone: "warning", title: "Lista orientativa", text: "Esta lista es orientativa y se adapta a tu caso. Lorenzo confirma la lista definitiva tras verificar tu situación concreta." },
    ],
    sources: [FONTE_ADE_SCHEDA],
  },
  "eredi-estero": {
    title: "Sucesión en Italia si vives en el extranjero: la guía completa",
    excerpt: "¿Has heredado una casa o una cuenta en Italia pero vives en Alemania, Suiza, Reino Unido, Argentina u otro país? Qué cambia de verdad, qué necesitas y cómo hacerlo todo a distancia, sin volver.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Si vives en el extranjero y en Italia ha quedado la casa de tus padres, un terreno o una cuenta, la dichiarazione di successione (declaración de sucesión) debe presentarse igualmente en Italia, dentro de los 12 meses desde el fallecimiento. No hace falta volver: la declaración es telemática y la transmite un intermediario habilitado, es decir, nosotros. Nuestro servicio nació en línea precisamente para quien no puede pasar por la oficina, y quien vive en el extranjero es el caso en el que esto cuenta más." },
      { type: "h2", text: "Los dos casos típicos" },
      {
        type: "ul",
        items: [
          "El fallecido vivía en Italia y uno o más herederos viven en el extranjero: el trámite es el ordinario, solo cambia la forma de recoger documentos y firmas.",
          "El fallecido vivía en el extranjero y tenía bienes en Italia: la declaración se hace igual en Italia, con algunas reglas más sobre oficina competente, impuestos y ley aplicable. Lo tratamos en una guía dedicada.",
        ],
      },
      { type: "h2", text: "Qué cambia respecto a quien vive en Italia" },
      {
        type: "ul",
        items: [
          "Codice fiscale (código fiscal italiano): cada heredero debe tenerlo, aunque nunca haya vivido en Italia. Sin él, la declaración no se transmite. Puede obtenerse en el consulado o, más rápido, en Italia con una delegación a nosotros.",
          "Documentos extranjeros: un certificado de defunción o un testamento emitido en el extranjero pueden requerir apostilla o legalización y traducción. Dentro de la Unión Europea las reglas son más sencillas.",
          "Firmas: transmitimos la declaración con tu encargo firmado a distancia. No hace falta una procura notarial solo para la declaración.",
          "Pago de impuestos: se paga con adeudo en una cuenta italiana. Si no tienes una, hay soluciones, incluido el adeudo en la cuenta del estudio como intermediario.",
          "Huso horario e idioma: trabajamos por escrito, por WhatsApp y correo, para que respondas cuando puedas. El sitio y las comunicaciones están disponibles en varios idiomas.",
        ],
      },
      { type: "h2", text: "Cómo funciona, en cinco pasos" },
      {
        type: "ol",
        items: [
          "Completas el cuestionario en línea: dos minutos, y sabes al momento qué paquete necesitas y cuánto cuesta.",
          "Nos escribes por WhatsApp o pagas directamente. Te abrimos el área personal con la lista de documentos para tu caso.",
          "Subes los documentos cuando quieras, también como fotos del móvil. Revisamos datos catastrales, actos de procedencia y codice fiscale; si falta algo, a menudo lo recuperamos nosotros en Italia.",
          "Te confirmamos por escrito impuestos e importes, luego firmas el encargo a distancia y transmitimos la declaración a la Agenzia delle Entrate (Agencia Tributaria italiana).",
          "Recibes el recibo de presentación y, si hay inmuebles, la voltura (actualización catastral). Todo queda en tu área personal.",
        ],
      },
      { type: "callout", tone: "info", title: "No tienes que volver a Italia", text: "Ningún paso de la declaración de sucesión requiere tu presencia física. Lo que en Italia se hace en ventanilla — solicitar un codice fiscale o una nota catastral — lo hacemos nosotros con tu delegación." },
      { type: "h2", text: "Qué hacemos nosotros, en concreto" },
      {
        type: "ul",
        items: [
          "Solicitamos el codice fiscale de los herederos que no lo tienen, con delegación, ante la Agenzia delle Entrate.",
          "Verificamos los inmuebles en el Catasto y en los actos: es el punto donde más se atascan los expedientes hechos desde lejos.",
          "Preparamos y transmitimos la declaración y la voltura como intermediario habilitado.",
          "Si no tienes cuenta en Italia, acordamos el pago de impuestos a través del estudio, con importes y recibos por escrito.",
          "Te decimos con claridad si algún paso requiere un notario o el consulado, y cuál.",
        ],
      },
      { type: "h2", text: "Cuándo hace falta también un notario o el consulado" },
      { type: "p", text: "La declaración de sucesión no es un acto notarial y no lo exige. Sí hacen falta un notario, o el consulado italiano que para los ciudadanos italianos desempeña algunas funciones notariales, para renunciar a la herencia, aceptarla con beneficio de inventario, publicar un testamento y vender el inmueble heredado. Si de los documentos resulta que tu caso lo requiere, te lo señalamos y te indicamos a quién dirigirte." },
      { type: "h2", text: "Cuánto cuesta" },
      { type: "p", text: "Los paquetes son los mismos que para quien vive en Italia y los ves en la página de Tarifas: el honorario incluye al geometra, la declaración y la voltura. Los impuestos legales van aparte para todos y te los comunicamos antes de la transmisión. Si tu caso requiere pasos extra, como el codice fiscale o una traducción, te lo decimos enseguida, con la cifra." },
      { type: "callout", tone: "warning", title: "Los 12 meses valen también para quien vive en el extranjero", text: "El plazo corre desde la fecha del fallecimiento, no desde cuando puedas ocuparte del trámite. Si está cerca, escríbenos ya: para quien vive en el extranjero, lo que más tarda suele ser el codice fiscale." },
    ],
    sources: [FONTE_ADE_SCHEDA, FONTE_ADE_COME_PRESENTARE, FONTE_ADE_CODICE_FISCALE],
  },
  "codice-fiscale-erede-estero": {
    title: "Codice fiscale para un heredero que vive en el extranjero: cómo obtenerlo",
    excerpt: "Sin el codice fiscale de cada heredero la declaración no se transmite. Quién ya lo tiene sin saberlo, cómo solicitarlo en el consulado o en Italia con delegación, qué hace falta.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "El codice fiscale italiano es el dato que más bloquea las sucesiones con herederos en el extranjero: la declaración telemática exige el de cada heredero y legatario, y sin él no se transmite. La buena noticia es que obtenerlo es más sencillo de lo que parece, y no requiere venir a Italia." },
      { type: "h2", text: "Quizá ya lo tienes" },
      { type: "p", text: "Quien nació en Italia, trabajó o estudió allí, tiene una tarjeta sanitaria antigua o está inscrito en AIRE (registro de italianos en el extranjero) a menudo ya tiene un codice fiscale, aunque no lo use desde hace años. Revisa documentos viejos, la tarjeta sanitaria o una declaración de la renta. Si no lo encuentras, con tus datos personales podemos verificar nosotros si ya existe: un codice fiscale no se solicita dos veces." },
      { type: "h2", text: "Cómo obtenerlo si falta" },
      {
        type: "ol",
        items: [
          "En el consulado italiano del país donde vives: es la vía ordinaria para ciudadanos residentes en el extranjero. Se presenta el modelo AA4/8 con un documento válido. Los plazos dependen del consulado y pueden ser largos.",
          "En Italia, en cualquier oficina de la Agenzia delle Entrate, mediante una persona delegada: el modelo AA4/8 lo firmas tú, con la parte de delegación cumplimentada, y el delegado lo presenta con su documento y copia del tuyo. Es la vía que usamos nosotros, porque suele ser la más rápida.",
        ],
      },
      { type: "callout", tone: "info", title: "Lo hacemos nosotros con tu delegación", text: "Te enviamos el modelo cumplimentado, lo firmas y nos lo devuelves con copia del documento. Lo presentamos nosotros ante la Agenzia delle Entrate y te comunicamos el codice fiscale en cuanto se asigne." },
      { type: "h2", text: "Qué hace falta" },
      {
        type: "ul",
        items: [
          "Pasaporte o documento de identidad en vigor (copia legible, anverso y reverso).",
          "Datos personales completos: apellido, nombre, sexo, fecha y lugar de nacimiento, domicilio en el extranjero.",
          "Motivo de la solicitud: la sucesión en Italia. Debe indicarse en el modelo.",
          "Modelo AA4/8 firmado, con la delegación cumplimentada si lo presentamos nosotros.",
        ],
      },
      { type: "h2", text: "Herederos que no son ciudadanos italianos" },
      { type: "p", text: "Vale el mismo procedimiento: el modelo AA4/8 puede presentarse en cualquier oficina de la Agenzia delle Entrate mediante delegado, con solicitud motivada. Para ciudadanos extranjeros el consulado italiano interviene solo en casos particulares, así que la delegación en Italia es casi siempre el camino más sencillo." },
      { type: "callout", tone: "warning", title: "Empieza por aquí si el plazo está cerca", text: "El codice fiscale es el paso con los tiempos menos previsibles de todo el trámite. Si el fallecimiento fue hace varios meses, solicítalo ya: el resto de la declaración se prepara en paralelo." },
    ],
    sources: [FONTE_ADE_CODICE_FISCALE, FONTE_ADE_SCHEDA],
  },
  "successione-defunto-residente-estero": {
    title: "El fallecido vivía en el extranjero y tenía bienes en Italia: qué hacer",
    excerpt: "Declaración en Italia aunque el fallecimiento haya ocurrido en el extranjero: qué oficina, sobre qué bienes se pagan impuestos, qué dice el reglamento europeo y cuándo hace falta un notario.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Es el caso clásico de muchas familias emigradas: el padre o la madre vivía desde hace años en Alemania, Suiza o Argentina, pero en Italia dejó la casa del pueblo o un piso alquilado. Si hay bienes en Italia, la dichiarazione di successione debe presentarse en Italia, dentro de los 12 meses desde el fallecimiento, aunque el fallecimiento haya ocurrido en el extranjero y aunque todos los herederos vivan fuera." },
      { type: "h2", text: "Sobre qué bienes se pagan impuestos" },
      { type: "p", text: "La regla está en el Testo unico sulle successioni (TUS, art. 2). Si el fallecido era residente en Italia en el momento del fallecimiento, el impuesto afecta a todos los bienes, dondequiera que estén. Si no era residente en Italia, solo a los bienes situados en Italia: inmuebles, cuentas en bancos italianos, participaciones en sociedades italianas. Los bienes en el extranjero siguen las reglas del país donde se encuentran." },
      { type: "callout", tone: "info", title: "Doble imposición", text: "Italia tiene convenios contra la doble imposición en materia de sucesiones con pocos países, entre ellos Francia, Reino Unido y Estados Unidos. Para el resto, lo que pagues en Italia sobre bienes italianos debe coordinarse con la declaración en el país de residencia: conviene consultar a un asesor local." },
      { type: "h2", text: "A qué oficina se presenta" },
      { type: "p", text: "Si el fallecido había tenido residencia en Italia antes de trasladarse, la oficina competente es la de la Agenzia delle Entrate de la última residencia italiana. Si nunca fue residente en Italia o la última residencia no se conoce, la competencia recae en una oficina de Roma indicada por la Agencia. Con la declaración telemática gestionamos nosotros este detalle al compilar." },
      { type: "h2", text: "Cómo se presenta" },
      { type: "p", text: "Por vía telemática mediante un intermediario habilitado, exactamente como para quien vive en Italia: recogemos documentos y firmas a distancia y transmitimos nosotros. La ley permite a los residentes en el extranjero, solo si están imposibilitados de transmitir telemáticamente, enviar el modelo en papel por correo certificado: una excepción que en la práctica casi nunca hace falta." },
      { type: "h2", text: "Quién hereda: la ley aplicable" },
      { type: "p", text: "La parte fiscal y la civil son dos cosas distintas. Quiénes son los herederos y en qué cuotas lo establece la ley aplicable a la sucesión. En la Unión Europea rige el Reglamento 650/2012: para fallecimientos desde el 17 de agosto de 2015 se aplica la ley del país en el que el fallecido tenía residencia habitual, salvo que en el testamento hubiera elegido la ley del país de ciudadanía. Así, un italiano residente en Alemania sin testamento hereda según la ley alemana, también para la casa en Italia. Reino Unido, Irlanda y Dinamarca no aplican el reglamento; fuera de la UE valen las normas italianas de derecho internacional privado." },
      { type: "callout", tone: "warning", title: "Dónde termina nuestro trabajo", text: "Preparamos y transmitimos la declaración y la voltura sobre bienes en Italia. Si la sucesión se rige por una ley extranjera, si hay un testamento extranjero que hacer valer o un certificado sucesorio europeo que obtener, hace falta también un notario o un abogado: en cuanto resulte de los documentos te lo señalamos y te indicamos los pasos." },
      { type: "h2", text: "Los documentos adicionales" },
      {
        type: "ul",
        items: [
          "Certificado de defunción emitido en el extranjero: si el fallecido era ciudadano italiano, el acta debe transcribirse en el municipio italiano mediante el consulado, y de ahí se obtiene un certificado italiano. En caso contrario, el certificado extranjero con apostilla o legalización y traducción, salvo simplificaciones europeas.",
          "Prueba de la residencia en el extranjero del fallecido, por ejemplo inscripción AIRE o certificado de residencia del país extranjero.",
          "Codice fiscale del fallecido y de todos los herederos: también los herederos no italianos deben tenerlo.",
          "Testamento, si lo hay, con publicación o certificado sucesorio europeo.",
        ],
      },
      { type: "h2", text: "Agevolación primera casa" },
      { type: "p", text: "Los impuestos hipotecario y catastral sobre el inmueble heredado pueden reducirse con la agevolación primera casa, pero para quien vive en el extranjero las reglas son específicas y cambiaron en 2023: dependen de dónde esté el inmueble y del vínculo con Italia de quien hereda. Lo verificamos caso por caso antes de calcular los impuestos." },
    ],
    sources: [FONTE_ADE_COME_PRESENTARE, FONTE_NORMATTIVA, FONTE_UE_650],
  },
  "documenti-esteri-successione-apostille": {
    title: "Documentos del extranjero: apostilla, traducciones y firmas a distancia",
    excerpt: "Certificado de defunción extranjero, testamento extranjero, documentos de identidad no italianos: cuándo hacen falta apostilla, legalización o traducción jurada, y cómo firmar todo sin venir a Italia.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "En una sucesión con herederos o fallecido en el extranjero, casi todos los documentos son los mismos que en un trámite italiano. Los que pueden llegar de otro país son pocos pero delicados: el certificado de defunción si el fallecimiento ocurrió en el extranjero, un testamento extranjero, los documentos de identidad de los herederos y, en algunos casos, certificados de estado civil. Veamos qué hace falta de verdad para que la Agenzia delle Entrate y el Catasto los acepten." },
      { type: "h2", text: "Tres reglas según el país" },
      {
        type: "table",
        headers: ["País de emisión", "Legalización", "Traducción"],
        rows: [
          ["Unión Europea", "No hace falta: el Reglamento 2016/1191 elimina apostilla y legalización para certificados de estado civil", "Puede evitarse pidiendo el formulario estándar multilingüe junto al certificado"],
          ["Países de la Convención de La Haya de 1961 (p. ej. Reino Unido, Estados Unidos, Suiza, Argentina, Brasil, Australia)", "Apostilla, puesta por la autoridad del país que emitió el documento", "Traducción jurada en Italia o certificada por el consulado italiano"],
          ["Otros países", "Legalización en el consulado italiano del país de emisión", "Traducción jurada en Italia o certificada por el consulado italiano"],
        ],
      },
      { type: "h2", text: "El certificado de defunción" },
      { type: "p", text: "Si el fallecido era ciudadano italiano y el fallecimiento ocurrió en el extranjero, la vía más sencilla es hacer transcribir el acta de defunción en el municipio italiano mediante el consulado: a partir de entonces el certificado lo expide el municipio, en italiano, y no hacen falta ni apostilla ni traducción. Si el fallecido no era italiano, se usa el certificado extranjero con las reglas de la tabla." },
      { type: "h2", text: "El testamento extranjero" },
      { type: "p", text: "Un testamento redactado en el extranjero debe, por norma, publicarse o hacerse valer en Italia mediante un notario, con traducción jurada y, si hace falta, legalización. Es uno de los pocos pasos en los que hace falta un profesional distinto de nosotros: te lo indicamos y coordinamos la declaración con sus plazos." },
      { type: "h2", text: "Documentos de identidad no italianos" },
      { type: "p", text: "Un pasaporte o documento de identidad extranjero en vigor sirve para la declaración de sucesión y para la solicitud del codice fiscale. Basta una copia legible, anverso y reverso; ninguna traducción." },
      { type: "h2", text: "Las firmas: qué hace falta y qué no" },
      {
        type: "ul",
        items: [
          "Para la declaración de sucesión y la voltura no hace falta una procura notarial: las transmitimos nosotros como intermediario, con tu encargo firmado a distancia en el área personal o devuelto firmado con copia del documento.",
          "Para el codice fiscale basta la delegación incluida en el modelo AA4/8, firmada por ti.",
          "Sí hacen falta un notario o el consulado italiano, que para los ciudadanos italianos desempeña funciones notariales, para renunciar a la herencia, aceptarla con beneficio de inventario y firmar una procura para vender el inmueble.",
        ],
      },
      { type: "callout", tone: "info", title: "Primero las fotos, luego los originales", text: "Para los controles iniciales bastan fotos o escaneos subidos al área personal. Los originales, o copias con apostilla y traducción, los pedimos solo para los documentos que realmente los requieren, y te lo decimos antes." },
      { type: "callout", tone: "warning", title: "Atención a los plazos de apostilla y traducciones", text: "Entre solicitud del certificado, apostilla y traducción jurada pueden pasar semanas. Si el plazo de los 12 meses está cerca, empieza por estos documentos mientras nosotros preparamos el resto." },
    ],
    sources: [FONTE_UE_1191, FONTE_ESTERI, FONTE_ADE_SCHEDA],
  },
  "pagare-imposte-successione-dall-estero": {
    title: "Pagar los impuestos de sucesión desde el extranjero, sin cuenta italiana",
    excerpt: "Los impuestos se pagan con adeudo en una cuenta italiana. Si vives en el extranjero y no tienes una, aquí van las tres soluciones posibles, incluido el pago a través del estudio como intermediario.",
    reviewedBy: REVIEWED,
    body: [
      { type: "p", text: "Para quien vive en el extranjero, el pago de impuestos suele ser el obstáculo práctico más molesto: las sumas debidas con la declaración telemática se pagan con adeudo en una cuenta corriente italiana, y muchos emigrantes ya no tienen cuenta en Italia. Veamos qué impuestos se pagan, cómo, y las soluciones cuando falta la cuenta italiana." },
      { type: "h2", text: "Qué impuestos se pagan" },
      {
        type: "ul",
        items: [
          "Con la declaración, si hay inmuebles: impuesto hipotecario (2 %) y catastral (1 %) sobre el valor catastral, con un mínimo de 200 euros cada uno, más impuesto de timbre y tributos especiales. Se autoliquidan y se pagan al transmitir.",
          "El impuesto de sucesión propiamente dicho solo si el patrimonio supera las franquicias: 1 millón de euros por cada hijo o por el cónyuge (tipo 4 %), 100.000 euros para hermanos (6 %), ninguna franquicia para los demás (6 % o 8 %). Para sucesiones abiertas desde 2025 lo calcula el contribuyente en la declaración y se paga dentro de 90 días desde el plazo de presentación, o de inmediato junto con el resto.",
        ],
      },
      { type: "h2", text: "Cómo se paga con la declaración telemática" },
      { type: "p", text: "Las sumas autoliquidadas se pagan con adeudo en una cuenta corriente abierta en un banco convenido con la Agenzia delle Entrate o en Poste Italiane. La cuenta puede estar a nombre del declarante o del encargado de la transmisión telemática, es decir, del intermediario. En la declaración se indican el IBAN y el codice fiscale del titular de la cuenta." },
      { type: "h2", text: "Si no tienes cuenta en Italia: tres soluciones" },
      {
        type: "ol",
        items: [
          "Un coheredero residente en Italia paga por todos: la declaración puede indicar la cuenta de uno de los herederos. Es la solución más sencilla cuando existe.",
          "Paga el estudio como intermediario: nos haces una transferencia anticipada por el importe exacto de los impuestos, que te comunicamos por escrito, y nosotros los pagamos con adeudo en la cuenta del estudio al transmitir. Recibes las quietanzas. Es una posibilidad que acordamos caso por caso.",
          "Modelo F24 en Italia mediante un delegado: posible cuando la declaración se presenta en oficina, pero es la vía más lenta y la usamos solo si las dos primeras no son practicables.",
        ],
      },
      { type: "callout", tone: "info", title: "Todo por escrito, antes", text: "Antes de la transmisión te enviamos el cálculo de impuestos partida por partida. Pagas solo esa cifra, y solo después de verla. Los impuestos van al Estado, no a nosotros: el honorario del paquete es aparte." },
      { type: "h2", text: "Transferencias desde el extranjero y cambio" },
      { type: "p", text: "Los impuestos son en euros. Si tu cuenta está en otra moneda, considera las comisiones y el cambio de tu banco: las transferencias SEPA desde países del área euro y desde Suiza cuestan poco; desde otros países conviene verificar antes. El honorario del paquete, en cambio, se paga en el sitio con tarjeta mediante Stripe, desde cualquier país." },
      { type: "h2", text: "Sucesiones abiertas antes de 2025" },
      { type: "p", text: "Para fallecimientos hasta el 31 de diciembre de 2024 el impuesto de sucesión, si procede, lo calcula aún la Agenzia delle Entrate y llega un aviso de liquidación que pagar con F24 dentro de 60 días. También en este caso, si no tienes cuenta italiana, podemos gestionar el pago a través del estudio." },
      { type: "callout", tone: "warning", title: "Los importes cambian", text: "Tipos, franquicias y mínimos son los vigentes a la fecha de esta guía. Verificamos siempre el caso concreto y las fuentes oficiales antes de calcular los impuestos." },
    ],
    sources: [FONTE_ADE_IMPOSTE, FONTE_NORMATTIVA],
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
