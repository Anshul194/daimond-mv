import SizeRepository from '../repository/sizeRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class SizeService {
  constructor() {
    this.sizeRepo = new SizeRepository();
  }

  async getAllSizes(query, vendorId = null) {
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
      if (vendorId) {
        filterConditions.vendor = vendorId;
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
      const sizes = await this.sizeRepo.getAll(filterConditions, sortConditions, pageNum, limitNum);

      return sizes;
    } catch (error) {
      console.log("error size", error.message);
      throw new AppError("Cannot fetch data of all the sizes", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getSizeById(id) {
    try {
      return await this.sizeRepo.findById(id);
    } catch (error) {
      console.error('Error in getSizeById:', error);
      throw error;
    }
  }

  async createSize(data) {
    try {
      console.log('Service createSize called with:', data);
      return await this.sizeRepo.create(data);
    } catch (error) {
      console.log('Error in createSize:', error.message);
      throw error;
    }
  }

  async findByName(name, vendorId = null) {
    try {
      return await this.sizeRepo.findByName(name, vendorId);
    } catch (error) {
      console.error('Error in findByName:', error);
      throw error;
    }
  }

  async findBySizeCode(size_code, vendorId = null) {
    try {
      return await this.sizeRepo.findBySizeCode(size_code, vendorId);
    } catch (error) {
      console.error('Error in findBySizeCode:', error);
      throw error;
    }
  }

  async updateSize(id, data) {
    try {
      console.log('Service updateSize called with:', id, data);
      const updated = await this.sizeRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateSize:', error);
      throw error;
    }
  }

  async deleteSize(id) {
    try {
      console.log('Service deleteSize called with:', id);
      const deleted = await this.sizeRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteSize:', error);
      throw error;
    }
  }
}

export default SizeService;