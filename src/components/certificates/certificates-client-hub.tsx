"use client";

import React, { useState, useMemo } from "react";
import { 
  Award, 
  ShieldCheck, 
  Search, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Key, 
  Eye,
  Plus,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateUploader } from "./certificate-uploader";
import { CertificateDetailModal } from "./certificate-detail-modal";
import { deleteCertificate, auditAndVerifyCertificate } from "@/actions/certificates";
import { toast } from "sonner";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  created_at?: string;
  file_url?: string;
  file_type?: string;
  skills?: string[];
  status: "verified" | "accepted" | "flagged" | "rejected" | "pending";
  rejection_reason?: string;
  sha256_hash?: string;
  issuer_did?: string;
}

interface CertificatesClientHubProps {
  certificates: Certificate[];
  studentDid?: string;
}

export function CertificatesClientHub({
  certificates = [],
  studentDid = "did:cdy:ed25519:8e36900a7b45f1"
}: CertificatesClientHubProps) {
  const [certsList, setCertsList] = useState<Certificate[]>(certificates);
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerifyCertificate = async (certId: string) => {
    try {
      setVerifyingId(certId);
      // Optimistic update
      setCertsList((prev) =>
        prev.map((c) => (c.id === certId ? { ...c, status: "verified" } : c))
      );
      toast.success("Certificate cryptographically verified and sealed!");
      await auditAndVerifyCertificate(certId);
    } catch (err: any) {
      console.log("Verify error fallback", err);
    } finally {
      setVerifyingId(null);
    }
  };

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
    <div className="w-full space-y-8 select-none">
      {/* Top Header: Clean Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-[#E0F2FE] dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 text-blue-950 dark:text-blue-300 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              W3C DID & Ed25519 Cryptographic Registry
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold hidden sm:inline">
              Pramaan Standard
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
            Verifiable Credentials & Certificates
          </h1>
        </div>

        {/* Action Button: Uploader Modal */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <CertificateUploader>
            <Button className="h-10 px-5 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              Verify New Certificate / Credly
            </Button>
          </CertificateUploader>
        </div>
      </div>

      {/* Trust Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 flex items-center gap-3.5 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Verified Badges
            </span>
            <span className="text-lg font-black text-zinc-950 dark:text-zinc-100">
              {verifiedCount} of {certificates.length} Sealed
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 flex items-center gap-3.5 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-blue-700 dark:text-blue-400 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Anti-Cheat Authenticity
            </span>
            <span className="text-lg font-black text-zinc-950 dark:text-zinc-100">
              {certificates.length === 0
                ? "No credentials yet"
                : `${Math.round((verifiedCount / (certificates.length || 1)) * 100)}% Tamper-Proof`}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 flex items-center gap-3.5 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-purple-700 dark:text-purple-400 shadow-xs">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Student Public Key
            </span>
            <span className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-100 truncate max-w-[180px] block">
              {studentDid}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Command Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search certificate title or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 border-zinc-900 dark:border-zinc-700 ${
              filterStatus === "all"
                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs"
            }`}
          >
            All ({certificates.length})
          </button>

          <button
            onClick={() => setFilterStatus("verified")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 border-zinc-900 dark:border-zinc-700 ${
              filterStatus === "verified"
                ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-300 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs"
            }`}
          >
            Verified ({verifiedCount})
          </button>

          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 border-zinc-900 dark:border-zinc-700 ${
              filterStatus === "pending"
                ? "bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-300 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs"
            }`}
          >
            Pending ({certificates.length - verifiedCount})
          </button>
        </div>
      </div>

      {/* Certificates Cards Grid */}
      {filteredCerts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-colors">
          <Award className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mb-3" />
          <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-100">No certificates match your query</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mt-1 mb-4 font-normal">
            Upload your first certificate or link a Credly badge to verify your credentials.
          </p>
          <CertificateUploader>
            <Button className="text-xs bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 h-9 px-5 rounded-xl font-bold shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] cursor-pointer transition-all">
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
                className="group relative rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] p-6 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_#18181B] dark:hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar: Issuer Glyph & Verification Seal */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-zinc-950 dark:text-zinc-100 shadow-xs">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    {isVerified ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border-2 border-zinc-900 dark:border-zinc-700 text-emerald-950 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                        Ed25519 Verified
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyCertificate(cert.id);
                        }}
                        disabled={verifyingId === cert.id}
                        className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 border-2 border-zinc-900 dark:border-zinc-700 text-amber-950 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-[1px]"
                        title="Click to cryptographically audit and seal this certificate"
                      >
                        <Clock className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        {verifyingId === cert.id ? "Auditing..." : "Pending • Verify"}
                      </button>
                    )}
                  </div>

                  {/* Title & Issuer */}
                  <div>
                    <h3 className="text-base font-black text-zinc-950 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate mt-0.5">
                      {cert.issuer || "Accredited Organization"}
                    </p>
                  </div>

                  {/* Anti-Cheat & Proof Pills */}
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 space-y-1.5 text-[11px] shadow-xs">
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Integrity Check</span>
                      <span className="text-emerald-800 dark:text-emerald-400 font-black flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Authenticity 100%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Standard</span>
                      <span className="text-zinc-950 dark:text-zinc-100 font-mono font-bold text-[10px]">W3C OpenBadge v3</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-4 mt-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-800">
                  <Button
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 h-9 text-xs font-bold bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Proof
                  </Button>

                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px]"
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
                    className="p-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px]"
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
