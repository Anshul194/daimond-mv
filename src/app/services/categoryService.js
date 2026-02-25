import CategoryRepository from '../repository/categoryRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import SubCategory from '../models/SubCategory.js'; // Ensure this import is correct
class CategoryService {
  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  // async getAllCategories() {
  //   try {
  //     return await this.categoryRepo.findAll();
  //   } catch (error) {
  //     console.error('Error in getAllCategories:', error);
  //     throw error;
  //   }
  // }


  async getSubCategoriesByCategoryId(categoryId) {
    try {
      console.log('Fetching subcategories for categoryId:', categoryId);

      if (!categoryId) {
        throw new AppError('categoryId is required', StatusCodes.BAD_REQUEST);
      }

      // Convert to ObjectId if valid, otherwise use as string
      let categoryIdQuery;
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        categoryIdQuery = new mongoose.Types.ObjectId(categoryId);
      } else {
        // Try to find by string match if not a valid ObjectId
        console.warn('categoryId is not a valid ObjectId, trying string match:', categoryId);
        categoryIdQuery = categoryId;
      }

      const subCategories = await SubCategory.find({
        category: categoryIdQuery,
        deletedAt: null
      }).lean();

      console.log('Subcategories found:', subCategories?.length || 0);

      return subCategories || [];
    } catch (error) {
      console.error('Error in getSubCategoriesByCategoryId:', error.message);
      console.error('Error stack:', error.stack);
      // Re-throw AppError as-is, wrap other errors
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Cannot fetch subcategories: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCategories(query) {
    try {
      console.log("Query Parameters:", query);
      // Ensure query is an object
      const queryObj = query || {};
      const { page = 1, limit = 100, filters = "{}", searchFields = "{}", sort = "{}" } = queryObj;

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 100;

      // console.log("Filter Conditions:", filterConditions);
      // console.log("Sort Conditions:", sortConditions);
      console.log("Page Number:", pageNum);
      console.log("Limit Number:", limitNum);

      // Helper function to safely parse JSON strings
      const safeJsonParse = (str, defaultValue = {}) => {
        if (!str || str === '' || str === 'undefined' || str === 'null') {
          return defaultValue;
        }
        try {
          return JSON.parse(str);
        } catch (e) {
          console.warn(`Failed to parse JSON: ${str}, using default value`);
          return defaultValue;
        }
      };

      // Parse JSON strings from query parameters to objects
      const parsedFilters = safeJsonParse(filters, {});
      const parsedSearchFields = safeJsonParse(searchFields, {});
      const parsedSort = safeJsonParse(sort, {});


      // Build filter conditions for multiple fields
      const filterConditions = { deletedAt: null };

      // Always apply vendor filter if present in query
      if (queryObj.vendor) {
        filterConditions.vendor = queryObj.vendor;
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
        if (field && (direction === "asc" || direction === "desc")) {
          sortConditions[field] = direction === "asc" ? 1 : -1;
        }
      }

      // Execute query with dynamic filters, sorting, and pagination
      const courseCategories = await this.categoryRepo.getAll(filterConditions, sortConditions, pageNum, limitNum);

      return courseCategories;
    } catch (error) {
      console.log("error category", error.message);
      throw new AppError("Cannot fetch data of all the courseCategories", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }


  async getCategoryById(id) {
    try {
      return await this.categoryRepo.findById(id);
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      throw error;
    }
  }

  async createCategory(data) {
    try {
      return await this.categoryRepo.create(data);
      console.log('Service createCategory called with:', data);

    } catch (error) {
      console.log('Error in createCategory:', error.message);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await this.categoryRepo.findByName(name);
    } catch (error) {
      console.error('Error in findByName:', error);
      throw error;
    }
  }

  async updateCategory(id, data) {
    try {
      console.log('Service updateCategory called with:', id, data);
      const updated = await this.categoryRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      console.log('Service deleteCategory called with:', id);
      const deleted = await this.categoryRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  }
}

export default CategoryService;
