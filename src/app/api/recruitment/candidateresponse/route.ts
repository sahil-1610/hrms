export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import "@/models/Vacancy.model";
import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "buffer";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST handler remains unchanged...
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

    let resumeUrl = "";
    const resumeFile = formData.get("resume");
    if (resumeFile && resumeFile instanceof File) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "pdfs", resource_type: "raw", format: "pdf" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(buffer);
      });
      resumeUrl = uploadResult.secure_url;
      if (!resumeUrl.toLowerCase().endsWith(".pdf")) {
        resumeUrl += ".pdf";
      }
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
 * If a vacancyId is provided, returns only candidates who applied for that vacancy.
 */
export async function GET(req: NextRequest) {
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
