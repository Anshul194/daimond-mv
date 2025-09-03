// models/Faq.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const countrySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Country = models.Country || model("Country", countrySchema);
export default Country;
