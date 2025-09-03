import dbConnect from '../../../lib/mongodb.js';
import { validateCouponAPI } from '../../../controllers/couponController.js';

export async function POST(request) {
  try {
    await dbConnect();
    return await validateCouponAPI(request);
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}