import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const orderSchema = new Schema(
  {
    coupon: String,
    coupon_amount: Number,
    payment_track: { type: String, required: true },
    payment_gateway: { type: String, required: true },
    transaction_id: { type: String, required: true },
    // order_status: { type: String, required: true },
    invoice_url: { type: String },
    orderSessionId: {
      type: Schema.Types.ObjectId,
      ref: "OrderSession",
    },
    order_status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "canceled",
        "returned",
      ],
      default: "pending",
    },

    payment_status: { type: String, required: true },
    invoice_number: { type: Number, unique: true },
    order_number: String,
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    type: String,
    note: String,
    selected_customer: { type: Schema.Types.ObjectId, ref: "User" },
    tax_id: { type: Schema.Types.ObjectId, ref: "TaxClassOption" },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
