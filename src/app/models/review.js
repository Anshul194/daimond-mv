import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false, // optional for website review
  },
  targetType: {
    type: String,
    enum: ['product', 'website'],
    default: function () {
      return this.product ? 'product' : 'website';
    },
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000,
    required: true,
  },
  images: [
    {
      type: String,
      trim: true,
    }
  ],
  isWebsiteReview: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Review = models.Review || model('Review', reviewSchema);
export default Review;
