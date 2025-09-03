// pages/api/faq/[id].js or /app/api/faq/[id]/route.js
import dbConnect from '../../../lib/mongodb.js';
import {
  getFaqById,
  updateFaq,
  deleteFaq,
} from '../../../controllers/faqController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';



export async function PUT(request, { params }) {
  await dbConnect();

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  const awaitedParams = await params;  // await here
  const { id } = awaitedParams;

  const data = await request.json();
  const result = await updateFaq(id, data);

  return NextResponse.json(result.body, { status: result.status });
}


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const result = await getFaqById(id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /faq/:id error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const awaitedParams = await params;
    const { id } = awaitedParams;

    const result = await deleteFaq(id);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /faq/:id error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

