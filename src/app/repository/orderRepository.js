import Order from '../models/order.js';
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from "./crud-repository.js";

class OrderRepository extends CrudRepository {
  constructor() {
    super(Order);
  }

  async getOrders({ page = 1, limit = 10, filters = {}, sort = {} }) {
    const skip = (page - 1) * limit;
    const query = { ...filters };

    // Example: filter by order_status, payment_status, user_id, etc.
    // You can add more filter logic as needed

    const orders = await Order.find(query)
      .populate({ path: "user_id", select: "name email", model: "User" })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    return { orders, total };
  }

  
  
}

export default OrderRepository;