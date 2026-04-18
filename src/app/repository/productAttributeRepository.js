import ProductAttribute from "../models/productAttribute.js";
import mongoose from "mongoose";

class ProductAttributeRepository {
  async findAll() {
    try {
      return await ProductAttribute.find({ deletedAt: null }).populate(
        "category_id"
      );
    } catch (error) {
      console.error("Repo findAll error:", error);
      throw error;
    }
  }

  async getAll(filterConditions, sortConditions, page, limit) {
    try {
      const skip = (page - 1) * limit;
      const query = ProductAttribute.find(filterConditions)
        .populate("category_id")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

      const total = await ProductAttribute.countDocuments(filterConditions);
      const data = await query.exec();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Repo getAll error:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await ProductAttribute.findOne({
        _id: id,
        deletedAt: null,
      }).populate("category_id");
    } catch (error) {
      console.error("Repo findById error:", error);
      throw error;
    }
  }

  async create(data) {
    try {
      console.log("Repo create data:", data);

      // Clean the data before creating
      const cleanData = {
        ...data,
        // Ensure terms is properly structured
        terms: Array.isArray(data.terms)
          ? data.terms.map((term) => ({
              value:
                typeof term.value === "string" ? term.value.trim() : term.value,
              image: term.image || "",
            }))
          : [],
        // Handle undefined lastModifiedBy.id
        lastModifiedBy: {
          ...data.lastModifiedBy,
          id: data.lastModifiedBy?.id || null, // Set to null if undefined
        },
      };

      console.log("Cleaned data:", cleanData);

      const productAttribute = new ProductAttribute(cleanData);
      return await productAttribute.save();
    } catch (error) {
      console.error("Repo create error:", error);
      console.error("Validation errors:", error.errors);
      throw error;
    }
  }

  async findByTitle(title) {
    try {
      return await ProductAttribute.findOne({
        title,
        deletedAt: null,
      }).populate("category_id");
    } catch (error) {
      console.error("Repo findByTitle error:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const ProductAttributeModel = mongoose.models.ProductAttribute;
      const attribute = await ProductAttributeModel.findById(id);
      if (!attribute) return null;

      attribute.set(data);
      return await attribute.save();
    } catch (err) {
      console.error("Repo update error:", err);
      throw err;
    }
  }

  async findByCategoryId(categoryId) {
    try {
      return await ProductAttribute.find({
        category_id: categoryId,
        deletedAt: null,
      }).populate("category_id");
    } catch (err) {
      console.error("Repo findByCategoryId error:", err);
      throw err;
    }
  }

  async getAttributesWithProducts(filterConditions, sortConditions, page, limit) {
    try {
      const skip = (page - 1) * limit;
      // 1. Fetch the attributes first
      const attributes = await ProductAttribute.find(filterConditions)
        .populate("category_id")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ProductAttribute.countDocuments(filterConditions);

      // 2. For each attribute and each term, find associated products
      const Product = mongoose.models.Product;
      const ProductInventoryDetailAttribute = mongoose.models.ProductInventoryDetailAttribute;

      for (let attr of attributes) {
        if (attr.terms && Array.isArray(attr.terms)) {
          for (let term of attr.terms) {
            // Find unique product IDs that have this attribute name and value
            const mappings = await ProductInventoryDetailAttribute.find({
              attribute_name: attr.title, // e.g. "Home page Styles"
              attribute_value: term.value, // e.g. "Vintage"
              deletedAt: null
            }).select('product_id').lean();

            const productIds = [...new Set(mappings.map(m => m.product_id.toString()))];

            if (productIds.length > 0) {
              // Fetch basic product info to show on homepage
              term.products = await Product.find({
                _id: { $in: productIds },
                deletedAt: null,
                status: 'active'
              }).select('name slug image price saleprice').limit(12).lean();
            } else {
              term.products = [];
            }
          }
        }
      }

      return {
        data: attributes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Repo getAttributesWithProducts error:", error);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      return await ProductAttribute.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    } catch (err) {
      console.error("Repo softDelete error:", err);
      throw err;
    }
  }
}

export default ProductAttributeRepository;
