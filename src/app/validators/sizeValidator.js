import Joi from 'joi';

// Base schema
const baseSizeSchema = {
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Size name is required.',
      'string.min': 'Size name must be at least 2 characters.',
      'string.max': 'Size name must be at most 100 characters.'
    }),

  size_code: Joi.string()
    .trim()
    .uppercase()
    .min(1)
    .max(20)
    .messages({
      'string.empty': 'Size code is required.',
      'string.max': 'Size code must be at most 20 characters.'
    }),

  slug: Joi.string()
    .trim()
    .lowercase()
    .optional(),

  deleted: Joi.boolean().optional(),
  deletedAt: Joi.date().optional().allow(null)
};

// ✅ Create Validator
export const sizeCreateValidator = Joi.object({
  name: baseSizeSchema.name.required(),
  size_code: baseSizeSchema.size_code.required(),
  slug: baseSizeSchema.slug.optional(),
  deleted: baseSizeSchema.deleted.optional(),
  deletedAt: baseSizeSchema.deletedAt.optional()
});

// ✅ Update Validator
export const sizeUpdateValidator = Joi.object({
  name: baseSizeSchema.name.optional(),
  size_code: baseSizeSchema.size_code.optional(),
  slug: baseSizeSchema.slug.optional(),
  deleted: baseSizeSchema.deleted.optional(),
  deletedAt: baseSizeSchema.deletedAt.optional()
}).min(1); // Require at least one field in update
