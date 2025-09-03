import SizeService from '../services/sizeService.js';
import initRedis from '../config/redis.js';
import { sizeCreateValidator, sizeUpdateValidator } from '../validators/sizeValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const sizeService = new SizeService();
const redis = initRedis();

export async function createSize(data) {
  try {
    console.log('Create Size data:', data);
    
    const { name, size_code } = data;

    // Check if size with same name or size_code already exists
    const existingByName = await sizeService.findByName(name);
    if (existingByName) {
      return {
        status: 400,
        body: errorResponse('Size with this name already exists', 400),
      };
    }

    const existingByCode = await sizeService.findBySizeCode(size_code);
    if (existingByCode) {
      return {
        status: 400,
        body: errorResponse('Size with this code already exists', 400),
      };
    }

    const { error, value } = sizeCreateValidator.validate(data);
    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const newSize = await sizeService.createSize(value);
    await redis.del('allSizes');
    console.log('New Size created:', newSize);

    return {
      status: 201,
      body: successResponse(newSize, 'Size created'),
    };
  } catch (err) {
    console.error('Create Size error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getSizes(query) {
  try {
    console.log('Get Sizes query:', query);
    const result = await sizeService.getAllSizes(query);

    return {
      status: 200,
      body: successResponse(result, 'Sizes fetched successfully'),
    };
  } catch (err) {
    console.error('Get Sizes error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getSizeById(id) {
  try {
    const size = await sizeService.getSizeById(id);
    if (!size) {
      return {
        status: 404,
        body: { success: false, message: 'Size not found' }
      };
    }
    return {
      status: 200,
      body: { success: true, message: 'Size fetched', data: size }
    };
  } catch (err) {
    console.error('Get Size error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function updateSize(id, data) {
  try {
    const cleanedFields = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) acc[key] = value;
      return acc;
    }, {});

    const { error, value } = sizeUpdateValidator.validate(cleanedFields);
    if (error) {
      return {
        status: 400,
        body: { success: false, message: 'Validation error', details: error.details }
      };
    }

    const updated = await sizeService.updateSize(id, value);
    if (!updated) {
      return {
        status: 404,
        body: { success: false, message: 'Size not found' }
      };
    }

    // Invalidate cache
    await redis.del('allSizes');

    return {
      status: 200,
      body: { success: true, message: 'Size updated', data: updated }
    };
  } catch (err) {
    console.error('Update Size error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function deleteSize(id) {
  try {
    const deleted = await sizeService.deleteSize(id);
    if (!deleted) {
      return {
        status: 404,
        body: { success: false, message: 'Size not found' }
      };
    }

    // Invalidate cache
    await redis.del('allSizes');

    return {
      status: 200,
      body: { success: true, message: 'Size deleted', data: deleted }
    };
  } catch (err) {
    console.error('Delete Size error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}
