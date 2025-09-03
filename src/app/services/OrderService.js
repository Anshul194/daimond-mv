import OrderRepository from "../repository/orderRepository.js";
import AppError from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";
import dbConnect from "../lib/mongodb.js";
import Order from "../models/order.js";
import OrderAddress from "../models/OrderAddress.js";
import SubOrder from "../models/SubOrder.js";
import SubOrderItem from "../models/SubOrderItem.js";
import OrderTrack from "../models/OrderTrack.js";
import OrderPaymentMeta from "../models/OrderPaymentMeta.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import orderHelpersService from "./orderHelpersService.js";
import mongoose from "mongoose";
import generateInvoicePdf from "../lib/generateInvoice.js";
import OrderSession from "../models/OrderSession.js";

function calculatePrice(base, taxRate, context = "product") {
  if (context === "shipping") {
    return base + (base * taxRate) / 100;
  }
  return base;
}

const orderHelpersServices = new orderHelpersService();

class OrderService {
  constructor() {
    this.repo = new OrderRepository();
  }

  async createOrder(body, type) {
    console.log(
      "Service: Creating order with body:",
      JSON.stringify(body, null, 2),
      "and type:",
      type
    );
    try {
      await dbConnect();

      console.log("Order Data ====>  :", body);
      // ✅ Add this block to check/create user
      console.log("Service: Checking or creating user by email:", body.email);
      let user = await User.findOne({ email: body.email });
      if (!user) {
        console.log(
          `No user found with email ${body.email}, creating new user...`
        );
        user = await User.create({
          email: body.email,
          name: body.name || "Guest User",
          phone: body.phone || "",
          password: "default123",
          role: "user",
          status: "active",
        });
        console.log("Service: New user created with ID:", user._id);
      }
      body.user_id = user._id;

      console.log(
        "Service: Mongoose connection state:",
        mongoose.connection.readyState
      );
      if (mongoose.connection.readyState !== 1) {
        throw new AppError(
          "Database connection failed",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (!mongoose.models.User) {
        console.error(
          "Service: User model is not registered. Available models:",
          Object.keys(mongoose.models)
        );
        throw new AppError(
          "User model not found",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      console.log("Service: Fetching cart content");
      const cartContent = await orderHelpersServices.getCartContent(body, type);
      console.log(
        "Service: Cart content:",
        JSON.stringify(cartContent, null, 2)
      );
      const groupedCart = await orderHelpersServices.groupCartByVendor(
        cartContent
      );
      console.log(
        "Service: Grouped cart:",
        JSON.stringify(groupedCart, null, 2)
      );
      let totalAmount = 0;
      let totalShippingCharge = 0;
      let shippingCostData = {};
      if (type !== "pos") {
        console.log("Service: Fetching shipping tax rate");
        const taxRate = await orderHelpersServices.getShippingTaxRate();
        console.log("Service: Tax rate:", taxRate);
        shippingCostData = await orderHelpersServices.calculateShippingCost(
          body.shipping_cost,
          taxRate
        );
        console.log(
          "Service: Shipping cost data:",
          JSON.stringify(shippingCostData, null, 2)
        );
        for (const sc of shippingCostData.vendor || []) {
          totalShippingCharge += calculatePrice(sc.cost, taxRate, "shipping");
        }
        totalShippingCharge += calculatePrice(
          shippingCostData.admin?.cost || 0,
          taxRate,
          "shipping"
        );
        console.log("Service: Total shipping charge:", totalShippingCharge);
      }
      console.log(
        "Service: Creating Order with data:",
        JSON.stringify(
          { ...body, order_status: "pending", payment_status: "unpaid" },
          null,
          2
        )
      );

      const order = await Order.create({
        ...body,
        // invoice_url: invoice,
        order_status: "pending",
        payment_status: "unpaid",
        tax_id:
          body.tax_id && mongoose.Types.ObjectId.isValid(body.tax_id)
            ? new mongoose.Types.ObjectId(body.tax_id)
            : null,
      });

      const orderSession = await OrderSession.findById(body.orderSessionId)
        .populate("customerDetails.country")
        .populate("customerDetails.state")
        .populate("customerDetails.city")
        .populate("tax_id");

      console.log("Service: OrderSession found: ===>", orderSession);
      const invoice = await generateInvoicePdf({
        customerData: orderSession.customerDetails,
        orderId: order._id,
        date: new Date().toLocaleDateString(),
        items: orderSession.cartItems,
        total: orderSession.totalAmount,
        taxPer: orderSession.tax_id?.rate || 0,
        tax: orderSession.tax,
      });

      await order.updateOne({
        invoice_url: invoice,
      });
      console.log("Service: Order created:", order._id);
      order.order_number = await orderHelpersServices.generateUniqueOrderNumber(
        order._id
      );
      await order.save();
      console.log("Service: Order number assigned:", order.order_number);
      const orderAddress = await OrderAddress.create({
        ...body,
        order_id: order._id,
      });
      console.log("Service: OrderAddress created:", orderAddress._id);
      await OrderTrack.create({
        order_id: order._id,
        name: "ordered",
        updated_by: body.user_id || null,
        table: "users",
      });
      console.log("Service: OrderTrack created");
      const taxType = await orderHelpersServices.determineTaxType(body, type);
      console.log("Service: Tax type:", taxType);
      const taxProducts = await orderHelpersServices.calculateTax(
        cartContent,
        body,
        type,
        taxType
      );
      console.log(
        "Service: Tax products:",
        JSON.stringify(taxProducts, null, 2)
      );
      let totalTaxAmount = 0;
      if (!groupedCart || Object.keys(groupedCart).length === 0) {
        console.error(
          "Service: Cart content:",
          JSON.stringify(cartContent, null, 2)
        );
        console.error(
          "Service: Grouped cart:",
          JSON.stringify(groupedCart, null, 2)
        );
        throw new Error("No cart items found or cart grouping failed");
      }
      for (const [vendorId, items] of Object.entries(groupedCart)) {
        console.log(
          `Service: Processing vendor ${vendorId} with ${items.length} items`
        );
        let subOrderTotal = 0;
        let subTaxAmount = 0;
        let subShippingCost =
          type !== "pos"
            ? vendorId
              ? shippingCostData.vendor?.find((v) => v.vendor_id === vendorId)
                  ?.cost || 0
              : shippingCostData.admin?.cost || 0
            : 0;
        const orderItems = items.map((item) => {
          console.log(
            "Service: Processing item:",
            JSON.stringify(item, null, 2)
          );
          const taxAmount = taxProducts[item.id] || 0;
          const price = item.price * item.qty;
          totalAmount += price;
          subOrderTotal += price;
          totalTaxAmount += taxAmount * item.qty;
          subTaxAmount += taxAmount * item.qty;
          return {
            order_id: order._id,
            product_id: item.id,
            diamond_id: item.diamond_id ? item.diamond_id : null, // Handle diamond_id as ObjectId
            variant: item.options?.variant || {}, // Handle variant as JSON
            quantity: item.qty,
            price: item.price,
            sale_price: item.options?.regular_price || 0,
            tax_amount: taxAmount,
            tax_type: taxType,
            type: item.options?.type || "product",
            order_data: item.options,
          };
        });
        console.log(
          "Service: Order items for vendor:",
          JSON.stringify(orderItems, null, 2)
        );
        if (taxType === "zone_wise_tax") {
          subTaxAmount = (subOrderTotal * (taxProducts.percentage || 0)) / 100;
        }
        const subOrder = await SubOrder.create({
          order_id: order._id,
          vendor_id: vendorId || null,
          total_amount: subOrderTotal,
          shipping_cost: subShippingCost,
          tax_amount: subTaxAmount,
          tax_type: taxType,
          order_address_id: orderAddress._id,
          order_number: Date.now(),
          payment_status: "unpaid",
          order_status: "pending",
        });
        console.log("Service: SubOrder created:", subOrder._id);
        const subOrderItems = await SubOrderItem.insertMany(
          orderItems.map((item) => ({ ...item, sub_order_id: subOrder._id }))
        );
        console.log(
          `Service: SubOrderItems created: ${subOrderItems.length} items`
        );
      }
      const couponAmount = await orderHelpersServices.calculateCoupon(
        body,
        totalAmount,
        cartContent
      );
      console.log("Service: Coupon amount:", couponAmount);
      const subTotalAfterDiscount = totalAmount - couponAmount;
      if (taxType === "zone_wise_tax") {
        totalTaxAmount =
          (subTotalAfterDiscount * (taxProducts.percentage || 0)) / 100;
      }
      const finalAmount =
        subTotalAfterDiscount + totalTaxAmount + totalShippingCharge;
      console.log("Service: Creating OrderPaymentMeta with:", {
        sub_total: totalAmount,
        coupon_amount: couponAmount,
        shipping_cost: totalShippingCharge,
        tax_amount: totalTaxAmount,
        total_amount: finalAmount,
      });
      await OrderPaymentMeta.create({
        order_id: order._id,
        sub_total: totalAmount,
        coupon_amount: couponAmount,
        shipping_cost: totalShippingCharge,
        tax_amount: totalTaxAmount,
        total_amount: finalAmount,
      });
      console.log("Service: OrderPaymentMeta created");
      if (body.payment_gateway === "Wallet") {
        await orderHelpersServices.updateUserWallet(
          body.user_id,
          finalAmount,
          order._id
        );
        console.log("Service: User wallet updated");
      }
      await orderHelpersServices.updateInventory(order._id);
      console.log("Service: Inventory updated");
      return {
        success: true,
        type: "success",
        order_id: order._id,
        total_amount: finalAmount,
        invoice_number: order.invoice_number,
        created_at: order.createdAt,
      };
    } catch (error) {
      console.log("Service: createOrder error:", error);
      console.error("Service: createOrder error:", error.message, error.stack);
      throw new AppError(
        "Failed to create order",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  //getAllOrders for admin
  async getAllOrders(query) {
    try {
      console.log("Query Parameters:", query);
      const {
        page = 1,
        limit = 10,
        filters = "{}",
        searchFields = "{}",
        sort = "{}",
      } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // console.log("Filter Conditions:", filterConditions);
      // console.log("Sort Conditions:", sortConditions);
      console.log("Page Number:", pageNum);
      console.log("Limit Number:", limitNum);

      // Parse JSON strings from query parameters to objects
      const parsedFilters = JSON.parse(filters);
      const parsedSearchFields = JSON.parse(searchFields);
      const parsedSort = JSON.parse(sort);

      // Build filter conditions for multiple fields
      const filterConditions = { deletedAt: null };

      for (const [key, value] of Object.entries(parsedFilters)) {
        filterConditions[key] = value;
      }

      // Build search conditions for multiple fields with partial matching
      const searchConditions = [];
      for (const [field, term] of Object.entries(parsedSearchFields)) {
        searchConditions.push({ [field]: { $regex: term, $options: "i" } });
      }
      if (searchConditions.length > 0) {
        filterConditions.$or = searchConditions;
      }

      // Build sort conditions
      const sortConditions = {};
      for (const [field, direction] of Object.entries(parsedSort)) {
        sortConditions[field] = direction === "asc" ? 1 : -1;
      }

      // Execute query with dynamic filters, sorting, and pagination
      let orders = await this.repo.getAll(
        filterConditions,
        sortConditions,
        pageNum,
        limitNum
      );
      console.log("Orders fetched:", JSON.stringify(orders, null, 2));

      if (!orders || orders.length === 0) {
        return [];
      }
      const orderIds = orders.result?.map((order) => order._id);
      const [
        orderAddresses,
        subOrders,
        orderTracks,
        orderPaymentMetas,
        subOrderItems,
      ] = await Promise.all([
        OrderAddress.find({ order_id: { $in: orderIds } }).lean(),
        SubOrder.find({ order_id: { $in: orderIds } }).lean(),
        OrderTrack.find({ order_id: { $in: orderIds } }).lean(),
        OrderPaymentMeta.find({ order_id: { $in: orderIds } }).lean(),
        SubOrderItem.find({ order_id: { $in: orderIds } })
          .populate({
            path: "product_id",
            select:
              "name slug summary category_id subCategory_id description image price saleprice cost badge brand status productType soldCount minPurchase maxPurchase isRefundable isInHouse isInventoryWarnAble admin vendor isTaxable taxClass",
            model: Product,
          })
          .populate("diamond_id")
          .lean(),
      ]);
      orders = orders?.result?.map((order) => ({
        ...order,
        order_address:
          orderAddresses.find(
            (addr) => addr.order_id.toString() === order._id.toString()
          ) || null,
        sub_orders:
          subOrders
            .filter((sub) => sub.order_id.toString() === order._id.toString())
            .map((subOrder) => ({
              ...subOrder,
              sub_order_items:
                subOrderItems
                  .filter(
                    (item) =>
                      item.order_id.toString() === order._id.toString() &&
                      item.sub_order_id.toString() === subOrder._id.toString()
                  )
                  .map((item) => ({
                    ...item,
                    product: item.product_id || null, // Use populated product_id directly
                    diamond: item.diamond_id || null, // Handle diamond_id as ObjectId
                  })) || [],
            })) || [],
        order_track:
          orderTracks.filter(
            (track) => track.order_id.toString() === order._id.toString()
          ) || [],
        order_payment_meta:
          orderPaymentMetas.find(
            (meta) => meta.order_id.toString() === order._id.toString()
          ) || null,
      }));

      return orders;
    } catch (error) {
      console.log("error category", error.message);
      throw new AppError(
        "Cannot fetch data of all the courseCategories",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getOrdersByUserId(user_id) {
    try {
      await dbConnect();
      console.log("Mongoose connection state:", mongoose.connection.readyState);
      if (!mongoose.models.User) {
        console.error("User model is not registered");
        throw new AppError(
          "User model not found",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(user_id)) {
        throw new AppError("Invalid user_id format", StatusCodes.BAD_REQUEST);
      }
      let orders = await Order.find({ user_id })
        .populate({
          path: "user_id",
          select: "name email",
          model: User,
        })
        .lean();
      if (!orders || orders.length === 0) {
        return [];
      }
      const orderIds = orders.map((order) => order._id);
      const [
        orderAddresses,
        subOrders,
        orderTracks,
        orderPaymentMetas,
        subOrderItems,
      ] = await Promise.all([
        OrderAddress.find({ order_id: { $in: orderIds } }).lean(),
        SubOrder.find({ order_id: { $in: orderIds } }).lean(),
        OrderTrack.find({ order_id: { $in: orderIds } }).lean(),
        OrderPaymentMeta.find({ order_id: { $in: orderIds } }).lean(),
        SubOrderItem.find({ order_id: { $in: orderIds } })
          .populate({
            path: "product_id",
            select:
              "name slug summary category_id subCategory_id description image price saleprice cost badge brand status productType soldCount minPurchase maxPurchase isRefundable isInHouse isInventoryWarnAble admin vendor isTaxable taxClass",
            model: Product,
          })
          .populate("diamond_id")
          .lean(),
      ]);
      orders = orders.map((order) => ({
        ...order,
        order_address:
          orderAddresses.find(
            (addr) => addr.order_id.toString() === order._id.toString()
          ) || null,
        sub_orders:
          subOrders
            .filter((sub) => sub.order_id.toString() === order._id.toString())
            .map((subOrder) => ({
              ...subOrder,
              sub_order_items:
                subOrderItems
                  .filter(
                    (item) =>
                      item.order_id.toString() === order._id.toString() &&
                      item.sub_order_id.toString() === subOrder._id.toString()
                  )
                  .map((item) => ({
                    ...item,
                    product: item.product_id || null, // Use populated product_id directly
                    diamond: item.diamond_id || null, // Handle diamond_id as ObjectId
                  })) || [],
            })) || [],
        order_track:
          orderTracks.filter(
            (track) => track.order_id.toString() === order._id.toString()
          ) || [],
        order_payment_meta:
          orderPaymentMetas.find(
            (meta) => meta.order_id.toString() === order._id.toString()
          ) || null,
      }));
      return orders;
    } catch (error) {
      console.error(
        "OrderService getOrdersByUserId error:",
        error?.message,
        error.stack
      );
      throw new AppError(
        error.message || "Failed to fetch orders",
        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }
  async getOrderById(id) {
    try {
      await dbConnect();
      console.log("Mongoose connection state:", mongoose.connection.readyState);
      if (!mongoose.models.User) {
        console.error("User model is not registered");
        throw new AppError(
          "User model not found",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(id)) {
        throw new AppError("Invalid order ID format", StatusCodes.BAD_REQUEST);
      }
      let order = await Order.findOne({ _id: id })
        .populate({
          path: "user_id",
          select: "name email",
          model: User,
        })
        .lean();
      if (!order) {
        throw new AppError("Order not found", StatusCodes.NOT_FOUND);
      }
      const [
        orderAddress,
        subOrders,
        orderTracks,
        orderPaymentMeta,
        subOrderItems,
      ] = await Promise.all([
        OrderAddress.findOne({ order_id: id }).lean(),
        SubOrder.find({ order_id: id }).lean(),
        OrderTrack.find({ order_id: id }).lean(),
        OrderPaymentMeta.findOne({ order_id: id }).lean(),
        SubOrderItem.find({ order_id: id })
          .populate({
            path: "product_id",
            select:
              "name slug summary category_id subCategory_id description image price saleprice cost badge brand status productType soldCount minPurchase maxPurchase isRefundable isInHouse isInventoryWarnAble admin vendor isTaxable taxClass",
            model: Product,
          })
          .populate("diamond_id")
          .lean(),
      ]);
      // Log subOrderItems with null product_id for debugging
      subOrderItems.forEach((item, index) => {
        if (!item.product_id) {
          console.warn(
            `SubOrderItem at index ${index} has null product_id:`,
            item
          );
        }
      });
      order = {
        ...order,
        order_address: orderAddress || null,
        sub_orders:
          subOrders.map((subOrder) => ({
            ...subOrder,
            sub_order_items:
              subOrderItems
                .filter(
                  (item) =>
                    item.order_id.toString() === order._id.toString() &&
                    item.sub_order_id.toString() === subOrder._id.toString()
                )
                .map((item) => ({
                  ...item,
                  product: item.product_id || null, // Use populated product_id directly
                  product_id: item.product_id?._id || null, // Retain product_id as ObjectId
                })) || [],
          })) || [],
        order_track: orderTracks || [],
        order_payment_meta: orderPaymentMeta || null,
      };
      return order;
    } catch (error) {
      console.error(
        "OrderService getOrderById error:",
        error?.message,
        error.stack
      );
      throw new AppError(
        error.message || "Failed to fetch order",
        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }
  async cancelOrder(id) {
    try {
      await dbConnect();
      console.log("Mongoose connection state:", mongoose.connection.readyState);
      if (!mongoose.models.User) {
        console.error("User model is not registered");
        throw new AppError(
          "User model not found",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(id)) {
        throw new AppError("Invalid order ID format", StatusCodes.BAD_REQUEST);
      }
      let order = await Order.findOne({ _id: id });
      if (!order) {
        throw new AppError("Order not found", StatusCodes.NOT_FOUND);
      }
      if (order.order_status === "canceled") {
        throw new AppError("Order already canceled", StatusCodes.BAD_REQUEST);
      }
      // Update order status to canceled
      order.order_status = "canceled";
      await order.save();
      // Update sub-orders to canceled
      await SubOrder.updateMany({ order_id: id }, { order_status: "canceled" });
      // Create order track entry for cancellation
      await OrderTrack.create({
        order_id: id,
        name: "canceled",
        updated_by: order.user_id || null,
        table: "users",
        created_at: new Date(),
      });
      // Optionally restore inventory
      await orderHelpersServices.restoreInventory(id);
      // Fetch updated order for response
      const updatedOrder = await Order.findOne({ _id: id })
        .populate({
          path: "user_id",
          select: "name email",
          model: User,
        })
        .lean();
      const [
        orderAddress,
        subOrders,
        orderTracks,
        orderPaymentMeta,
        subOrderItems,
      ] = await Promise.all([
        OrderAddress.findOne({ order_id: id }).lean(),
        SubOrder.find({ order_id: id }).lean(),
        OrderTrack.find({ order_id: id }).lean(),
        OrderPaymentMeta.findOne({ order_id: id }).lean(),
        SubOrderItem.find({ order_id: id }).lean(),
      ]);
      return {
        ...updatedOrder,
        order_address: orderAddress || null,
        sub_orders:
          subOrders.map((subOrder) => ({
            ...subOrder,
            sub_order_items:
              subOrderItems.filter(
                (item) =>
                  item.order_id.toString() === updatedOrder._id.toString() &&
                  item.sub_order_id.toString() === subOrder._id.toString()
              ) || [],
          })) || [],
        order_track: orderTracks || [],
        order_payment_meta: orderPaymentMeta || null,
      };
    } catch (error) {
      console.error(
        "OrderService cancelOrder error:",
        error.message,
        error.stack
      );
      throw new AppError(
        error.message || "Failed to cancel order",
        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateOrderById(id, updatePayload) {
    try {
      await dbConnect();
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(id)) {
        throw new AppError("Invalid order ID format", StatusCodes.BAD_REQUEST);
      }

      const order = await Order.findById(id);
      if (!order) {
        throw new AppError("Order not found", StatusCodes.NOT_FOUND);
      }

      // Update only the fields provided in payload
      Object.keys(updatePayload).forEach((key) => {
        order[key] = updatePayload[key];
      });

      await order.save();

      if (updatePayload.order_status) {
        await OrderTrack.create({
          order_id: order._id,
          name: updatePayload.order_status,
          updated_by: order.user_id || null,
          table: "users",
          created_at: new Date(),
        });
      }

      return order;
    } catch (error) {
      console.error(
        "OrderService updateOrderById error:",
        error.message,
        error.stack
      );
      throw new AppError(
        error.message || "Failed to update order",
        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getOrdersWithFilters(query) {
    // Parse filters, sort, page, limit from query
    const { page, limit, ...rest } = query;
    let filters = {};
    let sort = {};

    // Example: filter by order_status, payment_status, user_id, etc.
    if (rest.order_status) filters.order_status = rest.order_status;
    if (rest.payment_status) filters.payment_status = rest.payment_status;
    if (rest.user_id) filters.user_id = rest.user_id;
    // Add more filters as needed

    // Example: sort by createdAt desc
    if (rest.sortBy) sort[rest.sortBy] = rest.sortOrder === "asc" ? 1 : -1;
    else sort.createdAt = -1;

    return this.repo.getOrders({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filters,
      sort,
    });
  }
}

export default OrderService;
