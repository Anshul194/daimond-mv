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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.TaxClassOption || mongoose.model('TaxClassOption', taxClassOptionSchema);