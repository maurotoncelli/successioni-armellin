import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket, listItemFiles } from "@/lib/documents";
import type { ChecklistItem } from "@/content/crm-data";
import type { PracticeRow } from "@/lib/supabase/types";

/*
  Estrazione AI dei dati per la dichiarazione di successione (@05, pipeline
  documenti -> dati). Legge i documenti caricati dal cliente (PDF/JPG/PNG dal
  bucket privato) + gli appunti chiamata di Lorenzo, e chiede a OpenAI di
  compilare una scheda dati strutturata (defunto, eredi, immobili, rapporti
  bancari) che fara da base al dossier/XML SUC13.

  Il risultato vive in `<practiceId>/_extraction.json` nello Storage privato
  (stesso pattern NO-DDL di `_extras.json`): niente nuove tabelle, dati
  cancellabili insieme alla pratica, accesso solo server-side (requireAdmin
  a monte). Nulla di tutto cio e visibile al cliente.
*/

export const isAiConfigured = Boolean(process.env.OPENAI_API_KEY);
const AI_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-terra";

// Limite prudente sul payload inviato al modello (base64 gonfia ~33%).
const MAX_TOTAL_DOC_BYTES = 20 * 1024 * 1024;

export type ExtractedPerson = {
  cognome: string | null;
  nome: string | null;
  codice_fiscale: string | null;
  sesso: string | null;
  data_nascita: string | null;
  comune_nascita: string | null;
  provincia_nascita: string | null;
  comune_residenza: string | null;
  provincia_residenza: string | null;
  indirizzo_residenza: string | null;
  grado_parentela: string | null;
  quota_eredita: string | null;
};

export type ExtractedImmobile = {
  catasto: string | null; // "fabbricati" | "terreni"
  comune: string | null;
  provincia: string | null;
  codice_comune: string | null;
  foglio: string | null;
  particella: string | null;
  subalterno: string | null;
  categoria: string | null; // fabbricati: A2, C6... | terreni: natura/qualita
  classe: string | null;
  consistenza: string | null; // fabbricati: vani/mq | terreni: superficie (are.centiare)
  rendita: string | null; // fabbricati: rendita catastale | terreni: reddito dominicale
  quota_possesso: string | null;
  indirizzo: string | null;
  prima_casa: string | null; // "si" se l'erede referente ha i requisiti prima casa
  valore: string | null; // valore dichiarato, se noto (altrimenti calcolato da rendita)
};

export type ExtractedRapporto = {
  istituto: string | null;
  tipo: string | null; // conto corrente, deposito titoli, libretto...
  riferimento: string | null; // IBAN/numero rapporto
  saldo: string | null;
};

export type ExtractionData = {
  defunto: {
    cognome: string | null;
    nome: string | null;
    codice_fiscale: string | null;
    sesso: string | null;
    data_nascita: string | null;
    comune_nascita: string | null;
    provincia_nascita: string | null;
    data_decesso: string | null;
    comune_decesso: string | null;
    provincia_decesso: string | null;
    stato_civile: string | null;
    comune_ultima_residenza: string | null;
    provincia_ultima_residenza: string | null;
    indirizzo_ultima_residenza: string | null;
  };
  eredi: ExtractedPerson[];
  testamento: {
    presente: boolean;
    tipo: string | null;
    data_pubblicazione: string | null;
    notaio: string | null;
  };
  immobili: ExtractedImmobile[];
  rapporti_bancari: ExtractedRapporto[];
  altri_beni: { descrizione: string | null; valore: string | null }[];
  avvertenze: string[];
};

export type ExtractionResult = {
  status: "READY" | "ERROR";
  model: string;
  extractedAt: string; // ISO
  docsUsed: string[]; // etichette checklist incluse nella richiesta
  docsSkipped: string[]; // escluse (peso/formato)
  usedCallNotes: boolean;
  data?: ExtractionData;
  reviewedAt?: string; // ISO: Lorenzo ha corretto/salvato i dati a mano
  error?: string;
};

type Admin = ReturnType<typeof getAdminClient>;

function extractionPath(practiceId: string) {
  return `${practiceId}/_extraction.json`;
}

export async function getExtraction(
  practiceId: string,
): Promise<ExtractionResult | null> {
  const admin = getAdminClient();
  const { data } = await admin.storage
    .from(DOC_BUCKET)
    .download(extractionPath(practiceId));
  if (!data) return null;
  try {
    return JSON.parse(await data.text()) as ExtractionResult;
  } catch {
    return null;
  }
}

/*
  Salvataggio delle correzioni manuali di Lorenzo sui dati estratti: il JSON
  revisionato SOSTITUISCE i dati AI (e' lui la fonte di verita) e viene marcato
  con `reviewedAt`. Da qui in poi il dossier/XML usa i dati corretti.
*/
export async function saveReviewedData(
  practiceId: string,
  data: ExtractionData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = getAdminClient();
  const current = await getExtraction(practiceId);
  const result: ExtractionResult = {
    model: current?.model ?? "manuale",
    extractedAt: current?.extractedAt ?? new Date().toISOString(),
    docsUsed: current?.docsUsed ?? [],
    docsSkipped: current?.docsSkipped ?? [],
    usedCallNotes: current?.usedCallNotes ?? false,
    status: "READY",
    data,
    reviewedAt: new Date().toISOString(),
  };
  try {
    await saveExtraction(admin, practiceId, result);
    return { ok: true };
  } catch (err) {
    console.error("[extraction] saveReviewedData:", err);
    return { ok: false, error: "Salvataggio non riuscito." };
  }
}

async function saveExtraction(
  admin: Admin,
  practiceId: string,
  result: ExtractionResult,
) {
  await ensureDocBucket(admin);
  const blob = Buffer.from(JSON.stringify(result), "utf8");
  const { error } = await admin.storage
    .from(DOC_BUCKET)
    .upload(extractionPath(practiceId), blob, {
      contentType: "application/json",
      upsert: true,
    });
  if (error) throw error;
}

/* --- Schema per Structured Outputs (json_schema strict) -------------------- */

const S = { type: ["string", "null"] } as const;

function obj(properties: Record<string, unknown>) {
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

const personSchema = obj({
  cognome: S,
  nome: S,
  codice_fiscale: S,
  sesso: S,
  data_nascita: S,
  comune_nascita: S,
  provincia_nascita: S,
  comune_residenza: S,
  provincia_residenza: S,
  indirizzo_residenza: S,
  grado_parentela: S,
  quota_eredita: S,
});

const extractionSchema = obj({
  defunto: obj({
    cognome: S,
    nome: S,
    codice_fiscale: S,
    sesso: S,
    data_nascita: S,
    comune_nascita: S,
    provincia_nascita: S,
    data_decesso: S,
    comune_decesso: S,
    provincia_decesso: S,
    stato_civile: S,
    comune_ultima_residenza: S,
    provincia_ultima_residenza: S,
    indirizzo_ultima_residenza: S,
  }),
  eredi: { type: "array", items: personSchema },
  testamento: obj({
    presente: { type: "boolean" },
    tipo: S,
    data_pubblicazione: S,
    notaio: S,
  }),
  immobili: {
    type: "array",
    items: obj({
      catasto: S,
      comune: S,
      provincia: S,
      codice_comune: S,
      foglio: S,
      particella: S,
      subalterno: S,
      categoria: S,
      classe: S,
      consistenza: S,
      rendita: S,
      quota_possesso: S,
      indirizzo: S,
      prima_casa: S,
      valore: S,
    }),
  },
  rapporti_bancari: {
    type: "array",
    items: obj({ istituto: S, tipo: S, riferimento: S, saldo: S }),
  },
  altri_beni: {
    type: "array",
    items: obj({ descrizione: S, valore: S }),
  },
  avvertenze: { type: "array", items: { type: "string" } },
});

/* --- Chiamata al modello ---------------------------------------------------- */

const SYSTEM_PROMPT = `Sei l'assistente di un geometra italiano specializzato in dichiarazioni di successione (modello SUC13 dell'Agenzia delle Entrate).
Ti vengono forniti i documenti caricati dal cliente (carte d'identita, tessere sanitarie, certificati di morte, visure catastali, atti, testamenti, estratti bancari) e gli appunti presi dal geometra durante la chiamata col cliente.

Compito: estrai con la massima precisione i dati che servono a compilare la dichiarazione di successione e riempili nello schema JSON richiesto.

Regole:
- Trascrivi i dati ESATTAMENTE come appaiono nei documenti (codici fiscali, date, identificativi catastali). Non inventare mai nulla: se un dato non e presente o non e leggibile, lascia null.
- Date in formato GG/MM/AAAA. Importi come stringhe con la virgola decimale (es. "1.234,56").
- Codici fiscali italiani: 16 caratteri alfanumerici; verifica la coerenza con nome/data di nascita quando possibile.
- Per gli immobili distingui catasto "fabbricati" e "terreni"; riporta foglio/particella/subalterno/categoria/classe/rendita dalla visura. Per i TERRENI: in "categoria" metti la natura/qualita (es. "SEMINATIVO", "T"), in "consistenza" la superficie (es. "2 are 40 ca"), in "rendita" il reddito dominicale. Per i FABBRICATI: categoria catastale (A2, C6...), consistenza in vani/mq, rendita catastale.
- "prima_casa": scrivi "si" SOLO se dagli appunti risulta che l'erede ha i requisiti prima casa su quell'immobile; altrimenti null. "valore": solo se un valore dichiarato e' indicato esplicitamente nei documenti o negli appunti.
- "comune_decesso"/"provincia_decesso": dal certificato di morte (luogo del decesso, che puo' differire dalla residenza).
- Per ogni persona indica anche il sesso (M/F) se deducibile dal documento o dal codice fiscale.
- Gli appunti chiamata possono integrare o correggere i documenti: se c'e conflitto, segnala il conflitto in "avvertenze" e preferisci il documento ufficiale.
- In "avvertenze" segnala anche: dati illeggibili, documenti scaduti, incongruenze, dati mancanti importanti per la dichiarazione.
- Rispondi solo con il JSON richiesto.`;

type DocPayload = {
  label: string;
  fileName: string;
  contentType: string;
  bytes: Buffer;
};

function contentTypeFor(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "png") return "image/png";
  return "image/jpeg";
}

export async function runExtraction(
  practiceId: string,
): Promise<{ ok: true; result: ExtractionResult } | { ok: false; error: string }> {
  if (!isAiConfigured) {
    return { ok: false, error: "AI non configurata (manca OPENAI_API_KEY)." };
  }
  const admin = getAdminClient();

  const { data: row } = await admin
    .from("practices")
    .select("*")
    .eq("id", practiceId)
    .maybeSingle();
  if (!row) return { ok: false, error: "Pratica non trovata." };
  const practice = row as PracticeRow;

  const checklist = Array.isArray(practice.checklist)
    ? (practice.checklist as ChecklistItem[])
    : [];
  const withFile = checklist
    .filter((c) => c.status === "CARICATO" || c.status === "APPROVATO")
    .flatMap((c) => listItemFiles(c).map((f) => ({ label: c.label, file: f })));
  const callNotes = (practice.call_notes ?? "").trim();

  if (withFile.length === 0 && !callNotes) {
    return {
      ok: false,
      error: "Nessun documento caricato e nessun appunto chiamata: niente da estrarre.",
    };
  }

  // Scarica i file (fino al tetto di peso complessivo).
  const docs: DocPayload[] = [];
  const skipped: string[] = [];
  let total = 0;
  for (const { label, file } of withFile) {
    const { data } = await admin.storage.from(DOC_BUCKET).download(file.path);
    if (!data) {
      skipped.push(label);
      continue;
    }
    const bytes = Buffer.from(await data.arrayBuffer());
    if (total + bytes.length > MAX_TOTAL_DOC_BYTES) {
      skipped.push(label);
      continue;
    }
    total += bytes.length;
    docs.push({
      label,
      fileName: file.name || "documento",
      contentType: contentTypeFor(file.name || ""),
      bytes,
    });
  }

  // Contesto testuale: dati gia noti della pratica + appunti chiamata.
  const contextLines = [
    `Dati gia noti dalla pratica ${practice.code}:`,
    `- Cliente/erede referente: ${practice.client_name || "n/d"}`,
    `- Relazione col defunto: ${practice.relation || "n/d"}`,
    `- Defunto: ${practice.deceased_name || "n/d"} (CF: ${practice.deceased_cf || "n/d"})`,
    `- Data decesso: ${practice.date_of_death || "n/d"}`,
    `- Ultima residenza: ${practice.residence || "n/d"}`,
    `- Numero eredi dichiarato: ${practice.heirs_count}`,
    `- Testamento: ${practice.has_will ? "si" : "no"}`,
    `- Immobili: ${practice.has_real_estate ? `si (${practice.real_estate_count ?? "?"})` : "no"}`,
  ];
  if (callNotes) {
    contextLines.push("", "Appunti chiamata del geometra:", callNotes);
  }

  const content: Record<string, unknown>[] = [
    { type: "input_text", text: contextLines.join("\n") },
  ];
  for (const doc of docs) {
    const b64 = doc.bytes.toString("base64");
    if (doc.contentType === "application/pdf") {
      content.push({
        type: "input_file",
        filename: doc.fileName,
        file_data: `data:application/pdf;base64,${b64}`,
      });
    } else {
      content.push({
        type: "input_image",
        image_url: `data:${doc.contentType};base64,${b64}`,
      });
    }
    content.push({
      type: "input_text",
      text: `(Il file precedente corrisponde alla voce checklist: "${doc.label}")`,
    });
  }

  const body = {
    model: AI_MODEL,
    input: [
      { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
      { role: "user", content },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "estrazione_successione",
        strict: true,
        schema: extractionSchema,
      },
    },
  };

  const stamp = new Date().toISOString();
  const base: Omit<ExtractionResult, "status"> = {
    model: AI_MODEL,
    extractedAt: stamp,
    docsUsed: docs.map((d) => d.label),
    docsSkipped: skipped,
    usedCallNotes: Boolean(callNotes),
  };

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[extraction] OpenAI:", res.status, detail.slice(0, 500));
      const result: ExtractionResult = {
        ...base,
        status: "ERROR",
        error: `Il servizio AI ha risposto con un errore (${res.status}).`,
      };
      await saveExtraction(admin, practiceId, result);
      return { ok: false, error: result.error! };
    }

    const payload = (await res.json()) as {
      output?: { type: string; content?: { type: string; text?: string }[] }[];
    };
    const text = (payload.output ?? [])
      .filter((o) => o.type === "message")
      .flatMap((o) => o.content ?? [])
      .filter((c) => c.type === "output_text")
      .map((c) => c.text ?? "")
      .join("");

    const data = JSON.parse(text) as ExtractionData;
    const result: ExtractionResult = { ...base, status: "READY", data };
    await saveExtraction(admin, practiceId, result);
    return { ok: true, result };
  } catch (err) {
    console.error("[extraction] eccezione:", err);
    const result: ExtractionResult = {
      ...base,
      status: "ERROR",
      error: "Estrazione non riuscita: risposta del modello non valida o rete assente.",
    };
    await saveExtraction(admin, practiceId, result);
    return { ok: false, error: result.error! };
  }
}
