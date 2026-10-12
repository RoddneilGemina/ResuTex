"use client";

import React from "react";
import Link from "next/link";
import DotField from "@/components/DotField";
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
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-[#dceeb1] selection:text-black">
      {/* 56px Figma Top Nav */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#e6e6e6]">
        <div className="h-14 max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white shadow-sm group-hover:scale-105 transition">
              <span className="font-serif font-black text-sm tracking-widest">
                T<sub className="text-[9px] font-sans text-[#dceeb1]">E</sub>X
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-[-0.3px] text-black">
                  ResuTex
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f7f7f5] text-black border border-[#e6e6e6]">
                  LaTeX ATS Studio
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600">
            <a href="#premise" className="hover:text-black transition">
              Premise
            </a>
            <a href="#features" className="hover:text-black transition">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-black transition">
              Architecture
            </a>
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-black transition"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </nav>

          {/* Top Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium figma-btn-secondary"
            >
              <span>Star on GitHub</span>
            </a>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold figma-btn-primary"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 36px Figma Marquee Strip in Pure Inverse Canvas (Black) */}
        <div className="h-9 bg-black text-white flex items-center px-4 sm:px-6 overflow-hidden select-none">
          <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
              <span className="figma-caption text-[11px] text-[#dceeb1] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dceeb1] animate-ping" />
                STANDARDS ALIGNED
              </span>
              <span className="text-neutral-600">/</span>
              <div className="flex items-center gap-4 text-xs font-medium text-neutral-200">
                <span>100% ATS PARSE RATE</span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <span className="hidden sm:inline">REPORTLAB PYTHON COMPILER</span>
                <span className="hidden md:inline text-neutral-600">•</span>
                <span className="hidden md:inline">GEMINI 3.8 FLASH INTELLIGENCE</span>
                <span className="hidden lg:inline text-neutral-600">•</span>
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
      <section className="relative w-full overflow-hidden border-b border-[#e6e6e6] bg-white min-h-[640px] lg:min-h-[720px] flex items-center justify-center">
        {/* Interactive DotField Canvas Canvas */}
        <div className="absolute inset-0 z-0">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={65}
            glowRadius={170}
            sparkle={true}
            waveAmplitude={0}
            gradientFrom="rgba(0, 0, 0, 0.32)"
            gradientTo="rgba(0, 0, 0, 0.12)"
            glowColor="rgba(220, 238, 177, 0.55)"
            className="w-full h-full"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#e6e6e6] shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1ea64a]" />
            <span className="figma-caption text-[11px] font-bold text-black">
              AUTONOMOUS ATS RESUME STUDIO & COMPILER
            </span>
          </div>

          {/* Display-XL Headline */}
          <h1 className="figma-display-xl font-bold tracking-tight text-black max-w-4xl mx-auto mb-6">
            100% ATS Parsability. Authentic LaTeX Typesetting.
          </h1>

          {/* Subhead Body */}
          <p className="figma-subhead text-neutral-700 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            ResuTex pairs an interactive split-screen studio with a sub-second ReportLab Python compiler and Gemini 3.8 Flash intelligence. Zero formatting artifacts, perfect 1-page budgets, and pure downloadable LaTeX code.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-12">
            <Link
              href="/studio"
              className="px-6 py-3.5 figma-btn-primary text-sm font-semibold flex items-center gap-2 shadow-md hover:scale-[1.02] transition"
            >
              <span>Open ResuTex Studio</span>
              <ArrowRight className="w-4 h-4 text-[#dceeb1]" />
            </Link>
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 figma-btn-secondary text-sm font-semibold flex items-center gap-2"
            >
              <span>Explore GitHub Repository</span>
              <ExternalLink className="w-4 h-4 text-neutral-600" />
            </a>
          </div>

          {/* Feature Badge Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#e6e6e6] shadow-xs text-neutral-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1ea64a]" />
              Standard Harvard/MIT Single-Column Layout
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#e6e6e6] shadow-xs text-neutral-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-black" />
              Gemini 3.8 Flash X-Y-Z Bullet Polish
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#e6e6e6] shadow-xs text-neutral-800 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-black" />
              Downloadable .tex Source Code
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#e6e6e6] shadow-xs text-neutral-800 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-black" />
              Multimodal PDF / DOCX Ingestion
            </span>
          </div>
        </div>
      </section>

      {/* Main Content: Figma Editorial Flow */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Story Block 1: The Core Premise (Signature Lime Block) */}
        <section id="premise" className="scroll-mt-24">
          <div className="bg-[#dceeb1] rounded-3xl p-8 sm:p-12 text-black border border-[#cadca0]">
            <div className="max-w-3xl">
              <span className="figma-eyebrow text-black block mb-3">
                THE PREMISE & WHY RESUTEX EXISTS
              </span>
              <h2 className="figma-display-lg font-bold text-black mb-5 tracking-tight">
                The ATS Parser Trap vs Authentic LaTeX
              </h2>
              <p className="figma-body-lg text-black mb-8 leading-relaxed">
                Over 75% of qualified software engineering applications are rejected or misfiled because modern Applicant Tracking Systems (Ashby, Greenhouse, Workable, Lever) choke on multi-column visual templates, floating Canva text blocks, and nested CSS tables.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-6 rounded-2xl bg-white/85 border border-black/10 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs font-mono uppercase">
                    <span>✕ The Visual Builder Problem</span>
                  </div>
                  <h3 className="figma-card-title text-black text-lg">
                    Unstructured Layouts
                  </h3>
                  <p className="figma-body-sm text-neutral-800 leading-relaxed">
                    Canva and drag-and-drop builders generate PDF streams with unordered glyph coordinates. Parsers read column 2 before column 1, scrambling dates, job titles, and skills into unsearchable noise.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/85 border border-black/10 space-y-3">
                  <div className="flex items-center gap-2 text-[#1ea64a] font-bold text-xs font-mono uppercase">
                    <span>✓ The ResuTex Solution</span>
                  </div>
                  <h3 className="figma-card-title text-black text-lg">
                    Deterministic Typography
                  </h3>
                  <p className="figma-body-sm text-neutral-800 leading-relaxed">
                    ResuTex uses a strict single-column LaTeX hierarchy compiled via Python ReportLab. Clean headings, bullet points, and date anchors produce a 100% structured parse rate across every major ATS engine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 2: Capabilities & Features (Warm Cream Block) */}
        <section id="features" className="scroll-mt-24">
          <div className="bg-[#f4ecd6] rounded-3xl p-8 sm:p-12 text-black border border-[#e4dcbf] space-y-8">
            <div className="max-w-2xl">
              <span className="figma-eyebrow text-black block mb-2">
                STUDIO CAPABILITIES
              </span>
              <h2 className="figma-display-lg font-bold text-black tracking-tight">
                Four Pillars of the ResuTex Engine
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="p-7 rounded-2xl bg-white border border-[#e6e6e6] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#dceeb1]" />
                </div>
                <h3 className="figma-card-title text-black">
                  Live Two-Pane Split Studio
                </h3>
                <p className="figma-body text-neutral-700 leading-relaxed">
                  Edit structured JSON records on the left while previewing an authentic, print-accurate EB Garamond paper sheet on the right with sub-millimeter margins and zoom controls.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-7 rounded-2xl bg-white border border-[#e6e6e6] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#c5b0f4]" />
                </div>
                <h3 className="figma-card-title text-black">
                  Gemini 3.8 Flash ATS Tailoring
                </h3>
                <p className="figma-body text-neutral-700 leading-relaxed">
                  Paste any target Job Description. Gemini calculates your match percentage, discovers missing critical skills, and automatically rewrites bullets into quantified achievements.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-7 rounded-2xl bg-white border border-[#e6e6e6] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-[#ff3d8b]" />
                </div>
                <h3 className="figma-card-title text-black">
                  Dual-Track Compilation & .tex Export
                </h3>
                <p className="figma-body text-neutral-700 leading-relaxed">
                  Download authentic raw LaTeX source code (`.tex`) for your local TeX distribution or Overleaf, or instantly compile pixel-perfect PDFs with the built-in ReportLab engine.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-7 rounded-2xl bg-white border border-[#e6e6e6] space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#c8e6cd]" />
                </div>
                <h3 className="figma-card-title text-black">
                  Multimodal Ingestion Pipeline
                </h3>
                <p className="figma-body text-neutral-700 leading-relaxed">
                  Already have a PDF, DOCX, or text resume? Drop it into our multimodal extractor. Gemini parses your entire employment chronology, projects, and skills into strict typed schemas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 3: Technical Architecture (Signature Deep Navy Block) */}
        <section id="architecture" className="scroll-mt-24">
          <div className="bg-[#1f1d3d] rounded-3xl p-8 sm:p-12 text-white border border-indigo-950 space-y-8">
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
              <div className="p-5 rounded-2xl bg-[#171530] border border-white/10 space-y-2">
                <span className="figma-caption text-[#dceeb1]">FRONTEND CORE</span>
                <h4 className="font-bold text-base text-white">Next.js 16 + Turbopack</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  React 19, TypeScript, Tailwind CSS, Motion physics, and Figma design tokens.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171530] border border-white/10 space-y-2">
                <span className="figma-caption text-[#c5b0f4]">COMPILER ENGINE</span>
                <h4 className="font-bold text-base text-white">Python ReportLab</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Deterministic sub-second PDF generation without heavy TeX Live system bloat.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171530] border border-white/10 space-y-2">
                <span className="figma-caption text-[#c8e6cd]">INTELLIGENCE LAYER</span>
                <h4 className="font-bold text-base text-white">Gemini 3.8 Flash</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Structured JSON output schemas via the official Google GenAI SDK.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171530] border border-white/10 space-y-2">
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
          <div className="bg-[#c5b0f4] rounded-3xl p-8 sm:p-12 text-black border border-[#b39de6]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="figma-eyebrow text-black block mb-2">
                  COVER LETTER STUDIO
                </span>
                <h2 className="figma-display-lg font-bold text-black tracking-tight mb-4">
                  High-Converting LaTeX Correspondence
                </h2>
                <p className="figma-body text-black leading-relaxed">
                  Don't send generic ChatGPT cover letters. ResuTex drafts personalized, high-agency correspondence highlighting your distributed systems, cloud architecture, and quantified impact.
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
          <div className="bg-[#c8e6cd] rounded-3xl p-8 sm:p-14 text-center text-black border border-[#b4d6b9] flex flex-col items-center">
            <span className="figma-eyebrow text-black mb-3">
              START BUILDING FOR FREE
            </span>
            <h2 className="figma-display-lg font-bold text-black max-w-2xl mb-4 tracking-tight">
              Ready to Upgrade Your Software Engineering Resume?
            </h2>
            <p className="figma-body text-black max-w-xl mb-8 leading-relaxed">
              Launch the studio in your browser now. No sign-up wall, zero subscriptions, fully open-source.
            </p>
            <Link
              href="/studio"
              className="px-8 py-4 figma-btn-primary text-sm font-semibold inline-flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <span>Launch ResuTex Studio Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#dceeb1]" />
            </Link>
          </div>
        </section>
      </main>

      {/* 56px / Section Footer adhering to Figma Monochrome Spec */}
      <footer className="w-full bg-white border-t border-[#e6e6e6] py-12 px-4 sm:px-6 mt-12">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-black text-white text-xs font-serif font-black">
              T<sub className="text-[8px] font-sans text-[#dceeb1]">E</sub>X
            </div>
            <div>
              <span className="text-sm font-bold text-black tracking-tight">
                ResuTex
              </span>
              <span className="text-neutral-500 text-xs ml-2">
                © 2026 Roddneil Gemina. MIT Licensed.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600">
            <Link href="/studio" className="hover:text-black transition">
              Studio Workspace
            </Link>
            <a
              href="https://github.com/RoddneilGemina/ResuTex"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition"
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
