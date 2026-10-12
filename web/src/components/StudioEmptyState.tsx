"use client";

import React, { useRef, useState } from "react";
import { useResumeStore } from "@/lib/store";
import {
  Upload,
  PlusCircle,
  Sparkles,
  FileText,
  FileCode,
  ArrowRight,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

interface StudioEmptyStateProps {
  onOpenImport: () => void;
}

export const StudioEmptyState: React.FC<StudioEmptyStateProps> = ({
  onOpenImport,
}) => {
  const { createFromScratch, loadSampleProfile, loadUploadedResume } =
    useResumeStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = async (file: File) => {
    setIsProcessing(true);
    try {
      if (file.name.endsWith(".json")) {
        const text = await file.text();
        const json = JSON.parse(text);
        loadUploadedResume(json);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data) {
        loadUploadedResume(data.data);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.25 } });
      } else {
        throw new Error(data.error || "Failed to parse document");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to parse resume document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Onboarding Header Banner */}
      <div className="bg-[#f4ecd6] dark:bg-[#282419] rounded-3xl p-6 sm:p-8 text-black dark:text-[#f4ecd6] border border-[#e4dcbf] dark:border-[#3e3827] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="figma-eyebrow text-black dark:text-[#f4ecd6]">
            RESUTEX ATS WORKSPACE
          </span>
          <span className="figma-caption px-2.5 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[10px]">
            READY TO BUILD
          </span>
        </div>
        <h1 className="figma-headline text-2xl font-bold text-black dark:text-white mb-2 tracking-tight">
          No Active Resume Loaded
        </h1>
        <p className="figma-body text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed max-w-xl">
          Choose how you would like to begin. Upload an existing document to automatically detect your experience sections, or start fresh with an authentic blank LaTeX sheet.
        </p>
      </div>

      {/* Main Two Options Grid */}
      <div className="grid grid-cols-1 gap-5">
        {/* Option 1: Upload a Resume */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-white dark:bg-[#101625] rounded-3xl p-6 sm:p-7 border transition shadow-sm ${
            isDragging
              ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 bg-[#f7f7f5] dark:bg-[#151e32]"
              : "border-[#e6e6e6] dark:border-[#1e293b] hover:border-neutral-400 dark:hover:border-neutral-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.json,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileDrop(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#dceeb1] dark:bg-[#1d331a] text-black dark:text-[#dceeb1] flex items-center justify-center shrink-0 border border-[#cadca0] dark:border-[#2a4d26]">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-black dark:text-white tracking-tight">
                    Upload Existing Resume
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#c8e6cd] dark:bg-[#152d22] text-black dark:text-[#c8e6cd] border border-[#b6d6bc] dark:border-[#224b38]">
                    RECOMMENDED
                  </span>
                </div>
                <p className="figma-caption text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  PDF, DOCX, TXT OR JSON • AUTOMATIC SECTION DETECTION
                </p>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold figma-btn-primary shrink-0 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>Parsing Sections...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#dceeb1] dark:text-black" />
                  <span>Upload & Detect Sections</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            Gemini 3.8 Flash extracts your personal credentials, career timeline, project repositories, technical skills, and academic degrees. All recognized sections are detected and loaded automatically into the editor.
          </p>

          <div className="p-4 rounded-2xl border border-dashed border-[#e6e6e6] dark:border-[#1e293b] bg-[#f7f7f5] dark:bg-[#0c121e] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Drag and drop your resume file directly onto this card, or click to browse.
            </span>
            <button
              onClick={onOpenImport}
              className="text-xs font-semibold text-black dark:text-white underline hover:opacity-80 shrink-0"
            >
              Open Full Import Dialog →
            </button>
          </div>
        </div>

        {/* Option 2: Create from Scratch */}
        <div className="bg-white dark:bg-[#101625] rounded-3xl p-6 sm:p-7 border border-[#e6e6e6] dark:border-[#1e293b] hover:border-neutral-400 dark:hover:border-neutral-600 transition shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-black dark:text-white tracking-tight">
                  Create from Scratch
                </h2>
                <p className="figma-caption text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  BLANK CANVAS • MODULAR SECTION-BY-SECTION COMPOSITION
                </p>
              </div>
            </div>

            <button
              onClick={createFromScratch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold figma-btn-secondary shrink-0"
            >
              <span>Start Blank Canvas</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            Begin with a pristine clean profile. Start by entering your personal details, and dynamically add only the sections you need (Experience, Projects, Skills, Education, Certifications, or Research).
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="figma-caption text-[10px]">AVAILABLE SECTIONS:</span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f7f5] dark:bg-[#131b2e] text-neutral-700 dark:text-neutral-300 border border-[#e6e6e6] dark:border-[#1e293b]">
              + Experience
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f7f5] dark:bg-[#131b2e] text-neutral-700 dark:text-neutral-300 border border-[#e6e6e6] dark:border-[#1e293b]">
              + Projects
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f7f5] dark:bg-[#131b2e] text-neutral-700 dark:text-neutral-300 border border-[#e6e6e6] dark:border-[#1e293b]">
              + Skills
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f7f5] dark:bg-[#131b2e] text-neutral-700 dark:text-neutral-300 border border-[#e6e6e6] dark:border-[#1e293b]">
              + Education
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f7f5] dark:bg-[#131b2e] text-neutral-700 dark:text-neutral-300 border border-[#e6e6e6] dark:border-[#1e293b]">
              + Certifications
            </span>
          </div>
        </div>
      </div>

      {/* Tertiary: Quick Demo Sample Profile */}
      <div className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#101625] border border-[#e6e6e6] dark:border-[#1e293b] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <FileCode className="w-4 h-4 text-neutral-500" />
          <span>Prefer to explore the interface first with sample data?</span>
        </div>
        <button
          onClick={loadSampleProfile}
          className="text-xs font-semibold text-black dark:text-white underline hover:opacity-80"
        >
          Load Master Sample Profile
        </button>
      </div>
    </div>
  );
};
