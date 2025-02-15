export const runtime = "nodejs"; // Ensure Node.js runtime

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Create a response that indicates sign out was successful.
    const response = NextResponse.json(
      { message: "Sign out successful." },
      { status: 200 },
    );

    // Clear the cookie by setting it to an empty string and expiring it immediately.
    // Adjust the cookie name ("token") if needed.
    response.cookies.set("token", "", { expires: new Date(0) });
    return response;
  } catch (error: any) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { message: "Error signing out", error: error.message },
      { status: 500 },
    );
  }
}
