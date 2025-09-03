import SubCategoryService from '../services/subCategoryService.js';
import CategoryService from '../services/categoryService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import initRedis from '../config/redis.js';
import { subCategoryCreateValidator, subCategoryUpdateValidator } from '../validators/SubcategoryValidationSchema.js';
import { successResponse, errorResponse } from '../utils/response.js';

const subCategoryService = new SubCategoryService();
const categoryService = new CategoryService();
const redis = initRedis();



export async function createSubCategory(form) {
  try {
    console.log('➡️ Starting subcategory creation process');

    const name = form.get('name');
    const categoryId = form.get('category');
    const description = form.get('description');
    const image = form.get('image');

    console.log('📥 Form Data:', { name, categoryId, description, image });

    if (!name || !categoryId) {
      console.warn('⚠️ Missing required fields:', { name, categoryId });
      return {
        status: 400,
        body: errorResponse('Missing required fields')
      };
    }

    const existing = await subCategoryService.findByName(name);
    if (existing) {
      console.warn('⚠️ Subcategory with this name already exists:', name);
      return {
        status: 400,
        body: errorResponse('SubCategory with this name already exists')
      };
    }

    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      console.warn('⚠️ Invalid category ID:', categoryId);
      return {
        status: 400,
        body: errorResponse('Invalid category ID')
      };
    }

    let imageUrl = '';
    if (image && image instanceof File) {
      console.log('🖼️ Validating and saving image file...');
      validateImageFile(image);
      imageUrl = await saveFile(image, 'sub-category-images');
      console.log('✅ Image saved:', imageUrl);
    }

    const payload = {
      name,
      // category: category._id,
      category: category._id.toString(),

      description,
      image: imageUrl
    };

    console.log('🧪 Validating subcategory payload:', payload);
    const { error, value } = subCategoryCreateValidator.validate(payload);

    if (error) {
      console.error('❌ Validation error:', error.details);
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details)
      };
    }

    console.log('📤 Creating subcategory in DB...');
    const newSubCategory = await subCategoryService.createSubCategory(value);

    console.log('🧹 Clearing Redis cache: allSubCategories');
    await redis.del('allSubCategories');

    console.log('✅ New SubCategory created successfully:', newSubCategory);

    return {
      status: 200,
      body: successResponse(newSubCategory, 'SubCategory created')
    };
  } catch (err) {
    console.error('❌ Create SubCategory error:', err.message, err);
    return {
      status: 500,
      body: errorResponse('Server error')
    };
  }
}

// Get All SubCategories
export async function getSubCategories(query) {
  try {
    const result = await subCategoryService.getAllSubCategories(query);
    return {
      status: 200,
      body: successResponse(result, 'SubCategories fetched successfully')
    };
  } catch (err) {
    console.error('Get SubCategories error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500)
    };
  }
}

// Get SubCategory by ID
export async function getSubCategoryById(id) {
  try {
    const subCategory = await subCategoryService.getSubCategoryById(id);
    if (!subCategory) {
      return {
        status: 404,
        body: errorResponse('SubCategory not found', 404)
      };
    }

    return {
      status: 200,
      body: successResponse(subCategory, 'SubCategory fetched')
    };
  } catch (err) {
    console.error('Get SubCategory error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500)
    };
  }
}

// Update SubCategory
export async function updateSubCategory(id, data) {
  try {
    let imageUrl = '';
    const { image, ...fields } = data;

    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        imageUrl = await saveFile(image, 'sub-category-images');
      } catch (fileError) {
        return {
          status: 400,
          body: errorResponse('Image upload error', 400, fileError.message)
        };
      }
    }

    const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
      if (value !== '') acc[key] = value;
      return acc;
    }, {});

    const payload = imageUrl ? { ...cleanedFields, image: imageUrl } : cleanedFields;
    const { error, value } = subCategoryUpdateValidator.validate(payload);
    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details)
      };
    }

    const updated = await subCategoryService.updateSubCategory(id, value);
    if (!updated) {
      return {
        status: 404,
        body: errorResponse('SubCategory not found', 404)
      };
    }

    await redis.del('allSubCategories');

    return {
      status: 200,
      body: successResponse(updated, 'SubCategory updated')
    };
  } catch (err) {
    console.error('Update SubCategory error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500)
    };
  }
}

// Delete SubCategory
export async function deleteSubCategory(id) {
  try {
    const deleted = await subCategoryService.deleteSubCategory(id);
    if (!deleted) {
      return {
        status: 404,
        body: errorResponse('SubCategory not found', 404)
      };
    }

    await redis.del('allSubCategories');

    return {
      status: 200,
      body: successResponse(deleted, 'SubCategory deleted')
    };
  } catch (err) {
    console.error('Delete SubCategory error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500)
    };
  }
}

