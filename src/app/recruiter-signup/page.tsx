import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRoleRecruiter } from "@/actions/recruiter";

export default async function RecruiterSignup() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/recruiter-signup");

  const role = user.user_metadata?.role;

  // An account that already has a role keeps it. Converting a student to a
  // recruiter because they opened a link would silently cost them their
  // passport, their audited repositories and their shortlist of internships.
  if (role === "recruiter") redirect("/recruiter");
  if (role === "student") redirect("/dashboard");

  await setRoleRecruiter();
  redirect("/recruiter");
}
