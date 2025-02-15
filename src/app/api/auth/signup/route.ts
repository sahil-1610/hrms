// app/api/auth/signup/route.ts
export const runtime = "nodejs"; // Ensure Node.js runtime for Node-specific modules

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HR from "@/models/Hr.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { name, email, password, invitationCode } = await request.json();
    console.log("Received signup payload:", {
      name,
      email,
      password,
      invitationCode,
    });

    if (!name || !email || !password || !invitationCode) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    // Connect to the database
    await dbConnect();

    // Validate the invitation code
    if (invitationCode !== process.env.INVITATION_CODE) {
      return NextResponse.json(
        { message: "Invalid invitation code." },
        { status: 403 },
      );
    }

    // Prevent multiple HR admin accounts if one exists
    // const adminExists = await HR.findOne({});
    // if (adminExists) {
    //   return NextResponse.json(
    //     { message: "HR admin account already exists. Signup is restricted." },
    //     { status: 403 },
    //   );
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new HR admin account
    const newAdmin = new HR({
      name,
      email,
      phone: "", // Optional field; update later in the HR profile
      password: hashedPassword,
      profileImage: "", // Optional field; update later as needed
    });

    const savedAdmin = await newAdmin.save();

    // Return a success message without generating a token.
    return NextResponse.json(
      {
        message:
          "HR admin account created successfully. Please sign in to generate a token.",
        data: savedAdmin,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "Error creating HR admin account.",
        error: error.message || error,
      },
      { status: 400 },
    );
  }
}
