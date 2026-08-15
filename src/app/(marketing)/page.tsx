"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Shield,
  GitBranch,
  Upload,
  Sparkles,
  Search,
  Map,
  ArrowRight,
  Play,
  FileCheck,
  Target,
  Share2,
  Compass,
  Zap,
  Star,
  ChevronRight,
  ExternalLink,
  Award,
  TrendingUp,
  Brain,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] animate-pulse [animation-delay:1s]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            AI-Powered Skill Verification for Students
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in-up">
          Your Skills{" "}
          <br className="hidden sm:block" />
          Deserve{" "}
          <span className="gradient-text">Proof</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:150ms]">
          Transform GitHub activity and certifications into an evidence-backed
          skill passport. Know your strengths, find your gaps, chart your career.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
          <Link href="/login">
            <Button
              size="lg"
              className="h-13 px-8 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 gap-2"
            >
              Get My Skill Passport
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="h-13 px-8 text-base font-medium gap-2 border-border/60 hover:bg-accent/50"
          >
            <Play className="h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground animate-fade-in-up [animation-delay:450ms]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                "bg-blue-500",
                "bg-violet-500",
                "bg-amber-500",
                "bg-emerald-500",
              ].map((color, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white",
                    color
                  )}
                >
                  {["A", "S", "R", "M"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm">
              <span className="font-semibold text-foreground">500+</span> students verified
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-sm font-medium text-foreground">4.9</span>
          </div>
        </div>

        {/* Hero visual — floating passport preview */}
        <div className="mt-20 animate-fade-in-up [animation-delay:600ms]">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-xl" />
            <div className="relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              <MiniPassportPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Mini passport preview for hero */
function MiniPassportPreview() {
  return (
    <div className="p-6 sm:p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-sm">
            AK
          </div>
          <div>
            <p className="text-sm font-semibold">Aman Kumar</p>
            <p className="text-xs text-muted-foreground">Full Stack Developer</p>
          </div>
        </div>
        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { name: "React", level: 92, color: "from-blue-500 to-cyan-400" },
          { name: "TypeScript", level: 87, color: "from-blue-600 to-blue-400" },
          { name: "Node.js", level: 78, color: "from-emerald-500 to-green-400" },
          { name: "PostgreSQL", level: 65, color: "from-violet-500 to-purple-400" },
        ].map((skill) => (
          <div
            key={skill.name}
            className="rounded-lg border border-border/50 bg-background/50 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">{skill.name}</span>
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", skill.color)}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Evidence summary */}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" /> 14 repos analyzed
        </span>
        <span className="flex items-center gap-1">
          <Award className="h-3 w-3" /> 3 certificates
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> 12 skills verified
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 2 — PROBLEM
   ═══════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      title: "Scattered Achievements",
      description:
        "Your skills are spread across GitHub repos, certificates, courses, and side projects with no unified view.",
      color: "text-red-400",
    },
    {
      icon: Search,
      title: "Unverified Skills",
      description:
        "Listing 'React' on your resume means nothing without proof. Recruiters have no way to validate claims.",
      color: "text-amber-400",
    },
    {
      icon: Compass,
      title: "No Career Roadmap",
      description:
        "You know where you want to go, but you don't know what skills you're missing to get there.",
      color: "text-blue-400",
    },
    {
      icon: Brain,
      title: "Difficult Skill Discovery",
      description:
        "You have skills you don't even know about, hidden in your GitHub activity and project work.",
      color: "text-violet-400",
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-xs">
            The Problem
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Your resume is <span className="text-muted-foreground">broken</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Students spend years building skills but have no credible way to prove them.
            Here&apos;s what&apos;s holding you back.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <div
              key={problem.title}
              className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-border transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={cn("mb-4", problem.color)}>
                <problem.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 3 — HOW IT WORKS
   ═══════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: GitBranch,
      title: "Connect GitHub",
      description: "Link your GitHub account and we'll analyze your repositories, languages, and commit history.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      step: "02",
      icon: Upload,
      title: "Upload Certificates",
      description: "Add your course completions, certifications, and credentials. We extract skills automatically.",
      color: "from-violet-500 to-purple-400",
    },
    {
      step: "03",
      icon: Shield,
      title: "Generate Skill Passport",
      description: "AI analyzes all your evidence and creates a comprehensive, verified skill passport.",
      color: "from-emerald-500 to-green-400",
    },
    {
      step: "04",
      icon: Target,
      title: "Discover Skill Gaps",
      description: "Compare your current skills against your dream role and see exactly what's missing.",
      color: "from-amber-500 to-orange-400",
    },
    {
      step: "05",
      icon: Map,
      title: "Get Career Roadmap",
      description: "Receive a personalized learning path with curated resources to close your skill gaps.",
      color: "from-pink-500 to-rose-400",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-xs">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From code to <span className="gradient-text">career</span> in 5 steps
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Connect your work, get your skills verified, and receive a personalized roadmap — all in minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-primary/30 to-border hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={cn(
                  "relative lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center",
                  i > 0 && "lg:mt-24"
                )}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-2 border-border bg-background flex items-center justify-center z-10">
                    <span className="text-xs font-bold text-primary">{step.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "lg:pr-16",
                    i % 2 === 1 && "lg:col-start-2 lg:pl-16 lg:pr-0"
                  )}
                >
                  <div className="flex items-start gap-4 lg:gap-0">
                    {/* Mobile step indicator */}
                    <div className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {step.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={cn(
                            "hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                            step.color
                          )}
                        >
                          <step.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                {i % 2 === 0 && <div className="hidden lg:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 4 — FEATURES
   ═══════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Skill Passport",
      description:
        "A comprehensive, shareable document that showcases your verified skills with evidence from real projects.",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      icon: Zap,
      title: "Evidence Engine",
      description:
        "Our AI scans your GitHub repos, analyzes commit patterns, parses certificates, and cross-references everything.",
      gradient: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
    },
    {
      icon: BarChart3,
      title: "Skill Gap Analysis",
      description:
        "See how your current skills stack up against your target role. Know exactly what to learn next.",
      gradient: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
    },
    {
      icon: Map,
      title: "Career Roadmap",
      description:
        "Get a personalized, milestone-based learning path with curated courses, tutorials, and project ideas.",
      gradient: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-400",
    },
    {
      icon: Share2,
      title: "Shareable Profile",
      description:
        "Generate a public link and QR code for your passport. Share it on your resume, LinkedIn, or portfolio.",
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-xs">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">prove your skills</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Credify combines AI analysis, evidence aggregation, and career intelligence
            into one platform.
          </p>
        </div>

        {/* Feature bento grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-border/80 transition-all duration-300 hover:-translate-y-1 overflow-hidden",
                i === 0 && "md:col-span-2 lg:col-span-1"
              )}
            >
              {/* Gradient background */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                  feature.gradient
                )}
              />
              <div className="relative">
                <div
                  className={cn(
                    "mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-card border border-border/50",
                    feature.iconColor
                  )}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 5 — DEMO PREVIEW
   ═══════════════════════════════════════════ */
function DemoPreviewSection() {
  return (
    <section id="preview" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-primary/3 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-xs">
            Preview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            See your passport in action
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Here&apos;s what a Credify Skill Passport looks like — backed by real evidence from
            your GitHub repos and certificates.
          </p>
        </div>

        {/* Full passport mock */}
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
          <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm shadow-2xl overflow-hidden">
            <FullPassportPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Full passport preview component */
function FullPassportPreview() {
  const skills = [
    { name: "React", level: 92, evidence: 8, status: "verified", color: "bg-blue-500" },
    { name: "TypeScript", level: 87, evidence: 6, status: "verified", color: "bg-blue-600" },
    { name: "Node.js", level: 78, evidence: 5, status: "verified", color: "bg-emerald-500" },
    { name: "PostgreSQL", level: 65, evidence: 3, status: "verified", color: "bg-violet-500" },
    { name: "Docker", level: 42, evidence: 2, status: "learning", color: "bg-cyan-500" },
    { name: "AWS", level: 28, evidence: 1, status: "gap", color: "bg-amber-500" },
  ];

  return (
    <div className="divide-y divide-border/50">
      {/* Header */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            AK
          </div>
          <div>
            <h3 className="text-xl font-bold">Aman Kumar</h3>
            <p className="text-sm text-muted-foreground">
              Aspiring Full Stack Developer · 3rd Year CSE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            12 Verified Skills
          </Badge>
          <Badge variant="outline" className="gap-1">
            <ExternalLink className="h-3 w-3" />
            Share
          </Badge>
        </div>
      </div>

      {/* Skills */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Skill Assessment
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-400" /> Verified
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-400" /> Learning
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-400/60" /> Gap
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {skill.evidence} evidence{skill.evidence !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {skill.level}%
                  </span>
                  {skill.status === "verified" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  {skill.status === "learning" && (
                    <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                  )}
                  {skill.status === "gap" && (
                    <AlertCircle className="h-3.5 w-3.5 text-red-400/60" />
                  )}
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    skill.color
                  )}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence footer */}
      <div className="p-6 sm:p-8 bg-muted/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "GitHub Repos", value: "14", icon: GitBranch },
            { label: "Certificates", value: "3", icon: Award },
            { label: "Skills Found", value: "18", icon: Sparkles },
            { label: "Evidence Items", value: "47", icon: FileCheck },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 6 — TESTIMONIALS
   ═══════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "3rd Year CS, IIT Delhi",
      text: "Credify showed me I had 12 verified skills I didn't even list on my resume. The passport got me shortlisted at 3 startups within a week.",
      avatar: "PS",
      color: "bg-pink-500",
    },
    {
      name: "Arjun Mehta",
      role: "Final Year, NIT Trichy",
      text: "The gap analysis was eye-opening. I thought I knew full-stack, but I was missing key DevOps skills. The roadmap got me up to speed in 2 months.",
      avatar: "AM",
      color: "bg-blue-500",
    },
    {
      name: "Sara Khan",
      role: "Fresher, Bangalore",
      text: "Instead of sending a generic resume, I share my Credify passport. Recruiters can see real proof of my React and Node.js work. Night and day difference.",
      avatar: "SK",
      color: "bg-violet-500",
    },
  ];

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-xs">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Loved by <span className="gradient-text">students</span> everywhere
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            See how students are using Credify to land internships and build credible profiles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-border/80 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    t.color
                  )}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 7 — FINAL CTA
   ═══════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/25 mx-auto mb-8">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Build Your Credify
          <br />
          <span className="gradient-text">Passport Today</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Join hundreds of students who are proving their skills with evidence,
          not just words. It&apos;s free to get started.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button
              size="lg"
              className="h-13 px-10 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 gap-2"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground/60">
          No credit card required · Connect GitHub in 30 seconds
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PAGE COMPONENT — Assembles all sections
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoPreviewSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
