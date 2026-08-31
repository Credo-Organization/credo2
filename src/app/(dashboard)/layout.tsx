import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-[12px] h-screen w-full bg-black p-0 md:p-[12px] overflow-hidden text-white">
      <MobileHeader />
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto relative bg-[#0f0f0f] rounded-none md:rounded-[24px] border-0 md:border border-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
        {children}
      </main>
    </div>
  );
}
