import dbConnect from '../../../lib/mongodb.js';
import { getCouponById, updateCoupon, deleteCoupon } from '../../../controllers/couponController.js';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, context) {
  try {
    await dbConnect();
    return await getCouponById(request, context);
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult?.error) return authResult.error;
    return await updateCoupon(request, context);
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult?.error) return authResult.error;
    return await deleteCoupon(request, context);
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}