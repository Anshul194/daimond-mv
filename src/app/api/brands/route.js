import dbConnect from '../../lib/mongodb.js';
import {
  createBrand,
  getBrands,
} from '../../controllers/brandController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const form = await request.formData(); 
    const result = await createBrand(form); 

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /brands error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Extract query params from NextRequest
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    // Pass query to service
    const result = await getBrands(query);
    return NextResponse.json(result.body, { status: result.status });

  } catch (err) {
    console.error('GET /brands error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}