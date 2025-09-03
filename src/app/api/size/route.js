import dbConnect from '../../lib/mongodb.js';
import {
  createSize,
  getSizes,
} from '../../controllers/sizeController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const result = await createSize(body);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /size error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getSizes(query);
    return NextResponse.json(result.body, { status: result.status });

  } catch (err) {
    console.error('GET /size error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}