"use client";

import React from "react";
import Link from "next/link";
import DotField from "@/components/DotField";
import { ThemeToggle, useTheme } from "@/lib/theme";
import {
  FileText,
  Sparkles,
  ArrowRight,
  Code2,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  ChevronRight,
  Printer,
} from "lucide-react";

export default function LandingPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090d16] text-black dark:text-slate-100 selection:bg-[#dceeb1] selection:text-black transition-colors duration-200">
      {/* 56px Top Nav */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-[#e6e6e6] dark:border-[#1e293b] transition-colors">
        <div className="h-14 max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black shadow-sm group-hover:scale-105 transition">
              <span className="font-serif font-black text-sm tracking-widest">
                T<sub className="text-[9px] font-sans text-[#dceeb1] dark:text-[#22c55e]">E</sub>X
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-[-0.3px] text-black dark:text-white">
                  ResuTex
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f7f7f5] dark:bg-[#131b2e] text-black dark:text-white border border-[#e6e6e6] dark:border-[#1e293b]">
                  LaTeX ATS Studio
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#premise" className="hover:text-black dark:hover:text-white transition">
              Premise
            </a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-black dark:hover:text-white transition">
              Architecture
            </a>
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-black dark:hover:text-white transition"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </nav>

          {/* Top Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* React Bits SquishSwitch Dark / Light Mode Toggle */}
            <ThemeToggle compact={true} />

            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium figma-btn-secondary"
            >
              <span>GitHub</span>
            </a>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold figma-btn-primary"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 36px Marquee Strip in Pure Inverse Canvas (Black) */}
        <div className="h-9 bg-black dark:bg-[#070a12] text-white flex items-center px-4 sm:px-6 overflow-hidden select-none border-t border-transparent dark:border-[#1e293b]">
          <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
              <span className="figma-caption text-[11px] text-[#dceeb1] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dceeb1] animate-ping" />
                STANDARDS ALIGNED
              </span>
              <span className="text-neutral-600 dark:text-neutral-500">/</span>
              <div className="flex items-center gap-4 text-xs font-medium text-neutral-200">
                <span>100% ATS PARSE RATE</span>
                <span className="hidden sm:inline text-neutral-600 dark:text-neutral-500">•</span>
                <span className="hidden sm:inline">REPORTLAB PYTHON COMPILER</span>
                <span className="hidden md:inline text-neutral-600 dark:text-neutral-500">•</span>
                <span className="hidden md:inline">GEMINI 3.8 FLASH INTELLIGENCE</span>
                <span className="hidden lg:inline text-neutral-600 dark:text-neutral-500">•</span>
                <span className="hidden lg:inline">FIGMA DESIGN SYSTEM</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="figma-caption text-[10px] text-neutral-400 hidden sm:inline">
                OPEN SOURCE
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900 text-[#dceeb1] border border-neutral-800">
                v2.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive React Bits <DotField /> Background */}
      <section className="relative w-full overflow-hidden border-b border-[#e6e6e6] dark:border-[#1e293b] bg-white dark:bg-[#090d16] min-h-[640px] lg:min-h-[720px] flex items-center justify-center transition-colors">
        {/* Interactive DotField Canvas Canvas */}
        <div className="absolute inset-0 z-0">
          <DotField
            key={isDark ? "dark-dots" : "light-dots"}
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={65}
            glowRadius={170}
            sparkle={true}
            waveAmplitude={0}
            gradientFrom={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.32)"}
            gradientTo={isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}
            glowColor={isDark ? "rgba(197, 176, 244, 0.45)" : "rgba(220, 238, 177, 0.55)"}
            className="w-full h-full"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 dark:bg-[#111827]/95 border border-[#e6e6e6] dark:border-[#1e293b] shadow-sm mb-6 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#1ea64a]" />
            <span className="figma-caption text-[11px] font-bold text-black dark:text-white">
              AUTONOMOUS ATS RESUME STUDIO & COMPILER
            </span>
          </div>

          {/* Display-XL Headline - Call */}
          <h1 className="figma-display-xl font-bold tracking-tight text-black dark:text-white max-w-4xl mx-auto mb-6">
            Make job hunting customizable.
          </h1>

          {/* Subhead Body - Response */}
          <p className="figma-subhead text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            Tailor authentic LaTeX resumes for every job description in seconds. ResuTex pairs an interactive split-screen studio with Gemini 3.8 Flash AI and sub-second Python ReportLab compilation—producing 100% ATS-parsable, single-column PDFs and clean downloadable .tex source code.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-12">
            <Link
              href="/studio"
              className="px-6 py-3.5 figma-btn-primary text-sm font-semibold flex items-center gap-2 shadow-md hover:scale-[1.02] transition"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-4 h-4 text-[#dceeb1] dark:text-[#22c55e]" />
            </Link>
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 figma-btn-secondary text-sm font-semibold flex items-center gap-2"
            >
              <span>Explore GitHub Repository</span>
              <ExternalLink className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </a>
          </div>

          {/* Feature Badge Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-[#111827]/90 border border-[#e6e6e6] dark:border-[#1e293b] shadow-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1ea64a]" />
              Standard Harvard/MIT Single-Column Layout
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-[#111827]/90 border border-[#e6e6e6] dark:border-[#1e293b] shadow-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors">
              <Zap className="w-3.5 h-3.5 text-black dark:text-amber-400" />
              Gemini 3.8 Flash X-Y-Z Bullet Polish
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-[#111827]/90 border border-[#e6e6e6] dark:border-[#1e293b] shadow-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors">
              <Code2 className="w-3.5 h-3.5 text-black dark:text-white" />
              Downloadable .tex Source Code
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-[#111827]/90 border border-[#e6e6e6] dark:border-[#1e293b] shadow-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5 text-black dark:text-white" />
              Multimodal PDF / DOCX Ingestion
            </span>
          </div>
        </div>
      </section>

      {/* Main Content: Figma Editorial Flow */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Story Block 1: The Core Premise (Signature Lime Block) */}
        <section id="premise" className="scroll-mt-24">
          <div className="bg-[#dceeb1] dark:bg-[#1a2d18] rounded-3xl p-8 sm:p-12 text-black dark:text-slate-100 border border-[#cadca0] dark:border-[#284525] transition-colors">
            <div className="max-w-3xl">
              <span className="figma-eyebrow text-black dark:text-[#a3e635] block mb-3">
                THE PREMISE & WHY RESUTEX EXISTS
              </span>
              <h2 className="figma-display-lg font-bold text-black dark:text-white mb-5 tracking-tight">
                The ATS Parser Trap vs Authentic LaTeX
              </h2>
              <p className="figma-body-lg text-black dark:text-slate-200 mb-8 leading-relaxed">
                Over 75% of qualified software engineering applications are rejected or misfiled because modern Applicant Tracking Systems (Ashby, Greenhouse, Workable, Lever) choke on multi-column visual templates, floating Canva text blocks, and nested CSS tables.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 border border-black/10 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs font-mono uppercase">
                    <span>✕ The Visual Builder Problem</span>
                  </div>
                  <h3 className="figma-card-title text-black dark:text-white text-lg">
                    Unstructured Layouts
                  </h3>
                  <p className="figma-body-sm text-neutral-800 dark:text-neutral-300 leading-relaxed">
                    Canva and drag-and-drop builders generate PDF streams with unordered glyph coordinates. Parsers read column 2 before column 1, scrambling dates, job titles, and skills into unsearchable noise.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 border border-black/10 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-[#1ea64a] dark:text-[#22c55e] font-bold text-xs font-mono uppercase">
                    <span>✓ The ResuTex Solution</span>
                  </div>
                  <h3 className="figma-card-title text-black dark:text-white text-lg">
                    Deterministic Typography
                  </h3>
                  <p className="figma-body-sm text-neutral-800 dark:text-neutral-300 leading-relaxed">
                    ResuTex uses a strict single-column LaTeX hierarchy compiled via Python ReportLab. Clean headings, bullet points, and date anchors produce a 100% structured parse rate across every major ATS engine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 2: Capabilities & Features (Warm Cream Block) */}
        <section id="features" className="scroll-mt-24">
          <div className="bg-[#f4ecd6] dark:bg-[#232015] rounded-3xl p-8 sm:p-12 text-black dark:text-slate-100 border border-[#e4dcbf] dark:border-[#383320] space-y-8 transition-colors">
            <div className="max-w-2xl">
              <span className="figma-eyebrow text-black dark:text-[#fde047] block mb-2">
                STUDIO CAPABILITIES
              </span>
              <h2 className="figma-display-lg font-bold text-black dark:text-white tracking-tight">
                Four Pillars of the ResuTex Engine
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#101726] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#dceeb1] dark:text-[#16a34a]" />
                </div>
                <h3 className="figma-card-title text-black dark:text-white">
                  Live Two-Pane Split Studio
                </h3>
                <p className="figma-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Edit structured JSON records on the left while previewing an authentic, print-accurate EB Garamond paper sheet on the right with sub-millimeter margins and zoom controls.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#101726] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#c5b0f4] dark:text-[#a855f7]" />
                </div>
                <h3 className="figma-card-title text-black dark:text-white">
                  Gemini 3.8 Flash ATS Tailoring
                </h3>
                <p className="figma-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Paste any target Job Description. Gemini calculates your match percentage, discovers missing critical skills, and automatically rewrites bullets into quantified achievements.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#101726] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-[#ff3d8b]" />
                </div>
                <h3 className="figma-card-title text-black dark:text-white">
                  Dual-Track Compilation & .tex Export
                </h3>
                <p className="figma-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Download authentic raw LaTeX source code (`.tex`) for your local TeX distribution or Overleaf, or instantly compile pixel-perfect PDFs with the built-in ReportLab engine.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#101726] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#c8e6cd] dark:text-[#22c55e]" />
                </div>
                <h3 className="figma-card-title text-black dark:text-white">
                  Multimodal Ingestion Pipeline
                </h3>
                <p className="figma-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Already have a PDF, DOCX, or text resume? Drop it into our multimodal extractor. Gemini parses your entire employment chronology, projects, and skills into strict typed schemas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 3: Technical Architecture (Signature Deep Navy Block) */}
        <section id="architecture" className="scroll-mt-24">
          <div className="bg-[#1f1d3d] dark:bg-[#0e0c24] rounded-3xl p-8 sm:p-12 text-white border border-indigo-950 dark:border-indigo-900/60 space-y-8 transition-colors">
            <div className="max-w-3xl">
              <span className="figma-eyebrow text-[#dceeb1] block mb-2">
                SYSTEM DESIGN & REPOSITORY ARCHITECTURE
              </span>
              <h2 className="figma-display-lg font-bold text-white tracking-tight mb-4">
                Engineered for Reliability & Scale
              </h2>
              <p className="figma-body-lg text-neutral-300 leading-relaxed">
                ResuTex combines a Next.js 16 frontend with a Python ReportLab compilation microservice and Google Gemini AI orchestration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#171530] dark:bg-[#141233] border border-white/10 space-y-2">
                <span className="figma-caption text-[#dceeb1]">FRONTEND CORE</span>
                <h4 className="font-bold text-base text-white">Next.js 16 + Turbopack</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  React 19, TypeScript, Tailwind CSS, Motion physics, and Figma design tokens.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171530] dark:bg-[#141233] border border-white/10 space-y-2">
                <span className="figma-caption text-[#c5b0f4]">COMPILER ENGINE</span>
                <h4 className="font-bold text-base text-white">Python ReportLab</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Deterministic sub-second PDF generation without heavy TeX Live system bloat.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171530] dark:bg-[#141233] border border-white/10 space-y-2">
                <span className="figma-caption text-[#c8e6cd]">INTELLIGENCE LAYER</span>
                <h4 className="font-bold text-base text-white">Gemini 3.8 Flash</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Structured JSON output schemas via the official Google GenAI SDK.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171530] dark:bg-[#141233] border border-white/10 space-y-2">
                <span className="figma-caption text-[#f3c9b6]">PERSISTENCE</span>
                <h4 className="font-bold text-base text-white">Local + Supabase</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Persistent local state ledger and Supabase REST sync for application tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 4: AI Correspondence (Signature Lilac Block) */}
        <section className="scroll-mt-24">
          <div className="bg-[#c5b0f4] dark:bg-[#201835] rounded-3xl p-8 sm:p-12 text-black dark:text-slate-100 border border-[#b39de6] dark:border-[#372b57] transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="figma-eyebrow text-black dark:text-[#c084fc] block mb-2">
                  COVER LETTER STUDIO
                </span>
                <h2 className="figma-display-lg font-bold text-black dark:text-white tracking-tight mb-4">
                  High-Converting LaTeX Correspondence
                </h2>
                <p className="figma-body text-black dark:text-slate-200 leading-relaxed">
                  Don&apos;t send generic ChatGPT cover letters. ResuTex drafts personalized, high-agency correspondence highlighting your distributed systems, cloud architecture, and quantified impact.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/studio"
                  className="px-6 py-3 figma-btn-primary text-xs font-semibold inline-flex items-center gap-2"
                >
                  <span>Try Cover Letter Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 5: Call to Action (Mint Block) */}
        <section className="scroll-mt-24">
          <div className="bg-[#c8e6cd] dark:bg-[#132c20] rounded-3xl p-8 sm:p-14 text-center text-black dark:text-slate-100 border border-[#b4d6b9] dark:border-[#204935] flex flex-col items-center transition-colors">
            <span className="figma-eyebrow text-black dark:text-[#4ade80] mb-3">
              START BUILDING FOR FREE
            </span>
            <h2 className="figma-display-lg font-bold text-black dark:text-white max-w-2xl mb-4 tracking-tight">
              Ready to Upgrade Your Software Engineering Resume?
            </h2>
            <p className="figma-body text-black dark:text-slate-200 max-w-xl mb-8 leading-relaxed">
              Launch the studio in your browser now. No sign-up wall, zero subscriptions, fully open-source.
            </p>
            <Link
              href="/studio"
              className="px-8 py-4 figma-btn-primary text-sm font-semibold inline-flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <span>Open ResuTex Studio Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#dceeb1] dark:text-[#22c55e]" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer adhering to Figma Monochrome Spec */}
      <footer className="w-full bg-white dark:bg-[#090d16] border-t border-[#e6e6e6] dark:border-[#1e293b] py-12 px-4 sm:px-6 mt-12 transition-colors">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-serif font-black">
              T<sub className="text-[8px] font-sans text-[#dceeb1] dark:text-[#22c55e]">E</sub>X
            </div>
            <div>
              <span className="text-sm font-bold text-black dark:text-white tracking-tight">
                ResuTex
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-2">
                © 2026 Roddneil Gemina. MIT Licensed.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600 dark:text-neutral-300">
            <Link href="/studio" className="hover:text-black dark:hover:text-white transition">
              Studio Workspace
            </Link>
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black dark:hover:text-white transition"
            >
              GitHub Source
            </a>
            <span className="figma-caption text-[10px] text-neutral-400">
              FIGMA ANTI-SLOP SPEC
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
