"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SharePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  cardId?: string;
  studentName: string;
  careerGoal?: string;
  verifiedSkillsCount?: number;
}

export function SharePassportModal({
  isOpen,
  onClose,
  studentId,
  cardId,
  studentName,
  careerGoal = "Software Engineer",
  verifiedSkillsCount = 0,
}: SharePassportModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [origin, setOrigin] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const targetId = studentId || "CDY26S4611";
  const verificationUrl = `${origin || "https://minskey.dev"}/verify/passport/${targetId}`;

  // Viral text for social shares
  const shareTitle = `Just got my GitHub engineering DNA audited on Minskey! Verified as a ${careerGoal} with ${verifiedSkillsCount > 0 ? `${verifiedSkillsCount} verified skills` : "100% human logic"}. Zero AI boilerplate. Check out my official Skill Passport:`;
  const shareUrlLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`;
  const shareUrlTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(verificationUrl)}`;
  const shareUrlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${verificationUrl}`)}`;

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      toast.success("Verification URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopySnippet = () => {
    if (typeof window !== "undefined") {
      const snippet = `🛡️ MINSKEY VERIFIED SKILL PASSPORT\nName: ${studentName}\nRole: ${careerGoal}\nPassport ID: ${targetId}\nVerification: 100% Human Code Logic (0% AI Boilerplate)\n🔗 View Live Dossier: ${verificationUrl}`;
      navigator.clipboard.writeText(snippet);
      setCopiedSnippet(true);
      toast.success("Dev DNA Flex copied to clipboard! Paste it on Discord or Telegram.");
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("student-passport-qr-svg");
    if (!svg) {
      toast.error("Could not find QR Code element.");
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Could not initialize 2D canvas context.");
        return;
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const img = new Image();
      img.onload = () => {
        const padding = 36;
        ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);

        ctx.fillStyle = "#18181B";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`MINSKEY VERIFIED • ID: ${targetId}`, size / 2, size - 12);

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `minskey-passport-${targetId}.png`;
        downloadLink.href = pngUrl;
        downloadLink.click();

        toast.success(`Downloaded QR Code (minskey-passport-${targetId}.png)!`);
      };

      img.onerror = () => {
        toast.error("Failed to render QR Code into PNG.");
      };

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err: any) {
      console.error("QR Download Error:", err);
      toast.error("Failed to generate QR PNG file.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-zinc-900 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_#18181B] dark:shadow-[8px_8px_0px_0px_#000000] z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-zinc-900 dark:border-zinc-800 bg-[#FAF9F6] dark:bg-zinc-950 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B]">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                Share Dev DNA & Skill Passport
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Official Verifiable Credential • 100% Anti-Cheat Audited
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Modal"
            className="w-8 h-8 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center text-center gap-5">
          {/* Candidate Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{studentName}</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-300 font-black">{careerGoal}</span>
            <span>•</span>
            <span>{targetId}</span>
          </div>

          {/* Viral Social Launch Grid */}
          <div className="w-full space-y-2 text-left">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Viral Flex (Share Your Dev DNA):
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* LinkedIn Button */}
              <a
                href={shareUrlLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer font-bold text-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* X / Twitter Button */}
              <a
                href={shareUrlTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer font-bold text-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Post on X</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={shareUrlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer font-bold text-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* QR Code Frame */}
          <div className="p-4 bg-white rounded-2xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181B] flex flex-col items-center">
            <QRCodeSVG
              id="student-passport-qr-svg"
              value={verificationUrl}
              size={170}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <div className="mt-2 text-[11px] font-mono font-black text-zinc-950 uppercase tracking-wider">
              {cardId || targetId}
            </div>
          </div>

          {/* Quick Copy Snippet */}
          <div className="w-full flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopySnippet}
              className="w-full h-10 px-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-950 dark:text-amber-200 text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedSnippet ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                  <span>Dev DNA Snippet Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Copy Dev DNA Brag Snippet (Discord/Slack)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="w-full h-10 px-4 rounded-xl bg-[#A7F3D0] hover:bg-[#6EE7B7] text-emerald-950 text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download Official QR PNG</span>
            </button>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={handleCopy}
                className="h-10 px-3 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
                <span>Verify Page</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
