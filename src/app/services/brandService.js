import BrandRepository from '../repository/brandRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

class BrandService {
  constructor() {
    this.brandRepo = new BrandRepository();
  }

  async getAllBrands(query) {
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
      const brands = await this.brandRepo.getAll(filterConditions, sortConditions, pageNum, limitNum);

      return brands;
    } catch (error) {
      console.log("error brands", error.message);
      throw new AppError("Cannot fetch data of all the brands", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getBrandById(id) {
    try {
      return await this.brandRepo.findById(id);
    } catch (error) {
      console.error('Error in getBrandById:', error);
      throw error;
    }
  }

  async createBrand(data) {
    try {
      console.log('Service createBrand called with:', data);
      return await this.brandRepo.create(data);
    } catch (error) {
      console.log('Error in createBrand:', error.message);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await this.brandRepo.findByName(name);
    } catch (error) {
      console.error('Error in findByName:', error);
      throw error;
    }
  }

  async updateBrand(id, data) {
    try {
      console.log('Service updateBrand called with:', id, data);
      const updated = await this.brandRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateBrand:', error);
      throw error;
    }
  }

  async deleteBrand(id) {
    try {
      console.log('Service deleteBrand called with:', id);
      const deleted = await this.brandRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteBrand:', error);
      throw error;
    }
  }
}

export default BrandService;