import dbConnect from '../../lib/mongodb.js';
import { getActiveTaxClassWithOptions } from '../../controllers/taxClassController.js';
import { NextResponse } from 'next/server';
import { verifyTokenAndUser } from '../../middlewares/commonAuth.js';

export async function GET(request) {
  try {
    await dbConnect();

    let user = null;
    let authResult = null;
    // Try to get token, but don't require it
    try {
      authResult = await verifyTokenAndUser(request, 'admin');
      if (!authResult.error) user = authResult.user;
    } catch (e) {
      // Ignore auth errors for public access
      user = null;
    }

    const taxClass = await getActiveTaxClassWithOptions(user);
    return NextResponse.json(taxClass.body, { status: taxClass.status });
  }
  catch (err) {
    console.error('GET /tax-class/active error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  } 
  }
