import mongoose from "mongoose";

const orderAddressSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    name: String,
    email: String,
    phone: String,
    country_id: mongoose.Schema.Types.ObjectId,
    state_id: mongoose.Schema.Types.ObjectId,
    city: String,
    address: String,
    user_id: mongoose.Schema.Types.ObjectId,
    zipcode: String
});

export default mongoose.models.OrderAddress || mongoose.model("OrderAddress", orderAddressSchema);
