import BrandService from '../services/brandService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import initRedis from '../config/redis.js';
import { brandCreateValidator, brandUpdateValidator } from '../validators/brandValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const brandService = new BrandService();
const redis = initRedis(); 

// Accepts a second argument: admin (from token)
export async function createBrand(form, admin = null) {
  try {
    let logoUrl = '';

    console.log('Create Brand form:', form);
    const name = form.get('name');
    const title = form.get('title');
    const description = form.get('description');
    const logo = form.get('logo'); // File object

    console.log('Logo:', logo);

    const existing = await brandService.findByName(name);
    if (existing) {
      return {
        status: 400,
        body: errorResponse('Brand with this name already exists', 400),
      };
    }

    console.log('Brand name:', name);
    console.log('Logo is File:', logo instanceof File);
    
    if (logo && logo instanceof File) {
      try {
        validateImageFile(logo);
        console.log('Validating logo file:', logo);
        logoUrl = await saveFile(logo, 'brand-logos');
        console.log('Logo saved at:', logoUrl);
      } catch (fileError) {
        return {
          status: 400,
          body: errorResponse('Logo upload error', 400, fileError.message),
        };
      }
    }

    // Always set vendor field from admin if vendor, or allow superadmin to set or leave null
    let vendorId = null;

    console?.log("aDMIN", admin)

    if (admin && admin.role == 'vendor') {
      vendorId = admin._id.toString();
    } else if (admin && admin.role == 'superadmin') {
      // Allow superadmin to set vendor or leave null
      vendorId = form.get('vendor') || null;
    }

    const { error, value } = brandCreateValidator.validate({
      name,
      title,
      description,
      logo: logoUrl,
      vendor: vendorId,
    });

    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const newBrand = await brandService.createBrand(value);
    await redis.del('allBrands');
    console.log('New Brand created:', newBrand);

    return {
      status: 201,
      body: successResponse(newBrand, 'Brand created'),
    };
  } catch (err) {
    console.error('Create Brand error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

// Accepts a second argument: admin (from token)
export async function getBrands(query, admin = null) {
  try {
    // Enforce vendor filter for vendors
    if (admin && admin.role === 'vendor') {
      query.vendor = (admin._id || admin.id).toString();
    } else if (admin && admin.role === 'superadmin') {
      // Superadmins can filter by vendor if desired
      if (query.vendor) {
        query.vendor = query.vendor;
      }
    }
    console.log('[DEBUG] Final query to service:', query);
    const result = await brandService.getAllBrands(query);

    return {
      status: 200,
      body: successResponse(result, 'Brands fetched successfully'),
    };
  } catch (err) {
    console.error('Get Brands error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getBrandById(id) {
  try {
    const brand = await brandService.getBrandById(id);
    if (!brand) {
      return {
        status: 404,
        body: { success: false, message: 'Brand not found' }
      };
    }
    return {
      status: 200,
      body: { success: true, message: 'Brand fetched', data: brand }
    };
  } catch (err) {
    console.error('Get Brand error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function updateBrand(id, data) {
  try {
    let logoUrl = '';
    const { logo, ...fields } = data;

    if (logo && logo instanceof File) {
      try {
        validateImageFile(logo);
        logoUrl = await saveFile(logo, 'brand-logos');
      } catch (fileError) {
        return {
          status: 400,
          body: { success: false, message: 'Logo upload error', details: fileError.message }
        };
      }
    }

    const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
      if (value !== '') acc[key] = value;
      return acc;
    }, {});

    const payload = logoUrl ? { ...cleanedFields, logo: logoUrl } : cleanedFields;

    const { error, value } = brandUpdateValidator.validate(payload);
    if (error) {
      return {
        status: 400,
        body: { success: false, message: 'Validation error', details: error.details }
      };
    }

    const updated = await brandService.updateBrand(id, value);
    if (!updated) {
      return {
        status: 404,
        body: { success: false, message: 'Brand not found' }
      };
    }

    // Invalidate cache
    await redis.del('allBrands');

    return {
      status: 200,
      body: { success: true, message: 'Brand updated', data: updated }
    };
  } catch (err) {
    console.error('Update Brand error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function deleteBrand(id) {
  try {
    const deleted = await brandService.deleteBrand(id);
    if (!deleted) {
      return {
        status: 404,
        body: { success: false, message: 'Brand not found' }
      };
    }

    // Invalidate cache
    await redis.del('allBrands');

    return {
      status: 200,
      body: { success: true, message: 'Brand deleted', data: deleted }
    };
  } catch (err) {
    console.error('Delete Brand error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}