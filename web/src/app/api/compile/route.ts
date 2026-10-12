import { NextRequest, NextResponse } from "next/server";
import { ResumeData } from "@/types/resume";
import { generateResumeLatex, generateCoverLetterLatex } from "@/lib/latexGenerator";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resume,
      coverLetter,
      type = "resume",
      format = "pdf",
    } = body as {
      resume: ResumeData;
      coverLetter?: any;
      type?: "resume" | "cover_letter";
      format?: "pdf" | "latex";
    };

    if (!resume) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    // If requested format is raw LaTeX source:
    if (format === "latex") {
      const latex =
        type === "cover_letter" && coverLetter
          ? generateCoverLetterLatex(resume, coverLetter)
          : generateResumeLatex(resume);

      return new NextResponse(latex, {
        headers: {
          "Content-Type": "application/x-tex; charset=utf-8",
          "Content-Disposition": `attachment; filename="${resume.personal?.name?.replace(/\s+/g, "_") || "resume"}_${type}.tex"`,
        },
      });
    }

    // Compile PDF via the ATS compiler CLI
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "resumebuilder-"));
    const inputJsonPath = path.join(tempDir, "candidate.json");
    const outputPdfPath = path.join(tempDir, "output.pdf");

    fs.writeFileSync(inputJsonPath, JSON.stringify(resume, null, 2), "utf-8");

    // Path to the project root and compile_cli.py
    const projectRoot = path.resolve(process.cwd(), "..");
    const compileScript = path.join(projectRoot, "engine", "compile_cli.py");

    // Discover python path
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

    const company = coverLetter?.company || "Target Company";
    const role = coverLetter?.role || resume.personal?.headline || "Software Engineer";

    const compileArgs = [
      compileScript,
      "--input",
      inputJsonPath,
      "--output",
      outputPdfPath,
      "--type",
      type,
      "--company",
      company,
      "--role",
      role,
    ];

    const child = spawn(pythonExe, compileArgs, {
      cwd: projectRoot,
      env: { ...process.env, PYTHONPATH: projectRoot },
    });

    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      child.on("close", resolve);
      child.on("error", (err) => {
        console.error("Failed to spawn python compiler:", err);
        resolve(1);
      });
    });

    if (exitCode !== 0 || !fs.existsSync(outputPdfPath)) {
      console.error("Compilation failed with stderr:", stderr);
      // Clean up
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}

      return NextResponse.json(
        {
          error: "PDF compilation failed",
          details: stderr || "Unknown compilation error",
        },
        { status: 500 }
      );
    }

    const pdfBuffer = fs.readFileSync(outputPdfPath);

    // Clean up temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}

    const filename = `${resume.personal?.name?.replace(/\s+/g, "_") || "Candidate"}_ATS_${type}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Compile route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during compilation" },
      { status: 500 }
    );
  }
}
