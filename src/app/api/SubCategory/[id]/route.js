import dbConnect from '../../../lib/mongodb.js';
import {getSubCategoryById,updateSubCategory,deleteSubCategory,} from '../../../controllers/subCategoryController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  await dbConnect();
  const { params } = context;
  const { id } = params;
  const result = await getSubCategoryById(id);
  return NextResponse.json(result.body, { status: result.status });
}

// export async function PUT(request, context) {
//   try {
//     await dbConnect();

//     // Verify admin access
//     const authResult = await verifyAdminAccess(request);
//     if (authResult.error) return authResult.error;

//     const { user: admin } = authResult;
//     // const { id } = await context.params;
//     const id = context?.params?.id;
// if (!id) return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });


//     const form = await request.formData();
//     const data = {
//       name: form.get('name') || '',
//       category: form.get('category') || '',
//       description: form.get('description') || '',
//       image: form.get('image') || null,
//       status: form.get('status') || 'active',

//     };

//     const result = await updateSubCategory(id, data);
//     return NextResponse.json(result.body, { status: result.status });
//   } catch (err) {
//     console.error('PUT /subcategory/:id error:', err);
//     return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
//   }
// }

export async function PUT(request, context) {
  try {
    await dbConnect();

    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;

    // Await params here:
    const { id } = await context.params;
    if (!id) return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });

    const form = await request.formData();
    const data = {
      name: form.get('name') || '',
      category: form.get('category') || '',
      description: form.get('description') || '',
      image: form.get('image') || null,
      status: form.get('status') || 'active',
    };

    const result = await updateSubCategory(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /subcategory/:id error:', err);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}




// DELETE Subcategory - Admin Only
export async function DELETE(request, context) {
  try {
    await dbConnect();

    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const { user: admin } = authResult;

    // Await params here:
    const params = await context.params;

    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: 'ID param missing' }, { status: 400 });
    }

    const result = await deleteSubCategory(params.id, admin.id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /subcategory/:id error:', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}


