import SubCategoryRepository from '../repository/subCategoryRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class SubCategoryService {
  constructor() {
    this.subCategoryRepo = new SubCategoryRepository();
  }

 async getAllSubCategories(query) {
  try {
    console.log("Query Parameters:", query);
    const {
      page = 1,
      limit = 10,
      filters = "{}",
      searchFields = "{}",
      sort = "{}"
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const parsedFilters = JSON.parse(filters);
    const parsedSearchFields = JSON.parse(searchFields);
    const parsedSort = JSON.parse(sort);

    const filterConditions = { deletedAt: null };

    // Add filters
    for (const [key, value] of Object.entries(parsedFilters)) {
      filterConditions[key] = value;
    }

    // Add search with $regex
    const searchConditions = [];
    for (const [field, term] of Object.entries(parsedSearchFields)) {
      searchConditions.push({ [field]: { $regex: term, $options: "i" } });
    }
    if (searchConditions.length > 0) {
      filterConditions.$or = searchConditions;
    }

    // Add sorting
    const sortConditions = {};
    for (const [field, direction] of Object.entries(parsedSort)) {
      sortConditions[field] = direction === "asc" ? 1 : -1;
    }

    const subCategories = await this.subCategoryRepo.getAll(
      filterConditions,
      sortConditions,
      pageNum,
      limitNum
    );

    return subCategories;
  } catch (error) {
    console.error("Error in getAllSubCategories:", error.message);
    throw new AppError("Cannot fetch subCategories", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


  async getSubCategoryById(id) {
    try {
      return await this.subCategoryRepo.findById(id);
    } catch (error) {
      console.error('Error in getSubCategoryById:', error);
      throw error;
    }
  }

  async createSubCategory(data) {
    try {
      return await this.subCategoryRepo.create(data);
      console.log('Service createSubCategory called with:', data);
      
    } catch (error) {
      console.error('Error in createSubCategory:', error);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await this.subCategoryRepo.findByName(name);
    } catch (error) {
      console.error('Error in findByName:', error);
      throw error;
    }
  }

  async updateSubCategory(id, data) {
    try {
      console.log('Service updateSubCategory called with:', id, data);
      const updated = await this.subCategoryRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateSubCategory:', error);
      throw error;
    }
  }

  async deleteSubCategory(id) {
    try {
      console.log('Service deleteSubCategory called with:', id);
      const deleted = await this.subCategoryRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteSubCategory:', error);
      throw error;
    }
  }
}

export default SubCategoryService;
