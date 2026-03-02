import dbConnect from '../../lib/mongodb.js';
import {
  createReview,
  getReviews
} from '../../controllers/reviewController.js';
import { NextResponse } from 'next/server';
import { verifyAnyUserAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAnyUserAccess(request);
    const user = authResult.user;
    const result = await createReview(request, user ? user.id : null);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /review error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getReviews(query);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /review error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
