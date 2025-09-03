// models/Faq.js
import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const faqSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

const Faq = models.Faq || model('Faq', faqSchema);
export default Faq;
