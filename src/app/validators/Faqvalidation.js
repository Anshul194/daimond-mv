import Joi from 'joi';

const baseFaqSchema = {
  title: Joi.string().min(2).max(200).trim().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 2 characters.',
    'string.max': 'Title must be at most 200 characters.'
  }),

  description: Joi.string().min(5).max(2000).trim().messages({
    'string.empty': 'Description is required.',
    'string.min': 'Description must be at least 5 characters.',
    'string.max': 'Description must be at most 2000 characters.'
  }),

  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be either active or inactive.'
  }),

  deletedAt: Joi.date().allow(null)
};

// ✅ Create Validator
export const faqCreateValidator = Joi.object({
  title: baseFaqSchema.title.required(),
  description: baseFaqSchema.description.required(),
  status: baseFaqSchema.status.optional(),
  deletedAt: baseFaqSchema.deletedAt.optional()
});

// ✅ Update Validator
export const faqUpdateValidator = Joi.object({
  title: baseFaqSchema.title.optional(),
  description: baseFaqSchema.description.optional(),
  status: baseFaqSchema.status.optional(),
  deletedAt: baseFaqSchema.deletedAt.optional()
});
