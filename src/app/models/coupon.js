import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['flat', 'percentage'], required: true },
  value: { type: Number, required: true }, // Flat amount or percentage value
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number ,default: 0}, // Only for percentage type
  usageLimit: { type: Number, default: 1 }, // How many times a coupon can be used
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
    index: true
  },
  deleted: { 
    type: Boolean, 
    default: false 
  },
  deletedAt: { 
    type: Date, 
    default: null 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

couponSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for better performance
couponSchema.index({ deletedAt: 1 });
couponSchema.index({ code: 1, deletedAt: 1 });
couponSchema.index({ vendor: 1, deletedAt: 1 });
couponSchema.index({ isActive: 1, deletedAt: 1 });

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
