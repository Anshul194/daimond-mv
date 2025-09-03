// models/Faq.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const StateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
});

const State = models.State || model("State", StateSchema);
export default State;
