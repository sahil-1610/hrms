export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import "@/models/Vacancy.model";
import authorize from "@/utils/authorize";

// GET: Retrieve the list of employees from the Person collection by filtering role,
// and populate the vacancy field so that the vacancy object is returned too.
export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  try {
    await dbConnect();
    // Filter documents where role is "employee" and populate the "vacancyId" field.
    const employees = await Person.find({ role: "employee" }).populate(
      "vacancyId",
    );
    return NextResponse.json(
      { success: true, data: employees },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
