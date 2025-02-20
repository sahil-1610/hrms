// /app/api/interviews/schedule/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview.model";
import Person from "@/models/Person.model";
import Vacancy from "@/models/Vacancy.model";
import { sendEmail } from "@/lib/email"; // Assumed helper for sending emails

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    // Extract the payload
    const { candidateId, interviewDate, interviewTime, additionalNotes } =
      await req.json();
    if (!candidateId || !interviewDate || !interviewTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Find candidate details
    const candidate = await Person.findById(candidateId);
    if (!candidate) {
      return NextResponse.json(
        { success: false, message: "Candidate not found" },
        { status: 404 },
      );
    }

    // Fetch vacancy details using candidate.vacancyId (if available)
    let vacancy = null;
    if (candidate.vacancyId) {
      vacancy = await Vacancy.findById(candidate.vacancyId);
    }
    if (!vacancy) {
      return NextResponse.json(
        { success: false, message: "Vacancy details not found" },
        { status: 404 },
      );
    }

    // Create the interview record
    const interview = await Interview.create({
      candidate: candidateId,
      vacancy: vacancy._id,
      interviewDate: new Date(interviewDate),
      interviewTime,
      additionalNotes,
      status: "scheduled",
    });

    // Compose email for the candidate
    const candidateSubject = "Interview Scheduled";
    const candidateBody = `
      Dear ${candidate.fullName},
      
      Your interview has been scheduled on ${interviewDate} at ${interviewTime} with the Hiring Manager: ${vacancy.hiringManager}.
      Additional Notes: ${additionalNotes || "N/A"}
      
      Please be on time and prepare the necessary documents.
      
      Best regards,
      HR Team
    `;

    // Compose email for the hiring manager (assuming hiringManager field contains email)
    const hiringManagerSubject = "Interview Scheduled for Candidate";
    const hiringManagerBody = `
      Dear Hiring Manager,
      
      For the Vacancy : ${vacancy.vacancyName}
      An interview has been scheduled for candidate ${candidate.fullName}.
      Interview Date: ${interviewDate}
      Interview Time: ${interviewTime}
      Additional Notes: ${additionalNotes || "N/A"}
      
      Please review the candidate's profile before the interview.
       Candidate Linkedin ID : ${candidate.linkedIn}
       Candidate Resume : ${candidate.resume}

       
      Best regards,
      HR Team
    `;

    // Send the emails
    // Send email to candidate
    await sendEmail({
      to: candidate.email,
      subject: candidateSubject,
      text: candidateBody,
    });

    // Send email to hiring manager
    await sendEmail({
      to: vacancy.hiringManagerEmail,
      subject: hiringManagerSubject,
      text: hiringManagerBody,
    });

    return NextResponse.json(
      { success: true, data: interview },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error scheduling interview:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
