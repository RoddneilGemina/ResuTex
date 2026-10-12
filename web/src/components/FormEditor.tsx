"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  Check,
  X,
  TrendingUp,
} from "lucide-react";

export const FormEditor: React.FC = () => {
  const { resume, setResume } = useResumeStore();

  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    research: true,
    certifications: true,
    volunteering: false,
  });

  const [polishingState, setPolishingState] = useState<{
    isLoading: boolean;
    section: "experience" | "projects";
    itemIdx: number;
    bulletIdx: number;
    original: string;
    suggested?: string;
    reason?: string;
  } | null>(null);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerPolish = async (
    section: "experience" | "projects",
    itemIdx: number,
    bulletIdx: number,
    text: string,
    context: string
  ) => {
    setPolishingState({
      isLoading: true,
      section,
      itemIdx,
      bulletIdx,
      original: text,
    });

    try {
      const res = await fetch("/api/ai/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: text, context }),
      });
      const data = await res.json();
      if (data.success) {
        setPolishingState({
          isLoading: false,
          section,
          itemIdx,
          bulletIdx,
          original: text,
          suggested: data.polished,
          reason: data.reason,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      setPolishingState(null);
      alert("Failed to polish bullet point with AI.");
    }
  };

  const applyPolishedBullet = () => {
    if (!polishingState || !polishingState.suggested) return;
    const { section, itemIdx, bulletIdx, suggested } = polishingState;

    setResume((prev) => {
      const copy = { ...prev };
      if (section === "experience") {
        const exps = [...copy.experience];
        const bullets = [...exps[itemIdx].bullets];
        bullets[bulletIdx] = suggested;
        exps[itemIdx] = { ...exps[itemIdx], bullets };
        return { ...copy, experience: exps };
      } else {
        const projs = [...copy.projects];
        const bullets = [...projs[itemIdx].bullets];
        bullets[bulletIdx] = suggested;
        projs[itemIdx] = { ...projs[itemIdx], bullets };
        return { ...copy, projects: projs };
      }
    });

    setPolishingState(null);
  };

  const updatePersonal = (field: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const sectionPills = [
    { key: "personal", label: "Personal", count: null },
    { key: "experience", label: "Experience", count: resume.experience.length },
    { key: "projects", label: "Projects", count: resume.projects.length },
    { key: "skills", label: "Skills", count: Object.keys(resume.skills).length },
    { key: "education", label: "Education", count: resume.education.length },
    { key: "research", label: "Research", count: resume.research?.length || 0 },
    { key: "certifications", label: "Certifications", count: resume.certifications.length },
  ] as const;

  return (
    <div className="space-y-4 pb-20">
      {/* Quick Jump Pill Rail in Figma Style */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {sectionPills.map((pill) => (
          <button
            key={pill.key}
            onClick={() => {
              setOpenSections((prev) => ({ ...prev, [pill.key]: true }));
              const el = document.getElementById(`section-${pill.key}`);
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 flex items-center gap-1.5 ${
              openSections[pill.key]
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-white dark:bg-[#101625] text-black dark:text-neutral-200 border border-[#e6e6e6] dark:border-[#1e293b] hover:bg-[#f7f7f5] dark:hover:bg-[#182236]"
            }`}
          >
            <span>{pill.label}</span>
            {pill.count !== null && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  openSections[pill.key]
                    ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black"
                    : "bg-[#f7f7f5] dark:bg-[#182236] text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {pill.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* AI Polish Modal: Signature Figma Design Dialog */}
      <AnimatePresence>
        {polishingState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white dark:bg-[#0f1626] rounded-3xl p-6 shadow-2xl border border-[#e6e6e6] dark:border-[#1e293b] text-black dark:text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#e6e6e6] dark:border-[#1e293b]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#dceeb1] dark:text-[#1ea64a]" />
                  </div>
                  <div>
                    <h3 className="figma-headline text-sm font-bold text-black dark:text-white">
                      Gemini 3.8 Flash • X-Y-Z Polish
                    </h3>
                    <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">
                      ACCOMPLISHED [X], MEASURED BY [Y], BY DOING [Z]
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPolishingState(null)}
                  className="w-8 h-8 figma-btn-icon text-black dark:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {polishingState.isLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    Analyzing metrics and strengthening active verbs...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div>
                    <span className="figma-caption text-neutral-500 dark:text-neutral-400 block mb-1">
                      ORIGINAL FORMULATION
                    </span>
                    <div className="p-3 rounded-xl bg-[#f7f7f5] dark:bg-[#0a0f1a] border border-[#e6e6e6] dark:border-[#1e293b] text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      {polishingState.original}
                    </div>
                  </div>

                  <div>
                    <span className="figma-caption text-black dark:text-white block mb-1 flex items-center gap-1 font-bold">
                      <TrendingUp className="w-3.5 h-3.5 text-black dark:text-white" /> UPGRADED HIGH-IMPACT FORMULATION
                    </span>
                    <textarea
                      rows={3}
                      value={polishingState.suggested}
                      onChange={(e) =>
                        setPolishingState((prev) =>
                          prev ? { ...prev, suggested: e.target.value } : null
                        )
                      }
                      className="figma-input w-full leading-relaxed font-sans"
                    />
                  </div>

                  {polishingState.reason && (
                    <div className="p-3 rounded-xl bg-[#dceeb1]/30 dark:bg-[#1d331a]/60 border border-[#dceeb1] dark:border-[#2a4d26] text-xs text-neutral-800 dark:text-neutral-200">
                      <strong className="block font-semibold mb-0.5 text-black dark:text-white">
                        Optimization Rationale:
                      </strong>
                      {polishingState.reason}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setPolishingState(null)}
                      className="px-4 py-2 rounded-full text-xs font-medium figma-btn-secondary"
                    >
                      Discard
                    </button>
                    <button
                      onClick={applyPolishedBullet}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium figma-btn-primary"
                    >
                      <Check className="w-3.5 h-3.5 text-[#dceeb1] dark:text-black" />
                      <span>Apply Upgrade</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. PERSONAL INFORMATION */}
      <div id="section-personal" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("personal")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">Personal Information</h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">CREDENTIALS, CONTACT & PORTFOLIO</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.personal ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.personal && (
          <div className="p-5 pt-0 space-y-4 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personal.name}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Headline / Role</label>
                <input
                  type="text"
                  value={resume.personal.headline || ""}
                  onChange={(e) => updatePersonal("headline", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={resume.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Location</label>
                <input
                  type="text"
                  value={resume.personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={resume.personal.linkedin || ""}
                  onChange={(e) => updatePersonal("linkedin", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={resume.personal.github || ""}
                  onChange={(e) => updatePersonal("github", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Portfolio URL</label>
                <input
                  type="text"
                  value={resume.personal.portfolio || ""}
                  onChange={(e) => updatePersonal("portfolio", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL EXPERIENCE */}
      <div id="section-experience" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Professional Experience ({resume.experience.length})
              </h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">CAREER POSITIONS & MEASURED ACHIEVEMENTS</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.experience ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.experience && (
          <div className="p-5 pt-0 space-y-4 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="space-y-4 pt-4">
              {resume.experience.map((exp, eIdx) => (
                <div
                  key={eIdx}
                  className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="figma-caption font-bold text-black dark:text-white">
                      #{eIdx + 1} • {exp.company || "Company"}
                    </span>
                    <button
                      onClick={() => {
                        setResume((prev) => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== eIdx),
                        }));
                      }}
                      className="w-7 h-7 figma-btn-icon text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Company (e.g. Stripe)"
                      value={exp.company}
                      onChange={(e) => {
                        const exps = [...resume.experience];
                        exps[eIdx].company = e.target.value;
                        setResume((prev) => ({ ...prev, experience: exps }));
                      }}
                      className="figma-input"
                    />
                    <input
                      placeholder="Role (e.g. Staff Engineer)"
                      value={exp.role}
                      onChange={(e) => {
                        const exps = [...resume.experience];
                        exps[eIdx].role = e.target.value;
                        setResume((prev) => ({ ...prev, experience: exps }));
                      }}
                      className="figma-input"
                    />
                    <input
                      placeholder="Period (e.g. 2024 – Present)"
                      value={exp.period}
                      onChange={(e) => {
                        const exps = [...resume.experience];
                        exps[eIdx].period = e.target.value;
                        setResume((prev) => ({ ...prev, experience: exps }));
                      }}
                      className="figma-input"
                    />
                    <input
                      placeholder="Location (e.g. San Francisco, CA)"
                      value={exp.location || ""}
                      onChange={(e) => {
                        const exps = [...resume.experience];
                        exps[eIdx].location = e.target.value;
                        setResume((prev) => ({ ...prev, experience: exps }));
                      }}
                      className="figma-input"
                    />
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="figma-caption text-neutral-600 dark:text-neutral-400">
                        KEY MEASURED ACHIEVEMENTS (XYZ FORMULA)
                      </label>
                      <button
                        onClick={() => {
                          const exps = [...resume.experience];
                          exps[eIdx].bullets.push("Engineered ...");
                          setResume((prev) => ({ ...prev, experience: exps }));
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-black dark:text-neutral-200 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="figma-caption text-neutral-400 dark:text-neutral-500 mt-2.5 w-4 text-right">
                          {bIdx + 1}.
                        </span>
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => {
                            const exps = [...resume.experience];
                            exps[eIdx].bullets[bIdx] = e.target.value;
                            setResume((prev) => ({ ...prev, experience: exps }));
                          }}
                          className="figma-input flex-1 leading-relaxed"
                        />
                        <div className="flex flex-col gap-1 mt-0.5">
                          <button
                            onClick={() =>
                              triggerPolish(
                                "experience",
                                eIdx,
                                bIdx,
                                b,
                                `${exp.company} - ${exp.role}`
                              )
                            }
                            title="Polish with Gemini 3.8 Flash (X-Y-Z formula)"
                            className="w-8 h-8 rounded-full bg-[#dceeb1] dark:bg-[#1d331a] hover:bg-[#cfdfa3] text-black dark:text-[#dceeb1] flex items-center justify-center transition border border-transparent dark:border-[#2a4d26]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const exps = [...resume.experience];
                              exps[eIdx].bullets = exps[eIdx].bullets.filter(
                                (_, i) => i !== bIdx
                              );
                              setResume((prev) => ({ ...prev, experience: exps }));
                            }}
                            className="w-8 h-8 figma-btn-icon text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setResume((prev) => ({
                    ...prev,
                    experience: [
                      ...prev.experience,
                      {
                        company: "New Company",
                        role: "Software Engineer",
                        location: "Remote",
                        period: "2026 – Present",
                        bullets: [
                          "Architected scalable microservices reducing p99 latency by 28%.",
                        ],
                        keywords: [],
                      },
                    ],
                  }));
                }}
                className="w-full py-2.5 rounded-full text-xs font-medium figma-btn-secondary flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience Position
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. RELEVANT PROJECTS */}
      <div id="section-projects" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Relevant Projects ({resume.projects.length})
              </h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">TECHNICAL REPOSITORIES & SYSTEMS ARCHITECTURE</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.projects ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.projects && (
          <div className="p-5 pt-0 space-y-4 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="space-y-4 pt-4">
              {resume.projects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="figma-caption font-bold text-black dark:text-white">
                      #{pIdx + 1} • {proj.name}
                    </span>
                    <button
                      onClick={() => {
                        setResume((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((_, i) => i !== pIdx),
                        }));
                      }}
                      className="w-7 h-7 figma-btn-icon text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      placeholder="Project Name (e.g. Distributed KV)"
                      value={proj.name}
                      onChange={(e) => {
                        const projs = [...resume.projects];
                        projs[pIdx].name = e.target.value;
                        setResume((prev) => ({ ...prev, projects: projs }));
                      }}
                      className="figma-input"
                    />
                    <input
                      placeholder="Role (e.g. Lead Author)"
                      value={proj.role || ""}
                      onChange={(e) => {
                        const projs = [...resume.projects];
                        projs[pIdx].role = e.target.value;
                        setResume((prev) => ({ ...prev, projects: projs }));
                      }}
                      className="figma-input"
                    />
                    <input
                      placeholder="Tech stack (comma-separated)"
                      value={proj.tech.join(", ")}
                      onChange={(e) => {
                        const projs = [...resume.projects];
                        projs[pIdx].tech = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setResume((prev) => ({ ...prev, projects: projs }));
                      }}
                      className="figma-input"
                    />
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="figma-caption text-neutral-600 dark:text-neutral-400">
                        PROJECT HIGHLIGHTS
                      </label>
                      <button
                        onClick={() => {
                          const projs = [...resume.projects];
                          projs[pIdx].bullets.push("Architected ...");
                          setResume((prev) => ({ ...prev, projects: projs }));
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-black dark:text-neutral-200 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {proj.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="figma-caption text-neutral-400 dark:text-neutral-500 mt-2.5 w-4 text-right">
                          {bIdx + 1}.
                        </span>
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => {
                            const projs = [...resume.projects];
                            projs[pIdx].bullets[bIdx] = e.target.value;
                            setResume((prev) => ({ ...prev, projects: projs }));
                          }}
                          className="figma-input flex-1 leading-relaxed"
                        />
                        <div className="flex flex-col gap-1 mt-0.5">
                          <button
                            onClick={() =>
                              triggerPolish(
                                "projects",
                                pIdx,
                                bIdx,
                                b,
                                `${proj.name} - ${proj.tech.join(", ")}`
                              )
                            }
                            title="Polish with Gemini AI"
                            className="w-8 h-8 rounded-full bg-[#dceeb1] dark:bg-[#1d331a] hover:bg-[#cfdfa3] text-black dark:text-[#dceeb1] flex items-center justify-center transition border border-transparent dark:border-[#2a4d26]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const projs = [...resume.projects];
                              projs[pIdx].bullets = projs[pIdx].bullets.filter(
                                (_, i) => i !== bIdx
                              );
                              setResume((prev) => ({ ...prev, projects: projs }));
                            }}
                            className="w-8 h-8 figma-btn-icon text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setResume((prev) => ({
                    ...prev,
                    projects: [
                      ...prev.projects,
                      {
                        name: "New Project",
                        role: "Architect & Developer",
                        tech: ["TypeScript", "Next.js"],
                        period: "2026",
                        bullets: ["Engineered high-performance real-time application."],
                      },
                    ],
                  }));
                }}
                className="w-full py-2.5 rounded-full text-xs font-medium figma-btn-secondary flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. TECHNICAL SKILLS */}
      <div id="section-skills" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Technical Skills ({Object.keys(resume.skills).length} categories)
              </h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">CATEGORIZED FRAMEWORKS & TOOLING</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.skills ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.skills && (
          <div className="p-5 pt-0 space-y-3.5 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="space-y-3 pt-4">
              {Object.entries(resume.skills).map(([catKey, skillList], sIdx) => {
                const displayTitle = catKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="figma-caption font-bold text-black dark:text-white">
                        {displayTitle}
                      </span>
                      <button
                        onClick={() => {
                          const copy = { ...resume.skills };
                          delete copy[catKey];
                          setResume((prev) => ({ ...prev, skills: copy }));
                        }}
                        className="w-7 h-7 figma-btn-icon text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      value={(skillList || []).join(", ")}
                      onChange={(e) => {
                        const updated = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setResume((prev) => ({
                          ...prev,
                          skills: { ...prev.skills, [catKey]: updated },
                        }));
                      }}
                      className="figma-input w-full font-mono text-xs"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. EDUCATION */}
      <div id="section-education" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("education")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Education ({resume.education.length})
              </h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">ACADEMIC BACKGROUND & DEGREES</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.education ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.education && (
          <div className="p-5 pt-0 space-y-3.5 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="space-y-3 pt-4">
              {resume.education.map((edu, edIdx) => (
                <div
                  key={edIdx}
                  className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const edus = [...resume.education];
                      edus[edIdx].institution = e.target.value;
                      setResume((prev) => ({ ...prev, education: edus }));
                    }}
                    className="figma-input"
                  />
                  <input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const edus = [...resume.education];
                      edus[edIdx].degree = e.target.value;
                      setResume((prev) => ({ ...prev, education: edus }));
                    }}
                    className="figma-input"
                  />
                  <input
                    placeholder="Period"
                    value={edu.period}
                    onChange={(e) => {
                      const edus = [...resume.education];
                      edus[edIdx].period = e.target.value;
                      setResume((prev) => ({ ...prev, education: edus }));
                    }}
                    className="figma-input"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. RESEARCH & PUBLICATIONS */}
      <div id="section-research" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("research")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Research & Publications ({resume.research?.length || 0})
              </h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">PEER-REVIEWED CONFERENCES & PAPERS</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.research ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.research && (
          <div className="p-5 pt-0 space-y-3.5 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="space-y-3 pt-4">
              {(resume.research || []).map((res, rIdx) => (
                <div
                  key={rIdx}
                  className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Conference / Title"
                      value={res.title}
                      onChange={(e) => {
                        const resList = [...(resume.research || [])];
                        resList[rIdx].title = e.target.value;
                        setResume((prev) => ({ ...prev, research: resList }));
                      }}
                      className="figma-input font-semibold"
                    />
                    <input
                      placeholder="Location / Index (e.g. Scopus-Indexed)"
                      value={res.location || ""}
                      onChange={(e) => {
                        const resList = [...(resume.research || [])];
                        resList[rIdx].location = e.target.value;
                        setResume((prev) => ({ ...prev, research: resList }));
                      }}
                      className="figma-input"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Paper description and findings"
                    value={res.description}
                    onChange={(e) => {
                      const resList = [...(resume.research || [])];
                      resList[rIdx].description = e.target.value;
                      setResume((prev) => ({ ...prev, research: resList }));
                    }}
                    className="figma-input w-full leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. CERTIFICATIONS */}
      <div id="section-certifications" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("certifications")}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] hover:bg-[#f7f7f5] dark:hover:bg-[#151d30] transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Certifications ({resume.certifications.length})
              </h2>
              <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">VERIFIED CREDENTIALS & BADGES</p>
            </div>
          </div>
          <motion.div animate={{ rotate: openSections.certifications ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </motion.div>
        </button>

        {openSections.certifications && (
          <div className="p-5 pt-0 space-y-3.5 border-t border-[#e6e6e6] dark:border-[#1e293b]">
            <div className="space-y-2.5 pt-4">
              {resume.certifications.map((cert, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] flex items-center gap-2.5"
                >
                  <input
                    placeholder="Certificate title"
                    value={cert.title}
                    onChange={(e) => {
                      const certs = [...resume.certifications];
                      certs[cIdx].title = e.target.value;
                      setResume((prev) => ({ ...prev, certifications: certs }));
                    }}
                    className="figma-input flex-1"
                  />
                  <input
                    placeholder="Date"
                    value={cert.date}
                    onChange={(e) => {
                      const certs = [...resume.certifications];
                      certs[cIdx].date = e.target.value;
                      setResume((prev) => ({ ...prev, certifications: certs }));
                    }}
                    className="figma-input w-28 font-mono text-xs"
                  />
                  <button
                    onClick={() => {
                      setResume((prev) => ({
                        ...prev,
                        certifications: prev.certifications.filter((_, i) => i !== cIdx),
                      }));
                    }}
                    className="w-7 h-7 figma-btn-icon text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
