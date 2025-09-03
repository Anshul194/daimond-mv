import ColorCodeService from '../services/colorCodeService.js';
import { colorCodeCreateValidator, colorCodeUpdateValidator } from '../validators/ColorCodeValidationSchema.js';
import initRedis from '../config/redis.js';
import { successResponse, errorResponse } from '../utils/response.js';

const colorCodeService = new ColorCodeService();
const redis = initRedis();

export async function createColorCode(body) {
  try {
    const { error, value } = colorCodeCreateValidator.validate({
      name: body.name,
      colorCode: body.colorCode,
    });

    if (error) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Validation error',
          details: error.details,
        },
      };
    }

    const result = await colorCodeService.createColorCode(value);
    await redis.del('allColorCodes');

    return {
      status: 201,
      body: {
        success: true,
        message: 'ColorCode created successfully',
        data: result,
      },
    };
  } catch (err) {
    const isDuplicate = err.message.includes('already exists');
    return {
      status: isDuplicate ? 400 : 500,
      body: {
        success: false,
        message: isDuplicate ? err.message : 'Server error',
      },
    };
  }
}



// export async function getColorCodes() {
//   try {
//     // Try fetching from Redis
//     const cached = await redis.get('allColorCodes');
//     if (cached) {
//       return {
//         status: 200,
//         body: {
//           success: true,
//           message: 'ColorCodes fetched from cache',
//           data: JSON.parse(cached)
//         }
//       };
//     }

//     const colorCodes = await colorCodeService.getAllColorCodes();

//     // Cache result
//     await redis.set('allColorCodes', JSON.stringify(colorCodes));

//     return {
//       status: 200,
//       body: {
//         success: true,
//         message: 'ColorCodes fetched successfully',
//         data: colorCodes
//       }
//     };
//   } catch (err) {
//     console.error('Get ColorCodes error:', err.message);
//     return {
//       status: 500,
//       body: {
//         success: false,
//         message: 'Server error'
//       }
//     };
//   }
// }

export async function getColorCodes(query) {
  try {
    console.log('Get ColorCodes query:', query);
    const result = await colorCodeService.getAllColorCodes(query);

    return {
      status: 200,
      body: successResponse(result, 'ColorCodes fetched successfully'),
    };
  } catch (err) {
    console.error('Get ColorCodes error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}


export async function getColorCodeById(id) {
  try {
    const colorCode = await colorCodeService.getColorCodeById(id);
    if (!colorCode) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'ColorCode not found',
        }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'ColorCode fetched successfully',
        data: colorCode
      }
    };
  } catch (err) {
    console.error('Get ColorCode error:', err.message);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Server error'
      }
    };
  }
}

export async function updateColorCode(id, data) {
  try {
    const cleanedFields = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) acc[key] = value;
      return acc;
    }, {});

    const { error, value } = colorCodeUpdateValidator.validate(cleanedFields);
    if (error) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Validation error',
          details: error.details
        }
      };
    }

    const updated = await colorCodeService.updateColorCode(id, value);
    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'ColorCode not found'
        }
      };
    }

    // Invalidate Redis cache
    await redis.del('allColorCodes');

    return {
      status: 200,
      body: {
        success: true,
        message: 'ColorCode updated successfully',
        data: updated
      }
    };
  } catch (err) {
    console.error('Update ColorCode error:', err.message);
    return {
      status: err.message.includes('already exists') ? 400 : 500,
      body: {
        success: false,
        message: err.message.includes('already exists') ? err.message : 'Server error'
      }
    };
  }
}

export async function deleteColorCode(id) {
  try {
    const deleted = await colorCodeService.deleteColorCode(id);
    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'ColorCode not found'
        }
      };
    }

    // Invalidate Redis cache
    await redis.del('allColorCodes');

    return {
      status: 200,
      body: {
        success: true,
        message: 'ColorCode deleted successfully',
        data: deleted
      }
    };
  } catch (err) {
    console.error('Delete ColorCode error:', err.message);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Server error'
      }
    };
  }
}
