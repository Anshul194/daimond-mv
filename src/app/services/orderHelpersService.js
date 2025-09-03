import OrderRepository from "../repository/orderRepository.js";
import AppError from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import coupon from "../models/coupon.js";

function calculatePrice(base, taxRate, context = "product") {
  if (context === "shipping") {
    return base + (base * taxRate) / 100;
  }
  return base;
}

class orderHelpersService {
  //getCartContent
  async getCartContent(requestBody, type) {
    // Expecting cart to be sent in the body
    return requestBody.cart || [];
  }

  async groupCartByVendor(cartItems) {
    return cartItems.reduce((acc, item) => {
      const vendorId = item.options?.vendor_id || "admin";
      if (!acc[vendorId]) acc[vendorId] = [];
      acc[vendorId].push(item);
      return acc;
    }, {});
  }

  async getShippingTaxRate() {
    // You can make this dynamic from DB or config
    return 10; // Example: 10% tax
  }

  async calculateShippingCost(shippingCost, taxRate) {
    const result = { admin: null, vendor: [] };
    if (shippingCost.admin) {
      result.admin = {
        cost: calculatePrice(shippingCost.admin.cost, taxRate, "shipping"),
      };
    }

    if (Array.isArray(shippingCost.vendor)) {
      result.vendor = shippingCost.vendor.map((v) => ({
        vendor_id: v.vendor_id,
        cost: calculatePrice(v.cost, taxRate, "shipping"),
      }));
    }

    return result;
  }
  //   async calculatePrice(base, taxRate, context = "product") {
  //     if (context === "shipping") {
  //       return base + (base * taxRate) / 100;
  //     }
  //     return base;
  //   }

  async determineTaxType(body, type) {
    if (type === "pos") return "zone_wise_tax";
    return "billing_address"; // default fallback
  }

  async calculateTax(cart, body, type, taxType) {
    const taxMap = {};
    if (taxType === "billing_address") {
      for (const item of cart) {
        taxMap[item.id] =
          (item.price * (item.options?.tax_options_sum_rate || 0)) / 100;
      }
    } else if (taxType === "inclusive_price") {
      for (const item of cart) {
        taxMap[item.id] =
          item.price -
          item.price / (1 + (item.options?.tax_options_sum_rate || 0) / 100);
      }
    } else {
      taxMap.percentage = 10; // Zone-wise fixed rate for example
    }
    return taxMap;
  }

  async calculateCoupon(body, totalAmount, cart, type = "DISCOUNT") {
    if (!body.coupon) return 0;

    //save userdata in session
    const userData = await User.findOne({ email: body.email });
    if (!userData) return 0;

    const Coupon = await coupon.findOne({ code: body.coupon });
    if (!Coupon) return 0;

    userData.usedCoupons.push(Coupon._id);
    await userData.save();

    if (Coupon.type === "percentage") {
      return totalAmount * (Coupon.value / 100) > Coupon.maxDiscount
        ? Coupon.maxDiscount
        : totalAmount * (Coupon.value / 100);
    } else {
      return totalAmount - Coupon.value > Coupon.maxDiscount
        ? Coupon.maxDiscount
        : totalAmount - Coupon.value;
    }

    // Simulate discount logic
    return totalAmount * 0.1; // 10% coupon discount
  }

  async generateUniqueOrderNumber(orderId) {
    return `ORD-${Date.now()}-${orderId.toString().slice(-4)}`;
  }

  async updateInventory(orderId) {
    // Simulated inventory update
    console.log(`Inventory updated for order ${orderId}`);
  }

  async updateUserWallet(userId, amount, orderId) {
    // Simulated wallet deduction
    console.log(
      `Wallet updated for user ${userId} on order ${orderId}, amount: ${amount}`
    );
  }
}

export default orderHelpersService;
