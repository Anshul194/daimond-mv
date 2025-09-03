
import dbConnect from '../../lib/mongodb.js';
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById
} from '../../controllers/subCategoryController.js';
import { NextResponse } from 'next/server';
import { verifyTokenAndUser } from '../../middlewares/commonAuth.js';

// Create SubCategory (Vendor: only for self, Superadmin: can specify or leave global)
export async function POST(request) {
  try {
    await dbConnect();
    const authResult = await verifyTokenAndUser(request, 'admin');
    if (authResult.error) return authResult.error;
    const admin = authResult.user;

    const form = await request.formData();
    // Vendors: force vendor field to their own ID
    if (admin.role === 'vendor') {
      form.set('vendor', (admin._id || admin.id).toString());
    }
    // Superadmins: allow vendor to be set, or leave null for global
    const result = await createSubCategory(form, admin);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /subcategory error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

// Get SubCategories (Vendor: only own, Superadmin: all, public allowed)
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
      admin = null;
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    // Vendors: only see their own subcategories
    if (admin && admin.role === 'vendor') {
      query.vendor = (admin._id || admin.id).toString();
    }
    // Superadmins: can filter by vendor if desired
    const result = await getSubCategories(query, admin);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /subcategory error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


