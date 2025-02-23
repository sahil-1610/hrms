// File: /app/api/employees/[employeeid]/activities/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import authorize from "@/utils/authorize";

export async function POST(
  req: NextRequest,
  { params }: { params: { employeeid: string } },
) {
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  try {
    await dbConnect();
    const { type, description, performance } = await req.json();
    const person = await Person.findById(params.employeeid);
    if (!person) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 },
      );
    }
    const newActivity = {
      id: Date.now(),
      date: new Date(),
      type,
      description,
      performance,
    };

    // Ensure activities is defined before pushing a new activity:
    if (!person.activities) {
      person.activities = [];
    }
    person.activities.push(newActivity);
    // Add the new activity
    person.activities.push(newActivity);
    // Recalculate overall performance
    const total = person.activities.reduce(
      (acc, curr) => acc + curr.performance,
      0,
    );
    const avg = total / person.activities.length;
    if (person.employeeData) {
      person.employeeData.performanceScore = avg.toFixed(1);
    } else {
      person.employeeData = { performanceScore: avg.toFixed(1) };
    }
    await person.save();
    return NextResponse.json({
      success: true,
      data: { newActivity, performanceScore: avg.toFixed(1) },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
