import dbConnect from '../../lib/mongodb.js';
import {
  getAllBlogCategories,
  createBlogCategory,
} from '../../controllers/blogCategoryController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js'; // 👈 Import middleware

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getAllBlogCategories(query);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /blog-category error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


export async function POST(request) {
  await dbConnect();

  const authResult = await verifyAdminAccess(request); // 👈 Admin check
  if (authResult.error) return authResult.error;

  try {
    const form = await request.formData();
    const data = {
      name: form.get('name') || '',
      image: form.get('image') || null,
    };

    const result = await createBlogCategory(data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('Error in POST /blog-category:', err.message);
    return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
  }
}
