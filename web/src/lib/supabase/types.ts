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

export type PracticeStatusKey =
  | "LEAD"
  | "PREVENTIVO_INVIATO"
  | "PAGATO"
  | "ATTESA_DOC"
  | "LAVORAZIONE"
  | "INVIATA"
  | "CHIUSA"
  | "ANNULLATA";

export type ActionOwnerKey = "ADMIN" | "CLIENT" | "EXTERNAL" | "NONE";

export type PaymentStatusKey =
  | "NONE"
  | "PENDING"
  | "PAID"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  marketing_consent: boolean;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
};

export type PracticeRow = {
  id: string;
  code: string;
  status: PracticeStatusKey;
  action_owner: ActionOwnerKey;
  contact_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string;
  relation: string;
  deceased_name: string;
  deceased_cf: string;
  date_of_death: string | null;
  residence: string;
  has_will: boolean;
  heirs_count: number;
  has_minor_heirs: boolean;
  has_real_estate: boolean;
  real_estate_count: number | null;
  requires_custom_quote: boolean;
  urgent: boolean;
  suggested_package: PackageKey | null;
  selected_package: PackageKey | null;
  price: number;
  line_items: unknown;
  payment_status: PaymentStatusKey;
  payment_method: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  payment_recorded_by: string | null;
  opened_at: string | null;
  due_date: string | null;
  submitted_at: string | null;
  state_taxes: number | null;
  call_notes: string;
  payment_notes: string;
  notes: string;
  checklist: unknown;
  communications: unknown;
  tasks: unknown;
  log: unknown;
  created_at: string;
  updated_at: string;
};

export type StripeEventRow = {
  id: string;
  type: string;
  practice_id: string | null;
  created_at: string;
};

export type RoleKey = "ADMIN" | "CLIENT";

export type ProfileRow = {
  id: string;
  contact_id: string | null;
  role: RoleKey;
  created_at: string;
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
      contacts: {
        Row: ContactRow;
        Insert: Partial<ContactRow> &
          Pick<ContactRow, "first_name" | "last_name">;
        Update: Partial<ContactRow>;
        Relationships: [];
      };
      practices: {
        Row: PracticeRow;
        Insert: Partial<PracticeRow>;
        Update: Partial<PracticeRow>;
        Relationships: [];
      };
      stripe_events: {
        Row: StripeEventRow;
        Insert: Partial<StripeEventRow> & Pick<StripeEventRow, "id" | "type">;
        Update: Partial<StripeEventRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & Pick<ProfileRow, "id">;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      package_type: PackageKey;
      practice_status: PracticeStatusKey;
      action_owner: ActionOwnerKey;
      payment_status: PaymentStatusKey;
      role: RoleKey;
    };
    CompositeTypes: Record<string, never>;
  };
};
