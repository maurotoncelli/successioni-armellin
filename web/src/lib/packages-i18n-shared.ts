/*
  Traduzioni marketing dei pacchetti/add-on (IT resta in tabella packages/addons).
  Schema condiviso client/server per il CRM.
*/

export type PackageCopyI18n = {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  badge: string | null;
};

export type AddonCopyI18n = {
  name: string;
  description: string;
};

export type LocaleCatalogI18n = {
  packages: Record<string, PackageCopyI18n>;
  addons: Record<string, AddonCopyI18n>;
};

export type PackagesI18nState = {
  updatedAt: string | null;
  locales: Record<string, LocaleCatalogI18n>;
};

export const EMPTY_PACKAGES_I18N: PackagesI18nState = {
  updatedAt: null,
  locales: {},
};
