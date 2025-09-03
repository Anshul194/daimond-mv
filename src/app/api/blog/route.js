import dbConnect from '../../lib/mongodb.js';
import { createBlog, getAllBlogs } from '../../controllers/blogController.js';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await dbConnect();

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Expected multipart/form-data' },
        { status: 400 }
      );
    }

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const form = await request.formData(); // Only if content-type is correct
    const result = await createBlog(form);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /blogs error:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}


export async function GET(request) {
  await dbConnect();

  const result = await getAllBlogs(request);
  return NextResponse.json(result.body, { status: result.status });
}
