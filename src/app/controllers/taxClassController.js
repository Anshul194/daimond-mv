import TaxClassService from '../services/taxClassService.js';
import initRedis from '../config/redis.js';
import { successResponse, errorResponse } from '../utils/response.js';

const taxClassService = new TaxClassService();
const redis = initRedis();

export async function createTaxClass(data, user = null) {
  try {
    const { name } = data;
    
    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    // Check if tax class with same name already exists for this vendor
    const exists = await taxClassService.findByName(name, vendorId);
    if (exists) {
      return { 
        status: 400, 
        body: errorResponse('Tax class with this name already exists', 400) 
      };
    }

    // Add vendor to data if vendorId exists
    if (vendorId) {
      data.vendor = vendorId;
    }

    const created = await taxClassService.createTaxClass(data);
    await redis.del('allTaxClasses');

    return { 
      status: 201, 
      body: successResponse(created, 'Tax class created') 
    };
  } catch (err) {
    console.error('Create TaxClass error:', err.message);
    return { 
      status: 500, 
      body: errorResponse('Server error', 500) 
    };
  }
}

export async function getTaxClasses(query, user = null) {
  try {
    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    const data = await taxClassService.getAllTaxClasses(query, vendorId);
    return { 
      status: 200, 
      body: successResponse(data, 'Tax classes fetched') 
    };
  } catch (err) {
    console.error('Get TaxClasses error:', err.message);
    return { 
      status: 500, 
      body: errorResponse('Server error', 500) 
    };
  }
}

export async function getTaxClassById(id) {
  try {
    const data = await taxClassService.getTaxClassById(id);
    if (!data) return { 
      status: 404, 
      body: errorResponse('Tax class not found', 404) 
    };
    return { 
      status: 200, 
      body: successResponse(data, 'Tax class fetched') 
    };
  } catch (err) {
    console.error('Get TaxClass error:', err.message);
    return { 
      status: 500, 
      body: errorResponse('Server error', 500) 
    };
  }
}

export async function updateTaxClass(id, data, user = null) {
  try {
    // Check if tax class exists and belongs to vendor (if user is vendor)
    const existingTaxClass = await taxClassService.getTaxClassById(id);
    if (!existingTaxClass) {
      return { 
        status: 404, 
        body: errorResponse('Tax class not found', 404) 
      };
    }

    // If user is a vendor, check if tax class belongs to them
    if (user && user.role === 'vendor') {
      const vendorId = (user._id || user.id).toString();
      if (existingTaxClass.vendor && existingTaxClass.vendor.toString() !== vendorId) {
        return { 
          status: 403, 
          body: errorResponse('Unauthorized access', 403) 
        };
      }
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );

    const updated = await taxClassService.updateTaxClass(id, cleanData);
    if (!updated) return { 
      status: 404, 
      body: errorResponse('Tax class not found', 404) 
    };

    await redis.del('allTaxClasses');
    return { 
      status: 200, 
      body: successResponse(updated, 'Tax class updated') 
    };
  } catch (err) {
    console.error('Update TaxClass error:', err.message);
    return { 
      status: 500, 
      body: errorResponse('Server error', 500) 
    };
  }
}

export async function deleteTaxClass(id, user = null) {
  try {
    // Check if tax class exists and belongs to vendor (if user is vendor)
    const existingTaxClass = await taxClassService.getTaxClassById(id);
    if (!existingTaxClass) {
      return { 
        status: 404, 
        body: errorResponse('Tax class not found', 404) 
      };
    }

    // If user is a vendor, check if tax class belongs to them
    if (user && user.role === 'vendor') {
      const vendorId = (user._id || user.id).toString();
      if (existingTaxClass.vendor && existingTaxClass.vendor.toString() !== vendorId) {
        return { 
          status: 403, 
          body: errorResponse('Unauthorized access', 403) 
        };
      }
    }

    const deleted = await taxClassService.softDelete(id);
    if (!deleted) return { 
      status: 404, 
      body: errorResponse('Tax class not found', 404) 
    };

    await redis.del('allTaxClasses');
    return { 
      status: 200, 
      body: successResponse(deleted, 'Tax class deleted') 
    };
  } catch (err) {
    console.error('Delete TaxClass error:', err.message);
    return { 
      status: 500, 
      body: errorResponse('Server error', 500) 
    };
  }
}

export async function getActiveTaxClassWithOptions(user = null) {
  try {
    let vendorId = null;
    if (user && user.role === 'vendor') {
      vendorId = (user._id || user.id).toString();
    }

    const activeTaxClasses = await taxClassService.getActiveTaxClassesWithOptions(vendorId);
    return { 
      status: 200, 
      body: successResponse(activeTaxClasses, 'Active tax classes with options fetched') 
    };
  } catch (err) {
    console.error('Get Active TaxClasses with Options error:', err);
    return { 
      status: 500, 
      body: errorResponse(err.message || 'Server error', 500) 
    };
  }
}
