import dbConnect from "../../../lib/mongodb.js";
import { NextResponse } from "next/server";
import { getOrderById, cancelOrder } from "../../../controllers/orderController.js";

export async function GET(request, context) {
  await dbConnect();

  const params = await context.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing order ID" },
      { status: 400 }
    );
  }

  try {
    const result = await getOrderById(id);
    console.log('getOrderById result:', result);
    const status = (result.status >= 200 && result.status <= 599) ? result.status : 500;
    return NextResponse.json(result.body, { status });
  } catch (error) {
    console.error('Route handler error (GET):', error.message, error.stack);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  await dbConnect();

  const params = await context.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing order ID" },
      { status: 400 }
    );
  }

  try {
    const result = await cancelOrder(id);
    console.log('cancelOrder result:', result);
    const status = (result.status >= 200 && result.status <= 599) ? result.status : 500;
    return NextResponse.json(result.body, { status });
  } catch (error) {
    console.error('Route handler error (PUT):', error.message, error.stack);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}