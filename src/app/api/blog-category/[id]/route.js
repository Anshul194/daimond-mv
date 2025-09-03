import dbConnect from '../../../lib/mongodb.js';
import {
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} from '../../../controllers/blogCategoryController.js';
import { NextResponse } from 'next/server';
// import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';


export async function GET(request, context) {
  await dbConnect();

  const { id } = context.params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
  }

  const result = await getBlogCategoryById(id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request, context) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { id } = context.params;

    const form = await request.formData();
    const data = {
      name: form.get('name') || '',
      image: form.get('image') || null, // File object or null
    };

    const result = await updateBlogCategory(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /blog-category/:id error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const result = await deleteBlogCategory(id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /blog-category/:id error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Delete failed' }, { status: 400 });
  }
}
