import dbConnect from '../../lib/mongodb.js';
import {
  createCategory,
  getCategories,
  getCategoryById
} from '../../controllers/categoryController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const form = await request.formData(); 
    const result = await createCategory(form); 

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /category error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // ✅ Extract query params from NextRequest
    const { searchParams } = new URL(request.url);

    const query = Object.fromEntries(searchParams.entries());

    // ✅ Fix: Pass query to service
    const result = await getCategories(query);
    return NextResponse.json(result.body, { status: result.status });

  } catch (err) {
    console.error('GET /category error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


