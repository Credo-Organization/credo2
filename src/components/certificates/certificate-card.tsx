"use client";

import { Certificate } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Award, Building2, Calendar, Download, Eye, Trash2, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
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
    <Card className="flex flex-col bg-card border border-border hover:border-zinc-300 hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Top Banner indicating file type or generic graphic */}
      <div className="h-24 bg-zinc-900 flex items-center justify-center relative transition-colors group-hover:bg-zinc-800">
        <Award className="w-8 h-8 text-white/30 group-hover:text-white/50 transition-colors" />
        
        <div className="absolute top-2 left-2">
          {certificate.integrity_status === "verified" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold border-emerald-500/50 text-emerald-400 bg-emerald-500/10 cursor-help px-2 py-0.5">
                    <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified
                  </Badge>
                } />
                <TooltipContent>
                  <p>Integrity Score: {certificate.integrity_score}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {certificate.integrity_status === "flagged" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold border-rose-500/50 text-rose-400 bg-rose-500/10 cursor-help px-2 py-0.5">
                    <ShieldAlert className="w-3 h-3 mr-1 inline" /> Flagged
                  </Badge>
                } />
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Integrity Score: {certificate.integrity_score}%</p>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    {certificate.integrity_flags?.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {certificate.file_type?.includes("pdf") && (
          <span className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wider font-bold bg-white/10 text-white/80 px-2 py-0.5 rounded">
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
      <div className="grid grid-cols-3 border-t border-zinc-200 divide-x divide-zinc-200 bg-zinc-50">
        <a 
          href={certificate.file_url} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          View
        </a>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Get
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Drop
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
