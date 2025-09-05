import dbConnect from '../../../../lib/mongodb.js';
import {
  getTaxClassOptionsByClassId,
} from '../../../../controllers/taxClassOptionController.js';
import { NextResponse } from 'next/server';
import { withUser } from '../../../../middleware/withUser.js';

export async function GET(request, context) {
  try {
    await dbConnect();
    const { user } = await withUser(request, 'admin');
    
    const { classId } = await context.params;
    const result = await getTaxClassOptionsByClassId(classId, user);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /tax-class-option/class/[classId] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
