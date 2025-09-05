import mongoose from 'mongoose';

const taxClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActivated: {
    type: Boolean,
    default: false,
    required: true  // Make it required to ensure it's always set
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to update timestamps
taxClassSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for better performance
taxClassSchema.index({ deletedAt: 1 });
taxClassSchema.index({ name: 1, deletedAt: 1 });
taxClassSchema.index({ vendor: 1, deletedAt: 1 });
taxClassSchema.index({ isActivated: 1, deletedAt: 1 });

const TaxClass = mongoose.models.TaxClass || mongoose.model('TaxClass', taxClassSchema);
export default TaxClass;