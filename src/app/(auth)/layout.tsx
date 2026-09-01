export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen flex items-center justify-center relative bg-[#09090b] text-foreground overflow-hidden">
      {/* Ambient background glows */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[360px] rounded-full blur-[120px] pointer-events-none opacity-30 -z-10"
        style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(147, 51, 234, 0.25) 50%, transparent 70%)" }}
      />
      <div 
        className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[520px] h-[300px] rounded-full blur-[110px] pointer-events-none opacity-20 -z-10"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)" }}
      />

      {/* Subtle geometric dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {children}
      </div>
    </div>
  );
}
