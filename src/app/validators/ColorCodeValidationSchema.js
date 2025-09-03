import Joi from 'joi';

export const colorCodeCreateValidator = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  colorCode: Joi.string().required().trim().pattern(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-1]?\.?\d*\))$/).messages({
    'string.pattern.base': 'Color code must be in valid format (hex, rgb, or rgba)'
  }),
  status: Joi.string().valid('active', 'inactive').default('active'),

});

export const colorCodeUpdateValidator = Joi.object({
  name: Joi.string().optional().trim().min(1).max(100),
  colorCode: Joi.string().optional().trim().pattern(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-1]?\.?\d*\))$/).messages({
    'string.pattern.base': 'Color code must be in valid format (hex, rgb, or rgba)'
  }),
  status: Joi.string().valid('active', 'inactive').optional(),
 
});