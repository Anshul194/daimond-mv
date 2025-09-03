import dbConnect from '../../../../lib/mongodb.js';
import { getSubCategoriesByCategoryId } from '../../../../controllers/blogSubCategoryController.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    console.log('🔧 Params received:', params);

    const { categoryId } = params;

    const result = await getSubCategoriesByCategoryId(categoryId);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
