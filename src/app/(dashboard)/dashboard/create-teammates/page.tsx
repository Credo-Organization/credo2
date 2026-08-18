import { PageHeader } from "@/components/shared/page-header";
import { UserPlus, Users, AlignLeft, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateTeammatesPage() {
  return (
    <div className="space-y-8 p-8 max-w-3xl mx-auto w-full">
      <PageHeader
        title="Find a Teammate"
        description="Post your requirements to find the perfect addition to your hackathon team."
        icon={UserPlus}
      />

      <Card className="p-8 bg-[#0a0a0a] border-white/[0.08] shadow-2xl">
        <form className="flex flex-col gap-8">
          
          {/* Team Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Flag className="w-4 h-4 text-white/40" />
              Team Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Quantum Coders" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
            />
          </div>

          {/* Hackathon Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/90 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-white/40" />
              Hackathon / Project Description
            </label>
            <textarea 
              rows={4}
              placeholder="Tell us about the hackathon you're participating in and what your project aims to solve..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Number Required */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Users className="w-4 h-4 text-white/40" />
                Teammates Required
              </label>
              <div className="relative">
                <select defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer">
                  <option value="" disabled className="text-black">Select number</option>
                  <option value="1" className="text-black">1 member</option>
                  <option value="2" className="text-black">2 members</option>
                  <option value="3" className="text-black">3 members</option>
                  <option value="4+" className="text-black">4+ members</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Gender Preference */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-white/40" />
                Gender Preference
              </label>
              <div className="relative">
                <select defaultValue="any" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer">
                  <option value="any" className="text-black">No Preference (Any)</option>
                  <option value="male" className="text-black">Male</option>
                  <option value="female" className="text-black">Female</option>
                  <option value="other" className="text-black">Other</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06] flex justify-end">
            <Button className="bg-white text-black hover:bg-white/90 font-medium px-8 py-6 h-auto">
              Post Requirement
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
