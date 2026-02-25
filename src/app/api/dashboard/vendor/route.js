import dbConnect from "../../../lib/mongodb";
import { getVendorDashboard } from "../../../controllers/dashboardController";
import { verifyTokenAndUser } from "../../../middlewares/commonAuth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    // ✅ Auth check: only vendor allowed
    const authResult = await verifyTokenAndUser(request, "admin");

    console.log('[Debug Vendor Dashboard] Auth Result:', {
      error: !!authResult.error,
      userParams: authResult.user ? {
        id: authResult.user._id,
        role: authResult.user.role,
        email: authResult.user.email
      } : 'No User'
    });

    if (authResult.error || authResult.user.role !== "vendor") {
      console.log('[Debug Vendor Dashboard] Access Denied. Role mismatch or Auth error.');
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const vendorId = authResult.user._id;
    const data = await getVendorDashboard(vendorId);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Vendor Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
