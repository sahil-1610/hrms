// /api/candidateDecision/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { updateCandidateStatus } from "@/lib/updateCandidateStatus";
import { sendEmail } from "@/lib/email";
import authorize from "@/utils/authorize";

export async function POST(req: NextRequest) {
  // Require authorization for GET requests.
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { candidateid, fullName, email, decision } = await req.json();

    if (!candidateid || !fullName || !email || !decision) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (decision === "accepted") {
      // Update candidate status using the reusable function.
      const updatedCandidate = await updateCandidateStatus(
        candidateid,
        "accepted",
      );
      if (!updatedCandidate) {
        return NextResponse.json(
          { success: false, message: "Candidate not found" },
          { status: 404 },
        );
      }

      // Send acceptance email.
      await sendEmail({
        to: email,
        subject: "Application Accepted",
        text: `Dear ${fullName},

Congratulations! Your application has been accepted. Please wait for your offer and appointment letter.

Best regards,
Your Company Name`,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Candidate accepted. Email sent.",
          redirect: `/${candidateid}/genrateletter`,
        },
        { status: 200 },
      );
    } else if (decision === "rejected") {
      // Send rejection email.
      await sendEmail({
        to: email,
        subject: "Application Update",
        text: `Dear ${fullName},

We regret to inform you that your application was not successful.

Thank you for your interest,
Your Company Name`,
      });

      // Delete candidate using the updateCandidateStatus function.
      const deletedCandidate = await updateCandidateStatus(
        candidateid,
        "rejected",
      );
      if (!deletedCandidate) {
        return NextResponse.json(
          { success: false, message: "Candidate not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Candidate rejected. Email sent and candidate deleted from the database.",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid decision value" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Candidate decision error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
