import mongoose from "mongoose";

const orderTrackSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    name: { type: String, required: true },
    updated_by: mongoose.Schema.Types.ObjectId,
    table: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.OrderTrack || mongoose.model("OrderTrack", orderTrackSchema);
