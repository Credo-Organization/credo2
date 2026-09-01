"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { uploadCertificateMetadata, verifyCredlyBadge, verifyOpenBadge } from "@/actions/certificates";
import { toast } from "sonner";
import { Loader2, UploadCloud, FileType2, Award, CheckCircle2, ShieldCheck, Link2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CertificateUploader({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"credly" | "file">("credly");
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credlyUrl, setCredlyUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleCredlyVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credlyUrl.trim()) return;

    try {
      setIsUploading(true);
      const res = await verifyCredlyBadge(credlyUrl.trim());
      if (res.success && res.badge) {
        toast.success(`Verified: ${res.badge.title} (${res.badge.issuer})`);
        setIsOpen(false);
        setCredlyUrl("");
      } else {
        toast.error(res.error || "Failed to verify Credly badge.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Verification failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMode === "credly") {
      return handleCredlyVerify(e);
    }

    if (!file || !title) return;

    try {
      setIsUploading(true);
      
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Please log in to upload certificates");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload file to storage.");
      }

      const { data: publicUrlData } = supabase.storage
        .from("certificates")
        .getPublicUrl(fileName);

      const result = await uploadCertificateMetadata({
        title,
        issuer,
        fileUrl: publicUrlData.publicUrl,
        fileType: file.type,
        fileName
      });

      if (!result.success) {
        throw new Error(result.error || "Server processing failed.");
      }

      toast.success("Certificate uploaded and verified successfully!");
      setIsOpen(false);
      
      // Reset form
      setFile(null);
      setTitle("");
      setIssuer("");
    } catch (err: any) {
      toast.error(err.message || "Failed to process certificate");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={
        children ? (
          children as React.ReactElement
        ) : (
          <button className={buttonVariants({ variant: "default", className: "gap-2" })}>
            <UploadCloud className="w-4 h-4" />
            Add Certificate
          </button>
        )
      } />
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 text-stone-900 dark:text-zinc-100 p-6 sm:p-7 rounded-3xl shadow-[6px_6px_0px_0px_#18181B] dark:shadow-[6px_6px_0px_0px_#000000] transition-colors">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Cryptographic Ingestion
            </span>
          </div>

          <DialogTitle className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight pt-1">
            Add & Verify Certificate
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 dark:text-zinc-400">
            Verify directly via Credly / OpenBadges API or upload your certificate document for multimodal anti-cheat validation.
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selector Tabs */}
        <div className="flex gap-1.5 p-1 bg-stone-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl mt-3">
          <button
            type="button"
            onClick={() => setUploadMode("credly")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              uploadMode === "credly"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-700 shadow-xs font-bold"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Credly / OpenBadge URL
          </button>

          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              uploadMode === "file"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-700 shadow-xs font-bold"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            Upload PDF / Image
          </button>
        </div>

        {uploadMode === "credly" ? (
          <form onSubmit={handleCredlyVerify} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-950 dark:text-zinc-100 flex items-center justify-between">
                <span>Credly Badge URL or Badge ID *</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">1-Click Live Sync</span>
              </label>
              <input
                value={credlyUrl}
                onChange={(e) => setCredlyUrl(e.target.value)}
                placeholder="e.g. https://www.credly.com/badges/abc-123 or badge ID"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono transition-colors"
              />
              <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed pt-1">
                Supports AWS, Google Cloud, Meta, IBM, Microsoft, CompTIA and all standard OpenBadges v2/v3.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!credlyUrl.trim() || isUploading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Cryptographic Badge...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify & Add to Passport
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
                Certificate Document (PDF, PNG, JPG) *
              </label>
              <label 
                htmlFor="file"
                className="w-full cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl transition-colors group text-center"
              >
                <FileType2 className="w-8 h-8 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
                  {file ? file.name : "Click or drag to select certificate"}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider mt-0.5">
                  Max size: 5MB • Multimodal OCR Scanned
                </span>
              </label>
              <input 
                id="file" 
                type="file" 
                accept="application/pdf,image/png,image/jpeg" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Certificate Name *</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. AWS Solutions Architect"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Issuing Organization</label>
              <input 
                value={issuer} 
                onChange={(e) => setIssuer(e.target.value)} 
                placeholder="e.g. Amazon Web Services, Meta, Coursera"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={!file || !title || isUploading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading & Scanning Anti-Cheat...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Upload & Run Multimodal Audit
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
