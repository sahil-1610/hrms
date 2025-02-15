export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HR from "@/models/Hr.model";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. "mycloudname"
  api_key: process.env.CLOUDINARY_API_KEY, // e.g. "123456789012345"
  api_secret: process.env.CLOUDINARY_API_SECRET, // e.g. "mysecretkey"
});

// Helper: Extract user ID from JWT in the Authorization header.
function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  console.log("Received auth header:", authHeader);
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
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
      // Convert the File (a Blob) to a Buffer.
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload the buffer to Cloudinary using the upload_stream API.
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(buffer);
      });
      updateData.profileImage = uploadResult.secure_url;
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
