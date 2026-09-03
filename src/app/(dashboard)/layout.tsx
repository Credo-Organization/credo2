import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col md:flex-row gap-0 md:gap-3 h-screen h-[100dvh] w-full p-0 md:p-3 overflow-hidden text-zinc-900 dark:text-zinc-100 bg-[#FAF9F6] dark:bg-[#000000] transition-colors">
      {/* Background Architectural Dot Grid */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(#52525B 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <MobileHeader />
      <div className="hidden md:flex h-full relative z-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 rounded-none md:rounded-[28px] border-0 md:border md:border-stone-200/80 dark:md:border-zinc-800 shadow-xs bg-[#FAF9F6] dark:bg-[#050507] transition-colors pb-24 md:pb-0 touch-scroll w-full min-w-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
