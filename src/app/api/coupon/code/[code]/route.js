import dbConnect from '../../../../lib/mongodb.js';
import CouponRepository from '../../../../repository/couponRepository.js';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const repo = new CouponRepository();
    const coupon = await repo.findByCode(params.code);
    if (!coupon) {
      return Response.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    return Response.json({ success: true, coupon });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}