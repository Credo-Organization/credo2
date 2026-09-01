import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRoleRecruiter } from "@/actions/recruiter";

export default async function RecruiterSignup() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/recruiter-signup");

  await setRoleRecruiter();
  redirect("/recruiter");
}
