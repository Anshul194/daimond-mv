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
  deleted_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const TaxClass = mongoose.models.TaxClass || mongoose.model('TaxClass', taxClassSchema);
export default TaxClass;