import dbConnect from '../../../lib/mongodb.js';
import {
  getReviewById,
  updateReview,
  deleteReview,
} from '../../../controllers/reviewController.js';
import { NextResponse } from 'next/server';
import { verifyUserAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  await dbConnect();

  const id = (await context?.params)?.id;
  if (!id) {
    return NextResponse.json({ success: false, message: "Missing review ID" }, { status: 400 });
  }

  const result = await getReviewById(id);
  return NextResponse.json(result.body, { status: result.status });
}


export async function PUT(request, context) {
  try {
    await dbConnect();
    const authResult = await verifyUserAccess(request);
    if (authResult.error) return authResult.error;

    const { user } = authResult;
     const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const form = await request.formData();
    const data = {
      rating: form.get('rating') ? parseInt(form.get('rating')) : null,
      comment: form.get('comment') || '',
      product: form.get('product') || null,
      targetType: form.get('targetType') || null,
      isWebsiteReview: form.get('isWebsiteReview') === 'true',
      images: form.getAll('images') || [],
    };

    console.log('🔧 Incoming update data:', data);
    console.log('👤 User ID:', user.id);

    const result = await updateReview(id, data, user.id);
    console.log('✅ Update result:', result);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /review/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed', error: err.message }, { status: 500 });
  }
}


export async function DELETE(request, context) {
  try {
    await dbConnect();
    const authResult = await verifyUserAccess(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const params = await context.params;

    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    console.log(`🗑️ Attempting to delete review with ID: ${params.id} by user ID: ${user.id}`);

    const result = await deleteReview(params.id, user.id);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('🔥 DELETE /review/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}

