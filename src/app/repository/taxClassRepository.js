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

  async findByName(name) {
    try {
      return await TaxClass.findOne({ name, deletedAt: null });
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
      const taxClass = await TaxClass.findById(id);
      if (!taxClass) return null;

      taxClass.set(data);
      return await taxClass.save();
    } catch (error) {
      throw new AppError('Failed to update tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id) {
    try {
      return await TaxClass.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    } catch (error) {
      throw new AppError('Failed to delete tax class', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default TaxClassRepository;
