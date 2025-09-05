import CouponRepository from '../repository/couponRepository.js';
import User from '../models/User.js';

class CouponService {
  constructor() {
    this.repo = new CouponRepository();
  }

  async createCoupon(data) {
    return this.repo.create(data);
  }

  async getCoupons(filter = {}, sort = {}, page, limit, vendorId = null) {
    // Add vendor filter if vendorId is provided
    const filterConditions = { ...filter };
    if (vendorId) {
      filterConditions.vendor = vendorId;
    }
    return this.repo.getAllCoupons(filterConditions, sort, page, limit);
  }

  async getCouponById(id) {
    return this.repo.findById(id);
  }

  async getCouponByCode(code, vendor = null) {
    return this.repo.findByCode(code, vendor);
  }

  async findByCode(code, vendor = null) {
    return this.repo.findByCode(code, vendor);
  }

  async updateCoupon(id, data) {
    return this.repo.update(id, data);
  }

  async deleteCoupon(id) {
    return this.repo.delete(id);
  }

  async validateCoupon(code, orderTotal, userEmail) {
    // For validation, check across all vendors initially
    const coupon = await this.repo.findByCodeForValidation(code);
    if (!coupon || !coupon.isActive || coupon.deletedAt) {
      return { valid: false, coupon: null, message: "Invalid or inactive coupon" };
    }
    
    const now = new Date();
    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validTo)) {
      return { valid: false, coupon, message: "Coupon not valid at this time" };
    }
    
    if (orderTotal < coupon.minOrderAmount) {
      return { valid: false, coupon, message: `Minimum order amount is ${coupon.minOrderAmount}` };
    }

    // Check user exists by email and check coupon is used by user
    const user = await User.findOne({ email: userEmail });
    
    if (user && user.usedCoupons.includes(coupon.id)) {
      return { valid: false, coupon, message: "Coupon already used" };
    }
    
    return { valid: true, coupon };
  }

  async calculateCouponDiscount(code, orderTotal) {
    const { valid, coupon, message } = await this.validateCoupon(code, orderTotal);
    if (!valid) {
      return { discount: 0, coupon, message };
    }
    let discount = 0;
    if (coupon.type === "flat") {
      discount = coupon.value;
    } else if (coupon.type === "percentage") {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }
    discount = Math.min(discount, orderTotal);
    return { discount, coupon };
  }
}

export default CouponService;