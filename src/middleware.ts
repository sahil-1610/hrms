// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  try {
    const secretString = process.env.JWT_SECRET as string;
    if (!secretString) {
      throw new Error("JWT_SECRET is not defined");
    }
    const secret = new TextEncoder().encode(secretString);

    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
}

// Updated matcher configuration:
// This pattern applies middleware to all routes except those starting with
// "auth/", "api/auth/", "api/recruitment/", "recruitment/jobapply", "_next/", "static/", "favicon.ico"
// and any route ending with .png, .jpg, .jpeg, .svg, or .gif.
export const config = {
  matcher: [
    "/((?!.*\\.(?:png|jpg|jpeg|svg|gif)$|auth/|api/auth/|api/recruitment/|recruitment/jobapply|_next/|static/|favicon\\.ico).*)",
  ],
};
