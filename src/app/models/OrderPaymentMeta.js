import mongoose from "mongoose";

const orderPaymentMetaSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    sub_total: Number,
    coupon_amount: { type: Number, default: 0.00 },
    shipping_cost: { type: Number, default: 0.00 },
    tax_amount: { type: Number, default: 0.00 },
    total_amount: { type: Number, default: 0.00 },
    payment_attachments: String
});

export default mongoose.models.OrderPaymentMeta || mongoose.model("OrderPaymentMeta", orderPaymentMetaSchema);
