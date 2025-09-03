import dbConnect from '../../../../lib/mongodb.js';
import {
  getTaxClassOptionsByClassId,
} from '../../../../controllers/taxClassOptionController.js';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  try {
    await dbConnect();
    
    const { classId } = await context.params;
    const result = await getTaxClassOptionsByClassId(classId);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /tax-class-option/class/[classId] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
