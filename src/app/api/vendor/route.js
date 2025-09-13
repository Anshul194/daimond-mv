import dbConnect from '../../lib/mongodb.js';
import { getAllVendors } from '../../controllers/vendorController.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const result = await getAllVendors(query);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /vendor error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
