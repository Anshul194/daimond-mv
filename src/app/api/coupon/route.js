import dbConnect from '../../lib/mongodb.js';
import { createCoupon, getCoupons } from '../../controllers/couponController.js';
import { NextResponse } from 'next/server';
import { withUser } from '../../middleware/withUser.js';

export async function POST(request) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    if (error) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const result = await createCoupon(request, user);
    return result;
  } catch (err) {
    console.error('POST /coupon error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { user } = await withUser(request, 'admin');
    
    const result = await getCoupons(request, user);
    return result;
  } catch (err) {
    console.error('GET /coupon error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}