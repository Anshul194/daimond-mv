import mongoose from "mongoose";
import Country from "./country";
import State from "./state";
import City from "./city";
import Product from "./Product";
import Diamond from "./diamond";

const OrderSessionSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        pid_id: { type: mongoose.Schema.Types.ObjectId, ref: Product },
        pid_name: String,
        pid_image: String,
        pid_price: Number,
        quantity: Number,
        selectedOptions: {
          ringSize: String,
          metalType: String,
        },
        selectedDiamond: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Diamond,
          required: false,
        },
      },
    ],
    customerDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      country: { type: mongoose.Schema.Types.ObjectId, ref: Country },
      state: { type: mongoose.Schema.Types.ObjectId, ref: State },
      city: { type: mongoose.Schema.Types.ObjectId, ref: City },
      zipcode: String,
    },
    totalAmount: Number,
    couponCode: { type: String, default: "N/A" },
    couponDiscount: { type: Number, default: 0 },
    tax: Number,
    tax_id: { type: mongoose.Schema.Types.ObjectId, ref: "TaxClassOption" },
    sessionId: { type: String }, // optional: set after Stripe session creation
  },
  { timestamps: true }
);

export default mongoose.models.OrderSession ||
  mongoose.model("OrderSession", OrderSessionSchema);
