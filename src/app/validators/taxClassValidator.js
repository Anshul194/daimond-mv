import Joi from 'joi';

// Base Tax Class schema
const baseTaxClassSchema = {
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tax class name is required.',
      'string.min': 'Tax class name must be at least 2 characters.',
      'string.max': 'Tax class name must be at most 100 characters.'
    }),

  isActivated: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'isActivated must be a boolean value.'
    }),

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

// ✅ Create Tax Class Validator
export const taxClassCreateValidator = Joi.object({
  name: baseTaxClassSchema.name,
  isActivated: baseTaxClassSchema.isActivated,
  vendor: baseTaxClassSchema.vendor,
  deleted: baseTaxClassSchema.deleted,
  deletedAt: baseTaxClassSchema.deletedAt
});

// ✅ Update Tax Class Validator
export const taxClassUpdateValidator = Joi.object({
  name: baseTaxClassSchema.name.optional(),
  isActivated: baseTaxClassSchema.isActivated,
  vendor: baseTaxClassSchema.vendor,
  deleted: baseTaxClassSchema.deleted,
  deletedAt: baseTaxClassSchema.deletedAt
}).min(1); // Require at least one field in update

// Base Tax Class Option schema
const baseTaxClassOptionSchema = {
  class_id: Joi.string()
    .required()
    .messages({
      'string.empty': 'Tax class ID is required.',
      'any.required': 'Tax class ID is required.'
    }),

  tax_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tax name is required.',
      'string.min': 'Tax name must be at least 2 characters.',
      'string.max': 'Tax name must be at most 100 characters.',
      'any.required': 'Tax name is required.'
    }),

  country_id: Joi.string()
    .optional()
    .allow(null),

  state_id: Joi.string()
    .optional()
    .allow(null),

  city_id: Joi.string()
    .optional()
    .allow(null),

  postal_code: Joi.string()
    .trim()
    .max(20)
    .optional()
    .allow(null)
    .messages({
      'string.max': 'Postal code must be at most 20 characters.'
    }),

  priority: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Priority must be a number.',
      'number.integer': 'Priority must be an integer.',
      'number.min': 'Priority must be at least 0.',
      'any.required': 'Priority is required.'
    }),

  is_compound: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'is_compound must be a boolean value.'
    }),

  is_shipping: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'is_shipping must be a boolean value.'
    }),

  rate: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Rate must be a number.',
      'number.min': 'Rate must be at least 0.',
      'any.required': 'Rate is required.'
    }),

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

// ✅ Create Tax Class Option Validator
export const taxClassOptionCreateValidator = Joi.object({
  class_id: baseTaxClassOptionSchema.class_id,
  tax_name: baseTaxClassOptionSchema.tax_name,
  country_id: baseTaxClassOptionSchema.country_id,
  state_id: baseTaxClassOptionSchema.state_id,
  city_id: baseTaxClassOptionSchema.city_id,
  postal_code: baseTaxClassOptionSchema.postal_code,
  priority: baseTaxClassOptionSchema.priority,
  is_compound: baseTaxClassOptionSchema.is_compound,
  is_shipping: baseTaxClassOptionSchema.is_shipping,
  rate: baseTaxClassOptionSchema.rate,
  vendor: baseTaxClassOptionSchema.vendor,
  deleted: baseTaxClassOptionSchema.deleted,
  deletedAt: baseTaxClassOptionSchema.deletedAt
});

// ✅ Update Tax Class Option Validator
export const taxClassOptionUpdateValidator = Joi.object({
  class_id: baseTaxClassOptionSchema.class_id.optional(),
  tax_name: baseTaxClassOptionSchema.tax_name.optional(),
  country_id: baseTaxClassOptionSchema.country_id,
  state_id: baseTaxClassOptionSchema.state_id,
  city_id: baseTaxClassOptionSchema.city_id,
  postal_code: baseTaxClassOptionSchema.postal_code,
  priority: baseTaxClassOptionSchema.priority.optional(),
  is_compound: baseTaxClassOptionSchema.is_compound,
  is_shipping: baseTaxClassOptionSchema.is_shipping,
  rate: baseTaxClassOptionSchema.rate.optional(),
  vendor: baseTaxClassOptionSchema.vendor,
  deleted: baseTaxClassOptionSchema.deleted,
  deletedAt: baseTaxClassOptionSchema.deletedAt
}).min(1); // Require at least one field in update
