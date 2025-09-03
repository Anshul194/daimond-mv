import BlogCategoryRepository from '../repository/blogCategoryRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

class BlogCategoryService {
  constructor() {
    this.repo = new BlogCategoryRepository();
  }

  async create(data) {
    try {
      const exists = await this.repo.findByName(data.name);
      if (exists) throw new AppError('Category already exists', StatusCodes.BAD_REQUEST);
      return await this.repo.create(data);
    } catch (error) {
      console.error('Service create error:', error.message);
      throw error;
    }
  }

  async getAll() {
    try {
      return await this.repo.getAll({ deletedAt: null });
    } catch (error) {
      console.error('Service getAll error:', error.message);
      throw new AppError('Failed to fetch blog categories', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

 async getById(id) {
  try {
    if (!id || id.length !== 24) {
      throw new AppError('Invalid category ID', StatusCodes.BAD_REQUEST);
    }

    const category = await this.repo.findById(id);
    if (!category || category.deletedAt) {
      throw new AppError('Blog category not found', StatusCodes.NOT_FOUND);
    }

    return category;
  } catch (error) {
    console.error('Service getById error:', error.message);
    throw new AppError('Failed to fetch blog category', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


  async update(id, data) {
    try {
      return await this.repo.update(id, data);
    } catch (error) {
      console.error('Service update error:', error.message);
      throw new AppError('Failed to update blog category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

async delete(id) {
  try {
    return await this.repo.delete(id); // previously softDelete
  } catch (error) {
    console.error('Service delete error:', error.message);
    throw new AppError('Failed to delete blog category', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

}

export default BlogCategoryService;
