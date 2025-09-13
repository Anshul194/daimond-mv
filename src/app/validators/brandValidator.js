import Joi from 'joi';

const baseBrandSchema = {
  name: Joi.string().min(2).max(100).trim().messages({
    'string.empty': 'Brand name is required.',
    'string.min': 'Brand name must be at least 2 characters.',
    'string.max': 'Brand name must be at most 100 characters.'
  }),

  title: Joi.string().allow('').trim().max(200).messages({
    'string.max': 'Title must be at most 200 characters.'
  }),

  description: Joi.string().allow('').trim().max(1000).messages({
    'string.max': 'Description must be at most 1000 characters.'
  }),

  logo: Joi.string().allow('').trim().messages({
    'string.uri': 'Logo must be a valid URL.'
  }),

  vendor: Joi.string().allow('').optional(),

};

// Create Validator
export const brandCreateValidator = Joi.object({
  name: baseBrandSchema.name.required(),
  title: baseBrandSchema.title.optional(),
  description: baseBrandSchema.description.optional(),
  logo: baseBrandSchema.logo.optional(),
  vendor: baseBrandSchema.vendor.optional(),

});

// Update Validator
export const brandUpdateValidator = Joi.object({
  name: baseBrandSchema.name.optional(),
  title: baseBrandSchema.title.optional(),
  description: baseBrandSchema.description.optional(),
  logo: baseBrandSchema.logo.optional(),
  vendor: baseBrandSchema.vendor.optional(),
  
}).min(1);
