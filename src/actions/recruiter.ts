"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Identifiers come from a URL, so they are constrained before reaching a query. */
function safeId(raw: string): string {
  return raw.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);
}

export async function setRoleRecruiter() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Written to auth metadata as well as the table: middleware reads metadata and
  // cannot see the profiles row.
  const { error: metaError } = await supabase.auth.updateUser({
    data: { role: "recruiter", onboarding_completed: true },
  });
  if (metaError) return { success: false, error: metaError.message };

  await supabase.from("profiles").update({ role: "recruiter" }).eq("id", user.id);

  revalidatePath("/recruiter");
  return { success: true };
}

export async function saveCandidate(passportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const id = safeId(passportId);
  if (!id) return { success: false, error: "That passport ID is not valid." };

  const { error } = await supabase
    .from("saved_candidates")
    .upsert({ recruiter_id: user.id, passport_id: id }, { onConflict: "recruiter_id,passport_id" });

  if (error) return { success: false, error: "Could not save this candidate." };

  revalidatePath("/recruiter");
  revalidatePath(`/recruiter/candidate/${id}`);
  return { success: true };
}

export async function removeCandidate(passportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("saved_candidates")
    .delete()
    .eq("recruiter_id", user.id)
    .eq("passport_id", safeId(passportId));

  if (error) return { success: false, error: "Could not remove this candidate." };

  revalidatePath("/recruiter");
  revalidatePath(`/recruiter/candidate/${safeId(passportId)}`);
  return { success: true };
}
