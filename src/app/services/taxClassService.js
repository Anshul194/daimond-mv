import TaxClassRepository from '../repository/taxClassRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class TaxClassService {
  constructor() {
    this.repo = new TaxClassRepository();
  }

  async getAllTaxClasses(query) {
    try {
      const { page = 1, limit = 10, filters = '{}', searchFields = '{}', sort = '{}' } = query;

      const parsedFilters = JSON.parse(filters);
      const parsedSearch = JSON.parse(searchFields);
      const parsedSort = JSON.parse(sort);

      const conditions = { deletedAt: null };

      for (const [key, val] of Object.entries(parsedFilters)) {
        conditions[key] = val;
      }

      const searchConditions = Object.entries(parsedSearch).map(([k, v]) => ({
        [k]: { $regex: v, $options: 'i' }
      }));

      if (searchConditions.length > 0) {
        conditions.$or = searchConditions;
      }

      const sortBy = {};
      for (const [field, dir] of Object.entries(parsedSort)) {
        sortBy[field] = dir === 'asc' ? 1 : -1;
      }

      return await this.repo.getAll(conditions, sortBy, parseInt(page), parseInt(limit));
    } catch (error) {
      throw new AppError('Failed to fetch tax classes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getTaxClassById(id) {
    try {
      const result = await this.repo.findById(id);
      if (!result) throw new AppError('Tax class not found', StatusCodes.NOT_FOUND);
      return result;
    } catch (error) {
      throw new AppError(error.message || 'Failed to get tax class by ID', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createTaxClass(data) {
    try {
      return await this.repo.create(data);
    } catch (error) {
      throw new AppError('Failed to create tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(name) {
    try {
      return await this.repo.findByName(name);
    } catch (error) {
      throw new AppError('Failed to find tax class by name', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTaxClass(id, data) {
    try {
      const updated = await this.repo.update(id, data);
      if (!updated) throw new AppError('Tax class not found', StatusCodes.NOT_FOUND);
      return updated;
    } catch (error) {
      throw new AppError(error.message || 'Failed to update tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id) {
    try {
      const deleted = await this.repo.softDelete(id);
      if (!deleted) throw new AppError('Tax class not found', StatusCodes.NOT_FOUND);
      return deleted;
    } catch (error) {
      throw new AppError(error.message || 'Failed to delete tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default TaxClassService;
