"use client";

import React from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store";
import { generateResumeLatex } from "@/lib/latexGenerator";
import { ThemeToggle } from "@/lib/theme";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import {
  FileText,
  Code2,
  Sparkles,
  Mail,
  Download,
  Upload,
  RotateCcw,
  Undo2,
  Redo2,
  CheckCircle2,
  FileCode,
} from "lucide-react";

interface HeaderProps {
  onOpenImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenImport }) => {
  const {
    resume,
    activeTab,
    setActiveTab,
    hasActiveResume,
    resetToDefault,
    resetToEmpty,
    undo,
    redo,
    historyIndex,
    history,
    isCompiling,
    setIsCompiling,
    setPdfBlobUrl,
    setPreviewMode,
  } = useResumeStore();

  const handleExportLatex = () => {
    if (!hasActiveResume || !resume) {
      alert("Please upload a resume or create one from scratch first.");
      return;
    }
    const latex = generateResumeLatex(resume);
    const blob = new Blob([latex], { type: "application/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(resume.personal.name || "Resume").replace(/\s+/g, "_")}_resume.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCompilePdf = async () => {
    if (!hasActiveResume || !resume) {
      alert("Please upload a resume or create one from scratch first.");
      return;
    }
    setIsCompiling(true);
    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, type: "resume" }),
      });

      if (!res.ok) {
        throw new Error("Compilation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setPreviewMode("pdf");

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.15 },
        colors: ["#000000", "#dceeb1", "#c5b0f4", "#ff3d8b"],
      });

      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.personal.name.replace(/\s+/g, "_")}_ATS_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("PDF compilation failed. Please verify ReportLab engine or export as .tex.");
    } finally {
      setIsCompiling(false);
    }
  };

  const navItems: Array<{
    id: "form" | "latex" | "tailor" | "cover_letter";
    label: string;
    icon: any;
    accentPill?: boolean;
  }> = [
    { id: "form", label: "Structured Form", icon: FileText },
    { id: "latex", label: "LaTeX Source", icon: Code2 },
    { id: "tailor", label: "AI Tailoring & ATS", icon: Sparkles, accentPill: true },
    { id: "cover_letter", label: "Cover Letter", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#090d16] border-b border-[#e6e6e6] dark:border-[#1e293b] transition-colors">
      {/* 56px Top Nav */}
      <div className="h-14 max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group hover:opacity-85 transition"
          title="Back to Landing Page Overview"
        >
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
            <span className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400 hidden md:block">
              GEMINI 3.8 FLASH • REPORTLAB ENGINE
            </span>
          </div>
        </Link>

        {/* Segmented Pill Navigation */}
        <nav className="flex items-center bg-[#f7f7f5] dark:bg-[#101625] p-1 rounded-full border border-[#e6e6e6] dark:border-[#1e293b] relative overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? "text-white dark:text-black"
                    : "text-black dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="figmaActiveTab"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    className="absolute inset-0 bg-black dark:bg-white rounded-full shadow-sm -z-10"
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.accentPill && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d8b]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* React Bits SquishSwitch Dark / Light Toggle */}
          <div className="pl-1 pr-1 border-r border-[#e6e6e6] dark:border-[#1e293b] hidden sm:block">
            <ThemeToggle compact={true} />
          </div>

          {/* Undo / Redo Circular Icon Buttons */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
              className="w-8 h-8 figma-btn-icon text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className="w-8 h-8 figma-btn-icon text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New Resume Button */}
          {hasActiveResume && (
            <button
              onClick={() => {
                if (confirm("Start over with an empty canvas? Your current document will be cleared.")) {
                  resetToEmpty();
                }
              }}
              title="Start a new resume (clears current document)"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium figma-btn-secondary"
            >
              <RotateCcw className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
              <span>New</span>
            </button>
          )}

          {/* Reset button (Load Sample) */}
          {hasActiveResume && (
            <button
              onClick={resetToDefault}
              title="Reset to Master Candidate Profile"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium figma-btn-secondary"
            >
              <RotateCcw className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
              <span>Sample</span>
            </button>
          )}

          {/* Import Pill */}
          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium figma-btn-secondary"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>Import</span>
          </button>

          {/* Export LaTeX */}
          <button
            onClick={handleExportLatex}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium figma-btn-secondary"
            title="Download LaTeX Source (.tex)"
          >
            <FileCode className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>.tex</span>
          </button>

          {/* Compile PDF Pill (button-primary) */}
          <button
            onClick={handleCompilePdf}
            disabled={isCompiling}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium figma-btn-primary disabled:opacity-50"
          >
            {isCompiling ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Compile PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 36px Figma Marquee Strip in Pure Inverse Canvas (Black) */}
      <div className="h-9 bg-black dark:bg-[#070a12] text-white flex items-center px-4 sm:px-6 overflow-hidden select-none border-t border-transparent dark:border-[#1e293b]">
        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <span className="figma-caption text-[11px] text-[#dceeb1] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dceeb1] animate-ping" />
              SYSTEM ACTIVE
            </span>
            <span className="text-neutral-600 dark:text-neutral-500">/</span>
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-200">
              <span>ATS PARSE RATE: <strong className="text-white">100%</strong></span>
              <span className="hidden sm:inline text-neutral-600 dark:text-neutral-500">•</span>
              <span className="hidden sm:inline">REPORTLAB PYTHON ENGINE</span>
              <span className="hidden md:inline text-neutral-600 dark:text-neutral-500">•</span>
              <span className="hidden md:inline">GEMINI 3.8 FLASH TAILORING</span>
              <span className="hidden lg:inline text-neutral-600 dark:text-neutral-500">•</span>
              <span className="hidden lg:inline">HARVARD/MIT ATS COMPLIANT STANDARD</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="figma-caption text-[10px] text-neutral-400 hidden sm:inline">
              FIGMA ANTI-SLOP SYSTEM
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900 text-[#dceeb1] border border-neutral-800">
              v2.0 READY
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
