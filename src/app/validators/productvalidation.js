import Joi, { optional } from "joi";

const baseProductSchema = {
  name: Joi.string().min(2).max(191).trim().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name must be at most 191 characters.",
    "any.required": "Name is required.",
  }),

  //category_id
  category_id: Joi.optional().allow(null).messages({
    "any.required": "Category ID is required.",
  }),

  //subcategory_id
  subCategory_id: Joi.optional().allow(null).messages({
    "any.required": "subCategory ID is required.",
  }),

  slug: Joi.string().min(2).max(191).trim().messages({
    "string.empty": "Slug is required.",
    "string.min": "Slug must be at least 2 characters.",
    "string.max": "Slug must be at most 191 characters.",
    "any.required": "Slug is required.",
  }),

  summary: Joi.string().min(2).max(500).trim().allow(null).optional().messages({
    "string.min": "Summary must be at least 2 characters.",
    "string.max": "Summary must be at most 500 characters.",
  }),

  description: Joi.string()
    .min(5)
    .max(2000)
    .trim()
    .allow(null)
    .optional()
    .messages({
      "string.min": "Description must be at least 5 characters.",
      "string.max": "Description must be at most 2000 characters.",
    }),

  image: Joi.array().max(5).allow(null).optional().messages({
    "array.max": "Image array must contain at most 5 items.",
  }),

  price: Joi.number().positive().precision(2).allow(null).optional().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
  }),

  saleprice: Joi.number()
    .positive()
    .precision(2)
    .allow(null)
    .optional()
    .when("price", {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref("price")).messages({
        "number.max": "Sale price cannot be greater than price.",
      }),
    })
    .messages({
      "number.base": "Sale price must be a number.",
      "number.positive": "Sale price must be positive.",
    }),

  cost: Joi.number().positive().precision(2).allow(null).optional().messages({
    "number.base": "Cost must be a number.",
    "number.positive": "Cost must be positive.",
  }),

  badge_id: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "Badge ID must be a number.",
    "number.integer": "Badge ID must be an integer.",
    "number.positive": "Badge ID must be positive.",
  }),

  brand_id: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "Brand ID must be a number.",
    "number.integer": "Brand ID must be an integer.",
    "number.positive": "Brand ID must be positive.",
  }),

  status: Joi.string().valid("active", "inactive").default("active").messages({
    "any.only": "Status must be either active or inactive.",
  }),

  product_type: Joi.number().integer().positive().default(1).messages({
    "number.base": "Product type must be a number.",
    "number.integer": "Product type must be an integer.",
    "number.positive": "Product type must be positive.",
  }),

  sold_count: Joi.number().integer().min(0).allow(null).optional().messages({
    "number.base": "Sold count must be a number.",
    "number.integer": "Sold count must be an integer.",
    "number.min": "Sold count cannot be negative.",
  }),

  min_purchase: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Minimum purchase must be a number.",
      "number.integer": "Minimum purchase must be an integer.",
      "number.positive": "Minimum purchase must be positive.",
    }),

  max_purchase: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .when("min_purchase", {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref("min_purchase")).messages({
        "number.min":
          "Maximum purchase must be greater than or equal to minimum purchase.",
      }),
    })
    .messages({
      "number.base": "Maximum purchase must be a number.",
      "number.integer": "Maximum purchase must be an integer.",
      "number.positive": "Maximum purchase must be positive.",
    }),

  is_refundable: Joi.boolean().allow(null).optional().messages({
    "boolean.base": "Is refundable must be a boolean.",
  }),

  is_in_house: Joi.boolean().default(true).messages({
    "boolean.base": "Is in house must be a boolean.",
  }),

  is_inventory_warn_able: Joi.boolean().allow(null).optional().messages({
    "boolean.base": "Is inventory warnable must be a boolean.",
  }),

  admin_id: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "Admin ID must be a number.",
    "number.integer": "Admin ID must be an integer.",
    "number.positive": "Admin ID must be positive.",
  }),

  vendor_id: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "Vendor ID must be a number.",
    "number.integer": "Vendor ID must be an integer.",
    "number.positive": "Vendor ID must be positive.",
  }),

  is: Joi.boolean().allow(null).optional().messages({
    "boolean.base": "Is must be a boolean.",
  }),

  isTaxable: Joi.any().default(false).messages({
    "boolean.base": "Is taxable must be a boolean.",
    "any.only": "Is taxable must be true or false.",
  }),

  taxClass: Joi.optional().allow(null).messages({
    "any.required": "taxClass ID is required.",
  }),
  gender: Joi.string().valid("man", "woman", "both").default("both").messages({
    "any.only": "Gender must be either man, woman, or both.",
  }),
   is_diamond: Joi.boolean().default(false).messages({
    "boolean.base": "Is diamond must be a boolean.",
  }),
};

// 🎯 Create Validator
export const productCreateValidator = Joi.object({
  name: baseProductSchema.name,
  category_id: baseProductSchema.category_id,
  subCategory_id: baseProductSchema.subCategory_id,
  slug: baseProductSchema.slug,
  summary: baseProductSchema.summary,
  description: baseProductSchema.description,
  image: baseProductSchema.image,
  price: baseProductSchema.price,
  saleprice: baseProductSchema.saleprice,
  cost: baseProductSchema.cost,
  badge_id: baseProductSchema.badge_id,
  brand_id: baseProductSchema.brand_id,
  status: baseProductSchema.status,
  product_type: baseProductSchema.product_type,
  sold_count: baseProductSchema.sold_count,
  min_purchase: baseProductSchema.min_purchase,
  max_purchase: baseProductSchema.max_purchase,
  is_refundable: baseProductSchema.is_refundable,
  is_in_house: baseProductSchema.is_in_house,
  is_inventory_warn_able: baseProductSchema.is_inventory_warn_able,
  admin_id: baseProductSchema.admin_id,
  vendor_id: baseProductSchema.vendor_id,
  isTaxable: baseProductSchema.isTaxable,
  taxClass: baseProductSchema.taxClass,
  gender: baseProductSchema.gender,
  is_diamond: baseProductSchema.is_diamond,
});

// 🎯 Update Validator (all fields optional for updates)
export const productUpdateValidator = Joi.object({
  name: baseProductSchema.name.optional(),
  category_id: baseProductSchema.category_id.optional(),
  subCategory_id: baseProductSchema.subCategory_id.optional(),
  slug: baseProductSchema.slug.optional(),
  summary: baseProductSchema.summary.optional(),
  description: baseProductSchema.description.optional(),
  image: baseProductSchema.image.optional(),
  price: baseProductSchema.price.optional(),
  saleprice: baseProductSchema.saleprice.optional(),
  cost: baseProductSchema.cost.optional(),
  badge_id: baseProductSchema.badge_id.optional(),
  brand_id: baseProductSchema.brand_id.optional(),
  status: baseProductSchema.status.optional(),
  product_type: baseProductSchema.product_type.optional(),
  sold_count: baseProductSchema.sold_count.optional(),
  min_purchase: baseProductSchema.min_purchase.optional(),
  max_purchase: baseProductSchema.max_purchase.optional(),
  is_refundable: baseProductSchema.is_refundable.optional(),
  is_in_house: baseProductSchema.is_in_house.optional(),
  is_inventory_warn_able: baseProductSchema.is_inventory_warn_able.optional(),
  admin_id: baseProductSchema.admin_id.optional(),
  vendor_id: baseProductSchema.vendor_id.optional(),
  isTaxable: baseProductSchema.isTaxable.optional(),
  taxClass: baseProductSchema.taxClass.optional(),
  gender: baseProductSchema.gender,
  is_diamond: baseProductSchema.is_diamond.optional(),
});
