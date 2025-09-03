import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb.js'; // adjust path if needed
import { getBlogsBySubCategoryId } from '../../../../../controllers/blogController.js'; // adjust path if needed

export async function GET(req, { params }) {
  await dbConnect();
  const result = await getBlogsBySubCategoryId(params.id);
  return NextResponse.json(result.body, { status: result.status });
}
