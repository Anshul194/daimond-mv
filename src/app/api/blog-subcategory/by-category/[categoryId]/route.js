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
    
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'categoryId is required' },
        { status: 400 }
      );
    }

    // console.log('GET /blog-subcategory/by-category - categoryId:', categoryId);
    const result = await getSubCategoriesByCategoryId(categoryId);
    // console.log('GET /blog-subcategory/by-category - Result:', { status: result.status });

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    // console.error('Route error:', err);
    // console.error('Route error stack:', err.stack);
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
