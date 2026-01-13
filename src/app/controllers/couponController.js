import CouponService from '../services/couponService.js';
import { couponCreateValidator, couponUpdateValidator, couponValidationValidator } from '../validators/couponValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const couponService = new CouponService();

export async function createCoupon(request, user = null) {
  try {
    const data = await request.json();
    
    // Validate input data
    const { error, value } = couponCreateValidator.validate(data);
    if (error) {
      return Response.json({ 
        success: false, 
        message: 'Validation error', 
        details: error.details 
      }, { status: 400 });
    }

    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    // Check if coupon with same code already exists for this vendor
    const existingCoupon = await couponService.findByCode(value.code, vendorId);
    if (existingCoupon) {
      return Response.json({ 
        success: false, 
        message: "Coupon with this code already exists" 
      }, { status: 400 });
    }

    // Add vendor to data if vendorId exists
    if (vendorId) {
      value.vendor = vendorId;
    }

    const coupon = await couponService.createCoupon(value);
    const response = successResponse(coupon, 'Coupon created successfully');
    return Response.json(response.body, { status: response.status });
  } catch (err) {
    console.error('Create Coupon error:', err.message);
    return Response.json(errorResponse('Server error', 500), { status: 500 });
  }
}

export async function getCoupons(request, user = null) {
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

    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

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

    const coupons = await couponService.getCoupons(filterCon, sortCon, pageNum, limitNum, vendorId);
    const response = successResponse(coupons, 'Coupons fetched successfully');
    return Response.json(response.body, { status: response.status });
  } catch (err) {
    console.error('Get Coupons error:', err.message);
    return Response.json(errorResponse('Server error', 500), { status: 500 });
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

export async function updateCoupon(request, { params }, user = null) {
  try {
    const { id } = params;
    const data = await request.json();

    // Remove MongoDB internal fields that shouldn't be updated
    const fieldsToExclude = ['_id', '__v', 'createdAt', 'updatedAt'];
    
    // Clean empty fields and exclude internal fields
    const cleanedFields = Object.entries(data).reduce((acc, [key, value]) => {
      // Skip MongoDB internal fields
      if (fieldsToExclude.includes(key)) {
        return acc;
      }
      // Only include non-empty values
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Validate input data
    const { error, value } = couponUpdateValidator.validate(cleanedFields);
    if (error) {
      return Response.json({ 
        success: false, 
        message: 'Validation error', 
        details: error.details 
      }, { status: 400 });
    }

    // Check if coupon exists and belongs to vendor (if user is vendor)
    const existingCoupon = await couponService.getCouponById(id);
    if (!existingCoupon) {
      return Response.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    // If user is a vendor, check if coupon belongs to them
    if (user && user.role === 'vendor') {
      const vendorId = (user._id || user.id).toString();
      if (existingCoupon.vendor && existingCoupon.vendor.toString() !== vendorId) {
        return Response.json({ success: false, message: "Unauthorized access" }, { status: 403 });
      }
    }

    const coupon = await couponService.updateCoupon(id, value);
    if (!coupon) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    
    const response = successResponse(coupon, 'Coupon updated successfully');
    return Response.json(response.body, { status: response.status });
  } catch (err) {
    console.error('Update Coupon error:', err.message);
    return Response.json(errorResponse('Server error', 500), { status: 500 });
  }
}

export async function deleteCoupon(request, { params }, user = null) {
  try {
    const { id } = params;

    // Check if coupon exists and belongs to vendor (if user is vendor)
    const existingCoupon = await couponService.getCouponById(id);
    if (!existingCoupon) {
      return Response.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    // If user is a vendor, check if coupon belongs to them
    if (user && user.role === 'vendor') {
      const vendorId = (user._id || user.id).toString();
      if (existingCoupon.vendor && existingCoupon.vendor.toString() !== vendorId) {
        return Response.json({ success: false, message: "Unauthorized access" }, { status: 403 });
      }
    }

    const coupon = await couponService.deleteCoupon(id);
    if (!coupon) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    
    const response = successResponse(coupon, 'Coupon deleted successfully');
    return Response.json(response.body, { status: response.status });
  } catch (err) {
    console.error('Delete Coupon error:', err.message);
    return Response.json(errorResponse('Server error', 500), { status: 500 });
  }
}

export async function validateCouponAPI(request) {
  try {
    const data = await request.json();
    
    // Validate input data
    const { error, value } = couponValidationValidator.validate(data);
    if (error) {
      return Response.json({ 
        success: false, 
        message: 'Validation error', 
        details: error.details 
      }, { status: 400 });
    }

    const { code, orderTotal, userEmail } = value;
    const result = await couponService.validateCoupon(code, orderTotal, userEmail);
    return Response.json({ success: true, ...result });
  } catch (err) {
    console.error('Validate Coupon error:', err.message);
    return Response.json(errorResponse('Server error', 500), { status: 500 });
  }
}

export async function applyCouponToOrder(request) {
  try {
    const data = await request.json();
    
    // Validate input data
    const { error, value } = couponValidationValidator.validate(data);
    if (error) {
      return Response.json({ 
        success: false, 
        message: 'Validation error', 
        details: error.details 
      }, { status: 400 });
    }

    const { code, orderTotal } = value;
    const { discount, coupon, message } = await couponService.calculateCouponDiscount(code, orderTotal);
    
    if (!coupon) {
      return Response.json({ success: false, message: message || "Invalid coupon" }, { status: 400 });
    }
    
    return Response.json(successResponse({ discount, coupon }, 'Coupon applied successfully'));
  } catch (err) {
    console.error('Apply Coupon error:', err.message);
    return Response.json(errorResponse('Server error', 500), { status: 500 });
  }
}