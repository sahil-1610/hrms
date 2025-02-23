export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import "@/models/Letter.model";
import "@/models/Vacancy.model";
import authorize from "@/utils/authorize";
import { uploadImageFile } from "@/utils/cloudinary";

// GET: Fetch a single employee (by ID) along with its letters.
export async function GET(
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
    const employee = await Person.findById(params.employeeid)
      .populate("letters", "vacancy")
      .exec();

    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 },
      );
    }
    // console.log(employee);
    return NextResponse.json(
      { success: true, data: employee },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// DELETE: Remove an employee by ID.
export async function DELETE(
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
    const deletedEmployee = await Person.findByIdAndDelete(params.employeeid);
    if (!deletedEmployee) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, message: "Employee deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// PUT: Update an employee (only allowed on Person fields, not letters, vacancy, or baseletetter).
export async function PUT(
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
    const formData = await req.formData();
    const updateData: any = {};

    // Loop through formData entries. If profileImage is a file, upload it.
    for (const [key, value] of formData.entries()) {
      if (key === "profileImage" && value instanceof File) {
        const uploadResult = await uploadImageFile(value);
        updateData.profileImage = uploadResult.url;
      } else {
        updateData[key] = value;
      }
    }

    // Exclude fields that should not be updated.
    const { letters, vacancy, baseletetter, activities, ...allowedUpdates } =
      updateData;

    const updatedEmployee = await Person.findByIdAndUpdate(
      params.employeeid,
      allowedUpdates,
      { new: true },
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: updatedEmployee },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
