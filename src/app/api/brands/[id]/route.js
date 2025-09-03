
import dbConnect from '../../../lib/mongodb.js';
import {
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../../../controllers/brandController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';


export async function GET(request, context) {
  await dbConnect();

  const params = await context.params;  // <-- await here
  const id = params.id;

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
  }

  const result = await getBrandById(id);
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
      title: form.get('title') || '',
      description: form.get('description') || '',
      logo: form.get('logo') || null,
    };

    const result = await updateBrand(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /brands/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

// DELETE Brand - Admin Only
export async function DELETE(request, context) {
  try {
    await dbConnect();

    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;
    const { params } = await context;


    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const result = await deleteBrand(params.id, admin.id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /brands/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
