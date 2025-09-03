import dbConnect from '../../../lib/mongodb.js';
import {
  getBlogById,
  updateBlog,
  deleteBlog
} from '../../../controllers/blogController.js';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  await dbConnect();
  const result = await getBlogById(params.id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request, { params }) {
  await dbConnect();

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  const form = await request.formData();
  const result = await updateBlog(params.id, form);

  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(request, { params }) {
  await dbConnect();

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  const result = await deleteBlog(params.id);
  return NextResponse.json(result.body, { status: result.status });
}
