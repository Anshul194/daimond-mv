import OrderService from "../services/OrderService.js";
import CouponService from "../services/couponService.js";
import { successResponse, errorResponse } from "../utils/response.js";
import initRedis from "../config/redis.js";

const orderService = new OrderService();
const couponService = new CouponService();
const redis = initRedis();

export async function createOrder(body, type) {
  console.log(
    "Controller: Creating order with body:",
    JSON.stringify(body, null, 2),
    "and type:",
    type
  );
  try {
    const result = await orderService.createOrder(body, type);
    console.log(
      "Controller: Order creation result:",
      JSON.stringify(result, null, 2)
    );
    return successResponse(result, 201);
  } catch (err) {
    console.log(
      "Controller: Error creating order:",
      JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
    );
    console.error("Controller: Error creating order:", err.message, err.stack);
    return errorResponse("Failed to create order", 500, err.message);
  }
}

export async function getOrdersByUserId(user_id) {
  try {
    const orders = await orderService.getOrdersByUserId(user_id);
    if (!orders || orders.length === 0) {
      return successResponse([], 200, "No orders found for this user");
    }
    return successResponse(orders, 200);
  } catch (err) {
    console.error("Error fetching orders:", err.message, err.stack);
    return errorResponse("Failed to fetch orders", 500, err.message);
  }
}

export async function getOrderById(id) {
  try {
    if (!id) {
      return {
        body: { success: false, message: "Order ID is required" },
        status: 400,
      };
    }
    const response = await orderService.getOrderById(id);
    return {
      body: {
        success: true,
        message: "Order fetched successfully",
        data: response,
      },
      status: 200,
    };
  } catch (err) {
    console.error("getOrderById error:", err.message, err.stack);
    let statusCode = 500;
    if (err.message === "Invalid order ID format") {
      statusCode = 400;
    } else if (err.message === "Order not found") {
      statusCode = 404;
    }
    return {
      body: { success: false, message: err.message || "Failed to fetch order" },
      status: statusCode,
    };
  }
}

export async function getAllOrders(query) {
  try {
    const response = await orderService.getAllOrders(query);
    return {
      body: {
        success: true,
        message: "Orders fetched successfully",
        data: response,
      },
      status: 200,
    };
  } catch (err) {
    console.error("getAllOrders error:", err.message, err.stack);
    return {
      body: {
        success: false,
        message: err.message || "Failed to fetch orders",
      },
      status: 500,
    };
  }
}

export async function cancelOrder(id) {
  try {
    if (!id) {
      return {
        body: { success: false, message: "Order ID is required" },
        status: 400,
      };
    }
    const response = await orderService.cancelOrder(id);
    return {
      body: {
        success: true,
        message: "Order canceled successfully",
        data: response,
      },
      status: 200,
    };
  } catch (err) {
    console.error("cancelOrder error:", err.message, err.stack);
    let statusCode = 500;
    if (err.message === "Invalid order ID format") {
      statusCode = 400;
    } else if (err.message === "Order not found") {
      statusCode = 404;
    } else if (err.message === "Order already canceled") {
      statusCode = 400;
    }
    return {
      body: {
        success: false,
        message: err.message || "Failed to cancel order",
      },
      status: statusCode,
    };
  }
}

export async function applyCouponToOrder(request) {
  try {
    const { code, orderTotal } = await request.json();
    if (!code || typeof orderTotal !== "number") {
      return Response.json(
        { success: false, message: "couponCode and orderTotal are required" },
        { status: 400 }
      );
    }
    const coupon = await couponService.getCouponByCode(code);
    if (!coupon || !coupon.isActive) {
      return Response.json(
        { success: false, message: "Invalid or inactive coupon" },
        { status: 400 }
      );
    }
    const now = new Date();
    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validTo)) {
      return Response.json(
        { success: false, message: "Coupon not valid at this time" },
        { status: 400 }
      );
    }
    if (orderTotal < coupon.minOrderAmount) {
      return Response.json(
        {
          success: false,
          message: `Minimum order amount is ${coupon.minOrderAmount}`,
        },
        { status: 400 }
      );
    }
    let discount = 0;
    if (coupon.type === "flat") {
      discount = coupon.value;
    } else if (coupon.type === "percentage") {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }
    return Response.json({ success: true, discount, coupon });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
