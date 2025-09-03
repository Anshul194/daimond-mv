import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['flat', 'percentage'], required: true },
  value: { type: Number, required: true }, // Flat amount or percentage value
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number }, // Only for percentage type
  usageLimit: { type: Number, default: 1 }, // How many times a coupon can be used
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

couponSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
