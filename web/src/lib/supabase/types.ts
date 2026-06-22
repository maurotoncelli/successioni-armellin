/*
  Tipi del database (sottoinsieme CMS) scritti a mano per la prima fetta.
  Rigenerabili in futuro con: npx supabase gen types typescript --linked > src/lib/supabase/types.ts
*/

export type PackageKey = "SEMPLICE" | "COMPLETO" | "ZERO_STRESS";

export type PackageRow = {
  key: PackageKey;
  name: string;
  tagline: string | null;
  description: string;
  features: string[];
  price: number;
  extra_property_fee: number | null;
  sla_days: number | null;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type AddonRow = {
  key: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export type FaqRow = {
  id: string;
  locale: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      packages: {
        Row: PackageRow;
        Insert: Partial<PackageRow> &
          Pick<PackageRow, "key" | "name" | "description" | "price">;
        Update: Partial<PackageRow>;
        Relationships: [];
      };
      addons: {
        Row: AddonRow;
        Insert: Partial<AddonRow> & Pick<AddonRow, "key" | "name" | "price">;
        Update: Partial<AddonRow>;
        Relationships: [];
      };
      faqs: {
        Row: FaqRow;
        Insert: Partial<FaqRow> & Pick<FaqRow, "question" | "answer">;
        Update: Partial<FaqRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      package_type: PackageKey;
    };
    CompositeTypes: Record<string, never>;
  };
};
