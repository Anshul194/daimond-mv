import DeliveryOptionService from '../services/deliveryOptionService.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import initRedis from '../config/redis.js';
import { deliveryOptionCreateValidator, deliveryOptionUpdateValidator } from '../validators/deliveryOptionvalidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const deliveryOptionService = new DeliveryOptionService();
const redis = initRedis();

export async function createDeliveryOption(form) {
  try {
    let iconUrl = '';

    console.log('Create DeliveryOption form:', form);
    const title = form.get('title');
    const sub_title = form.get('sub_title') || '';
    const icon = form.get('icon'); // File object or string
   

    console.log('Icon:', icon);

    const existing = await deliveryOptionService.findByTitle(title);
    if (existing) {
      return {
        status: 400,
        body: errorResponse('Delivery option with this title already exists', 400),
      };
    }

    console.log('Icon type check:', icon instanceof File);

    if (icon && icon instanceof File) {
      try {
        validateImageFile(icon);
        console.log('Validating icon file:', icon);
        iconUrl = await saveFile(icon, 'delivery-icons');
        console.log('Icon saved at:', iconUrl);
      } catch (fileError) {
        return {
          status: 400,
          body: errorResponse('Icon upload error', 400, fileError.message),
        };
      }
    } else if (typeof icon === 'string' && icon.trim()) {
      // If icon is a string (URL or icon class), use it directly
      iconUrl = icon.trim();
    }

    const { error, value } = deliveryOptionCreateValidator.validate({
      title,
      sub_title,
      icon: iconUrl,
    });

    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const newDeliveryOption = await deliveryOptionService.createDeliveryOption(value);
    await redis.del('allDeliveryOptions');
    console.log('New DeliveryOption created:', newDeliveryOption);

    return {
      status: 201,
      body: successResponse(newDeliveryOption, 'Delivery option created'),
    };
  } catch (err) {
    console.error('Create DeliveryOption error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getDeliveryOptions(query) {
  try {
    console.log('Get DeliveryOptions query:', query);
    const result = await deliveryOptionService.getAllDeliveryOptions(query);

    return {
      status: 200,
      body: successResponse(result, 'Delivery options fetched successfully'),
    };
  } catch (err) {
    console.error('Get DeliveryOptions error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}

export async function getDeliveryOptionById(id) {
  try {
    const deliveryOption = await deliveryOptionService.getDeliveryOptionById(id);
    if (!deliveryOption) {
      return {
        status: 404,
        body: { success: false, message: 'Delivery option not found' }
      };
    }
    return {
      status: 200,
      body: { success: true, message: 'Delivery option fetched', data: deliveryOption }
    };
  } catch (err) {
    console.error('Get DeliveryOption error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function updateDeliveryOption(id, data) {
  try {
    let iconUrl = '';
    const { icon, ...fields } = data;

    // Get existing delivery option to preserve current icon if needed
    const existingDeliveryOption = await deliveryOptionService.getDeliveryOptionById(id);
    if (!existingDeliveryOption) {
      return {
        status: 404,
        body: { success: false, message: 'Delivery option not found' }
      };
    }

    if (icon && icon instanceof File) {
      try {
        validateImageFile(icon);
        iconUrl = await saveFile(icon, 'delivery-icons');
      } catch (fileError) {
        return {
          status: 400,
          body: { success: false, message: 'Icon upload error', details: fileError.message }
        };
      }
    } else if (typeof icon === 'string' && icon.trim()) {
      // If icon is a string (URL or icon class), use it directly
      iconUrl = icon.trim();
    } else {
      // No new icon provided, keep existing icon
      iconUrl = existingDeliveryOption.icon;
    }

    const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
      if (value !== '') acc[key] = value;
      return acc;
    }, {});

    const payload = { ...cleanedFields, icon: iconUrl };

    const { error, value } = deliveryOptionUpdateValidator.validate(payload);
    if (error) {
      return {
        status: 400,
        body: { success: false, message: 'Validation error', details: error.details }
      };
    }

    // Check for duplicate title
    if (value.title) {
      const existing = await deliveryOptionService.findByTitle(value.title);
      if (existing && existing._id.toString() !== id) {
        return {
          status: 400,
          body: { success: false, message: 'Delivery option with this title already exists' }
        };
      }
    }

    const updated = await deliveryOptionService.updateDeliveryOption(id, value);
    if (!updated) {
      return {
        status: 404,
        body: { success: false, message: 'Delivery option not found' }
      };
    }

    // Invalidate cache
    await redis.del('allDeliveryOptions');

    return {
      status: 200,
      body: { success: true, message: 'Delivery option updated', data: updated }
    };
  } catch (err) {
    console.error('Update DeliveryOption error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}

export async function deleteDeliveryOption(id) {
  try {
    const deleted = await deliveryOptionService.deleteDeliveryOption(id);
    if (!deleted) {
      return {
        status: 404,
        body: { success: false, message: 'Delivery option not found' }
      };
    }

    // Invalidate cache
    await redis.del('allDeliveryOptions');

    return {
      status: 200,
      body: { success: true, message: 'Delivery option deleted', data: deleted }
    };
  } catch (err) {
    console.error('Delete DeliveryOption error:', err.message);
    return {
      status: 500,
      body: { success: false, message: 'Server error' }
    };
  }
}