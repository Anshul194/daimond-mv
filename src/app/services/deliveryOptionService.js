import DeliveryOptionRepository from '../repository/deliveryOptionRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

class DeliveryOptionService {
  constructor() {
    this.deliveryOptionRepo = new DeliveryOptionRepository();
  }

  async getAllDeliveryOptions(query) {
    try {
      console.log("Query Parameters:", query);
      const { page = 1, limit = 10, filters = "{}", searchFields = "{}", sort = "{}" } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      console.log("Page Number:", pageNum);
      console.log("Limit Number:", limitNum);

      // Parse JSON strings from query parameters to objects
      const parsedFilters = JSON.parse(filters);
      const parsedSearchFields = JSON.parse(searchFields);
      const parsedSort = JSON.parse(sort);

      // Build filter conditions for multiple fields
      const filterConditions = { deletedAt: null };

      for (const [key, value] of Object.entries(parsedFilters)) {
        filterConditions[key] = value;
      }

      // Build search conditions for multiple fields with partial matching
      const searchConditions = [];
      for (const [field, term] of Object.entries(parsedSearchFields)) {
        searchConditions.push({ [field]: { $regex: term, $options: "i" } });
      }
      if (searchConditions.length > 0) {
        filterConditions.$or = searchConditions;
      }

      // Build sort conditions
      const sortConditions = {};
      for (const [field, direction] of Object.entries(parsedSort)) {
        sortConditions[field] = direction === "asc" ? 1 : -1;
      }

      // Execute query with dynamic filters, sorting, and pagination
      const deliveryOptions = await this.deliveryOptionRepo.getAll(filterConditions, sortConditions, pageNum, limitNum);

      return deliveryOptions;
    } catch (error) {
      console.log("error delivery options", error.message);
      throw new AppError("Cannot fetch data of all the delivery options", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getDeliveryOptionById(id) {
    try {
      return await this.deliveryOptionRepo.findById(id);
    } catch (error) {
      console.error('Error in getDeliveryOptionById:', error);
      throw error;
    }
  }

  async createDeliveryOption(data) {
    try {
      console.log('Service createDeliveryOption called with:', data);
      return await this.deliveryOptionRepo.create(data);
    } catch (error) {
      console.log('Error in createDeliveryOption:', error.message);
      throw error;
    }
  }

  async findByTitle(title) {
    try {
      return await this.deliveryOptionRepo.findByTitle(title);
    } catch (error) {
      console.error('Error in findByTitle:', error);
      throw error;
    }
  }

  async updateDeliveryOption(id, data) {
    try {
      console.log('Service updateDeliveryOption called with:', id, data);
      const updated = await this.deliveryOptionRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Error in updateDeliveryOption:', error);
      throw error;
    }
  }

  async deleteDeliveryOption(id) {
    try {
      console.log('Service deleteDeliveryOption called with:', id);
      const deleted = await this.deliveryOptionRepo.softDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in deleteDeliveryOption:', error);
      throw error;
    }
  }
}

export default DeliveryOptionService;