import TaxClassOptionRepository from '../repository/taxClassOptionRepository.js';
import TaxClassRepository from '../repository/taxClassRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class TaxClassOptionService {
  constructor() {
    this.repo = new TaxClassOptionRepository();
    this.taxClassRepo = new TaxClassRepository();
  }

  async getAllTaxClassOptions(query, vendorId = null) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        class_id,
        country_id,
        state_id,
        city_id,
        is_shipping,
        is_compound,
        search,
        sortBy = 'priority',
        sortOrder = 'asc'
      } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      const filterConditions = { deletedAt: null };
      
      // Add vendor filter if vendorId is provided
      if (vendorId) {
        filterConditions.vendor = vendorId;
      }

      if (class_id) filterConditions.class_id = class_id;
      if (country_id) filterConditions.country_id = country_id;
      if (state_id) filterConditions.state_id = state_id;
      if (city_id) filterConditions.city_id = city_id;
      if (is_shipping !== undefined) filterConditions.is_shipping = is_shipping === 'true';
      if (is_compound !== undefined) filterConditions.is_compound = is_compound === 'true';

      // Search conditions
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filterConditions.$or = [
          { tax_name: { $regex: searchRegex } },
          { postal_code: { $regex: searchRegex } }
        ];
      }

      // Sort conditions
      const sortConditions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      return await this.repo.findWithPopulation(filterConditions, sortConditions, pageNum, limitNum);
    } catch (error) {
      console.error('TaxClassOptionService.getAllTaxClassOptions error:', error);
      throw new AppError(`Failed to fetch tax class options: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getTaxClassOptionById(id) {
    try {
      const result = await this.repo.findById(id);
      if (!result) throw new AppError('Tax class option not found', StatusCodes.NOT_FOUND);
      return result;
    } catch (error) {
      throw new AppError(error.message || 'Failed to get tax class option by ID', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getTaxClassOptionsByClassId(classId, vendorId = null) {
    try {
      // Check if tax class exists
      const taxClass = await this.taxClassRepo.findById(classId);
      if (!taxClass) {
        throw new AppError('Tax class not found', StatusCodes.NOT_FOUND);
      }

      // If vendor is specified, check if tax class belongs to vendor
      if (vendorId && taxClass.vendor && taxClass.vendor.toString() !== vendorId) {
        throw new AppError('Unauthorized access to tax class', StatusCodes.FORBIDDEN);
      }

      const options = await this.repo.findByClassId(classId, vendorId);
      return {
        tax_class: taxClass,
        options: options
      };
    } catch (error) {
      throw new AppError(error.message || 'Failed to get tax class options by class ID', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createTaxClassOption(data) {
    try {
      // Validate if tax class exists
      const taxClass = await this.taxClassRepo.findById(data.class_id);
      if (!taxClass) {
        throw new AppError('Tax class not found or has been deleted', StatusCodes.BAD_REQUEST);
      }

      return await this.repo.create(data);
    } catch (error) {
      throw new AppError(error.message || 'Failed to create tax class option', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTaxClassOption(id, data) {
    try {
      // If class_id is being updated, validate it exists
      if (data.class_id) {
        const taxClass = await this.taxClassRepo.findById(data.class_id);
        if (!taxClass) {
          throw new AppError('Tax class not found or has been deleted', StatusCodes.BAD_REQUEST);
        }
      }

      const updated = await this.repo.update(id, data);
      if (!updated) throw new AppError('Tax class option not found', StatusCodes.NOT_FOUND);
      return updated;
    } catch (error) {
      throw new AppError(error.message || 'Failed to update tax class option', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTaxClassOption(id) {
    try {
      const deleted = await this.repo.softDelete(id);
      if (!deleted) throw new AppError('Tax class option not found', StatusCodes.NOT_FOUND);
      return deleted;
    } catch (error) {
      throw new AppError(error.message || 'Failed to delete tax class option', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default TaxClassOptionService;
