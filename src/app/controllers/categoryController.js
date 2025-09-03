import CategoryService from '../services/categoryService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import ProductAttribute from '../models/productAttribute.js';
import Category from '../models/Category.js';
import initRedis from '../config/redis.js';
import { categoryCreateValidator, categoryUpdateValidator } from '../validators/categoryValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const categoryService = new CategoryService();
const redis = initRedis(); 

export async function createCategory(form) {
  try {
    let imageUrl = '';

     console.log('Create Category form:', form);
    const name = form.get('name');
    const description = form.get('description');
    const image = form.get('image'); // File object
    console.log('Image:', image);

    const existing = await categoryService.findByName(name);
    if (existing) {
      return {
        status: 400,
        body: errorResponse('Category with this name already exists', 400),
      };
    }
    console.log('Category name:', image);
    console.log('Category description:', image instanceof File);
    
    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        console.log('Validating image file:', image);
        imageUrl = await saveFile(image, 'category-images');
        console.log('Image saved at:', imageUrl);
      } catch (fileError) {
        return {
          status: 400,
          body: errorResponse('Image upload error', 400, fileError.message),
        };
      }
    }

    const { error, value } = categoryCreateValidator.validate({
      name,
      description,
      image: imageUrl,
    });

    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const newCategory = await categoryService.createCategory(value);
    await redis.del('allCategories');
    console.log('New Category created:', newCategory);

    return {
      status: 201,
      body: successResponse(newCategory, 'Category created'),
    };
  } catch (err) {
    console.error('Create Category error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}




export async function getCategories(query) {
  try {
    console.log('Get Categories query:', query);
    const result = await categoryService.getAllCategories(query);

    return {
      status: 200,
      body: successResponse(result, 'Categories fetched successfully'),
    };
  } catch (err) {
    console.error('Get Categories error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}



export async function getCategoryById(id) {
  try {
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return {
        status: 404,
        body: { success: false, message: 'Category not found' }
      };
    }
    return {
      status: 200,
      body: { success: true, message: 'Category fetched', data: category }
    };
  } catch (err) {
    console.error('Get Category error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function updateCategory(id, data) {
  try {
    let imageUrl = '';
    const { image, ...fields } = data;

    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        imageUrl = await saveFile(image, 'category-images');
      } catch (fileError) {
        return {
          status: 400,
          body: { success: false, message: 'Image upload error', details: fileError.message }
        };
      }
    }

    const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
      if (value !== '') acc[key] = value;
      return acc;
    }, {});

    const payload = imageUrl ? { ...cleanedFields, image: imageUrl } : cleanedFields;

    const { error, value } = categoryUpdateValidator.validate(payload);
    if (error) {
      return {
        status: 400,
        body: { success: false, message: 'Validation error', details: error.details }
      };
    }

    const updated = await categoryService.updateCategory(id, value);
    if (!updated) {
      return {
        status: 404,
        body: { success: false, message: 'Category not found' }
      };
    }

    // Invalidate cache
    await redis.del('allCategories');

    return {
      status: 200,
      body: { success: true, message: 'Category updated', data: updated }
    };
  } catch (err) {
    console.error('Update Category error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function deleteCategory(id) {
  try {
    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      return {
        status: 404,
        body: { success: false, message: 'Category not found' }
      };
    }

    // Invalidate cache
    await redis.del('allCategories');

    return {
      status: 200,
      body: { success: true, message: 'Category deleted', data: deleted }
    };
  } catch (err) {
    console.error('Delete Category error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}





export async function getAttributesByCategoryId(categoryId) {
  try {
    const attributes = await ProductAttribute.find({
      category_id: categoryId,
      deletedAt: null
    });

    return {
      status: 200,
      body: successResponse(attributes, 'Attributes fetched successfully')
    };
  } catch (err) {
    console.error('Error fetching attributes for category:', err.message);
    return {
      status: 500,
      body: errorResponse('Failed to fetch attributes', 500)
    };
  }
}

export async function getNavbarCategoriesWithAttributes() {
  try {
    const categories = await Category.find({ deletedAt: null });

    const categoryIds = categories.map((c) => c._id.toString());

    const attributes = await ProductAttribute.find({
      category_id: { $in: categoryIds },
      deletedAt: null,
    });

    // Group attributes by category_id
    const groupedAttributes = {};
    for (const attr of attributes) {
      const catId = attr.category_id.toString();
      if (!groupedAttributes[catId]) groupedAttributes[catId] = [];
      groupedAttributes[catId].push(attr);
    }

    // Attach attributes to each category
    const result = categories.map((cat) => {
      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        status: cat.status,
        attributes: groupedAttributes[cat._id.toString()] || [],
      };
    });

    return {
      status: 200,
      body: successResponse(result, 'Categories with attributes fetched'),
    };
  } catch (err) {
    console.error('Navbar fetch error:', err.message);
    return {
      status: 500,
      body: errorResponse('Failed to fetch categories', 500),
    };
  }
}
