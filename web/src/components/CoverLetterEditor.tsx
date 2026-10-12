"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { generateCoverLetterLatex } from "@/lib/latexGenerator";
import { Sparkles, Download, FileCode, Mail, Building, UserCheck } from "lucide-react";
import confetti from "canvas-confetti";

export const CoverLetterEditor: React.FC = () => {
  const { resume, coverLetter, setCoverLetter, targetJob } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          company: coverLetter.company || targetJob.company || "Target Company",
          role: coverLetter.role || targetJob.role || "Software Engineer",
          jobDescription: targetJob.description,
          hiringContact: coverLetter.hiringContact,
        }),
      });

      const data = await res.json();
      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.3 },
          colors: ["#000000", "#c5b0f4", "#f4ecd6"],
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter with AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportLatex = () => {
    if (!resume) {
      alert("Please upload a resume or create from scratch first.");
      return;
    }
    const latex = generateCoverLetterLatex(resume, coverLetter);
    const blob = new Blob([latex], { type: "application/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${coverLetter.company.replace(/\s+/g, "_")}_Cover_Letter.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCompilePdf = async () => {
    if (!resume) {
      alert("Please upload a resume or create from scratch first.");
      return;
    }
    setIsCompiling(true);
    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          coverLetter,
          type: "cover_letter",
        }),
      });

      if (!res.ok) {
        throw new Error("Compilation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${coverLetter.company.replace(/\s+/g, "_")}_Cover_Letter.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to compile cover letter PDF.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Signature Figma Pastel Color-Block Story Section (Cream / Warm) */}
      <div className="bg-[#f4ecd6] dark:bg-[#282419] rounded-3xl p-6 md:p-8 text-black dark:text-[#f4ecd6] border border-[#e4dcbf] dark:border-[#3e3827]">
        <div className="flex items-center justify-between mb-2">
          <span className="figma-eyebrow text-black dark:text-[#f4ecd6]">
            EDITORIAL CORRESPONDENCE
          </span>
          <span className="figma-caption px-2 py-0.5 rounded-full bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/10">
            LATEX ENGINE
          </span>
        </div>
        <h2 className="figma-headline font-bold text-black dark:text-white mb-2">
          Tailored Cover Letter Studio
        </h2>
        <p className="figma-body text-neutral-800 dark:text-neutral-300 leading-snug max-w-xl">
          Generate an authentic, high-converting letter aligned with your resume experience and customized for the target hiring team.
        </p>
      </div>

      {/* Editor Card in White Canvas */}
      <div className="bg-white dark:bg-[#101625] rounded-3xl p-6 border border-[#e6e6e6] dark:border-[#1e293b] space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#e6e6e6] dark:border-[#1e293b]">
          <span className="figma-eyebrow text-black dark:text-white">LETTER PARAMETERS</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportLatex}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium figma-btn-secondary"
            >
              <FileCode className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>.tex</span>
            </button>
            <button
              onClick={handleCompilePdf}
              disabled={isCompiling}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium figma-btn-primary disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-white dark:text-black" />
              <span>{isCompiling ? "Compiling..." : "Compile PDF"}</span>
            </button>
          </div>
        </div>

        {/* Company & Role Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              TARGET COMPANY
            </label>
            <input
              value={coverLetter.company}
              onChange={(e) => setCoverLetter({ company: e.target.value })}
              className="figma-input w-full"
            />
          </div>
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              TARGET ROLE
            </label>
            <input
              value={coverLetter.role}
              onChange={(e) => setCoverLetter({ role: e.target.value })}
              className="figma-input w-full"
            />
          </div>
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              HIRING CONTACT / TEAM
            </label>
            <input
              value={coverLetter.hiringContact}
              onChange={(e) => setCoverLetter({ hiringContact: e.target.value })}
              className="figma-input w-full"
            />
          </div>
        </div>

        {/* Generate Button: Black Pill */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 figma-btn-primary text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
              <span>Drafting Letter with Gemini 3.8 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#dceeb1] dark:text-black" />
              <span>Generate Tailored Letter with Gemini</span>
            </>
          )}
        </button>

        {/* Paragraphs */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              OPENING HOOK
            </label>
            <textarea
              rows={3}
              value={coverLetter.openingParagraph}
              onChange={(e) => setCoverLetter({ openingParagraph: e.target.value })}
              className="figma-input w-full leading-relaxed"
            />
          </div>
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              BODY PARAGRAPH 1: SYSTEMS & CORE ARCHITECTURE
            </label>
            <textarea
              rows={4}
              value={coverLetter.bodyParagraph1}
              onChange={(e) => setCoverLetter({ bodyParagraph1: e.target.value })}
              className="figma-input w-full leading-relaxed"
            />
          </div>
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              BODY PARAGRAPH 2: ENGINEERING RIGOR & IMPACT
            </label>
            <textarea
              rows={4}
              value={coverLetter.bodyParagraph2}
              onChange={(e) => setCoverLetter({ bodyParagraph2: e.target.value })}
              className="figma-input w-full leading-relaxed"
            />
          </div>
          <div>
            <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">
              CLOSING CALL-TO-ACTION
            </label>
            <textarea
              rows={3}
              value={coverLetter.closingParagraph}
              onChange={(e) => setCoverLetter({ closingParagraph: e.target.value })}
              className="figma-input w-full leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
