import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecruiterHeader } from "@/components/recruiter/recruiter-header";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Recruiter";

  return (
    <div
      className="light relative flex h-screen w-full flex-col overflow-hidden p-0 text-zinc-900 md:p-3 bg-[#FAF9F6]"
      style={{ colorScheme: "light" }}
    >
      {/* Background Architectural Dot Grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <main
        className="relative z-0 flex-1 overflow-y-auto rounded-none border-0 shadow-xs md:rounded-[28px] md:border md:border-stone-200/80 bg-white"
      >
        <RecruiterHeader
          name={name}
          email={user.email ?? ""}
          avatarUrl={user.user_metadata?.avatar_url}
        />
        {children}
      </main>
    </div>
  );
}
