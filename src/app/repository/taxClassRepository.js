import TaxClass from '../models/TaxClass.js';
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

}

export default TaxClassRepository;
