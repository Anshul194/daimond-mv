import Diamond from '../models/diamond.js';
import CrudRepository from './crud-repository';

class DiamondRepository extends CrudRepository {
  constructor() {
    super(Diamond);
  }

  async findAll(filter = {}, sort = {}, skip = 0, limit = 10) {
    try {
      return await Diamond.find(filter).sort(sort).skip(skip).limit(limit);
    } catch (error) {
      console.error('DiamondRepo findAll error:', error);
      throw error;
    }
  }

  async countDocuments(filter = {}) {
    try {
      return await Diamond.countDocuments(filter);
    } catch (error) {
      console.error('DiamondRepo countDocuments error:', error);
      throw error;
    }
  }
}

export default DiamondRepository;
