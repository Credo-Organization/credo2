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
      <DialogContent className="sm:max-w-xl bg-white border border-stone-200 text-stone-900 p-6 rounded-3xl shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              Cryptographic Handshake
            </div>
            <span className="text-xs text-stone-500 font-mono">
              SIH-SQUAD-{squad.id}
            </span>
          </div>

          <DialogTitle className="text-xl font-bold text-stone-900 tracking-tight">
            Apply to Join {squad.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Send your verified Skill Passport and GitProof code metrics to squad lead <strong className="text-stone-900">{squad.leader}</strong>.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-700 animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-stone-900">Application Handshake Delivered!</h4>
            <p className="text-xs text-stone-500 max-w-sm">
              Your cryptographic passport and repository audit scores have been sent to {squad.leader}. They will reach out on Discord.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 pt-2">
            {/* Target Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Target Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {squad.open_roles?.map((role: string) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      selectedRole === role
                        ? "bg-stone-100 border-emerald-400 text-stone-900 shadow-sm"
                        : "bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Cryptographic Proof Snapshot */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-700" />
                  Attached Proof Vectors
                </span>
                <span className="text-[10px] text-emerald-700 font-mono">
                  did:cdy:ed25519:7421...
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-700">
                  ✓ GitProof 99.4% Human Authored
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-700">
                  ✓ 24 GitHub Repos Audited
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-700">
                  ✓ W3C DID Verified
                </span>
              </div>
            </div>

            {/* Pitch / Message to Team Lead */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Message to Squad Lead (Optional)
              </label>
              <textarea
                rows={3}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder={`Hi ${squad.leader.split(" ")[0]}, I saw your squad needs a ${selectedRole || "developer"}. I have verified experience in ${squad.required_skills?.slice(0, 3).join(", ")} and would love to build together.`}
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-9 px-4 text-xs text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
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
