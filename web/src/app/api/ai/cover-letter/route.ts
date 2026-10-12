import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetterWithGemini } from "@/lib/gemini";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, company, role, jobDescription, hiringContact } = body as {
      resume: ResumeData;
      company: string;
      role: string;
      jobDescription?: string;
      hiringContact?: string;
    };

    if (!resume || !company || !role) {
      return NextResponse.json(
        { error: "Resume, company, and role are required" },
        { status: 400 }
      );
    }

    const coverLetter = await generateCoverLetterWithGemini(
      resume,
      company,
      role,
      jobDescription,
      hiringContact
    );
    return NextResponse.json({ success: true, coverLetter });
  } catch (error: any) {
    console.error("AI Cover Letter error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
