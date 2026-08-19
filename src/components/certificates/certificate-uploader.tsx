"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCertificateMetadata } from "@/actions/certificates";
import { toast } from "sonner";
import { Loader2, UploadCloud, FileType2 } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setFile(selected);
      // Auto-fill title with filename (without extension) if empty
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setIsUploading(true);
      
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Please log in to upload certificates");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload directly to Supabase Storage from the browser!
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

      // Now call server action just for the DB inserts & AI extraction
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

      toast.success("Certificate uploaded successfully!");
      setIsOpen(false);
      
      // Reset form
      setFile(null);
      setTitle("");
      setIssuer("");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload certificate");
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
            Upload Certificate
          </button>
        )
      } />
      <DialogContent className="dashboard-theme sm:max-w-[425px] bg-card border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Upload Certificate</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Upload a PDF or Image of your certification. Maximum file size is 5MB.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-4">
              <Label 
                htmlFor="file"
                className="flex-1 cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 rounded-xl hover:border-zinc-500 hover:bg-zinc-50 transition-colors group"
              >
                <FileType2 className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 mb-2 transition-colors" />
                <span className="text-sm text-center font-bold text-zinc-900">
                  {file ? file.name : "Click to select a file"}
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">
                  PDF, PNG, JPG (max. 5MB)
                </span>
              </Label>
              <Input 
                id="file" 
                type="file" 
                accept="application/pdf,image/png,image/jpeg" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-900 font-semibold text-xs uppercase tracking-wider">Certificate Name *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. AWS Solutions Architect"
              required
              className="border-zinc-200 focus-visible:ring-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer" className="text-zinc-900 font-semibold text-xs uppercase tracking-wider">Issuing Organization</Label>
            <Input 
              id="issuer" 
              value={issuer} 
              onChange={(e) => setIssuer(e.target.value)} 
              placeholder="e.g. Amazon Web Services"
              className="border-zinc-200 focus-visible:ring-zinc-900"
            />
          </div>

          <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm" disabled={!file || !title || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload and Save"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
