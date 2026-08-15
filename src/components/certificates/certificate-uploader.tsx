"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCertificate } from "@/actions/certificates";
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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("issuer", issuer);

      await uploadCertificate(formData);
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
      <DialogTrigger>
        {children || (
          <Button className="gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload Certificate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Upload Certificate</DialogTitle>
          <DialogDescription>
            Upload a PDF or Image of your certification. Maximum file size is 5MB.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-4">
              <Label 
                htmlFor="file"
                className="flex-1 cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/60 rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <FileType2 className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-center font-medium">
                  {file ? file.name : "Click to select a file"}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
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
            <Label htmlFor="title">Certificate Name *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. AWS Solutions Architect"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input 
              id="issuer" 
              value={issuer} 
              onChange={(e) => setIssuer(e.target.value)} 
              placeholder="e.g. Amazon Web Services"
            />
          </div>

          <Button type="submit" className="w-full" disabled={!file || !title || isUploading}>
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
