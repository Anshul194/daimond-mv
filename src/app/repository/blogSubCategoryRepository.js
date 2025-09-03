import BlogSubCategory from '../models/BlogSubCategory.js';
import BlogCategory from '../models/BlogCategory.js'; 
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from "./crud-repository.js";

class BlogSubCategoryRepository extends CrudRepository {
  constructor() {
    super(BlogSubCategory);
  }

  async findById(id) {
    try {
      return await BlogSubCategory.findOne({ _id: id, deletedAt: null }).populate('BlogCategory');
    } catch (error) {
      console.error('Repo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const blogSubCategory = new BlogSubCategory(data);
      return await blogSubCategory.save();
    } catch (error) {
      console.error('Repo create error:', error);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await BlogSubCategory.findOne({ name, deletedAt: null });
    } catch (error) {
      console.error('Repo findByName error:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const BlogSubCategoryModel = mongoose.models.BlogSubCategory;
      const blogSubCategory = await BlogSubCategoryModel.findById(id);
      if (!blogSubCategory) return null;

      blogSubCategory.set(data);

      // Handle slug regeneration if name is modified
      if (blogSubCategory.isModified('name')) {
        const baseSlug = slugify(blogSubCategory.name, { lower: true, strict: true });
        let uniqueSlug;

        do {
          const randomNumber = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${randomNumber}`;
        } while (
          await BlogSubCategoryModel.exists({
            slug: uniqueSlug,
            deletedAt: null,
            _id: { $ne: blogSubCategory._id },
          })
        );

        blogSubCategory.slug = uniqueSlug;
      }

      return await blogSubCategory.save();
    } catch (err) {
      console.error('Repo update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await BlogSubCategory.findByIdAndDelete(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    } catch (err) {
      console.error('Repo softDelete error:', err);
      throw err;
    }
  }

async getByCategoryId(categoryId) {
  try {
    console.log('🔍 getByCategoryId called with:', categoryId);

    const result = await BlogSubCategory.find({
      BlogCategory: categoryId,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    console.log('📦 Found subcategories:', result.length);
    return result;
  } catch (error) {
    console.error('❌ Repo getByCategoryId error:', error);
    throw error;
  }
}



  async getAll(filterConditions, sortConditions, pageNum, limitNum) {
    try {
      const skip = (pageNum - 1) * limitNum;
      
      const [data, total] = await Promise.all([
        BlogSubCategory.find(filterConditions)
          .populate('BlogCategory')
          .sort(sortConditions)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        BlogSubCategory.countDocuments(filterConditions)
      ]);

      return {
        data,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };
    } catch (error) {
      console.error('Repo getAll error:', error);
      throw error;
    }
  }
}

export default BlogSubCategoryRepository;