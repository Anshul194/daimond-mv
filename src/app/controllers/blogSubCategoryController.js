import BlogSubCategoryService from '../services/blogSubCategoryService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import initRedis from '../config/redis.js';
import { blogSubCategoryCreateValidator, blogSubCategoryUpdateValidator } from '../validators/blogSubCategoryValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';
import BlogCategory from '../models/BlogCategory.js';

const blogSubCategoryService = new BlogSubCategoryService();
const redis = initRedis(); 

export async function createBlogSubCategory(form) {
  try {
    let imageUrl = '';

    console.log('Create BlogSubCategory form:', form);
    const name = form.get('name');
    const BlogCategory = form.get('BlogCategory');
    const status = form.get('status') || 'active';
    const image = form.get('image'); // File object

    console.log('Image:', image);

    const existing = await blogSubCategoryService.findByName(name);
    if (existing) {
      return {
        status: 400,
        body: errorResponse('BlogSubCategory with this name already exists', 400),
      };
    }

    console.log('BlogSubCategory name:', name);
    console.log('Image is File:', image instanceof File);
    
    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        console.log('Validating image file:', image);
        imageUrl = await saveFile(image, 'blog-subcategory-images');
        console.log('Image saved at:', imageUrl);
      } catch (fileError) {
        return {
          status: 400,
          body: errorResponse('Image upload error', 400, fileError.message),
        };
      }
    }

    const { error, value } = blogSubCategoryCreateValidator.validate({
      name,
      BlogCategory,
      image: imageUrl,
      status,
    });

    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const newBlogSubCategory = await blogSubCategoryService.createBlogSubCategory(value);
    await redis.del('allBlogSubCategories');
    console.log('New BlogSubCategory created:', newBlogSubCategory);

    return {
      status: 201,
      body: successResponse(newBlogSubCategory, 'BlogSubCategory created'),
    };
  } catch (err) {
    console.error('Create BlogSubCategory error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getBlogSubCategories(query) {
  try {
    console.log('Get BlogSubCategories query:', query);
    const result = await blogSubCategoryService.getAllBlogSubCategories(query);

    return {
      status: 200,
      body: successResponse(result, 'BlogSubCategories fetched successfully'),
    };
  } catch (err) {
    console.error('Get BlogSubCategories error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getBlogSubCategoryById(id) {
  try {
    const blogSubCategory = await blogSubCategoryService.getBlogSubCategoryById(id);
    if (!blogSubCategory) {
      return {
        status: 404,
        body: { success: false, message: 'BlogSubCategory not found' }
      };
    }
    return {
      status: 200,
      body: { success: true, message: 'BlogSubCategory fetched', data: blogSubCategory }
    };
  } catch (err) {
    console.error('Get BlogSubCategory error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function updateBlogSubCategory(id, data) {
  try {
    let imageUrl = '';
    const { image, ...fields } = data;

    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        imageUrl = await saveFile(image, 'blog-subcategory-images');
      } catch (fileError) {
        return {
          status: 400,
          body: { success: false, message: 'Image upload error', details: fileError.message }
        };
      }
    }

   const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
  if (value !== '' && value !== null && value !== undefined) {
    acc[key] = value;
  }
  return acc;
}, {});


    const payload = imageUrl ? { ...cleanedFields, image: imageUrl } : cleanedFields;

    const { error, value } = blogSubCategoryUpdateValidator.validate(payload);
    if (error) {
      return {
        status: 400,
        body: { success: false, message: 'Validation error', details: error.details }
      };
    }

    const updated = await blogSubCategoryService.updateBlogSubCategory(id, value);
    if (!updated) {
      return {
        status: 404,
        body: { success: false, message: 'BlogSubCategory not found' }
      };
    }

    // Invalidate cache
    await redis.del('allBlogSubCategories');

    return {
      status: 200,
      body: { success: true, message: 'BlogSubCategory updated', data: updated }
    };
  } catch (err) {
    console.error('Update BlogSubCategory error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function deleteBlogSubCategory(id) {
  try {
    const deleted = await blogSubCategoryService.deleteBlogSubCategory(id);
    if (!deleted) {
      return {
        status: 404,
        body: { success: false, message: 'BlogSubCategory not found' }
      };
    }

    // Invalidate cache
    await redis.del('allBlogSubCategories');

    return {
      status: 200,
      body: { success: true, message: 'BlogSubCategory deleted', data: deleted }
    };
  } catch (err) {
    console.error('Delete BlogSubCategory error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function getSubCategoriesByCategoryId(categoryId) {
  try {
    const subCategories = await blogSubCategoryService.getSubCategoriesByCategoryId(categoryId);

    if (!subCategories || subCategories.length === 0) {
      return {
        status: 404,
        body: { success: false, message: 'No subcategories found for this category' }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Subcategories fetched successfully',
        data: subCategories
      }
    };
  } catch (err) {
    console.error('Get SubCategories by Category error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}
