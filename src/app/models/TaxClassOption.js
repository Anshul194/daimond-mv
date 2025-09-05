import mongoose from 'mongoose';

const taxClassOptionSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxClass',
    required: true,
  },
  tax_name: {
    type: String,
    required: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    default: null,
  },
  state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    default: null,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    default: null,
  },
  postal_code: {
    type: String,
    default: null,
  },
  priority: {
    type: Number,
    required: true,
  },
  is_compound: {
    type: Boolean,
    default: false,
  },
  is_shipping: {
    type: Boolean,
    default: false,
  },
  rate: {
    type: Number,
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre-save middleware to update timestamps
taxClassOptionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for better performance
taxClassOptionSchema.index({ deletedAt: 1 });
taxClassOptionSchema.index({ class_id: 1, deletedAt: 1 });
taxClassOptionSchema.index({ vendor: 1, deletedAt: 1 });
taxClassOptionSchema.index({ tax_name: 1, deletedAt: 1 });

export default mongoose.models.TaxClassOption || mongoose.model('TaxClassOption', taxClassOptionSchema);