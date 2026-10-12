import { create } from "zustand";
import { ResumeData, ATSMatchResult, CoverLetterData } from "@/types/resume";
import { defaultResumeData } from "@/data/defaultProfile";

interface ResumeStore {
  resume: ResumeData;
  history: ResumeData[];
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
  resetToDefault: () => void;
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
  resume: defaultResumeData,
  history: [defaultResumeData],
  historyIndex: 0,
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
    const prev = get().resume;
    const next = updater(prev);
    const history = get().history.slice(0, get().historyIndex + 1);
    set({
      resume: next,
      history: [...history, next],
      historyIndex: history.length,
    });
  },

  resetToDefault: () => {
    set({
      resume: defaultResumeData,
      history: [defaultResumeData],
      historyIndex: 0,
      atsResult: null,
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
      set({
        historyIndex: historyIndex - 1,
        resume: history[historyIndex - 1],
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        resume: history[historyIndex + 1],
      });
    }
  },
}));
