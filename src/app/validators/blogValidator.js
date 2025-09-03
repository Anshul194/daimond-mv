import Joi from 'joi';

export const blogCreateValidator = Joi.object({
  title: Joi.string().required().trim().min(3).max(255),
  description: Joi.string().allow('').max(1000),
  content: Joi.string().allow('').max(50000),
  BlogCategory: Joi.string().required(),
  BlogSubCategory: Joi.string().allow(''),
  date: Joi.date().default(Date.now),
  coverImage: Joi.string().allow(''),
  thumbnailImage: Joi.string().allow(''),
});

export const blogUpdateValidator = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().allow('').max(1000),
  content: Joi.string().allow('').max(50000),
  BlogCategory: Joi.string(),
  BlogSubCategory: Joi.string().allow(''),
  date: Joi.date(),
  coverImage: Joi.string().allow(''),
  thumbnailImage: Joi.string().allow(''),
});