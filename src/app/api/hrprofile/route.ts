export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HR from "@/models/Hr.model";
import jwt from "jsonwebtoken";
import { uploadImageFile } from "@/utils/cloudinary";

// Helper: Extract user ID from token stored in cookies or in the Authorization header.
function getUserIdFromRequest(req: NextRequest): string | null {
  // Try to get the token from cookies first.
  const tokenFromCookie = req.cookies.get("token")?.value;
  let token = tokenFromCookie;

  // If token is not found in cookies, try the Authorization header.
  if (!token) {
    const authHeader = req.headers.get("authorization");
    //console.log("Received auth header:", authHeader);
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    return decoded.id;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * GET /api/hrprofile
 * Retrieves the HR profile for the authenticated user.
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const hrProfile = await HR.findById(userId);
    if (!hrProfile) {
      return NextResponse.json(
        { success: false, message: "HR profile not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: hrProfile },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/hrprofile
 * Updates the HR profile for the authenticated user.
 * Expects multipart/form-data with text fields and an optional file field "profileImage".
 * The file is uploaded to Cloudinary, and its URL is saved as profileImage.
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse the FormData from the request.
    const formData = await req.formData();

    // Extract text fields.
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const position = formData.get("position")?.toString() || "";
    const department = formData.get("department")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const about = formData.get("about")?.toString() || "";

    const updateData: Record<string, any> = {
      name,
      email,
      phone,
      position,
      department,
      experience,
      about,
    };

    // If a file is provided under "profileImage", process it.
    const file = formData.get("profileImage");
    if (file && file instanceof File) {
      // Use the helper function to upload the image.
      const uploadResult = await uploadImageFile(file);
      updateData.profileImage = uploadResult.url;
    }

    const updated = await HR.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "HR profile not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
