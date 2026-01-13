import { getProductAttributeByCategoryId, getProductAttributes } from "@/app/controllers/productAttributeController";
import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Category from "@/app/models/Category.js";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Extract query params from NextRequest
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const awaitedParams = await params;
    const categoryParam = awaitedParams.category;

    // If category parameter is provided
    if (categoryParam && categoryParam !== 'undefined') {
      let categoryId = categoryParam;

      // If it's not a valid ObjectId, treat it as a slug and look up the category
      if (!mongoose.Types.ObjectId.isValid(categoryParam)) {
        const category = await Category.findOne({
          slug: categoryParam,
          deletedAt: null,
        }).lean();
        
        if (!category) {
          return NextResponse.json(
            { success: false, message: "Category not found" },
            { status: 404 }
          );
        }
        
        categoryId = category._id.toString();
      }

      const result = await getProductAttributeByCategoryId(categoryId);
      console.log("Get Product Attribute by Category ID result:", result);
      return NextResponse.json(result.body, { status: result.status });
    }
    
    // If no category parameter, return all product attributes
    const result = await getProductAttributes(query);
    console.log("Get Product Attributes result:", result);

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error in GET /product-attributes:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
