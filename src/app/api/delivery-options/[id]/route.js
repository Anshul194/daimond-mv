import dbConnect from '../../../lib/mongodb.js';
import {
  getDeliveryOptionById,
  updateDeliveryOption,
  deleteDeliveryOption,
} from '../../../controllers/deliveryOptionController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  await dbConnect();

  const params = await context.params; 
  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
  }

  const result = await getDeliveryOptionById(id);
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
      title: form.get('title') || '',
      sub_title: form.get('sub_title') || '',
      icon: form.get('icon') || null,
      status: form.get('status') || 'active',
    };

    const result = await updateDeliveryOption(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /delivery-options/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

// DELETE DeliveryOption - Admin Only


export async function DELETE(request, context) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;

    const params = await context.params;  

    if (!params?.id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    console.log('Service deleteDeliveryOption called with:', params.id);

    const result = await deleteDeliveryOption(params.id, admin.id);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /delivery-options/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
