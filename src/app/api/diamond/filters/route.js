import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Diamond from "@/app/models/diamond";

export async function GET() {
  try {
    await dbConnect();

    // Query distinct values directly from the database to ensure dropdowns always match inventory
    const [clarities, colors, cuts, shapes] = await Promise.all([
      Diamond.distinct("clarity"),
      Diamond.distinct("color"),
      Diamond.distinct("cut"),
      Diamond.distinct("shape"),
    ]);

    // Clean up empty, null values and sort ascending
    const cleanArray = (arr) => arr.filter(Boolean).filter(val => val.trim() !== "").sort();

    return NextResponse.json(
      {
        success: true,
        data: {
          clarity: cleanArray(clarities),
          color: cleanArray(colors),
          cut: cleanArray(cuts),
          shape: cleanArray(shapes),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/diamond/filters error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
