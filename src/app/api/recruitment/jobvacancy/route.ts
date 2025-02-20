export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Vacancy from "@/models/Vacancy.model";
import authorize from "@/utils/authorize";

/**
 * POST /api/recruitment/jobvacancy
 * Creates a new job vacancy.
 */
export async function POST(req: NextRequest) {
  // Only allow authorized users.
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const requestData = await req.json();
    console.log("Received request payload:", requestData);

    const {
      vacancyName,
      jobTitle,
      description,
      positions,
      isActive,
      hiringManager,
      hiringManagerEmail,
    } = requestData;

    // Validate required fields.
    if (
      !vacancyName ||
      !jobTitle ||
      !description ||
      positions == null ||
      !hiringManager ||
      !hiringManagerEmail
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const vacancy = new Vacancy({
      vacancyName,
      jobTitle,
      description,
      positions,
      isActive: isActive !== undefined ? isActive : true,
      hiringManager,
      hiringManagerEmail,
    });
    console.log("Vacancy to be saved:", vacancy);

    const savedVacancy = await vacancy.save();
    console.log("Saved Vacancy:", savedVacancy);

    return NextResponse.json(
      { success: true, data: savedVacancy },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Vacancy creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/recruitment/jobvacancy
 * Retrieves all job vacancies.
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const vacancies = await Vacancy.find({});
    return NextResponse.json(
      { success: true, data: vacancies },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Vacancy retrieval error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/recruitment/jobvacancy
 * Updates an existing job vacancy. Expects the vacancy id in the request body.
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const {
      id,
      vacancyName,
      jobTitle,
      description,
      positions,
      isActive,
      hiringManager,
      hiringManagerEmail,
    } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing vacancy id" },
        { status: 400 },
      );
    }
    const updateData: Record<string, any> = {
      vacancyName,
      jobTitle,
      description,
      positions,
      isActive,
      hiringManager,
      hiringManagerEmail,
    };

    // Remove undefined fields to avoid overwriting existing data.
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedVacancy = await Vacancy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedVacancy) {
      return NextResponse.json(
        { success: false, message: "Vacancy not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: updatedVacancy },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Vacancy update error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/recruitment/jobvacancy
 * Deletes a job vacancy. Expects the vacancy id in the request body.
 */
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing vacancy id" },
        { status: 400 },
      );
    }
    const deletedVacancy = await Vacancy.findByIdAndDelete(id);
    if (!deletedVacancy) {
      return NextResponse.json(
        { success: false, message: "Vacancy not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, message: "Vacancy deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Vacancy deletion error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
