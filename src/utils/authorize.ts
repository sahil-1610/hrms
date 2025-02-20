import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
// Helper function to authorize requests from cookies.

export default async function authorize(req: NextRequest): Promise<boolean> {
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
