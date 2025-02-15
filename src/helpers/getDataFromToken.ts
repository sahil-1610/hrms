import type { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the user ID (assumed to be in the token payload as `id`) or null.
 */
export function getDataFromToken(req: NextApiRequest): string | null {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    // Expected header format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    // Check that decoded is an object and contains the id property
    if (decoded && typeof decoded === "object" && "id" in decoded) {
      return decoded.id as string;
    }
    return null;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}
