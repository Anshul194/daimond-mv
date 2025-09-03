import TaxClass from '../models/TaxClass.js';
import TaxClassOption from '../models/TaxClassOption.js';
import Country from '../models/country.js';
import State from '../models/state.js';
import City from '../models/city.js';

import { successResponse, errorResponse } from '../utils/response.js';
import mongoose from 'mongoose';

// Create Tax Class Option
export async function createTaxClassOption(data) {
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

    // Validate if tax class exists
    const taxClass = await TaxClass.findOne({ _id: data.class_id, deleted_at: null });
    if (!taxClass) {
      return {
        status: 400,
        body: errorResponse('Tax class not found or has been deleted', 400).body
      };
    }

    const taxClassOption = new TaxClassOption({
      class_id: data.class_id,
      tax_name: data.tax_name,
      country_id: data.country_id || null,
      state_id: data.state_id || null,
      city_id: data.city_id || null,
      postal_code: data.postal_code || null,
      priority: data.priority,
      is_compound: data.is_compound || false,
      is_shipping: data.is_shipping || false,
      rate: data.rate,
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedOption = await taxClassOption.save();

    return {
      status: 201,
      body: successResponse(savedOption, 'Tax class option created successfully', 201).body
    };
  } catch (error) {
    console.error('Create tax class option error:', error);
    return {
      status: 500,
      body: errorResponse('Failed to create tax class option', 500).body
    };
  }
}

// Get All Tax Class Options
export async function getTaxClassOptions(query) {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Basic filters
    if (query.class_id && mongoose.Types.ObjectId.isValid(query.class_id)) {
      filter.class_id = query.class_id;
    }
    if (query.country_id && mongoose.Types.ObjectId.isValid(query.country_id)) {
      filter.country_id = query.country_id;
    }
    if (query.state_id && mongoose.Types.ObjectId.isValid(query.state_id)) {
      filter.state_id = query.state_id;
    }
    if (query.city_id && mongoose.Types.ObjectId.isValid(query.city_id)) {
      filter.city_id = query.city_id;
    }

    if (query.is_shipping !== undefined) {
      filter.is_shipping = query.is_shipping === 'true';
    }

    if (query.is_compound !== undefined) {
      filter.is_compound = query.is_compound === 'true';
    }

    // Search (by tax_name or postal_code)
    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { tax_name: { $regex: searchRegex } },
        { postal_code: { $regex: searchRegex } }
      ];
    }

    const [taxClassOptions, total] = await Promise.all([
      TaxClassOption.find(filter)
        .populate('class_id', 'name')
        .populate('country_id', 'name')
        .populate('state_id', 'name')
        .populate('city_id', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ priority: 1, created_at: -1 }),
      TaxClassOption.countDocuments(filter),
    ]);

    return {
      status: 200,
      body: successResponse({
        data: taxClassOptions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      }, 'Tax class options retrieved successfully', 200).body
    };
  } catch (error) {
    console.error('Get tax class options error:', error);
    return {
      status: 500,
      body: errorResponse('Failed to fetch tax class options', 500).body
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

    const taxClassOption = await TaxClassOption.findById(id)
      .populate('class_id', 'name')
      .populate('country_id', 'name')
      .populate('state_id', 'name')
      .populate('city_id', 'name');
    
    if (!taxClassOption) {
      return {
        status: 404,
        body: errorResponse('Tax class option not found', 404).body
      };
    }

    return {
      status: 200,
      body: successResponse(taxClassOption, 'Tax class option retrieved successfully', 200).body
    };
  } catch (error) {
    console.error('Get tax class option by ID error:', error);
    return {
      status: 500,
      body: errorResponse('Failed to fetch tax class option', 500).body
    };
  }
}

// Update Tax Class Option
export async function updateTaxClassOption(id, data) {
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

    // If class_id is being updated, validate it exists
    if (data.class_id) {
      const taxClass = await TaxClass.findOne({ _id: data.class_id, deleted_at: null });
      if (!taxClass) {
        return {
          status: 400,
          body: errorResponse('Tax class not found or has been deleted', 400).body
        };
      }
    }

    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const taxClassOption = await TaxClassOption.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('class_id', 'name')
      .populate('country_id', 'name')
      .populate('state_id', 'name')
      .populate('city_id', 'name');

    if (!taxClassOption) {
      return {
        status: 404,
        body: errorResponse('Tax class option not found', 404).body
      };
    }

    return {
      status: 200,
      body: successResponse(taxClassOption, 'Tax class option updated successfully', 200).body
    };
  } catch (error) {
    console.error('Update tax class option error:', error);
    return {
      status: 500,
      body: errorResponse('Failed to update tax class option', 500).body
    };
  }
}

// Delete Tax Class Option
export async function deleteTaxClassOption(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: 400,
        body: errorResponse('Invalid tax class option ID', 400).body
      };
    }

    const taxClassOption = await TaxClassOption.findByIdAndDelete(id);

    if (!taxClassOption) {
      return {
        status: 404,
        body: errorResponse('Tax class option not found', 404).body
      };
    }

    return {
      status: 200,
      body: successResponse(null, 'Tax class option deleted successfully', 200).body
    };
  } catch (error) {
    console.error('Delete tax class option error:', error);
    return {
      status: 500,
      body: errorResponse('Failed to delete tax class option', 500).body
    };
  }
}

// Get Tax Class Options by Class ID
export async function getTaxClassOptionsByClassId(classId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return {
        status: 400,
        body: errorResponse('Invalid class ID', 400).body
      };
    }

    // Validate if tax class exists
    const taxClass = await TaxClass.findOne({ _id: classId, deleted_at: null });
    if (!taxClass) {
      return {
        status: 404,
        body: errorResponse('Tax class not found', 404).body
      };
    }

    const options = await TaxClassOption.find({ class_id: classId })
      .populate('country_id', 'name')
      .populate('state_id', 'name')
      .populate('city_id', 'name')
      .sort({ priority: 1, created_at: -1 });

    return {
      status: 200,
      body: successResponse({
        tax_class: taxClass,
        options: options
      }, 'Tax class options retrieved successfully', 200).body
    };
  } catch (error) {
    console.error('Get tax class options by class ID error:', error);
    return {
      status: 500,
      body: errorResponse('Failed to fetch tax class options', 500).body
    };
  }
}
