export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {children}
    </div>
  );
}
