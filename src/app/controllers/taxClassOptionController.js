import TaxClassOptionService from '../services/taxClassOptionService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import mongoose from 'mongoose';

const taxClassOptionService = new TaxClassOptionService();

// Create Tax Class Option
export async function createTaxClassOption(data, user = null) {
  try {
    // Validate required fields
    const requiredFields = ['class_id', 'tax_name', 'priority', 'rate'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        status: 400,
        body: errorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400).body
      };
    }

    // Validate data types
    if (typeof data.priority !== 'number' || data.priority < 0) {
      return {
        status: 400,
        body: errorResponse('Priority must be a non-negative number', 400).body
      };
    }

    if (typeof data.rate !== 'number' || data.rate < 0) {
      return {
        status: 400,
        body: errorResponse('Rate must be a non-negative number', 400).body
      };
    }

    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    // Add vendor to data if vendorId exists
    if (vendorId) {
      data.vendor = vendorId;
    }

    const savedOption = await taxClassOptionService.createTaxClassOption(data);

    return {
      status: 201,
      body: successResponse(savedOption, 'Tax class option created successfully', 201).body
    };
  } catch (error) {
    console.error('Create tax class option error:', error);
    return {
      status: error.statusCode || 500,
      body: errorResponse(error.message || 'Failed to create tax class option', error.statusCode || 500).body
    };
  }
}

// Get All Tax Class Options
export async function getTaxClassOptions(query, user = null) {
  try {
    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    const result = await taxClassOptionService.getAllTaxClassOptions(query, vendorId);

    return {
      status: 200,
      body: successResponse({
        data: result.result,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.totalDocuments,
          itemsPerPage: parseInt(query.limit) || 10,
        },
      }, 'Tax class options retrieved successfully', 200).body
    };
  } catch (error) {
    console.error('Get tax class options error:', error);
    return {
      status: error.statusCode || 500,
      body: errorResponse(error.message || 'Failed to fetch tax class options', error.statusCode || 500).body
    };
  }
}


// Get Tax Class Option by ID
export async function getTaxClassOptionById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: 400,
        body: errorResponse('Invalid tax class option ID', 400).body
      };
    }

    const taxClassOption = await taxClassOptionService.getTaxClassOptionById(id);

    return {
      status: 200,
      body: successResponse(taxClassOption, 'Tax class option retrieved successfully', 200).body
    };
  } catch (error) {
    console.error('Get tax class option by ID error:', error);
    return {
      status: error.statusCode || 500,
      body: errorResponse(error.message || 'Failed to fetch tax class option', error.statusCode || 500).body
    };
  }
}

// Update Tax Class Option
export async function updateTaxClassOption(id, data, user = null) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: 400,
        body: errorResponse('Invalid tax class option ID', 400).body
      };
    }

    // Validate data types if provided
    if (data.priority !== undefined && (typeof data.priority !== 'number' || data.priority < 0)) {
      return {
        status: 400,
        body: errorResponse('Priority must be a non-negative number', 400).body
      };
    }

    if (data.rate !== undefined && (typeof data.rate !== 'number' || data.rate < 0)) {
      return {
        status: 400,
        body: errorResponse('Rate must be a non-negative number', 400).body
      };
    }

    // Check if tax class option exists and belongs to vendor (if user is vendor)
    const existingOption = await taxClassOptionService.getTaxClassOptionById(id);
    if (!existingOption) {
      return {
        status: 404,
        body: errorResponse('Tax class option not found', 404).body
      };
    }

    // If user is a vendor, check if tax class option belongs to them
    if (user && user.role === 'vendor') {
      const vendorId = (user._id || user.id).toString();
      if (existingOption.vendor && existingOption.vendor.toString() !== vendorId) {
        return {
          status: 403,
          body: errorResponse('Unauthorized access', 403).body
        };
      }
    }

    const taxClassOption = await taxClassOptionService.updateTaxClassOption(id, data);

    return {
      status: 200,
      body: successResponse(taxClassOption, 'Tax class option updated successfully', 200).body
    };
  } catch (error) {
    console.error('Update tax class option error:', error);
    return {
      status: error.statusCode || 500,
      body: errorResponse(error.message || 'Failed to update tax class option', error.statusCode || 500).body
    };
  }
}

// Delete Tax Class Option
export async function deleteTaxClassOption(id, user = null) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: 400,
        body: errorResponse('Invalid tax class option ID', 400).body
      };
    }

    // Check if tax class option exists and belongs to vendor (if user is vendor)
    const existingOption = await taxClassOptionService.getTaxClassOptionById(id);
    if (!existingOption) {
      return {
        status: 404,
        body: errorResponse('Tax class option not found', 404).body
      };
    }

    // If user is a vendor, check if tax class option belongs to them
    if (user && user.role === 'vendor') {
      const vendorId = (user._id || user.id).toString();
      if (existingOption.vendor && existingOption.vendor.toString() !== vendorId) {
        return {
          status: 403,
          body: errorResponse('Unauthorized access', 403).body
        };
      }
    }

    await taxClassOptionService.deleteTaxClassOption(id);

    return {
      status: 200,
      body: successResponse(null, 'Tax class option deleted successfully', 200).body
    };
  } catch (error) {
    console.error('Delete tax class option error:', error);
    return {
      status: error.statusCode || 500,
      body: errorResponse(error.message || 'Failed to delete tax class option', error.statusCode || 500).body
    };
  }
}

// Get Tax Class Options by Class ID
export async function getTaxClassOptionsByClassId(classId, user = null) {
  try {
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return {
        status: 400,
        body: errorResponse('Invalid class ID', 400).body
      };
    }

    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    const result = await taxClassOptionService.getTaxClassOptionsByClassId(classId, vendorId);

    return {
      status: 200,
      body: successResponse(result, 'Tax class options retrieved successfully', 200).body
    };
  } catch (error) {
    console.error('Get tax class options by class ID error:', error);
    return {
      status: error.statusCode || 500,
      body: errorResponse(error.message || 'Failed to fetch tax class options', error.statusCode || 500).body
    };
  }
}
