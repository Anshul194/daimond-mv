import DiamondRepository from '../repository/diamondRepository.js';
import AppError from '../utils/errors/app-error';
import { StatusCodes } from 'http-status-codes';

class DiamondService {
  constructor() {
    this.diamondRepo = new DiamondRepository();
  }

async getAllDiamonds(query) {
  try {
    const {
      page = 1,
      limit = 10,
      filters = '{}',
      searchFields = '{}',
      sort = '{}',
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const parsedFilters = JSON.parse(filters);
    const parsedSearchFields = JSON.parse(searchFields);
    const parsedSort = JSON.parse(sort);

    let filterConditions = {};

    // ✅ Updated: Case-insensitive exact match for string filters
    for (const [key, value] of Object.entries(parsedFilters)) {
      if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
        filterConditions[key] = {};
        if (value.min !== undefined) filterConditions[key]['$gte'] = value.min;
        if (value.max !== undefined) filterConditions[key]['$lte'] = value.max;
      } else {
        // Case-insensitive regex match for strings
        filterConditions[key] = typeof value === 'string'
          ? { $regex: `^${value}$`, $options: 'i' }
          : value;
      }
    }

    // ✅ Partial match (searchFields) - already using regex
    for (const [field, value] of Object.entries(parsedSearchFields)) {
      filterConditions[field] = { $regex: value, $options: 'i' };
    }

    const skip = (pageNum - 1) * limitNum;
    const docs = await this.diamondRepo.findAll(filterConditions, parsedSort, skip, limitNum);
    const total = await this.diamondRepo.countDocuments(filterConditions);

    return {
      docs,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  } catch (err) {
    console.error('Service error:', err.message);
    throw new AppError('Cannot fetch diamonds', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

  
}

export default DiamondService;
