import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="light relative flex flex-col md:flex-row gap-0 md:gap-[12px] h-screen w-full p-0 md:p-[12px] overflow-hidden text-stone-900" style={{ colorScheme: "light" }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-20 blur-md scale-110"
        style={{ backgroundImage: "url('/bg-image.png')" }}
      />
      
      {/* White Overlay */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none -z-10" />

      <MobileHeader />
      <div className="hidden md:flex h-full relative z-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto relative z-0 rounded-none md:rounded-[24px] border-0 md:border border-stone-200/50 shadow-sm" style={{ backgroundColor: "#fdf8f0" }}>
        {children}
      </main>
    </div>
  );
}
