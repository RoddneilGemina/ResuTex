import { z } from "zod";

export const PersonalInfoSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  headline: z.string().optional().default(""),
  portfolio: z.string().optional().default(""),
  github: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  summary: z.string().optional().default(""),
});

export const ExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().default(""),
  period: z.string(),
  bullets: z.array(z.string()),
  keywords: z.array(z.string()).optional().default([]),
});

export const ProjectItemSchema = z.object({
  name: z.string(),
  role: z.string().default("Developer"),
  tech: z.array(z.string()),
  period: z.string().optional(),
  bullets: z.array(z.string()),
});

export const EducationItemSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  location: z.string().optional(),
  period: z.string(),
  highlights: z.array(z.string()).optional(),
});

export const ResearchItemSchema = z.object({
  title: z.string(),
  role: z.string().optional().default(""),
  location: z.string().optional().default(""),
  paper: z.string().optional().default(""),
  description: z.string(),
});

export const CertificationItemSchema = z.object({
  title: z.string(),
  issuer: z.string().optional().default(""),
  date: z.string(),
});

export const VolunteeringItemSchema = z.object({
  organization: z.string(),
  period: z.string(),
  bullets: z.array(z.string()),
});

export const ResumeSchema = z.object({
  personal: PersonalInfoSchema,
  experience: z.array(ExperienceItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  skills: z.record(z.string(), z.array(z.string())).default({}),
  education: z.array(EducationItemSchema).default([]),
  research: z.array(ResearchItemSchema).optional().default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  volunteering: z.array(VolunteeringItemSchema).optional().default([]),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type ResearchItem = z.infer<typeof ResearchItemSchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type VolunteeringItem = z.infer<typeof VolunteeringItemSchema>;

export interface ATSMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletSuggestions: Array<{
    section: string;
    index: number;
    original: string;
    suggested: string;
    reason: string;
  }>;
  summary: string;
}

export interface CoverLetterData {
  company: string;
  role: string;
  hiringContact: string;
  openingParagraph: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  closingParagraph: string;
}

export type ResumeSectionKey =
  | "personal"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "research"
  | "volunteering";

export const emptyResumeData: ResumeData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    portfolio: "",
    github: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  projects: [],
  skills: {},
  education: [],
  research: [],
  certifications: [],
  volunteering: [],
};
