import CouponService from '../services/couponService.js';
const couponService = new CouponService();

export async function createCoupon(request) {
  try {
    const data = await request.json();
    if (!data.code || !data.type || !data.value || !data.validFrom || !data.validTo) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const coupon = await couponService.createCoupon(data);
    return Response.json({ success: true, coupon });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function getCoupons(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filters
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build filter conditions (add exact filters like type, isActive)
    const filterCon = {};
    if (filters.type) filterCon.type = filters.type;
    if (filters.isActive) filterCon.isActive = filters.isActive === 'true';

    // Search: Apply partial match on coupon `code`
    if (search) {
      filterCon.code = { $regex: search, $options: 'i' };
    }

    // Sorting
    const sortCon = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const coupons = await couponService.getCoupons(filterCon, sortCon, pageNum, limitNum);
    return Response.json({ success: true, ...coupons });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function getCouponById(request, { params }) {
  try {
    const { id } = params;
    const coupon = await couponService.getCouponById(id);
    if (!coupon) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, coupon });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function getCouponByCode(request, { params }) {
  try {
    const { code } = params;
    const coupon = await couponService.getCouponByCode(code);
    if (!coupon) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, coupon });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function updateCoupon(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const coupon = await couponService.updateCoupon(id, data);
    if (!coupon) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, coupon });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function deleteCoupon(request, { params }) {
  try {
    const { id } = params;
    const coupon = await couponService.deleteCoupon(id);
    if (!coupon) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, message: "Coupon deleted", coupon });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function validateCouponAPI(request) {
  try {
    const { code, orderTotal,userEmail } = await request.json();
    if (!code || typeof orderTotal !== "number") {
      return Response.json({ success: false, message: "code and orderTotal are required" }, { status: 400 });
    }
    const result = await couponService.validateCoupon(code, orderTotal,userEmail);
    return Response.json({ success: true, ...result });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function applyCouponToOrder(request) {
    try {
        const { code, orderTotal } = await request.json();
        if (!code || typeof orderTotal !== "number") {
            return Response.json({ success: false, message: "code and orderTotal are required" }, { status: 400 });
        }
        const { discount, coupon, message } = await couponService.calculateCouponDiscount(code, orderTotal);
        if (!coupon) {
            return Response.json({ success: false, message: message || "Invalid coupon" }, { status: 400 });
        }
        return Response.json({ success: true, discount, coupon });
    } catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}