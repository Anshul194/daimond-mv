import VendorService from '../services/vendorService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const vendorService = new VendorService();

export async function getAllVendors(query) {
  try {
    const vendors = await vendorService.getAllVendors(query);
    return {
      status: 200,
      body: successResponse(vendors, 'Vendors fetched successfully'),
    };
  } catch (err) {
    console.error('Get Vendors error:', err.message);
    return {
      status: 500,
      body: errorResponse('Server error', 500),
    };
  }
}
