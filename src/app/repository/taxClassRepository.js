
import TaxClass from '../models/TaxClass.js';
import TaxClassOption from '../models/TaxClassOption.js';
import CrudRepository from './crud-repository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class TaxClassRepository extends CrudRepository {
  constructor() {
    super(TaxClass);
  }

  async findById(id) {
    try {
      return await TaxClass.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      throw new AppError('Failed to find tax class by ID', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(name, vendor = null) {
    try {
      const filter = { name, deletedAt: null };
      if (vendor) filter.vendor = vendor;
      return await TaxClass.findOne(filter);
    } catch (error) {
      throw new AppError('Failed to find tax class by name', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data) {
    try {
      const doc = new TaxClass(data);
      return await doc.save();
    } catch (error) {
      throw new AppError('Failed to create tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id, data) {
    try {
      const taxClass = await TaxClass.findOneAndUpdate(
        { _id: id, deletedAt: null },
        data,
        { new: true }
      );
      return taxClass;
    } catch (error) {
      throw new AppError('Failed to update tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id) {
    try {
      return await TaxClass.findByIdAndUpdate(
        id,
        { deletedAt: new Date(), deleted: true },
        { new: true }
      );
    } catch (error) {
      throw new AppError('Failed to delete tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTaxClasses(filter = {}, sort = {}, page = 1, limit = 10, populate = [], select = {}) {
    try {
      // Add deletedAt null filter
      const filterConditions = { ...filter, deletedAt: null };

      // Ensure vendor is always populated
      const populateFields = [
        { path: 'vendor', select: 'username email storeName contactNumber role isActive' },
        ...populate
      ];

      return this.getAll(filterConditions, sort, page, limit, populateFields, select);
    } catch (error) {
      console.error('Error in getAllTaxClasses:', error);
      throw error;
    }
  }

  async getActiveTaxClassesWithOptions(vendorId = null) {
    try {
      // First get active tax classes
      const filter = { isActivated: true, deletedAt: null };
      if (vendorId) {
        filter.vendor = vendorId;
      }

      const activeTaxClasses = await TaxClass.find(filter).sort({ createdAt: -1 });

      // Then get their options
      const classIds = activeTaxClasses.map(tc => tc._id);
      const options = await TaxClassOption.find({
        class_id: { $in: classIds },
        deletedAt: null
      })
        .populate('country_id', 'name')
        .populate('state_id', 'name')
        .populate('city_id', 'name')
        .sort({ priority: 1 });

      // Group options by class_id
      const optionsByClass = options.reduce((acc, option) => {
        const classId = option.class_id.toString();
        if (!acc[classId]) acc[classId] = [];
        acc[classId].push(option);
        return acc;
      }, {});

      // Attach options to tax classes
      const result = activeTaxClasses.map(taxClass => ({
        ...taxClass.toObject(),
        options: optionsByClass[taxClass._id.toString()] || []
      }));

      return result;
    } catch (error) {
      console.error('Error in getActiveTaxClassesWithOptions:', error);
      throw new AppError(error.message || 'Failed to get active tax classes with options', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default TaxClassRepository;
