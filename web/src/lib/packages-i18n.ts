import "server-only";
import { unstable_cache, updateTag } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import { LOCALES, type Locale } from "@/lib/content";
import { isAiConfigured } from "@/lib/extraction";
import type { Package, Addon } from "@/content/site";
import {
  EMPTY_PACKAGES_I18N,
  type AddonCopyI18n,
  type LocaleCatalogI18n,
  type PackageCopyI18n,
  type PackagesI18nState,
} from "@/lib/packages-i18n-shared";

export type {
  AddonCopyI18n,
  LocaleCatalogI18n,
  PackageCopyI18n,
  PackagesI18nState,
};
export { EMPTY_PACKAGES_I18N } from "@/lib/packages-i18n-shared";

/*
  Traduzioni listino (pacchetti + add-on) per locale ≠ IT.
  NO-DDL: `practice-docs/site/_packages-i18n.json`.
  IT resta editabile dal CRM nella tabella packages/addons.
  Seed AR incluso cosi `lang=ar` funziona anche prima del primo click CRM.
*/

export const PACKAGES_I18N_TAG = "cms:packages-i18n";
const STORAGE_PATH = "site/_packages-i18n.json";

const AI_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-terra";

const LOCALE_LABELS: Record<Exclude<Locale, "it">, string> = {
  en: "English",
  ar: "Modern Standard Arabic",
  de: "German",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  zh: "Simplified Chinese",
  hi: "Hindi",
  sq: "Albanian",
  fr: "French",
};

/** Seed arabo (allineato ai nomi listino IT correnti). */
const SEED_AR: LocaleCatalogI18n = {
  packages: {
    SEMPLICE: {
      name: "خلافة بسيطة",
      tagline: "حسابات وسيولة فقط، بدون عقارات",
      description:
        "إعداد وتقديم إقرار الخلافة إلى وكالة الإيرادات للحالات بدون عقارات: حسابات جارية ودفاتر وسيولة.",
      features: [
        "إعداد الإقرار",
        "إرسال إلكتروني إلى وكالة الإيرادات",
        "حساب الضرائب يُبلَّغ قبل الإرسال",
        "مساعدة من شخص حقيقي",
      ],
      badge: null,
    },
    COMPLETO: {
      name: "خلافة مع عقارات",
      tagline: "من عقار واحد إلى 3، مع نقل الملكيّة العقارية",
      description:
        "الحزمة لمن يرث منزلاً أو عقارات قليلة: التحقق من البيانات العقارية، الإقرار، الإرسال ونقل الملكيّة. تغطي حتى 5 ورثة و5 حسابات مصرفية.",
      features: [
        "كل ما في حزمة البسيطة",
        "من عقار واحد إلى 3، حتى 5 ورثة و5 حسابات",
        "تحقق من البيانات العقارية من مساح",
        "نقل الملكيّة العقارية مشمول",
      ],
      badge: "الأكثر اختيارًا",
    },
    ZERO_STRESS: {
      name: "خلافة موسّعة",
      tagline: "من 3 إلى 8 عقارات، مع استرداد المستندات",
      description:
        "للثروات الأكثر تعقيدًا: عقارات أكثر ومستندات للاسترداد. نهتم بها نحن، مع أولوية معالجة وتحديثات في كل خطوة.",
      features: [
        "كل ما في حزمة العقارات",
        "من 3 إلى 8 عقارات، حتى 5 ورثة و5 حسابات",
        "استرداد المستندات الناقصة من الجهات والبنوك",
        "أولوية المعالجة",
      ],
      badge: null,
    },
  },
  addons: {
    RIUNIONE_USUFRUTTO: {
      name: "اجتماع حق الانتفاع",
      description: "تحديث عقاري بعد انقضاء حق الانتفاع.",
    },
    ADEGUAMENTO_IMU: {
      name: "تعديل وإعادة حساب IMU",
      description:
        "إعادة حساب IMU بعد الخلافة وتحديث للمالكين الجدد.",
    },
    VOLTURA_EXTRA: {
      name: "نقل ملكية إضافي",
      description: "نقل ملكية لعقارات تتجاوز ما يشمله الحزمة.",
    },
  },
};

/** Seed inglese (cortesia; allineato ai nomi listino IT correnti). */
const SEED_EN: LocaleCatalogI18n = {
  packages: {
    SEMPLICE: {
      name: "Simple succession",
      tagline: "Accounts and cash only, no property",
      description:
        "Preparation and filing of the succession declaration with Agenzia delle Entrate for cases without property: current accounts, passbooks and cash.",
      features: [
        "Declaration preparation",
        "Electronic filing with Agenzia delle Entrate",
        "Taxes calculated and notified before filing",
        "Help from a real person",
      ],
      badge: null,
    },
    COMPLETO: {
      name: "Succession with property",
      tagline: "From 1 to 3 properties, with cadastral transfer",
      description:
        "The package for those inheriting a home or a few properties: cadastral data check, declaration, filing and ownership transfer. Covers up to 5 heirs and 5 bank accounts.",
      features: [
        "Everything in the Simple package",
        "From 1 to 3 properties, up to 5 heirs and 5 accounts",
        "Cadastral data check by a surveyor",
        "Cadastral transfer included",
      ],
      badge: "Most chosen",
    },
    ZERO_STRESS: {
      name: "Extended succession",
      tagline: "From 3 to 8 properties, with document retrieval",
      description:
        "For more complex estates: more properties and documents to retrieve. We handle it, with priority processing and updates at every step.",
      features: [
        "Everything in the property package",
        "From 3 to 8 properties, up to 5 heirs and 5 accounts",
        "Retrieval of missing documents from authorities and banks",
        "Priority processing",
      ],
      badge: null,
    },
  },
  addons: {
    RIUNIONE_USUFRUTTO: {
      name: "Usufruct reunion",
      description: "Cadastral update after usufruct ends.",
    },
    ADEGUAMENTO_IMU: {
      name: "IMU adjustment and recalculation",
      description:
        "IMU recalculation after succession and update for the new owners.",
    },
    VOLTURA_EXTRA: {
      name: "Extra cadastral transfer",
      description:
        "Cadastral transfer for properties beyond what the package includes.",
    },
  },
};

/** Seed turco (cortesia; allineato ai nomi listino IT correnti). */
const SEED_TR: LocaleCatalogI18n = {
  packages: {
    SEMPLICE: {
      name: "Basit veraset",
      tagline: "Yalnızca hesaplar ve nakit, gayrimenkul yok",
      description:
        "Gayrimenkul olmayan durumlar için Agenzia delle Entrate'e veraset beyannamesinin hazırlanması ve iletilmesi: vadesiz hesaplar, banka cüzdanları ve nakit.",
      features: [
        "Beyanname hazırlığı",
        "Agenzia delle Entrate'e elektronik gönderim",
        "Vergiler gönderimden önce hesaplanır ve bildirilir",
        "Gerçek bir kişiden destek",
      ],
      badge: null,
    },
    COMPLETO: {
      name: "Gayrimenkulli veraset",
      tagline: "1 ila 3 gayrimenkul, tapu devri ile",
      description:
        "Ev veya birkaç gayrimenkul miras alanlar için: kadastro verisi kontrolü, beyanname, iletim ve mülkiyet devri. 5'e kadar mirasçı ve 5 banka hesabını kapsar.",
      features: [
        "Basit paketteki her şey",
        "1 ila 3 gayrimenkul, 5'e kadar mirasçı ve 5 hesap",
        "Bir Geometra tarafından kadastro verisi kontrolü",
        "Kadastro devri dahil",
      ],
      badge: "En çok seçilen",
    },
    ZERO_STRESS: {
      name: "Genişletilmiş veraset",
      tagline: "3 ila 8 gayrimenkul, belge temini ile",
      description:
        "Daha karmaşık miraslar için: daha fazla gayrimenkul ve temin edilecek belgeler. Her adımda öncelikli işlem ve güncellemelerle biz hallederiz.",
      features: [
        "Gayrimenkulli paketteki her şey",
        "3 ila 8 gayrimenkul, 5'e kadar mirasçı ve 5 hesap",
        "Kurum ve bankalardan eksik belgelerin temini",
        "Öncelikli işlem",
      ],
      badge: null,
    },
  },
  addons: {
    RIUNIONE_USUFRUTTO: {
      name: "İntifa hakkı birleşmesi",
      description: "İntifa hakkı sona erdikten sonra kadastro güncellemesi.",
    },
    ADEGUAMENTO_IMU: {
      name: "IMU ayarlama ve yeniden hesaplama",
      description:
        "Veraset sonrası IMU yeniden hesaplaması ve yeni sahipler için güncelleme.",
    },
    VOLTURA_EXTRA: {
      name: "Ek kadastro devri",
      description:
        "Paketin kapsamının ötesindeki gayrimenkuller için kadastro devri.",
    },
  },
};

/** Seed francese (cortesia; allineato ai nomi listino IT correnti). */
const SEED_FR: LocaleCatalogI18n = {
  packages: {
    SEMPLICE: {
      name: "Succession simple",
      tagline: "Comptes et liquidités uniquement, sans immobilier",
      description:
        "Préparation et dépôt de la déclaration de succession auprès de l'Agenzia delle Entrate pour les dossiers sans immobilier : comptes courants, livrets et liquidités.",
      features: [
        "Préparation de la déclaration",
        "Dépôt électronique auprès de l'Agenzia delle Entrate",
        "Impôts calculés et notifiés avant le dépôt",
        "Aide d'une personne réelle",
      ],
      badge: null,
    },
    COMPLETO: {
      name: "Succession avec immobilier",
      tagline: "De 1 à 3 biens, avec mutation cadastrale",
      description:
        "La formule pour ceux qui héritent d'un logement ou de quelques biens : contrôle des données cadastrales, déclaration, dépôt et transfert de propriété. Jusqu'à 5 héritiers et 5 comptes bancaires.",
      features: [
        "Tout ce qui est inclus dans la formule Simple",
        "De 1 à 3 biens, jusqu'à 5 héritiers et 5 comptes",
        "Contrôle des données cadastrales par un Geometra",
        "Mutation cadastrale incluse",
      ],
      badge: "La plus choisie",
    },
    ZERO_STRESS: {
      name: "Succession étendue",
      tagline: "De 3 à 8 biens, avec récupération des documents",
      description:
        "Pour les successions plus complexes : davantage de biens et de documents à récupérer. Nous nous en chargeons, avec traitement prioritaire et mises à jour à chaque étape.",
      features: [
        "Tout ce qui est inclus dans la formule avec immobilier",
        "De 3 à 8 biens, jusqu'à 5 héritiers et 5 comptes",
        "Récupération des documents manquants auprès des administrations et des banques",
        "Traitement prioritaire",
      ],
      badge: null,
    },
  },
  addons: {
    RIUNIONE_USUFRUTTO: {
      name: "Réunion d'usufruit",
      description: "Mise à jour cadastrale après extinction de l'usufruit.",
    },
    ADEGUAMENTO_IMU: {
      name: "Ajustement et recalcul IMU",
      description:
        "Recalcul de l'IMU après succession et mise à jour pour les nouveaux propriétaires.",
    },
    VOLTURA_EXTRA: {
      name: "Mutation cadastrale supplémentaire",
      description:
        "Mutation cadastrale pour des biens au-delà de ceux inclus dans la formule.",
    },
  },
};

/** Seed albanese (cortesia; allineato ai nomi listino IT correnti). */
const SEED_SQ: LocaleCatalogI18n = {
  packages: {
    SEMPLICE: {
      name: "Trashëgimi e thjeshtë",
      tagline: "Vetëm llogari dhe likuiditet, pa pasuri të paluajtshme",
      description:
        "Përgatitja dhe dërgimi i deklaratës së trashëgimisë te Agenzia delle Entrate për rastet pa pasuri të paluajtshme: llogari rrjedhëse, libreza dhe likuiditet.",
      features: [
        "Përgatitja e deklaratës",
        "Dërgim elektronik te Agenzia delle Entrate",
        "Taksat llogariten dhe komunikohen para dërgimit",
        "Ndihmë nga një person real",
      ],
      badge: null,
    },
    COMPLETO: {
      name: "Trashëgimi me pasuri të paluajtshme",
      tagline: "Nga 1 deri në 3 pasuri, me transferim kadastral",
      description:
        "Paketa për ata që trashëgojnë një shtëpi ose disa pasuri: kontroll i të dhënave kadastrale, deklaratë, dërgim dhe transferim pronësie. Deri në 5 trashëgimtarë dhe 5 llogari bankare.",
      features: [
        "Gjithçka në paketën e thjeshtë",
        "Nga 1 deri në 3 pasuri, deri në 5 trashëgimtarë dhe 5 llogari",
        "Kontroll i të dhënave kadastrale nga një Geometra",
        "Transferim kadastral i përfshirë",
      ],
      badge: "Më e zgjedhura",
    },
    ZERO_STRESS: {
      name: "Trashëgimi e zgjeruar",
      tagline: "Nga 3 deri në 8 pasuri, me rikuperim dokumentesh",
      description:
        "Për trashëgimi më komplekse: më shumë pasuri dhe dokumente për t'u rikuperuar. Ne e trajtojmë, me përpunim prioritare dhe përditësime në çdo hap.",
      features: [
        "Gjithçka në paketën me pasuri të paluajtshme",
        "Nga 3 deri në 8 pasuri, deri në 5 trashëgimtarë dhe 5 llogari",
        "Rikuperim i dokumenteve që mungojnë nga institucionet dhe bankat",
        "Përpunim prioritare",
      ],
      badge: null,
    },
  },
  addons: {
    RIUNIONE_USUFRUTTO: {
      name: "Ribashkim i uzufruktit",
      description: "Përditësim kadastral pas mbarimit të uzufruktit.",
    },
    ADEGUAMENTO_IMU: {
      name: "Përshtatje dhe rillogaritje IMU",
      description:
        "Rillogaritje IMU pas trashëgimisë dhe përditësim për pronarët e rinj.",
    },
    VOLTURA_EXTRA: {
      name: "Transferim kadastral shtesë",
      description:
        "Transferim kadastral për pasuri përtej atyre që përfshin paketa.",
    },
  },
};

function normalizePackageCopy(raw: unknown): PackageCopyI18n | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  if (!name) return null;
  const features = Array.isArray(o.features)
    ? o.features.filter((x): x is string => typeof x === "string" && x.trim() !== "")
    : [];
  return {
    name,
    tagline: typeof o.tagline === "string" ? o.tagline : "",
    description: typeof o.description === "string" ? o.description : "",
    features,
    badge:
      typeof o.badge === "string" && o.badge.trim() ? o.badge.trim() : null,
  };
}

function normalizeAddonCopy(raw: unknown): AddonCopyI18n | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  if (!name) return null;
  return {
    name,
    description: typeof o.description === "string" ? o.description : "",
  };
}

function normalizeCatalog(raw: unknown): LocaleCatalogI18n {
  const empty: LocaleCatalogI18n = { packages: {}, addons: {} };
  if (!raw || typeof raw !== "object") return empty;
  const o = raw as { packages?: unknown; addons?: unknown };
  const packages: Record<string, PackageCopyI18n> = {};
  const addons: Record<string, AddonCopyI18n> = {};
  if (o.packages && typeof o.packages === "object") {
    for (const [key, val] of Object.entries(o.packages as Record<string, unknown>)) {
      const copy = normalizePackageCopy(val);
      if (copy) packages[key] = copy;
    }
  }
  if (o.addons && typeof o.addons === "object") {
    for (const [key, val] of Object.entries(o.addons as Record<string, unknown>)) {
      const copy = normalizeAddonCopy(val);
      if (copy) addons[key] = copy;
    }
  }
  return { packages, addons };
}

function normalizeState(raw: unknown): PackagesI18nState {
  if (!raw || typeof raw !== "object") {
    return {
      ...EMPTY_PACKAGES_I18N,
      locales: {
        ar: SEED_AR,
        en: SEED_EN,
        tr: SEED_TR,
        fr: SEED_FR,
        sq: SEED_SQ,
      },
    };
  }
  const o = raw as Partial<PackagesI18nState>;
  const locales: Record<string, LocaleCatalogI18n> = {};
  if (o.locales && typeof o.locales === "object") {
    for (const [loc, cat] of Object.entries(o.locales)) {
      if (loc === "it") continue;
      locales[loc] = normalizeCatalog(cat);
    }
  }
  if (!locales.ar || Object.keys(locales.ar.packages).length === 0) {
    locales.ar = SEED_AR;
  }
  if (!locales.en || Object.keys(locales.en.packages).length === 0) {
    locales.en = SEED_EN;
  }
  if (!locales.tr || Object.keys(locales.tr.packages).length === 0) {
    locales.tr = SEED_TR;
  }
  if (!locales.fr || Object.keys(locales.fr.packages).length === 0) {
    locales.fr = SEED_FR;
  }
  if (!locales.sq || Object.keys(locales.sq.packages).length === 0) {
    locales.sq = SEED_SQ;
  }
  return {
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
    locales,
  };
}

async function readFromStorage(): Promise<PackagesI18nState> {
  const seeds = {
    ar: SEED_AR,
    en: SEED_EN,
    tr: SEED_TR,
    fr: SEED_FR,
    sq: SEED_SQ,
  };
  if (!isAdminConfigured) {
    return normalizeState({ locales: seeds });
  }
  try {
    const admin = getAdminClient();
    const { data, error } = await admin.storage
      .from(DOC_BUCKET)
      .download(STORAGE_PATH);
    if (error || !data) {
      return normalizeState({ locales: seeds });
    }
    return normalizeState(JSON.parse(await data.text()));
  } catch (err) {
    console.error("[packages-i18n] read:", err);
    return normalizeState({ locales: seeds });
  }
}

export function getPackagesI18nState(): Promise<PackagesI18nState> {
  return unstable_cache(readFromStorage, ["packages-i18n-v1"], {
    tags: [PACKAGES_I18N_TAG],
    revalidate: 300,
  })();
}

export async function getPackagesI18nStateFresh(): Promise<PackagesI18nState> {
  return readFromStorage();
}

export async function savePackagesI18nState(
  state: PackagesI18nState,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isAdminConfigured) {
    return { ok: false, error: "Database non collegato." };
  }
  const next = normalizeState({
    ...state,
    updatedAt: new Date().toISOString(),
  });
  try {
    const admin = getAdminClient();
    await ensureDocBucket(admin);
    const blob = Buffer.from(JSON.stringify(next), "utf8");
    const { error } = await admin.storage
      .from(DOC_BUCKET)
      .upload(STORAGE_PATH, blob, {
        contentType: "application/json",
        upsert: true,
      });
    if (error) throw error;
    updateTag(PACKAGES_I18N_TAG);
    return { ok: true };
  } catch (err) {
    console.error("[packages-i18n] save:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }
}

export function applyPackageI18n(
  pkg: Package,
  locale: string,
  state: PackagesI18nState,
): Package {
  if (locale === "it") return pkg;
  const copy = state.locales[locale]?.packages[pkg.key];
  if (!copy) return pkg;
  return {
    ...pkg,
    name: copy.name || pkg.name,
    tagline: copy.tagline || pkg.tagline,
    description: copy.description || pkg.description,
    features: copy.features.length > 0 ? copy.features : pkg.features,
    badge: copy.badge ?? pkg.badge,
  };
}

export function applyAddonI18n(
  addon: Addon,
  locale: string,
  state: PackagesI18nState,
): Addon {
  if (locale === "it") return addon;
  const copy = state.locales[locale]?.addons[addon.key];
  if (!copy) return addon;
  return {
    ...addon,
    name: copy.name || addon.name,
    description: copy.description || addon.description,
  };
}

type SourcePackage = {
  key: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  badge: string | null;
};

type SourceAddon = {
  key: string;
  name: string;
  description: string;
};

function extractJsonText(payload: unknown): string {
  const p = payload as {
    output?: { type: string; content?: { type: string; text?: string }[] }[];
  };
  return (p.output ?? [])
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("");
}

async function translateLocaleCatalog(
  locale: Exclude<Locale, "it">,
  packages: SourcePackage[],
  addons: SourceAddon[],
): Promise<LocaleCatalogI18n> {
  const lang = LOCALE_LABELS[locale];
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["packages", "addons"],
    properties: {
      packages: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "key",
            "name",
            "tagline",
            "description",
            "features",
            "badge",
          ],
          properties: {
            key: { type: "string" },
            name: { type: "string" },
            tagline: { type: "string" },
            description: { type: "string" },
            features: { type: "array", items: { type: "string" } },
            badge: { type: "string" },
          },
        },
      },
      addons: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["key", "name", "description"],
          properties: {
            key: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
  };

  const body = {
    model: AI_MODEL,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `You translate Italian marketing copy for an Italian succession (inheritance tax filing) service into ${lang}. Keep proper nouns (Lorenzo, Entratel, Agenzia delle Entrate, IMU, IBAN) when natural; otherwise translate. Keep the same number of feature bullets and the same keys. If source badge is null or empty, set badge to empty string. Return one translated item per input key.`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({ packages, addons }),
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "listino_i18n",
        strict: true,
        schema,
      },
    },
  };

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
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 200)}`);
  }
  const parsed = JSON.parse(extractJsonText(await res.json())) as {
    packages?: unknown[];
    addons?: unknown[];
  };
  const catalog: LocaleCatalogI18n = { packages: {}, addons: {} };
  for (const row of parsed.packages ?? []) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const key = typeof r.key === "string" ? r.key : "";
    const copy = normalizePackageCopy(r);
    if (key && copy) catalog.packages[key] = copy;
  }
  for (const row of parsed.addons ?? []) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const key = typeof r.key === "string" ? r.key : "";
    const copy = normalizeAddonCopy(r);
    if (key && copy) catalog.addons[key] = copy;
  }
  return catalog;
}

/**
 * Rigenera le traduzioni di tutti i locale ≠ IT a partire dal listino IT corrente.
 * Richiede OPENAI_API_KEY.
 */
export async function refreshPackagesTranslations(input: {
  packages: SourcePackage[];
  addons: SourceAddon[];
}): Promise<
  | { ok: true; locales: string[]; updatedAt: string }
  | { ok: false; error: string }
> {
  if (!isAiConfigured) {
    return {
      ok: false,
      error:
        "OpenAI non configurato (OPENAI_API_KEY). Impostala come per l'estrazione AI.",
    };
  }
  if (!isAdminConfigured) {
    return { ok: false, error: "Database non collegato." };
  }

  const targets = LOCALES.filter((l): l is Exclude<Locale, "it"> => l !== "it");
  const locales: Record<string, LocaleCatalogI18n> = {};
  const errors: string[] = [];

  // Parallelismo limitato: 3 lingue alla volta (evita rate-limit / timeout).
  const concurrency = 3;
  for (let i = 0; i < targets.length; i += concurrency) {
    const batch = targets.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map((locale) =>
        translateLocaleCatalog(locale, input.packages, input.addons),
      ),
    );
    settled.forEach((res, idx) => {
      const locale = batch[idx]!;
      if (res.status === "fulfilled") {
        locales[locale] = res.value;
      } else {
        console.error("[packages-i18n] translate", locale, res.reason);
        errors.push(
          `${locale}: ${
            res.reason instanceof Error ? res.reason.message : "errore"
          }`,
        );
      }
    });
  }

  if (Object.keys(locales).length === 0) {
    return {
      ok: false,
      error: `Nessuna traduzione generata. ${errors.join("; ")}`,
    };
  }

  // Conserva seed/AR precedenti se una lingua fallisce.
  const prev = await readFromStorage();
  const merged: PackagesI18nState = {
    updatedAt: new Date().toISOString(),
    locales: { ...prev.locales, ...locales },
  };
  const saved = await savePackagesI18nState(merged);
  if (!saved.ok) return saved;

  return {
    ok: true,
    locales: Object.keys(locales),
    updatedAt: merged.updatedAt!,
  };
}
