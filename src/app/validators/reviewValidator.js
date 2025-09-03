import Joi from 'joi';
import mongoose from 'mongoose';

// Custom ObjectId validator
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const baseReviewSchema = {
  user: Joi.string().custom(objectId).messages({
    'any.invalid': 'Invalid user ID',
    'string.empty': 'User is required',
  }),

  product: Joi.string().custom(objectId).allow(null, '').messages({
    'any.invalid': 'Invalid product ID',
  }),

  rating: Joi.number().integer().min(1).max(5).messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating must be at most 5',
  }),

  comment: Joi.string().max(1000).allow('', null).messages({
    'string.max': 'Comment can be maximum 1000 characters',
  }),

  images: Joi.array().items(Joi.string()).messages({
    'string.uri': 'Each image must be a valid URL',
  }),

  targetType: Joi.string().valid('product', 'website').messages({
    'any.only': 'Target type must be either product or website',
  }),

  isVerified: Joi.boolean(),
};

// Create validator (required fields)
export const reviewCreateValidator = Joi.object({
  user: baseReviewSchema.user.required(),
  product: baseReviewSchema.product.optional(),
  rating: baseReviewSchema.rating.required(),
  comment: baseReviewSchema.comment.optional(),
  images: baseReviewSchema.images.optional(),
  targetType: baseReviewSchema.targetType.optional(),
  isWebsiteReview: baseReviewSchema.isVerified.optional(),
});

// Update validator (all optional)
export const reviewUpdateValidator = Joi.object({
  user: baseReviewSchema.user.optional(),
  product: baseReviewSchema.product.optional(),
  rating: baseReviewSchema.rating.optional(),
  comment: baseReviewSchema.comment.optional(),
  images: baseReviewSchema.images.optional(),
  targetType: baseReviewSchema.targetType.optional(),
  isWebsiteReview: baseReviewSchema.isVerified.optional(),
});
