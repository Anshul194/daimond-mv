import CrudRepository from './crud-repository.js';
import BlogCategory from '../models/BlogCategory.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class BlogCategoryRepository extends CrudRepository {
  constructor() {
    super(BlogCategory);
  }

  async findByName(name) {
    try {
      return await BlogCategory.findOne({ name, deletedAt: null });
    } catch (error) {
      console.error('Repository findByName error:', error.message);
      throw new AppError('Failed to find blog category by name', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async findById(id) {
  try {
    return await this.model.findOne({ _id: id, deletedAt: null });
  } catch (error) {
    console.error('Repository findById error:', error.message);
    throw error;
  }
}


  // 🔥 Hard delete using findByIdAndDelete
  async delete(id) {
    try {
      const deleted = await BlogCategory.findByIdAndDelete(id);

      if (!deleted) {
        throw new AppError('Blog category not found', StatusCodes.NOT_FOUND);
      }

      return deleted;
    } catch (error) {
      console.error('Repository delete error:', error.message);
      throw new AppError('Failed to permanently delete blog category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
export default BlogCategoryRepository;
