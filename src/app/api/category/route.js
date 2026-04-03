
import dbConnect from '../../lib/mongodb.js';
import {
  createCategory,
  getCategories,
  getCategoryById
} from '../../controllers/categoryController.js';
import { NextResponse } from 'next/server';
import { verifyTokenAndUser } from '../../middlewares/commonAuth.js';

// Create Category (Vendor: only for self, Superadmin: can specify or leave global)
export async function POST(request) {
  try {
    await dbConnect();
    const authResult = await verifyTokenAndUser(request, 'admin');
    if (authResult.error) return authResult.error;
    const admin = authResult.user;

    const form = await request.formData();
    // Vendors: force vendor field to their own ID
    if (admin.role === 'vendor') {
      form.set('vendor', admin._id.toString());
    }
    // Superadmins: allow vendor to be set, or leave null for global
    const result = await createCategory(form, admin);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    // console.error('POST /category error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

// Get Categories (Vendor: only own, Superadmin: all)
export async function GET(request) {
  try {
    // Connect to database first
    try {
      await dbConnect();
      // console.log('Database connected successfully for /category');
    } catch (dbError) {
      // console.error('Database connection error in /category:', dbError.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection string and ensure MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 503 }); // 503 Service Unavailable for connection issues
    }

    let admin = null;
    let authResult = null;
    // Try to get token, but don't require it
    try {
      authResult = await verifyTokenAndUser(request, 'admin');
      if (!authResult.error) admin = authResult.user;
    } catch (e) {
      // Ignore auth errors for public access
      // console.log('Auth check skipped (public access):', e.message);
      admin = null;
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    // console.log('GET /category - Query params:', query);

    // Vendors: only see their own categories
    if (admin && admin.role === 'vendor') {
      query.vendor = (admin._id || admin.id).toString();
    }
    // Superadmins: can filter by vendor if desired
    const result = await getCategories(query, admin);
    // console.log('GET /category - Result:', { status: result.status, bodyKeys: Object.keys(result.body || {}) });
    // Return with body wrapper to match frontend expectation: response.data.body.data.result
    return NextResponse.json({ body: result.body }, { status: result.status });
  } catch (err) {
    // console.error('GET /category error:', err);
    // console.error('GET /category error message:', err.message);
    // console.error('GET /category error stack:', err.stack);
    
    // Check if it's a database connection error
    if (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('MongoDB connection'))) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}


