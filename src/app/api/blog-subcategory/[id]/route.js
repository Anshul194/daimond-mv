import dbConnect from '../../../lib/mongodb.js';
import {
  getBlogSubCategoryById,
  updateBlogSubCategory,
  deleteBlogSubCategory,
} from '../../../controllers/blogSubCategoryController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;
  const result = await getBlogSubCategoryById(id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request, { params }) {
  await dbConnect();

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  const form = await request.formData();
  const name = form.get('name');
  const BlogCategory = form.get('BlogCategory');
  const image = form.get('image');
  const status = form.get('status');

  const { id } = await params;
  const result = await updateBlogSubCategory(id, { name, BlogCategory, image, status });
  return NextResponse.json(result.body, { status: result.status });
}


export async function DELETE(request, { params }) {
  await dbConnect();

  const authResult = await verifyAdminAccess(request);
  if (authResult.error) return authResult.error;

  const { id } = await params;
  const result = await deleteBlogSubCategory(id);
  return NextResponse.json(result.body, { status: result.status });
}
