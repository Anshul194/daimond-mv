import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 2 characters.',
    'string.max': 'Name must be at most 50 characters.',
  }),

  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Please enter a valid email address.',
  }),

  phoneNo: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.empty': 'Phone number is required.',
    'string.pattern.base': 'Phone number must be 10 digits.',
  }),

  address: Joi.string().allow('', null),
  state: Joi.string().allow('', null),
  city: Joi.string().allow('', null),

  pinCode: Joi.string().pattern(/^[0-9]{6}$/).allow('', null).messages({
    'string.pattern.base': 'Pin code must be 6 digits.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.',
  }),

  profilepic: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Profile picture must be a valid URL.',
  }),

  country: Joi.string().allow('', null),
  firebaseToken: Joi.string().allow('', null),
});


export const userUpdateSchema = Joi.object({
  name: Joi.string().optional().trim(),
  email: Joi.string().email().optional().lowercase(),
  phoneNo: Joi.string().optional(),
  address: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  pinCode: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  profilepic: Joi.string().optional(),
  country: Joi.string().optional(),
  firebaseToken: Joi.string().optional(),
}).min(1);

export const userLoginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Please enter a valid email address.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.',
  }),
});