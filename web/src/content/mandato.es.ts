import { obj, text } from "@/lib/content";
import type { MandatoParams } from "./mandato";

/*
  Spanish courtesy translation of the professional mandate.
  The Italian version (mandato.ts) is binding — see final notice and page notice.
*/

export function buildMandatoParagraphsEs({
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
    `Yo, el/la abajo firmante ${signerName} (en adelante, el «Cliente»), encargo a ${
      studio.ragione_sociale ?? "Geom. Lorenzo Armellin"
    }, ${studio.indirizzo ?? ""}, P.IVA ${studio.piva ?? ""}, C.F. ${
      studio.cf ?? ""
    }, inscrito en ${
      studio.albo ?? "el colegio profesional"
    }, PEC ${pec}, correo ${email} (en adelante, el «Profesional»), el encargo profesional descrito a continuación, relativo al expediente ${practiceCode}.`,

    "1. OBJETO. El encargo abarca la asistencia en la preparación de la declaración de sucesión y su transmisión electrónica a la Agenzia delle Entrate, que el Profesional realiza como intermediario habilitado Entratel, así como las gestiones conexas previstas en la fórmula adquirida (p. ej. mutaciones catastales / volture). Las actividades no incluidas en la fórmula quedan excluidas y podrán ser objeto de un presupuesto aparte.",

    "2. HONORARIOS. Los honorarios son los de la fórmula adquirida, indicados en la sección «Su compra» del área personal y ya abonados en el pedido. Los impuestos y tasas debidos al Estado (impuesto de sucesiones, impuestos hipotecario y catastral, sellos, tasas especiales) NO están incluidos en los honorarios: se calculan según el caso concreto, se comunican al Cliente antes del envío de la declaración y los abona el Cliente, sin recargo alguno por parte del Profesional.",

    "3. OBLIGACIONES DEL CLIENTE. El Cliente se compromete a facilitar datos y documentos exactos, completos y a tiempo, y sigue siendo responsable de su exactitud. Los plazos de entrega corren desde el momento en que la documentación necesaria está completa y validada por el Profesional, y no incluyen los plazos de terceros (Agenzia delle Entrate, Catastro, bancos).",

    "4. DILIGENCIA Y RESPONSABILIDAD. El Profesional ejecuta el encargo con la diligencia profesional exigida por la naturaleza de la actividad (obligación de medios), con supervisión fiscal de un asesor fiscal colegiado. Para todo lo no previsto en el presente mandato, se aplican las Condiciones de venta aceptadas en la compra, incluidas las limitaciones de responsabilidad, el cambio de fórmula y la liquidación.",

    "5. DESISTIMIENTO. El derecho de desistimiento previsto en los art. 52–59 del Código de Consumo permanece según lo indicado en las Condiciones de venta y en la página de Desistimiento del sitio. En caso de desistimiento tras el inicio de los trabajos, el Cliente abona un importe proporcional al servicio ya prestado.",

    "6. DATOS PERSONALES. El tratamiento de los datos personales del Cliente y de las personas afectadas por el expediente (incluido el fallecido y los demás herederos) se describe en la Informativa de Privacidad disponible en el sitio, que el Cliente declara haber leído. El Cliente garantiza estar autorizado a comunicar datos de terceros.",

    "7. OTORGAMIENTO Y FIRMA. El presente mandato se otorga a distancia. La firma se realiza, a elección del Cliente, por vía electrónica (casilla de aceptación y botón de firma en el área personal, con registro de fecha y hora) o mediante firma manuscrita del documento descargado y posterior carga de la copia firmada.",

    "(La versión italiana del presente mandato es jurídicamente vinculante. Cualquier traducción se facilita solo por cortesía; en caso de discrepancia, prevalece la versión italiana.)",
  ];
}

export function buildMandatoTextEs(params: MandatoParams): string {
  return (
    `Mandato profesional — Expediente ${params.practiceCode}\n\n` +
    buildMandatoParagraphsEs(params).join("\n\n") +
    `\n\nLugar y fecha: _________________________\n\nFirma del Cliente: _________________________\n`
  );
}
