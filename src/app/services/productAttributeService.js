import ProductAttributeRepository from "../repository/productAttributeRepository.js";
import AppError from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

class ProductAttributeService {
  constructor() {
    this.productAttributeRepo = new ProductAttributeRepository();
  }

  async getAllProductAttributes(query) {
    try {
      console.log("Query Parameters:", query);
      const {
        page = 1,
        limit = 10,
        filters = "{}",
        searchFields = "{}",
        sort = "{}",
      } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      console.log("Page Number:", pageNum);
      console.log("Limit Number:", limitNum);

      // Parse JSON strings from query parameters to objects
      const parsedFilters = JSON.parse(filters);
      const parsedSearchFields = JSON.parse(searchFields);
      const parsedSort = JSON.parse(sort);

      // Build filter conditions for multiple fields
      const filterConditions = { deletedAt: null };

      // Always apply vendor filter if present in query
      if (query.vendor) {
        filterConditions.vendor = query.vendor;
      }

      for (const [key, value] of Object.entries(parsedFilters)) {
        filterConditions[key] = value;
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
      const productAttributes = await this.productAttributeRepo.getAll(
        filterConditions,
        sortConditions,
        pageNum,
        limitNum
      );

      return productAttributes;
    } catch (error) {
      console.error("Error in getAllProductAttributes:", error.message);
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
      console.error("Error in getProductAttributeById:", error);
      throw error;
    }
  }

  async getProductAttributeByCategoryId(categoryId) {
    try {
      return await this.productAttributeRepo.findByCategoryId(categoryId);
    } catch (error) {
      console.error("Error in getProductAttributeByCategoryId:", error);
      throw error;
    }
  }

  async createProductAttribute(data) {
    try {
      return await this.productAttributeRepo.create(data);
    } catch (error) {
      console.error("Error in createProductAttribute:", error);
      throw error;
    }
  }

  async findByTitle(title) {
    try {
      return await this.productAttributeRepo.findByTitle(title);
    } catch (error) {
      console.error("Error in findByTitle:", error);
      throw error;
    }
  }

  async updateProductAttribute(id, data) {
    try {
      const updated = await this.productAttributeRepo.update(id, data);
      return updated;
    } catch (error) {
      console.error("Error in updateProductAttribute:", error);
      throw error;
    }
  }

  async deleteProductAttribute(id) {
    try {
      const deleted = await this.productAttributeRepo.softDelete(id);
      return deleted;
    } catch (error) {
      console.error("Error in deleteProductAttribute:", error);
      throw error;
    }
  }
}

export default ProductAttributeService;
