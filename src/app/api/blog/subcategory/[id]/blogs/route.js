import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb.js'; // adjust path if needed
import { getBlogsBySubCategoryId } from '../../../../../controllers/blogController.js'; // adjust path if needed

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;
  const result = await getBlogsBySubCategoryId(id);
  return NextResponse.json(result.body, { status: result.status });
}
