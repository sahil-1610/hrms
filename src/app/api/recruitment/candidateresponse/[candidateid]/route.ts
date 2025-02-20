import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import "@/models/Vacancy.model"; // Ensure Vacancy model is imported for population
import authorize from "@/utils/authorize";
/**
 * GET /api/candidate/application/[candidateid]
 * Retrieves a specific candidate's details by ID.
 * Excludes `employeeData` as it is not relevant for candidates.
 * Requires authorization.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { candidateid: string } },
) {
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { candidateid } = params;

    // Find candidate by ID while excluding `employeeData`
    const candidate = await Person.findOne(
      { _id: candidateid, role: "candidate" },
      { employeeData: 0 },
    ).populate("vacancyId", "vacancyName description");

    if (!candidate) {
      return NextResponse.json(
        { success: false, message: "Candidate not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: candidate },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Candidate retrieval error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
