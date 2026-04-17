import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb.js';
import { getBlogsByCategoryByIdentifier } from '../../../../../controllers/blogController.js';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;
  const result = await getBlogsByCategoryByIdentifier(id);
  return NextResponse.json(result.body, { status: result.status });
}
