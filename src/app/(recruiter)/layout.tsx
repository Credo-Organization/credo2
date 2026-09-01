import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecruiterHeader } from "@/components/recruiter/recruiter-header";

/**
 * The same shell the student dashboard uses - blurred backdrop, floating cream
 * panel - so the two consoles read as one product. The chrome differs because
 * the job does: a top bar instead of a navigation rail.
 *
 * Auth is checked here as well as in each page. The layout is the cheaper place
 * to catch a signed-out visitor, and a page that forgets the check later still
 * cannot render.
 */
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
      className="light relative flex h-screen w-full flex-col overflow-hidden p-0 text-stone-900 md:p-[12px]"
      style={{ colorScheme: "light" }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20 scale-110 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/bg-image.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/10" />

      <main
        className="relative z-0 flex-1 overflow-y-auto rounded-none border-0 shadow-sm md:rounded-[24px] md:border md:border-stone-200/50"
        style={{ backgroundColor: "#fdf8f0" }}
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
