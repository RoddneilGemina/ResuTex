import { NextRequest, NextResponse } from "next/server";
import { tailorResumeWithGemini } from "@/lib/gemini";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, jobDescription, company, role } = body as {
      resume: ResumeData;
      jobDescription: string;
      company?: string;
      role?: string;
    };

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and Job Description are required" },
        { status: 400 }
      );
    }

    const result = await tailorResumeWithGemini(
      resume,
      jobDescription,
      company,
      role
    );
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("AI Tailor error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to tailor resume" },
      { status: 500 }
    );
  }
}
