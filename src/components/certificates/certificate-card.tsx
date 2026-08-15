"use client";

import { Certificate } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Award, Building2, Calendar, Download, Eye, Trash2, Loader2 } from "lucide-react";
import { deleteCertificate } from "@/actions/certificates";
import { toast } from "sonner";
import { useState } from "react";

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    
    try {
      setIsDeleting(true);
      await deleteCertificate(certificate.id, certificate.file_url);
      toast.success("Certificate deleted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete certificate.");
      setIsDeleting(false); // Only reset if failed, if successful the component will unmount
    }
  };

  const handleDownload = () => {
    // Basic download trigger via anchor tag
    const a = document.createElement('a');
    a.href = certificate.file_url;
    a.download = certificate.title || 'certificate';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="flex flex-col bg-card/50 border-border/50 hover:border-border/80 transition-colors overflow-hidden group">
      {/* Top Banner indicating file type or generic graphic */}
      <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
        <Award className="w-10 h-10 text-primary/40" />
        {certificate.file_type?.includes("pdf") && (
          <span className="absolute bottom-2 right-2 text-[10px] uppercase font-bold bg-background/50 px-2 py-0.5 rounded backdrop-blur-md">
            PDF
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h4 className="font-semibold text-foreground line-clamp-2 mb-3" title={certificate.title}>
          {certificate.title}
        </h4>
        
        <div className="space-y-2 mt-auto">
          {certificate.issuer && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{certificate.issuer}</span>
            </div>
          )}
          {certificate.issue_date && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{format(new Date(certificate.issue_date), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 border-t border-border/50 divide-x divide-border/50 bg-accent/20">
        <a 
          href={certificate.file_url} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View
        </a>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Get
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center py-2.5 text-xs font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-1.5" />
              Drop
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
