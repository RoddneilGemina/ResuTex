"use client";

import React, { useState, useRef } from "react";
import { useResumeStore } from "@/lib/store";
import { Upload, X, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { setResume } = useResumeStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile && !pastedText.trim()) {
      setError("Please select a resume file or paste resume text.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (selectedFile) {
        // If user uploaded a JSON resume directly
        if (selectedFile.name.endsWith(".json")) {
          const text = await selectedFile.text();
          const json = JSON.parse(text);
          setResume(() => json);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
          onClose();
          return;
        }

        // Upload PDF / Document to Gemini parsing route
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.data) {
          setResume(() => data.data);
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.25 } });
          onClose();
        } else {
          throw new Error(data.error || "Failed to parse document");
        }
      } else {
        // Text mode
        const res = await fetch("/api/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: pastedText }),
        });

        const data = await res.json();
        if (data.success && data.data) {
          setResume(() => data.data);
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.25 } });
          onClose();
        } else {
          throw new Error(data.error || "Failed to parse text");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while parsing the resume.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-[#0f1626] rounded-3xl p-6 shadow-2xl border border-[#e6e6e6] dark:border-[#1e293b] space-y-5 animate-in fade-in zoom-in-95 duration-200 text-black dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e6e6e6] dark:border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#dceeb1] dark:text-[#1ea64a]" />
            </div>
            <div>
              <h3 className="figma-headline text-base font-bold text-black dark:text-white">
                Import Existing Resume
              </h3>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">
                GEMINI 3.8 FLASH MULTIMODAL PARSER
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 figma-btn-icon text-black dark:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#e6e6e6] dark:border-[#1e293b] hover:border-black dark:hover:border-white rounded-2xl p-7 text-center cursor-pointer bg-[#f7f7f5] dark:bg-[#0a0f1a] hover:bg-[#f1f1ee] dark:hover:bg-[#111726] transition group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.json,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#151d30] text-black dark:text-white border border-[#e6e6e6] dark:border-[#1e293b] flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition">
            <Upload className="w-5 h-5 text-black dark:text-white" />
          </div>
          <p className="text-xs font-semibold text-black dark:text-white">
            {selectedFile ? (
              <span className="font-bold underline">{selectedFile.name}</span>
            ) : (
              "Click or drop PDF, DOCX, or JSON resume here"
            )}
          </p>
          <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            EXTRACTS WORK EXPERIENCE, BULLETS, METRICS, AND SKILLS
          </p>
        </div>

        {/* Or Paste Raw Text */}
        <div className="space-y-1.5">
          <label className="figma-caption block text-neutral-600 dark:text-neutral-400">
            OR PASTE RAW RESUME TEXT / MARKDOWN:
          </label>
          <textarea
            rows={4}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw text here if you don't have a PDF file handy..."
            className="figma-input w-full leading-relaxed"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#efd4d4] dark:bg-[#341920] border border-[#dec0c0] dark:border-[#522530] text-black dark:text-[#efd4d4] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-black dark:text-[#efd4d4]" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e6e6e6] dark:border-[#1e293b]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium figma-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isProcessing}
            className="px-5 py-2 text-xs font-medium figma-btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                <span>Parsing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#dceeb1] dark:text-black" />
                <span>Extract & Import</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
