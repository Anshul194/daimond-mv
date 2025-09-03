import dbConnect from '../../lib/mongodb.js';
import { addToCart, getCart } from '../../controllers/cartController.js';
import { NextResponse } from 'next/server';
import { verifyUserAccess } from '../../middlewares/commonAuth.js'; // Assuming you have user auth middleware

export async function POST(request) {
  try {
    await dbConnect();
    const authResult = await verifyUserAccess(request);
    if (authResult.error) return authResult.error;

    const form = await request.formData();
    const result = await addToCart(form);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /cart error:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const authResult = await verifyUserAccess(request);
    if (authResult.error) return authResult.error;

    const userId = authResult.userId; // Assume userId is extracted from auth middleware
    const result = await getCart(userId);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /cart error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}