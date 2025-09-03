import dbConnect from '../../../lib/mongodb.js';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../../../controllers/categoryController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  await dbConnect();
  const { params } = context;
  const { id } = params;
  const result = await getCategoryById(id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request, context) {
  try {
    await dbConnect();

    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;
    const { id } = await context.params;


    const form = await request.formData();
    const data = {
      name: form.get('name') || '',
      description: form.get('description') || '',
      image: form.get('image') || null,
      status: form.get('status') || 'active', // Default to 'active' if not provided 
     
    };

    const result = await updateCategory(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /category/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

// DELETE Category - Admin Only
export async function DELETE(request, context) {
  try {
    await dbConnect();

    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;
    const params = await context.params;

    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const result = await deleteCategory(params.id, admin.id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /category/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}