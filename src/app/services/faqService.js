// services/faqService.js
import FaqRepository from '../repository/faqRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class FaqService {
  constructor() {
    this.faqRepo = new FaqRepository();
  }

  async createFaq(data) {
    try {
      return await this.faqRepo.create(data);
    } catch (error) {
      console.error('Error in createFaq:', error.message);
      throw error;
    }
  }

  // async getAllFaqs(filter = {}) {
  //   try {
  //     return await this.faqRepo.findAll(filter, { createdAt: -1 });
  //   } catch (error) {
  //     console.error('Error in getAllFaqs:', error.message);
  //     throw new AppError('Cannot fetch FAQs', StatusCodes.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getAllFaqs(query) {
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

      // Build filter object with search
      let filterConditions = { deletedAt: null, ...parsedFilters };

      // Search logic: add regex filters for fields defined in searchFields
      for (const [field, value] of Object.entries(parsedSearchFields)) {
        filterConditions[field] = { $regex: value, $options: 'i' };
      }

      const skip = (pageNum - 1) * limitNum;

      // Fetch filtered, paginated, sorted results
      const faqs = await this.faqRepo.findAll(filterConditions, parsedSort, skip, limitNum);

      // Count total matching docs (for frontend pagination)
      const totalCount = await this.faqRepo.countDocuments(filterConditions);

      return {
        docs: faqs,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      };
    } catch (error) {
      console.error('Error in getAllFaqs:', error.message);
      throw new AppError('Cannot fetch FAQs', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getFaqById(id) {
    try {
      const faq = await this.faqRepo.findById(id);
      if (!faq) throw new AppError('FAQ not found', StatusCodes.NOT_FOUND);
      return faq;
    } catch (error) {
      console.error('Error in getFaqById:', error.message);
      throw error;
    }
  }

  async findByTitle(title) {
  try {
    return await this.faqRepo.findByTitle(title);
  } catch (error) {
    console.error('Error in findByTitle:', error.message);
    throw error;
  }
}


  async updateFaq(id, data) {
    try {
      const updated = await this.faqRepo.update(id, data);
      if (!updated) throw new AppError('FAQ not found', StatusCodes.NOT_FOUND);
      return updated;
    } catch (error) {
      console.error('Error in updateFaq:', error.message);
      throw error;
    }
  }

  async deleteFaq(id) {
    try {
      const deleted = await this.faqRepo.softDelete(id);
      if (!deleted) throw new AppError('FAQ not found', StatusCodes.NOT_FOUND);
      return deleted;
    } catch (error) {
      console.error('Error in deleteFaq:', error.message);
      throw error;
    }
  }
}

export default FaqService;
