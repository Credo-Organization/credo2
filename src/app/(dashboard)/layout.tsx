import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-[12px] h-screen w-full bg-black p-[12px] overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative bg-[#0f0f0f] rounded-[24px] border border-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
        {children}
      </main>
    </div>
  );
}
