export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[url('/login-bg.png')] bg-cover bg-center bg-no-repeat" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
