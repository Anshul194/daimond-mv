import Category from '../models/Category.js';
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from "./crud-repository.js";

class CategoryRepository extends CrudRepository {
  constructor() {
    super(Category);
  }

  async getAll(filter = {}, sort = {}, page = 1, limit = 100) {
    try {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 100);
      const skip = (pageNum - 1) * limitNum;

      // Ensure filter is an object
      const filterObj = filter || {};

      // Build query
      let query = this.model.find(filterObj);

      // Apply sorting
      if (sort && Object.keys(sort).length > 0) {
        query = query.sort(sort);
      }

      // Apply pagination
      query = query.skip(skip).limit(limitNum);

      // Only populate vendor if filter has vendor field (indicating it exists in schema)
      if (filterObj.vendor !== undefined && filterObj.vendor !== null) {
        try {
          query = query.populate({
            path: 'vendor',
            select: 'username email storeName contactNumber role isActive',
            strictPopulate: false, // Don't throw error if vendor doesn't exist
          });
        } catch (populateError) {
          console.warn('Vendor populate failed (field may not exist):', populateError.message);
          // Continue without populate if vendor field doesn't exist
        }
      }

      // Execute queries
      const [totalDocuments, result] = await Promise.all([
        this.model.countDocuments(filterObj),
        query.lean().exec()
      ]);

      const totalPages = Math.ceil(totalDocuments / limitNum);

      return { result: result || [], currentPage: pageNum, totalPages, totalDocuments };
    } catch (error) {
      console.error('CategoryRepository getAll error:', error);
      console.error('CategoryRepository getAll error stack:', error.stack);
      throw error;
    }
  }





  async findById(id) {
    try {
      return await Category.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      console.error('Repo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const category = new Category(data);
      return await category.save();
    } catch (error) {
      console.error('Repo create error:', error);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await Category.findOne({ name, deletedAt: null });
    } catch (error) {
      console.error('Repo findByName error:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const CategoryModel = mongoose.models.Category;
      const category = await CategoryModel.findById(id);
      if (!category) return null;

      category.set(data);

      if (category.isModified('name')) {
        const baseSlug = slugify(category.name, { lower: true, strict: true });
        let uniqueSlug;

        do {
          const randomNumber = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${randomNumber}`;
        } while (
          await CategoryModel.exists({
            slug: uniqueSlug,
            deletedAt: null,
            _id: { $ne: category._id },
          })
        );

        category.slug = uniqueSlug;
      }

      return await category.save();
    } catch (err) {
      console.error('Repo update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await Category.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    } catch (err) {
      console.error('Repo softDelete error:', err);
      throw err;
    }
  }
}

export default CategoryRepository;
