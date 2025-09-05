import dbConnect from '../../lib/mongodb.js';
import {
  createTaxClassOption,
  getTaxClassOptions,
} from '../../controllers/taxClassOptionController.js';
import { NextResponse } from 'next/server';
import { withUser } from '../../middleware/withUser.js';

export async function POST(request) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    if (error) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const result = await createTaxClassOption(data, user);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /tax-class-option error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    
    // If auth fails, return unauthorized
    if (error) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getTaxClassOptions(query, user);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /tax-class-option error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
