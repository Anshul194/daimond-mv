import { getUsers } from "@/app/controllers/userController.js";
import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    // ✅ Extract query params from NextRequest
    const { searchParams } = new URL(request.url);

    const query = Object.fromEntries(searchParams.entries());

    // ✅ Fix: Pass query to service
    const result = await getUsers(query);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("GET /user error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
