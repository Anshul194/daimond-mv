import ReviewRepository from '../repository/reviewRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class ReviewService {
  constructor() {
    this.reviewRepo = new ReviewRepository();
  }

  async getAllReviews(query) {
    try {
      console.log("Query Parameters:", query);
      const {
        page = 1,
        limit = 10,
        filters = "{}",
        searchFields = "{}",
        sort = "{}"
      } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const parsedFilters = JSON.parse(filters);
      const parsedSearchFields = JSON.parse(searchFields);
      const parsedSort = JSON.parse(sort);

      const filterConditions = { deletedAt: null };

      // Add filters
      for (const [key, value] of Object.entries(parsedFilters)) {
        if (key === 'rating') {
          filterConditions[key] = parseInt(value);
        } else if (key === 'targetType' || key === 'user' || key === 'product') {
          filterConditions[key] = value;
        } else {
          filterConditions[key] = value;
        }
      }

      // Add search with $regex
      const searchConditions = [];
      for (const [field, term] of Object.entries(parsedSearchFields)) {
        if (field === 'comment') {
          searchConditions.push({ [field]: { $regex: term, $options: "i" } });
        }
      }
      if (searchConditions.length > 0) {
        filterConditions.$or = searchConditions;
      }

      // Add sorting
      const sortConditions = {};
      for (const [field, direction] of Object.entries(parsedSort)) {
        sortConditions[field] = direction === "asc" ? 1 : -1;
      }

      const reviews = await this.reviewRepo.getAll(
        filterConditions,
        sortConditions,
        pageNum,
        limitNum
      );

      return reviews;
    } catch (error) {
      console.error("Error in getAllReviews:", error.message);
      throw new AppError("Cannot fetch reviews", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getReviewById(id) {
    try {
      return await this.reviewRepo.findById(id);
    } catch (error) {
      console.error('Error in getReviewById:', error);
      throw error;
    }
  }

  async createReview(data) {
    try {
      console.log('Service createReview called with:', data);
      return await this.reviewRepo.create(data);
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  async updateReview(id, data) {
    try {
      console.log('Service updateReview called with:', id, data);
      const updated = await this.reviewRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateReview:', error);
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      console.log('Service deleteReview called with:', id);
      const deleted = await this.reviewRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteReview:', error);
      throw error;
    }
  }

  // Additional methods for specific use cases
  async getReviewsByProduct(productId, query = {}) {
    try {
      const filters = { product: productId, deletedAt: null };
      return await this.reviewRepo.getAll(filters, { createdAt: -1 }, query.page || 1, query.limit || 10);
    } catch (error) {
      console.error('Error in getReviewsByProduct:', error);
      throw error;
    }
  }

  async getReviewsByUser(userId, query = {}) {
    try {
      const filters = { user: userId, deletedAt: null };
      return await this.reviewRepo.getAll(filters, { createdAt: -1 }, query.page || 1, query.limit || 10);
    } catch (error) {
      console.error('Error in getReviewsByUser:', error);
      throw error;
    }
  }

  async getWebsiteReviews(query = {}) {
    try {
      const filters = { isWebsiteReview: true, deletedAt: null };
      return await this.reviewRepo.getAll(filters, { createdAt: -1 }, query.page || 1, query.limit || 10);
    } catch (error) {
      console.error('Error in getWebsiteReviews:', error);
      throw error;
    }
  }
}

export default ReviewService;