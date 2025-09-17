import dbConnect from '../../lib/mongodb.js';
import { NextResponse } from 'next/server';
import { verifyTokenAndUser } from '../../middlewares/commonAuth.js';
import Order from '../../models/order.js';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Brand from '../../models/brand.js';
import Admin from '../../models/admin.js';
import User from '../../models/User.js';

export async function GET(request) {
  try {
    await dbConnect();
    const authResult = await verifyTokenAndUser(request, 'admin');
    if (authResult.error) return authResult.error;
    const admin = authResult.user;

    // Build filter for vendor if needed
    const vendorFilter = admin.role === 'vendor' ? { vendor: admin._id.toString() } : {};

    // Orders
    const totalOrders = await Order.countDocuments(vendorFilter);
    const pendingOrders = await Order.countDocuments({ ...vendorFilter, order_status: 'pending' });
    const completedOrders = await Order.countDocuments({ ...vendorFilter, order_status: 'completed' });

    // Products
    const totalProducts = await Product.countDocuments(vendorFilter);

    // Categories
    const totalCategories = await Category.countDocuments(vendorFilter);

    // Brands
    const totalBrands = await Brand.countDocuments(vendorFilter);

    // Users (only for superadmin)
    let totalUsers = 0;
    if (admin.role === 'superadmin') {
      totalUsers = await User.countDocuments();
    }

    // Vendors (only for superadmin)
    let totalVendors = 0;
    if (admin.role === 'superadmin') {
      totalVendors = await Admin.countDocuments({ role: 'vendor' });
    }

    // Revenue (sum of all paid orders)
    const paidOrders = await Order.aggregate([
      { $match: { ...vendorFilter, payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = paidOrders[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalProducts,
        totalCategories,
        totalBrands,
        totalUsers,
        totalVendors,
        totalRevenue
      }
    }, { status: 200 });
  } catch (err) {
    console.error('GET /dashboard error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
