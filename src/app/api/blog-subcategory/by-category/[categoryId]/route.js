import dbConnect from '../../../../lib/mongodb.js';
import { getSubCategoriesByCategoryId } from '../../../../controllers/blogSubCategoryController.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Next.js 15 requires awaiting params
    const resolvedParams = await params;
    // console.log('🔧 Params received:', resolvedParams);

    const { categoryId } = resolvedParams || {};
    console.log('GET /blog-subcategory/by-category - received categoryId:', categoryId);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-access-token, x-refresh-token, cache-control, pragma, expires, if-modified-since'
    };

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'categoryId is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // console.log('GET /blog-subcategory/by-category - categoryId:', categoryId);
    const result = await getSubCategoriesByCategoryId(categoryId);
    try {
      const dataCount = result && result.body && result.body.data ? (Array.isArray(result.body.data) ? result.body.data.length : (result.body.data.docs ? result.body.data.docs.length : 0)) : 'unknown';
      console.log('GET /blog-subcategory/by-category - service returned status:', result.status, 'dataCount:', dataCount);
    } catch (e) {
      console.log('GET /blog-subcategory/by-category - result logging error:', e.message);
    }

    return NextResponse.json(result.body, { status: result.status, headers: corsHeaders });
  } catch (err) {
    // console.error('Route error:', err);
    // console.error('Route error stack:', err.stack);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-access-token, x-refresh-token, cache-control, pragma, expires, if-modified-since'
    };
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
