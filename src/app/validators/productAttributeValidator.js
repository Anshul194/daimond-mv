import Joi from 'joi';

const termSchema = Joi.object({
  value: Joi.string().required().trim(),
  image: Joi.string().allow('').default('')
});

export const productAttributeCreateValidator = Joi.object({
  title: Joi.string().required().trim().min(1).max(255),
  category_id: Joi.string().optional(),
  terms: Joi.array().items(termSchema).default([]),
  vendor: Joi.string().allow('').optional(),
  lastModifiedBy: Joi.object({
    id: Joi.string(),
    email: Joi.string().email(),
    name: Joi.string(),
    timestamp: Joi.date()
  }).optional()
});

export const productAttributeUpdateValidator = Joi.object({
  title: Joi.string().trim().min(1).max(255).optional(),
   category_id: Joi.string().optional(),
  terms: Joi.array().items(termSchema).optional(),
  vendor: Joi.string().allow('').optional(),
  lastModifiedBy: Joi.object({
    id: Joi.string(),
    email: Joi.string().email(),
    name: Joi.string(),
    timestamp: Joi.date()
  }).optional()
});