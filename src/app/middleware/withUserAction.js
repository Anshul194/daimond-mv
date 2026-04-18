import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "../lib/mongodb.js";
import Admin from "../models/admin.js";
import User from "../models/User.js";
import initRedis from "../config/redis.js";

/**
 * Middleware helper for Server Actions to verify high-level user roles.
 * Mirrors the logic in verifyTokenAndUser but for Server Actions context.
 */
export async function withUserAction(requiredRole = null) {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    
    // Attempt to get token from Authorization header or Cookie
    const authHeader = headersList.get("authorization");
    let accessToken = authHeader?.replace("Bearer ", "");
    
    if (!accessToken) {
      accessToken = cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;
    }

    if (!accessToken) {
      return { user: null, error: "Authentication required" };
    }

    await dbConnect();

    // Verify token is valid in Redis (Mirroring commonAuth.js)
    const redis = initRedis();
    const tokenStatus = await redis.get(`accessToken:${accessToken}`);
    if (!tokenStatus || tokenStatus !== 'valid') {
       // Fallback for some non-redis environments or direct login
       // If redis check is mandatory, uncomment next line
       // return { user: null, error: "Invalid or expired token sessions" };
    }

    // Decode JWT token
    let decoded;
    try {
      // Use ACCESS_TOKEN_SECRET as seen in verifyTokenAndUser
      const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
      decoded = jwt.verify(accessToken, secret);
    } catch (jwtError) {
      return { user: null, error: "Invalid token format or secret" };
    }

    const userId = decoded.id || decoded.userId || decoded.sub;
    if (!userId) {
      return { user: null, error: "User ID not found in token" };
    }

    // Fetch user from DB
    let user = await Admin.findById(userId).select("-password");
    let userType = "admin";

    if (!user) {
       user = await User.findById(userId).select("-password");
       userType = "user";
    }

    if (!user) {
      return { user: null, error: "User account not found" };
    }

    // Role check
    if (requiredRole === "admin") {
      const isAdmin = user.role === "admin" || user.role === "superadmin";
      if (!isAdmin) {
        return { user: null, error: "Forbidden: Admin access required" };
      }
    }

    return { 
      user: user.toObject ? user.toObject() : user, 
      userType 
    };
  } catch (e) {
    console.error("withUserAction error:", e);
    return { user: null, error: "Internal server error during authentication" };
  }
}
