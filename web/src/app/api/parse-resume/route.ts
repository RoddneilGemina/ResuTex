import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
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

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "application/pdf";

      const parsedResume = await parseResumeWithGemini(base64Data, mimeType);
      return NextResponse.json({ success: true, data: parsedResume });
    } else {
      const body = await req.json();
      const { text, base64Data, mimeType } = body;

      const parsedResume = await parseResumeWithGemini(
        base64Data || "",
        mimeType || "application/pdf",
        text || ""
      );
      return NextResponse.json({ success: true, data: parsedResume });
    }
  } catch (error: any) {
    console.error("Resume parsing error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse resume document" },
      { status: 500 }
    );
  }
}
