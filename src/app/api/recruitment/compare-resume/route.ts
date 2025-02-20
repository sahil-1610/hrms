export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { extractPdfText } from "@/helpers/extractPdfText";
import { chatWithAI } from "@/utils/geminiAIModel";
import authorize from "@/utils/authorize";

export async function POST(req: NextRequest) {
  // Ensure the user is authenticated before processing the request.
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { resumeUrl, vacancyDescription } = body;
    if (!resumeUrl || !vacancyDescription) {
      return NextResponse.json(
        { success: false, message: "Missing resumeUrl or vacancyDescription" },
        { status: 400 },
      );
    }
    // Extract text from the resume PDF using your server-side helper.
    const resumeText = await extractPdfText(resumeUrl);

    // Build a prompt to compare the resume text with the vacancy description.
    const prompt = `Compare the following resume text with the vacancy description and return an alignment percentage score:\n\nResume Text:\n${resumeText}\n\nVacancy Description:\n${vacancyDescription}\n\nAlignment Score (%):`;

    // Call your AI helper to generate the alignment score.
    const alignmentScore = await chatWithAI(prompt);

    return NextResponse.json(
      { success: true, alignmentScore },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in compare-resume API:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
