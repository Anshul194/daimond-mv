import Joi from 'joi';

// 🔁 Base Schema
const baseDeliveryOptionSchema = {
  icon: Joi.string().trim().required().messages({
    'string.empty': 'Icon is required.',
  }),

  title: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 2 characters.',
    'string.max': 'Title must be at most 100 characters.',
  }),

  sub_title: Joi.string().allow('', null).max(255).messages({
    'string.max': 'Subtitle must be at most 255 characters.',
  }),
  status: Joi.string().valid('active', 'inactive').optional(),
};

// ✅ Create Validator
export const deliveryOptionCreateValidator = Joi.object({
  icon: baseDeliveryOptionSchema.icon,
  title: baseDeliveryOptionSchema.title,
  sub_title: baseDeliveryOptionSchema.sub_title.optional(),
    status: baseDeliveryOptionSchema.status.optional(),
});

// ✅ Update Validator
export const deliveryOptionUpdateValidator = Joi.object({
  icon: baseDeliveryOptionSchema.icon.optional(),
  title: baseDeliveryOptionSchema.title.optional(),
  sub_title: baseDeliveryOptionSchema.sub_title.optional(),
    status: baseDeliveryOptionSchema.status.optional(),
});
