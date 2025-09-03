// pages/api/product/[id].js or /app/api/product/[id]/route.js
import dbConnect from "../../../../lib/mongodb.js";
import {
  updateProduct,
  getProductById,
  deleteProduct,
} from "../../../../controllers/productController.js";
import { NextResponse } from "next/server";
import { verifyAdminAccess } from "../../../../middlewares/commonAuth.js";

export async function PUT(request, context) {
  try {
    await dbConnect();

    // ✅ Extract params properly
    const { params } = context;
    const { id } = params;

    // ✅ Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    console.log("PUT /product/:id called with ID:", id);

    // ✅ Detect and parse content-type
    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      data = await request.formData();
    } else if (contentType.includes("application/json")) {
      const rawBody = await request.text();
      if (!rawBody) throw new Error("Empty JSON body");

      const json = JSON.parse(rawBody);
      const formData = new FormData();
      Object.entries(json).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      data = formData;
    } else {
      throw new Error(`Unsupported content-type: ${contentType}`);
    }

    // ✅ Call the controller
    const result = await updateProduct(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.log("Error in PUT /product/:id:", err);
    console.error("Update Product error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
        errors: err.errors || {},
      },
      { status: err.statusCode || 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const awaitedParams = await params;
    console.log(" new GET /product/:id called with params:", awaitedParams);
    const { id, slug, categorySlug } = awaitedParams; // Added categorySlug
    const result = await getProductById(id, slug, categorySlug);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("GET /product/:id error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const awaitedParams = await params;
    const { id } = awaitedParams;

    const result = await deleteProduct(id);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("DELETE /product/:id error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
