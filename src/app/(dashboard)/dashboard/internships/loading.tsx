import { Briefcase, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-6 animate-pulse">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative z-10">
            <Sparkles className="w-10 h-10 text-emerald-400/80" />
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center justify-center gap-2">
            Generating Matches <span className="flex space-x-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span><span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span></span>
          </h2>
          <p className="text-stone-500 max-w-sm mx-auto text-base">
            Our AI is analyzing your Skill Passport and generating perfectly tailored internship opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
