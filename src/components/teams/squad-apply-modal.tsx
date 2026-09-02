"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Send, CheckCircle2, Terminal } from "lucide-react";
import { toast } from "sonner";

interface SquadApplyModalProps {
  squad: any;
  isOpen: boolean;
  onClose: () => void;
  userSkills?: string[];
}

export function SquadApplyModal({ squad, isOpen, onClose, userSkills = [] }: SquadApplyModalProps) {
  const [pitch, setPitch] = useState("");
  const [selectedRole, setSelectedRole] = useState(squad?.open_roles?.[0] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!squad) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending cryptographic passport handshake to team leader
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success(`Application sent to ${squad.name} with your verified W3C DID proof!`);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 text-stone-900 dark:text-zinc-100 p-6 rounded-3xl shadow-[6px_6px_0px_0px_#18181B] dark:shadow-[6px_6px_0px_0px_#000000] transition-colors">
        <DialogHeader className="space-y-2 text-left">


          <DialogTitle className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
            Apply to Join {squad.name}
          </DialogTitle>

        </DialogHeader>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 animate-bounce shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-zinc-950 dark:text-zinc-100">Application Handshake Delivered!</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm font-medium">
              Your cryptographic passport and repository audit scores have been sent to {squad.leader}. They will reach out on Discord.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 pt-2">
            {/* Target Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
                Target Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {squad.open_roles?.map((role: string) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left border-2 transition-all cursor-pointer ${
                      selectedRole === role
                        ? "bg-zinc-950 dark:bg-white border-zinc-900 dark:border-zinc-700 text-white dark:text-zinc-950 shadow-xs"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Cryptographic Proof Snapshot */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 space-y-2 shadow-xs transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Attached Proof Vectors
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                  did:cdy:ed25519:7421...
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold text-emerald-950 dark:text-emerald-300">
                  ✓ GitProof 99.4% Human Authored
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-[10px] font-mono font-bold text-blue-950 dark:text-blue-300">
                  ✓ 24 GitHub Repos Audited
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 text-[10px] font-mono font-bold text-purple-950 dark:text-purple-300">
                  ✓ W3C DID Verified
                </span>
              </div>
            </div>

            {/* Pitch / Message to Team Lead */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
                Message to Squad Lead (Optional)
              </label>
              <textarea
                rows={3}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder={`Hi ${squad.leader.split(" ")[0]}, I saw your squad needs a ${selectedRole || "developer"}. I have verified experience in ${squad.required_skills?.slice(0, 3).join(", ")} and would love to build together.`}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-none font-medium"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-10 px-4 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  "Sending Handshake..."
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Verified Application
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
