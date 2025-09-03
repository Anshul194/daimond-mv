import dbConnect from '../../../lib/mongodb.js';
import {
  getTaxClassOptionById,
  updateTaxClassOption,
  deleteTaxClassOption,
} from '../../../controllers/taxClassOptionController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  try {
    await dbConnect();
    
    const { id } = await context.params;
    const result = await getTaxClassOptionById(id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /tax-class-option/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { id } = await context.params;
    const data = await request.json();
    
    const result = await updateTaxClassOption(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /tax-class-option/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { id } = await context.params;
    const result = await deleteTaxClassOption(id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /tax-class-option/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
