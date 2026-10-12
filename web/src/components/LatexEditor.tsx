"use client";

import React, { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/store";
import { generateResumeLatex } from "@/lib/latexGenerator";
import { Copy, Check, Download, RefreshCw, FileCode } from "lucide-react";

export const LatexEditor: React.FC = () => {
  const { resume } = useResumeStore();
  const [latexCode, setLatexCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setLatexCode(generateResumeLatex(resume));
  }, [resume]);

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: "application/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.personal.name.replace(/\s+/g, "_")}_resume.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetSync = () => {
    setLatexCode(generateResumeLatex(resume));
  };

  const lines = latexCode.split("\n");
  const charCount = latexCode.length;

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-[#e6e6e6] shadow-sm">
      {/* 52px Toolbar adhering to Figma monochrome standard */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#e6e6e6]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
            <FileCode className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-black tracking-tight">
                resume.tex
              </span>
              <span className="figma-caption text-[10px] text-neutral-500">
                STANDARD ATS LATEX
              </span>
            </div>
            <span className="figma-caption text-[10px] text-neutral-400 hidden sm:inline">
              {lines.length} LINES • {charCount} CHARS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync Form Pill */}
          <button
            onClick={handleResetSync}
            title="Sync with Form updates"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium figma-btn-secondary"
          >
            <RefreshCw className="w-3 h-3 text-neutral-600" />
            <span className="hidden sm:inline">Sync Form</span>
          </button>

          {/* Copy Pill */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium figma-btn-secondary"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#1ea64a]" />
                <span className="text-[#1ea64a]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-600" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Export Pill: Black Primary */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium figma-btn-primary"
          >
            <Download className="w-3 h-3 text-white" />
            <span>Export .tex</span>
          </button>
        </div>
      </div>

      {/* Editor Window: Figma Deep Navy ({block-navy}) Surface */}
      <div className="flex-1 flex overflow-hidden bg-[#1f1d3d] font-mono text-[12px] leading-relaxed text-white">
        {/* Line Numbers */}
        <div className="py-4 px-3 select-none text-right text-indigo-300/40 bg-[#171530] border-r border-indigo-950/80 font-mono text-[11px]">
          {lines.map((_, i) => (
            <div key={i} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={latexCode}
          onChange={(e) => setLatexCode(e.target.value)}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-white leading-5 resize-none focus:outline-none selection:bg-[#dceeb1] selection:text-black overflow-y-auto font-mono text-[11.5px]"
        />
      </div>
    </div>
  );
};
