import ProductAttributeRepository from "../repository/productAttributeRepository.js";
import AppError from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

class ProductAttributeService {
  constructor() {
    this.productAttributeRepo = new ProductAttributeRepository();
  }

  async getAllProductAttributes(query) {
    try {
      // // console.log("Query Parameters:", query);
      // Ensure query is an object
      const queryObj = query || {};
      const {
        page = 1,
        limit = 100,
        filters = "{}",
        searchFields = "{}",
        sort = "{}",
      } = queryObj;

      // Helper function to safely parse JSON strings
      const safeJsonParse = (str, defaultValue = {}) => {
        if (!str || str === '' || str === 'undefined' || str === 'null') {
          return defaultValue;
        }
        if (typeof str === 'object') {
          return str;
        }
        try {
          return JSON.parse(str);
        } catch (e) {
          // // console.warn(`Failed to parse JSON: ${str}, using default value`);
          return defaultValue;
        }
      };

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;

      // // console.log("Page Number:", pageNum);
      // // console.log("Limit Number:", limitNum);

      // Parse JSON strings from query parameters to objects
      const parsedFilters = safeJsonParse(filters, {});
      const parsedSearchFields = safeJsonParse(searchFields, {});
      const parsedSort = safeJsonParse(sort, {});

      // Build filter conditions for multiple fields
      const filterConditions = { deletedAt: null };

      // Include global attributes (vendor: null) when filtering by vendor
      if (queryObj.vendor) {
        filterConditions.$and = filterConditions.$and || [];
        filterConditions.$and.push({
          $or: [
            { vendor: queryObj.vendor },
            { vendor: null },
            { vendor: "" },
            { vendor: { $exists: false } }
          ]
        });
      }

      // Support direct id filtering
      if (queryObj.id) {
        filterConditions._id = queryObj.id;
      }

      for (const [key, value] of Object.entries(parsedFilters)) {
        // Skip null, undefined, or "null" string values
        if (value === null || value === undefined || value === "null" || value === "") {
          continue;
        }

        // Map 'category' to 'category_id' if needed
        const filterKey = key === 'category' ? 'category_id' : key;

        // Handle title filter with case-insensitive partial matching for better robustness
        if (key === 'title' && typeof value === 'string') {
          const trimmedValue = value.trim();
          // Use partial match with 'i' option to handle any case or hidden spaces
          filterConditions[filterKey] = { $regex: trimmedValue, $options: 'i' };
        } else {
          filterConditions[filterKey] = value;
        }
      }

      // Build search conditions for multiple fields with partial matching
      const searchConditions = [];
      for (const [field, term] of Object.entries(parsedSearchFields)) {
        searchConditions.push({ [field]: { $regex: term, $options: "i" } });
      }
      if (searchConditions.length > 0) {
        filterConditions.$or = searchConditions;
      }

      // Build sort conditions
      const sortConditions = {};
      for (const [field, direction] of Object.entries(parsedSort)) {
        sortConditions[field] = direction === "asc" ? 1 : -1;
      }

      // Execute query with dynamic filters, sorting, and pagination
      // // // console.log("[DEBUG] Final filterConditions for Attributes:", JSON.stringify(filterConditions, null, 2));
      const productAttributes = await this.productAttributeRepo.getAll(
        filterConditions,
        sortConditions,
        pageNum,
        limitNum
      );

      // // // console.log(`[DEBUG] Found ${productAttributes.data?.length || 0} attributes. Total: ${productAttributes.total}`);
      if (productAttributes.data?.length > 0) {
        // // // console.log("[DEBUG] First attribute title:", productAttributes.data[0].title);
      }

      return productAttributes;
    } catch (error) {
      // // // console.error("Error in getAllProductAttributes:", error.message);
      throw new AppError(
        "Cannot fetch data of all the product attributes",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProductAttributeById(id) {
    try {
      return await this.productAttributeRepo.findById(id);
    } catch (error) {
      // // // console.error("Error in getProductAttributeById:", error);
      throw error;
    }
  }

  async getProductAttributeByCategoryId(categoryId) {
    try {
      return await this.productAttributeRepo.findByCategoryId(categoryId);
    } catch (error) {
      // // // console.error("Error in getProductAttributeByCategoryId:", error);
      throw error;
    }
  }

  async createProductAttribute(data) {
    try {
      return await this.productAttributeRepo.create(data);
    } catch (error) {
      // // // console.error("Error in createProductAttribute:", error);
      throw error;
    }
  }

  async findByTitle(title) {
    try {
      return await this.productAttributeRepo.findByTitle(title);
    } catch (error) {
      // // console.error("Error in findByTitle:", error);
      throw error;
    }
  }

  async updateProductAttribute(id, data) {
    try {
      const updated = await this.productAttributeRepo.update(id, data);
      return updated;
    } catch (error) {
      // // console.error("Error in updateProductAttribute:", error);
      throw error;
    }
  }

  async deleteProductAttribute(id) {
    try {
      const deleted = await this.productAttributeRepo.softDelete(id);
      return deleted;
    } catch (error) {
      // // console.error("Error in deleteProductAttribute:", error);
      throw error;
    }
  }
}

export default ProductAttributeService;
