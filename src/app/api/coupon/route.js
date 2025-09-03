import dbConnect from '../../lib/mongodb.js';
import { createCoupon, getCoupons } from '../../controllers/couponController.js';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult?.error) return authResult.error;
    return await createCoupon(request);
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    return await getCoupons(request);
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}