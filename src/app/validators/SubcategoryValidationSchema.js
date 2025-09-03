// import Joi from 'joi';
// import mongoose from 'mongoose';

// export const subCategoryValidator = Joi.object({
//   name: Joi.string().min(2).max(50).required().messages({
//     'string.empty': 'SubCategory name is required.',
//     'string.min': 'SubCategory name must be at least 2 characters.',
//     'string.max': 'SubCategory name must be at most 50 characters.'
//   }),
//   slug: Joi.string().min(2).max(100).lowercase().optional(),
//   category: Joi.string().required().custom((value, helpers) => {
//     if (!mongoose.Types.ObjectId.isValid(value)) {
//       return helpers.error('any.invalid');
//     }
//     return value;
//   }).messages({
//     'string.empty': 'Category ID is required.',
//     'any.invalid': 'Category ID must be a valid Mongo ObjectId.'
//   }),
//   description: Joi.string().allow('', null),
//   image: Joi.string().allow('', null).messages({
//     'string.uri': 'Image must be a valid URL.'
//   }),
//   status: Joi.string().valid('active', 'inactive').default('active').messages({
//     'any.only': 'Status must be either active or inactive.'
//   })
// });

// Import or define this in your validators file
import Joi from 'joi';
import mongoose from 'mongoose';

const baseSchema = {
  name: Joi.string().min(2).max(50).messages({
    'string.empty': 'SubCategory name is required.',
    'string.min': 'SubCategory name must be at least 2 characters.',
    'string.max': 'SubCategory name must be at most 50 characters.'
  }),
  slug: Joi.string().min(2).max(100).lowercase(),
  category: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'string.empty': 'Category ID is required.',
    'any.invalid': 'Category ID must be a valid Mongo ObjectId.'
  }),
  description: Joi.string().allow('', null),
  image: Joi.string().allow('', null).messages({
    'string.uri': 'Image must be a valid URL.'
  }),
  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be either active or inactive.'
  })
};

export const subCategoryCreateValidator = Joi.object({
  name: baseSchema.name.required(),
  category: baseSchema.category.required(),
  slug: baseSchema.slug.optional(),
  description: baseSchema.description.optional(),
  image: baseSchema.image.optional(),
  status: baseSchema.status.optional()
});

export const subCategoryUpdateValidator = Joi.object({
  name: baseSchema.name.optional(),
  category: baseSchema.category.optional(),
  slug: baseSchema.slug.optional(),
  description: baseSchema.description.optional(),
  image: baseSchema.image.optional(),
  status: baseSchema.status.optional()
});
