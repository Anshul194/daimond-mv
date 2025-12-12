import { getProductAttributeByCategoryId, getProductAttributes } from "@/app/controllers/productAttributeController";
import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Extract query params from NextRequest
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const awaitedParams = await params;
    const categoryId = awaitedParams.category;

    // Validate categoryId if present
    if (categoryId && categoryId !== 'undefined' && mongoose.Types.ObjectId.isValid(categoryId)) {
      const result = await getProductAttributeByCategoryId(categoryId);
      console.log("Get Product Attribute by Category ID result:", result);
      return NextResponse.json(result.body, { status: result.status });
    }
    
    // If no valid categoryId, return all product attributes
    const result = await getProductAttributes(query);
    console.log("Get Product Attributes result:", result);

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error in GET /product-attributes:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
