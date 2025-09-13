import Order from "../models/order";
import Product from "../models/Product";
import Admin from "../models/admin";
import User from "../models/User";
import OrderPaymentMeta from "../models/OrderPaymentMeta.js";

/**
 * 🔹 Simple Dashboard (common stats)
 */
export async function getDashboardStats() {
  try {
    const [totalOrders, totalSales, totalProducts, totalUsers, totalVendors] = await Promise.all([
      Order.countDocuments({}),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Product.countDocuments({}),
      User.countDocuments({}),
      Admin.countDocuments({ role: "vendor" }),
    ]);

    return {
      totalOrders,
      totalSales: totalSales[0]?.total || 0,
      totalProducts,
      totalUsers,
      totalVendors,
    };
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    throw new Error(err.message || "Server error");
  }
}

/**
 * 🔹 SuperAdmin Dashboard (detailed stats)
 */
export async function getSuperAdminDashboard() {
  try {
    // --- Vendors ---
    const totalVendors = await Admin.countDocuments({ role: "vendor" });
    const activeVendors = await Admin.countDocuments({ role: "vendor", isActive: true });
    const inactiveVendors = totalVendors - activeVendors;

    // --- Users ---
    const totalUsers = await User.countDocuments();

    // --- Orders ---
    const totalOrders = await Order.countDocuments();
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$order_status", count: { $sum: 1 } } }
    ]);

    // --- Revenue (from OrderPaymentMeta.total_amount) ---
    const totalRevenueAgg = await OrderPaymentMeta.aggregate([
      { $group: { _id: null, revenue: { $sum: "$total_amount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.revenue || 0;

    const monthlyRevenue = await OrderPaymentMeta.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      {
        $group: {
          _id: { year: { $year: "$order.createdAt" }, month: { $month: "$order.createdAt" } },
          revenue: { $sum: "$total_amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    // --- Products ---
    const totalProducts = await Product.countDocuments({ deletedAt: null });
    const activeProducts = await Product.countDocuments({ status: "active", deletedAt: null });
    const inactiveProducts = totalProducts - activeProducts;

    // --- Recent Vendors ---
    const recentVendors = await Admin.find({ role: "vendor" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username email storeName isActive createdAt");

    // --- Top Vendors by Orders ---
    const topVendors = await Order.aggregate([
      { $match: { vendor: { $ne: null } } },
      { $group: { _id: "$vendor", totalOrders: { $sum: 1 } } },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        }
      },
      { $unwind: "$vendor" },
      {
        $project: {
          _id: 0,
          vendorId: "$vendor._id",
          storeName: "$vendor.storeName",
          totalOrders: 1
        }
      }
    ]);

    // --- Vendor Stats (Product count + Revenue + Total Orders) ---
    const vendorStats = await Admin.aggregate([
      { $match: { role: "vendor" } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "vendor",
          as: "products"
        }
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "vendor",
          as: "orders"
        }
      },
      { $unwind: { path: "$orders", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "orderpaymentmetas",
          localField: "orders._id",
          foreignField: "order_id",
          as: "paymentMeta"
        }
      },
      { $unwind: { path: "$paymentMeta", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          storeName: { $first: "$storeName" },
          username: { $first: "$username" },
          name: { $first: "$name" },
          totalProducts: { $first: { $size: "$products" } },
          totalOrders: { $addToSet: "$orders._id" }, // collect unique order ids
          revenue: { $sum: "$paymentMeta.total_amount" }
        }
      },
      {
        $addFields: {
          totalOrders: { $size: "$totalOrders" }
        }
      }
    ]);

    return {
      vendors: { totalVendors, activeVendors, inactiveVendors, recentVendors, vendorStats },
      users: { totalUsers },
      products: { totalProducts, activeProducts, inactiveProducts },
      orders: { totalOrders, ordersByStatus },
      revenue: { totalRevenue, monthlyRevenue },
      topVendors
    };
  } catch (error) {
    console.error("SuperAdmin Dashboard Error:", error);
    throw new Error(error.message || "Server error");
  }
}


export async function getVendorDashboard(vendorId) {
  try {
    if (!vendorId) throw new Error("Vendor ID is required");

    // --- Products owned by vendor ---
    const totalProducts = await Product.countDocuments({ vendor: vendorId, deletedAt: null });
    const activeProducts = await Product.countDocuments({
      vendor: vendorId,
      status: "active",
      deletedAt: null,
    });
    const inactiveProducts = totalProducts - activeProducts;

    // --- Orders of vendor ---
    const totalOrders = await Order.countDocuments({ vendor: vendorId });
    const ordersByStatus = await Order.aggregate([
      { $match: { vendor: vendorId } },
      { $group: { _id: "$order_status", count: { $sum: 1 } } },
    ]);

    // --- Revenue for this vendor (from OrderPaymentMeta.total_amount) ---
    const totalRevenueAgg = await OrderPaymentMeta.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      { $match: { "order.vendor": vendorId } },
      { $group: { _id: null, revenue: { $sum: "$total_amount" } } },
    ]);

    const monthlyRevenue = await OrderPaymentMeta.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      { $match: { "order.vendor": vendorId } },
      {
        $group: {
          _id: { year: { $year: "$order.createdAt" }, month: { $month: "$order.createdAt" } },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    return {
      products: { totalProducts, activeProducts, inactiveProducts },
      orders: { totalOrders, ordersByStatus },
      revenue: {
        totalRevenue: totalRevenueAgg[0]?.revenue || 0,
        monthlyRevenue,
      },
    };
  } catch (error) {
    console.error("Vendor Dashboard Error:", error);
    throw new Error(error.message || "Server error");
  }
}