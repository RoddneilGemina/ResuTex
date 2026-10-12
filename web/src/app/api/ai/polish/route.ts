import { NextRequest, NextResponse } from "next/server";
import { polishBulletWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bullet, context } = body as { bullet: string; context?: string };

    if (!bullet) {
      return NextResponse.json(
        { error: "Bullet text is required" },
        { status: 400 }
      );
    }

    const result = await polishBulletWithGemini(bullet, context);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("AI Polish error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to polish bullet" },
      { status: 500 }
    );
  }
}
