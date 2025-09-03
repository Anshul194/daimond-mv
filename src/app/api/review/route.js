// app/api/review/route.js
import dbConnect from '../../lib/mongodb.js';
import {
  createReview,
  getReviews
} from '../../controllers/reviewController.js';
import { NextResponse } from 'next/server';
import { verifyUserAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyUserAccess(request);
    if (authResult.error) return authResult.error;

    const { user } = authResult;
    const result = await createReview(request, user.id);

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
