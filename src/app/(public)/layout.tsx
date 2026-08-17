export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-theme min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Subtle Grainy Background */}
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

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
