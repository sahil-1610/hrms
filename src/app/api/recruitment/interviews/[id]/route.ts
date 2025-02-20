// /app/api/interviews/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview.model";

// GET: Retrieve a specific interview by its ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  try {
    const interview = await Interview.findById(params.id);
    if (!interview) {
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: interview },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// PATCH: Update an interview (for example, marking it as completed)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  try {
    const updateData = await req.json();
    // Example: updateData could be { status: "completed" }
    const interview = await Interview.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!interview) {
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: interview },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// DELETE: Cancel an interview (delete it from the database)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  try {
    const interview = await Interview.findByIdAndDelete(params.id);
    if (!interview) {
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, message: "Interview cancelled successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
