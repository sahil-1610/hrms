// /app/api/employees/pendingLetters/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import { jwtVerify } from "jose";

// Authorization helper: verifies the JWT from cookies.
async function authorize(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return false;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error("Authorization failed:", error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();

    // Fetch all employees and populate the "letters" field.
    const employees = await Person.find({ role: "employee" }).populate(
      "letters",
    );

    // Filter employees:
    // 1. If an employee has no letters, it means no letter has been sent yet.
    // 2. If an employee has at least one letter with isSent === false, it's pending.
    const pendingEmployees = employees.filter((emp) => {
      // If there are no letters, then this employee is pending a letter.
      if (!emp.letters || emp.letters.length === 0) return true;

      // Otherwise, check if any letter is not sent.
      return emp.letters.some((letter: any) => letter.isSent === false);
    });

    // Optionally, format the data for the frontend.
    const data = pendingEmployees.map((emp) => ({
      id: emp._id,
      fullName: emp.fullName,
      letters: emp.letters, // includes all letter details; adjust as needed.
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching pending letters:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
