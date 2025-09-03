import dbConnect from '../../../lib/mongodb.js';
import {
  getColorCodeById,
  updateColorCode,
  deleteColorCode,
} from '../../../controllers/colorCodeController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  await dbConnect();
   
   const { id } = await context.params;
 
  const result = await getColorCodeById(id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request, context) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;
    const { id } = await context.params;

    let body = {};
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid or empty JSON body' }, { status: 400 });
    }

    const data = {
      name: body.name || '',
      colorCode: body.colorCode || '',
    };

    const result = await updateColorCode(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /colorcode/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}



// DELETE ColorCode - Admin Only
export async function DELETE(request, context) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;
    const params = await context.params;

    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const result = await deleteColorCode(params.id, admin.id);

    // Make sure status is a valid HTTP status code (e.g., 200, 404, 500)
    const status = result.status && result.status >= 200 && result.status < 600 ? result.status : 500;

    return NextResponse.json(result.body, { status });
  } catch (err) {
    console.error('DELETE /colorcode/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
