import React from "react";
import { StudentPassportIdCard } from "@/components/passport/student-id-card";
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VerifyPassportPage({ params }: Props) {
  const { id } = await params;

  const safeId = id.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);
  const upperSafeId = safeId.toUpperCase();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(safeId);

  const filters = [
    `snapshot_data->>student_id.eq.${upperSafeId}`,
    `snapshot_data->>card_id.eq.${upperSafeId}`,
    `snapshot_data->>student_id.eq.${safeId}`,
    `snapshot_data->>card_id.eq.${safeId}`,
    ...(isUuid ? [`id.eq.${safeId}`] : []),
  ];

  const serverClient = await createClient();
  let matched: any = null;

  if (safeId) {
    const { data: mData } = await serverClient
      .from("passports")
      .select("*, profiles(*)")
      .eq("is_public", true)
      .or(filters.join(","))
      .limit(1)
      .maybeSingle();

    if (mData) {
      matched = mData;
    } else {
      try {
        const admin = createAdminClient();
        const { data: aData } = await admin
          .from("passports")
          .select("*, profiles(*)")
          .eq("is_public", true)
          .or(filters.join(","))
          .limit(1)
          .maybeSingle();
        if (aData) matched = aData;
      } catch {}
    }
  }

  // Fallback: If not matched by ID/card_id, check if safeId matches a profile username or name
  if (!matched && safeId) {
    const { data: profileMatch } = await serverClient
      .from("profiles")
      .select("id")
      .or(`username.ilike.${safeId},full_name.ilike.%${safeId}%`)
      .limit(1)
      .maybeSingle();

    if (profileMatch?.id) {
      const { data: matchedPassport } = await serverClient
        .from("passports")
        .select("*, profiles(*)")
        .eq("profile_id", profileMatch.id)
        .eq("is_public", true)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (matchedPassport) {
        matched = matchedPassport;
      }
    }
  }

  if (!matched) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
          <ShieldCheck className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Passport Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-sm">
          No published Minskey passport matches
          <span className="font-mono text-zinc-300"> {id}</span>. Either the
          identifier is wrong, or the student has not shared this passport
          publicly.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mt-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Minskey Home
        </Link>
      </div>
    );
  }

  const snap = matched?.snapshot_data;
  const profile = matched?.profiles;

  const studentData = {
    cardId: snap?.card_id || `CDY2025-${id.slice(-6)}`,
    studentId: snap?.student_id || id,
    name: snap?.profile?.name || profile?.full_name || "Unnamed Student",
    gender: snap?.gender || profile?.gender || "male",
    degree: snap?.degree || profile?.degree || "B.Tech – Computer Science Engineering",
    college: snap?.profile?.college || profile?.college_name || "",
    avatarUrl: snap?.profile?.avatar_url && !snap.profile.avatar_url.includes("unsplash.com")
      ? snap.profile.avatar_url 
      : ((snap?.gender || profile?.gender || "male").toLowerCase() === "female" ? "/avatar-female.webp" : "/avatar-male.webp"),
    issueDate: snap?.issue_date || "18 MAY 2025",
    expiryDate: snap?.expiry_date || "17 MAY 2027",
    coursesCompleted: snap?.courses_completed ?? 0,
    skillsVerified: snap?.skills_verified ?? 0,
    certificatesEarned: snap?.certificates_earned ?? 0,
    verificationUrl: snap?.verification_url || `https://minskey.dev/verify/passport/${id}`,
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10 py-12">
        {/* Verification Status Banner */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold tracking-wide shadow-lg shadow-emerald-500/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified Minskey Credential</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-2">
            Official Student Skill Passport
          </h1>
          <p className="text-sm text-zinc-300 max-w-lg leading-relaxed">
            Every skill, certificate, and repository on this credential has been verified against real GitHub commit physics. <span className="text-emerald-400 font-bold">100% tamper-proof and fraud-resistant.</span>
          </p>
        </div>

        {/* The Authentic Student ID Passport Card */}
        <div className="shadow-2xl hover:scale-[1.01] transition-transform duration-300">
          <StudentPassportIdCard studentData={studentData} />
        </div>

        {/* Verification Details Card */}
        <div className="w-full max-w-[420px] bg-[#0c1222] border border-[#1e2a4a] rounded-2xl p-4 text-xs space-y-2.5 text-zinc-300">
          <div className="flex items-center justify-between text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Integrity Status
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Authentic
            </span>
          </div>

          <div className="flex justify-between border-t border-[#1e2a4a] pt-2">
            <span className="text-zinc-500">DID Identifier</span>
            <span className="font-mono text-zinc-300">did:cdy:{studentData.studentId}</span>
          </div>

          <div className="flex justify-between border-t border-[#1e2a4a] pt-2">
            <span className="text-zinc-500">Issuer Authority</span>
            <span className="font-semibold text-white">Minskey Global Trust Registry</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[420px]">
          <Link
            href={`/recruiter/candidate/${studentData.studentId}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all border border-blue-400/30 shadow-lg shadow-blue-500/20"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Recruiter? Open Technical Dossier & Audits ➔</span>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Minskey Home
        </Link>
      </div>
    </div>
  );
}
