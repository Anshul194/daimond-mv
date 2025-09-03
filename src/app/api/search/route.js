import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb.js';
import { unifiedSearchController } from '../../controllers/searchController.js';

export async function GET(request) {
  try {
    await dbConnect();

    // No access control needed here (public search)
    const result = await unifiedSearchController(request);

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error('GET /search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
