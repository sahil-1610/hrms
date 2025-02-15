// src/app/api/auth/signin/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HR from "@/models/Hr.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password." },
        { status: 400 },
      );
    }

    // Find the HR admin by email.
    const hrAdmin = await HR.findOne({ email });
    if (!hrAdmin) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, hrAdmin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    // Generate a JWT token containing basic user info.
    const token = jwt.sign(
      { id: hrAdmin._id, email: hrAdmin.email, name: hrAdmin.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    console.log("Generated token:", token);

    return NextResponse.json(
      { message: "Sign in successful.", token },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { message: "Error signing in", error: error.message },
      { status: 500 },
    );
  }
}
