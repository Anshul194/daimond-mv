import Joi from 'joi';

export const adminRegisterSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'any.required': 'Password is required.',
        }),
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Username is required.',
            'string.min': 'Username must be at least 3 characters long.',
            'string.max': 'Username must be at most 30 characters long.',
            'any.required': 'Username is required.',
        }),
});


export const adminLoginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'any.required': 'Password is required.',
        }),
});
