import mongoose from "mongoose";

const subOrderSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    total_amount: Number,
    shipping_cost: Number,
    tax_amount: Number,
    tax_type: String,
    order_address_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderAddress" },
    order_number: Number,
    payment_status: String,
    order_status: String
}, { timestamps: true });

export default mongoose.models.SubOrder || mongoose.model("SubOrder", subOrderSchema);
