import dbConnect from "../../../lib/mongodb";
import { getSuperAdminDashboard } from "../../../controllers/dashboardController";
import { verifyTokenAndUser } from "../../../middlewares/commonAuth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    // ✅ Auth check: only superadmin allowed
    const authResult = await verifyTokenAndUser(request, "admin");
    if (authResult.error || authResult.user.role !== "superadmin") {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 403 }
      );
    }

    const data = await getSuperAdminDashboard();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("SuperAdmin Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
