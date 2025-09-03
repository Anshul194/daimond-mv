import BlogRepository from '../repository/blogRepository.js';

class BlogService {
  constructor() {
    this.blogRepo = new BlogRepository();
  }

  async create(data) {
    try {
      return await this.blogRepo.create(data);
    } catch (err) {
      console.error('BlogService.create error:', err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      return await this.blogRepo.update(id, data);
    } catch (err) {
      console.error('BlogService.update error:', err);
      throw err;
    }
  }

  async delete(id) {
    try {
      return await this.blogRepo.softDelete(id);
    } catch (err) {
      console.error('BlogService.delete error:', err);
      throw err;
    }
  }

  async getById(id) {
    try {
      return await this.blogRepo.findById(id);
    } catch (err) {
      console.error('BlogService.getById error:', err);
      throw err;
    }
  }

  async getBySlug(slug) {
    try {
      return await this.blogRepo.findBySlug(slug);
    } catch (err) {
      console.error('BlogService.getBySlug error:', err);
      throw err;
    }
  }

  async getAll(query) {
  try {
    const { page = 1, limit = 10, filters = '{}', sort = '{}' } = query;

    const rawFilters = JSON.parse(filters);
    const parsedFilters = { deletedAt: null };

    // 🔍 Enable case-insensitive partial match for title
    if (rawFilters.title) {
      parsedFilters.title = {
        $regex: rawFilters.title,
        $options: 'i'
      };
    }

    // 🔃 Sort logic
    const parsedSort = Object.entries(JSON.parse(sort)).reduce((acc, [key, val]) => {
      acc[key] = val === 'asc' ? 1 : -1;
      return acc;
    }, {});

    return await this.blogRepo.getAll(parsedFilters, parsedSort, parseInt(page), parseInt(limit));
  } catch (err) {
    console.error('BlogService.getAll error:', err);
    throw err;
  }
}


  async getBlogsByCategoryId(categoryId) {
  try {
    return await this.blogRepo.getBlogsByCategoryId(categoryId);
  } catch (err) {
    console.error('BlogService.getBlogsByCategoryId error:', err);
    throw err;
  }
}
async getBlogsBySubCategoryId(subCategoryId) {
    try {
      return await this.blogRepo.getBlogsBySubCategoryId(subCategoryId);
    } catch (err) {
      console.error('BlogService.getBlogsBySubCategoryId error:', err);
      throw err;
    }
  }

}

export default BlogService;
