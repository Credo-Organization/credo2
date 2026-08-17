import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-theme flex h-screen overflow-hidden bg-background text-foreground relative">
      {/* Subtle Grainy Dashboard Background */}
      <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-[0.025] mix-blend-multiply pointer-events-none" />
      
      {/* Subtle Top Spotlight for depth */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at top,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.2) 30%,
              rgba(0, 0, 0, 0.0) 70%
            )
          `,
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex h-full w-full">
        <Sidebar user={user} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
