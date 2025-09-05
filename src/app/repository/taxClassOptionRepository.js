import TaxClassOption from '../models/TaxClassOption.js';
import CrudRepository from './crud-repository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class TaxClassOptionRepository extends CrudRepository {
  constructor() {
    super(TaxClassOption);
  }

  async findById(id) {
    try {
      return await TaxClassOption.findOne({ _id: id, deletedAt: null })
        .populate('class_id', 'name')
        .populate('country_id', 'name')
        .populate('state_id', 'name')
        .populate('city_id', 'name');
    } catch (error) {
      throw new AppError('Failed to find tax class option by ID', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByClassId(classId, vendor = null) {
    try {
      const filter = { class_id: classId, deletedAt: null };
      if (vendor) filter.vendor = vendor;
      return await TaxClassOption.find(filter)
        .populate('country_id', 'name')
        .populate('state_id', 'name')
        .populate('city_id', 'name')
        .sort({ priority: 1, createdAt: -1 });
    } catch (error) {
      throw new AppError('Failed to find tax class options by class ID', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data) {
    try {
      const doc = new TaxClassOption(data);
      return await doc.save();
    } catch (error) {
      throw new AppError('Failed to create tax class option', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id, data) {
    try {
      const taxClassOption = await TaxClassOption.findOneAndUpdate(
        { _id: id, deletedAt: null }, 
        data, 
        { new: true, runValidators: true }
      ).populate('class_id', 'name')
        .populate('country_id', 'name')
        .populate('state_id', 'name')
        .populate('city_id', 'name');
      return taxClassOption;
    } catch (error) {
      throw new AppError('Failed to update tax class option', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id) {
    try {
      return await TaxClassOption.findByIdAndUpdate(
        id, 
        { deletedAt: new Date(), deleted: true }, 
        { new: true }
      );
    } catch (error) {
      throw new AppError('Failed to delete tax class option', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTaxClassOptions(filter = {}, sort = {}, page = 1, limit = 10, populate = [], select = {}) {
    // Add deletedAt null filter
    const filterConditions = { ...filter, deletedAt: null };
    return this.getAll(filterConditions, sort, page, limit, populate, select);
  }

  async findWithPopulation(filter = {}, sort = { priority: 1, createdAt: -1 }, page = 1, limit = 10) {
    try {
      const filterConditions = { ...filter, deletedAt: null };
      const skip = (page - 1) * limit;

      const [taxClassOptions, total] = await Promise.all([
        TaxClassOption.find(filterConditions)
          .populate('class_id', 'name')
          .populate('country_id', 'name')
          .populate('state_id', 'name')
          .populate('city_id', 'name')
          .skip(skip)
          .limit(limit)
          .sort(sort),
        TaxClassOption.countDocuments(filterConditions),
      ]);

      return {
        result: taxClassOptions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalDocuments: total,
      };
    } catch (error) {
      console.error('TaxClassOptionRepository.findWithPopulation error:', error);
      throw new AppError(`Failed to fetch tax class options with population: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default TaxClassOptionRepository;
