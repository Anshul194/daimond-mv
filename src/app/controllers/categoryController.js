import CategoryService from '../services/categoryService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import ProductAttribute from '../models/productAttribute.js';
import Category from '../models/Category.js';
import initRedis from '../config/redis.js';
import { categoryCreateValidator, categoryUpdateValidator } from '../validators/categoryValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const categoryService = new CategoryService();
const redis = initRedis(); 

// Accepts a second argument: admin (from token)
export async function createCategory(form, admin = null) {
  try {
    let imageUrl = '';
    const name = form.get('name');
    const description = form.get('description');
    const image = form.get('image');

    const existing = await categoryService.findByName(name);
    if (existing) {
      return {
        status: 400,
        body: errorResponse('Category with this name already exists', 400),
      };
    }

    if (image && image instanceof File) {
      try {
        validateImageFile(image);
        imageUrl = await saveFile(image, 'category-images');
      } catch (fileError) {
        return {
          status: 400,
          body: errorResponse('Image upload error', 400, fileError.message),
        };
      }
    }

    // Always set vendor field from admin if vendor, or allow superadmin to set or leave null
    let vendorId = null;

    console?.log("aDMIN", admin)

    if (admin && admin.role == 'vendor') {
      vendorId = admin?._id.toString();
    } else if (form.has('vendor')) {
      vendorId = form.get('vendor');
    }

    const { error, value } = categoryCreateValidator.validate({
      name,
      description,
      image: imageUrl,
      vendor: vendorId,
    });

    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const newCategory = await categoryService.createCategory(value);
    await redis.del('allCategories');
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




// Accepts a second argument: admin (from token)
export async function getCategories(query, admin = null) {
  try {
    // Enforce vendor filter for vendors
    if (admin && admin.role === 'vendor') {
      const vendorId = (admin._id || admin.id).toString();
      console.log('[DEBUG] Authenticated as vendor:', vendorId);
      query = { ...query, vendor: vendorId };
    } else if (admin) {
      const superId = (admin._id || admin.id) ? (admin._id || admin.id).toString() : undefined;
      console.log('[DEBUG] Authenticated as superadmin:', superId);
    } else {
      console.log('[DEBUG] No admin info provided');
    }
    console.log('[DEBUG] Final query to service:', query);
    const result = await categoryService.getAllCategories(query);
    console.log('[DEBUG] Categories returned:', Array.isArray(result) ? result.length : result);
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
