import dbConnect from '../../../lib/mongodb.js';
import { getCouponById, updateCoupon, deleteCoupon } from '../../../controllers/couponController.js';
import { NextResponse } from 'next/server';
import { withUser } from '../../../middleware/withUser.js';

export async function GET(request, context) {
  try {
    await dbConnect();
    return await getCouponById(request, context);
  } catch (err) {
    console.error('GET /coupon/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    if (error) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    return await updateCoupon(request, context, user);
  } catch (err) {
    console.error('PUT /coupon/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { user, error } = await withUser(request, 'admin');
    if (error) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    return await deleteCoupon(request, context, user);
  } catch (err) {
    console.error('DELETE /coupon/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}