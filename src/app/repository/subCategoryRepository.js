import mongoose from 'mongoose';
import slugify from 'slugify';
import SubCategory from '../models/SubCategory.js';
import CrudRepository from "./crud-repository.js";

class SubCategoryRepository extends CrudRepository {

  constructor() {
      super(SubCategory);
    }

  async getAll(filterConditions, sortConditions, page, limit) {
  try {
    const skip = (page - 1) * limit;
    const query = SubCategory.find(filterConditions)
      .populate('category')
       .populate({ // populate vendor
        path: 'vendor',
        select: 'username email storeName contactNumber role isActive'
      })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const results = await query.exec();
    const totalDocuments = await SubCategory.countDocuments(filterConditions);

    return {
      results,
      totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit)
    };
  } catch (error) {
    console.error('SubCategoryRepo getAll error:', error);
    throw error;
  }
}


  async findAll() {
    try {
      return await SubCategory.find({ deletedAt: null }).populate('category');
    } catch (error) {
      console.error('SubCategoryRepo findAll error:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await SubCategory.findOne({ _id: id, deletedAt: null }).populate('category');
    } catch (error) {
      console.error('SubCategoryRepo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const subCategory = new SubCategory(data);
      return await subCategory.save();
    } catch (error) {
      console.error('SubCategoryRepo create error:', error);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await SubCategory.findOne({ name, deletedAt: null }).populate('category');
    } catch (error) {
      console.error('SubCategoryRepo findByName error:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const subCategory = await SubCategory.findById(id);
      if (!subCategory) return null;

      subCategory.set(data);

      const baseSlug = slugify(subCategory.name, { lower: true, strict: true });

      if (subCategory.isModified('name') || !subCategory.slug) {
        let uniqueSlug;
        do {
          const randomNumber = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${randomNumber}`;
        } while (
          await SubCategory.exists({
            slug: uniqueSlug,
            deletedAt: null,
            _id: { $ne: subCategory._id }
          })
        );

        subCategory.slug = uniqueSlug;
      }

      const updated = await subCategory.save();
      return await updated.populate('category');
    } catch (err) {
      console.error('SubCategoryRepo update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await SubCategory.findByIdAndDelete(
        id,
        { deletedAt: new Date() },
        { new: true }
      ).populate('category');
    } catch (err) {
      console.error('SubCategoryRepo softDelete error:', err);
      throw err;
    }
  }
}

export default SubCategoryRepository;
