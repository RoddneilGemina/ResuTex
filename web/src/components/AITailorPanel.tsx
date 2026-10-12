"use client";

import React from "react";
import { useResumeStore } from "@/lib/store";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Zap,
  Check,
  Plus,
} from "lucide-react";

export const AITailorPanel: React.FC = () => {
  const {
    resume,
    setResume,
    targetJob,
    setTargetJob,
    atsResult,
    setAtsResult,
    isTailoring,
    setIsTailoring,
  } = useResumeStore();

  const handleRunTailor = async () => {
    if (!targetJob.description.trim()) {
      alert("Please paste a target Job Description to analyze.");
      return;
    }

    setIsTailoring(true);
    try {
      const res = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription: targetJob.description,
          company: targetJob.company,
          role: targetJob.role,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setAtsResult(data.result);
        if (data.result.score >= 80) {
          confetti({
            particleCount: 50,
            spread: 55,
            origin: { y: 0.2 },
            colors: ["#000000", "#dceeb1", "#c5b0f4", "#ff3d8b"],
          });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to analyze ATS match.");
    } finally {
      setIsTailoring(false);
    }
  };

  const handleApplySuggestion = (item: any) => {
    setResume((prev) => {
      const copy = { ...prev };
      for (let i = 0; i < copy.experience.length; i++) {
        const bIdx = copy.experience[i].bullets.findIndex(
          (b) => b === item.original
        );
        if (bIdx !== -1) {
          copy.experience[i].bullets[bIdx] = item.suggested;
          return copy;
        }
      }
      for (let i = 0; i < copy.projects.length; i++) {
        const bIdx = copy.projects[i].bullets.findIndex(
          (b) => b === item.original
        );
        if (bIdx !== -1) {
          copy.projects[i].bullets[bIdx] = item.suggested;
          return copy;
        }
      }
      return copy;
    });

    if (atsResult) {
      setAtsResult({
        ...atsResult,
        bulletSuggestions: atsResult.bulletSuggestions.filter(
          (s) => s.original !== item.original
        ),
      });
    }
  };

  const handleAddMissingKeyword = (keyword: string) => {
    setResume((prev) => {
      const skills = { ...prev.skills };
      const cat = skills["cloud_devops_sre"]
        ? "cloud_devops_sre"
        : Object.keys(skills)[0] || "core_technical";
      if (!skills[cat].includes(keyword)) {
        skills[cat] = [...skills[cat], keyword];
      }
      return { ...prev, skills };
    });

    if (atsResult) {
      setAtsResult({
        ...atsResult,
        missingKeywords: atsResult.missingKeywords.filter((k) => k !== keyword),
        matchedKeywords: [...atsResult.matchedKeywords, keyword],
        score: Math.min(100, atsResult.score + 2),
      });
    }
  };

  const fillSampleJD = () => {
    setTargetJob({
      company: "Stripe",
      role: "Senior Full-Stack Software Engineer",
      description: `Requirements:
- 3+ years of experience with TypeScript, React, Next.js, and Node.js.
- Strong proficiency in relational database design (PostgreSQL) and database locking mechanisms.
- Experience with Docker, Kubernetes, CI/CD automated deployment pipelines, and AWS cloud services.
- Passion for test-driven development (TDD), regression suites, and high platform availability.
- Proven track record designing high-volume payment processing or transactional APIs.`,
    });
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Signature Figma Pastel Color-Block Story Section (Mint) */}
      <div className="bg-[#c8e6cd] rounded-3xl p-6 md:p-8 text-black border border-[#b4d6b9]">
        <div className="flex items-center justify-between mb-2">
          <span className="figma-eyebrow text-black">
            AI TAILORING & ATS COMPLIANCE
          </span>
          <span className="figma-caption px-2 py-0.5 rounded-full bg-white text-black border border-black/10">
            GEMINI 3.8 FLASH
          </span>
        </div>
        <h2 className="figma-headline font-bold text-black mb-2">
          Precision ATS Optimization
        </h2>
        <p className="figma-body text-black leading-snug max-w-xl">
          Match your resume against any target job listing. Gemini audits keyword frequencies, flags gaps, and rewrites bullets into quantitative achievements.
        </p>
      </div>

      {/* Target Job Input Box in White Canvas Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6e6e6] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e6e6e6]">
          <div className="flex items-center gap-2">
            <span className="figma-eyebrow text-black">TARGET ROLE PARAMETERS</span>
          </div>
          <button
            onClick={fillSampleJD}
            className="px-3 py-1 rounded-full text-xs font-medium figma-btn-secondary"
          >
            Load Sample JD
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="figma-caption block text-neutral-600 mb-1">
              COMPANY NAME
            </label>
            <input
              placeholder="e.g. Stripe, Ashby, Google"
              value={targetJob.company}
              onChange={(e) => setTargetJob({ company: e.target.value })}
              className="figma-input w-full"
            />
          </div>
          <div>
            <label className="figma-caption block text-neutral-600 mb-1">
              TARGET POSITION
            </label>
            <input
              placeholder="e.g. Senior Full-Stack Engineer"
              value={targetJob.role}
              onChange={(e) => setTargetJob({ role: e.target.value })}
              className="figma-input w-full"
            />
          </div>
        </div>

        <div>
          <label className="figma-caption block text-neutral-600 mb-1">
            JOB DESCRIPTION & REQUIREMENTS
          </label>
          <textarea
            rows={5}
            placeholder="Paste complete job description, technical requirements, and responsibilities here..."
            value={targetJob.description}
            onChange={(e) => setTargetJob({ description: e.target.value })}
            className="figma-input w-full leading-relaxed"
          />
        </div>

        <button
          onClick={handleRunTailor}
          disabled={isTailoring}
          className="w-full py-3 figma-btn-primary text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isTailoring ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Keywords with Gemini 3.8 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#dceeb1]" />
              <span>Run Intelligent ATS Scan & Keyword Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* ATS Results Panel */}
      {atsResult && (
        <div className="space-y-4">
          {/* Match Score Card: Signature Lime Block */}
          <div className="bg-[#dceeb1] rounded-3xl p-6 text-black border border-[#cadca0]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="figma-caption text-black font-bold">
                  ATS ALIGNMENT SCORE
                </span>
                <h3 className="figma-card-title text-black">
                  {atsResult.score >= 85
                    ? "Top Tier Alignment (Ranked 95th Percentile)"
                    : atsResult.score >= 70
                    ? "Strong Candidate Match"
                    : "Moderate Alignment — Recommended Tweaks Below"}
                </h3>
                <p className="figma-body-sm text-black max-w-md leading-relaxed">
                  {atsResult.summary}
                </p>
              </div>

              {/* Bold Score Metric */}
              <div className="w-24 h-24 rounded-full bg-white text-black border border-black/10 flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-3xl font-black tracking-tight">
                  {atsResult.score}%
                </span>
                <span className="figma-caption text-[9px] text-neutral-500">
                  MATCH
                </span>
              </div>
            </div>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched Keywords */}
            <div className="bg-white rounded-3xl p-5 border border-[#e6e6e6] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1ea64a] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span className="figma-eyebrow text-black">
                  MATCHED KEYWORDS ({atsResult.matchedKeywords.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {atsResult.matchedKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#c8e6cd] text-black border border-[#b6d6bc]"
                  >
                    ✓ {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-3xl p-5 border border-[#e6e6e6] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ff3d8b] text-white flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <span className="figma-eyebrow text-black">
                  MISSING KEYWORDS ({atsResult.missingKeywords.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {atsResult.missingKeywords.map((k, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddMissingKeyword(k)}
                    title="Click to insert into Resume Skills"
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#efd4d4] hover:bg-[#e6c3c3] text-black border border-[#dec0c0] flex items-center gap-1 transition"
                  >
                    <span>+ {k}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bullet Optimization Recommendations */}
          {atsResult.bulletSuggestions && atsResult.bulletSuggestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-[#e6e6e6] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6e6e6]">
                <TrendingUp className="w-4 h-4 text-black" />
                <span className="figma-eyebrow text-black">
                  RECOMMENDED BULLET ENHANCEMENTS ({atsResult.bulletSuggestions.length})
                </span>
              </div>

              <div className="space-y-4">
                {atsResult.bulletSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#f7f7f5] border border-[#e6e6e6] space-y-3"
                  >
                    <div className="figma-caption text-neutral-500">
                      {item.section.toUpperCase()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Current */}
                      <div className="p-3.5 rounded-xl bg-white border border-[#e6e6e6] text-neutral-800 leading-relaxed">
                        <span className="figma-caption text-neutral-500 block mb-1">
                          CURRENT FORMULATION
                        </span>
                        {item.original}
                      </div>

                      {/* Suggested */}
                      <div className="p-3.5 rounded-xl bg-[#c8e6cd] border border-[#b6d6bc] text-black leading-relaxed font-medium">
                        <span className="figma-caption text-black block mb-1 flex items-center gap-1 font-bold">
                          <Zap className="w-3 h-3 text-black" /> QUANTITATIVE RECOMMENDATION
                        </span>
                        {item.suggested}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <p className="text-xs text-neutral-700 italic">
                        {item.reason}
                      </p>
                      <button
                        onClick={() => handleApplySuggestion(item)}
                        className="px-4 py-1.5 text-xs font-medium figma-btn-primary flex items-center gap-1.5 self-end sm:self-auto shrink-0"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
