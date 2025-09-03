import Joi from 'joi';

export const blogSubCategoryCreateValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  BlogCategory: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  image: Joi.string().allow('').optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const blogSubCategoryUpdateValidator = Joi.object({
  name: Joi.string().optional().trim().min(1).max(100),
  BlogCategory: Joi.string().optional(),
  image: Joi.string().allow('').optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});