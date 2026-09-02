"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  const upperId = id.toUpperCase();
  const filterOr = `snapshot_data->>student_id.eq.${upperId},snapshot_data->>card_id.eq.${upperId},snapshot_data->>student_id.eq.${id},snapshot_data->>card_id.eq.${id}`;

  let { data: passport } = await supabase
    .from("passports")
    .select("snapshot_data")
    .eq("is_public", true)
    .or(filterOr)
    .limit(1)
    .maybeSingle();

  if (!passport) {
    try {
      const { data: aData } = await createAdminClient()
        .from("passports")
        .select("snapshot_data")
        .eq("is_public", true)
        .or(filterOr)
        .limit(1)
        .maybeSingle();
      if (aData) passport = aData;
    } catch {}
  }

  const canonicalId = (passport?.snapshot_data as { student_id?: string } | null)?.student_id;
  if (!canonicalId) {
    return {
      success: false,
      error: "No shared passport matches that ID. Check the ID, or ask the student to publish their passport.",
    };
  }

  const { error } = await supabase
    .from("saved_candidates")
    .upsert(
      { recruiter_id: user.id, passport_id: canonicalId },
      { onConflict: "recruiter_id,passport_id" }
    );

  if (error) return { success: false, error: "Could not save this candidate." };

  revalidatePath("/recruiter");
  revalidatePath(`/recruiter/candidate/${canonicalId}`);
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
