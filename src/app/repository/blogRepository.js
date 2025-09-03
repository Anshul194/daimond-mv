import Blog from '../models/Blog.js';
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from './crud-repository.js';
import BlogCategory from '../models/BlogCategory.js';
import BlogSubCategory from '../models/BlogSubCategory.js';

class BlogRepository extends CrudRepository {
  constructor() {
    super(Blog);
  }

  async findById(id) {
    try {
      return await Blog.findOne({ _id: id, deletedAt: null })
        .populate('BlogCategory')
        .populate('BlogSubCategory');
    } catch (err) {
      console.error('BlogRepository.findById error:', err);
      throw err;
    }
  }

  async findBySlug(slug) {
    try {
      return await Blog.findOne({ slug, deletedAt: null });
    } catch (err) {
      console.error('BlogRepository.findBySlug error:', err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      const blog = await Blog.findById(id);
      if (!blog) return null;

      blog.set(data);

      if (blog.isModified('title')) {
        const baseSlug = slugify(blog.title, { lower: true, strict: true });
        let uniqueSlug;
        do {
          const rand = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${rand}`;
        } while (
          await Blog.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: blog._id } })
        );
        blog.slug = uniqueSlug;
      }

      return await blog.save();
    } catch (err) {
      console.error('BlogRepository.update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      return await Blog.findByIdAndDelete(id, { deletedAt: new Date() }, { new: true });
    } catch (err) {
      console.error('BlogRepository.softDelete error:', err);
      throw err;
    }
  }

  async getAll(filter, sort, page, limit) {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Blog.find(filter)
          .populate('BlogCategory')
          .populate('BlogSubCategory')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Blog.countDocuments(filter)
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (err) {
      console.error('BlogRepository.getAll error:', err);
      throw err;
    }
  }

 async getBlogsByCategoryId(categoryId) {
  try {
    const blogs = await Blog.find({
      BlogCategory: categoryId,
      deletedAt: null,
    })
      .select('_id title BlogSubCategory') // only select needed fields
      .populate('BlogSubCategory', '_id name') // only select subcategory id and title
      .lean();

    const grouped = {};

    for (const blog of blogs) {
      const subcatId = blog.BlogSubCategory?._id?.toString() || 'unknown';

      if (!grouped[subcatId]) {
        grouped[subcatId] = {
          subCategory: blog.BlogSubCategory || null,
          blogs: [],
        };
      }

      // Push only _id and title for blog
      grouped[subcatId].blogs.push({
        _id: blog._id,
        title: blog.title,
      });
    }

    return Object.values(grouped);
  } catch (err) {
    console.error('BlogRepository.getBlogsByCategoryId error:', err);
    throw err;
  }
}


async getBlogsBySubCategoryId(subCategoryId) {
  try {
    return await Blog.find({
      BlogSubCategory: subCategoryId,
      deletedAt: null,
    })
      .populate('BlogCategory')
      .populate('BlogSubCategory')
      .lean();
  } catch (err) {
    console.error('BlogRepository.getBlogsBySubCategoryId error:', err);
    throw err;
  } 

}
}

export default BlogRepository;
