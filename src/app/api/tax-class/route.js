import dbConnect from '../../lib/mongodb.js';
import {
  createTaxClass,
  getTaxClasses,
} from '../../controllers/taxClassController.js';
import { NextResponse } from 'next/server';
import { withUser } from '../../middleware/withUser.js';

export async function POST(request) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    if (error) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const result = await createTaxClass(data, user);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /tax-class error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { user } = await withUser(request, 'admin');

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getTaxClasses(query, user);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /tax-class error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

