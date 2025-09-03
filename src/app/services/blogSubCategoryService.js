import BlogSubCategoryRepository from '../repository/blogSubCategoryRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

class BlogSubCategoryService {
  constructor() {
    this.blogSubCategoryRepo = new BlogSubCategoryRepository();
  }

  async getAllBlogSubCategories(query) {
    try {
      console.log("Query Parameters:", query);
      const { page = 1, limit = 10, filters = "{}", searchFields = "{}", sort = "{}" } = query;

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
      const blogSubCategories = await this.blogSubCategoryRepo.getAll(filterConditions, sortConditions, pageNum, limitNum);

      return blogSubCategories;
    } catch (error) {
      console.log("error blog subcategories", error.message);
      throw new AppError("Cannot fetch data of all the blog subcategories", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getBlogSubCategoryById(id) {
    try {
      return await this.blogSubCategoryRepo.findById(id);
    } catch (error) {
      console.error('Error in getBlogSubCategoryById:', error);
      throw error;
    }
  }

  async createBlogSubCategory(data) {
    try {
      console.log('Service createBlogSubCategory called with:', data);
      return await this.blogSubCategoryRepo.create(data);
    } catch (error) {
      console.log('Error in createBlogSubCategory:', error.message);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await this.blogSubCategoryRepo.findByName(name);
    } catch (error) {
      console.error('Error in findByName:', error);
      throw error;
    }
  }

  async updateBlogSubCategory(id, data) {
    try {
      console.log('Service updateBlogSubCategory called with:', id, data);
      const updated = await this.blogSubCategoryRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateBlogSubCategory:', error);
      throw error;
    }
  }

  async deleteBlogSubCategory(id) {
    try {
      console.log('Service deleteBlogSubCategory called with:', id);
      const deleted = await this.blogSubCategoryRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteBlogSubCategory:', error);
      throw error;
    }
  }
async getSubCategoriesByCategoryId(categoryId) {
  try {
    return await this.blogSubCategoryRepo.getByCategoryId(categoryId);
  } catch (error) {
    console.error('Service getSubCategoriesByCategoryId error:', error);
    throw error;
  }
}

async getByCategoryId(categoryId) {
  try {
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    console.log('Converted ObjectId:', categoryObjectId);

    const result = await BlogSubCategory.find({
      BlogCategory: categoryObjectId,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    console.log('Found subcategories:', result.length);
    return result;
  } catch (error) {
    console.error('Repo getByCategoryId error:', error);
    throw error;
  }
}

}

export default BlogSubCategoryService;