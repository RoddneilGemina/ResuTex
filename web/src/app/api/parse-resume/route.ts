import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithGemini, getGeminiClient } from "@/lib/gemini";
import { ResumeSchema, emptyResumeData, ResumeData } from "@/types/resume";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

function runPythonParser(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const candidatePythons = [
      "C:\\Users\\Admin\\AppData\\Local\\Python\\bin\\python.exe",
      "python",
      "py",
    ];

    let pythonExe = candidatePythons[0];
    for (const exe of candidatePythons) {
      if (fs.existsSync(exe)) {
        pythonExe = exe;
        break;
      }
    }

    const scriptPathInParent = path.resolve(process.cwd(), "..", "engine", "parse_resume.py");
    const scriptPathInCwd = path.resolve(process.cwd(), "engine", "parse_resume.py");
    const scriptPath = fs.existsSync(scriptPathInParent)
      ? scriptPathInParent
      : scriptPathInCwd;

    if (!fs.existsSync(scriptPath)) {
      return reject(new Error(`parse_resume.py script not found at ${scriptPath}`));
    }

    const child = spawn(pythonExe, [scriptPath, ...args], {
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
      },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (data) => {
      stdout += data;
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (data) => {
      stderr += data;
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python parser failed with code ${code}: ${stderr}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse Python JSON output: ${stdout.slice(0, 200)}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

function normalizeResumeData(raw: any): ResumeData {
  const result: any = {
    personal: {
      name: raw?.personal?.name || "Candidate Name",
      email: raw?.personal?.email || "",
      phone: raw?.personal?.phone || "",
      location: raw?.personal?.location || "",
      headline: raw?.personal?.headline || "Software Engineer",
      portfolio: raw?.personal?.portfolio || "",
      github: raw?.personal?.github || "",
      linkedin: raw?.personal?.linkedin || "",
      summary: raw?.personal?.summary || "",
    },
    education: Array.isArray(raw?.education)
      ? raw.education.map((e: any) => ({
          institution: e.institution || "University",
          degree: e.degree || "Degree",
          location: e.location || "",
          period: e.period || "",
          highlights: Array.isArray(e.highlights) ? e.highlights : [],
        }))
      : [],
    experience: Array.isArray(raw?.experience)
      ? raw.experience.map((e: any) => ({
          company: e.company || "Company",
          role: e.role || "Role",
          location: e.location || "",
          period: e.period || "",
          bullets: Array.isArray(e.bullets) ? e.bullets : [],
          keywords: Array.isArray(e.keywords) ? e.keywords : [],
        }))
      : [],
    projects: Array.isArray(raw?.projects)
      ? raw.projects.map((p: any) => ({
          name: p.name || "Project",
          role: p.role || "Developer",
          tech: Array.isArray(p.tech) ? p.tech : [],
          period: p.period || "",
          bullets: Array.isArray(p.bullets) ? p.bullets : [],
        }))
      : [],
    skills:
      raw?.skills && typeof raw.skills === "object" && !Array.isArray(raw.skills)
        ? raw.skills
        : {
            Engineering: ["TypeScript", "Python", "React", "Next.js"],
          },
    certifications: Array.isArray(raw?.certifications)
      ? raw.certifications.map((c: any) => ({
          title: c.title || "Certification",
          issuer: c.issuer || "",
          date: c.date || "",
        }))
      : [],
    research: Array.isArray(raw?.research)
      ? raw.research.map((r: any) => ({
          title: r.title || "Research Paper",
          role: r.role || "Author",
          location: r.location || "",
          paper: r.paper || "",
          description: r.description || "",
        }))
      : [],
    volunteering: Array.isArray(raw?.volunteering)
      ? raw.volunteering.map((v: any) => ({
          organization: v.organization || "Organization",
          period: v.period || "",
          bullets: Array.isArray(v.bullets) ? v.bullets : [],
        }))
      : [],
  };

  return result as ResumeData;
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // Check if uploaded file is JSON
      if (file.name.endsWith(".json")) {
        const text = await file.text();
        const json = JSON.parse(text);
        const normalized = normalizeResumeData(json);
        return NextResponse.json({ success: true, data: normalized });
      }

      // Write uploaded file to a temporary location to preserve extension for pypdf / python-docx
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || ".pdf";
      const tempFileName = `upload_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
      tempFilePath = path.join(os.tmpdir(), tempFileName);
      fs.writeFileSync(tempFilePath, buffer);

      // Run high-fidelity document extractor
      let parsedData: any = null;
      try {
        parsedData = await runPythonParser(["--file", tempFilePath]);
      } catch (pyErr) {
        console.warn("Python parser encountered error, attempting Gemini/fallback:", pyErr);
      }

      // If Gemini client is configured, refine with multimodal model if needed
      if (getGeminiClient()) {
        try {
          const base64Data = buffer.toString("base64");
          const mimeType = file.type || "application/pdf";
          const geminiResult = await parseResumeWithGemini(
            base64Data,
            mimeType,
            parsedData ? JSON.stringify(parsedData) : undefined
          );
          if (geminiResult && geminiResult.experience?.length) {
            parsedData = geminiResult;
          }
        } catch (geminiErr) {
          console.warn("Gemini refinement skipped:", geminiErr);
        }
      }

      if (!parsedData) {
        throw new Error("Unable to parse document. Please check the file format or paste the resume text.");
      }

      const normalized = normalizeResumeData(parsedData);
      return NextResponse.json({ success: true, data: normalized });
    } else {
      // Text / JSON payload
      const body = await req.json();
      const { text, base64Data, mimeType } = body;

      if (!text && !base64Data) {
        return NextResponse.json(
          { error: "No text or document provided" },
          { status: 400 }
        );
      }

      let parsedData: any = null;
      if (text) {
        try {
          parsedData = await runPythonParser(["--text", text]);
        } catch (pyErr) {
          console.warn("Python text parser error:", pyErr);
        }
      }

      if (getGeminiClient() && (base64Data || text)) {
        try {
          const geminiResult = await parseResumeWithGemini(
            base64Data || "",
            mimeType || "application/pdf",
            text || ""
          );
          if (geminiResult) {
            parsedData = geminiResult;
          }
        } catch (geminiErr) {
          console.warn("Gemini parse error:", geminiErr);
        }
      }

      if (!parsedData) {
        parsedData = emptyResumeData;
      }

      const normalized = normalizeResumeData(parsedData);
      return NextResponse.json({ success: true, data: normalized });
    }
  } catch (error: any) {
    console.error("Resume parsing route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse resume document" },
      { status: 500 }
    );
  } finally {
    // Clean up temporary upload file if created
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupErr) {
        console.warn("Failed to clean up temp file:", cleanupErr);
      }
    }
  }
}
