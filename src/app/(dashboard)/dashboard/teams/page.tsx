import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TeamsClientHub } from "@/components/teams/teams-client-hub";

export default async function TeamsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch student profile & skills
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, headline, experience_level")
    .eq("id", user.id)
    .single();

  const { data: userSkills } = await supabase
    .from("user_skills")
    .select("skills(name)")
    .eq("profile_id", user.id);

  const skillsList = userSkills?.map((us: any) => us.skills?.name).filter(Boolean) || [
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "PostgreSQL"
  ];

  const studentName = profile?.full_name || user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "Team Lead");

  return (
    <div className="w-full min-h-full px-4 sm:px-8 py-8 max-w-[1400px] mx-auto">
      <TeamsClientHub
        initialTab="browse"
        userSkills={skillsList}
        careerGoal={profile?.headline || "Full Stack Engineer"}
        studentName={studentName}
      />
    </div>
  );
}
