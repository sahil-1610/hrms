export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create a redirect response to the sign-in page.
    const response = NextResponse.redirect(new URL("/auth/signin", req.url));
    // Clear the "token" cookie by setting it to an empty string and expiring it immediately.
    response.cookies.set("token", "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error: any) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { message: "Error signing out", error: error.message },
      { status: 500 },
    );
  }
}
