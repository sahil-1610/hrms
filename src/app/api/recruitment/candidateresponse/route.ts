export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import Vacancy from "@/models/Vacancy.model"; // Import Vacancy model explicitly.
import { v2 as cloudinary } from "cloudinary";
import { uploadPDF } from "@/utils/cloudinary";
import authorize from "@/utils/authorize";

// Configure Cloudinary using environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/candidate/application
 * Creates a new candidate application.
 * This method remains public (no authorization required).
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // Extract text fields.
    const fullName = formData.get("fullName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const address = formData.get("address")?.toString() || "";
    const education = formData.get("education")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const linkedIn = formData.get("linkedIn")?.toString() || "";
    const notes = formData.get("notes")?.toString() || "";
    const vacancyId = formData.get("vacancyId")?.toString() || "";

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !education ||
      !experience ||
      !vacancyId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // NEW: Before processing the file, check if the vacancy exists.
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return NextResponse.json(
        { success: false, message: "Vacancy not found or has been deleted." },
        { status: 404 },
      );
    }

    let resumeUrl = "";
    const resumeFile = formData.get("resume");
    if (resumeFile && resumeFile instanceof File) {
      // Use the helper function to upload the PDF
      const uploadResult = await uploadPDF(resumeFile);
      resumeUrl = uploadResult.url;
    }

    const newCandidate = new Person({
      fullName,
      email,
      phone,
      address,
      education,
      experience,
      linkedIn,
      role: "candidate",
      status: "active",
      resume: resumeUrl,
      vacancyId, // This should be an ObjectId string.
      candidateData: {
        applicationStatus: false,
        notes,
      },
    });

    const savedCandidate = await newCandidate.save();
    return NextResponse.json(
      { success: true, data: savedCandidate },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Candidate application creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/candidate/application?vacancyId=...
 * Retrieves candidate applications.
 * This method is restricted to authorized users only.
 */
export async function GET(req: NextRequest) {
  // Require authorization for GET requests.
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const vacancyId = req.nextUrl.searchParams.get("vacancyId");
    let candidates;
    if (vacancyId) {
      candidates = await Person.find({ role: "candidate", vacancyId }).populate(
        "vacancyId",
        "vacancyName description",
      );
    } else {
      candidates = await Person.find({ role: "candidate" }).populate(
        "vacancyId",
        "vacancyName description",
      );
    }
    return NextResponse.json(
      { success: true, data: candidates },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Candidate application retrieval error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
