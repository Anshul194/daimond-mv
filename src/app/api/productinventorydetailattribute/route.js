import dbConnect from "../../lib/mongodb.js";
import ProductInventoryDetailAttribute from "../../models/ProductInventoryDetailAttribute.js";
import { NextResponse } from "next/server";

// GET - Fetch inventory detail attributes by product_id or inventory_details_id
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");
    const inventoryDetailsId = searchParams.get("inventory_details_id");

    let query = { deletedAt: null };

    if (productId) {
      query.product_id = productId;
    }

    if (inventoryDetailsId) {
      query.inventory_details_id = inventoryDetailsId;
    }

    if (!productId && !inventoryDetailsId) {
      return NextResponse.json(
        { success: false, message: "product_id or inventory_details_id is required" },
        { status: 400 }
      );
    }

    const attributes = await ProductInventoryDetailAttribute.find(query).lean();

    return NextResponse.json({
      success: true,
      message: "Inventory detail attributes fetched successfully",
      data: attributes,
    });
  } catch (err) {
    console.error("GET /productinventorydetailattribute error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

