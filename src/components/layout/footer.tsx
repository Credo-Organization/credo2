import Link from "next/link";
import { PaperAirplane } from "@/components/landing/doodle-elements";

export function Footer() {
  return (
    <footer className="border-t-2 border-zinc-900 bg-[#FAF9F6] text-zinc-900 relative overflow-hidden select-none">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating doodle paper airplane in upper right */}
      <div className="absolute top-8 right-12 hidden md:block pointer-events-none opacity-60 rotate-12">
        <PaperAirplane className="scale-75" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Colophon */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-black text-sm">
                M
              </div>
              <span className="text-2xl font-black tracking-tight text-zinc-950">Minskey</span>
            </Link>

            <p className="mt-3 text-sm text-zinc-600 max-w-[260px] leading-relaxed">
              Evidence-backed skill identity for the next generation of engineers and hackathon squads.
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-zinc-900/30 text-xs font-bold text-blue-950">
              <span>★ 100% Cryptographic Proof</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>Product</span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Skill Passport", href: "/#preview" },
                { name: "How It Works", href: "/#how-it-works" },
                { name: "Features", href: "/#features" },
                { name: "Hackathon Teams", href: "/teams" },
                { name: "SaaS Pricing", href: "/pricing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Community */}
          <div>
            <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>Ecosystem</span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Smart India Hackathon", href: "/teams" },
                { name: "GitHub Ingestion", href: "#features" },
                { name: "Recruiter Radar", href: "#preview" },
                { name: "Student Roadmap", href: "#how-it-works" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-zinc-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colophon & Hand-Drawn Note */}
          <div className="col-span-2 md:col-span-1">
            <div className="p-4 rounded-2xl border-2 border-zinc-900 bg-amber-100/70 shadow-[3px_3px_0px_0px_#18181B] rotate-[-1deg]">
              <span className="font-doodle text-xl font-bold text-amber-950 block mb-1">
                Built for builders 🛠️
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                No buzzwords. No unverified claims. Just authentic engineering proof.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Cursive Sign-off */}
        <div className="mt-14 pt-8 border-t-2 border-dashed border-zinc-900/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 font-medium">
            © {new Date().getFullYear()} Minskey. All code belongs to the creators.
          </p>

          <div className="flex items-center gap-2">
            <span className="font-doodle text-xl font-bold text-zinc-800">
              Crafted with 💙 for ambitious engineers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
