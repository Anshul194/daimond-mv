
import dbConnect from '../../lib/mongodb.js';
import {
  createProduct,
  getProducts,
} from '../../controllers/productController.js';
import { NextResponse } from 'next/server';
import { withUser } from '../../middleware/withUser.js';

export async function POST(request) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    if (error) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    // Check Content-Length to provide better error for large files
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
       console.warn(`[WARNING] Large payload detected (${(contentLength / 1024 / 1024).toFixed(1)}MB). Next.js Route Handlers have a 10MB limit.`);
    }

    // Use arrayBuffer and manual conversion to bypass the 10MB smart-parser limit
    const buffer = await request.arrayBuffer();
    const contentType = request.headers.get('content-type');
    
    // Reconstruct as a Blob then get FormData
    const blob = new Blob([buffer], { type: contentType });
    // Use the native Response's formData parser on the blob instead of the request
    const form = await new Response(blob, { headers: { 'content-type': contentType } }).formData();
    
    const result = await createProduct(form, user);
    return NextResponse.json({ body: result.body }, { status: result.status });
  } catch (err) {
    console.error('POST /product error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request', error: err ? (err.message || err.toString()) : 'Unknown error' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    // Connect to database first
    try {
      await dbConnect();
      // console.log('Database connected successfully for /product');
    } catch (dbError) {
      // console.error('Database connection error in /product:', dbError.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection string and ensure MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 503 }); // 503 Service Unavailable for connection issues
    }

    const { user } = await withUser(request, 'admin');
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    // console.log('GET /product - Query params:', query);
    const result = await getProducts(query, user);
    // console.log('GET /product - Result:', { status: result.status, bodyKeys: Object.keys(result.body || {}) });
    // Return with body wrapper to match frontend expectation: response.data.body.data.docs
    return NextResponse.json({ body: result.body }, { status: result.status });
  } catch (err) {
    // console.error('GET /product error:', err);
    // console.error('GET /product error message:', err.message);
    // console.error('GET /product error stack:', err.stack);
    
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
