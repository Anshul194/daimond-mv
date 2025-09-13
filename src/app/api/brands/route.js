import dbConnect from '../../lib/mongodb.js';
import {
  createBrand,
  getBrands,
} from '../../controllers/brandController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';
import { verifyTokenAndUser } from '../../middlewares/commonAuth.js';
export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const form = await request.formData(); 
    const result = await createBrand(form, authResult.user); 

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /brands error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    let admin = null;
    let authResult = null;
    // Try to get token, but don't require it
    try {
      authResult = await verifyTokenAndUser(request, 'admin');
      if (!authResult.error) admin = authResult.user;
    } catch (e) {
      // Ignore auth errors for public access
      admin = null;
    }

    // Extract query params from NextRequest
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    console?.log('[DEBUG] Incoming query params:', query);
    console?.log('[DEBUG] Admin info:', admin);

    // Pass query to service
    const result = await getBrands(query, admin);
    return NextResponse.json(result.body, { status: result.status });

  } catch (err) {
    console.error('GET /brands error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}