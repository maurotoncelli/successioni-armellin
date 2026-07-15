import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { SiteNoteRow } from "@/lib/supabase/types";

/*
  Appunti "Migliorie sito" (@05): note libere di Lorenzo sulle modifiche da
  fare al sito (le segna quando se ne accorge, le lavora in blocco).
  Accesso solo server-side via service_role; le action fanno requireAdmin.
*/

export type SiteNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

function mapRow(row: SiteNoteRow): SiteNote {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listSiteNotes(): Promise<SiteNote[]> {
  if (!isAdminConfigured) return [];
  try {
    const { data, error } = await getAdminClient()
      .from("site_notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[site-notes] list:", err);
    return [];
  }
}

export async function createSiteNote(
  title: string,
  body: string,
): Promise<SiteNote | null> {
  if (!isAdminConfigured) return null;
  const { data, error } = await getAdminClient()
    .from("site_notes")
    .insert({ title, body })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateSiteNote(
  id: string,
  title: string,
  body: string,
): Promise<void> {
  if (!isAdminConfigured) return;
  const { error } = await getAdminClient()
    .from("site_notes")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSiteNote(id: string): Promise<void> {
  if (!isAdminConfigured) return;
  const { error } = await getAdminClient()
    .from("site_notes")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
