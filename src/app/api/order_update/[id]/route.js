import dbConnect from "../../../lib/mongodb.js";
import { NextResponse } from "next/server";
import { verifyAdminAccess } from "../../../middlewares/commonAuth.js";
import OrderService from "../../../services/OrderService.js"; // import the class

const orderService = new OrderService(); // create instance

export async function PUT(request, context) {
  await dbConnect();

  const { params } = await context; // ✅ await context
  const { id } = params;

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided" },
        { status: 400 }
      );
    }

    // ✅ use service instance
    const result = await orderService.updateOrderById(id, body);

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Update order error:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
