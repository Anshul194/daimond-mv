import dbConnect from '../../../lib/mongodb.js';
import {
  getSizeById,
  updateSize,
  deleteSize,
} from '../../../controllers/sizeController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  await dbConnect();
  const { id } = await context.params;
  const result = await getSizeById(id);
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

    const data = await request.json();

    const result = await updateSize(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /size/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();

    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;
    const { id } = await context.params; // Correct: await context.params

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const result = await deleteSize(id, admin.id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /size/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
