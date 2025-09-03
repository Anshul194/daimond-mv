import dbConnect from "../../lib/mongodb.js";
import {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
} from "../../controllers/orderController.js";
import { NextResponse } from "next/server";
import { verifyAdminAccess } from "../../middlewares/commonAuth.js";
// import  verifyAdminAccess  from '../../middlewares/commonAuth.js';
import { parseNestedFormData } from "../../utils/parseNestedFormData.js";
import { errorResponse } from "@/app/utils/response.js";

// GET - Fetch all attributes or single by ID

export async function POST(req) {
  try {
    await dbConnect();

    // const authResult = await verifyAdminAccess(request);
    // if (authResult.error) return authResult.error;

    const body = await req.json();
    const type = body.type || null;
    const result = await createOrder(body, type);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("POST /subcategory error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    // Optional: Enable this if admin access is required
    // const authResult = await verifyAdminAccess(req);
    // if (authResult.error) return authResult.error;

    // Extract user_id from query parameters
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin");
    const user_id = searchParams.get("user_id");

    // Admin: get all orders with filters and pagination
    if (isAdmin === "true") {
      //pass all query parameters for filtering/pagination
      const query = Object.fromEntries(searchParams.entries());
      const result = await getAllOrders(query);
      return NextResponse.json(result, { status: 200 });
    }

    // User: get orders by user_id
    if (!user_id) {
      return NextResponse.json(errorResponse("user_id is required", 400), {
        status: 400,
      });
    }

    const result = await getOrdersByUserId(user_id);

    return NextResponse.json(result.body, { status: 200 });
  } catch (err) {
    console.error("GET /orders error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}

// PUT - Update attribute
export async function PUT(request) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;
    console.log("Admin access verified", authResult);

    const { user: admin } = authResult;
    console.log("Admin authenticated:", admin);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID parameter is required" },
        { status: 400 }
      );
    }

    const contentType = request.headers.get("content-type");
    let data = {};

    // Handle both JSON and FormData
    if (contentType?.includes("application/json")) {
      data = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = parseNestedFormData(formData);
      console.log("Parsed form data for update:", data);
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported content type. Use application/json or multipart/form-data",
        },
        { status: 415 }
      );
    }

    // Add metadata
    data.lastModifiedBy = {
      id: admin?.id?.toString() || "admin-id", // Replace with actual admin ID from auth
      email: admin.email,
      name: admin.name,
      timestamp: new Date(),
    };

    const result = await updateProductAttribute(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("PUT /product-attributes error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
    );
  }
}

// DELETE - Soft delete attribute
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID parameter is required" },
        { status: 400 }
      );
    }

    const result = await deleteProductAttribute(id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("DELETE /product-attributes error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
