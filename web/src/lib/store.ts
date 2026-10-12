import { create } from "zustand";
import {
  ResumeData,
  ATSMatchResult,
  CoverLetterData,
  ResumeSectionKey,
  emptyResumeData,
} from "@/types/resume";
import { defaultResumeData } from "@/data/defaultProfile";

interface ResumeStore {
  resume: ResumeData | null;
  hasActiveResume: boolean;
  activeSections: ResumeSectionKey[];
  history: (ResumeData | null)[];
  historyIndex: number;
  activeTab: "form" | "latex" | "tailor" | "cover_letter";
  previewMode: "visual" | "pdf";
  pdfBlobUrl: string | null;
  isCompiling: boolean;
  isParsing: boolean;
  isTailoring: boolean;
  activePolishKey: string | null;
  atsResult: ATSMatchResult | null;
  targetJob: {
    company: string;
    role: string;
    description: string;
  };
  coverLetter: CoverLetterData;

  // Actions
  setResume: (updater: (prev: ResumeData) => ResumeData) => void;
  createFromScratch: () => void;
  loadUploadedResume: (data: ResumeData) => void;
  loadSampleProfile: () => void;
  resetToEmpty: () => void;
  resetToDefault: () => void;
  addSection: (key: ResumeSectionKey) => void;
  removeSection: (key: ResumeSectionKey) => void;
  setActiveTab: (tab: "form" | "latex" | "tailor" | "cover_letter") => void;
  setPreviewMode: (mode: "visual" | "pdf") => void;
  setPdfBlobUrl: (url: string | null) => void;
  setIsCompiling: (val: boolean) => void;
  setIsParsing: (val: boolean) => void;
  setIsTailoring: (val: boolean) => void;
  setActivePolishKey: (key: string | null) => void;
  setAtsResult: (res: ATSMatchResult | null) => void;
  setTargetJob: (job: Partial<{ company: string; role: string; description: string }>) => void;
  setCoverLetter: (cl: Partial<CoverLetterData>) => void;
  undo: () => void;
  redo: () => void;
}

const defaultCoverLetter: CoverLetterData = {
  company: "Target Company",
  role: "Full-Stack Software Engineer",
  hiringContact: "Hiring Manager",
  openingParagraph:
    "I am writing to express my enthusiastic interest in the Full-Stack Software Engineer position. With a strong academic foundation in Computer Science from Cebu Institute of Technology - University and hands-on engineering experience spanning Site Reliability Engineering at Opswerks and Software QA at DXForm Technologies, I am eager to deliver immediate value to your engineering team.",
  bodyParagraph1:
    "Throughout my engineering experience, I have focused on building resilient, scalable, and test-driven systems. Having administered Linux environments, orchestrated container pipelines with Docker and Kubernetes, and engineered responsive full-stack applications with TypeScript, React, and PostgreSQL, I bring a systematic approach that aligns directly with your technical requirements.",
  bodyParagraph2:
    "Beyond infrastructure and application logic, I actively pioneer research-backed solutions and hold credentials including PhilNITS Fundamental Engineer and AWS Academy Graduate. I thrive in autonomous, collaborative teams that value clean code and proactive problem-solving.",
  closingParagraph:
    "I would welcome the opportunity to discuss how my technical versatility, systematic rigor, and passion for excellence can contribute to your engineering milestones. Thank you for your consideration.",
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
  // By default, no resume is on the screen until user uploads or creates from scratch
  resume: null,
  hasActiveResume: false,
  activeSections: [],
  history: [],
  historyIndex: -1,
  activeTab: "form",
  previewMode: "visual",
  pdfBlobUrl: null,
  isCompiling: false,
  isParsing: false,
  isTailoring: false,
  activePolishKey: null,
  atsResult: null,
  targetJob: {
    company: "",
    role: "",
    description: "",
  },
  coverLetter: defaultCoverLetter,

  setResume: (updater) => {
    const prev = get().resume || emptyResumeData;
    const next = updater(prev);
    const history = get().history.slice(0, get().historyIndex + 1);
    set({
      resume: next,
      hasActiveResume: true,
      history: [...history, next],
      historyIndex: history.length,
    });
  },

  createFromScratch: () => {
    const blank = { ...emptyResumeData, personal: { ...emptyResumeData.personal } };
    set({
      resume: blank,
      hasActiveResume: true,
      activeSections: ["personal"],
      history: [blank],
      historyIndex: 0,
      atsResult: null,
      pdfBlobUrl: null,
    });
  },

  loadUploadedResume: (data) => {
    const detected: ResumeSectionKey[] = ["personal"];
    if (data.experience && data.experience.length > 0) detected.push("experience");
    if (data.projects && data.projects.length > 0) detected.push("projects");
    if (data.skills && Object.keys(data.skills).length > 0) detected.push("skills");
    if (data.education && data.education.length > 0) detected.push("education");
    if (data.certifications && data.certifications.length > 0) detected.push("certifications");
    if (data.research && data.research.length > 0) detected.push("research");
    if (data.volunteering && data.volunteering.length > 0) detected.push("volunteering");

    set({
      resume: data,
      hasActiveResume: true,
      activeSections: detected,
      history: [data],
      historyIndex: 0,
      atsResult: null,
      pdfBlobUrl: null,
    });
  },

  loadSampleProfile: () => {
    const sample = defaultResumeData;
    const detected: ResumeSectionKey[] = [
      "personal",
      "experience",
      "projects",
      "skills",
      "education",
      "research",
      "certifications",
    ];
    set({
      resume: sample,
      hasActiveResume: true,
      activeSections: detected,
      history: [sample],
      historyIndex: 0,
      atsResult: null,
      pdfBlobUrl: null,
    });
  },

  resetToEmpty: () => {
    set({
      resume: null,
      hasActiveResume: false,
      activeSections: [],
      history: [],
      historyIndex: -1,
      atsResult: null,
      pdfBlobUrl: null,
    });
  },

  resetToDefault: () => {
    get().loadSampleProfile();
  },

  addSection: (key) => {
    const { activeSections, resume } = get();
    const currentResume = resume || emptyResumeData;
    const updatedSections = activeSections.includes(key)
      ? activeSections
      : [...activeSections, key];

    const copy = { ...currentResume };

    // Initialize with a blank item if currently empty so user immediately has an entry
    if (key === "experience" && (!copy.experience || copy.experience.length === 0)) {
      copy.experience = [
        {
          company: "",
          role: "",
          location: "",
          period: "",
          bullets: [""],
          keywords: [],
        },
      ];
    } else if (key === "projects" && (!copy.projects || copy.projects.length === 0)) {
      copy.projects = [
        {
          name: "",
          role: "Developer",
          tech: [],
          period: "",
          bullets: [""],
        },
      ];
    } else if (key === "skills" && (!copy.skills || Object.keys(copy.skills).length === 0)) {
      copy.skills = {
        languages_and_frameworks: [],
      };
    } else if (key === "education" && (!copy.education || copy.education.length === 0)) {
      copy.education = [
        {
          institution: "",
          degree: "",
          location: "",
          period: "",
          highlights: [],
        },
      ];
    } else if (key === "certifications" && (!copy.certifications || copy.certifications.length === 0)) {
      copy.certifications = [
        {
          title: "",
          issuer: "",
          date: "",
        },
      ];
    } else if (key === "research" && (!copy.research || copy.research.length === 0)) {
      copy.research = [
        {
          title: "",
          role: "",
          location: "",
          paper: "",
          description: "",
        },
      ];
    } else if (key === "volunteering" && (!copy.volunteering || copy.volunteering.length === 0)) {
      copy.volunteering = [
        {
          organization: "",
          period: "",
          bullets: [""],
        },
      ];
    }

    set({
      resume: copy,
      hasActiveResume: true,
      activeSections: updatedSections,
    });
  },

  removeSection: (key) => {
    const { activeSections } = get();
    set({
      activeSections: activeSections.filter((k) => k !== key),
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setPdfBlobUrl: (url) => set({ pdfBlobUrl: url }),
  setIsCompiling: (val) => set({ isCompiling: val }),
  setIsParsing: (val) => set({ isParsing: val }),
  setIsTailoring: (val) => set({ isTailoring: val }),
  setActivePolishKey: (key) => set({ activePolishKey: key }),
  setAtsResult: (res) => set({ atsResult: res }),

  setTargetJob: (job) =>
    set((state) => ({
      targetJob: { ...state.targetJob, ...job },
    })),

  setCoverLetter: (cl) =>
    set((state) => ({
      coverLetter: { ...state.coverLetter, ...cl },
    })),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({
        historyIndex: historyIndex - 1,
        resume: prev,
        hasActiveResume: prev !== null,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({
        historyIndex: historyIndex + 1,
        resume: next,
        hasActiveResume: next !== null,
      });
    }
  },
}));
