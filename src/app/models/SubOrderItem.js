import mongoose from "mongoose";
import Diamond from "./diamond";

const subOrderItemSchema = new mongoose.Schema({
    sub_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "SubOrder" },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    diamond_id: { type: mongoose.Schema.Types.ObjectId, ref: "Diamond", default: null }, // Optional, can be null
    variant: mongoose.Schema.Types.Mixed, // Stores JSON like { color_id: 492165555, size_id: 25596966 }
    quantity: Number,
    price: Number,
    sale_price: Number,
    tax_amount: { type: Number, default: 0.00 },
    tax_type: String,
    type: { type: String, default: "product" },
    order_data: mongoose.Schema.Types.Mixed
});

export default mongoose.models.SubOrderItem || mongoose.model("SubOrderItem", subOrderItemSchema);