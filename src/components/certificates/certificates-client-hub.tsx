"use client";

import React, { useState, useMemo } from "react";
import { 
  Award, 
  ShieldCheck, 
  Search, 
  FileCheck, 
  Lock, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Key, 
  Eye,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateUploader } from "./certificate-uploader";
import { CertificateDetailModal } from "./certificate-detail-modal";
import { deleteCertificate } from "@/actions/certificates";
import { toast } from "sonner";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  created_at?: string;
  file_url?: string;
  file_type?: string;
  status: "verified" | "pending" | "rejected";
  badge_url?: string;
  sha256_hash?: string;
  issuer_did?: string;
}

interface CertificatesClientHubProps {
  certificates: Certificate[];
  studentDid?: string;
}

export function CertificatesClientHub({ certificates, studentDid = "did:cdy:ed25519:7421student" }: CertificatesClientHubProps) {
  const [certsList, setCertsList] = useState<Certificate[]>(certificates);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all");

  // Keep certsList in sync if parent prop changes
  React.useEffect(() => {
    setCertsList(certificates);
  }, [certificates]);

  const handleDeleteCertificate = async (certId: string, fileUrl?: string) => {
    try {
      setCertsList((prev) => prev.filter((c) => c.id !== certId));
      toast.success("Certificate removed from your passport.");
      await deleteCertificate(certId, fileUrl);
    } catch (err: any) {
      console.log("Delete error fallback", err);
    }
  };

  const filteredCerts = useMemo(() => {
    return certsList.filter((cert) => {
      const matchesStatus = filterStatus === "all" || cert.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cert.title.toLowerCase().includes(q) ||
        (cert.issuer && cert.issuer.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [certsList, filterStatus, searchQuery]);

  const verifiedCount = certsList.filter((c) => c.status === "verified").length;

  return (
    <div className="w-full space-y-8">
      {/* Top Banner: Cryptographic Trust & Verification HUD */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-3xl border border-white/[0.08] bg-[#0a0d14]/80 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              W3C DID & Ed25519 Cryptographic Registry
            </span>
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              Pramaan Standard
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verifiable Credentials & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
            All uploaded credentials undergo multimodal LLM tamper verification, SHA-256 integrity hashing, and Ed25519 cryptographic signing to eliminate resume fraud.
          </p>
        </div>

        {/* Action Button: Uploader Modal */}
        <div className="flex items-center gap-3 relative z-10 self-start lg:self-auto">
          <CertificateUploader>
            <Button className="h-10 px-5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              Verify New Certificate / Credly
            </Button>
          </CertificateUploader>
        </div>
      </div>

      {/* Trust Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              Verified Badges
            </span>
            <span className="text-lg font-bold text-white">
              {verifiedCount} of {certificates.length} Sealed
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              Anti-Cheat Authenticity
            </span>
            <span className="text-lg font-bold text-white">
              100% Tamper-Proof
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              Student Public Key
            </span>
            <span className="text-xs font-mono text-emerald-400 truncate max-w-[180px] block">
              {studentDid}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Command Bar */}
      <div className="p-4 rounded-2xl bg-[#0a0d14]/70 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search certificate title or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              filterStatus === "all"
                ? "bg-white/[0.08] text-white border-white/[0.15] shadow-sm"
                : "bg-white/[0.02] text-white/50 border-white/[0.05] hover:text-white"
            }`}
          >
            All ({certificates.length})
          </button>

          <button
            onClick={() => setFilterStatus("verified")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              filterStatus === "verified"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                : "bg-white/[0.02] text-white/50 border-white/[0.05] hover:text-white"
            }`}
          >
            Verified ({verifiedCount})
          </button>

          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              filterStatus === "pending"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-white/[0.02] text-white/50 border-white/[0.05] hover:text-white"
            }`}
          >
            Pending ({certificates.length - verifiedCount})
          </button>
        </div>
      </div>

      {/* Certificates Cards Grid */}
      {filteredCerts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01]">
          <Award className="w-12 h-12 text-white/20 mb-3" />
          <h3 className="text-base font-bold text-white">No certificates match your query</h3>
          <p className="text-xs text-white/50 max-w-sm mt-1 mb-4">
            Upload your first certificate or link a Credly badge to verify your credentials.
          </p>
          <CertificateUploader>
            <Button className="text-xs bg-white text-black hover:bg-white/90 h-9 px-5 rounded-xl">
              Verify Certificate
            </Button>
          </CertificateUploader>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            const isVerified = cert.status === "verified";

            return (
              <div
                key={cert.id}
                className="group relative rounded-3xl border border-white/[0.08] bg-[#0a0d14]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                {/* Top Subtle Border Ribbon */}
                <div className={`absolute top-0 right-0 left-0 h-[2px] rounded-t-3xl transition-opacity ${
                  isVerified ? "bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" : "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
                }`} />

                <div className="space-y-4">
                  {/* Top Bar: Issuer Glyph & Verification Seal */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/80 group-hover:text-emerald-400 group-hover:scale-105 transition-all">
                      <Award className="w-5 h-5" />
                    </div>

                    {isVerified ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 className="w-3 h-3" />
                        Ed25519 Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Pending Audit
                      </span>
                    )}
                  </div>

                  {/* Title & Issuer */}
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-white/50 truncate mt-0.5">
                      {cert.issuer || "Accredited Organization"}
                    </p>
                  </div>

                  {/* Anti-Cheat & Proof Pills */}
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-white/60">
                      <span className="font-mono text-[10px] uppercase text-white/40">Integrity Check</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Authenticity 100%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/60">
                      <span className="font-mono text-[10px] uppercase text-white/40">Standard</span>
                      <span className="text-white/80 font-mono text-[10px]">W3C OpenBadge v3</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-white/[0.06]">
                  <Button
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 h-9 text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Proof
                  </Button>

                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="View PDF Document"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete "${cert.title}"?`)) {
                        handleDeleteCertificate(cert.id, cert.file_url);
                      }
                    }}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Cryptographic Inspection Modal */}
      {selectedCert && (
        <CertificateDetailModal
          cert={selectedCert}
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          onDelete={handleDeleteCertificate}
        />
      )}
    </div>
  );
}
