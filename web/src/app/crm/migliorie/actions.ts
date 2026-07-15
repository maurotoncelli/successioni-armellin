"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  createSiteNote,
  updateSiteNote,
  deleteSiteNote,
} from "@/lib/site-notes";

/*
  Server action degli appunti "Migliorie sito" (@05). L'accesso e gia protetto
  dal layout /crm; requireAdmin qui e difesa in profondita (le action sono
  endpoint invocabili direttamente).
*/

export type NoteActionResult = { ok: true } | { ok: false; error: string };

export async function addSiteNote(
  title: string,
  body: string,
): Promise<NoteActionResult> {
  await requireAdmin();
  const cleanTitle = title.trim();
  const cleanBody = body.trim();
  if (!cleanTitle && !cleanBody) {
    return { ok: false, error: "Scrivi almeno un titolo o una nota." };
  }
  try {
    await createSiteNote(cleanTitle, cleanBody);
  } catch (err) {
    console.error("[crm] addSiteNote:", err);
    return { ok: false, error: "Salvataggio non riuscito, riprova." };
  }
  revalidatePath("/crm/migliorie");
  return { ok: true };
}

export async function editSiteNote(
  id: string,
  title: string,
  body: string,
): Promise<NoteActionResult> {
  await requireAdmin();
  const cleanTitle = title.trim();
  const cleanBody = body.trim();
  if (!cleanTitle && !cleanBody) {
    return { ok: false, error: "La nota non può essere vuota: eliminala se non serve più." };
  }
  try {
    await updateSiteNote(id, cleanTitle, cleanBody);
  } catch (err) {
    console.error("[crm] editSiteNote:", err);
    return { ok: false, error: "Salvataggio non riuscito, riprova." };
  }
  revalidatePath("/crm/migliorie");
  return { ok: true };
}

export async function removeSiteNote(id: string): Promise<NoteActionResult> {
  await requireAdmin();
  try {
    await deleteSiteNote(id);
  } catch (err) {
    console.error("[crm] removeSiteNote:", err);
    return { ok: false, error: "Eliminazione non riuscita, riprova." };
  }
  revalidatePath("/crm/migliorie");
  return { ok: true };
}
