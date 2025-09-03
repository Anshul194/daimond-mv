// models/Faq.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },
});

const City = models.City || model("City", citySchema);
export default City;
