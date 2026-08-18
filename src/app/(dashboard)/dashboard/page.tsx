import { SkillPassportCard } from "@/components/dashboard/skill-passport-card";
import { Target, Briefcase, Brain } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex items-center justify-start pl-8 overflow-hidden relative gap-6 lg:gap-10">
      {/* LEFT: Passport Card */}
      <div className="transform scale-[0.75] xl:scale-[0.85] 2xl:scale-90 origin-left transition-transform duration-300 flex-shrink-0">
        <SkillPassportCard />
      </div>

      {/* RIGHT: Skill Gap Analysis */}
      <div className="flex-1 max-w-[440px] hidden lg:flex flex-col justify-center gap-8 pr-8">
        
        {/* Section 1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Brain className="w-4 h-4 text-white/40" />
            <h3 className="text-[12px] font-bold tracking-widest text-white/50 uppercase">
              Skill Gap Analysis
            </h3>
          </div>
          <div>
            <p className="text-[15px] text-white/70 leading-relaxed font-medium">
              You have strong frontend skills, but lack backend frameworks and database experience for <span className="text-white">Full Stack Development</span>.
            </p>
          </div>
        </div>
        
        {/* Section 2 */}
        <div className="flex flex-col gap-4 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-white/40" />
            <h3 className="text-[12px] font-bold tracking-widest text-white/50 uppercase">
              Recommended Tech Stack
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {["PostgreSQL", "Go", "Docker", "GraphQL"].map((tech) => (
              <span key={tech} className="px-4 py-1.5 rounded-full border border-white/[0.12] text-[13px] text-white/80 font-medium tracking-wide">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col gap-4 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-white/40" />
            <h3 className="text-[12px] font-bold tracking-widest text-white/50 uppercase">
              Suggested Projects
            </h3>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] text-white/90 font-medium">Real-time Collaboration Workspace</span>
              <span className="text-[13px] text-white/50 leading-relaxed">Build using React, Go WebSockets, and PostgreSQL to master full-stack state and concurrency.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] text-white/90 font-medium">Microservices E-Commerce API</span>
              <span className="text-[13px] text-white/50 leading-relaxed">Dockerize independent Go services (auth, inventory, payments) to learn container orchestration.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] text-white/90 font-medium">GraphQL Analytics Dashboard</span>
              <span className="text-[13px] text-white/50 leading-relaxed">Aggregate complex data via GraphQL into a modern Tailwind dashboard.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
