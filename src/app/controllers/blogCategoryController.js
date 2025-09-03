import BlogCategoryService from '../services/blogCategoryService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import { successResponse, errorResponse } from '../utils/response.js';

const service = new BlogCategoryService();

export async function createBlogCategory(data) {
  try {
    let imageUrl = '';

    // If image is a file
    if (data.image && data.image instanceof File) {
      try {
        validateImageFile(data.image);
        imageUrl = await saveFile(data.image, 'blog-category-images');
      } catch (uploadErr) {
        return {
          status: 400,
          body: errorResponse('Image upload error', 400, uploadErr.message),
        };
      }
    }

    const payload = {
      name: data.name,
      image: imageUrl,
    };

    const result = await service.create(payload);
    return { status: 201, body: successResponse(result, 'Blog category created') };
  } catch (err) {
    return { status: err.statusCode || 500, body: errorResponse(err.message) };
  }
}

export async function getAllBlogCategories(query) {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';
    const status = query.status; // 'active', 'inactive', or undefined

    const filter = { deletedAt: null };

    // Search by name or slug
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: { $regex: regex } },
        { slug: { $regex: regex } }
      ];
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    const result = await service.getAll(filter, {}, page, limit);

    return {
      status: 200,
      body: successResponse({
        data: result.result,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.totalDocuments,
          itemsPerPage: limit
        }
      }, 'Blog categories fetched')
    };
  } catch (err) {
    console.error('getAllBlogCategories error:', err);
    return {
      status: 500,
      body: errorResponse('Failed to fetch blog categories', 500)
    };
  }
}


export async function getBlogCategoryById(id) {
  try {
    const result = await service.getById(id);
    if (!result) return { status: 404, body: errorResponse('Not found') };
    return { status: 200, body: successResponse(result, 'Blog category fetched') };
  } catch (err) {
    return { status: 500, body: errorResponse(err.message) };
  }
}

export async function updateBlogCategory(id, data) {
  try {
    let imageUrl = '';
    const { image, ...fields } = data;

    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        imageUrl = await saveFile(image, 'blog-category-images');
      } catch (err) {
        return {
          status: 400,
          body: errorResponse('Image upload error', 400, err.message),
        };
      }
    }

    const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
      if (value !== '') acc[key] = value;
      return acc;
    }, {});

    const payload = imageUrl ? { ...cleanedFields, image: imageUrl } : cleanedFields;

    const result = await service.update(id, payload);

    if (!result) {
      return { status: 404, body: errorResponse('Blog category not found') };
    }

    return { status: 200, body: successResponse(result, 'Blog category updated') };
  } catch (err) {
    return { status: 500, body: errorResponse(err.message) };
  }
}


export async function deleteBlogCategory(id) {
  try {
    const result = await service.delete(id);
    if (!result) return { status: 404, body: errorResponse('Not found') };
    return { status: 200, body: successResponse(result, 'Blog category deleted') };
  } catch (err) {
    return { status: 500, body: errorResponse(err.message) };
  }
}
