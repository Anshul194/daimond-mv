import Joi from 'joi';
import mongoose from 'mongoose';

const baseCategorySchema = {
  name: Joi.string().min(2).max(50).messages({
    'string.empty': 'Category name is required.',
    'string.min': 'Category name must be at least 2 characters.',
    'string.max': 'Category name must be at most 50 characters.'
  }),

  slug: Joi.string().min(2).max(100).lowercase(),

  description: Joi.string().allow('', null),

  image: Joi.string().allow('', null).messages({
    'string.uri': 'Image must be a valid URL.'
  }),

  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be either active or inactive.'
  })
};

// ✅ Create Validator

export const categoryCreateValidator = Joi.object({
  name: baseCategorySchema.name.required(),
  slug: baseCategorySchema.slug.optional(),
  description: baseCategorySchema.description.optional(),
  image: baseCategorySchema.image.optional(),
  status: baseCategorySchema.status.optional(),
  vendor: Joi.string().optional().allow(null, ''),
});

// ✅ Update Validator

export const categoryUpdateValidator = Joi.object({
  name: baseCategorySchema.name.optional(),
  slug: baseCategorySchema.slug.optional(),
  description: baseCategorySchema.description.optional(),
  image: baseCategorySchema.image.optional(),
  status: baseCategorySchema.status.optional(),
  vendor: Joi.string().optional().allow(null, ''),
});
