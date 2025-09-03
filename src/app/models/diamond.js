// models/Faq.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const diamondSchema = new Schema(
  {
    shape: {
      type: String,
      required: true,
      trim: true,
    },
    clarity: {
      type: String,
      required: true,
      default: null,
    },
    weight: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    cut: {
      type: String,
      required: true,
      trim: true,
    },
    polish: {
      type: String,
      required: true,
      trim: true,
    },
    symm: {
      type: String,
      required: true,
      trim: true,
    },
    lab: {
      type: String,
      required: true,
      trim: true,
    },
    certino: {
      type: String,
      required: true,
      trim: true,
    },
    measurements: {
      type: String,
      required: true,
      trim: true,
    },
    net: {
      type: Number,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    viewCart: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Diamond = models.Diamond || model("Diamond", diamondSchema);
export default Diamond;
