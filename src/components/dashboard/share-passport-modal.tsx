"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SharePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  cardId?: string;
  studentName: string;
}

export function SharePassportModal({
  isOpen,
  onClose,
  studentId,
  cardId,
  studentName,
}: SharePassportModalProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  const targetId = studentId || "CDY26S4611";
  const verificationUrl = `${origin || "https://minskey.dev"}/verify/passport/${targetId}`;

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      toast.success("Verification URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
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
      // High-resolution 512x512 for flawless scanning by cameras and file analyzers
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Could not initialize 2D canvas context.");
        return;
      }

      // Solid white background to ensure optimal QR contrast
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const img = new Image();
      img.onload = () => {
        // Draw with 32px padding (quiet zone)
        const padding = 36;
        ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);

        // Add subtle footer brand text for professional presentation
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-md rounded-3xl border-2 border-zinc-900 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_#18181B] dark:shadow-[8px_8px_0px_0px_#000000] z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-zinc-900 dark:border-zinc-800 bg-[#FAF9F6] dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B]">
              <QrCode className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                Passport QR & Export
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Official Verifiable Skill Passport
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          {/* Candidate Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{studentName}</span>
            <span>•</span>
            <span>{targetId}</span>
          </div>

          {/* QR Code Frame */}
          <div className="p-4 bg-white rounded-2xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181B] flex flex-col items-center">
            <QRCodeSVG
              id="student-passport-qr-svg"
              value={verificationUrl}
              size={180}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <div className="mt-2 text-[11px] font-mono font-black text-zinc-950 uppercase tracking-wider">
              {cardId || targetId}
            </div>
          </div>

          {/* Helper Callout for Recruiter Testing */}
          <div className="w-full text-left p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
            <p className="flex items-center gap-1.5 font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Recruiter Scan Ready:
            </p>
            Download this QR PNG and upload it directly into the Recruiter{" "}
            <strong>Scan QR / ID</strong> dialog to test instant dossier retrieval.
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="w-full h-11 px-4 rounded-xl bg-[#A7F3D0] hover:bg-[#6EE7B7] text-emerald-950 text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download QR Code (PNG)</span>
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
                    <span>Copy Link</span>
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
    </div>
  );
}
