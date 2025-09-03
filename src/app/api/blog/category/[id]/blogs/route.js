import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb.js';
import { getBlogsByCategoryId } from '../../../../../controllers/blogController.js';

export async function GET(req, { params }) {
  await dbConnect();
  const result = await getBlogsByCategoryId(params.id);
  return NextResponse.json(result.body, { status: result.status });
}
