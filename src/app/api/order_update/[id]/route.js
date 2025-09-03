import dbConnect from "../../../lib/mongodb.js";
import { NextResponse } from "next/server";
import { verifyAdminAccess } from "../../../middlewares/commonAuth.js";
import updateOrderById from "../../../services/OrderService.js";

export async function PUT(request, context) {
  await dbConnect();

 
  const { params } = context;

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  const { id } = params; 

  if (!id) {
    return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ success: false, message: "No update data provided" }, { status: 400 });
    }

    const result = await updateOrderById(id, body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Update order error:", error.message, error.stack);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
