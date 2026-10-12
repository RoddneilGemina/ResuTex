"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { ResumeSectionKey, emptyResumeData } from "@/types/resume";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  Check,
  X,
  TrendingUp,
  Layers,
} from "lucide-react";

const AVAILABLE_SECTIONS: Array<{
  key: ResumeSectionKey;
  label: string;
  description: string;
  icon: any;
}> = [
  {
    key: "experience",
    label: "Professional Experience",
    description: "Career roles, responsibilities and quantitative achievements",
    icon: Briefcase,
  },
  {
    key: "projects",
    label: "Relevant Projects",
    description: "Technical repositories, applications and architecture",
    icon: FolderGit2,
  },
  {
    key: "skills",
    label: "Technical Skills",
    description: "Categorized programming languages, libraries and cloud tooling",
    icon: Cpu,
  },
  {
    key: "education",
    label: "Education",
    description: "Universities, degrees, honors and academic milestones",
    icon: GraduationCap,
  },
  {
    key: "certifications",
    label: "Certifications",
    description: "Industry licenses, AWS / cloud credentials and verified badges",
    icon: Award,
  },
  {
    key: "research",
    label: "Research & Publications",
    description: "Peer-reviewed conference papers, symposiums and research",
    icon: BookOpen,
  },
  {
    key: "volunteering",
    label: "Volunteering & Leadership",
    description: "Civic initiatives, open-source community service and leadership",
    icon: Users,
  },
];

export const FormEditor: React.FC = () => {
  const { resume, setResume, activeSections, addSection, removeSection } =
    useResumeStore();

  const r = resume || emptyResumeData;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    research: true,
    certifications: true,
    volunteering: true,
  });

  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  const [polishingState, setPolishingState] = useState<{
    isLoading: boolean;
    section: "experience" | "projects" | "volunteering";
    itemIdx: number;
    bulletIdx: number;
    original: string;
    suggested?: string;
    reason?: string;
  } | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerPolish = async (
    section: "experience" | "projects" | "volunteering",
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
        const exps = [...(copy.experience || [])];
        const bullets = [...(exps[itemIdx]?.bullets || [])];
        bullets[bulletIdx] = suggested;
        exps[itemIdx] = { ...exps[itemIdx], bullets };
        return { ...copy, experience: exps };
      } else if (section === "projects") {
        const projs = [...(copy.projects || [])];
        const bullets = [...(projs[itemIdx]?.bullets || [])];
        bullets[bulletIdx] = suggested;
        projs[itemIdx] = { ...projs[itemIdx], bullets };
        return { ...copy, projects: projs };
      } else {
        const vols = [...(copy.volunteering || [])];
        const bullets = [...(vols[itemIdx]?.bullets || [])];
        bullets[bulletIdx] = suggested;
        vols[itemIdx] = { ...vols[itemIdx], bullets };
        return { ...copy, volunteering: vols };
      }
    });

    setPolishingState(null);
  };

  const updatePersonal = (field: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...(prev.personal || emptyResumeData.personal), [field]: value },
    }));
  };

  const unaddedSections = AVAILABLE_SECTIONS.filter(
    (s) => !activeSections.includes(s.key)
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Sections Status & Add Section Action Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl bg-[#f7f7f5] dark:bg-[#101625] border border-[#e6e6e6] dark:border-[#1e293b]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1ea64a] animate-pulse" />
          <span className="figma-caption font-bold text-xs text-black dark:text-white">
            {activeSections.length} SECTIONS DETECTED & ACTIVE
          </span>
        </div>

        <button
          onClick={() => setShowAddSectionModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Quick Jump Pill Rail */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {/* Personal Pill (Always Active) */}
        <button
          onClick={() => {
            setOpenSections((prev) => ({ ...prev, personal: true }));
            document.getElementById("section-personal")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 flex items-center gap-1.5 ${
            openSections.personal
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "bg-white dark:bg-[#101625] text-black dark:text-neutral-200 border border-[#e6e6e6] dark:border-[#1e293b]"
          }`}
        >
          <span>Personal</span>
        </button>

        {AVAILABLE_SECTIONS.filter((s) => activeSections.includes(s.key)).map((sec) => {
          let count = 0;
          if (sec.key === "experience") count = r.experience?.length || 0;
          if (sec.key === "projects") count = r.projects?.length || 0;
          if (sec.key === "skills") count = Object.keys(r.skills || {}).length;
          if (sec.key === "education") count = r.education?.length || 0;
          if (sec.key === "certifications") count = r.certifications?.length || 0;
          if (sec.key === "research") count = r.research?.length || 0;
          if (sec.key === "volunteering") count = r.volunteering?.length || 0;

          return (
            <button
              key={sec.key}
              onClick={() => {
                setOpenSections((prev) => ({ ...prev, [sec.key]: true }));
                document.getElementById(`section-${sec.key}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 flex items-center gap-1.5 ${
                openSections[sec.key]
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-white dark:bg-[#101625] text-black dark:text-neutral-200 border border-[#e6e6e6] dark:border-[#1e293b]"
              }`}
            >
              <span>{sec.label.split(" ")[0]}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  openSections[sec.key]
                    ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black"
                    : "bg-[#f7f7f5] dark:bg-[#182236] text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {unaddedSections.length > 0 && (
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-neutral-400 dark:border-neutral-600 hover:border-black dark:hover:border-white text-neutral-600 dark:text-neutral-400 shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>More</span>
          </button>
        )}
      </div>

      {/* Add Section Modal / Picker Dialog */}
      <AnimatePresence>
        {showAddSectionModal && (
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
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="figma-headline text-base font-bold text-black dark:text-white">
                      Add Resume Section
                    </h3>
                    <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">
                      CHOOSE A SECTION TO EXPAND YOUR ATS RESUME
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className="w-8 h-8 figma-btn-icon text-black dark:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {unaddedSections.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  All available sections have been added to your resume.
                </div>
              ) : (
                <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
                  {unaddedSections.map((sec) => {
                    const Icon = sec.icon;
                    return (
                      <button
                        key={sec.key}
                        onClick={() => {
                          addSection(sec.key);
                          setOpenSections((prev) => ({ ...prev, [sec.key]: true }));
                          setShowAddSectionModal(false);
                          setTimeout(() => {
                            document
                              .getElementById(`section-${sec.key}`)
                              ?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 100);
                        }}
                        className="w-full p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] hover:bg-[#efefe9] dark:hover:bg-[#141d30] border border-[#e6e6e6] dark:border-[#1e293b] transition flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#151e33] border border-[#e6e6e6] dark:border-[#1e293b] flex items-center justify-center text-black dark:text-white group-hover:scale-105 transition">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-black dark:text-white">
                              {sec.label}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
                              {sec.description}
                            </p>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="pt-3 border-t border-[#e6e6e6] dark:border-[#1e293b] flex justify-end">
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium figma-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* 1. PERSONAL INFORMATION (Foundational Core) */}
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
                  placeholder="e.g. Alex Rivera"
                  value={r.personal.name}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Headline / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Software Engineer"
                  value={r.personal.headline || ""}
                  onChange={(e) => updatePersonal("headline", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. candidate@domain.com"
                  value={r.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 234-5678"
                  value={r.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={r.personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="e.g. linkedin.com/in/alexrivera"
                  value={r.personal.linkedin || ""}
                  onChange={(e) => updatePersonal("linkedin", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">GitHub URL</label>
                <input
                  type="text"
                  placeholder="e.g. github.com/alexrivera"
                  value={r.personal.github || ""}
                  onChange={(e) => updatePersonal("github", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
              <div>
                <label className="figma-caption block text-neutral-600 dark:text-neutral-400 mb-1">Portfolio URL</label>
                <input
                  type="text"
                  placeholder="e.g. alexrivera.dev"
                  value={r.personal.portfolio || ""}
                  onChange={(e) => updatePersonal("portfolio", e.target.value)}
                  className="figma-input w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL EXPERIENCE */}
      {activeSections.includes("experience") && (
        <div id="section-experience" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("experience")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Professional Experience ({r.experience?.length || 0})
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">CAREER POSITIONS & MEASURED ACHIEVEMENTS</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("experience")}
                title="Remove Experience Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("experience")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.experience ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.experience && (
            <div className="p-5 space-y-4">
              <div className="space-y-4">
                {(r.experience || []).map((exp, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="figma-caption font-bold text-black dark:text-white">
                        #{eIdx + 1} • {exp.company || "New Position"}
                      </span>
                      <button
                        onClick={() => {
                          setResume((prev) => ({
                            ...prev,
                            experience: (prev.experience || []).filter((_, i) => i !== eIdx),
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
                          const exps = [...(r.experience || [])];
                          exps[eIdx].company = e.target.value;
                          setResume((prev) => ({ ...prev, experience: exps }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Role (e.g. Staff Engineer)"
                        value={exp.role}
                        onChange={(e) => {
                          const exps = [...(r.experience || [])];
                          exps[eIdx].role = e.target.value;
                          setResume((prev) => ({ ...prev, experience: exps }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Period (e.g. 2024 – Present)"
                        value={exp.period}
                        onChange={(e) => {
                          const exps = [...(r.experience || [])];
                          exps[eIdx].period = e.target.value;
                          setResume((prev) => ({ ...prev, experience: exps }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Location (e.g. San Francisco, CA)"
                        value={exp.location || ""}
                        onChange={(e) => {
                          const exps = [...(r.experience || [])];
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
                          KEY ACHIEVEMENTS (XYZ FORMULA)
                        </label>
                        <button
                          onClick={() => {
                            const exps = [...(r.experience || [])];
                            exps[eIdx].bullets = [...(exps[eIdx].bullets || []), ""];
                            setResume((prev) => ({ ...prev, experience: exps }));
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-black dark:text-neutral-200 hover:underline"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(exp.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="figma-caption text-neutral-400 dark:text-neutral-500 mt-2.5 w-4 text-right">
                            {bIdx + 1}.
                          </span>
                          <textarea
                            rows={2}
                            placeholder="Accomplished [X] as measured by [Y], by doing [Z]..."
                            value={b}
                            onChange={(e) => {
                              const exps = [...(r.experience || [])];
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
                                const exps = [...(r.experience || [])];
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
                        ...(prev.experience || []),
                        {
                          company: "",
                          role: "",
                          location: "",
                          period: "",
                          bullets: [""],
                          keywords: [],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience Position
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RELEVANT PROJECTS */}
      {activeSections.includes("projects") && (
        <div id="section-projects" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("projects")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Relevant Projects ({r.projects?.length || 0})
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">TECHNICAL REPOSITORIES & SYSTEMS ARCHITECTURE</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("projects")}
                title="Remove Projects Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("projects")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.projects ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.projects && (
            <div className="p-5 space-y-4">
              <div className="space-y-4">
                {(r.projects || []).map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="figma-caption font-bold text-black dark:text-white">
                        #{pIdx + 1} • {proj.name || "New Project"}
                      </span>
                      <button
                        onClick={() => {
                          setResume((prev) => ({
                            ...prev,
                            projects: (prev.projects || []).filter((_, i) => i !== pIdx),
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
                          const projs = [...(r.projects || [])];
                          projs[pIdx].name = e.target.value;
                          setResume((prev) => ({ ...prev, projects: projs }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Role (e.g. Lead Author)"
                        value={proj.role || ""}
                        onChange={(e) => {
                          const projs = [...(r.projects || [])];
                          projs[pIdx].role = e.target.value;
                          setResume((prev) => ({ ...prev, projects: projs }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Tech stack (comma-separated)"
                        value={(proj.tech || []).join(", ")}
                        onChange={(e) => {
                          const projs = [...(r.projects || [])];
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
                            const projs = [...(r.projects || [])];
                            projs[pIdx].bullets = [...(projs[pIdx].bullets || []), ""];
                            setResume((prev) => ({ ...prev, projects: projs }));
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-black dark:text-neutral-200 hover:underline"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(proj.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="figma-caption text-neutral-400 dark:text-neutral-500 mt-2.5 w-4 text-right">
                            {bIdx + 1}.
                          </span>
                          <textarea
                            rows={2}
                            placeholder="Architected, optimized, or released..."
                            value={b}
                            onChange={(e) => {
                              const projs = [...(r.projects || [])];
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
                                  `${proj.name} - ${(proj.tech || []).join(", ")}`
                                )
                              }
                              title="Polish with Gemini AI"
                              className="w-8 h-8 rounded-full bg-[#dceeb1] dark:bg-[#1d331a] hover:bg-[#cfdfa3] text-black dark:text-[#dceeb1] flex items-center justify-center transition border border-transparent dark:border-[#2a4d26]"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const projs = [...(r.projects || [])];
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
                        ...(prev.projects || []),
                        {
                          name: "",
                          role: "Developer",
                          tech: [],
                          period: "",
                          bullets: [""],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TECHNICAL SKILLS */}
      {activeSections.includes("skills") && (
        <div id="section-skills" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("skills")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Technical Skills ({Object.keys(r.skills || {}).length} categories)
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">CATEGORIZED FRAMEWORKS & TOOLING</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("skills")}
                title="Remove Skills Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("skills")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.skills ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.skills && (
            <div className="p-5 space-y-3.5">
              <div className="space-y-3">
                {Object.entries(r.skills || {}).map(([catKey, skillList], sIdx) => {
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
                            const copy = { ...(r.skills || {}) };
                            delete copy[catKey];
                            setResume((prev) => ({ ...prev, skills: copy }));
                          }}
                          className="w-7 h-7 figma-btn-icon text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        placeholder="Comma-separated items (e.g. TypeScript, React, PostgreSQL)"
                        value={(skillList || []).join(", ")}
                        onChange={(e) => {
                          const updated = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          setResume((prev) => ({
                            ...prev,
                            skills: { ...(prev.skills || {}), [catKey]: updated },
                          }));
                        }}
                        className="figma-input w-full font-mono text-xs"
                      />
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    const catName = prompt("Enter new skill category name (e.g. cloud_platforms, databases):");
                    if (catName && catName.trim()) {
                      const cleanKey = catName.trim().toLowerCase().replace(/\s+/g, "_");
                      setResume((prev) => ({
                        ...prev,
                        skills: { ...(prev.skills || {}), [cleanKey]: [] },
                      }));
                    }
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill Category
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. EDUCATION */}
      {activeSections.includes("education") && (
        <div id="section-education" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("education")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Education ({r.education?.length || 0})
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">ACADEMIC BACKGROUND & DEGREES</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("education")}
                title="Remove Education Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("education")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.education ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.education && (
            <div className="p-5 space-y-3.5">
              <div className="space-y-3">
                {(r.education || []).map((edu, edIdx) => (
                  <div
                    key={edIdx}
                    className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="figma-caption font-bold text-black dark:text-white">
                        #{edIdx + 1} • {edu.institution || "Institution"}
                      </span>
                      <button
                        onClick={() => {
                          setResume((prev) => ({
                            ...prev,
                            education: (prev.education || []).filter((_, i) => i !== edIdx),
                          }));
                        }}
                        className="w-7 h-7 figma-btn-icon text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Institution (e.g. Stanford University)"
                        value={edu.institution}
                        onChange={(e) => {
                          const edus = [...(r.education || [])];
                          edus[edIdx].institution = e.target.value;
                          setResume((prev) => ({ ...prev, education: edus }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Degree (e.g. BS Computer Science)"
                        value={edu.degree}
                        onChange={(e) => {
                          const edus = [...(r.education || [])];
                          edus[edIdx].degree = e.target.value;
                          setResume((prev) => ({ ...prev, education: edus }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Period (e.g. 2022 – 2026)"
                        value={edu.period}
                        onChange={(e) => {
                          const edus = [...(r.education || [])];
                          edus[edIdx].period = e.target.value;
                          setResume((prev) => ({ ...prev, education: edus }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Location (e.g. Stanford, CA)"
                        value={edu.location || ""}
                        onChange={(e) => {
                          const edus = [...(r.education || [])];
                          edus[edIdx].location = e.target.value;
                          setResume((prev) => ({ ...prev, education: edus }));
                        }}
                        className="figma-input"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setResume((prev) => ({
                      ...prev,
                      education: [
                        ...(prev.education || []),
                        {
                          institution: "",
                          degree: "",
                          location: "",
                          period: "",
                          highlights: [],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education Entry
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. RESEARCH & PUBLICATIONS */}
      {activeSections.includes("research") && (
        <div id="section-research" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("research")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Research & Publications ({r.research?.length || 0})
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">PEER-REVIEWED CONFERENCES & PAPERS</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("research")}
                title="Remove Research Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("research")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.research ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.research && (
            <div className="p-5 space-y-3.5">
              <div className="space-y-3">
                {(r.research || []).map((res, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="figma-caption font-bold text-black dark:text-white">
                        #{rIdx + 1} • {res.title || "New Paper"}
                      </span>
                      <button
                        onClick={() => {
                          setResume((prev) => ({
                            ...prev,
                            research: (prev.research || []).filter((_, i) => i !== rIdx),
                          }));
                        }}
                        className="w-7 h-7 figma-btn-icon text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Conference / Title"
                        value={res.title}
                        onChange={(e) => {
                          const resList = [...(r.research || [])];
                          resList[rIdx].title = e.target.value;
                          setResume((prev) => ({ ...prev, research: resList }));
                        }}
                        className="figma-input font-semibold"
                      />
                      <input
                        placeholder="Location / Index (e.g. Scopus-Indexed)"
                        value={res.location || ""}
                        onChange={(e) => {
                          const resList = [...(r.research || [])];
                          resList[rIdx].location = e.target.value;
                          setResume((prev) => ({ ...prev, research: resList }));
                        }}
                        className="figma-input"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Paper description and core findings..."
                      value={res.description}
                      onChange={(e) => {
                        const resList = [...(r.research || [])];
                        resList[rIdx].description = e.target.value;
                        setResume((prev) => ({ ...prev, research: resList }));
                      }}
                      className="figma-input w-full leading-relaxed"
                    />
                  </div>
                ))}

                <button
                  onClick={() => {
                    setResume((prev) => ({
                      ...prev,
                      research: [
                        ...(prev.research || []),
                        {
                          title: "",
                          role: "",
                          location: "",
                          paper: "",
                          description: "",
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Research Paper
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. CERTIFICATIONS */}
      {activeSections.includes("certifications") && (
        <div id="section-certifications" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("certifications")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Certifications ({r.certifications?.length || 0})
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">VERIFIED CREDENTIALS & BADGES</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("certifications")}
                title="Remove Certifications Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("certifications")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.certifications ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.certifications && (
            <div className="p-5 space-y-3.5">
              <div className="space-y-2.5">
                {(r.certifications || []).map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] flex items-center gap-2.5"
                  >
                    <input
                      placeholder="Certificate title (e.g. AWS Certified Solutions Architect)"
                      value={cert.title}
                      onChange={(e) => {
                        const certs = [...(r.certifications || [])];
                        certs[cIdx].title = e.target.value;
                        setResume((prev) => ({ ...prev, certifications: certs }));
                      }}
                      className="figma-input flex-1"
                    />
                    <input
                      placeholder="Date (e.g. 2026)"
                      value={cert.date}
                      onChange={(e) => {
                        const certs = [...(r.certifications || [])];
                        certs[cIdx].date = e.target.value;
                        setResume((prev) => ({ ...prev, certifications: certs }));
                      }}
                      className="figma-input w-28 font-mono text-xs"
                    />
                    <button
                      onClick={() => {
                        setResume((prev) => ({
                          ...prev,
                          certifications: (prev.certifications || []).filter((_, i) => i !== cIdx),
                        }));
                      }}
                      className="w-7 h-7 figma-btn-icon text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setResume((prev) => ({
                      ...prev,
                      certifications: [
                        ...(prev.certifications || []),
                        {
                          title: "",
                          issuer: "",
                          date: "",
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Certification Entry
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. VOLUNTEERING & LEADERSHIP */}
      {activeSections.includes("volunteering") && (
        <div id="section-volunteering" className="bg-white dark:bg-[#101625] rounded-3xl border border-[#e6e6e6] dark:border-[#1e293b] overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#101625] border-b border-[#e6e6e6] dark:border-[#1e293b]">
            <button
              onClick={() => toggleSection("volunteering")}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white tracking-tight">
                  Volunteering & Leadership ({r.volunteering?.length || 0})
                </h2>
                <p className="figma-caption text-[10px] text-neutral-500 dark:text-neutral-400">COMMUNITY INITIATIVES & LEADERSHIP ROLES</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSection("volunteering")}
                title="Remove Volunteering Section"
                className="w-7 h-7 figma-btn-icon text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSection("volunteering")}
                className="w-7 h-7 figma-btn-icon text-neutral-500"
              >
                <motion.div animate={{ rotate: openSections.volunteering ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {openSections.volunteering && (
            <div className="p-5 space-y-4">
              <div className="space-y-4">
                {(r.volunteering || []).map((vol, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-4 rounded-2xl bg-[#f7f7f5] dark:bg-[#0c121e] border border-[#e6e6e6] dark:border-[#1e293b] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="figma-caption font-bold text-black dark:text-white">
                        #{vIdx + 1} • {vol.organization || "Organization"}
                      </span>
                      <button
                        onClick={() => {
                          setResume((prev) => ({
                            ...prev,
                            volunteering: (prev.volunteering || []).filter((_, i) => i !== vIdx),
                          }));
                        }}
                        className="w-7 h-7 figma-btn-icon text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Organization (e.g. Red Cross / Google Developer Groups)"
                        value={vol.organization}
                        onChange={(e) => {
                          const vols = [...(r.volunteering || [])];
                          vols[vIdx].organization = e.target.value;
                          setResume((prev) => ({ ...prev, volunteering: vols }));
                        }}
                        className="figma-input"
                      />
                      <input
                        placeholder="Period (e.g. 2024 – 2026)"
                        value={vol.period}
                        onChange={(e) => {
                          const vols = [...(r.volunteering || [])];
                          vols[vIdx].period = e.target.value;
                          setResume((prev) => ({ ...prev, volunteering: vols }));
                        }}
                        className="figma-input"
                      />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="figma-caption text-neutral-600 dark:text-neutral-400">
                          LEADERSHIP & VOLUNTEER IMPACT
                        </label>
                        <button
                          onClick={() => {
                            const vols = [...(r.volunteering || [])];
                            vols[vIdx].bullets = [...(vols[vIdx].bullets || []), ""];
                            setResume((prev) => ({ ...prev, volunteering: vols }));
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-black dark:text-neutral-200 hover:underline"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(vol.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="figma-caption text-neutral-400 dark:text-neutral-500 mt-2.5 w-4 text-right">
                            {bIdx + 1}.
                          </span>
                          <textarea
                            rows={2}
                            placeholder="Organized, mentored, or coordinated..."
                            value={b}
                            onChange={(e) => {
                              const vols = [...(r.volunteering || [])];
                              vols[vIdx].bullets[bIdx] = e.target.value;
                              setResume((prev) => ({ ...prev, volunteering: vols }));
                            }}
                            className="figma-input flex-1 leading-relaxed"
                          />
                          <div className="flex flex-col gap-1 mt-0.5">
                            <button
                              onClick={() =>
                                triggerPolish(
                                  "volunteering",
                                  vIdx,
                                  bIdx,
                                  b,
                                  `${vol.organization}`
                                )
                              }
                              title="Polish with Gemini AI"
                              className="w-8 h-8 rounded-full bg-[#dceeb1] dark:bg-[#1d331a] hover:bg-[#cfdfa3] text-black dark:text-[#dceeb1] flex items-center justify-center transition border border-transparent dark:border-[#2a4d26]"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const vols = [...(r.volunteering || [])];
                                vols[vIdx].bullets = vols[vIdx].bullets.filter(
                                  (_, i) => i !== bIdx
                                );
                                setResume((prev) => ({ ...prev, volunteering: vols }));
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
                      volunteering: [
                        ...(prev.volunteering || []),
                        {
                          organization: "",
                          period: "",
                          bullets: [""],
                        },
                      ],
                    }));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold figma-btn-secondary flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Volunteering Entry
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
