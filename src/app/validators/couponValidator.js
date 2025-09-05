import Joi from 'joi';

// Base schema
const baseCouponSchema = {
  code: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Coupon code is required.',
      'string.min': 'Coupon code must be at least 3 characters.',
      'string.max': 'Coupon code must be at most 50 characters.'
    }),

  type: Joi.string()
    .valid('flat', 'percentage')
    .required()
    .messages({
      'any.only': 'Type must be either "flat" or "percentage".',
      'string.empty': 'Coupon type is required.'
    }),

  value: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Value must be a positive number.',
      'number.base': 'Value must be a number.',
      'any.required': 'Value is required.'
    }),

  minOrderAmount: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Minimum order amount cannot be negative.',
      'number.base': 'Minimum order amount must be a number.'
    }),

  maxDiscount: Joi.any()
    .optional()
    .messages({
      'number.positive': 'Maximum discount must be a positive number.',
      'number.base': 'Maximum discount must be a number.'
    }),

  usageLimit: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Usage limit must be at least 1.',
      'number.integer': 'Usage limit must be an integer.',
      'number.base': 'Usage limit must be a number.'
    }),

  usedCount: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional()
    .messages({
      'number.min': 'Used count cannot be negative.',
      'number.integer': 'Used count must be an integer.',
      'number.base': 'Used count must be a number.'
    }),

  validFrom: Joi.date()
    .required()
    .messages({
      'date.base': 'Valid from must be a valid date.',
      'any.required': 'Valid from date is required.'
    }),

  validTo: Joi.date()
    .required()
    .greater(Joi.ref('validFrom'))
    .messages({
      'date.base': 'Valid to must be a valid date.',
      'date.greater': 'Valid to date must be after valid from date.',
      'any.required': 'Valid to date is required.'
    }),

  isActive: Joi.boolean()
    .default(true)
    .optional(),

  vendor: Joi.string()
    .optional()
    .allow(null),

  deleted: Joi.boolean()
    .default(false)
    .optional(),

  deletedAt: Joi.date()
    .optional()
    .allow(null)
};

// ✅ Create Validator
export const couponCreateValidator = Joi.object({
  code: baseCouponSchema.code,
  type: baseCouponSchema.type,
  value: baseCouponSchema.value,
  minOrderAmount: baseCouponSchema.minOrderAmount,
  maxDiscount: baseCouponSchema.maxDiscount,
  usageLimit: baseCouponSchema.usageLimit,
  usedCount: baseCouponSchema.usedCount,
  validFrom: baseCouponSchema.validFrom,
  validTo: baseCouponSchema.validTo,
  isActive: baseCouponSchema.isActive,
  vendor: baseCouponSchema.vendor,
  deleted: baseCouponSchema.deleted,
  deletedAt: baseCouponSchema.deletedAt
}).custom((value, helpers) => {
  // Custom validation for percentage type coupons
  if (value.type === 'percentage') {
    if (value.value > 100) {
      return helpers.error('percentage.max', { limit: 100 });
    }
    if (!value.maxDiscount) {
      return helpers.message('Maximum discount is recommended for percentage coupons');
    }
  }
  return value;
}).messages({
  'percentage.max': 'Percentage value cannot exceed 100%'
});

// ✅ Update Validator
export const couponUpdateValidator = Joi.object({
  code: baseCouponSchema.code.optional(),
  type: baseCouponSchema.type.optional(),
  value: baseCouponSchema.value.optional(),
  minOrderAmount: baseCouponSchema.minOrderAmount,
  maxDiscount: baseCouponSchema.maxDiscount,
  usageLimit: baseCouponSchema.usageLimit,
  usedCount: baseCouponSchema.usedCount,
  validFrom: baseCouponSchema.validFrom.optional(),
  validTo: baseCouponSchema.validTo.optional(),
  isActive: baseCouponSchema.isActive,
  vendor: baseCouponSchema.vendor,
  deleted: baseCouponSchema.deleted,
  deletedAt: baseCouponSchema.deletedAt
}).min(1).custom((value, helpers) => {
  // Custom validation for percentage type coupons
  if (value.type === 'percentage' && value.value > 100) {
    return helpers.error('percentage.max', { limit: 100 });
  }
  
  // Validate date range if both dates are provided
  if (value.validFrom && value.validTo && new Date(value.validTo) <= new Date(value.validFrom)) {
    return helpers.error('date.range');
  }
  
  return value;
}).messages({
  'percentage.max': 'Percentage value cannot exceed 100%',
  'date.range': 'Valid to date must be after valid from date'
});

// ✅ Validation for coupon application
export const couponValidationValidator = Joi.object({
  code: Joi.string().trim().required(),
  orderTotal: Joi.number().positive().required(),
  userEmail: Joi.string().email().optional()
});
