// src/app/api/employees/pending-letters/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import "@/models/Letter.model";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const employees = await Person.find({ role: "employee" })
      .populate("letters")
      .exec();

    // For each employee, filter the letters to include only unsent ones.
    const pendingEmployees = employees
      .map((employee) => {
        if (!employee.letters) return null;
        // Filter out letters that have been sent
        const unsentLetters = employee.letters.filter(
          (letter: any) => letter.isSent === false,
        );
        // If no pending letter remains, exclude this employee.
        if (unsentLetters.length === 0) return null;
        return {
          ...employee.toObject(),
          letters: unsentLetters, // Only include unsent letters
        };
      })
      .filter((employee) => employee !== null);

    return NextResponse.json(pendingEmployees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees with pending letters:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
